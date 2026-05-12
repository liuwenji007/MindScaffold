# H5 项目代码规范

H5 项目的标准代码规范配置，适用于移动端 H5 页面开发。

## 技术栈配置

```yaml
tech_stack:
  frontend:
    framework: "Vue"
    version: "3.x"
    ui_library: "Vant"  # 或 "Ant Design Mobile"
    state_management: "Pinia"  # Vue 3 推荐使用 Pinia
    build_tool: "Vite"
    language: "TypeScript"
  tools:
    code_quality:
      - "ESLint"
      - "Prettier"
    testing:
      - "Vitest"
      - "Vue Test Utils"
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
- **尾随逗号**：ES5 兼容模式（对象和数组最后一个元素后不加逗号）
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
```

**说明：**
- **变量**：使用 camelCase，如 `userName`、`orderList`
- **函数**：使用 camelCase，动词开头，如 `getUserInfo()`、`handleSubmit()`
- **文件**：使用 kebab-case，如 `user-profile.vue`、`order-list.ts`
- **常量**：使用 UPPER_SNAKE_CASE，如 `MAX_RETRY_COUNT`、`API_BASE_URL`
- **类/组件/类型/接口**：使用 PascalCase，如 `UserProfile`、`OrderService`

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
import { ref, computed } from 'vue'
import { Button } from 'vant'
import { useRouter } from 'vue-router'

// 2. 内部模块（使用 @/ 别名）
import { getUserInfo } from '@/services/user'
import { formatDate } from '@/utils/date'

// 3. 相对路径
import UserCard from './UserCard.vue'
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
│   │   ├── index.vue
│   │   └── types.ts
│   └── user/
├── services/           # API 服务
│   ├── user.ts
│   └── order.ts
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
    pattern: "pinia"
  testing:
    strategy: "unit"
    framework: "Vitest"
```

## Vue 组件规范

### 组件结构

```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
// 1. 导入
import { ref, computed } from 'vue'
import { Button } from 'vant'

// 2. 类型定义
interface Props {
  userId: string
}

// 3. Props 和 Emits
const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [value: string]
}>()

// 4. 响应式数据
const count = ref(0)

// 5. 计算属性
const doubleCount = computed(() => count.value * 2)

// 6. 方法
const handleClick = () => {
  // 处理逻辑
}

// 7. 生命周期
onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped lang="scss">
/* 样式内容 */
</style>
```

### 组件命名

- **组件文件**：使用 PascalCase，如 `UserProfile.vue`
- **组件注册**：使用 PascalCase，如 `<UserProfile />`
- **Props**：使用 camelCase，如 `userId`、`userName`

## 最佳实践

1. **使用 TypeScript**：所有代码使用 TypeScript，提供类型安全
2. **组件化开发**：将功能拆分为可复用的组件
3. **响应式设计**：使用 rem 或 vw/vh 单位，适配不同屏幕尺寸
4. **性能优化**：使用 `v-show` 和 `v-if` 合理控制渲染，使用 `keep-alive` 缓存组件
5. **错误处理**：统一使用 try-catch 处理异步错误
6. **代码复用**：提取公共逻辑到 composables 或 utils
7. **样式规范**：使用 scoped 样式，避免样式污染

## 完整配置示例

```yaml
project_analysis:
  project_name: "H5 项目模板"
  project_type: "frontend"
  tech_stack:
    frontend:
      framework: "Vue"
      version: "3.x"
      ui_library: "Vant"
      state_management: "Pinia"
      build_tool: "Vite"
      language: "TypeScript"
    tools:
      code_quality:
        - "ESLint"
        - "Prettier"
      testing:
        - "Vitest"
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
      pattern: "pinia"
```

