# 接口信息整理格式

## 输出结构

整理后的接口信息应该包含以下结构，便于工作流后续使用：

### 接口列表格式

```markdown
# 识别的接口列表

## 接口 1：{接口名称}

### 基本信息
- **路径：** `{HTTP方法} {接口路径}`
- **描述：** {接口描述}
- **标签：** {接口标签}

### 请求信息
- **参数：**
  - {参数名} ({类型}) - {是否必填} - {描述}
- **请求体：**
  ```json
  {请求体示例}
  ```

### 响应信息
- **HTTP 状态码：** {HTTP状态码，通常是200}
- **业务状态码：**
  - `S00000` - 成功
  - `E00001` - 系统错误
  - `E00002` - 网络异常
  - `E00003` - 请求参数错误
  - `E00004` - 验证失败
  - `E00005` - 您还未登录
  - `E00006` - 数据已过期
  - `E00007` - 权限不足
  - `E00008` - 次数超过限制
  - `E00009` - 频次超限
  - `E00010` - 资源或者数据不存在
  - `E00011` - 资源或者数据已经存在
  - `E00012` - 格式不合法
  - `E00013` - 请求被限制或者拒绝
  - `E00014` - 数据格式错误
  - `E00015` - 功能已不支持
  - `E00016` - 数据或版本不匹配
- **成功响应示例：**
  ```json
  {
    "code": "S00000",
    "message": "成功",
    "data": {},
    "success": true
  }
  ```
- **错误响应示例：**
  ```json
  {
    "code": "E00003",
    "message": "请求参数错误",
    "data": {},
    "success": false
  }
  ```

---

## 接口 2：{接口名称}
...
```

### JSON 格式（供程序使用）

```json
{
  "interfaces": [
    {
      "name": "接口名称",
      "path": "/api/resource",
      "method": "GET",
      "description": "接口描述",
      "tags": ["标签1", "标签2"],
      "request": {
        "parameters": [
          {
            "name": "参数名",
            "type": "string",
            "required": true,
            "description": "参数描述"
          }
        ],
        "body": {
          "schema": {},
          "example": {}
        }
      },
      "response": {
        "httpStatus": 200,
        "businessCodes": {
          "success": {
            "code": "S00000",
            "message": "成功"
          },
          "errors": [
            {
              "code": "E00001",
              "message": "系统错误"
            },
            {
              "code": "E00003",
              "message": "请求参数错误"
            }
          ]
        },
        "success": {
          "code": "S00000",
          "schema": {},
          "example": {}
        },
        "errors": [
          {
            "code": "E00001",
            "message": "系统错误",
            "example": {}
          }
        ]
      }
    }
  ],
  "summary": {
    "total": 2,
    "by_method": {
      "GET": 1,
      "POST": 1
    },
    "by_tag": {
      "用户管理": 1,
      "订单管理": 1
    }
  }
}
```

## 整理原则

### 1. 完整性

确保每个接口包含：
- 基本信息（路径、方法、描述）
- 完整的请求信息
- 完整的响应信息
- 必要的示例

### 2. 结构化

- 使用统一的格式
- 清晰的层级结构
- 易于解析和阅读

### 3. 可读性

- 使用清晰的标题和分隔
- 提供代码示例
- 添加必要的说明

### 4. 可追溯性

- 标注接口来源（Apifox 项目）
- 记录识别依据（需求中的关键词）
- 保留原始接口定义（便于验证）

## 接口分组

### 按功能模块分组

```markdown
## 用户管理模块
- 用户列表接口
- 用户详情接口
- 创建用户接口
...

## 订单管理模块
- 订单列表接口
- 订单详情接口
...
```

### 按 HTTP 方法分组

```markdown
## GET 接口
- 用户列表
- 用户详情
...

## POST 接口
- 创建用户
- 创建订单
...
```

### 按优先级分组

```markdown
## P0 - 核心接口
- 用户列表
- 创建用户
...

## P1 - 重要接口
- 用户搜索
- 用户统计
...
```

## 关联接口识别

在整理接口信息时，主动识别和包含关联接口：

