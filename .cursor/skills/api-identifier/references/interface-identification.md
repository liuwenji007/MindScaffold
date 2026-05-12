# 接口识别方法

## 从需求中识别接口名

### 识别策略

从用户传入的内容（需求描述、功能说明等）中识别需要的 API 接口，遵循以下策略：

#### 1. 关键词提取

识别需求中的关键动作和实体：

**常见动作关键词：**
- 查询/获取/列表：`查询`、`获取`、`列表`、`搜索`、`find`、`get`、`list`、`search`
- 创建/新增：`创建`、`新增`、`添加`、`create`、`add`、`new`、`save`
- 更新/编辑：`更新`、`编辑`、`修改`、`update`、`edit`、`modify`
- 删除：`删除`、`移除`、`delete`、`remove`
- 详情：`详情`、`查看`、`detail`、`view`、`show`

**常见实体关键词：**
- 用户：`用户`、`user`、`member`
- 订单：`订单`、`order`
- 商品：`商品`、`product`、`item`、`goods`
- 活动：`活动`、`activity`、`campaign`、`activity_scene`、`activityScene`、`activityBusiness`
- 规则：`规则`、`rule`
- 商家：`商家`、`business`、`activityBusiness`
- 会员：`会员`、`member`
- 企业：`企业`、`company`
- 广告：`广告`、`advertisement`、`adv`
- 短信：`短信`、`sms`、`message`
- 电站组：`电站组`、`stubgroup`、`stub_group`
- 奖品：`奖品`、`award`、`prize`
- 发放明细：`发放明细`、`send_detail`、`sendDetail`、`发放`、`send`
- 活动场景：`活动场景`、`activity_scene`、`activityScene`、`场景`、`scene`
- 商家运营活动：`商家运营活动`、`activityBusiness`、`商家活动`

#### 2. 模式匹配

识别常见的接口命名模式：

**RESTful 风格（标准）：**
- `GET /api/{resource}` - 列表接口
- `GET /api/{resource}/{id}` - 详情接口
- `POST /api/{resource}` - 创建接口
- `PUT /api/{resource}/{id}` - 更新接口
- `PATCH /api/{resource}/{id}` - 部分更新接口
- `DELETE /api/{resource}/{id}` - 删除接口

**业务操作风格：**
- `POST /api/{resource}/action` - 业务操作接口
- `GET /api/{resource}/search` - 搜索接口
- `POST /api/{resource}/batch` - 批量操作接口

**非标准命名风格（实际项目常见）：**

**路径中包含操作动词：**
- `GET /v{version}/web_api/{resource}/get_{resource}_info` - 获取详情（下划线命名）
- `POST /v{version}/web_api/{resource}/find_{resource}_list` - 查询列表（下划线命名，POST 方法）
- `POST /api/{resource}/{sub_resource}/update` - 更新操作（驼峰命名）
- `POST /api/{resource}/{sub_resource}/create` - 创建操作
- `POST /api/{resource}/{sub_resource}/delete` - 删除操作

**路径结构模式：**
- `/v{version}/web_api/{resource}/{action}` - 带版本号的路径
- `/api/{resource}/{sub_resource}/{action}` - 嵌套资源路径
- `/api/{resource}/{action}` - 简单资源路径

**命名风格混合：**
- 下划线命名（snake_case）：`activity_scene`、`send_detail`、`find_goods_list`
- 驼峰命名（camelCase）：`activityBusiness`、`findGoodsList`
- 需要同时支持两种命名风格进行匹配

#### 3. 上下文分析

结合需求上下文推断接口：

- **功能完整性**：如果需求提到"用户列表"，可能还需要"用户详情"、"创建用户"等接口
- **业务流程**：如果需求是"创建订单"，可能需要"商品列表"、"用户信息"等前置接口
- **CRUD 关联**：识别到列表接口时，主动查找相关的创建、更新、删除接口

### 接口名提取流程

1. **解析需求文本**
   - 提取动作词和实体词
   - 识别功能描述中的关键信息

2. **生成候选接口名**
   - 基于动作+实体组合生成接口名
   - 考虑多种命名风格（驼峰、下划线、中划线）
   - **支持非标准命名**：
     - 下划线风格：`get_{resource}_info`、`find_{resource}_list`
     - 驼峰风格：`get{Resource}Info`、`find{Resource}List`
     - 路径中包含操作动词：`/{resource}/get_info`、`/{resource}/find_list`
     - 嵌套资源：`/{resource}/{sub_resource}/update`
     - 带版本号：`/v{version}/web_api/{resource}/{action}`

3. **去重和排序**
   - 合并相似的接口名
   - 按优先级排序（核心接口优先）

4. **验证接口名**
   - 检查接口名是否符合常见命名规范
   - 识别可能的拼写错误或变体

### 示例

**示例 1：标准需求**
**需求：** "需要实现用户管理功能，包括用户列表、创建用户、编辑用户信息"

**识别结果：**
- `用户列表` / `user-list` / `users` / `getUsers` / `find_user_list` / `findUserList`
- `创建用户` / `create-user` / `createUser` / `create_user`
- `编辑用户` / `update-user` / `updateUser` / `update_user`
- `用户详情` / `user-detail` / `getUser` / `get_user_info` (推断的关联接口)

**示例 2：活动场景需求**
**需求：** "需要获取活动场景详情"

**识别结果（考虑非标准命名）：**
- `get_activity_scene_info` / `getActivitySceneInfo` / `activity_scene/get_info`
- `/v3/web_api/activity_scene/get_activity_scene_info` (完整路径)
- 同时搜索：`activity_scene`、`activityScene`、`活动场景`

**示例 3：列表查询需求**
**需求：** "需要查询发放明细列表"

**识别结果（考虑非标准命名和 POST 方法）：**
- `find_send_detail_list` / `findSendDetailList` / `send_detail/find_list`
- `/v2/web_api/send_detail/find_send_detail_list` (完整路径)
- 注意：列表查询可能使用 POST 方法（非标准 RESTful）
- 同时搜索：`send_detail`、`sendDetail`、`发放明细`

**示例 4：更新操作需求**
**需求：** "需要修改商家运营活动"

**识别结果（考虑嵌套资源）：**
- `activity/activityBusiness/update` / `activityBusiness/update`
- `/api/activity/activityBusiness/update` (完整路径)
- 同时搜索：`activityBusiness`、`activity_business`、`商家运营活动`

## 多接口识别

当需求涉及多个功能模块时，需要识别所有相关接口：

### 识别原则

1. **功能完整性**：确保每个功能模块的接口完整
2. **依赖关系**：识别接口之间的依赖关系
3. **业务关联**：识别业务上相关的接口

### 组织方式

按功能模块组织接口：
- 用户管理模块：用户列表、用户详情、创建用户、更新用户、删除用户
- 订单管理模块：订单列表、订单详情、创建订单、更新订单

按优先级组织接口：
- P0（必须）：核心业务接口
- P1（重要）：重要功能接口
- P2（可选）：增强功能接口

