---
name: template-analyzer
description: 模板项目分析工具。分析模板项目或代码库的技术框架、代码规范、项目结构模式和代码要点，提取关键信息并整理成结构化格式，用于指导后续代码生成。适用于：从 GitLab 项目或本地路径分析模板项目的场景、需要提取代码标准和约定的场景、工作流中需要自动分析项目结构的场景。
---

# Template Analyzer

模板项目分析工具，帮助分析模板项目的技术框架、代码规范和项目结构，提取关键信息用于指导代码生成。

## 工作流程

模板分析遵循以下步骤：

1. **获取项目来源** - 从 GitLab 地址或本地路径获取项目
2. **项目结构分析** - 识别项目结构、技术栈、依赖关系
3. **代码规范提取** - 提取代码风格、命名规范、文件组织方式
4. **技术框架识别** - 识别使用的框架、库、工具链
5. **代码要点提取** - 提取关键代码模式、最佳实践、架构模式
6. **信息整理** - 将分析结果整理成结构化格式
7. **保存配置** - 保存到用户偏好文件供后续使用

## 快速开始

### 1. 接收项目来源

接收来自工作流或其他工具的输入：

- **GitLab 地址**：项目 URL 或项目 ID
- **本地路径**：相对项目根目录的路径
- **项目类型**：前端/后端/全栈（可选，用于优化分析）

### 2. 获取项目信息

根据来源选择相应的处理方式：

**GitLab 地址：**
- 使用 GitLab MCP 获取项目信息
- 读取项目文件结构和内容
- 提取项目元数据（README、配置文件等）

**本地路径：**
- 读取本地项目文件
- 分析项目目录结构
- 读取关键配置文件

详细处理指南见 [references/project-sources.md](references/project-sources.md)。

### 3. 项目结构分析

识别项目的组织结构和模式：

**分析维度：**
- 目录结构模式（MVC、模块化、功能导向等）
- 文件命名规范（kebab-case、camelCase、PascalCase 等）
- 配置文件位置和类型
- 依赖管理方式（package.json、requirements.txt、pom.xml 等）

**识别策略：**
- 分析根目录结构
- 识别常见的项目模板模式
- 分析配置文件类型和位置

详细分析方法见 [references/project-structure-patterns.md](references/project-structure-patterns.md)。

### 4. 技术框架识别

识别项目使用的技术栈：

**前端框架：**
- React、Vue、Angular 等
- UI 组件库（Ant Design、Element UI、Material-UI 等）
- 状态管理（Redux、Vuex、MobX 等）
- 构建工具（Webpack、Vite、Rollup 等）

**后端框架：**
- Spring Boot、Express、Django、Flask 等
- ORM 框架（Hibernate、Sequelize、SQLAlchemy 等）
- 数据库类型（MySQL、PostgreSQL、MongoDB 等）

**工具链：**
- 代码检查工具（ESLint、Prettier、Pylint 等）
- 测试框架（Jest、Mocha、Pytest 等）
- CI/CD 配置（GitHub Actions、GitLab CI、Jenkins 等）

详细识别方法见 [references/tech-stack-identification.md](references/tech-stack-identification.md)。

### 5. 代码规范提取

提取项目的代码规范和约定：

**代码风格：**
- 缩进方式（空格数、Tab）
- 引号风格（单引号、双引号）
- 行尾分号（使用/不使用）
- 代码格式化规则

**命名规范：**
- 变量命名（camelCase、snake_case、PascalCase）
- 函数命名（动词开头、命名模式）
- 文件命名（kebab-case、PascalCase）
- 常量命名（UPPER_SNAKE_CASE）

**组织规范：**
- 导入顺序
- 文件组织方式
- 注释风格
- 文档规范

详细提取方法见 [references/code-standards-extraction.md](references/code-standards-extraction.md)。

### 6. 代码要点提取

提取关键代码模式和最佳实践：

**架构模式：**
- 设计模式使用（MVC、MVVM、Repository 等）
- 组件/模块组织方式
- 数据流设计（单向数据流、双向绑定等）

**代码模式：**
- API 调用方式（REST、GraphQL、RPC）
- 错误处理模式
- 异步处理方式（Promise、async/await、Observable）
- 状态管理模式

**最佳实践：**
- 代码复用方式
- 性能优化技巧
- 安全实践
- 测试策略

