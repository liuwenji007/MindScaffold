# 阿窝睡了 — 后端架构规划

## 项目理解

**阿窝睡了** 是深夜情绪疗愈陪伴 App，用户流程：
首页(记录情绪) → 拆解(4道题) → 镜像(情绪重述) → 对话(和AI阿窝聊天) → 行动(选微小事) → 历史/生命之树(分享叶片)

**当前状态**：纯前端，IndexedDB 本地存储，AI 回复全是 hardcoded 假数据。

**目标**：开发完整后端，支撑 AI 对话 + 用户系统 + 社交 + 商店。

## 技术选型

| 维度 | 选择 | 理由 |
|------|------|------|
| 语言/框架 | **Go + Gin** | 高性能、低资源、部署简单、鸿蒙生态友好 |
| 数据库 | **PostgreSQL** | 关系型主库，JSONB 支持灵活字段，全文搜索 |
| 缓存 | **Redis** | Session、限流、排行榜、在线状态 |
| AI 引擎 | **OpenAI 兼容 API**（DeepSeek / Qwen） | 成本可控，中文能力强 |
| 对象存储 | **MinIO / 阿里云 OSS** | 叶片内容（可选图片）、用户头像 |
| 部署 | **Docker Compose** 单机起步 | 简单可靠，后续可迁 K8s |
| API 协议 | **RESTful + Server-Sent Events (SSE)** | REST 用于 CRUD，SSE 用于 AI 流式对话 |

## 架构总览

```
┌──────────────────────────────────────┐
│            前端 (Taro)               │
│   localStorage token → 所有请求带 JWT │
└──────────────┬───────────────────────┘
               │ HTTPS
┌──────────────▼───────────────────────┐
│         Nginx 反向代理                │
│   /api/* → Go 服务 :8080              │
│   SSE 长连接透传                      │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│          Go 后端 (Gin)                │
│  ┌─────────┬─────────┬─────────┐     │
│  │ Auth    │ Card    │ Tree    │     │
│  │ Module  │ Module  │ Module  │     │
│  ├─────────┼─────────┼─────────┤     │
│  │ Chat    │ Store   │ Admin   │     │
│  │ Module  │ Module  │ Module  │     │
│  └─────────┴─────────┴─────────┘     │
│          Middleware Layer             │
│   JWT | Logger | RateLimit | CORS     │
└──────┬──────────┬──────────┬─────────┘
       │          │          │
┌──────▼──┐ ┌────▼───┐ ┌───▼────────┐
│PostgreSQL│ │ Redis  │ │ LLM API    │
│ 主数据库  │ │ 缓存   │ │(DeepSeek)  │
└──────────┘ └────────┘ └────────────┘
```

## 数据库 Schema

### users
```sql
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nickname    VARCHAR(64) NOT NULL,
    avatar_url  TEXT,
    openid      VARCHAR(128) UNIQUE,        -- 微信/鸿蒙账号 openid
    platform    VARCHAR(16) DEFAULT 'harmony', -- harmony/h5/weapp/android/ios
    created_at  TIMESTAMPTZ DEFAULT now(),
    updated_at  TIMESTAMPTZ DEFAULT now()
);
```

### emotion_cards
```sql
CREATE TABLE emotion_cards (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    intensity       SMALLINT NOT NULL CHECK (intensity BETWEEN 1 AND 10),
    input_text      TEXT NOT NULL DEFAULT '',
    mirror_text     TEXT NOT NULL DEFAULT '',
    emotion         VARCHAR(32),
    action_text     VARCHAR(256),
    action_duration VARCHAR(32),
    status          VARCHAR(16) DEFAULT 'pending',  -- pending/completed/letgo
    deconstruction  JSONB DEFAULT '{}',
    chat_history    JSONB DEFAULT '[]',
    created_at      TIMESTAMPTZ DEFAULT now(),
    updated_at      TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_cards_user_status ON emotion_cards(user_id, status);
CREATE INDEX idx_cards_created ON emotion_cards(user_id, created_at DESC);
```

### leaves (生命之树叶片 = 公开分享的 cards)
```sql
CREATE TABLE leaves (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    card_id     UUID NOT NULL REFERENCES emotion_cards(id) UNIQUE,
    user_id     UUID NOT NULL REFERENCES users(id),
    story       TEXT NOT NULL,
    feedback    TEXT DEFAULT '',
    likes_count INT DEFAULT 0,
    is_active   BOOLEAN DEFAULT true,
    expires_at  TIMESTAMPTZ NOT NULL,       -- 24h 后过期
    created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_leaves_active ON leaves(is_active, expires_at);
CREATE INDEX idx_leaves_likes ON leaves(likes_count DESC);
```

### leaf_likes (施肥记录)
```sql
CREATE TABLE leaf_likes (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    leaf_id   UUID NOT NULL REFERENCES leaves(id),
    user_id   UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(leaf_id, user_id)   -- 每人每叶只能施一次肥
);
```

