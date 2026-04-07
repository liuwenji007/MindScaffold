# template-analyzer

> 模板项目分析工具。分析模板项目或代码库的技术框架、代码规范、项目结构模式和代码要点，提取关键信息并整理成结构化格式，用于指导后续代码生成。适用于：从 GitLab 项目或本地路径分析模板项目的场景、需要提取代码标准和约定的场景、工作流中需要自动分析项目结构的场景。

# Template Analyzer

模板项目分析工具，帮助分析模板项目的技术框架、代码规范和项目结构，提取关键信息用于指导代码生成。

## 工作流程

模板分析遵循以下步骤：

1. **获取项目来源** - 从 GitLab 地址或本地路径获取项目
2. **项目结构分析** - 识别项目结构、技术栈、依赖关系
3. **代码规范提取** - 提取代码风格、命名规范、文件组织方式
4. **技术框架识别** - 识别使用的框架、库、工具链
5. **代码要点提取** - 提取关键代码模式、最佳实践、架构模式
6. **信息整理** - 将分析结果整理成结构化格式
7. **保存配置** - 保存到用户偏好文件供后续使用

## 快速开始

### 1. 接收项目来源

接收来自工作流或其他工具的输入：

- **GitLab 地址**：项目 URL 或项目 ID
- **本地路径**：相对项目根目录的路径
- **项目类型**：前端/后端/全栈（可选，用于优化分析）

### 2. 获取项目信息

根据来源选择相应的处理方式：

**GitLab 地址：**
- 使用 GitLab MCP 获取项目信息
- 读取项目文件结构和内容
- 提取项目元数据（README、配置文件等）

**本地路径：**
- 读取本地项目文件
- 分析项目目录结构
- 读取关键配置文件

详细处理指南见 [references/project-sources.md](references/project-sources.md)。

### 3. 项目结构分析

识别项目的组织结构和模式：

**分析维度：**
- 目录结构模式（MVC、模块化、功能导向等）
- 文件命名规范（kebab-case、camelCase、PascalCase 等）
- 配置文件位置和类型
- 依赖管理方式（package.json、requirements.txt、pom.xml 等）

**识别策略：**
- 分析根目录结构
- 识别常见的项目模板模式
- 分析配置文件类型和位置

详细分析方法见 [references/project-structure-patterns.md](references/project-structure-patterns.md)。

### 4. 技术框架识别

识别项目使用的技术栈：

**前端框架：**
- React、Vue、Angular 等
- UI 组件库（Ant Design、Element UI、Material-UI 等）
- 状态管理（Redux、Vuex、MobX 等）
- 构建工具（Webpack、Vite、Rollup 等）

**后端框架：**
- Spring Boot、Express、Django、Flask 等
- ORM 框架（Hibernate、Sequelize、SQLAlchemy 等）
- 数据库类型（MySQL、PostgreSQL、MongoDB 等）

**工具链：**
- 代码检查工具（ESLint、Prettier、Pylint 等）
- 测试框架（Jest、Mocha、Pytest 等）
- CI/CD 配置（GitHub Actions、GitLab CI、Jenkins 等）

详细识别方法见 [references/tech-stack-identification.md](references/tech-stack-identification.md)。

### 5. 代码规范提取

提取项目的代码规范和约定：

**代码风格：**
- 缩进方式（空格数、Tab）
- 引号风格（单引号、双引号）
- 行尾分号（使用/不使用）
- 代码格式化规则

**命名规范：**
- 变量命名（camelCase、snake_case、PascalCase）
- 函数命名（动词开头、命名模式）
- 文件命名（kebab-case、PascalCase）
- 常量命名（UPPER_SNAKE_CASE）

**组织规范：**
- 导入顺序
- 文件组织方式
- 注释风格
- 文档规范

详细提取方法见 [references/code-standards-extraction.md](references/code-standards-extraction.md)。

### 6. 代码要点提取

提取关键代码模式和最佳实践：

**架构模式：**
- 设计模式使用（MVC、MVVM、Repository 等）
- 组件/模块组织方式
- 数据流设计（单向数据流、双向绑定等）

**代码模式：**
- API 调用方式（REST、GraphQL、RPC）
- 错误处理模式
- 异步处理方式（Promise、async/await、Observable）
- 状态管理模式

**最佳实践：**
- 代码复用方式
- 性能优化技巧
- 安全实践
- 测试策略

### 7. 信息整理

将分析结果整理成结构化格式：

**输出内容：**
- 项目概述（名称、类型、描述）
- 技术栈清单
- 代码规范配置
- 项目结构说明
- 代码要点总结

