# code-standards

> 前端项目代码规范配置工具。提供标准化的代码风格、命名规范、项目结构规范。Use when generating code that needs style consistency, initializing project standards, or unifying team conventions。

- **License:** MIT
- **Compatibility:** React 18+, Vue 3+, TypeScript 5+
- **Version:** 1.0.0
- **Author:** forge
- **Impact:** high
- **Tags:** code-style, naming, project-structure, eslint, prettier

# 前端代码规范

代码规范配置工具，提供项目级的代码风格、命名和组织规范，用于指导代码生成并确保一致性。

## 工作流程

应用代码规范遵循智能缓存机制：

1. **检查项目配置** — 优先检查项目根目录是否存在已保存的规范配置文件（`.forge/code-standards.yaml`）
2. **自动分析当前项目** — 如无配置，分析项目的 `package.json`、`tsconfig.json`、`.eslintrc`、`.prettierrc` 等来提取实际使用的规范
3. **缓存分析结果** — 将分析结果保存为配置文件，后续直接复用
4. **选择预设规范** — 如分析失败或为新项目，根据技术栈选择预设规范（React/Vue）
5. **应用规范** — 将规范注入代码生成流程
6. **验证** — 确保生成代码符合规范

## 分析维度

### 代码风格

从项目配置文件提取：

- 缩进方式（空格数量/Tab）
- 引号风格（单引号/双引号）
- 行尾分号（有/无）
- 行宽限制
- 尾逗号规则

### 命名规范

- **变量/函数**：camelCase
- **组件/类**：PascalCase
- **文件名**：kebab-case（组件文件可 PascalCase）
- **常量**：UPPER_SNAKE_CASE
- **CSS 类名**：BEM 或 CSS Modules
- **类型/接口**：PascalCase，接口不加 `I` 前缀

### 项目结构

- 目录组织模式（功能导向 / 类型导向 / Feature-Sliced）
- 导入顺序（外部 → 内部 → 相对路径 → 样式）
- 文件结构约定（index 导出、barrel files）
- 测试文件位置（colocated vs `__tests__`）

## 预设规范

### React + TypeScript 项目

参考 [references/react-standards.md](references/react-standards.md)

核心要点：
- 函数式组件 + Hooks
- Props 使用 interface 定义，导出供外部使用
- 组件文件与样式文件同目录
- 自定义 Hook 以 `use` 开头
- 事件处理函数以 `handle` 开头

### Vue + TypeScript 项目

参考 [references/vue-standards.md](references/vue-standards.md)

核心要点：
- `<script setup lang="ts">` 语法
- 组件使用 PascalCase 命名
- Composables 以 `use` 开头
- Props 使用 `defineProps<T>()` 类型声明
- 自动导入启用（unplugin-auto-import）

## 规范配置格式

```yaml
tech_stack:
  framework: React       # React | Vue | Angular
  language: TypeScript
  ui_library: Ant Design
  state_management: Zustand
  build_tool: Vite

code_standards:
  style:
    indent: 2
    quotes: single
    semicolon: false
    trailing_comma: all
    max_line_length: 100
  naming:
    variables: camelCase
    functions: camelCase
    components: PascalCase
    files: kebab-case
    constants: UPPER_SNAKE_CASE
    css_classes: css-modules
  organization:
    import_order:
      - external
      - internal
      - relative
      - styles
    test_location: colocated
    barrel_exports: true
```

## 最佳实践

1. **项目优先**：始终先分析项目已有规范，不要强加预设
2. **渐进式**：新项目可从预设开始，逐步调整
3. **工具链对齐**：规范应与 ESLint/Prettier 配置一致
4. **团队共识**：规范是团队约定，不是个人偏好
5. **可执行**：每条规范都应能被自动化工具检查

## Resources

| 文件 | 用途 |
|------|------|
| [react-standards.md](references/react-standards.md) | React + TypeScript 项目完整代码规范 |
| [vue-standards.md](references/vue-standards.md) | Vue + TypeScript 项目完整代码规范 |

---

## 参考: vue-standards.md

# Vue + TypeScript 代码规范

## 技术栈

- **框架**: Vue 3.4+（Composition API）
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
```

## 组件规范

### 组件定义（`<script setup>`）

```vue
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  variant?: 'primary' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  count: 0,
  variant: 'primary',
})

const emit = defineEmits<{
  update: [value: string]
  close: []
}>()

// 组合式函数
const { data, isLoading } = useFetch('/api/data')

// 计算属性
const displayTitle = computed(() => `${props.title} (${props.count})`)

// 方法
function handleClick() {
  emit('update', 'new-value')
}
</script>

<template>
  <div :class="[$style.wrapper, $style[variant]]">
    <h2>{{ displayTitle }}</h2>
    <button @click="handleClick">操作</button>
  </div>
</template>

<style module>
.wrapper {
  padding: 16px;
}
.primary {
  color: var(--color-primary);
}
</style>
```

### 组件文件结构

```
components/
  UserCard/
    UserCard.vue        # 组件实现
    UserCard.test.ts    # 测试
    index.ts            # 导出
  index.ts              # barrel export
```

### Composables 规范

```ts
// ✅ composables/use-counter.ts
export function useCounter(initial = 0) {
  const count = ref(initial)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  return {
    count: readonly(count),
    increment,
    decrement,
  }
}
```

## 命名规范

| 类别 | 规则 | 示例 |
|------|------|------|
| 组件 | PascalCase | `UserProfile.vue`, `SearchBar.vue` |
| Composable | camelCase + use 前缀 | `useAuth`, `useCounter` |
| 工具函数 | camelCase | `formatDate`, `parseQuery` |
| 常量 | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| 类型/接口 | PascalCase | `UserInfo`, `ApiResponse` |
| 事件名 | kebab-case（模板） | `@update-value`, `@close` |
| Props | camelCase | `userName`, `isVisible` |
| 文件名 | PascalCase（组件）/ kebab-case（其他） | `UserCard.vue`, `use-auth.ts` |

## 导入顺序

```ts
// 1. Vue 核心
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 2. 第三方库
import { useQuery } from '@tanstack/vue-query'
import dayjs from 'dayjs'

// 3. 内部模块
import { api } from '@/services/api'
import { useAuth } from '@/composables/use-auth'

// 4. 相对路径
import UserCard from './UserCard.vue'
import { formatName } from './utils'
```

## 状态管理

- **组件内部**: `ref` / `reactive`
- **跨组件**: Pinia（推荐）
- **服务端状态**: TanStack Vue Query / VueUse `useFetch`
- **表单**: VeeValidate + Zod

## TypeScript 规范

- 开启 `strict: true`
- Props 使用 `defineProps<T>()` 泛型语法
- Emits 使用 `defineEmits<T>()` 泛型语法
- 模板 ref 使用 `useTemplateRef()` 或 `ref<HTMLElement | null>(null)`
- 禁止使用 `any`

## 模板规范

- 属性多于 3 个时换行
- 使用 `v-bind` 缩写 `:`
- 使用 `v-on` 缩写 `@`
- 指令顺序：`v-if` → `v-for` → `v-bind` → `v-on` → 其他
- 不在模板中写复杂表达式，用 `computed` 替代

## 参考: react-standards.md

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

