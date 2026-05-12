# 输出格式规范

## YAML 格式（用户偏好文件）

模板分析结果应保存为 YAML 格式，用于后续代码生成时参考。

### 文件位置

```
{project-root}/_bmad/_cfg/user-preferences.yaml
```

### 数据结构

```yaml
# 项目分析结果
project_analysis:
  # 项目基本信息
  project_name: "项目名称"
  project_type: "frontend" | "backend" | "fullstack"
  analysis_date: "2024-01-01T00:00:00Z"
  source: "gitlab" | "local"
  source_path: "项目来源路径或 URL"

  # 技术栈
  tech_stack:
    frontend:
      framework: "React" | "Vue" | "Angular" | null
      version: "18.2.0"  # 版本号（可选）
      ui_library: "Ant Design" | "Element UI" | "Material-UI" | null
      state_management: "Redux" | "Vuex" | "Zustand" | null
      build_tool: "Vite" | "Webpack" | "Next.js" | null
      language: "TypeScript" | "JavaScript"
    
    backend:
      framework: "Spring Boot" | "Express" | "Django" | "Flask" | null
      version: "2.7.0"  # 版本号（可选）
      orm: "MyBatis" | "Hibernate" | "Sequelize" | "SQLAlchemy" | null
      database: "MySQL" | "PostgreSQL" | "MongoDB" | null
      language: "Java" | "Python" | "JavaScript" | "Go"
    
    tools:
      code_quality:
        - "ESLint"
        - "Prettier"
      testing:
        - "Jest"
        - "React Testing Library"
      ci_cd:
        - "GitHub Actions"
        - "GitLab CI"

  # 代码规范
  code_standards:
    style:
      indent: 2  # 缩进空格数
      indent_type: "spaces" | "tabs"
      quotes: "single" | "double"
      semicolon: true | false
      line_width: 100
      trailing_comma: "es5" | "all" | "none"
      end_of_line: "lf" | "crlf" | "cr"
    
    naming:
      variables: "camelCase" | "snake_case" | "PascalCase"
      functions: "camelCase" | "snake_case" | "PascalCase"
      files: "kebab-case" | "camelCase" | "PascalCase" | "snake_case"
      constants: "UPPER_SNAKE_CASE" | "PascalCase"
      classes: "PascalCase"
      components: "PascalCase" | "kebab-case"
    
    organization:
      import_order:
        - "external"  # 第三方库
        - "internal"  # 内部模块
        - "relative"  # 相对路径
      file_structure: "feature-based" | "layered" | "mvc" | "component-based" | "ddd"
      config_location: "root" | "src" | "config"
    
    comments:
      style: "jsdoc" | "standard" | "none"
      required: true | false

  # 项目结构
  project_structure:
    pattern: "feature-based" | "layered" | "mvc" | "component-based" | "ddd"
    organization: "modular" | "monolithic"
    directory_structure:
      src: "src/" | "app/" | "lib/"
      components: "components/" | "components/ui/"
      pages: "pages/" | "views/" | "routes/"
      services: "services/" | "api/" | "utils/"
      styles: "styles/" | "css/" | "scss/"
    config_location: "root" | "src" | "config"

  # 代码要点
  code_patterns:
    architecture:
      pattern: "MVC" | "MVVM" | "Repository" | "DDD" | null
      data_flow: "unidirectional" | "bidirectional" | null
    
    api:
      style: "REST" | "GraphQL" | "RPC" | null
      error_handling: "try-catch" | "promise-catch" | "error-boundary" | null
    
    async:
      pattern: "async-await" | "promise" | "observable" | null
    
    state_management:
      pattern: "redux" | "context" | "mobx" | "vuex" | null
    
    testing:
      strategy: "unit" | "integration" | "e2e" | "all"
      framework: "Jest" | "Mocha" | "Pytest" | null

  # 最佳实践
  best_practices:
    - "使用 TypeScript 进行类型检查"
    - "组件使用函数式组件和 Hooks"
    - "API 调用统一使用 service 层"
    - "错误处理使用统一错误边界"

  # 配置文件路径（用于参考）
  config_files:
    eslint: ".eslintrc.js"
    prettier: ".prettierrc"
    typescript: "tsconfig.json"
    package: "package.json"
```

### 字段说明