**输出格式：**
- YAML 格式（用于保存到用户偏好文件）
- Markdown 格式（用于展示和文档）

详细格式规范见 [references/output-format.md](references/output-format.md)。

### 8. 保存配置

将分析结果保存到用户偏好文件：

**保存位置：**
- `{project-root}/_bmad/_cfg/user-preferences.yaml`

**保存内容：**
- 技术栈配置
- 代码规范配置
- 项目结构偏好
- 代码生成指导

保存格式见 [references/output-format.md](references/output-format.md)。

## 使用示例

### 示例 1：分析 GitLab 项目

**输入：**
```
GitLab 项目地址：https://gitlab.com/example/react-template
```

**处理流程：**
1. 使用 GitLab MCP 获取项目信息
2. 读取项目文件结构和关键文件
3. 分析技术栈（React + TypeScript + Ant Design）
4. 提取代码规范（ESLint + Prettier 配置）
5. 识别项目结构（功能模块化组织）
6. 整理并保存到用户偏好文件

### 示例 2：分析本地项目

**输入：**
```
本地路径：./templates/spring-boot-template
```

**处理流程：**
1. 读取本地项目文件
2. 分析技术栈（Spring Boot + MyBatis + MySQL）
3. 提取代码规范（Java 代码风格、包结构）
4. 识别项目结构（分层架构）
5. 整理并保存配置

## 错误处理

### 项目无法访问

**情况：** GitLab 项目无法访问或本地路径不存在

**处理：**
- 提示检查项目地址或路径
- 建议提供正确的项目信息
- 返回部分分析结果（如有）

### 项目结构不清晰

**情况：** 无法识别项目结构或技术栈

**处理：**
- 返回可识别的部分信息
- 标注不确定的部分
- 建议手动补充配置

### 配置文件缺失

**情况：** 缺少关键配置文件（package.json、pom.xml 等）

**处理：**
- 基于文件结构推断技术栈
- 使用默认代码规范
- 标注缺失的配置

## 输出格式

### YAML 格式（用户偏好文件）

```yaml
tech_stack:
  frontend:
    framework: React
    ui_library: Ant Design
    state_management: Redux
  backend:
    framework: Spring Boot
    orm: MyBatis
    database: MySQL

code_standards:
  style:
    indent: 2
    quotes: single
    semicolon: false
  naming:
    variables: camelCase
    functions: camelCase
    files: kebab-case
    constants: UPPER_SNAKE_CASE

project_structure:
  pattern: feature-based
  organization: modular
  config_location: root
```

详细格式规范见 [references/output-format.md](references/output-format.md)。

### Markdown 格式（分析报告）

```markdown
# 项目分析报告

## 技术栈
- 前端：React + TypeScript
- UI 库：Ant Design
- 状态管理：Redux

## 代码规范
- 缩进：2 空格
- 引号：单引号
- 命名：camelCase

## 项目结构
- 模式：功能模块化
- 组织：按功能划分目录
```

## 工具依赖

- **GitLab MCP**：用于从 GitLab 获取项目信息（如果使用 GitLab 输入）
- **文件读取工具**：用于读取本地项目文件

## 最佳实践

1. **明确项目类型**：提供项目类型信息有助于优化分析
2. **验证分析结果**：对提取的配置进行验证，确保准确性
3. **补充缺失信息**：对于无法自动识别的部分，建议手动补充
4. **定期更新**：项目结构变化时，重新分析以更新配置
5. **保存备份**：分析结果保存前，建议备份现有用户偏好文件

## Resources

### references/

- **project-sources.md** - 项目来源处理指南，包含 GitLab 和本地路径的处理方法
- **project-structure-patterns.md** - 项目结构模式识别，包含常见项目组织方式和识别方法
- **tech-stack-identification.md** - 技术栈识别方法，包含框架、库和工具的识别策略
- **code-standards-extraction.md** - 代码规范提取方法，包含代码风格、命名规范和组织规范的提取流程
- **output-format.md** - 输出格式规范，包含 YAML 和 Markdown 格式的详细说明

---

## 参考: tech-stack-identification.md

# 技术栈识别方法

## 前端框架识别

### React

**识别特征：**
- `package.json` 中包含 `react` 和 `react-dom`
- 存在 `src/` 目录，包含 `.jsx` 或 `.tsx` 文件
- 存在 `public/index.html`
- 导入语句包含 `import React from 'react'`

**配置文件：**
- `tsconfig.json`（TypeScript 项目）
- `jsconfig.json`（JavaScript 项目）
- `vite.config.js` 或 `webpack.config.js`

**版本识别：**
- 检查 `package.json` 中的 `react` 版本
- React 18+ 可能使用新的 API（如 `createRoot`）