### shop_items
```sql
CREATE TABLE shop_items (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(128) NOT NULL,
    description TEXT,
    price       INT NOT NULL,              -- 情绪点价格
    item_type   VARCHAR(32) DEFAULT 'skin', -- skin/theme/icon
    asset_url   TEXT,
    is_active   BOOLEAN DEFAULT true
);
```

### user_purchases
```sql
CREATE TABLE user_purchases (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id   UUID NOT NULL REFERENCES users(id),
    item_id   UUID NOT NULL REFERENCES shop_items(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, item_id)
);
```

### user_points
```sql
CREATE TABLE user_points (
    user_id  UUID PRIMARY KEY REFERENCES users(id),
    balance  INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT now()
);
```

### point_transactions
```sql
CREATE TABLE point_transactions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id),
    amount      INT NOT NULL,
    reason      VARCHAR(64) NOT NULL,      -- daily_checkin / card_created / purchase / leaf_liked
    ref_id      UUID,                      -- 关联的 card_id / purchase_id
    created_at  TIMESTAMPTZ DEFAULT now()
);
```

## API 设计

### Auth 模块
| Method | Path | 说明 |
|--------|------|------|
| POST | /api/v1/auth/login | 鸿蒙/微信一键登录（openid + platform） |
| POST | /api/v1/auth/refresh | 刷新 JWT |
| GET | /api/v1/auth/me | 获取当前用户信息 |

### Card 模块
| Method | Path | 说明 |
|--------|------|------|
| GET | /api/v1/cards | 获取我的情绪卡片列表（分页, filter by status） |
| GET | /api/v1/cards/:id | 获取单张卡片详情 |
| POST | /api/v1/cards | 创建情绪卡片 |
| PATCH | /api/v1/cards/:id | 更新卡片（状态、对话历史等） |
| DELETE | /api/v1/cards/:id | 删除卡片 |

### Chat 模块 (SSE 流式)
| Method | Path | 说明 |
|--------|------|------|
| POST | /api/v1/chat/stream | SSE 流式 AI 对话 |

请求体：
```json
{
  "card_id": "uuid (可选, 续接历史)",
  "messages": [
    { "role": "user", "content": "今天工作压力好大" }
  ]
}
```

### Mirror 模块
| Method | Path | 说明 |
|--------|------|------|
| POST | /api/v1/mirror | 生成情绪镜像重述 |

请求体：
```json
{
  "input_text": "今天觉得很累很迷茫",
  "intensity": 7,
  "deconstruction": { "emotion": "焦虑", "body": ["胸口闷"] }
}
```

返回 SSE 流或 JSON（非流式）。

### Tree 模块
| Method | Path | 说明 |
|--------|------|------|
| GET | /api/v1/leaves | 获取生命之树叶片列表（分页，按点赞排序或随机） |
| GET | /api/v1/leaves/:id | 获取叶片详情 |
| POST | /api/v1/leaves | 将卡片分享为叶片 |
| POST | /api/v1/leaves/:id/like | 施肥（点赞） |
| DELETE | /api/v1/leaves/:id/like | 取消施肥 |

### Store 模块
| Method | Path | 说明 |
|--------|------|------|
| GET | /api/v1/store/items | 获取商店商品列表 |
| POST | /api/v1/store/purchase | 购买商品 |
| GET | /api/v1/store/my-items | 我拥有的商品 |

### Points 模块
| Method | Path | 说明 |
|--------|------|------|
| GET | /api/v1/points | 获取我的情绪点余额和交易记录 |
| POST | /api/v1/points/checkin | 每日签到（+5 点） |

### User 模块
| Method | Path | 说明 |
|--------|------|------|
| GET | /api/v1/users/:id/profile | 获取用户公开资料 |
| PATCH | /api/v1/users/me | 更新个人资料（昵称、头像） |

## AI 对话系统设计

### System Prompt（核心）
```
你是「阿窝」，一个温柔、包容的深夜情绪陪伴者。你的风格：
- 语气温暖柔软，像深夜在被窝里轻声说话的朋友
- 不做诊断、不贴标签、不给人生建议
- 用「镜像重述」技术：把用户说的感受用你自己的话温柔地复述回去
- 适当使用问句引导用户继续表达，但不追问
- 可以分享一些心理学里的小知识，但不说教
- 每次回复控制在 50-150 字，保持精炼温柔
- 禁止：任何自杀/自伤建议、医疗建议、政治话题
```

### 对话策略
1. **首轮**：镜像重述用户的情绪（来自 Mirror 模块的输出）+ 开放式问句
2. **中段**：共情 + 正常化感受 + 微行动引导
3. **收尾**：轻推用户选择今晚的小行动

### 成本控制
- 使用 DeepSeek-V3（¥1/百万 token，远低于 GPT-4）
- 每用户每日对话上限 30 轮
- 上下文窗口限制最近 20 条消息
- 非高峰期对话压缩（凌晨 2-6 点 Summary 模式）

## 项目目录结构

