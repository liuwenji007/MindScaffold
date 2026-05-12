# OSMP Web 项目代码规范

基于 osmp-web 项目的标准代码规范配置，适用于 Web 管理后台项目开发。

## 项目信息

- **项目名称**：osmp-web
- **GitLab 地址**：`https://gitlab.starcharge.com/associated-business-center/osmp-web`
- **项目类型**：Web 管理后台（运营管理平台）
- **用途**：公司标准 Web 管理后台项目的默认代码规范

## 完整配置

```yaml
project_analysis:
  project_name: "osmp-web"
  project_type: "frontend"
  source: "default-code-standards"
  source_path: "https://gitlab.starcharge.com/associated-business-center/osmp-web"
  project_category: "web"
  tech_stack:
    frontend:
      framework: "UmiJS"
      version: "3.5.40"
      ui_library: "Ant Design"
      ui_library_version: "4.24.16"
      state_management: "Zustand"
      state_management_version: "4.3.7"
      build_tool: "Webpack"
      language: "TypeScript"
      typescript_version: "4.9.5"
      react_version: "18.2.0"
      style_preprocessor: "Less"
      request_library: "umi-request"
    tools:
      code_quality:
        - "ESLint"
        - "Prettier"
        - "Stylelint"
      testing:
        - "Jest"
        - "React Testing Library"
      micro_frontend:
        - "qiankun"
  code_standards:
    style:
      indent: 2
      indent_type: "spaces"
      quotes: "single"
      semicolon: false
      line_width: 100
      trailing_comma: "es5"
      end_of_line: "auto"
    naming:
      variables: "camelCase"
      functions: "camelCase"
      files: "kebab-case"
      constants: "UPPER_SNAKE_CASE"
      classes: "PascalCase"
      components: "PascalCase"
      types: "PascalCase"
      interfaces: "PascalCase"
      hooks: "camelCase"
      stores: "camelCase"
    organization:
      import_order:
        - "external"
        - "internal"
        - "relative"
      file_structure: "feature-based"
      config_location: "root"
      path_alias: "@/"
  project_structure:
    pattern: "feature-based"
    organization: "modular"
    directory_structure:
      src: "src/"
      components: "src/components/"
      pages: "src/pages/"
      services: "src/services/"
      stores: "src/stores/"
      hooks: "src/hooks/"
      utils: "src/utils/"
      types: "src/types/"
      styles: "src/styles/"
      assets: "src/assets/"
      layouts: "src/layouts/"
      config: "config/"
  code_patterns:
    architecture:
      pattern: "Component-based"
      data_flow: "unidirectional"
      micro_frontend: true
    api:
      style: "REST"
      error_handling: "try-catch"
      request_library: "umi-request"
    async:
      pattern: "async-await"
    state_management:
      pattern: "zustand"
    testing:
      strategy: "unit"
      framework: "Jest"
    style:
      preprocessor: "less"
      css_modules: false
```

## 技术栈详细说明

### UmiJS 3.x + React 18 + TypeScript

- **UmiJS 版本**：3.5.40
- **React 版本**：18.2.0
- **TypeScript 版本**：4.9.5
- **构建工具**：Webpack 5
- **特点**：
  - 基于 UmiJS 框架，提供约定式路由、插件系统
  - 支持微前端（qiankun）
  - 支持多环境配置（dev、test、pre、prod）
  - 使用 TypeScript 严格模式

### Ant Design 4.x

- **版本**：4.24.16
- **Pro Components**：使用 @ant-design/pro-components 系列组件
  - @ant-design/pro-layout
  - @ant-design/pro-table
  - @ant-design/pro-form
  - @ant-design/pro-descriptions
- **主题定制**：支持主题定制和国际化
- **组件使用**：遵循 Ant Design 设计规范
- **表单处理**：使用 Ant Design Form 组件

### Zustand

- **版本**：4.3.7
- **状态管理**：使用 Zustand 进行全局状态管理
- **特点**：轻量级、简单易用、TypeScript 友好
- **Store 组织**：按功能模块划分 store

### Less