### Vue

**识别特征：**
- `package.json` 中包含 `vue`
- 存在 `.vue` 单文件组件
- 存在 `src/main.js` 或 `src/main.ts`，包含 `createApp`
- 存在 `vue.config.js`

**版本识别：**
- Vue 2：`import Vue from 'vue'`
- Vue 3：`import { createApp } from 'vue'`

### Angular

**识别特征：**
- `package.json` 中包含 `@angular/core`
- 存在 `angular.json` 配置文件
- 使用 TypeScript 和装饰器语法
- 存在 `src/app/` 目录结构

## UI 组件库识别

### Ant Design

**识别特征：**
- `package.json` 中包含 `antd`
- 导入语句：`import { Button } from 'antd'`
- 存在 `antd` 相关的样式导入

### Element UI / Element Plus

**识别特征：**
- `package.json` 中包含 `element-ui` 或 `element-plus`
- 导入语句：`import { ElButton } from 'element-plus'`
- Vue 项目常用

### Material-UI (MUI)

**识别特征：**
- `package.json` 中包含 `@mui/material` 或 `@material-ui/core`
- 导入语句：`import { Button } from '@mui/material'`

### shadcn/ui

**识别特征：**
- 存在 `components/ui/` 目录
- 存在 `components.json` 配置文件
- 使用 Tailwind CSS
- 组件文件包含 `cn()` 工具函数

## 状态管理识别

### Redux

**识别特征：**
- `package.json` 中包含 `redux` 和 `react-redux`
- 存在 `store/` 目录
- 存在 `reducers/` 和 `actions/` 目录
- 使用 `useSelector` 和 `useDispatch` Hooks

### Vuex / Pinia

**识别特征：**
- `package.json` 中包含 `vuex` 或 `pinia`
- 存在 `store/` 目录
- Vue 项目常用

### Zustand

**识别特征：**
- `package.json` 中包含 `zustand`
- 使用 `create` 函数创建 store

### MobX

**识别特征：**
- `package.json` 中包含 `mobx` 和 `mobx-react`
- 使用装饰器或 `makeObservable`

## 构建工具识别

### Vite

**识别特征：**
- `package.json` 中包含 `vite`
- 存在 `vite.config.js` 或 `vite.config.ts`
- 开发脚本：`vite dev` 或 `vite`

### Webpack

**识别特征：**
- `package.json` 中包含 `webpack`
- 存在 `webpack.config.js`
- 存在 `webpack.config.prod.js` 等环境配置

### Create React App (CRA)

**识别特征：**
- `package.json` 中包含 `react-scripts`
- 隐藏了 Webpack 配置
- 使用 `eject` 后可查看配置

### Next.js

**识别特征：**
- `package.json` 中包含 `next`
- 存在 `next.config.js`
- 使用 `pages/` 或 `app/` 目录结构
- 支持服务端渲染

## 后端框架识别

### Spring Boot

**识别特征：**
- 存在 `pom.xml` 包含 `spring-boot-starter`
- 存在 `application.yml` 或 `application.properties`
- 包结构：`com.example.app`
- 主类包含 `@SpringBootApplication`

### Express (Node.js)

**识别特征：**
- `package.json` 中包含 `express`
- 存在 `app.js` 或 `server.js`
- 使用 `app.use()` 和 `app.get()` 等

### Django (Python)

**识别特征：**
- 存在 `manage.py`
- 存在 `settings.py`
- 目录结构包含 `apps/` 和 `templates/`

### Flask (Python)

**识别特征：**
- `requirements.txt` 包含 `flask`
- 存在 `app.py` 或 `application.py`
- 使用装饰器路由：`@app.route()`

## ORM 框架识别

### MyBatis

**识别特征：**
- `pom.xml` 包含 `mybatis-spring-boot-starter`
- 存在 `mapper/` 目录
- XML 映射文件或注解方式

### Hibernate / JPA

**识别特征：**
- `pom.xml` 包含 `spring-boot-starter-data-jpa`
- 实体类使用 `@Entity` 注解
- 存在 `repository/` 接口

### Sequelize (Node.js)

**识别特征：**
- `package.json` 包含 `sequelize`
- 存在 `models/` 目录
- 使用 `sequelize.define()` 或类定义

### SQLAlchemy (Python)

**识别特征：**
- `requirements.txt` 包含 `sqlalchemy`
- 使用 `db.Model` 或 `declarative_base()`

## 数据库识别

### MySQL

**识别特征：**
- 连接字符串包含 `mysql://`
- 配置文件中包含 `mysql` 驱动
- `pom.xml` 包含 `mysql-connector-java`

