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

