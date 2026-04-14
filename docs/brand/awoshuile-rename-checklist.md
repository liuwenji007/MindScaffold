# 阿窝睡了改名执行清单（配置层→展示层→存储层）

## 执行顺序

1. 配置层改名（构建与标题入口）
2. 展示层改名（页面文案与品牌露出）
3. 存储层兼容迁移（防止历史数据丢失）
4. 验证与回归

## 1) 配置层（先改）

- [ ] `config/index.ts`
  - `projectName` 改为 `awo-shuile`
- [ ] `package.json`
  - `name` 改为 `awo-shuile`（私有项目）
  - `description` 改为“阿窝睡了：睡前情绪整理与微行动工具”
- [ ] `src/app.config.ts`
  - 全局 `navigationBarTitleText` 改为“阿窝睡了”
- [ ] `src/pages/index/index.config.ts`
  - 页面 `navigationBarTitleText` 改为“阿窝睡了”
- [ ] `src/index.html`
  - `<title>` 改为“阿窝睡了 - 把乱糟糟的今天，交给阿窝”

## 2) 展示层（再改）

- [ ] `src/pages/index/index.tsx`
  - 首页标题替换为“阿窝睡了”
  - 副标题替换为睡前仪式叙事
- [ ] `src/pages/profile/index.tsx`
  - 品牌名、副标题、页脚品牌词统一替换
  - 反馈文案改为中性联系描述（避免未就绪域名）
- [ ] `src/types/emotion.ts`
  - 注释中的旧品牌名替换为“阿窝睡了”

## 3) 存储层（最后改）

- [ ] `src/services/storage.ts`
  - 卡片主 key 从 `mindscaffold_cards` 升级为 `awoshuile_cards`
  - 读操作回退旧 key；命中旧 key 后自动迁移到新 key
  - 设置项前缀从 `ms_` 升级为 `awo_`，保持回退与迁移
- [ ] `src/app.tsx`
  - 在应用启动时执行一次存储迁移（无感迁移）

## 4) 验证清单

- [ ] 进入首页，顶部标题与浏览器标签均显示“阿窝睡了”
- [ ] 打开历史页，旧版本数据仍可见（验证迁移成功）
- [ ] 修改设置后，旧设置键自动迁移到新前缀
- [ ] 清空数据后，新旧 key 均被清理
- [ ] 项目 `rg "MindScaffold|mindscaffold"` 仅保留必要历史说明（若有）