### PostgreSQL

**识别特征：**
- 连接字符串包含 `postgresql://`
- 配置文件中包含 `postgresql` 驱动

### MongoDB

**识别特征：**
- `package.json` 包含 `mongodb` 或 `mongoose`
- 连接字符串包含 `mongodb://`
- 使用文档模型而非关系模型

## 代码检查工具识别

### ESLint

**识别特征：**
- `package.json` 包含 `eslint`
- 存在 `.eslintrc.*` 配置文件
- 存在 `.eslintignore` 文件

### Prettier

**识别特征：**
- `package.json` 包含 `prettier`
- 存在 `.prettierrc` 或 `prettier.config.js`
- 存在 `.prettierignore` 文件

### Pylint (Python)

**识别特征：**
- `requirements.txt` 包含 `pylint`
- 存在 `.pylintrc` 配置文件

## 测试框架识别

### Jest

**识别特征：**
- `package.json` 包含 `jest`
- 测试文件以 `.test.js` 或 `.spec.js` 结尾
- 存在 `jest.config.js`

### Mocha

**识别特征：**
- `package.json` 包含 `mocha`
- 测试文件使用 `describe()` 和 `it()`

### Pytest (Python)

**识别特征：**
- `requirements.txt` 包含 `pytest`
- 测试文件以 `test_` 开头或 `_test.py` 结尾

## 识别策略

1. **检查依赖文件**
   - `package.json`（Node.js 项目）
   - `pom.xml`（Java Maven 项目）
   - `build.gradle`（Java Gradle 项目）
   - `requirements.txt`（Python 项目）
   - `go.mod`（Go 项目）

2. **分析配置文件**
   - 构建工具配置文件
   - 框架配置文件
   - 代码检查工具配置

3. **检查代码特征**
   - 导入语句模式
   - 代码语法特征
   - 文件扩展名

4. **分析目录结构**
   - 框架特定的目录结构
   - 约定优于配置的目录组织

5. **读取项目文档**
   - README 可能说明技术栈
   - 文档可能包含技术选型说明

## 最佳实践

1. **多源验证**：结合依赖文件、配置文件和代码特征综合判断
2. **版本识别**：尽可能识别框架版本，不同版本可能有不同特性
3. **工具链识别**：识别完整的工具链（构建、测试、代码检查等）
4. **标注不确定项**：对于无法确定的技术，明确标注

## 参考: project-structure-patterns.md

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

## 参考: project-sources.md

# 项目来源处理指南

## GitLab 项目

### 获取项目信息

使用 GitLab MCP 工具获取项目信息：

**步骤：**
1. 解析 GitLab URL 或项目 ID
2. 使用 `mcp_gitlab_get_file_contents` 获取项目根目录内容
3. 读取关键文件（README、配置文件等）
4. 分析项目结构

**GitLab MCP 工具：**
- `mcp_gitlab_get_file_contents` - 获取文件或目录内容
- `mcp_gitlab_list_commits` - 获取提交历史（可选，用于了解项目演进）
- `mcp_gitlab_get_project_events` - 获取项目活动（可选）

**关键文件读取：**
- `README.md` - 项目说明和文档
- `package.json` / `pom.xml` / `requirements.txt` - 依赖配置
- `.gitignore` - 忽略文件配置
- 配置文件（`.eslintrc`、`tsconfig.json`、`pom.xml` 等）

### 处理流程

1. **解析项目标识**
   - 从 URL 提取项目 ID 或路径
   - 验证项目可访问性

2. **读取项目结构**
   - 获取根目录文件列表
   - 识别项目类型（前端/后端/全栈）
   - 读取关键配置文件

3. **深度分析**
   - 读取源代码目录结构
   - 分析主要模块组织
   - 提取代码示例

### 错误处理

**项目无法访问：**
- 检查 URL 或项目 ID 是否正确
- 验证访问权限
- 提示用户提供正确的项目信息

**MCP 未配置：**
- 提示安装和配置 GitLab MCP
- 建议使用本地路径作为替代方案

## 本地路径

### 读取项目文件

从本地路径读取项目：

**步骤：**
1. 验证路径存在性
2. 读取项目根目录结构
3. 读取关键配置文件
4. 分析源代码目录

**关键文件读取：**
- 使用 `list_dir` 获取目录结构
- 使用 `read_file` 读取配置文件
- 使用 `glob_file_search` 查找特定类型文件

### 处理流程

1. **路径验证**
   - 检查路径是否存在
   - 验证是否为有效项目目录
   - 识别项目类型

2. **结构分析**
   - 读取根目录文件列表
   - 识别项目组织模式
   - 分析目录层级