```
mindscaffold-server/
├── cmd/
│   └── server/
│       └── main.go              # 入口
├── internal/
│   ├── config/
│   │   └── config.go            # 配置（环境变量/yaml）
│   ├── handler/                 # HTTP 处理器
│   │   ├── auth.go
│   │   ├── card.go
│   │   ├── chat.go
│   │   ├── leaf.go
│   │   ├── mirror.go
│   │   ├── store.go
│   │   └── user.go
│   ├── middleware/
│   │   ├── auth.go              # JWT 验证
│   │   ├── ratelimit.go         # 限流
│   │   └── logger.go            # 请求日志
│   ├── model/                   # 数据模型
│   │   ├── user.go
│   │   ├── card.go
│   │   ├── leaf.go
│   │   └── store.go
│   ├── repository/              # 数据库操作层
│   │   ├── user_repo.go
│   │   ├── card_repo.go
│   │   ├── leaf_repo.go
│   │   └── store_repo.go
│   ├── service/                 # 业务逻辑层
│   │   ├── auth_service.go
│   │   ├── card_service.go
│   │   ├── chat_service.go
│   │   ├── leaf_service.go
│   │   ├── mirror_service.go
│   │   └── store_service.go
│   ├── llm/                     # AI 引擎封装
│   │   ├── client.go            # OpenAI 兼容客户端
│   │   ├── prompt.go            # System prompt 管理
│   │   └── stream.go            # SSE 流式输出
│   └── router/
│       └── router.go            # 路由注册
├── migrations/                  # 数据库迁移
│   ├── 001_initial.up.sql
│   └── 001_initial.down.sql
├── docker-compose.yml           # 本地开发环境
├── Dockerfile                   # 生产镜像
├── .env.example                 # 环境变量模板
├── go.mod
├── go.sum
└── Makefile                     # 开发命令
```

## 部署架构

```
开发环境: docker-compose up (Go + PostgreSQL + Redis)
生产环境: 单台 2C4G 云服务器 → 后续可迁 K8s
         ├── Nginx (SSL termination)
         ├── Go binary (systemd)
         ├── PostgreSQL (本地或云数据库)
         └── Redis (本地或云 Redis)
```

## 前端对接改动

新增文件：
```
src/
├── services/
│   └── api.ts               # 统一 API 客户端（替换 localStorage 直接读写）
│   └── auth.ts              # 登录/Token 管理
├── config/
│   └── api.ts               # API baseURL 配置
```

现有文件改动（最小化）：
- `storage.ts`：cards 相关读写改为调用后端 API，保留本地缓存
- `chat/index.tsx`：硬编码回复 → SSE 流式
- `mirror/index.tsx`：硬编码文案 → `/api/v1/mirror`
- `tree/index.tsx`：「同路旅伴」硬编码 → 真实后盾数据
- `store/index.tsx`：硬编码商品 → 后端数据
- `profile/index.tsx`：添加登录状态
- `app.tsx`：启动时检查登录态

## 实施计划

### Phase 1 — 骨架搭建（1 天）
> 用 Claude Code 生成项目骨架

1. 初始化 Go 项目：`go mod init` + Gin 依赖
2. 配置管理（config.go）+ 目录结构
3. Docker Compose（PostgreSQL + Redis）
4. 数据库迁移脚本

### Phase 2 — 核心模块（2 天）
> Claude Code 开发，分模块委托

5. Auth 模块（JWT 登录/注册）
6. Card CRUD 模块
7. Mirror 模块（LLM 调用）
8. Chat SSE 流式对话

### Phase 3 — 社交+商店（1-2 天）

9. Leaf 模块（叶片分享/施肥/排行榜）
10. Store + Points 模块
11. 限流中间件

### Phase 4 — 前端对接（2 天）

12. 前端 API 客户端
13. 登录流程
14. Chat/Mirror 接入真实后端
15. Tree 接入真实数据

### Phase 5 — 联调+部署（1 天）

16. 前后端联调
17. Docker 部署脚本
18. 鸿蒙 hybrid 测试

## 风险与对策

| 风险 | 对策 |
|------|------|
| LLM API 成本失控 | 每日每用户 30 轮上限 + DeepSeek 低价模型 |
| 鸿蒙账号体系未定型 | Auth 用 openid 抽象，支持多平台扩展 |
| 用户量增长到需要扩展 | Go gin 无状态 + PostgreSQL 读写分离即可撑到 10 万 DAU |
| 内容安全（叶片分享） | 敏感词过滤 + LLM 内容审核 + 人工举报机制 |

## 开放问题

1. **鸿蒙一键登录**：鸿蒙的账号体系 API 是否已稳定？是否用华为账号 openid？
2. **AI 模型选择**：DeepSeek-V3 vs Qwen-Max vs 其他？预算考虑？
3. **对象存储**：叶片是否需要支持图片？如果需要，用 MinIO 还是阿里云 OSS？
4. **内容审核**：是否需要接入第三方审核 API（如阿里云内容安全）？
