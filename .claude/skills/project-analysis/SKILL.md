# project-analysis

> 前端项目结构分析工具。分析技术栈、目录结构和代码模式。Use when onboarding a new project, extracting project conventions, or analyzing project context in workflows。

- **License:** MIT
- **Compatibility:** Node.js 18+
- **Version:** 1.0.0
- **Author:** forge
- **Impact:** high
- **Tags:** project, analysis, architecture, tech-stack, structure

# 项目分析

分析前端项目的技术架构、代码规范和组织模式，为代码生成和技术决策提供上下文。

## 工作流程

1. **获取项目信息** — 从本地目录读取项目文件
2. **项目结构分析** — 识别目录模式、文件组织方式
3. **技术框架识别** — 识别框架、UI 库、状态管理、构建工具
4. **代码规范提取** — 从配置文件提取代码风格和命名规范
5. **代码模式识别** — 识别架构模式、数据流、API 调用方式
6. **信息整理** — 输出结构化分析报告

## 分析维度

### 1. 项目结构分析

从目录结构推断组织模式：

- **功能导向**（Feature-Based）：按业务功能划分（`features/user/`, `features/order/`）
- **类型导向**（Type-Based）：按代码类型划分（`components/`, `hooks/`, `utils/`）
- **Feature-Sliced**：分层架构（`app/`, `pages/`, `features/`, `shared/`）
- **模块化**（Modular）：独立模块各自包含完整 MVC

关键文件定位：
- 入口文件（`main.tsx`, `App.vue`, `index.ts`）
- 路由配置（`router/`, `routes.ts`）
- 全局配置（`config/`, `env.*`）
- 类型定义（`types/`, `*.d.ts`）

详见 [references/structure-patterns.md](references/structure-patterns.md)。

### 2. 技术框架识别

**检测来源**：

| 文件 | 检测内容 |
|------|----------|
| `package.json` | 框架、UI 库、状态管理、工具链依赖 |
| `tsconfig.json` | TypeScript 配置（paths, strict 等） |
| `vite.config.*` / `next.config.*` | 构建工具和插件配置 |
| `.eslintrc*` / `eslint.config.*` | Lint 规则集 |
| `.prettierrc*` | 代码格式化配置 |

**框架识别**：
- React（react, react-dom）
- Vue（vue, @vue/compiler-sfc）
- Next.js（next）
- Nuxt（nuxt）
- Angular（@angular/core）

**UI 库识别**：
- antd, @ant-design/pro-components
- element-plus, @element-plus/icons-vue
- @mui/material, @chakra-ui/react
- vant, @arco-design/web-react

详见 [references/tech-detection.md](references/tech-detection.md)。

### 3. 代码规范提取

从项目配置文件提取实际使用的规范：

- **ESLint 配置**：规则集、自定义规则、extends 链
- **Prettier 配置**：格式化选项
- **TypeScript 配置**：严格程度、路径别名
- **EditorConfig**：编辑器级别的风格设置

### 4. 代码模式识别

- **API 调用方式**：axios 封装、fetch wrapper、GraphQL client
- **状态管理模式**：Redux Toolkit slice、Pinia store、Zustand store
- **路由模式**：文件路由、配置路由、权限路由
- **样式方案**：CSS Modules、Tailwind、CSS-in-JS、Sass
- **测试策略**：单元测试、集成测试、E2E 测试

## 输出格式

```yaml
project:
  name: my-project
  type: web           # web | h5 | desktop | miniprogram
  monorepo: false

tech_stack:
  framework: React 18
  language: TypeScript
  ui_library: Ant Design 5
  state_management: Zustand
  build_tool: Vite 5
  package_manager: pnpm
  styling: CSS Modules
  test_framework: Vitest

structure:
  pattern: feature-based
  entry: src/main.tsx
  key_directories:
    - src/features/     # 业务模块
    - src/components/    # 公共组件
    - src/hooks/         # 自定义 Hooks
    - src/services/      # API 封装
    - src/utils/         # 工具函数

code_patterns:
  api: axios-wrapper       # axios 统一封装
  routing: config-based    # 配置式路由
  error_handling: boundary # Error Boundary + toast
  async: react-query       # TanStack Query
```

## Resources

| 文件 | 用途 |
|------|------|
| [structure-patterns.md](references/structure-patterns.md) | 常见前端项目目录结构模式与识别方法 |
| [tech-detection.md](references/tech-detection.md) | 技术栈检测规则与依赖名称映射 |

---

## 参考: tech-detection.md

# 技术栈检测规则

## 框架检测

从 `package.json` 的 `dependencies` / `devDependencies` 检测：

| 依赖包 | 框架 | 备注 |
|--------|------|------|
| `react`, `react-dom` | React | 检查版本号 (16/17/18) |
| `next` | Next.js | 同时也是 React |
| `vue` | Vue | 检查版本号 (2/3) |
| `nuxt` | Nuxt | 同时也是 Vue |
| `@angular/core` | Angular | |
| `svelte` | Svelte | |
| `solid-js` | Solid | |

## UI 组件库检测