3. **文件读取**
   - 读取配置文件
   - 读取源代码示例
   - 读取文档文件

### 错误处理

**路径不存在：**
- 提示检查路径是否正确
- 建议使用绝对路径
- 验证路径权限

**项目结构不清晰：**
- 基于可读文件推断项目类型
- 使用默认分析策略
- 标注不确定的部分

## 项目类型识别

### 前端项目

**识别特征：**
- 存在 `package.json` 且包含前端框架依赖
- 存在 `src/` 或 `app/` 目录
- 存在构建配置文件（`webpack.config.js`、`vite.config.js` 等）
- 存在 `public/` 或 `static/` 目录

**关键文件：**
- `package.json` - 依赖和脚本
- `tsconfig.json` / `jsconfig.json` - TypeScript/JavaScript 配置
- `.eslintrc.*` - 代码检查配置
- `vite.config.js` / `webpack.config.js` - 构建配置

### 后端项目

**识别特征：**
- 存在 `pom.xml`（Java Maven）
- 存在 `build.gradle`（Java Gradle）
- 存在 `requirements.txt`（Python）
- 存在 `go.mod`（Go）
- 存在 `package.json` 且包含后端框架（Express、Koa 等）

**关键文件：**
- `pom.xml` / `build.gradle` - Java 项目配置
- `requirements.txt` / `setup.py` - Python 项目配置
- `application.yml` / `application.properties` - Spring Boot 配置
- `Dockerfile` - 容器化配置

### 全栈项目

**识别特征：**
- 同时包含前端和后端目录
- 存在 `monorepo` 结构（如 `packages/`、`apps/`）
- 存在统一的项目配置文件

**关键文件：**
- 根目录的 `package.json` 或 `lerna.json`
- 前端和后端各自的配置文件
- 统一的构建和部署配置

## 最佳实践

1. **优先读取配置文件**：配置文件通常包含最准确的项目信息
2. **读取示例代码**：源代码示例有助于理解代码风格和模式
3. **分析目录结构**：目录组织方式反映项目架构
4. **验证分析结果**：对提取的信息进行交叉验证
5. **处理异常情况**：妥善处理项目结构不标准的情况

## 参考: output-format.md

# 输出格式规范

## YAML 格式（用户偏好文件）

模板分析结果应保存为 YAML 格式，用于后续代码生成时参考。

### 文件位置

```
{project-root}/_bmad/_cfg/user-preferences.yaml
```

### 数据结构

```yaml
# 项目分析结果
project_analysis:
  # 项目基本信息
  project_name: "项目名称"
  project_type: "frontend" | "backend" | "fullstack"
  analysis_date: "2024-01-01T00:00:00Z"
  source: "gitlab" | "local"
  source_path: "项目来源路径或 URL"

  # 技术栈
  tech_stack:
    frontend:
      framework: "React" | "Vue" | "Angular" | null
      version: "18.2.0"  # 版本号（可选）
      ui_library: "Ant Design" | "Element UI" | "Material-UI" | null
      state_management: "Redux" | "Vuex" | "Zustand" | null
      build_tool: "Vite" | "Webpack" | "Next.js" | null
      language: "TypeScript" | "JavaScript"
    
    backend:
      framework: "Spring Boot" | "Express" | "Django" | "Flask" | null
      version: "2.7.0"  # 版本号（可选）
      orm: "MyBatis" | "Hibernate" | "Sequelize" | "SQLAlchemy" | null
      database: "MySQL" | "PostgreSQL" | "MongoDB" | null
      language: "Java" | "Python" | "JavaScript" | "Go"
    
    tools:
      code_quality:
        - "ESLint"
        - "Prettier"
      testing:
        - "Jest"
        - "React Testing Library"
      ci_cd:
        - "GitHub Actions"
        - "GitLab CI"

  # 代码规范
  code_standards:
    style:
      indent: 2  # 缩进空格数
      indent_type: "spaces" | "tabs"
      quotes: "single" | "double"
      semicolon: true | false
      line_width: 100
      trailing_comma: "es5" | "all" | "none"
      end_of_line: "lf" | "crlf" | "cr"
    
    naming:
      variables: "camelCase" | "snake_case" | "PascalCase"
      functions: "camelCase" | "snake_case" | "PascalCase"
      files: "kebab-case" | "camelCase" | "PascalCase" | "snake_case"
      constants: "UPPER_SNAKE_CASE" | "PascalCase"
      classes: "PascalCase"
      components: "PascalCase" | "kebab-case"
    
    organization:
      import_order:
        - "external"  # 第三方库
        - "internal"  # 内部模块
        - "relative"  # 相对路径
      file_structure: "feature-based" | "layered" | "mvc" | "component-based" | "ddd"
      config_location: "root" | "src" | "config"
    
    comments:
      style: "jsdoc" | "standard" | "none"
      required: true | false

  # 项目结构
  project_structure:
    pattern: "feature-based" | "layered" | "mvc" | "component-based" | "ddd"
    organization: "modular" | "monolithic"
    directory_structure:
      src: "src/" | "app/" | "lib/"
      components: "components/" | "components/ui/"
      pages: "pages/" | "views/" | "routes/"
      services: "services/" | "api/" | "utils/"
      styles: "styles/" | "css/" | "scss/"
    config_location: "root" | "src" | "config"

  # 代码要点
  code_patterns:
    architecture:
      pattern: "MVC" | "MVVM" | "Repository" | "DDD" | null
      data_flow: "unidirectional" | "bidirectional" | null
    
    api:
      style: "REST" | "GraphQL" | "RPC" | null
      error_handling: "try-catch" | "promise-catch" | "error-boundary" | null
    
    async:
      pattern: "async-await" | "promise" | "observable" | null
    
    state_management:
      pattern: "redux" | "context" | "mobx" | "vuex" | null
    
    testing:
      strategy: "unit" | "integration" | "e2e" | "all"
      framework: "Jest" | "Mocha" | "Pytest" | null

  # 最佳实践
  best_practices:
    - "使用 TypeScript 进行类型检查"
    - "组件使用函数式组件和 Hooks"
    - "API 调用统一使用 service 层"
    - "错误处理使用统一错误边界"

  # 配置文件路径（用于参考）
  config_files:
    eslint: ".eslintrc.js"
    prettier: ".prettierrc"
    typescript: "tsconfig.json"
    package: "package.json"
```