- **样式预处理器**：Less
- **样式检查**：使用 Stylelint 检查 Less 文件
- **CSS Modules**：不使用 CSS Modules，使用全局样式

### umi-request

- **请求库**：umi-request（基于 fetch）
- **特点**：UmiJS 官方请求库，支持拦截器、错误处理等

## 代码规范详细说明

### 代码风格

- **缩进**：2 个空格，不使用 Tab
- **引号**：字符串使用单引号
- **分号**：不使用行尾分号
- **行宽**：最大 100 字符
- **尾随逗号**：ES5 兼容模式（对象和数组最后一个元素后不加逗号）
- **行尾序列**：auto（自动检测）

### 命名规范

- **变量**：camelCase，如 `userName`、`orderList`、`isLoading`
- **函数**：camelCase，动词开头，如 `getUserInfo()`、`handleSubmit()`、`fetchData()`
- **文件**：kebab-case，如 `user-profile.tsx`、`order-list.ts`、`api-service.ts`
- **常量**：UPPER_SNAKE_CASE，如 `MAX_RETRY_COUNT`、`API_BASE_URL`、`DEFAULT_PAGE_SIZE`
- **组件**：PascalCase，如 `UserProfile`、`OrderList`、`DataTable`
- **类型/接口**：PascalCase，如 `UserInfo`、`OrderItem`、`ApiResponse`
- **Hooks**：camelCase，以 `use` 开头，如 `useUserInfo()`、`useOrderList()`
- **Store**：camelCase，如 `userStore`、`orderStore`

### 导入顺序

```typescript
// 1. 第三方库
import React, { useState, useEffect } from 'react'
import { Button, Table, Form } from 'antd'
import { ProTable } from '@ant-design/pro-table'
import { useNavigate } from 'umi'

// 2. 内部模块（使用 @/ 别名）
import { getUserInfo } from '@/services/user'
import { formatDate } from '@/utils/date'
import { useUserStore } from '@/stores/user'

// 3. 相对路径
import UserCard from './UserCard'
import type { UserInfo } from './types'
```

### 文件组织

```text
src/
├── components/          # 通用组件
│   ├── common/         # 通用业务组件
│   └── ui/            # 基础 UI 组件
├── pages/              # 页面组件（约定式路由）
│   ├── user/
│   │   ├── index.tsx
│   │   ├── service.ts
│   │   └── model.ts
│   └── order/
├── services/           # API 服务
│   ├── user.ts
│   └── order.ts
├── stores/             # Zustand Store
│   ├── user.ts
│   └── order.ts
├── hooks/              # 自定义 Hooks
│   ├── useUserInfo.ts
│   └── useOrderList.ts
├── utils/             # 工具函数
│   ├── request.ts
│   └── format.ts
├── types/             # 全局类型定义
│   ├── user.ts
│   └── common.ts
├── styles/           # 全局样式
│   ├── variables.less
│   └── mixins.less
├── assets/           # 静态资源
│   ├── images/
│   └── icons/
└── layouts/          # 布局组件
    ├── BasicLayout.tsx
    └── BlankLayout.tsx

config/                # UmiJS 配置文件
├── config.ts
├── config.dev.ts
├── config.test.ts
└── config.prod.ts
```

## UmiJS 项目规范

### 约定式路由

UmiJS 使用约定式路由，`src/pages/` 目录下的文件会自动生成路由：

```text
src/pages/
├── index.tsx          # 对应路由：/
├── user/
│   ├── index.tsx      # 对应路由：/user
│   └── detail.tsx     # 对应路由：/user/detail
└── order/
    └── index.tsx      # 对应路由：/order
```

### 页面组件结构

```typescript
import React, { useState, useEffect } from 'react'
import { Button, Table } from 'antd'
import { ProTable } from '@ant-design/pro-table'
import { getUserList } from '@/services/user'
import { useUserStore } from '@/stores/user'
import type { UserInfo } from './types'

const UserList: React.FC = () => {
  // 1. Hooks
  const [users, setUsers] = useState<UserInfo[]>([])
  const [loading, setLoading] = useState(false)
  const userStore = useUserStore()

  // 2. Effects
  useEffect(() => {
    loadUsers()
  }, [])

  // 3. 方法
  const loadUsers = async () => {
    try {
      setLoading(true)
      const data = await getUserList()
      setUsers(data)
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  // 4. 渲染
  return (
    <ProTable
      dataSource={users}
      loading={loading}
      columns={[...]}
    />
  )
}

export default UserList
```

