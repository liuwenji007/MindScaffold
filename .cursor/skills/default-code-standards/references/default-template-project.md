# 默认模板项目配置

## 默认模板项目

**项目信息：**
- **项目名称**：osmp-web
- **GitLab 地址**：`https://gitlab.starcharge.com/associated-business-center/osmp-web`
- **项目类型**：Web 管理后台项目（运营管理平台）
- **用途**：作为公司标准 Web 项目的默认模板

## 使用方式

### 在工作流中使用

在 `step-04-code-standards.md` 工作流中，当用户没有提供模板项目时：

1. **询问用户是否使用默认模板项目**
   - 提示："是否使用公司默认模板项目（osmp-web）？"
   - 如果用户选择"是"，则使用此项目作为模板

2. **使用模板分析 skill 分析项目**
   - 加载 `template-analyzer` skill
   - 使用 GitLab MCP 获取项目信息
   - 分析项目结构、代码规范、技术栈等
   - 提取代码标准和约定

3. **保存分析结果**
   - 将分析结果保存到用户偏好文件
   - 供后续代码生成使用

### 直接应用默认配置

如果无法访问 GitLab 或需要快速应用配置，可以直接使用预设配置（基于 osmp-web 项目）：

## 预设配置（Web 管理后台）

基于 osmp-web 项目的标准配置，已保存在 `saas-admin-standards.md` 中，可直接加载使用。

如需查看完整配置，请参考 [saas-admin-standards.md](saas-admin-standards.md)。

以下是配置概览：

```yaml
project_analysis:
  project_name: "osmp-web"
  project_type: "frontend"
  source: "default-code-standards"
  source_path: "https://gitlab.starcharge.com/associated-business-center/osmp-web"
  project_category: "web"
  tech_stack:
    frontend:
      framework: "React"
      version: "18.x"
      ui_library: "Ant Design"
      state_management: "Redux Toolkit"  # 或 Zustand，需根据实际项目确认
      build_tool: "Vite"  # 或 Webpack，需根据实际项目确认
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
      pattern: "redux-toolkit"  # 需根据实际项目确认
```

## 项目分析流程

### 使用模板分析 skill

1. **获取项目信息**
   ```markdown
   使用 GitLab MCP 获取项目：
   - 项目 ID: associated-business-center/osmp-web
   - 读取 package.json 了解技术栈
   - 读取项目结构了解组织方式
   - 读取配置文件了解代码规范
   ```

2. **分析项目结构**
   - 使用 `template-analyzer` skill 分析项目
   - 提取技术栈信息
   - 提取代码规范配置
   - 提取项目结构模式

3. **应用分析结果**
   - 将分析结果保存到用户偏好文件
   - 在代码生成时应用这些规范

### 分析要点

分析 osmp-web 项目时，重点关注：

1. **技术栈识别**
   - React 版本
   - UI 组件库（Ant Design）
   - 状态管理方案
   - 构建工具
   - TypeScript 配置

2. **代码规范提取**
   - ESLint 配置
   - Prettier 配置
   - 代码风格（缩进、引号、分号等）
   - 命名规范

3. **项目结构分析**
   - 目录组织方式
   - 文件命名规范
   - 模块划分方式

4. **代码模式识别**
   - API 调用方式
   - 状态管理模式
   - 组件组织方式

## 配置更新

当 osmp-web 项目更新时：

1. **重新分析项目**
   - 使用模板分析 skill 重新分析项目
   - 提取最新的代码规范和结构

2. **更新预设配置**
   - 更新 `saas-admin-standards.md` 中的配置
   - 确保配置与实际项目保持一致

3. **同步到用户偏好**
   - 如果用户偏好文件使用了此模板，提示更新
   - 提供配置迁移指南

## 注意事项

1. **GitLab 访问权限**：确保有权限访问该 GitLab 项目
2. **项目变更**：项目结构或规范变更时，及时更新配置
3. **版本兼容**：注意项目依赖版本，确保兼容性
4. **配置验证**：应用配置前，验证配置的完整性和正确性

## 相关资源

- **模板分析 skill**：`_bmad/scp/skills/template-analyzer/SKILL.md`
- **Web 项目规范**：`references/web-standards.md`
- **规范格式说明**：`references/standards-format.md`