### 字段说明

- **project_analysis**: 项目分析结果的根对象
- **project_name**: 项目名称（从 README 或 package.json 提取）
- **project_type**: 项目类型（frontend/backend/fullstack）
- **analysis_date**: 分析时间（ISO 8601 格式）
- **source**: 项目来源（gitlab/local）
- **source_path**: 项目来源路径或 URL
- **tech_stack**: 技术栈信息，按前端/后端/工具分类
- **code_standards**: 代码规范配置，包含风格、命名、组织、注释等
- **project_structure**: 项目结构信息，包含模式、组织方式、目录结构等
- **code_patterns**: 代码模式和架构模式
- **best_practices**: 最佳实践列表
- **config_files**: 配置文件路径，便于后续参考

### 保存方式

1. **新建文件**：如果用户偏好文件不存在，创建新文件
2. **合并更新**：如果文件已存在，合并更新相关字段
3. **备份原文件**：更新前备份原文件（可选，建议）

## Markdown 格式（分析报告）

用于展示给用户的分析报告，采用 Markdown 格式。

### 报告结构

```markdown
# 项目分析报告

## 项目信息

- **项目名称**: {project_name}
- **项目类型**: {project_type}
- **分析时间**: {analysis_date}
- **项目来源**: {source} - {source_path}

## 技术栈

### 前端技术栈

- **框架**: {frontend.framework} {version}
- **UI 组件库**: {frontend.ui_library}
- **状态管理**: {frontend.state_management}
- **构建工具**: {frontend.build_tool}
- **开发语言**: {frontend.language}

### 后端技术栈

- **框架**: {backend.framework} {version}
- **ORM 框架**: {backend.orm}
- **数据库**: {backend.database}
- **开发语言**: {backend.language}

### 工具链

- **代码质量**: {tools.code_quality}
- **测试框架**: {tools.testing}
- **CI/CD**: {tools.ci_cd}

## 代码规范

### 代码风格

- **缩进**: {style.indent} {style.indent_type}
- **引号**: {style.quotes}
- **分号**: {style.semicolon ? '使用' : '不使用'}
- **行宽**: {style.line_width}
- **尾随逗号**: {style.trailing_comma}

### 命名规范

- **变量**: {naming.variables}
- **函数**: {naming.functions}
- **文件**: {naming.files}
- **常量**: {naming.constants}
- **类**: {naming.classes}
- **组件**: {naming.components}

### 组织规范

- **导入顺序**: {organization.import_order}
- **文件结构**: {organization.file_structure}
- **配置位置**: {organization.config_location}

## 项目结构

- **组织模式**: {project_structure.pattern}
- **组织方式**: {project_structure.organization}
- **目录结构**:
  - 源代码: {directory_structure.src}
  - 组件: {directory_structure.components}
  - 页面: {directory_structure.pages}
  - 服务: {directory_structure.services}
  - 样式: {directory_structure.styles}

## 代码要点

### 架构模式

- **设计模式**: {code_patterns.architecture.pattern}
- **数据流**: {code_patterns.architecture.data_flow}

### API 设计

- **API 风格**: {code_patterns.api.style}
- **错误处理**: {code_patterns.api.error_handling}

### 异步处理

- **异步模式**: {code_patterns.async.pattern}

### 状态管理

- **状态管理模式**: {code_patterns.state_management.pattern}

## 最佳实践

{best_practices 列表}

## 配置文件

- ESLint: {config_files.eslint}
- Prettier: {config_files.prettier}
- TypeScript: {config_files.typescript}
- Package: {config_files.package}
```

