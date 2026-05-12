# 项目结构模式识别

## 常见项目组织模式

### 1. 功能模块化（Feature-based）

**特征：**
- 按功能模块组织代码
- 每个模块包含完整的业务逻辑
- 模块之间相对独立

**目录结构示例：**

```
src/
├── features/
│   ├── user/
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   ├── order/
│   │   ├── components/
│   │   ├── services/
│   │   └── types/
│   └── product/
├── shared/
│   ├── components/
│   ├── utils/
│   └── constants/
└── app.tsx
```

**识别方法：**
- 查找 `features/`、`modules/`、`domains/` 等目录
- 检查模块内部是否包含完整的业务逻辑
- 验证模块之间的独立性

### 2. 分层架构（Layered）

**特征：**
- 按技术层次组织代码
- 清晰的层次划分（表现层、业务层、数据层）
- 层次之间单向依赖

**目录结构示例：**

```
src/
├── controllers/
├── services/
├── models/
├── repositories/
├── utils/
└── config/
```

**识别方法：**
- 查找 `controllers/`、`services/`、`models/` 等目录
- 检查层次划分是否清晰
- 验证依赖方向

### 3. MVC 模式（Model-View-Controller）

**特征：**
- 分离模型、视图和控制器
- 视图负责展示，控制器处理逻辑，模型管理数据

**目录结构示例：**

```
src/
├── models/
├── views/
├── controllers/
└── routes/
```

**识别方法：**
- 查找 `models/`、`views/`、`controllers/` 目录
- 检查职责分离是否清晰
- 验证 MVC 模式实现

### 4. 组件化（Component-based）

**特征：**
- 以组件为核心组织代码
- 组件包含样式、逻辑和测试
- 组件可复用

**目录结构示例：**

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.module.css
│   │   └── Button.test.tsx
│   └── Input/
├── pages/
├── services/
├── utils/
└── hooks/
```

**识别方法：**
- 查找 `components/` 目录
- 检查组件是否自包含（样式、逻辑、测试）
- 验证组件复用性

### 5. 领域驱动设计（DDD）

**特征：**
- 按业务领域组织代码
- 领域模型为核心
- 清晰的边界上下文

**目录结构示例：**

```
src/
├── domains/
│   ├── user/
│   │   ├── entities/
│   │   ├── value-objects/
│   │   ├── repositories/
│   │   └── services/
│   └── order/
└── shared/
```

**识别方法：**
- 查找 `domains/`、`entities/`、`value-objects/` 等目录
- 检查领域模型设计
- 验证边界上下文

## 文件命名规范识别

### 命名风格

**kebab-case（短横线分隔）：**
- 示例：`user-profile.tsx`、`order-service.ts`
- 常见于：配置文件、工具文件

**camelCase（驼峰命名）：**
- 示例：`userProfile.tsx`、`orderService.ts`
- 常见于：变量、函数、文件名（部分项目）

**PascalCase（大驼峰命名）：**
- 示例：`UserProfile.tsx`、`OrderService.ts`
- 常见于：组件、类、类型定义

**snake_case（下划线分隔）：**
- 示例：`user_profile.py`、`order_service.py`
- 常见于：Python 项目

### 识别方法

1. **分析现有文件命名**
   - 统计不同命名风格的使用频率
   - 识别主要命名模式
   - 注意特殊文件（如配置文件）的命名

2. **检查配置文件**
   - ESLint 配置可能包含命名规则
   - 项目文档可能说明命名规范

3. **分析代码示例**
   - 查看导入语句中的文件名
   - 检查组件、类的命名方式

## 目录组织模式

### 前端项目

**React 项目常见结构：**

```
src/
├── components/     # 通用组件
├── pages/         # 页面组件
├── hooks/         # 自定义 Hooks
├── services/      # API 服务
├── utils/         # 工具函数
├── types/         # 类型定义
├── store/         # 状态管理
└── styles/        # 样式文件
```

**Vue 项目常见结构：**

```
src/
├── components/    # 组件
├── views/         # 视图
├── router/        # 路由
├── store/         # 状态管理
├── api/           # API 接口
└── utils/         # 工具函数
```

### 后端项目

**Spring Boot 项目常见结构：**

```
src/main/java/
├── controller/   # 控制器
├── service/       # 业务服务
├── repository/    # 数据访问
├── model/         # 数据模型
├── dto/           # 数据传输对象
└── config/        # 配置类
```

**Node.js 项目常见结构：**

```
src/
├── routes/        # 路由
├── controllers/   # 控制器
├── services/     # 业务服务
├── models/        # 数据模型
├── middleware/    # 中间件
└── utils/         # 工具函数
```

## 配置文件位置

### 前端项目

**常见配置文件：**
- `.eslintrc.*` - 代码检查配置（根目录）
- `.prettierrc` - 代码格式化配置（根目录）
- `tsconfig.json` - TypeScript 配置（根目录）
- `vite.config.js` / `webpack.config.js` - 构建配置（根目录）
- `tailwind.config.js` - Tailwind CSS 配置（根目录）

### 后端项目

**常见配置文件：**
- `application.yml` / `application.properties` - Spring Boot 配置（`src/main/resources/`）
- `pom.xml` / `build.gradle` - Maven/Gradle 配置（根目录）
- `requirements.txt` - Python 依赖（根目录）
- `.env` - 环境变量（根目录或项目根目录）

## 识别策略

1. **分析根目录结构**
   - 查看顶层目录组织方式
   - 识别主要模块划分

2. **检查源代码目录**
   - 分析 `src/` 或 `app/` 目录结构
   - 识别代码组织模式

3. **读取配置文件**
   - 配置文件可能包含项目结构说明
   - 构建配置反映项目组织方式

4. **分析代码示例**
   - 查看导入路径模式
   - 检查文件组织逻辑

5. **参考项目文档**
   - README 可能说明项目结构
   - 文档可能包含架构说明

## 最佳实践

1. **多维度验证**：结合目录结构、文件命名、配置文件综合分析
2. **识别模式组合**：项目可能使用多种组织模式的组合
3. **处理非标准结构**：对于非标准结构，提取可识别的部分
4. **标注不确定项**：对于无法确定的部分，明确标注

