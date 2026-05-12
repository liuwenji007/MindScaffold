# 分页参数命名模式

## 请求参数命名

### 页码参数

常见的页码参数命名：

| 参数名 | 说明 | 示例值 |
|--------|------|--------|
| `page` | 页码（最常见） | 1, 2, 3 |
| `pageNum` | 页码 | 1, 2, 3 |
| `pageNo` | 页码 | 1, 2, 3 |
| `currentPage` | 当前页码 | 1, 2, 3 |
| `pageIndex` | 页码索引 | 0, 1, 2（可能从0开始） |

### 每页数量参数

常见的每页数量参数命名：

| 参数名 | 说明 | 示例值 |
|--------|------|--------|
| `pageSize` | 每页数量（最常见） | 10, 20, 50 |
| `pagecount` | 每页数量 | 10, 20, 50 |
| `size` | 每页数量 | 10, 20, 50 |
| `limit` | 每页数量 | 10, 20, 50 |
| `pageLength` | 每页数量 | 10, 20, 50 |
| `rows` | 每页行数 | 10, 20, 50 |

### 常见组合

**组合 1：标准组合**
- `page` + `pageSize`
- 示例：`?page=1&pageSize=10`

**组合 2：变体组合**
- `page` + `pagecount`
- 示例：`?page=1&pagecount=10`

**组合 3：其他组合**
- `pageNum` + `size`
- `currentPage` + `limit`
- `pageNo` + `rows`

## 响应字段命名

### 分页信息字段

常见的分页响应字段命名：

| 字段名 | 说明 | 示例值 |
|--------|------|--------|
| `total` | 总记录数 | 100 |
| `totalCount` | 总记录数 | 100 |
| `totalRecords` | 总记录数 | 100 |
| `totalPage` | 总页数 | 10 |
| `totalPages` | 总页数 | 10 |
| `currentPage` | 当前页码 | 1 |
| `page` | 当前页码 | 1 |
| `pageSize` | 每页数量 | 10 |
| `pageCount` | 每页数量 | 10 |
| `size` | 每页数量 | 10 |
| `nextPage` | 下一页 | 2 |
| `previousPage` | 上一页 | 0 或 null |
| `hasNext` | 是否有下一页 | true/false |
| `hasPrevious` | 是否有上一页 | true/false |

### 数据列表字段

常见的列表数据字段命名：

| 字段名 | 说明 |
|--------|------|
| `list` | 列表数据 |
| `data` | 数据列表 |
| `items` | 数据项 |
| `results` | 结果列表 |
| `records` | 记录列表 |

## 响应结构示例

### 结构 1：标准结构

```json
{
  "code": "S00000",
  "message": "成功",
  "data": {
    "list": [],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPage": 10
  },
  "success": true
}
```

### 结构 2：嵌套结构

```json
{
  "code": "S00000",
  "message": "成功",
  "data": {
    "result": [],
    "currentPage": 1,
    "pageSize": 10,
    "totalCount": 100,
    "totalPage": 10
  },
  "success": true
}
```

### 结构 3：分页对象结构

```json
{
  "code": "S00000",
  "message": "成功",
  "data": {
    "list": [],
    "pagination": {
      "page": 1,
      "pagecount": 10,
      "total": 100,
      "totalPage": 10
    }
  },
  "success": true
}
```

### 结构 4：查询对象结构

```json
{
  "code": "S00000",
  "message": "成功",
  "data": {
    "result": [],
    "query": {
      "page": 1,
      "pageSize": 10
    },
    "currentPage": 1,
    "totalPage": 10,
    "amount": 100
  },
  "success": true
}
```

## 识别策略

### 请求参数识别

在整理接口信息时，应该：

1. **识别分页参数**
   - 查找包含 `page`、`size`、`count`、`limit` 等关键词的参数
   - 注意参数名的变体（`pagecount`、`pageSize` 等）

2. **标注参数类型**
   - 明确是页码参数还是每页数量参数
   - 标注参数的默认值和取值范围

3. **提供备选命名**
   - 如果接口使用非标准命名，标注可能的备选命名
   - 例如：`pagecount` 的备选 `pageSize`、`size`

### 响应字段识别

在整理接口信息时，应该：

1. **识别分页字段**
   - 查找 `total`、`page`、`size`、`count` 等字段
   - 注意字段可能在不同的层级（`data.total`、`model.total`）

2. **识别列表字段**
   - 查找 `list`、`data`、`result`、`items` 等字段
   - 注意字段可能嵌套在响应结构中

3. **完整分页信息**
   - 确保包含：总记录数、当前页码、每页数量、总页数
   - 如果缺少某些字段，标注说明

## 整理建议

### 接口文档中的分页参数

```markdown
### 请求信息
- **查询参数：**
  - `page` (integer) - 可选 - 页码，默认 1
  - `pageSize` / `pagecount` / `size` (integer) - 可选 - 每页数量，默认 10

**注意：** 分页参数命名可能不同，常见的有：
- 页码：`page`、`pageNum`、`pageNo`、`currentPage`
- 每页数量：`pageSize`、`pagecount`、`size`、`limit`
```

### 接口文档中的分页响应

```markdown
### 响应信息
- **分页字段：**
  - `total` - 总记录数
  - `page` / `currentPage` - 当前页码
  - `pageSize` / `pagecount` / `size` - 每页数量
  - `totalPage` / `totalPages` - 总页数
  - `list` / `result` / `data` - 列表数据
```

## 常见问题

### Q: 如何确定分页参数的命名？

A: 查看接口文档或实际请求示例，如果文档不明确，可以：
1. 查看 Apifox 中的接口定义
2. 查看请求参数表
3. 查看请求示例

### Q: 响应中的分页字段在哪里？

A: 分页字段可能在：
1. 响应根级别：`{ total, page, pageSize }`
2. `data` 对象中：`{ data: { total, page, pageSize } }`
3. `model` 对象中：`{ model: { total, page, pageSize } }`
4. 嵌套的分页对象中：`{ pagination: { total, page, pageSize } }`

### Q: 如何处理不同的分页参数命名？

A: 在整理接口信息时：
1. 使用接口实际使用的参数名
2. 在描述中标注可能的备选命名
3. 在 JSON 格式中使用 `alternatives` 字段标注备选命名