## 输出策略

1. **YAML 格式优先**：主要用于保存配置，供后续代码生成使用
2. **Markdown 格式辅助**：用于展示给用户，便于理解和验证
3. **字段完整性**：尽可能填充所有字段，缺失的字段使用 `null` 或标注
4. **格式验证**：确保 YAML 格式正确，避免解析错误
5. **版本控制**：保留分析历史，便于追踪变化

## 最佳实践

1. **结构化输出**：使用统一的数据结构，便于后续处理
2. **字段标准化**：使用标准化的字段值，避免歧义
3. **可扩展性**：数据结构支持扩展，便于添加新字段
4. **向后兼容**：更新数据结构时保持向后兼容
5. **文档同步**：输出格式变更时同步更新文档

## 参考: code-standards-extraction.md

# 代码规范提取方法

## 代码风格提取

### 缩进方式

**识别方法：**
1. 检查配置文件：
   - `.editorconfig` - 可能包含缩进配置
   - `.prettierrc` - Prettier 配置
   - `tsconfig.json` - TypeScript 配置（`indentSize`）
   - `package.json` - 可能包含缩进相关配置

2. 分析代码示例：
   - 统计代码中的缩进空格数
   - 检查是否使用 Tab 或空格
   - 注意：代码可能被格式化，优先查看配置文件

**常见配置：**
- 2 空格（React、Vue 项目常见）
- 4 空格（Python、Java 项目常见）
- Tab（部分项目使用）

### 引号风格

**识别方法：**
1. 检查 ESLint 配置：
   - `.eslintrc.*` 中的 `quotes` 规则
   - 可能的值：`"single"`、`"double"`、`"backtick"`

2. 检查 Prettier 配置：
   - `.prettierrc` 中的 `singleQuote` 选项

3. 分析代码示例：
   - 统计代码中单引号和双引号的使用
   - 注意：代码可能被格式化，优先查看配置文件

### 行尾分号

**识别方法：**
1. 检查 ESLint 配置：
   - `.eslintrc.*` 中的 `semi` 规则
   - 可能的值：`"always"`、`"never"`

2. 检查 Prettier 配置：
   - `.prettierrc` 中的 `semi` 选项

3. 分析代码示例：
   - 检查代码是否使用分号
   - 注意：代码可能被格式化，优先查看配置文件

### 代码格式化规则

**识别方法：**
1. 检查 Prettier 配置：
   - `.prettierrc` 或 `prettier.config.js`
   - 包含格式化规则（行宽、换行、尾随逗号等）

2. 检查编辑器配置：
   - `.editorconfig` - 编辑器通用配置
   - `.vscode/settings.json` - VS Code 配置

## 命名规范提取

### 变量命名

**识别方法：**
1. 分析代码示例：
   - 查看变量声明和使用的命名方式
   - 识别主要命名风格（camelCase、snake_case、PascalCase）

2. 检查代码检查工具配置：
   - ESLint 的 `camelcase` 规则
   - Pylint 的命名规则

**常见模式：**
- `camelCase` - JavaScript/TypeScript 常见
- `snake_case` - Python 常见
- `PascalCase` - 类名、组件名

### 函数命名

**识别方法：**
1. 分析代码示例：
   - 查看函数定义的命名方式
   - 识别命名模式（动词开头、命名风格）

2. 检查代码检查工具配置：
   - ESLint 的命名规则
   - 项目文档可能说明命名规范

**常见模式：**
- 动词开头：`getUser()`、`createOrder()`
- 布尔值：`isValid()`、`hasPermission()`
- 事件处理：`handleClick()`、`onSubmit()`

### 文件命名

**识别方法：**
1. 分析项目文件：
   - 统计文件命名风格
   - 识别主要命名模式

2. 检查项目文档：
   - README 可能说明文件命名规范

**常见模式：**
- `kebab-case` - `user-profile.tsx`
- `PascalCase` - `UserProfile.tsx`
- `camelCase` - `userProfile.tsx`
- `snake_case` - `user_profile.py`