### CRUD 关联

如果找到列表接口，主动查找：
- 详情接口（GET /resource/{id}）
- 创建接口（POST /resource）
- 更新接口（PUT /resource/{id}）
- 删除接口（DELETE /resource/{id}）

### 业务关联

根据业务逻辑识别关联接口：
- 订单创建 → 商品查询、用户信息查询
- 支付处理 → 订单查询、支付状态查询

## 输出示例

### Markdown 格式

```markdown
# 识别的接口列表

## 接口 1：用户列表

### 基本信息
- **路径：** `GET /api/users`
- **描述：** 获取用户列表，支持分页和搜索
- **标签：** 用户管理

### 请求信息
- **查询参数：**
  - `page` (integer) - 可选 - 页码，默认 1
  - `pageSize` / `pagecount` / `size` (integer) - 可选 - 每页数量，默认 10
  - `keyword` (string) - 可选 - 搜索关键词

**注意：** 分页参数命名可能不同，常见的有：
- 页码：`page`、`pageNum`、`pageNo`、`currentPage`
- 每页数量：`pageSize`、`pagecount`、`size`、`pageSize`、`limit`

### 响应信息
- **HTTP 状态码：** 200
- **业务状态码：**
  - `S00000` - 成功
  - `E00003` - 请求参数错误
  - `E00005` - 您还未登录
  - `E00007` - 权限不足
- **成功响应示例：**
  ```json
  {
    "code": "S00000",
    "message": "成功",
    "data": {
      "list": [
        {
          "id": "1",
          "name": "张三",
          "email": "zhangsan@example.com"
        }
      ],
      "total": 100,
      "page": 1,
      "pageSize": 10,
      "currentPage": 1,
      "totalPage": 10
    },
    "success": true
  }
  ```
- **错误响应示例：**
  ```json
  {
    "code": "E00003",
    "message": "请求参数错误",
    "data": {},
    "success": false
  }
  ```

### 关联接口
- 用户详情：`GET /api/users/{id}`
- 创建用户：`POST /api/users`
```

### JSON 格式

```json
{
  "interfaces": [
    {
      "name": "用户列表",
      "path": "/api/users",
      "method": "GET",
      "description": "获取用户列表，支持分页和搜索",
      "tags": ["用户管理"],
      "request": {
        "parameters": [
          {
            "name": "page",
            "type": "integer",
            "required": false,
            "description": "页码，默认 1"
          },
          {
            "name": "pageSize",
            "type": "integer",
            "required": false,
            "description": "每页数量，默认 10",
            "alternatives": ["pagecount", "size", "limit"]
          },
          {
            "name": "keyword",
            "type": "string",
            "required": false,
            "description": "搜索关键词"
          }
        ]
      },
      "response": {
        "httpStatus": 200,
        "businessCodes": {
          "success": {
            "code": "S00000",
            "message": "成功"
          },
          "errors": [
            {
              "code": "E00003",
              "message": "请求参数错误"
            },
            {
              "code": "E00005",
              "message": "您还未登录"
            }
          ]
        },
        "success": {
          "code": "S00000",
          "example": {
            "code": "S00000",
            "message": "成功",
            "data": {
              "list": [],
              "total": 100,
              "page": 1,
              "pageSize": 10,
              "currentPage": 1,
              "totalPage": 10
            },
            "success": true
          }
        },
        "errors": [
          {
            "code": "E00003",
            "message": "请求参数错误",
            "example": {
              "code": "E00003",
              "message": "请求参数错误",
              "data": {},
              "success": false
            }
          }
        ]
      },
      "related": [
        {
          "name": "用户详情",
          "path": "/api/users/{id}",
          "method": "GET"
        },
        {
          "name": "创建用户",
          "path": "/api/users",
          "method": "POST"
        }
      ]
    }
  ],
  "summary": {
    "total": 1,
    "by_method": {
      "GET": 1
    },
    "by_tag": {
      "用户管理": 1
    }
  },
  "source": {
    "project_id": "muakxr",
    "identified_from": "需求描述：需要实现用户管理功能"
  }
}
```