- **project_analysis**: 项目分析结果的根对象
- **project_name**: 项目名称（从 README 或 package.json 提取）
- **project_type**: 项目类型（frontend/backend/fullstack）
- **analysis_date**: 分析时间（ISO 8601 格式）
- **source**: 项目来源（gitlab/local）
- **source_path**: 项目来源路径或 URL
- **tech_stack**: 技术栈信息，按前端/后端/工具分类
- **code_standards**: 代码规范配置，包含风格、命名、组织、注释等
- **project_structure**: 项目结构信息，包含模式、组织方式、目录结构等
- **code_patterns**: 代码模式和架构模式
- **best_practices**: 最佳实践列表
- **config_files**: 配置文件路径，便于后续参考

### 保存方式

1. **新建文件**：如果用户偏好文件不存在，创建新文件
2. **合并更新**：如果文件已存在，合并更新相关字段
3. **备份原文件**：更新前备份原文件（可选，建议）

## Markdown 格式（分析报告）

用于展示给用户的分析报告，采用 Markdown 格式。

### 报告结构

```markdown
# 项目分析报告

## 项目信息

- **项目名称**: {project_name}
- **项目类型**: {project_type}
- **分析时间**: {analysis_date}
- **项目来源**: {source} - {source_path}

## 技术栈

### 前端技术栈

- **框架**: {frontend.framework} {version}
- **UI 组件库**: {frontend.ui_library}
- **状态管理**: {frontend.state_management}
- **构建工具**: {frontend.build_tool}
- **开发语言**: {frontend.language}

### 后端技术栈

- **框架**: {backend.framework} {version}
- **ORM 框架**: {backend.orm}
- **数据库**: {backend.database}
- **开发语言**: {backend.language}

### 工具链

- **代码质量**: {tools.code_quality}
- **测试框架**: {tools.testing}
- **CI/CD**: {tools.ci_cd}

## 代码规范

### 代码风格

- **缩进**: {style.indent} {style.indent_type}
- **引号**: {style.quotes}
- **分号**: {style.semicolon ? '使用' : '不使用'}
- **行宽**: {style.line_width}
- **尾随逗号**: {style.trailing_comma}

### 命名规范

- **变量**: {naming.variables}
- **函数**: {naming.functions}
- **文件**: {naming.files}
- **常量**: {naming.constants}
- **类**: {naming.classes}
- **组件**: {naming.components}

### 组织规范

- **导入顺序**: {organization.import_order}
- **文件结构**: {organization.file_structure}
- **配置位置**: {organization.config_location}

## 项目结构

- **组织模式**: {project_structure.pattern}
- **组织方式**: {project_structure.organization}
- **目录结构**:
  - 源代码: {directory_structure.src}
  - 组件: {directory_structure.components}
  - 页面: {directory_structure.pages}
  - 服务: {directory_structure.services}
  - 样式: {directory_structure.styles}

## 代码要点

### 架构模式

- **设计模式**: {code_patterns.architecture.pattern}
- **数据流**: {code_patterns.architecture.data_flow}

### API 设计

- **API 风格**: {code_patterns.api.style}
- **错误处理**: {code_patterns.api.error_handling}

### 异步处理

- **异步模式**: {code_patterns.async.pattern}

### 状态管理

- **状态管理模式**: {code_patterns.state_management.pattern}

## 最佳实践

{best_practices 列表}

## 配置文件

- ESLint: {config_files.eslint}
- Prettier: {config_files.prettier}
- TypeScript: {config_files.typescript}
- Package: {config_files.package}
```

## 输出策略

1. **YAML 格式优先**：主要用于保存配置，供后续代码生成使用
2. **Markdown 格式辅助**：用于展示给用户，便于理解和验证
3. **字段完整性**：尽可能填充所有字段，缺失的字段使用 `null` 或标注
4. **格式验证**：确保 YAML 格式正确，避免解析错误
5. **版本控制**：保留分析历史，便于追踪变化

## 最佳实践

1. **结构化输出**：使用统一的数据结构，便于后续处理
2. **字段标准化**：使用标准化的字段值，避免歧义
3. **可扩展性**：数据结构支持扩展，便于添加新字段
4. **向后兼容**：更新数据结构时保持向后兼容
5. **文档同步**：输出格式变更时同步更新文档