### 常量命名

**识别方法：**
1. 分析代码示例：
   - 查看常量定义的命名方式
   - 识别命名风格（通常全大写）

2. 检查代码检查工具配置：
   - ESLint 的常量命名规则

**常见模式：**
- `UPPER_SNAKE_CASE` - `MAX_RETRY_COUNT`
- `PascalCase` - `DefaultConfig`（TypeScript 常量对象）

## 组织规范提取

### 导入顺序

**识别方法：**
1. 检查 ESLint 配置：
   - `eslint-plugin-import` 的排序规则
   - `import/order` 规则配置

2. 分析代码示例：
   - 查看导入语句的组织方式
   - 识别排序模式（第三方库、内部模块、相对路径等）

**常见模式：**
```javascript
// 1. 第三方库
import React from 'react';
import { Button } from 'antd';

// 2. 内部模块
import { api } from '@/services';
import { utils } from '@/utils';

// 3. 相对路径
import { Component } from './Component';
```

### 文件组织方式

**识别方法：**
1. 分析目录结构：
   - 查看文件在目录中的组织方式
   - 识别组织模式（按类型、按功能、按模块）

2. 检查项目文档：
   - README 可能说明文件组织规范

**常见模式：**
- 按类型组织：`components/`、`utils/`、`services/`
- 按功能组织：`user/`、`order/`、`product/`
- 按模块组织：`features/user/`、`features/order/`

### 注释风格

**识别方法：**
1. 分析代码示例：
   - 查看注释的编写方式
   - 识别注释风格（单行、多行、JSDoc 等）

2. 检查代码检查工具配置：
   - ESLint 的注释规则
   - JSDoc 配置

**常见模式：**
- 单行注释：`// 注释内容`
- 多行注释：`/* 注释内容 */`
- JSDoc：`/** 注释内容 */`
- Python docstring：`""" 注释内容 """`

### 文档规范

**识别方法：**
1. 检查项目文档：
   - README 文件的结构和格式
   - 文档目录的组织方式

2. 分析代码文档：
   - 查看代码中的文档注释
   - 识别文档生成工具（JSDoc、Sphinx 等）

## 配置文件提取

### ESLint 配置

**提取内容：**
- 规则配置（缩进、引号、分号等）
- 插件配置
- 扩展配置

**配置文件位置：**
- `.eslintrc.js`
- `.eslintrc.json`
- `.eslintrc.yaml`
- `package.json` 中的 `eslintConfig`

### Prettier 配置

**提取内容：**
- 格式化规则（缩进、引号、行宽等）
- 文件包含/排除规则

**配置文件位置：**
- `.prettierrc`
- `.prettierrc.json`
- `.prettierrc.js`
- `package.json` 中的 `prettier`

### TypeScript 配置

**提取内容：**
- 编译选项（`strict`、`target`、`module` 等）
- 路径别名配置
- 类型检查规则

**配置文件位置：**
- `tsconfig.json`
- `tsconfig.*.json`

### EditorConfig

**提取内容：**
- 缩进方式
- 字符编码
- 行尾序列
- 文件类型特定规则

**配置文件位置：**
- `.editorconfig`

## 提取策略

1. **优先读取配置文件**
   - 配置文件包含最准确的规范定义
   - 多个配置文件时，按优先级合并

2. **分析代码示例**
   - 代码示例反映实际使用的规范
   - 用于验证配置文件的有效性

3. **交叉验证**
   - 对比配置文件与代码示例
   - 识别不一致的地方并标注

4. **处理缺失配置**
   - 对于缺失的配置，基于代码示例推断
   - 标注推断的部分

5. **提取默认值**
   - 对于未明确配置的规则，使用框架默认值
   - 标注使用的默认值

## 输出格式

提取的代码规范应整理成结构化格式：

```yaml
code_standards:
  style:
    indent: 2
    indent_type: spaces
    quotes: single
    semicolon: false
    line_width: 100
    trailing_comma: es5
  naming:
    variables: camelCase
    functions: camelCase
    files: kebab-case
    constants: UPPER_SNAKE_CASE
    classes: PascalCase
  organization:
    import_order:
      - external
      - internal
      - relative
    file_structure: feature-based
  comments:
    style: jsdoc
    required: true
```

## 最佳实践

1. **配置文件优先**：优先从配置文件提取，更准确可靠
2. **代码示例验证**：使用代码示例验证配置的有效性
3. **标注不确定项**：对于推断的部分，明确标注
4. **保留原始配置**：保留原始配置文件路径，便于后续参考
5. **处理冲突**：当配置与代码不一致时，以配置为准并标注