| 依赖包 | UI 库 | 适用框架 |
|--------|-------|----------|
| `antd` | Ant Design | React |
| `@ant-design/pro-components` | Ant Design Pro | React |
| `element-plus` | Element Plus | Vue 3 |
| `element-ui` | Element UI | Vue 2 |
| `@mui/material` | Material UI | React |
| `@chakra-ui/react` | Chakra UI | React |
| `vant` | Vant | Vue (H5) |
| `@arco-design/web-react` | Arco Design | React |
| `@arco-design/web-vue` | Arco Design | Vue |
| `naive-ui` | Naive UI | Vue 3 |
| `@headlessui/react` | Headless UI | React |

## 状态管理检测

| 依赖包 | 方案 | 适用框架 |
|--------|------|----------|
| `@reduxjs/toolkit` | Redux Toolkit | React |
| `zustand` | Zustand | React |
| `jotai` | Jotai | React |
| `recoil` | Recoil | React |
| `mobx` | MobX | React |
| `pinia` | Pinia | Vue 3 |
| `vuex` | Vuex | Vue 2/3 |

## 构建工具检测

| 配置文件 / 依赖 | 工具 |
|------------------|------|
| `vite.config.*`, `vite` | Vite |
| `next.config.*` | Next.js (内置 webpack/turbopack) |
| `webpack.config.*`, `webpack` | Webpack |
| `turbo.json`, `turbopack` | Turbopack |
| `rspack.config.*`, `@rspack/core` | Rspack |

## 样式方案检测

| 依赖 / 配置 | 方案 |
|-------------|------|
| `tailwindcss`, `tailwind.config.*` | Tailwind CSS |
| `*.module.css` 文件 | CSS Modules |
| `sass`, `node-sass` | Sass/SCSS |
| `less` | Less |
| `styled-components` | Styled Components |
| `@emotion/react` | Emotion |
| `unocss` | UnoCSS |

## 测试框架检测

| 依赖 / 配置 | 框架 |
|-------------|------|
| `vitest` | Vitest |
| `jest` | Jest |
| `@testing-library/react` | React Testing Library |
| `@vue/test-utils` | Vue Test Utils |
| `cypress` | Cypress (E2E) |
| `playwright`, `@playwright/test` | Playwright (E2E) |

## TypeScript 配置检测

从 `tsconfig.json` 检测关键配置：

```json
{
  "compilerOptions": {
    "strict": true,          // 严格模式
    "paths": { "@/*": ["./src/*"] },  // 路径别名
    "target": "ES2022",      // 编译目标
    "jsx": "react-jsx"       // JSX 模式
  }
}
```

## 包管理器检测

| 文件 | 包管理器 |
|------|----------|
| `pnpm-lock.yaml` | pnpm |
| `yarn.lock` | yarn |
| `package-lock.json` | npm |
| `bun.lockb` | bun |

## 参考: structure-patterns.md

# 前端项目目录结构模式

## 类型导向（Type-Based）

按代码职责类型划分，最常见的 React/Vue 初始模板结构：

```
src/
  components/    # UI 组件
  pages/         # 页面组件
  hooks/         # 自定义 Hooks / Composables
  services/      # API 调用
  utils/         # 工具函数
  types/         # TypeScript 类型
  assets/        # 静态资源
  styles/        # 全局样式
```

**识别特征**：顶层有 `components/`, `pages/`, `utils/` 等按类型命名的目录。

**适用场景**：小中型项目（< 20 个页面）。

**缺点**：随项目增长，同一功能的文件分散在多个目录。

## 功能导向（Feature-Based）

按业务功能划分，每个功能模块自包含：

```
src/
  features/
    user/
      components/
      hooks/
      services/
      types.ts
      index.ts
    order/
      components/
      hooks/
      services/
      types.ts
      index.ts
  shared/
    components/
    hooks/
    utils/
```

**识别特征**：存在 `features/` 或 `modules/` 目录，每个子目录包含完整的组件、hooks、services。

**适用场景**：中大型项目。

**优点**：内聚性强，功能模块可独立开发和测试。

## Feature-Sliced Design (FSD)

分层架构，严格的依赖方向（上层依赖下层）：

```
src/
  app/           # 应用初始化、全局配置
  pages/         # 页面组合层
  widgets/       # 复合 UI 块
  features/      # 用户交互功能
  entities/      # 业务实体
  shared/        # 基础设施（UI kit, libs, API）
```

**识别特征**：存在 `entities/`, `widgets/`, `features/`, `shared/` 多层目录。

**适用场景**：大型团队协作项目。

## Next.js App Router

文件系统路由：

```
app/
  layout.tsx
  page.tsx
  users/
    page.tsx
    [id]/
      page.tsx
  api/
    users/
      route.ts
src/
  components/
  lib/
```

**识别特征**：`app/` 目录下有 `page.tsx`, `layout.tsx`, `route.ts` 等约定文件。

## Monorepo

多包管理：

```
packages/
  ui/            # 组件库
  utils/         # 工具库
  app-web/       # Web 应用
  app-h5/        # H5 应用
pnpm-workspace.yaml
```

**识别特征**：根目录有 `pnpm-workspace.yaml`, `lerna.json`, 或 `turbo.json`。

## 识别策略

1. **检查根目录结构**：`app/` → Next.js/Nuxt; `packages/` → Monorepo
2. **检查 src/ 内部**：`features/` → Feature-Based; `entities/` → FSD
3. **检查配置文件**：`next.config.*` → Next.js; `nuxt.config.*` → Nuxt
4. **默认回退**：Type-Based（最常见的初始结构）

