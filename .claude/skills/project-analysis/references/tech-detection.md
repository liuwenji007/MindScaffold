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

