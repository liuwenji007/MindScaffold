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


