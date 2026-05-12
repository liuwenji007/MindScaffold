# Web 项目代码规范

Web 项目的标准代码规范配置，适用于 PC 端 Web 应用开发。

## 技术栈配置

```yaml
tech_stack:
  frontend:
    framework: "React"
    version: "18.x"
    ui_library: "Ant Design"  # 或 "Element Plus"
    state_management: "Zustand"  # 或 "Redux Toolkit"
    build_tool: "Vite"
    language: "TypeScript"
  tools:
    code_quality:
      - "ESLint"
      - "Prettier"
    testing:
      - "Vitest"
      - "React Testing Library"
```

## 代码规范配置

### 代码风格

```yaml
code_standards:
  style:
    indent: 2
    indent_type: "spaces"
    quotes: "single"
    semicolon: false
    line_width: 100
    trailing_comma: "es5"
    end_of_line: "lf"
```

**说明：**
- **缩进**：使用 2 个空格，不使用 Tab
- **引号**：使用单引号
- **分号**：不使用行尾分号
- **行宽**：最大 100 字符
- **尾随逗号**：ES5 兼容模式
- **行尾序列**：使用 LF（Unix 风格）

### 命名规范

```yaml
code_standards:
  naming:
    variables: "camelCase"
    functions: "camelCase"
    files: "kebab-case"
    constants: "UPPER_SNAKE_CASE"
    classes: "PascalCase"
    components: "PascalCase"
    types: "PascalCase"
    interfaces: "PascalCase"
    hooks: "camelCase"  # 以 use 开头
```

**说明：**
- **变量**：使用 camelCase，如 `userName`、`orderList`
- **函数**：使用 camelCase，动词开头，如 `getUserInfo()`、`handleSubmit()`
- **文件**：使用 kebab-case，如 `user-profile.tsx`、`order-list.ts`
- **常量**：使用 UPPER_SNAKE_CASE，如 `MAX_RETRY_COUNT`、`API_BASE_URL`
- **类/组件/类型/接口**：使用 PascalCase，如 `UserProfile`、`OrderService`
- **Hooks**：使用 camelCase，以 `use` 开头，如 `useUserInfo()`、`useOrderList()`

### 组织规范

```yaml
code_standards:
  organization:
    import_order:
      - "external"  # 第三方库
      - "internal"  # 内部模块（@/ 别名）
      - "relative"  # 相对路径
    file_structure: "feature-based"
    config_location: "root"
```

**导入顺序示例：**

```typescript
// 1. 第三方库
import React, { useState, useEffect } from 'react'
import { Button, Table } from 'antd'
import { useNavigate } from 'react-router-dom'

// 2. 内部模块（使用 @/ 别名）
import { getUserInfo } from '@/services/user'
import { formatDate } from '@/utils/date'
import { useUserStore } from '@/stores/user'

// 3. 相对路径
import UserCard from './UserCard'
import type { UserInfo } from './types'
```

## 项目结构配置

```yaml
project_structure:
  pattern: "feature-based"
  organization: "modular"
  directory_structure:
    src: "src/"
    components: "src/components/"
    pages: "src/pages/"
    services: "src/services/"
    utils: "src/utils/"
    types: "src/types/"
    styles: "src/styles/"
    assets: "src/assets/"
    stores: "src/stores/"  # 状态管理
    hooks: "src/hooks/"    # 自定义 Hooks
  config_location: "root"
```

**目录结构示例：**

```
src/
├── components/          # 通用组件
│   ├── common/         # 通用业务组件
│   └── ui/            # 基础 UI 组件
├── pages/              # 页面组件
│   ├── home/
│   │   ├── index.tsx
│   │   ├── types.ts
│   │   └── styles.module.scss
│   └── user/
├── services/           # API 服务
│   ├── user.ts
│   └── order.ts
├── stores/             # 状态管理
│   ├── user.ts
│   └── order.ts
├── hooks/              # 自定义 Hooks
│   ├── useUserInfo.ts
│   └── useOrderList.ts
├── utils/             # 工具函数
│   ├── request.ts
│   └── format.ts
├── types/             # 类型定义
│   ├── user.ts
│   └── common.ts
├── styles/           # 样式文件
│   ├── variables.scss
│   └── mixins.scss
└── assets/           # 静态资源
    ├── images/
    └── icons/
```

