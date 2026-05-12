# Apifox MCP 使用指南

## 可用工具

### 1. 读取 OpenAPI Spec

**工具：** `mcp_apifox_read_project_oas_{project_id}`

读取指定项目的 OpenAPI Spec 文件内容。

**使用场景：**
- 获取项目的完整 API 规范
- 了解项目的 API 结构

**参数：**
- `_`: 可选参数（通常不需要）

**返回：**
- OpenAPI Spec 的完整内容（JSON/YAML 格式）

### 2. 读取 $ref 引用资源

**工具：** `mcp_apifox_read_project_oas_ref_resources_{project_id}`

读取 OpenAPI Spec 文件中 $ref 引用的文件内容。

**使用场景：**
- 当 OpenAPI Spec 使用 $ref 引用外部文件时
- 需要获取引用的详细定义

**参数：**
- `path`: 数组，包含 $ref 的路径列表，例如：`["/paths/_get_pet.json", "/paths/_get_order.json"]`

**返回：**
- 引用的文件内容

### 3. 刷新 OpenAPI Spec

**工具：** `mcp_apifox_refresh_project_oas_{project_id}`

从服务器重新下载最新的 OpenAPI Spec 文件。

**使用场景：**
- 当 API 规范有更新时
- 确保获取最新的 API 定义

**参数：**
- `_`: 可选参数（通常不需要）

## 使用流程

### 步骤 1：获取项目 OpenAPI Spec

```python
# 读取项目的 OpenAPI Spec
spec = mcp_apifox_read_project_oas_{project_id}()

# 解析 Spec 内容
# 通常返回的是 JSON 格式的 OpenAPI 3.0 规范
```

### 步骤 2：搜索接口

在 OpenAPI Spec 中搜索匹配的接口：

**搜索策略：**
1. **路径匹配**：根据接口路径（path）匹配
   - 精确匹配：完全匹配路径
   - 部分匹配：路径包含关键词
   - 模式匹配：使用正则表达式
   - **多风格匹配**（重要）：
     - 下划线风格：`activity_scene`、`send_detail`、`find_goods_list`
     - 驼峰风格：`activityScene`、`sendDetail`、`findGoodsList`
     - 中划线风格：`activity-scene`、`send-detail`
     - 同时尝试多种命名风格的变体

2. **操作匹配**：根据 HTTP 方法匹配
   - GET、POST、PUT、DELETE、PATCH
   - **注意**：列表查询可能使用 POST（非标准 RESTful），需要同时搜索 GET 和 POST

3. **操作动词匹配**：在路径中搜索操作动词
   - `get_`、`find_`、`create`、`update`、`delete`、`remove`
   - 支持在路径任意位置匹配操作动词

4. **标签匹配**：根据接口标签（tags）匹配
   - 通常标签表示功能模块
   - 支持中英文标签匹配

5. **描述匹配**：根据接口描述（description）匹配
   - 在描述中搜索关键词
   - 支持中英文描述匹配

6. **资源名匹配**：提取资源名进行匹配
   - 从路径中提取资源名（去除版本号、操作动词等）
   - 例如：`/v2/web_api/goods/find_goods_list` → 提取 `goods`
   - 支持资源名的多种命名风格变体

### 步骤 3：提取接口信息

从匹配的接口中提取信息：

**基本信息：**
- 接口路径（path）- 保留完整路径，包括版本号
- HTTP 方法（method）- 注意非标准用法（如列表查询用 POST）
- 接口描述（description）
- 接口标签（tags）

**请求信息：**
- 请求参数（parameters）
- 请求体（requestBody）
- 请求数据类型（contentType）- 注意可能是 `application/x-www-form-urlencoded` 或 `application/json`
- 请求示例

**响应信息：**
- 响应状态码
- 响应体结构（response schema）
- 响应数据类型（contentType）
- 响应示例
- **注意**：响应可能包含嵌套结构，如 `model.result`、`data.model` 等

### 步骤 4：处理 $ref 引用

如果接口定义中使用了 $ref 引用：

```python
# 提取所有 $ref 路径
ref_paths = extract_ref_paths(interface_definition)

# 读取引用的内容
if ref_paths:
    ref_contents = mcp_apifox_read_project_oas_ref_resources_{project_id}(
        path=ref_paths
    )
    # 合并引用内容到接口定义
    complete_definition = merge_refs(interface_definition, ref_contents)
```

## 错误处理

### MCP 连接失败

**症状：** 调用 MCP 工具时返回连接错误

**处理：**
- 检查 Apifox MCP server 是否正常运行
- 检查 MCP 配置是否正确
- 提示用户检查 MCP 连接状态

### 项目不存在

**症状：** 读取 OpenAPI Spec 时返回项目不存在

**处理：**
- 确认项目 ID 是否正确
- 检查项目是否在 Apifox 中可见
- 提示用户确认项目配置

### 接口未找到

**症状：** 搜索接口时没有找到匹配的结果

**处理：**
- 尝试更宽泛的搜索关键词
- 尝试不同的匹配策略
- 检查接口命名是否与预期不同
- 返回部分匹配的结果（如果有）

### Spec 格式错误

**症状：** 解析 OpenAPI Spec 时出错

**处理：**
- 尝试刷新 Spec：`mcp_apifox_refresh_project_oas_{project_id}()`
- 检查 Spec 格式是否符合 OpenAPI 规范
- 记录错误信息，继续处理其他接口

## 最佳实践

1. **缓存 Spec**：首次读取后缓存 Spec 内容，避免重复读取
2. **增量搜索**：先进行精确匹配，再逐步放宽匹配条件
3. **结果验证**：对找到的接口进行验证，确保符合需求
4. **关联查找**：找到接口后，主动查找相关的 CRUD 接口
5. **错误恢复**：单个接口查找失败时，继续处理其他接口

