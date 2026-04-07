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