## 代码模式配置

```yaml
code_patterns:
  architecture:
    pattern: "Component-based"
    data_flow: "unidirectional"
  api:
    style: "REST"
    error_handling: "try-catch"
  async:
    pattern: "async-await"
  state_management:
    pattern: "zustand"  # 或 "redux-toolkit"
  testing:
    strategy: "unit"
    framework: "Vitest"
```

## React 组件规范

### 函数式组件

```typescript
import React, { useState, useEffect } from 'react'
import { Button } from 'antd'
import { getUserInfo } from '@/services/user'
import type { UserInfo } from './types'

interface UserProfileProps {
  userId: string
  onUpdate?: (user: UserInfo) => void
}

const UserProfile: React.FC<UserProfileProps> = ({ userId, onUpdate }) => {
  // 1. Hooks
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(false)

  // 2. Effects
  useEffect(() => {
    loadUserInfo()
  }, [userId])

  // 3. 方法
  const loadUserInfo = async () => {
    try {
      setLoading(true)
      const data = await getUserInfo(userId)
      setUser(data)
    } catch (error) {
      console.error('Failed to load user info:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = () => {
    if (user && onUpdate) {
      onUpdate(user)
    }
  }

  // 4. 渲染
  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <Button onClick={handleUpdate}>Update</Button>
    </div>
  )
}

export default UserProfile
```

### 组件文件组织

**单文件组件：**
- `UserProfile.tsx` - 组件实现
- `UserProfile.module.scss` - 样式文件（可选）
- `types.ts` - 类型定义（可选）

**多文件组件：**
```
UserProfile/
├── index.tsx           # 组件入口
├── UserProfile.tsx     # 组件实现
├── types.ts           # 类型定义
├── hooks.ts           # 组件相关 Hooks
└── styles.module.scss # 样式文件
```

### Hooks 规范

```typescript
import { useState, useEffect } from 'react'
import { getUserInfo } from '@/services/user'
import type { UserInfo } from '@/types/user'

export const useUserInfo = (userId: string) => {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getUserInfo(userId)
        setUser(data)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      loadUser()
    }
  }, [userId])

  return { user, loading, error }
}
```

## 最佳实践

1. **使用 TypeScript**：所有代码使用 TypeScript，提供类型安全
2. **函数式组件**：优先使用函数式组件和 Hooks
3. **组件拆分**：保持组件单一职责，合理拆分大组件
4. **性能优化**：使用 `React.memo`、`useMemo`、`useCallback` 优化性能
5. **错误处理**：统一使用 try-catch 处理异步错误，使用 Error Boundary 处理组件错误
6. **代码复用**：提取公共逻辑到自定义 Hooks 或工具函数
7. **样式规范**：使用 CSS Modules 或 styled-components，避免样式污染
8. **状态管理**：简单状态使用 useState，复杂状态使用 Zustand 或 Redux Toolkit

## 完整配置示例

```yaml
project_analysis:
  project_name: "Web 项目模板"
  project_type: "frontend"
  tech_stack:
    frontend:
      framework: "React"
      version: "18.x"
      ui_library: "Ant Design"
      state_management: "Zustand"
      build_tool: "Vite"
      language: "TypeScript"
    tools:
      code_quality:
        - "ESLint"
        - "Prettier"
      testing:
        - "Vitest"
        - "React Testing Library"
  code_standards:
    style:
      indent: 2
      indent_type: "spaces"
      quotes: "single"
      semicolon: false
      line_width: 100
      trailing_comma: "es5"
      end_of_line: "lf"
    naming:
      variables: "camelCase"
      functions: "camelCase"
      files: "kebab-case"
      constants: "UPPER_SNAKE_CASE"
      classes: "PascalCase"
      components: "PascalCase"
      hooks: "camelCase"
    organization:
      import_order:
        - "external"
        - "internal"
        - "relative"
      file_structure: "feature-based"
      config_location: "root"
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
  code_patterns:
    architecture:
      pattern: "Component-based"
      data_flow: "unidirectional"
    api:
      style: "REST"
      error_handling: "try-catch"
    async:
      pattern: "async-await"
    state_management:
      pattern: "zustand"
```

