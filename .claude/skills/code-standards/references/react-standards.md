# React + TypeScript 代码规范

## 技术栈

- **框架**: React 18+
- **语言**: TypeScript（strict mode）
- **构建**: Vite
- **包管理**: pnpm

## 代码风格

```
indent: 2 spaces
quotes: single
semicolon: false
trailing_comma: all
max_line_length: 100
print_width: 100
```

## 组件规范

### 组件定义

```tsx
// ✅ 函数式组件 + 显式 Props 类型
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  onClick,
}: ButtonProps) {
  // ...
}
```

### 组件文件结构

```
components/
  Button/
    Button.tsx          # 组件实现
    Button.module.css   # 样式（CSS Modules）
    Button.test.tsx     # 测试（colocated）
    index.ts            # 导出
  index.ts              # barrel export
```

### Hooks 规范

```tsx
// ✅ 自定义 Hook 以 use 开头，返回类型明确
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}
```

## 命名规范

| 类别 | 规则 | 示例 |
|------|------|------|
| 组件 | PascalCase | `UserProfile`, `SearchBar` |
| Hook | camelCase + use 前缀 | `useAuth`, `useDebounce` |
| 工具函数 | camelCase | `formatDate`, `parseQuery` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| 类型/接口 | PascalCase | `UserInfo`, `ApiResponse` |
| 枚举 | PascalCase（值也是） | `enum Status { Active, Inactive }` |
| 事件处理 | handle + 事件名 | `handleClick`, `handleSubmit` |
| 布尔变量 | is/has/should 前缀 | `isLoading`, `hasError` |
| 文件名 | kebab-case（组件可 PascalCase） | `use-auth.ts`, `Button.tsx` |

## 导入顺序

```tsx
// 1. React / 框架
import { useState, useEffect } from 'react'

// 2. 第三方库
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'

// 3. 内部模块（绝对路径）
import { api } from '@/services/api'
import { useAuth } from '@/hooks/use-auth'

// 4. 相对路径
import { UserCard } from './UserCard'
import { formatName } from './utils'

// 5. 样式
import styles from './UserList.module.css'
```

## 状态管理

- **组件内部状态**: `useState` / `useReducer`
- **跨组件共享**: Context（简单）或 Zustand（复杂）
- **服务端状态**: TanStack Query / SWR
- **表单状态**: React Hook Form + Zod

## TypeScript 规范

- 开启 `strict: true`
- 禁止使用 `any`，必要时用 `unknown` + 类型守卫
- Props 用 `interface` 定义（可被 extends）
- API 返回类型用 `type` 定义
- 泛型命名用有意义的名称（`TItem` 而非 `T`）

## 错误处理

```tsx
// ✅ 使用 Error Boundary 处理渲染错误
// ✅ 使用 try-catch 处理异步错误
// ✅ 提供用户友好的错误 UI
// ❌ 不要 catch 后静默忽略
```