### Zustand Store 组织

```typescript
// stores/user.ts
import { create } from 'zustand'
import { getUserInfo } from '@/services/user'
import type { UserInfo } from '@/types/user'

interface UserState {
  currentUser: UserInfo | null
  loading: boolean
  error: string | null
  fetchUser: (userId: string) => Promise<void>
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  loading: false,
  error: null,
  fetchUser: async (userId: string) => {
    set({ loading: true, error: null })
    try {
      const user = await getUserInfo(userId)
      set({ currentUser: user, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },
  clearUser: () => set({ currentUser: null })
}))
```

### API 服务规范

```typescript
// services/user.ts
import request from '@/utils/request'
import type { UserInfo, UserListParams, UserListResponse } from '@/types/user'

export const getUserInfo = async (userId: string): Promise<UserInfo> => {
  const response = await request.get<UserInfo>(`/api/users/${userId}`)
  return response.data
}

export const getUserList = async (
  params: UserListParams
): Promise<UserListResponse> => {
  const response = await request.get<UserListResponse>('/api/users', { params })
  return response.data
}

export const createUser = async (userData: Partial<UserInfo>): Promise<UserInfo> => {
  const response = await request.post<UserInfo>('/api/users', userData)
  return response.data
}
```

### UmiJS 配置

```typescript
// config/config.ts
import { defineConfig } from 'umi'

export default defineConfig({
  nodeModulesTransform: {
    type: 'all',
  },
  routes: [
    // 路由配置（如果使用配置式路由）
  ],
  fastRefresh: {},
  // 其他配置...
})
```

## 代码检查工具

### ESLint

- **配置来源**：@umijs/fabric
- **检查范围**：`.js`, `.jsx`, `.ts`, `.tsx` 文件
- **命令**：
  - `npm run lint:js` - 检查代码
  - `npm run lint:fix` - 自动修复

### Prettier

- **配置**：使用项目根目录的 `.prettierrc`
- **检查范围**：所有源代码文件
- **命令**：
  - `npm run prettier` - 格式化代码
  - `npm run lint:prettier` - 检查格式

### Stylelint

- **检查范围**：`.less` 文件
- **命令**：
  - `npm run lint:style` - 检查并修复样式

## 最佳实践

1. **TypeScript 类型安全**：所有代码使用 TypeScript，提供完整的类型定义
2. **函数式组件**：优先使用函数式组件和 Hooks，避免类组件
3. **组件拆分**：保持组件单一职责，合理拆分大组件
4. **性能优化**：使用 `React.memo`、`useMemo`、`useCallback` 优化性能
5. **错误处理**：统一使用 try-catch 处理异步错误
6. **代码复用**：提取公共逻辑到自定义 Hooks 或工具函数
7. **样式规范**：使用 Less 预处理器，遵循 BEM 命名规范（可选）
8. **状态管理**：简单状态使用 useState，复杂状态使用 Zustand
9. **API 调用**：统一使用 service 层进行 API 调用，使用 umi-request
10. **路由管理**：优先使用约定式路由，复杂场景使用配置式路由
11. **微前端**：支持作为 qiankun 子应用运行

## 使用方式

在工作流中直接使用此配置：

1. **加载配置**：从 `references/saas-admin-standards.md` 加载完整配置
2. **应用到代码生成**：在代码生成时使用这些规范
3. **保存到用户偏好**：将配置保存到 `user-preferences.yaml` 供后续使用

## 配置更新

当 osmp-web 项目更新时，需要同步更新此配置文件：

1. 分析项目的最新代码规范和结构
2. 更新此配置文件中的相关配置
3. 确保配置与实际项目保持一致
