# 接口命名模式参考

## 实际项目命名模式

基于实际后端接口案例，总结常见的命名模式：

### 路径结构模式

#### 1. 带版本号的路径
```
/v{version}/web_api/{resource}/{action}
```

**示例：**
- `/v3/web_api/activity_scene/get_activity_scene_info`
- `/v2/web_api/send_detail/find_send_detail_list`
- `/v2/web_api/goods/find_goods_list`

**特点：**
- 版本号在路径开头：`v2`、`v3`
- 使用 `web_api` 作为路径前缀
- 资源名使用下划线命名：`activity_scene`、`send_detail`
- 操作动词在路径末尾：`get_activity_scene_info`、`find_send_detail_list`

#### 2. 嵌套资源路径
```
/api/{resource}/{sub_resource}/{action}
```

**示例：**
- `/api/activity/activityBusiness/update`

**特点：**
- 使用 `/api` 作为路径前缀
- 支持嵌套资源：`activity/activityBusiness`
- 操作动词在路径末尾：`update`
- 资源名可能使用驼峰命名：`activityBusiness`

#### 3. 简单资源路径
```
/api/{resource}/{action}
```

**特点：**
- 单层资源结构
- 操作动词在路径中

### 操作动词模式

#### 1. 下划线风格操作动词
- `get_{resource}_info` - 获取详情
- `find_{resource}_list` - 查询列表
- `create_{resource}` - 创建
- `update_{resource}` - 更新
- `delete_{resource}` - 删除

**示例：**
- `get_activity_scene_info`
- `find_send_detail_list`
- `find_goods_list`

#### 2. 驼峰风格操作动词
- `get{Resource}Info` - 获取详情
- `find{Resource}List` - 查询列表
- `create{Resource}` - 创建
- `update{Resource}` - 更新

**示例：**
- `getActivitySceneInfo`
- `findSendDetailList`

#### 3. 简单操作动词
- `update` - 更新
- `create` - 创建
- `delete` - 删除
- `list` - 列表
- `detail` - 详情

**示例：**
- `/api/activity/activityBusiness/update`

### HTTP 方法使用模式

#### 标准 RESTful（理想情况）
- `GET /api/{resource}` - 列表
- `GET /api/{resource}/{id}` - 详情
- `POST /api/{resource}` - 创建
- `PUT /api/{resource}/{id}` - 更新
- `DELETE /api/{resource}/{id}` - 删除

#### 实际项目常见（非标准）
- `GET /v3/web_api/{resource}/get_{resource}_info` - 详情（GET）
- `POST /v2/web_api/{resource}/find_{resource}_list` - 列表（POST，非标准）
- `POST /api/{resource}/{sub_resource}/update` - 更新（POST，非标准）

**注意：**
- 列表查询可能使用 POST 方法（带查询参数在请求体中）
- 更新操作可能使用 POST 而不是 PUT
- 需要同时搜索 GET 和 POST 方法

### 资源命名模式

#### 下划线命名（snake_case）
- `activity_scene` - 活动场景
- `send_detail` - 发放明细
- `goods` - 商品
- `user_info` - 用户信息

#### 驼峰命名（camelCase）
- `activityBusiness` - 商家运营活动
- `sendDetail` - 发放明细
- `goodsList` - 商品列表

#### 混合使用
- 同一项目中可能同时使用两种命名风格
- 需要同时尝试两种命名风格进行匹配

### 请求数据类型

#### 常见类型
- `application/x-www-form-urlencoded` - 表单编码
- `application/json` - JSON 格式
- `application/x-www-form-urlencoded,application/json` - 支持两种格式

**注意：**
- 某些接口可能同时支持表单和 JSON
- 需要根据实际接口文档确定

### 响应数据结构

#### 标准响应结构
```json
{
  "code": "",
  "data": {},
  "message": "",
  "success": true
}
```

#### 嵌套响应结构
```json
{
  "code": "",
  "data": {},
  "model": {
    // 实际数据
  },
  "resultCode": {
    "code": "",
    "message": ""
  },
  "success": true
}
```

#### 分页响应结构
```json
{
  "code": "",
  "data": {},
  "model": {
    "result": [], // 列表数据
    "currentPage": 0,
    "totalPage": 0,
    "amount": 0
  },
  "success": true
}
```

**注意：**
- 实际数据可能在 `model`、`data`、`result` 等字段中
- 需要根据接口文档确定实际数据结构

## 匹配策略建议

### 1. 多风格尝试
对于每个资源名，同时尝试：
- 下划线风格：`activity_scene`
- 驼峰风格：`activityScene`
- 中划线风格：`activity-scene`
- 原始中文：`活动场景`

### 2. 多方法尝试
对于列表查询，同时搜索：
- `GET /api/{resource}`
- `POST /api/{resource}/find_{resource}_list`
- `POST /api/{resource}/list`

### 3. 操作动词变体
对于"获取"操作，搜索：
- `get_{resource}_info`
- `get{Resource}Info`
- `get_info`
- `info`
- `detail`

### 4. 路径部分匹配
如果完整路径匹配失败，尝试：
- 匹配资源名部分
- 匹配操作动词部分
- 匹配路径片段

