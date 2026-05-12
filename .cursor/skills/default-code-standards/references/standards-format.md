# 代码规范配置格式说明

代码规范配置采用 YAML 格式，用于在工作流中应用和保存到用户偏好文件。

## 文件位置

保存到用户偏好文件时，位置为：

```
{project-root}/_bmad/_cfg/user-preferences.yaml
```

## 数据结构

代码规范配置包含以下主要部分：

### 1. 项目基本信息

```yaml
project_analysis:
  project_name: "项目名称"
  project_type: "frontend" | "backend" | "fullstack"
  source: "default-code-standards"  # 标识来源为默认代码规范
  project_category: "h5" | "web"    # 项目分类
```

### 2. 技术栈配置

```yaml
tech_stack:
  frontend:
    framework: "React" | "Vue" | "Angular" | null
    version: "18.x" | "3.x"  # 版本号（可选）
    ui_library: "Ant Design" | "Vant" | "Element UI" | null
    state_management: "Zustand" | "Redux" | "Pinia" | "Vuex" | null
    build_tool: "Vite" | "Webpack" | "Next.js" | null
    language: "TypeScript" | "JavaScript"
  tools:
    code_quality:
      - "ESLint"
      - "Prettier"
    testing:
      - "Vitest" | "Jest" | "Mocha"
```

### 3. 代码规范配置

#### 代码风格 (style)

```yaml
code_standards:
  style:
    indent: 2                    # 缩进空格数
    indent_type: "spaces"        # "spaces" | "tabs"
    quotes: "single"             # "single" | "double"
    semicolon: false             # true | false
    line_width: 100              # 最大行宽
    trailing_comma: "es5"        # "es5" | "all" | "none"
    end_of_line: "lf"            # "lf" | "crlf" | "cr"
```

**字段说明：**
- **indent**：缩进使用的空格数，通常为 2 或 4
- **indent_type**：缩进类型，使用空格或 Tab
- **quotes**：字符串引号风格，单引号或双引号
- **semicolon**：是否使用行尾分号
- **line_width**：代码行的最大宽度
- **trailing_comma**：尾随逗号规则
- **end_of_line**：行尾序列，LF（Unix）、CRLF（Windows）或 CR（Mac）

#### 命名规范 (naming)

```yaml
code_standards:
  naming:
    variables: "camelCase"        # 变量命名
    functions: "camelCase"        # 函数命名
    files: "kebab-case"           # 文件命名
    constants: "UPPER_SNAKE_CASE"  # 常量命名
    classes: "PascalCase"         # 类命名
    components: "PascalCase"      # 组件命名
    types: "PascalCase"           # 类型命名
    interfaces: "PascalCase"      # 接口命名
    hooks: "camelCase"            # Hooks 命名（React，以 use 开头）
```

**命名风格说明：**
- **camelCase**：驼峰命名，如 `userName`、`getUserInfo`
- **PascalCase**：大驼峰命名，如 `UserProfile`、`OrderService`
- **kebab-case**：短横线分隔，如 `user-profile.tsx`、`order-list.vue`
- **UPPER_SNAKE_CASE**：全大写下划线分隔，如 `MAX_RETRY_COUNT`、`API_BASE_URL`

#### 组织规范 (organization)

```yaml
code_standards:
  organization:
    import_order:
      - "external"   # 第三方库
      - "internal"   # 内部模块（@/ 别名）
      - "relative"   # 相对路径
    file_structure: "feature-based"  # 文件组织结构
    config_location: "root"           # 配置文件位置
```

**文件结构类型：**
- **feature-based**：按功能模块组织
- **layered**：分层架构
- **mvc**：MVC 模式
- **component-based**：组件化组织
- **ddd**：领域驱动设计

### 4. 项目结构配置

```yaml
project_structure:
  pattern: "feature-based"        # 组织模式
  organization: "modular"         # "modular" | "monolithic"
  directory_structure:
    src: "src/"                  # 源代码目录
    components: "src/components/" # 组件目录
    pages: "src/pages/"          # 页面目录
    services: "src/services/"    # 服务目录
    utils: "src/utils/"          # 工具目录
    types: "src/types/"          # 类型目录
    styles: "src/styles/"        # 样式目录
    assets: "src/assets/"        # 资源目录
    stores: "src/stores/"         # 状态管理目录（可选）
    hooks: "src/hooks/"          # Hooks 目录（可选，React）
  config_location: "root"        # 配置文件位置
```

### 5. 代码模式配置

```yaml
code_patterns:
  architecture:
    pattern: "Component-based"   # 架构模式
    data_flow: "unidirectional"  # 数据流方向
  api:
    style: "REST"                # API 风格
    error_handling: "try-catch"  # 错误处理方式
  async:
    pattern: "async-await"        # 异步处理模式
  state_management:
    pattern: "zustand"           # 状态管理模式
  testing:
    strategy: "unit"             # 测试策略
    framework: "Vitest"          # 测试框架
```

## 完整配置示例

### H5 项目配置

```yaml
project_analysis:
  project_name: "H5 项目模板"
  project_type: "frontend"
  source: "default-code-standards"
  project_category: "h5"
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

### Web 项目配置

```yaml
project_analysis:
  project_name: "Web 项目模板"
  project_type: "frontend"
  source: "default-code-standards"
  project_category: "web"
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

## 使用方式

### 在工作流中应用

1. **识别项目类型**：确定是 H5 还是 Web 项目
2. **加载对应配置**：从 `h5-standards.md` 或 `web-standards.md` 加载配置
3. **应用到代码生成**：在代码生成时使用这些规范
4. **保存到用户偏好**：将配置保存到 `user-preferences.yaml` 供后续使用

### 配置合并

如果用户偏好文件已存在，应合并配置：

1. **保留用户自定义配置**：用户已自定义的部分保持不变
2. **应用默认规范**：缺失的部分使用默认规范填充
3. **标注来源**：在配置中标注 `source: "default-code-standards"`

## 字段验证

应用配置前，应验证以下字段：

- **必需字段**：`project_type`、`project_category`、`code_standards.style`、`code_standards.naming`
- **可选字段**：`tech_stack`、`project_structure`、`code_patterns`
- **类型检查**：确保字段值符合定义的类型和枚举值

## 最佳实践

1. **保持一致性**：同一项目类型使用统一的规范配置
2. **版本管理**：规范更新时，更新版本号或日期
3. **文档同步**：规范变更时，同步更新相关文档
4. **向后兼容**：新增字段时保持向后兼容
5. **验证配置**：应用配置前进行格式和内容验证