### 7. 信息整理

将分析结果整理成结构化格式：

**输出内容：**
- 项目概述（名称、类型、描述）
- 技术栈清单
- 代码规范配置
- 项目结构说明
- 代码要点总结

**输出格式：**
- YAML 格式（用于保存到用户偏好文件）
- Markdown 格式（用于展示和文档）

详细格式规范见 [references/output-format.md](references/output-format.md)。

### 8. 保存配置

将分析结果保存到用户偏好文件：

**保存位置：**
- `{project-root}/_bmad/_cfg/user-preferences.yaml`

**保存内容：**
- 技术栈配置
- 代码规范配置
- 项目结构偏好
- 代码生成指导

保存格式见 [references/output-format.md](references/output-format.md)。

## 使用示例

### 示例 1：分析 GitLab 项目

**输入：**
```
GitLab 项目地址：https://gitlab.com/example/react-template
```

**处理流程：**
1. 使用 GitLab MCP 获取项目信息
2. 读取项目文件结构和关键文件
3. 分析技术栈（React + TypeScript + Ant Design）
4. 提取代码规范（ESLint + Prettier 配置）
5. 识别项目结构（功能模块化组织）
6. 整理并保存到用户偏好文件

### 示例 2：分析本地项目

**输入：**
```
本地路径：./templates/spring-boot-template
```

**处理流程：**
1. 读取本地项目文件
2. 分析技术栈（Spring Boot + MyBatis + MySQL）
3. 提取代码规范（Java 代码风格、包结构）
4. 识别项目结构（分层架构）
5. 整理并保存配置

## 错误处理

### 项目无法访问

**情况：** GitLab 项目无法访问或本地路径不存在

**处理：**
- 提示检查项目地址或路径
- 建议提供正确的项目信息
- 返回部分分析结果（如有）

### 项目结构不清晰

**情况：** 无法识别项目结构或技术栈

**处理：**
- 返回可识别的部分信息
- 标注不确定的部分
- 建议手动补充配置

### 配置文件缺失

**情况：** 缺少关键配置文件（package.json、pom.xml 等）

**处理：**
- 基于文件结构推断技术栈
- 使用默认代码规范
- 标注缺失的配置

## 输出格式

### YAML 格式（用户偏好文件）

```yaml
tech_stack:
  frontend:
    framework: React
    ui_library: Ant Design
    state_management: Redux
  backend:
    framework: Spring Boot
    orm: MyBatis
    database: MySQL

code_standards:
  style:
    indent: 2
    quotes: single
    semicolon: false
  naming:
    variables: camelCase
    functions: camelCase
    files: kebab-case
    constants: UPPER_SNAKE_CASE

project_structure:
  pattern: feature-based
  organization: modular
  config_location: root
```

详细格式规范见 [references/output-format.md](references/output-format.md)。

### Markdown 格式（分析报告）

```markdown
# 项目分析报告

## 技术栈
- 前端：React + TypeScript
- UI 库：Ant Design
- 状态管理：Redux

## 代码规范
- 缩进：2 空格
- 引号：单引号
- 命名：camelCase

## 项目结构
- 模式：功能模块化
- 组织：按功能划分目录
```

## 工具依赖

- **GitLab MCP**：用于从 GitLab 获取项目信息（如果使用 GitLab 输入）
- **文件读取工具**：用于读取本地项目文件

## 最佳实践

1. **明确项目类型**：提供项目类型信息有助于优化分析
2. **验证分析结果**：对提取的配置进行验证，确保准确性
3. **补充缺失信息**：对于无法自动识别的部分，建议手动补充
4. **定期更新**：项目结构变化时，重新分析以更新配置
5. **保存备份**：分析结果保存前，建议备份现有用户偏好文件

## Resources

### references/

- **project-sources.md** - 项目来源处理指南，包含 GitLab 和本地路径的处理方法
- **project-structure-patterns.md** - 项目结构模式识别，包含常见项目组织方式和识别方法
- **tech-stack-identification.md** - 技术栈识别方法，包含框架、库和工具的识别策略
- **code-standards-extraction.md** - 代码规范提取方法，包含代码风格、命名规范和组织规范的提取流程
- **output-format.md** - 输出格式规范，包含 YAML 和 Markdown 格式的详细说明

