# 项目来源处理指南

## GitLab 项目

### 获取项目信息

使用 GitLab MCP 工具获取项目信息：

**步骤：**
1. 解析 GitLab URL 或项目 ID
2. 使用 `mcp_gitlab_get_file_contents` 获取项目根目录内容
3. 读取关键文件（README、配置文件等）
4. 分析项目结构

**GitLab MCP 工具：**
- `mcp_gitlab_get_file_contents` - 获取文件或目录内容
- `mcp_gitlab_list_commits` - 获取提交历史（可选，用于了解项目演进）
- `mcp_gitlab_get_project_events` - 获取项目活动（可选）

**关键文件读取：**
- `README.md` - 项目说明和文档
- `package.json` / `pom.xml` / `requirements.txt` - 依赖配置
- `.gitignore` - 忽略文件配置
- 配置文件（`.eslintrc`、`tsconfig.json`、`pom.xml` 等）

### 处理流程

1. **解析项目标识**
   - 从 URL 提取项目 ID 或路径
   - 验证项目可访问性

2. **读取项目结构**
   - 获取根目录文件列表
   - 识别项目类型（前端/后端/全栈）
   - 读取关键配置文件

3. **深度分析**
   - 读取源代码目录结构
   - 分析主要模块组织
   - 提取代码示例

### 错误处理

**项目无法访问：**
- 检查 URL 或项目 ID 是否正确
- 验证访问权限
- 提示用户提供正确的项目信息

**MCP 未配置：**
- 提示安装和配置 GitLab MCP
- 建议使用本地路径作为替代方案

## 本地路径

### 读取项目文件

从本地路径读取项目：

**步骤：**
1. 验证路径存在性
2. 读取项目根目录结构
3. 读取关键配置文件
4. 分析源代码目录

**关键文件读取：**
- 使用 `list_dir` 获取目录结构
- 使用 `read_file` 读取配置文件
- 使用 `glob_file_search` 查找特定类型文件

### 处理流程

1. **路径验证**
   - 检查路径是否存在
   - 验证是否为有效项目目录
   - 识别项目类型

2. **结构分析**
   - 读取根目录文件列表
   - 识别项目组织模式
   - 分析目录层级

3. **文件读取**
   - 读取配置文件
   - 读取源代码示例
   - 读取文档文件

### 错误处理

**路径不存在：**
- 提示检查路径是否正确
- 建议使用绝对路径
- 验证路径权限

**项目结构不清晰：**
- 基于可读文件推断项目类型
- 使用默认分析策略
- 标注不确定的部分

## 项目类型识别

### 前端项目

**识别特征：**
- 存在 `package.json` 且包含前端框架依赖
- 存在 `src/` 或 `app/` 目录
- 存在构建配置文件（`webpack.config.js`、`vite.config.js` 等）
- 存在 `public/` 或 `static/` 目录

**关键文件：**
- `package.json` - 依赖和脚本
- `tsconfig.json` / `jsconfig.json` - TypeScript/JavaScript 配置
- `.eslintrc.*` - 代码检查配置
- `vite.config.js` / `webpack.config.js` - 构建配置

### 后端项目

**识别特征：**
- 存在 `pom.xml`（Java Maven）
- 存在 `build.gradle`（Java Gradle）
- 存在 `requirements.txt`（Python）
- 存在 `go.mod`（Go）
- 存在 `package.json` 且包含后端框架（Express、Koa 等）

**关键文件：**
- `pom.xml` / `build.gradle` - Java 项目配置
- `requirements.txt` / `setup.py` - Python 项目配置
- `application.yml` / `application.properties` - Spring Boot 配置
- `Dockerfile` - 容器化配置

### 全栈项目

**识别特征：**
- 同时包含前端和后端目录
- 存在 `monorepo` 结构（如 `packages/`、`apps/`）
- 存在统一的项目配置文件

**关键文件：**
- 根目录的 `package.json` 或 `lerna.json`
- 前端和后端各自的配置文件
- 统一的构建和部署配置

## 最佳实践

1. **优先读取配置文件**：配置文件通常包含最准确的项目信息
2. **读取示例代码**：源代码示例有助于理解代码风格和模式
3. **分析目录结构**：目录组织方式反映项目架构
4. **验证分析结果**：对提取的信息进行交叉验证
5. **处理异常情况**：妥善处理项目结构不标准的情况


