# 微信小程序商品录入系统开发计划

## TL;DR

> **快速摘要**：开发一个微信小程序商品录入系统，用户可通过微信授权登录，扫描商品条码查询或录入商品信息，并进行简单评分评价。设计采用苹果深色系风格，使用微信云开发作为后端服务。
>
> **交付物**：
> - Pencil设计稿（.pen文件）：登录页、扫码页、商品详情页、新增商品页
> - 微信小程序页面（4个）：登录、扫码、商品详情、商品录入
> - 云开发配置：数据库集合（products、reviews、users）、安全规则
>
> **预估工作量**：3-4天
> **并行执行**：是（设计阶段与架构设计可并行）
> **关键路径**：设计稿 → 登录页 → 扫码页 → 商品页/录入页 → 云开发配置

---

## 上下文

### 原始需求

需求来源：`design/需求.md`

| 功能模块 | 需求描述 |
|---------|---------|
| **登录页** | 用户使用微信授权登录 |
| **扫码页** | 用户扫描二维码或条形码 |
| **商品已录入** | 用户可查看商品评价，修改自己的评价 |
| **商品未录入** | 用户可录入新商品，包括商品图片、商品名、商品条码/二维码 |
| **设计风格** | 参考苹果设计风格，深色系 |

### 需求分析摘要

**关键讨论点**：
- 技术栈选择：微信原生框架
- 后端服务：微信云开发（Cloud Development）
- 评价功能：简单评分（文字 + 星级，1-5星）
- 设计流程：设计稿优先（先创建Pencil .pen文件，再进行代码开发）
- 数据存储：云开发数据库（products、reviews、users三个集合）

**Metis评审发现的问题**：
- 现有代码存在严重不匹配：登录使用手动头像昵称输入，非微信授权
- 现有主题为浅色系，与需求要求的苹果深色系不符
- 缺少关键页面：scan、product、add-product
- 设计文件design/onWeekend.v1.pen为空，需要重新设计

---

## 工作目标

### 核心目标

开发一个完整的微信小程序商品录入系统，用户可以通过微信授权登录，扫描商品条码查询商品信息和评价，或录入新商品信息。所有页面采用苹果深色系设计风格。

### 具体交付物

| 交付物 | 说明 |
|-------|------|
| **设计稿（.pen文件）** | 4个页面的完整UI设计：登录页、扫码页、商品详情页、新增商品页 |
| **登录页（pages/login/）** | 微信授权登录，包含授权成功/失败状态处理 |
| **扫码页（pages/scan/）** | 条码扫描功能，包含相机权限处理、扫描结果分流 |
| **商品详情页（pages/product/）** | 商品信息展示、评价列表、添加/修改评价功能 |
| **新增商品页（pages/add-product/）** | 新商品录入表单，包含图片上传、商品名输入、条码预填 |
| **云开发配置** | 数据库集合创建、安全规则配置 |

### 完成定义

- [ ] 所有4个页面完成并通过测试
- [ ] 微信云开发数据库集合创建完成
- [ ] 数据库安全规则配置完成
- [ ] 苹果深色系主题全局应用
- [ ] 核心流程（登录→扫码→查询/录入→评价）完整可用

### 必须有

- 微信授权登录功能（wx.login + getUserProfile）
- 条码扫描功能（wx.scanCode）
- 商品信息展示和评价列表
- 简单评价功能（文字+1-5星评分）
- 新商品录入功能（图片上传、商品名、条码）
- 苹果深色系主题样式
- 云开发数据库集成

### 禁止有（护栏）

- ❌ 社交功能（分享、评论点赞、好友动态）
- ❌ 文字搜索商品功能（仅支持扫码查询）
- ❌ 管理员后台或审核界面
- ❌ 第三方存储或认证服务
- ❌ 离线缓存或PWA功能
- ❌ 用户个人资料管理（仅基础微信授权）
- ❌ 自定义相机UI（使用原生wx.scanCode）
- ❌ 复杂的数据库关联关系
- ❌ 评价历史记录（仅覆盖更新）
- ❌ 商品分类或标签系统
- ❌ 商品删除功能（仅追加）

---

## 验证策略

### 测试决策

| 决策项 | 选择 |
|-------|------|
| 测试基础设施 | 已存在：微信开发者工具、真机调试 |
| 自动化测试 | 无（使用Agent执行QA场景） |
| 主要验证方式 | Agent执行QA场景（Playwright、curl、微信开发者工具） |

### Agent执行QA场景（强制执行）

> **通用原则**：所有验证必须由Agent执行，禁止人工干预验证过程。

#### 1. 设计稿验证

**场景：验证Pencil设计文件包含所有页面**
- **工具**：pencil_batch_get
- **步骤**：
  1. 获取pen文件所有节点
  2. 统计页面根Frame数量
  3. 验证是否包含4个页面：login、scan、product、add-product
- **预期结果**：找到4个页面根Frame，命名符合要求
- **失败指标**：缺少页面或页面命名不匹配
- **证据**：pencil_batch_get返回的节点列表

**场景：验证苹果深色系配色**
- **工具**：pencil_get_variables或手动检查fill属性
- **步骤**：
  1. 检查背景色值
  2. 检查文字色值
  3. 检查强调色值
- **预期结果**：背景色为#000000/#1c1c1e，文字色为#ffffff/#8e8e93，强调色为#0a84ff
- **失败指标**：使用了其他颜色值
- **证据**：变量定义或颜色值截图

**场景：验证页面组件完整性**
- **工具**：pencil_batch_get搜索组件类型
- **步骤**：
  1. 统计登录页组件（按钮、授权说明文字）
  2. 统计扫码页组件（扫描按钮、说明文字）
  3. 统计商品页组件（商品信息、评价列表、评分组件）
  4. 统计录入页组件（图片上传、商品名输入、条码输入、保存按钮）
- **预期结果**：每个页面组件数量符合设计规范
- **失败指标**：组件缺失或数量不足
- **证据**：组件统计列表

#### 2. 登录页验证

**场景：微信授权登录成功跳转**
- **工具**：Playwright（微信开发者工具模拟）
- **前置条件**：开发者工具模拟器运行
- **步骤**：
  1. 打开登录页
  2. 点击"微信登录"按钮
  3. 模拟授权弹窗确认
  4. 模拟wx.login()成功返回code
  5. 模拟云开发auth登录成功
- **预期结果**：页面URL跳转至/pages/scan/scan
- **失败指标**：页面未跳转或跳转错误页面
- **证据**：页面URL变化截图、跳转前后页面状态对比

**场景：授权失败显示错误提示**
- **工具**：Playwright（模拟授权失败）
- **前置条件**：开发者工具模拟器运行
- **步骤**：
  1. 打开登录页
  2. 点击"微信登录"按钮
  3. 模拟授权弹窗取消
  4. 模拟getUserProfile失败
- **预期结果**：显示Toast错误提示"登录失败，请重试"
- **失败指标**：无错误提示或提示内容不正确
- **证据**：错误提示截图

**场景：相机权限请求**
- **工具**：Playwright检查wx.authorize调用
- **前置条件**：开发者工具模拟器运行
- **步骤**：
  1. 从登录页跳转至扫码页
  2. 检查wx.authorize({scope: "scope.camera"})调用
- **预期结果**：相机权限请求被触发
- **失败指标**：权限请求未触发
- **证据**：API调用日志

#### 3. 扫码页验证

**场景：wx.scanCode启动相机扫描**
- **工具**：Playwright + 微信开发者工具
- **前置条件**：扫码页已打开
- **步骤**：
  1. 检查wx.scanCode()API调用
  2. 模拟扫描成功，返回条码"1234567890123"
- **预期结果**：scanCode成功回调被触发，返回条码字符串
- **失败指标**：API未调用或回调未触发
- **证据**：API调用日志和回调数据

**场景：商品已存在跳转到商品详情页**
- **工具**：Playwright + Mock数据库
- **前置条件**：扫码成功，数据库返回商品数据
- **步骤**：
  1. 模拟wx.scanCode成功，返回条码"1234567890123"
  2. Mock云数据库查询products集合返回商品数据
  3. 触发页面跳转
- **预期结果**：页面URL跳转至/pages/product/product?barcode=1234567890123
- **失败指标**：页面未跳转或跳转错误
- **证据**：URL变化截图、数据库查询结果

**场景：商品不存在跳转到新增页面**
- **工具**：Playwright + Mock数据库
- **前置条件**：扫码成功，数据库无此商品
- **步骤**：
  1. 模拟wx.scanCode成功，返回条码"9999999999999"
  2. Mock云数据库查询products集合返回空
  3. 触发页面跳转
- **预期结果**：页面URL跳转至/pages/add-product/add-product?barcode=9999999999999
- **失败指标**：页面未跳转或跳转错误
- **证据**：URL变化截图、数据库空查询结果

**场景：相机权限被拒绝**
- **工具**：Playwright模拟权限拒绝
- **前置条件**：用户拒绝camera权限
- **步骤**：
  1. 尝试调用wx.scanCode()
  2. 模拟权限拒绝回调
- **预期结果**：显示错误提示"请允许相机权限以使用扫码功能"，显示重试按钮
- **失败指标**：无错误提示或应用崩溃
- **证据**：错误提示截图

**场景：扫描超时**
- **工具**：Playwright模拟扫描超时
- **前置条件**：10秒内未检测到条码
- **步骤**：
  1. 调用wx.scanCode()
  2. 模拟扫描超时回调
- **预期结果**：显示提示"未检测到条码，请重试"，显示"重试"和"取消"按钮
- **失败指标**：无超时处理或应用无响应
- **证据**：超时提示截图

#### 4. 商品详情页验证

**场景：展示商品信息和评价列表**
- **工具**：Playwright + Mock数据
- **前置条件**：页面加载商品数据
- **步骤**：
  1. Mock商品数据：{name: "测试商品", barcode: "1234567890123", imageUrl: "cloud://..."}
  2. Mock评价数据：[{rating: 5, text: "很好用！", userId: "user1"}]
  3. 打开商品详情页
- **预期结果**：
  - 商品名称显示为"测试商品"
  - 商品图片加载成功
  - 评价列表显示1条评价
  - 评分显示5颗星
- **失败指标**：信息显示不完整或错误
- **证据**：页面渲染结果截图

**场景：仅显示自己的评价修改按钮**
- **工具**：Playwright + Mock用户ID
- **前置条件**：当前用户ID为user1，评价列表包含user1和user2的评价
- **步骤**：
  1. Mock当前用户openId: "user1"
  2. Mock评价列表：[{rating: 4, text: "不错", userId: "user1"}, {rating: 3, text: "一般", userId: "user2"}]
  3. 渲染页面
- **预期结果**：
  - user1的评价显示"修改评价"按钮
  - user2的评价不显示修改按钮
- **失败指标**：按钮显示错误（显示了不该显示的，或没显示该显示的）
- **证据**：评价列表截图，标注按钮状态

**场景：提交新评价**
- **工具**：Playwright + Mock数据库写入
- **前置条件**：用户在评价表单填写内容
- **步骤**：
  1. 点击"添加评价"按钮
  2. 选择4星评分
  3. 输入评价文字"产品很好，推荐购买"
  4. 点击"提交"按钮
  5. Mock云数据库添加成功回调
- **预期结果**：
  - cloud.database().collection('reviews').add()被调用
  - 调用参数包含{productId, userId, rating: 4, text: "产品很好，推荐购买"}
  - 显示成功提示"评价已提交"
  - 新评价出现在评价列表中
- **失败指标**：API未调用或数据错误
- **证据**：API调用日志、成功提示截图

**场景：修改已有评价**
- **工具**：Playwright + Mock数据库更新
- **前置条件**：用户点击自己评价的"修改"按钮
- **步骤**：
  1. 点击"修改评价"按钮
  2. 修改评分为5星
  3. 修改评价文字"非常满意"
  4. 点击"保存"按钮
  5. Mock云数据库更新成功回调
- **预期结果**：
  - cloud.database().doc(reviewId).update()被调用
  - 调用参数包含更新后的rating和text
  - 显示成功提示"评价已更新"
  - 列表中评价内容更新
- **失败指标**：API未调用或数据未更新
- **证据**：API调用日志、更新前后对比截图

#### 5. 新增商品页验证

**场景：预填条码信息**
- **工具**：Playwright检查页面参数
- **前置条件**：从扫码页跳转，携带条码参数
- **步骤**：
  1. 打开页面，URL参数为?barcode=1234567890123
- **预期结果**：条码输入框值为"1234567890123"（只读）
- **失败指标**：条码未预填或可编辑
- **证据**：输入框值截图

**场景：上传商品图片**
- **工具**：Playwright + Mock云存储
- **前置条件**：用户选择图片文件
- **步骤**：
  1. 点击"选择图片"按钮
  2. 选择图片文件
  3. Mock wx.cloud.uploadFile()成功
- **预期结果**：
  - wx.cloud.uploadFile()被调用
  - 返回fileID
  - 图片预览显示上传的图片
- **失败指标**：上传失败或无预览
- **证据**：上传回调日志、图片预览截图

**场景：保存新商品**
- **工具**：Playwright + Mock数据库
- **前置条件**：表单填写完整
- **步骤**：
  1. 输入商品名"新商品测试"
  2. 上传商品图片
  3. 确认条码已预填
  4. 点击"保存"按钮
  5. Mock云数据库添加成功
- **预期结果**：
  - cloud.database().collection('products').add()被调用
  - 调用参数包含{barcode, name, imageUrl, createdAt}
  - 显示成功提示"商品已添加"
  - 页面跳转至商品详情页
- **失败指标**：API未调用或数据错误
- **证据**：API调用日志、成功提示截图

**场景：阻止重复条码**
- **工具**：Playwright + Mock数据库
- **前置条件**：条码已存在于数据库
- **步骤**：
  1. 尝试保存商品，条码"1234567890123"已存在
  2. Mock数据库查询返回已存在商品
- **预期结果**：
  - 显示错误提示"该条码商品已存在"
  - 保存按钮禁用或表单清空
  - 建议跳转到已存在商品页面
- **失败指标**：未检测重复或允许重复录入
- **证据**：错误提示截图

**场景：商品名称长度验证**
- **工具**：Playwright测试输入验证
- **前置条件**：用户输入超过200字符的商品名称
- **步骤**：
  1. 在商品名输入框输入201个字符
  2. 尝试提交
- **预期结果**：
  - 显示错误提示"商品名称不能超过200字符"
  - 保存按钮禁用
- **失败指标**：无验证或允许超长输入
- **证据**：错误提示截图

**场景：图片格式验证**
- **工具**：Playwright测试文件选择
- **前置条件**：用户选择不支持的文件格式（PDF、视频等）
- **步骤**：
  1. 点击"选择图片"按钮
  2. 选择PDF文件
- **预期结果**：
  - 显示错误提示"仅支持JPG/PNG格式"
  - 文件不被接受
- **失败指标**：无格式验证或接受不支持的格式
- **证据**：错误提示截图

#### 6. 云开发配置验证

**场景：数据库集合创建**
- **工具**：curl调用云开发API
- **前置条件**：云开发环境已开通
- **步骤**：
  1. 调用GET https://api.weixin.qq.com/tcb/databasecollectionget
  2. 传入access_token和环境ID
- **预期结果**：返回集合列表包含products、reviews、users
- **失败指标**：集合不存在或列表不完整
- **证据**：API响应JSON

**场景：安全规则验证**
- **工具**：curl调用云开发API + 模拟未授权写入
- **前置条件**：安全规则已配置
- **步骤**：
  1. 获取当前安全规则配置
  2. 模拟未认证用户尝试写入products集合
- **预期结果**：
  - products集合：任何人可读取，认证用户可写入
  - reviews集合：任何人可读取，用户只能写入和更新自己的评价
  - users集合：用户只能读写自己的数据
  - 未授权写入被拒绝
- **失败指标**：规则配置错误或权限过大
- **证据**：规则配置截图、权限验证日志

#### 7. 深色主题验证

**场景：全局深色主题应用**
- **工具**：Playwright获取计算样式
- **前置条件**：应用所有页面加载完成
- **步骤**：
  1. 获取所有页面的body背景色
  2. 获取主要文字颜色
  3. 获取次要文字颜色
- **预期结果**：
  - 背景色为#000000、#1c1c1e或#2c2c2e
  - 主文字色为#ffffff
  - 次要文字色为#8e8e93
  - 无浅色背景（#ffffff、#f5f5f5等）
- **失败指标**：存在浅色背景或文字颜色不匹配
- **证据**：CSS计算样式截图

**场景：强调色一致性**
- **工具**：Playwright检查按钮样式
- **前置条件**：页面包含主要操作按钮
- **步骤**：
  1. 查找所有主要操作按钮（登录、提交、保存等）
  2. 获取按钮背景色或边框色
- **预期结果**：主要操作按钮使用#0a84ff（系统蓝色）作为强调色
- **失败指标**：强调色不一致或使用了其他颜色
- **证据**：按钮样式截图

---

## 执行策略

### 并行执行波形

```
波形 1（立即开始）：
├── 任务1：Pencil设计稿创建（登录页）
├── 任务2：Pencil设计稿创建（扫码页）
├── 任务3：Pencil设计稿创建（商品详情页）
└── 任务4：Pencil设计稿创建（新增商品页）

波形 2（设计稿完成后）：
├── 任务5：云开发环境开通和配置
├── 任务6：数据库集合创建
├── 任务7：数据库安全规则配置
├── 任务8：登录页开发
├── 任务9：扫码页开发
├── 任务10：商品详情页开发
└── 任务11：新增商品页开发

波形 3（页面开发完成后）：
├── 任务12：全局样式配置（苹果深色系）
├── 任务13：页面集成测试
└── 任务14：真机调试和优化
```

### 依赖矩阵

| 任务 | 依赖项 | 阻塞 | 可并行任务 |
|-----|-------|------|-----------|
| 1. 设计稿-登录页 | 无 | 8 | 2, 3, 4 |
| 2. 设计稿-扫码页 | 无 | 9 | 1, 3, 4 |
| 3. 设计稿-商品页 | 无 | 10 | 1, 2, 4 |
| 4. 设计稿-录入页 | 无 | 11 | 1, 2, 3 |
| 5. 云开发开通 | 无 | 6 | 1-4 |
| 6. 数据库集合 | 5 | 7, 12 | 5 |
| 7. 安全规则 | 6 | 12 | 5, 6 |
| 8. 登录页开发 | 1 | 13 | 9, 10, 11 |
| 9. 扫码页开发 | 2 | 13 | 8, 10, 11 |
| 10. 商品页开发 | 3 | 13 | 8, 9, 11 |
| 11. 录入页开发 | 4 | 13 | 8, 9, 10 |
| 12. 全局样式 | 6, 7 | 13 | 5-11 |
| 13. 集成测试 | 8-12 | 14 | 无（最终任务） |
| 14. 真机调试 | 13 | 无 | 无（最终任务） |

### Agent派遣摘要

| 波形 | 任务 | 推荐Agent |
|-----|------|----------|
| 1 | 1-4（设计稿创建） | design（design系统） |
| 2 | 5-7（云开发配置） | build（quick类别） |
| 2 | 8-11（页面开发） | build（visual-engineering类别） |
| 3 | 12-14（测试调试） | build（quick类别） |

---

## TODOs

### 任务 1：Pencil设计稿 - 登录页

**做什么**：
- 在design/onWeekend.v1.pen中设计登录页
- 页面包含：微信授权按钮、授权说明文字、loading状态、错误提示
- 采用苹果深色系配色方案

**不能做什么**：
- 不能使用浅色背景（#ffffff、#f5f5f5等）
- 不能添加除微信授权外的其他登录方式
- 不能添加用户资料编辑功能

**推荐Agent配置**：
- **类别**：design（Pencil设计工具）
- **技能**：无特殊技能要求
- **理由**：页面UI设计，使用design系统创建.pen文件

**并行化**：
- **可并行运行**：是
- **并行组**：波形1（与任务2、3、4并行）
- **阻塞**：无（可立即开始）
- **阻塞任务**：任务8（登录页开发依赖设计稿）

**参考**（关键 - 详细说明）：

**设计规范参考**：
- 苹果人机界面指南：https://developer.apple.com/design/human-interface-guidelines/ios/overview/themes/
- 深色模式设计：https://developer.apple.com/design/human-interface-guidelines/ios/visual-design/dark-mode/

**设计元素要求**：
- 背景色：#000000（纯黑背景）
- 标题文字："商品评价助手"（白色#ffffff，32px加粗）
- 副标题："登录后使用扫码评价功能"（次要文字#8e8e93，16px）
- 授权按钮：圆角矩形，背景色#0a84ff（系统蓝），白色文字"微信授权登录"
- 错误提示：红色#ff3b30，底部Toast样式

**页面布局**：
- 垂直居中布局
- Logo/图标区域（可选，显示应用图标）
- 标题区域（应用名称）
- 副标题区域（功能说明）
- 授权按钮区域
- 版权信息（可选，底部灰色文字）

**为什么参考重要**：
- 确保设计符合苹果Human Interface Guidelines
- 深色系配色提供沉浸式用户体验
- 统一的设计语言提升应用质感

**验收标准**：

**Agent执行QA场景**：

场景：验证登录页设计文件存在且包含必需组件
- **工具**：pencil_batch_get
- **前置条件**：设计文件存在
- **步骤**：
  1. 读取design/onWeekend.v1.pen文件
  2. 查找login页面的根Frame
  3. 统计子组件数量和类型
- **预期结果**：
  - 存在login根Frame
  - 包含标题组件（text）
  - 包含副标题组件（text）
  - 包含按钮组件（button或frame模拟按钮）
  - 使用深色背景（#000000）
- **失败指标**：文件不存在、组件缺失、使用了浅色背景
- **证据**：pencil_batch_get返回的组件树截图

场景：验证登录页设计使用苹果深色系配色
- **工具**：pencil_get_variables或手动检查
- **前置条件**：设计文件已加载
- **步骤**：
  1. 检查背景色fill属性
  2. 检查文字颜色
  3. 检查按钮颜色
- **预期结果**：
  - 背景色为#000000或#1c1c1e
  - 主文字色为#ffffff
  - 次要文字色为#8e8e93
  - 按钮背景色为#0a84ff
- **失败指标**：使用了其他颜色值
- **证据**：颜色属性截图

**提交**：是
- **提交信息**：`design: add login page design with Apple dark theme`
- **文件**：`design/onWeekest
- **提交前检查**：设计稿通过QA验证

---

### 任务 2：Pencil设计稿 - 扫码页

**做什么**：
- 在design/onWeekend.v1.pen中设计扫码页
- 页面包含：扫描区域、取景框、扫描按钮、手动输入链接、权限说明
- 采用苹果深色系配色方案

**不能做什么**：
- 不能使用自定义相机UI（取景框使用系统样式）
- 不能添加除扫描外的其他商品查询方式（禁止文字搜索）
- 不能添加商品列表展示功能

**推荐Agent配置**：
- **类别**：design（Pencil设计工具）
- **技能**：无特殊技能要求
- **理由**：页面UI设计，使用design系统创建.pen文件

**并行化**：
- **可并行运行**：是
- **并行组**：波形1（与任务1、3、4并行）
- **阻塞**：无（可立即开始）
- **阻塞任务**：任务9（扫码页开发依赖设计稿）

**参考**：

**设计规范参考**：
- 微信扫码能力文档：https://developers.weixin.qq.com/miniprogram/dev/api/device/scan/wx.scanCode.html
- 苹果相机使用指南：https://developer.apple.com/design/human-interface-guidelines/ios/system-capabilities/camera/

**设计元素要求**：
- 背景色：#000000（全屏深色）
- 扫描区域：方形取景框（角标装饰）
- 扫描提示文字："将商品条码放入框内，自动扫描"
- 扫描按钮：圆角矩形，#0a84ff背景色
- 手动输入链接："无法扫描？手动输入条码"（#0a84ff链接色）
- 权限说明（相机被拒绝时显示）

**页面布局**：
- 全屏相机预览（深色遮罩叠加）
- 中央扫描取景框（透明框+四角装饰）
- 扫描提示文字（取景框下方）
- 扫描按钮（底部固定）
- 手动输入链接（扫描按钮下方）

**为什么参考重要**：
- 符合微信小程序扫码API的设计预期
- 苹果风格提供简洁专业的视觉体验
- 明确的操作引导提升用户成功率

**验收标准**：

**Agent执行QA场景**：

场景：验证扫码页设计文件存在且包含必需组件
- **工具**：pencil_batch_get
- **前置条件**：设计文件存在
- **步骤**：
  1. 读取design/onWeekend.v1.pen文件
  2. 查找scan页面的根Frame
  3. 统计子组件数量和类型
- **预期结果**：
  - 存在scan根Frame
  - 包含扫描区域组件（frame）
  - 包含扫描提示文字（text）
  - 包含扫描按钮（button）
  - 包含手动输入链接（text或button）
- **失败指标**：文件不存在、组件缺失
- **证据**：pencil_batch_get返回的组件树截图

场景：验证扫码页设计包含权限处理UI
- **工具**：pencil_batch_get
- **前置条件**：设计文件已加载
- **步骤**：
  1. 查找权限说明区域
  2. 查找重试按钮
- **预期结果**：
  - 存在权限说明文字组件
  - 存在设置/重试按钮组件
- **失败指标**：未包含权限处理UI
- **证据**：组件截图

**提交**：是
- **提交信息**：`design: add scan page design`
- **文件**：`design/onWeekend.v1.pen`
- **提交前检查**：设计稿通过QA验证

---

### 任务 3：Pencil设计稿 - 商品详情页

**做什么**：
- 在design/onWeekend.v1.pen中设计商品详情页
- 页面包含：商品图片、商品名称、评价列表、添加评价按钮、星级评分组件
- 采用苹果深色系配色方案

**不能做什么**：
- 不能添加商品价格、库存、分类等信息（需求仅要求评价功能）
- 不能添加分享按钮或社交功能
- 不能添加商品推荐或广告内容

**推荐Agent配置**：
- **类别**：design（Pencil设计工具）
- **技能**：无特殊技能要求
- **理由**：页面UI设计，使用design系统创建.pen文件

**并行化**：
- **可并行运行**：是
- **并行组**：波形1（与任务1、2、4并行）
- **阻塞**：无（可立即开始）
- **阻塞任务**：任务10（商品页开发依赖设计稿）

**参考**：

**设计规范参考**：
- 苹果列表设计：https://developer.apple.com/design/human-interface-guidelines/ios/views/tables/
- 评分组件设计：https://developer.apple.com/design/human-interface-guidelines/ios/components/pickers/ratings/

**设计元素要求**：
- 背景色：#1c1c1e（列表背景）
- 商品信息区域：图片（正方形，圆角8px）、名称（白色28px加粗）
- 评价列表：每条评价包含用户标识（头像+昵称）、星级评分、评价文字、时间戳
- 星级组件：5颗星，#0a84ff填充已选中，#8e8e93未选中
- 添加评价按钮：浮动按钮或固定底部按钮，#0a84ff背景色
- 修改按钮：仅显示在自己的评价上

**页面布局**：
- 顶部商品信息区域（图片+名称）
- 评价列表区域（滚动列表）
- 底部固定"添加评价"按钮

**评价列表项布局**：
- 左侧：用户头像（圆形32px）
- 右侧：用户名（白色）、星级评分（5颗星）、评价文字（灰色#8e8e93）
- 我的评价额外显示"修改"按钮

**为什么参考重要**：
- 苹果列表设计提供清晰的评价浏览体验
- 星级组件设计规范确保评分展示一致性
- 简洁的布局符合"简单评价"的需求定位

**验收标准**：

**Agent执行QA场景**：

场景：验证商品页设计包含所有必需组件
- **工具**：pencil_batch_get
- **前置条件**：设计文件存在
- **步骤**：
  1. 读取design/onWeekend.v1.pen文件
  2. 查找product页面的根Frame
  3. 统计子组件数量和类型
- **预期结果**：
  - 存在product根Frame
  - 包含商品图片占位（image）
  - 包含商品名称文字（text）
  - 包含评价列表区域（scrollable frame）
  - 包含评价项组件（至少1个示例）
  - 包含添加评价按钮（button）
  - 包含星级评分组件
- **失败指标**：组件缺失或不完整
- **证据**：pencil_batch_get返回的组件树截图

场景：验证我的评价显示修改按钮
- **工具**：pencil_batch_get
- **前置条件**：设计文件已加载
- **步骤**：
  1. 查找评价列表中的示例评价项
  2. 检查是否有修改按钮组件
- **预期结果**：示例评价项包含"修改"按钮组件
- **失败指标**：未包含修改按钮
- **证据**：按钮组件截图

**提交**：是
- **提交信息**：`design: add product detail page design`
- **文件**：`design/onWeekend.v1.pen`
- **提交前检查**：设计稿通过QA验证

---

### 任务 4：Pencil设计稿 - 新增商品页

**做什么**：
- 在design/onWeekend.v1.pen中设计新增商品页
- 页面包含：商品图片上传、商品名称输入、条码预填显示、保存按钮
- 采用苹果深色系配色方案

**不能做什么**：
- 不能添加商品价格、描述、分类等额外字段
- 不能添加图片编辑或裁剪功能
- 不能添加条码重复检测UI（仅显示结果）

**推荐Agent配置**：
- **类别**：design（Pencil设计工具）
- **技能**：无特殊技能要求
- **理由**：页面UI设计，使用design系统创建.pen文件

**并行化**：
- **可并行运行**：是
- **并行组**：波形1（与任务1、2、3并行）
- **阻塞**：无（可立即开始）
- **阻塞任务**：任务11（录入页开发依赖设计稿）

**参考**：

**设计规范参考**：
- 苹果表单设计：https://developer.apple.com/design/human-interface-guidelines/ios/controls/text-fields/
- 图片上传设计：https://developer.apple.com/design/human-interface-guidelines/ios/system-capabilities/photos/

**设计元素要求**：
- 背景色：#1c1c1e
- 标题："添加新商品"
- 图片上传区域：正方形占位框（虚线边框）、"+"图标、"上传商品图片"文字提示
- 商品名称输入框：圆角矩形，背景色#2c2c2e，白色文字，placeholder"请输入商品名称"
- 条码信息展示：只读显示，背景色#2c2c2e，条码值文字
- 保存按钮：圆角矩形，#0a84ff背景色，白色文字
- 错误提示：红色Toast或输入框下方文字

**页面布局**：
- 垂直滚动布局
- 图片上传（顶部）
- 商品名称输入（中部）
- 条码信息（中部）
- 保存按钮（底部固定）

**表单验证UI**：
- 商品名为空：按钮禁用或显示红色提示
- 商品名过长：输入框下方显示红色错误文字
- 图片未上传：上传区域显示红色边框

**为什么参考重要**：
- 简洁的表单设计符合快速录入的需求
- 明确的视觉引导帮助用户完成操作
- 一致的配色保持苹果风格统一性

**验收标准**：

**Agent执行QA场景**：

场景：验证新增商品页设计包含所有必需组件
- **工具**：pencil_batch_get
- **前置条件**：设计文件存在
- **步骤**：
  1. 读取design/onWeekend.v1.pen文件
  2. 查找add-product页面的根Frame
  3. 统计子组件数量和类型
- **预期结果**：
  - 存在add-product根Frame
  - 包含图片上传区域（frame + icon）
  - 包含商品名输入框（input）
  - 包含条码只读显示（text）
  - 包含保存按钮（button）
- **失败指标**：组件缺失或不完整
- **证据**：pencil_batch_get返回的组件树截图

场景：验证条码预填显示为只读
- **工具**：pencil_batch_get
- **前置条件**：设计文件已加载
- **步骤**：
  1. 查找条码显示区域
  2. 检查是否有输入框组件或只读文字组件
- **预期结果**：条码区域为文字组件（只读），非输入框
- **失败指标**：条码使用了可输入的input组件
- **证据**：组件类型截图

**提交**：是
- **提交信息**：`design: add product creation page design`
- **文件**：`design/onWeekend.v1.pen`
- **提交前检查**：设计稿通过QA验证

---

### 任务 5：开通云开发环境

**做什么**：
- 在微信公众平台开通云开发环境
- 获取环境ID（envID）
- 配置云开发基础设置

**不能做什么**：
- 不能使用非微信云开发服务（禁止第三方后端）
- 不能跳过云开发直接使用本地存储

**推荐Agent配置**：
- **类别**：build（quick类别）
- **技能**：无特殊技能要求
- **理由**：简单的平台配置操作，使用微信开发者工具

**并行化**：
- **可并行运行**：是
- **并行组**：波形2（与任务1-4并行，因为是配置任务）
- **阻塞**：无（可立即开始）
- **阻塞任务**：任务6（数据库集合依赖云环境开通）

**参考**：

**官方文档**：
- 微信云开发快速启动：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html
- 云开发控制台：https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/console/

**操作步骤**：
1. 登录微信公众平台
2. 进入小程序管理后台
3. 开通云开发（选择环境规模：测试/开发环境免费）
4. 获取环境ID
5. 在微信开发者工具中启用云开发
6. 初始化云开发（wx.cloud.init()）

**配置项**：
- 环境ID：记录备用
- 调用方式：wx.cloud.init({traceUser: true})
- 默认云函数目录：cloudfunctions/

**验收标准**：

**Agent执行QA场景**：

场景：验证云开发环境已开通
- **工具**：微信开发者工具
- **前置条件**：微信开发者工具打开项目
- **步骤**：
  1. 点击"云开发"按钮
  2. 检查环境列表
  3. 获取环境ID
- **预期结果**：
  - 云开发面板可打开
  - 存在至少一个环境
  - 环境状态为"已开通"
- **失败指标**：云开发无法打开或无环境
- **证据**：云开发面板截图

场景：验证app.json包含云开发配置
- **工具**：read
- **前置条件**：项目存在app.json
- **步骤**：
  1. 读取app.json
  2. 检查cloud: true配置
- **预期结果**：
  - 存在"cloud": true配置
- **失败指标**：缺少云开发配置
- **证据**：app.json内容截图

场景：验证app.js初始化云开发
- **工具**：read
- **前置条件**：项目存在app.js
- **步骤**：
  1. 读取app.js
  2. 检查wx.cloud.init()调用
- **预期结果**：
  - 存在wx.cloud.init()调用
  - 传入正确的envID
- **失败指标**：云开发未初始化
- **证据**：app.js内容截图

**提交**：是
- **提交信息**：`feat: initialize WeChat Cloud Development environment`
- **文件**：`app.json`, `app.js`
- **提交前检查**：云环境可正常访问

---

### 任务 6：创建数据库集合

**做什么**：
- 在云开发控制台创建3个数据库集合
- products：存储商品信息
- reviews：存储评价信息
- users：存储用户信息

**不能做什么**：
- 不能创建额外的集合（仅限products、reviews、users）
- 不能修改集合名称或删除集合

**推荐Agent配置**：
- **类别**：build（quick类别）
- **技能**：无特殊技能要求
- **理由**：简单的数据库操作，使用云开发控制台或API

**并行化**：
- **可并行运行**：否
- **并行组**：无
- **阻塞**：任务5（依赖云环境开通）
- **阻塞任务**：任务7、12

**参考**：

**数据库设计**：

**products集合（商品表）**：
| 字段名 | 类型 | 说明 |
|-------|------|------|
| _id | 自动生成 | 文档ID |
| barcode | string | 商品条码（唯一索引） |
| name | string | 商品名称 |
| imageUrl | string | 商品图片cloudID |
| createdAt | datetime | 创建时间 |
| creatorId | string | 创建者openId |

**reviews集合（评价表）**：
| 字段名 | 类型 | 说明 |
|-------|------|------|
| _id | 自动生成 | 文档ID |
| productId | string | 关联商品barcode |
| productName | string | 商品名称（冗余存储，便于查询） |
| userId | string | 评价用户openId |
| rating | number | 评分1-5 |
| text | string | 评价文字 |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

**users集合（用户表）**：
| 字段名 | 类型 | 说明 |
|-------|------|------|
| _id | 自动生成 | 文档ID（使用openId作为_id） |
| openId | string | 微信openId |
| avatarUrl | string | 用户头像 |
| nickName | string | 用户昵称 |
| createdAt | datetime | 创建时间 |
| lastLoginAt | datetime | 最后登录时间 |

**索引设计**：
- products.barcode：唯一索引（防止重复商品）
- reviews.productId：普通索引（按商品查询评价）
- reviews.userId：普通索引（按用户查询评价）

**验收标准**：

**Agent执行QA场景**：

场景：验证所有数据库集合已创建
- **工具**：curl调用云开发API
- **前置条件**：云环境已开通
- **步骤**：
  1. 获取access_token
  2. 调用GET https://api.weixin.qq.com/tcb/databasecollectionget
  3. 传入envID
- **预期结果**：返回集合列表包含products、reviews、users
- **失败指标**：集合不存在或列表不完整
- **证据**：API响应JSON截图

场景：验证products集合字段结构
- **工具**：微信开发者工具云开发控制台
- **前置条件**：products集合已创建
- **步骤**：
  1. 打开products集合
  2. 添加示例文档
  3. 验证字段可正确保存
- **预期结果**：
  - 可添加包含barcode、name、imageUrl的文档
  - 文档保存成功
- **失败指标**：字段无法保存
- **证据**：集合添加记录截图

场景：验证reviews集合字段结构
- **工具**：微信开发者工具云开发控制台
- **前置条件**：reviews集合已创建
- **步骤**：
  1. 打开reviews集合
  2. 添加示例文档（包含productId、userId、rating、text）
  3. 验证字段可正确保存
- **预期结果**：
  - 可添加包含所有必需字段的文档
  - 文档保存成功
- **失败指标**：字段无法保存
- **证据**：集合添加记录截图

**提交**：是
- **提交信息**：`feat: create database collections for products, reviews, users`
- **文件**：云开发控制台配置
- **提交前检查**：所有集合可正常访问和查询

---

### 任务 7：配置数据库安全规则

**做什么**：
- 配置云开发数据库安全规则
- 设置products、reviews、users集合的读写权限
- 确保用户只能操作自己的数据

**不能做什么**：
- 不能开放所有读写权限（仅限授权用户）
- 不能禁用所有权限（需要允许正常业务操作）

**推荐Agent配置**：
- **类别**：build（quick类别）
- **技能**：无特殊技能要求
- **理由**：安全配置操作，使用云开发控制台

**并行化**：
- **可并行运行**：否
- **并行组**：无
- **阻塞**：任务6（依赖数据库集合创建）
- **阻塞任务**：任务12

**参考**：

**安全规则配置**：

**products集合规则**：
```json
{
  "read": true,
  "write": "doc.creatorId == auth.openId || !doc._id"
}
```
- 说明：任何人都可以读取商品，商品创建者可以更新自己的商品

**reviews集合规则**：
```json
{
  "read": true,
  "write": "doc.userId == auth.openId || !doc._id"
}
```
- 说明：任何人都可以读取评价，评价创建者可以更新自己的评价

**users集合规则**：
```json
{
  "read": "doc._id == auth.openId",
  "write": "doc._id == auth.openId"
}
```
- 说明：用户只能读取和写入自己的用户数据

**验收标准**：

**Agent执行QA场景**：

场景：验证安全规则已配置
- **工具**：curl调用云开发API
- **前置条件**：云环境已开通
- **步骤**：
  1. 获取access_token
  2. 调用GET https://api.weixin.qq.com/tcb/databaserulequery
  3. 传入envID和集合名
- **预期结果**：返回各集合的安全规则配置
- **失败指标**：规则未配置或返回空
- **证据**：规则配置JSON截图

场景：验证products集合读权限
- **工具**：Playwright + 微信开发者工具
- **前置条件**：安全规则已配置
- **步骤**：
  1. 未登录状态下尝试读取products集合
  2. 验证可读取数据
- **预期结果**：未登录可读取products数据
- **失败指标**：读取被拒绝
- **证据**：查询结果截图

场景：验证reviews集合写权限限制
- **工具**：Playwright + Mock
- **前置条件**：安全规则已配置
- **步骤**：
  1. 模拟用户A登录
  2. 尝试更新用户B的评价
  3. 验证写入被拒绝
- **预期结果**：写入被拒绝，返回权限错误
- **失败指标**：写入成功（权限泄露）
- **证据**：错误日志截图

**提交**：是
- **提交信息**：`feat: configure database security rules`
- **文件**：云开发控制台安全规则配置
- **提交前检查**：安全规则通过权限验证测试

---

### 任务 8：开发登录页

**做什么**：
- 创建pages/login/目录和页面文件
- 实现微信授权登录功能
- 处理授权成功/失败状态
- 应用苹果深色系样式

**不能做什么**：
- 不能使用手动头像昵称输入（必须使用微信授权）
- 不能添加第三方登录方式
- 不能存储用户敏感信息

**推荐Agent配置**：
- **类别**：build（visual-engineering类别）
- **技能**：["frontend-ui-ux"]
- **理由**：前端页面开发，需要UI/UX设计和实现

**并行化**：
- **可并行运行**：是
- **并行组**：波形2（与任务9、10、11并行）
- **阻塞**：任务1（依赖登录页设计稿）
- **阻塞任务**：任务13（集成测试依赖）

**参考**：

**参考文件**：
- `design/onWeekend.v1.pen` - 登录页设计稿
- 微信登录文档：https://developers.weixin.qq.com/miniprogram/dev/api/open-api/login/wx.login.html
- 用户信息API：https://developers.weixin.qq.com/miniprogram/dev/api/open-api/user-info/wx.getUserProfile.html

**实现步骤**：
1. 创建页面结构（wxml）
2. 创建页面样式（wxss）
3. 创建页面逻辑（js）

**页面结构（wxml）**：
```html
<view class="container">
  <view class="logo-area">
    <image class="app-logo" src="/images/logo.png"></image>
  </view>
  <view class="title">商品评价助手</view>
  <view class="subtitle">登录后使用扫码评价功能</view>
  
  <button 
    class="login-btn" 
    bindtap="handleLogin"
    loading="{{loading}}"
  >
    微信授权登录
  </button>
  
  <view class="error-tip" wx:if="{{error}}">
    {{error}}
  </view>
</view>
```

**页面样式（wxss）**：
```css
.container {
  min-height: 100vh;
  background-color: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.title {
  color: #ffffff;
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 16px;
}

.subtitle {
  color: #8e8e93;
  font-size: 16px;
  margin-bottom: 48px;
}

.login-btn {
  width: 100%;
  height: 48px;
  background-color: #0a84ff;
  color: #ffffff;
  border-radius: 24px;
  font-size: 17px;
  font-weight: 500;
}

.error-tip {
  color: #ff3b30;
  font-size: 14px;
  margin-top: 16px;
}
```

**页面逻辑（js）**：
```javascript
Page({
  data: {
    loading: false,
    error: ''
  },

  handleLogin() {
    this.setData({ loading: true, error: '' });
    
    // 获取用户信息
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        // 获取登录凭证
        wx.login({
          success: (loginRes) => {
            if (loginRes.code) {
              // 调用云函数完成登录
              wx.cloud.callFunction({
                name: 'login',
                data: { code: loginRes.code, userInfo: res.userInfo },
                success: () => {
                  // 登录成功，跳转到扫码页
                  wx.switchTab({ url: '/pages/scan/scan' });
                },
                fail: (err) => {
                  this.setData({ error: '登录失败，请重试', loading: false });
                }
              });
            }
          },
          fail: () => {
            this.setData({ error: '登录失败，请重试', loading: false });
          }
        });
      },
      fail: () => {
        this.setData({ error: '授权失败，请重试', loading: false });
      }
    });
  }
});
```

**为什么参考重要**：
- 确保实现符合微信登录API规范
- 设计稿提供精确的UI尺寸和颜色参照
- 统一的错误处理提升用户体验

**验收标准**：

**Agent执行QA场景**：

场景：微信授权登录成功跳转
- **工具**：Playwright（微信开发者工具模拟器）
- **前置条件**：页面已部署到开发者工具
- **步骤**：
  1. 打开/pages/login/login页面
  2. Mock wx.getUserProfile成功返回用户信息
  3. Mock wx.login成功返回code
  4. Mock云函数login成功
  5. 点击"微信授权登录"按钮
- **预期结果**：
  - loading状态显示
  - API调用链正常
  - 页面跳转至/pages/scan/scan
- **失败指标**：未跳转或跳转错误页面
- **证据**：跳转前后页面URL对比截图

场景：授权失败显示错误提示
- **工具**：Playwright模拟失败
- **前置条件**：页面已部署
- **步骤**：
  1. Mock wx.getUserProfile失败
  2. 点击"微信授权登录"按钮
- **预期结果**：显示错误提示"授权失败，请重试"
- **失败指标**：无错误提示或提示内容不对
- **证据**：错误提示Toast截图

场景：登录按钮loading状态
- **工具**：Playwright
- **前置条件**：页面已部署
- **步骤**：
  1. Mock wx.login延迟响应
  2. 点击"微信授权登录"按钮
- **预期结果**：按钮显示loading动画
- **失败指标**：无loading状态
- **证据**：按钮状态截图

**提交**：是
- **提交信息**：`feat: implement WeChat login page`
- **文件**：`pages/login/login.wxml`, `pages/login/login.wxss`, `pages/login/login.js`
- **提交前检查**：登录流程通过所有QA场景

---

### 任务 9：开发扫码页

**做什么**：
- 创建pages/scan/目录和页面文件
- 实现wx.scanCode扫码功能
- 处理相机权限
- 实现扫描结果分流（已存在→商品页，未存在→录入页）
- 应用苹果深色系样式

**不能做什么**：
- 不能使用自定义相机界面（必须使用wx.scanCode原生接口）
- 不能添加文字搜索功能
- 不能显示商品列表

**推荐Agent配置**：
- **类别**：build（visual-engineering类别）
- **技能**：["frontend-ui-ux"]
- **理由**：前端页面开发，需要UI/UX设计和实现

**并行化**：
- **可并行运行**：是
- **并行组**：波形2（与任务8、10、11并行）
- **阻塞**：任务2（依赖扫码页设计稿）
- **阻塞任务**：任务13（集成测试依赖）

**参考**：

**参考文件**：
- `design/onWeekend.v1.pen` - 扫码页设计稿
- 微信扫码API：https://developers.weixin.qq.com/miniprogram/dev/api/device/scan/wx.scanCode.html
- 权限API：https://developers.weixin.qq.com/miniprogram/dev/api/authorize/wx.authorize.html

**实现步骤**：
1. 创建页面结构（wxml）
2. 创建页面样式（wxss）
3. 创建页面逻辑（js）

**页面结构（wxml）**：
```html
<view class="container">
  <!-- 权限被拒绝状态 -->
  <view class="permission-denied" wx:if="{{permissionDenied}}">
    <view class="icon">📷</view>
    <view class="title">无法访问相机</view>
    <view class="desc">请在设置中开启相机权限以使用扫码功能</view>
    <button class="retry-btn" bindtap="openSettings">去设置</button>
  </view>
  
  <!-- 正常扫码状态 -->
  <view class="scan-area" wx:else>
    <view class="scan-frame">
      <view class="corner top-left"></view>
      <view class="corner top-right"></view>
      <view class="corner bottom-left"></view>
      <view class="corner bottom-right"></view>
    </view>
    
    <view class="scan-tip">将商品条码放入框内，自动扫描</view>
    
    <button class="scan-btn" bindtap="handleScan" loading="{{scanning}}">
      {{scanning ? '扫描中...' : '开始扫描'}}
    </button>
    
    <view class="manual-link" bindtap="handleManualInput">
      无法扫描？手动输入条码
    </view>
  </view>
</view>
```

**页面样式（wxss）**：
```css
.container {
  min-height: 100vh;
  background-color: #000000;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.permission-denied {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 32px;
}

.permission-denied .icon {
  font-size: 64px;
  margin-bottom: 24px;
}

.permission-denied .title {
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 12px;
}

.permission-denied .desc {
  color: #8e8e93;
  font-size: 16px;
  text-align: center;
  margin-bottom: 32px;
}

.retry-btn {
  background-color: #0a84ff;
  color: #ffffff;
  border-radius: 24px;
  width: 200px;
}

.scan-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
}

.scan-frame {
  width: 250px;
  height: 150px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  position: relative;
}

.corner {
  position: absolute;
  width: 24px;
  height: 24px;
  border-color: #0a84ff;
  border-style: solid;
}

.corner.top-left {
  top: -2px;
  left: -2px;
  border-width: 4px 0 0 4px;
}

.corner.top-right {
  top: -2px;
  right: -2px;
  border-width: 4px 4px 0 0;
}

.corner.bottom-left {
  bottom: -2px;
  left: -2px;
  border-width: 0 0 4px 4px;
}

.corner.bottom-right {
  bottom: -2px;
  right: -2px;
  border-width: 0 4px 4px 0;
}

.scan-tip {
  color: #8e8e93;
  font-size: 14px;
  margin-top: 24px;
  margin-bottom: 48px;
}

.scan-btn {
  width: 200px;
  height: 48px;
  background-color: #0a84ff;
  color: #ffffff;
  border-radius: 24px;
  font-size: 17px;
  font-weight: 500;
}

.manual-link {
  color: #0a84ff;
  font-size: 15px;
  margin-top: 24px;
  margin-bottom: 32px;
}
```

**页面逻辑（js）**：
```javascript
Page({
  data: {
    scanning: false,
    permissionDenied: false
  },

  onLoad() {
    this.checkCameraPermission();
  },

  checkCameraPermission() {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.camera']) {
          this.setData({ permissionDenied: true });
        }
      }
    });
  },

  handleScan() {
    this.setData({ scanning: true });
    
    wx.scanCode({
      success: (res) => {
        this.setData({ scanning: false });
        this.handleScanResult(res.result);
      },
      fail: (err) => {
        this.setData({ scanning: false });
        if (err.errMsg.includes('cancel')) {
          // 用户取消，不处理
        } else if (err.errMsg.includes('permission')) {
          this.setData({ permissionDenied: true });
        } else {
          wx.showToast({
            title: '扫描失败，请重试',
            icon: 'none'
          });
        }
      }
    });
  },

  async handleScanResult(barcode) {
    wx.showLoading({ title: '查询中...' });
    
    try {
      // 查询商品是否已存在
      const db = wx.cloud.database();
      const res = await db.collection('products')
        .where({ barcode: barcode })
        .get();
      
      wx.hideLoading();
      
      if (res.data.length > 0) {
        // 商品已存在，跳转到商品详情页
        wx.navigateTo({
          url: `/pages/product/product?barcode=${barcode}`
        });
      } else {
        // 商品不存在，跳转到新增页面
        wx.navigateTo({
          url: `/pages/add-product/add-product?barcode=${barcode}`
        });
      }
    } catch (err) {
      wx.hideLoading();
      wx.showToast({
        title: '查询失败，请重试',
        icon: 'none'
      });
    }
  },

  handleManualInput() {
    wx.showModal({
      title: '手动输入条码',
      editable: true,
      placeholderText: '请输入条码',
      success: (res) => {
        if (res.confirm && res.content) {
          this.handleScanResult(res.content);
        }
      }
    });
  },

  openSettings() {
    wx.openSetting();
  }
});
```

**为什么参考重要**：
- wx.scanCode是原生API，设计稿需要与其交互保持一致
- 权限处理是核心功能，影响用户能否使用
- 清晰的分流逻辑确保用户流程顺畅

**验收标准**：

**Agent执行QA场景**：

场景：扫码启动相机
- **工具**：Playwright + 微信开发者工具
- **前置条件**：页面已部署
- **步骤**：
  1. 打开/pages/scan/scan页面
  2. 点击"开始扫描"按钮
  3. Mock wx.scanCode被调用
- **预期结果**：wx.scanCode API被调用
- **失败指标**：API未调用
- **证据**：API调用日志截图

场景：扫描成功跳转到商品详情页
- **工具**：Playwright + Mock数据库
- **前置条件**：页面已部署，数据库有商品数据
- **步骤**：
  1. Mock wx.scanCode成功返回"1234567890123"
  2. Mock数据库查询返回商品数据
  3. 执行handleScanResult
- **预期结果**：页面跳转至/pages/product/product?barcode=1234567890123
- **失败指标**：未跳转或URL参数错误
- **证据**：跳转前后URL对比截图

场景：扫描成功跳转到新增商品页
- **工具**：Playwright + Mock数据库（空结果）
- **前置条件**：页面已部署，数据库无此商品
- **步骤**：
  1. Mock wx.scanCode成功返回"9999999999999"
  2. Mock数据库查询返回空数组
  3. 执行handleScanResult
- **预期结果**：页面跳转至/pages/add-product/add-product?barcode=9999999999999
- **失败指标**：未跳转或URL参数错误
- **证据**：跳转前后URL对比截图

场景：相机权限被拒绝
- **工具**：Playwright模拟权限拒绝
- **前置条件**：用户拒绝camera权限
- **步骤**：
  1. Mock wx.getSetting返回camera权限为false
  2. 打开扫码页
- **预期结果**：显示权限被拒绝UI，包含"去设置"按钮
- **失败指标**：未显示权限处理UI
- **证据**：页面渲染截图

场景：手动输入条码
- **工具**：Playwright模拟手动输入
- **前置条件**：页面已部署
- **步骤**：
  1. 点击"无法扫描？手动输入条码"
  2. Mock wx.showModal返回输入内容"1234567890123"
- **预期结果**：显示输入框，输入后触发handleScanResult
- **失败指标**：未显示输入框
- **证据**：弹窗截图

**提交**：是
- **提交信息**：`feat: implement scan page with barcode scanning`
- **文件**：`pages/scan/scan.wxml`, `pages/scan/scan.wxss`, `pages/scan/scan.js`
- **提交前检查**：扫码流程通过所有QA场景

---

### 任务 10：开发商品详情页

**做什么**：
- 创建pages/product/目录和页面文件
- 展示商品信息和评价列表
- 实现添加评价和修改评价功能
- 应用苹果深色系样式

**不能做什么**：
- 不能添加价格、库存等商品属性
- 不能添加分享或社交功能
- 不能显示其他用户的修改按钮

**推荐Agent配置**：
- **类别**：build（visual-engineering类别）
- **技能**：["frontend-ui-ux"]
- **理由**：前端页面开发，需要UI/UX设计和实现

**并行化**：
- **可并行运行**：是
- **并行组**：波形2（与任务8、9、11并行）
- **阻塞**：任务3（依赖商品页设计稿）
- **阻塞任务**：任务13（集成测试依赖）

**参考**：

**参考文件**：
- `design/onWeekend.v1.pen` - 商品详情页设计稿

**实现步骤**：
1. 创建页面结构（wxml）
2. 创建页面样式（wxss）
3. 创建页面逻辑（js）

**页面结构（wxml）**：
```html
<view class="container">
  <!-- 商品信息区域 -->
  <view class="product-info">
    <image class="product-image" src="{{product.imageUrl}}" mode="aspectFill"></image>
    <view class="product-name">{{product.name}}</view>
    <view class="product-barcode">条码: {{product.barcode}}</view>
  </view>
  
  <!-- 评价列表 -->
  <view class="reviews-section">
    <view class="section-title">商品评价</view>
    
    <view class="review-list">
      <block wx:for="{{reviews}}" wx:key="_id">
        <view class="review-item">
          <view class="review-header">
            <image class="user-avatar" src="{{item.userInfo.avatarUrl || '/images/default-avatar.png'}}"></image>
            <view class="user-info">
              <view class="user-name">{{item.userInfo.nickName || '匿名用户'}}</view>
              <view class="rating">
                <block wx:for="{{[1,2,3,4,5]}}" wx:for-item="star" wx:key="*this">
                  <text class="star {{star <= item.rating ? 'filled' : ''}}">★</text>
                </block>
              </view>
            </view>
            <view class="review-time">{{item.createdAtFormatted}}</view>
          </view>
          <view class="review-text">{{item.text || '用户未填写评价内容'}}</view>
          <view class="review-actions" wx:if="{{item.userId === currentUserId}}">
            <view class="edit-btn" bindtap="handleEditReview" data-id="{{item._id}}">修改评价</view>
          </view>
        </view>
      </block>
      
      <view class="empty-tip" wx:if="{{reviews.length === 0}}">
        暂无评价，快来添加第一条评价吧
      </view>
    </view>
  </view>
  
  <!-- 添加评价按钮 -->
  <view class="add-review-btn" bindtap="showReviewModal">
    添加评价
  </view>
  
  <!-- 评价弹窗 -->
  <view class="modal-mask" wx:if="{{showModal}}" bindtap="hideReviewModal"></view>
  <view class="modal-content" wx:if="{{showModal}}">
    <view class="modal-title">{{editingReviewId ? '修改评价' : '添加评价'}}</view>
    
    <view class="rating-input">
      <view class="rating-label">评分</view>
      <view class="rating-stars">
        <block wx:for="{{[1,2,3,4,5]}}" wx:for-item="star" wx:key="*this">
          <text class="star-btn {{star <= newRating ? 'filled' : ''}}" bindtap="setRating" data-rating="{{star}}">★</text>
        </block>
      </view>
    </view>
    
    <textarea 
      class="review-textarea" 
      placeholder="请输入您的评价..."
      maxlength="500"
      bindinput="handleTextInput"
      value="{{newText}}"
    ></textarea>
    
    <view class="modal-actions">
      <view class="cancel-btn" bindtap="hideReviewModal">取消</view>
      <view class="submit-btn" bindtap="submitReview" loading="{{submitting}}">
        {{editingReviewId ? '保存' : '提交'}}
      </view>
    </view>
  </view>
</view>
```

**页面样式（wxss）**：
```css
.container {
  min-height: 100vh;
  background-color: #1c1c1e;
  padding-bottom: 80px;
}

.product-info {
  background-color: #000000;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-image {
  width: 200px;
  height: 200px;
  border-radius: 12px;
  margin-bottom: 16px;
}

.product-name {
  color: #ffffff;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
  text-align: center;
}

.product-barcode {
  color: #8e8e93;
  font-size: 14px;
}

.reviews-section {
  padding: 24px;
}

.section-title {
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}

.review-item {
  background-color: #2c2c2e;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}

.review-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.user-info {
  flex: 1;
}

.user-name {
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
}

.rating {
  display: flex;
  margin-top: 4px;
}

.star {
  color: #8e8e93;
  font-size: 16px;
}

.star.filled {
  color: #0a84ff;
}

.review-time {
  color: #8e8e93;
  font-size: 12px;
}

.review-text {
  color: #ffffff;
  font-size: 15px;
  line-height: 1.5;
}

.review-actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.edit-btn {
  color: #0a84ff;
  font-size: 14px;
}

.empty-tip {
  color: #8e8e93;
  font-size: 14px;
  text-align: center;
  padding: 32px;
}

.add-review-btn {
  position: fixed;
  bottom: 32px;
  left: 24px;
  right: 24px;
  height: 48px;
  background-color: #0a84ff;
  color: #ffffff;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  font-weight: 500;
}

/* Modal样式 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 100;
}

.modal-content {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #2c2c2e;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 24px;
  z-index: 101;
}

.modal-title {
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
}

.rating-input {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.rating-label {
  color: #ffffff;
  font-size: 15px;
  margin-right: 16px;
}

.rating-stars {
  display: flex;
}

.star-btn {
  color: #8e8e93;
  font-size: 28px;
  margin-right: 8px;
}

.star-btn.filled {
  color: #0a84ff;
}

.review-textarea {
  width: 100%;
  height: 100px;
  background-color: #1c1c1e;
  border-radius: 12px;
  padding: 12px;
  color: #ffffff;
  font-size: 15px;
  box-sizing: border-box;
  margin-bottom: 16px;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.cancel-btn {
  color: #8e8e93;
  font-size: 17px;
  padding: 12px 24px;
}

.submit-btn {
  color: #0a84ff;
  font-size: 17px;
  font-weight: 500;
  padding: 12px 24px;
}
```

**页面逻辑（js）**：
```javascript
const db = wx.cloud.database();
const app = getApp();

Page({
  data: {
    product: {},
    reviews: [],
    currentUserId: '',
    showModal: false,
    newRating: 5,
    newText: '',
    editingReviewId: '',
    submitting: false
  },

  onLoad(options) {
    this.setData({
      'product.barcode': options.barcode
    });
    this.loadProduct();
    this.loadReviews();
    this.getCurrentUserId();
  },

  async loadProduct() {
    try {
      const res = await db.collection('products')
        .where({ barcode: this.data.product.barcode })
        .get();
      
      if (res.data.length > 0) {
        this.setData({ product: res.data[0] });
      }
    } catch (err) {
      wx.showToast({ title: '加载商品失败', icon: 'none' });
    }
  },

  async loadReviews() {
    try {
      const res = await db.collection('reviews')
        .where({ productId: this.data.product.barcode })
        .orderBy('createdAt', 'desc')
        .get();
      
      const reviews = res.data.map(item => {
        // 格式化时间
        item.createdAtFormatted = this.formatTime(item.createdAt);
        return item;
      });
      
      this.setData({ reviews });
    } catch (err) {
      wx.showToast({ title: '加载评价失败', icon: 'none' });
    }
  },

  getCurrentUserId() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ currentUserId: userInfo.openId });
    }
  },

  showReviewModal() {
    this.setData({
      showModal: true,
      newRating: 5,
      newText: '',
      editingReviewId: ''
    });
  },

  hideReviewModal() {
    this.setData({
      showModal: false,
      newRating: 5,
      newText: '',
      editingReviewId: ''
    });
  },

  setRating(e) {
    this.setData({
      newRating: e.currentTarget.dataset.rating
    });
  },

  handleTextInput(e) {
    this.setData({
      newText: e.detail.value
    });
  },

  async submitReview() {
    if (this.data.submitting) return;
    
    this.setData({ submitting: true });
    
    try {
      const userInfo = wx.getStorageSync('userInfo');
      const reviewData = {
        productId: this.data.product.barcode,
        productName: this.data.product.name,
        userId: userInfo.openId,
        userInfo: {
          avatarUrl: userInfo.avatarUrl,
          nickName: userInfo.nickName
        },
        rating: this.data.newRating,
        text: this.data.newText.trim(),
        updatedAt: db.serverDate()
      };
      
      if (this.data.editingReviewId) {
        // 修改评价
        await db.collection('reviews')
          .doc(this.data.editingReviewId)
          .update({
            data: {
              ...reviewData,
              updatedAt: db.serverDate()
            }
          });
        
        wx.showToast({ title: '评价已更新', icon: 'success' });
      } else {
        // 新增评价
        await db.collection('reviews').add({
          data: {
            ...reviewData,
            createdAt: db.serverDate()
          }
        });
        
        wx.showToast({ title: '评价已提交', icon: 'success' });
      }
      
      this.hideReviewModal();
      this.loadReviews();
    } catch (err) {
      wx.showToast({ title: '提交失败，请重试', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  },

  handleEditReview(e) {
    const reviewId = e.currentTarget.dataset.id;
    const review = this.data.reviews.find(r => r._id === reviewId);
    
    if (review) {
      this.setData({
        showModal: true,
        editingReviewId: reviewId,
        newRating: review.rating,
        newText: review.text
      });
    }
  },

  formatTime(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
});
```

**为什么参考重要**：
- 确保UI与设计稿一致
- 评价逻辑正确实现（新增、修改、只显示自己的修改按钮）
- 云数据库操作符合安全规则

**验收标准**：

**Agent执行QA场景**：

场景：展示商品信息和评价列表
- **工具**：Playwright + Mock数据
- **前置条件**：页面已部署
- **步骤**：
  1. Mock商品数据：{name: "测试商品", barcode: "123", imageUrl: "cloud://..."}
  2. Mock评价数据：[{rating: 5, text: "很好", userId: "user1"}]
  3. 打开/pages/product/product?barcode=123
- **预期结果**：
  - 商品名称显示"测试商品"
  - 商品图片显示
  - 评价列表显示1条评价
  - 星级显示5颗填充星
- **失败指标**：信息显示不完整或错误
- **证据**：页面渲染截图

场景：仅自己的评价显示修改按钮
- **工具**：Playwright + Mock用户ID
- **前置条件**：页面已部署，当前用户ID为user1
- **步骤**：
  1. Mock当前用户openId: "user1"
  2. Mock评价列表：[{rating: 4, text: "不错", userId: "user1"}, {rating: 3, text: "一般", userId: "user2"}]
  3. 渲染页面
- **预期结果**：
  - user1的评价显示"修改评价"按钮
  - user2的评价不显示修改按钮
- **失败指标**：按钮显示错误
- **证据**：评价列表截图

场景：提交新评价
- **工具**：Playwright + Mock数据库
- **前置条件**：页面已部署
- **步骤**：
  1. 点击"添加评价"按钮
  2. 选择4星评分
  3. 输入"产品很好"
  4. 点击"提交"按钮
  5. Mock数据库添加成功
- **预期结果**：
  - 数据库添加新文档
  - 显示成功提示"评价已提交"
  - 评价列表更新
- **失败指标**：数据库未添加或无提示
- **证据**：API调用日志、成功提示截图

场景：修改已有评价
- **工具**：Playwright + Mock数据库
- **前置条件**：页面已部署，有可修改的评价
- **步骤**：
  1. 点击"修改评价"按钮
  2. 修改评分为5星
  3. 修改评价文字为"非常满意"
  4. 点击"保存"按钮
  5. Mock数据库更新成功
- **预期结果**：
  - 数据库更新文档
  - 显示成功提示"评价已更新"
  - 评价列表更新
- **失败指标**：数据库未更新或无提示
- **证据**：API调用日志、更新前后对比截图

**提交**：是
- **提交信息**：`feat: implement product detail page with reviews`
- **文件**：`pages/product/product.wxml`, `pages/product/product.wxss`, `pages/product/product.js`
- **提交前检查**：商品页功能通过所有QA场景

---

### 任务 11：开发新增商品页

**做什么**：
- 创建pages/add-product/目录和页面文件
- 实现商品图片上传功能
- 实现商品名输入和验证
- 实现条码预填显示
- 实现保存商品到数据库
- 应用苹果深色系样式

**不能做什么**：
- 不能添加价格、描述、分类等额外字段
- 不能添加图片编辑或裁剪功能
- 不能跳过条码重复检测

**推荐Agent配置**：
- **类别**：build（visual-engineering类别）
- **技能**：["frontend-ui-ux"]
- **理由**：前端页面开发，需要UI/UX设计和实现

**并行化**：
- **可并行运行**：是
- **并行组**：波形2（与任务8、9、10并行）
- **阻塞**：任务4（依赖录入页设计稿）
- **阻塞任务**：任务13（集成测试依赖）

**参考**：

**参考文件**：
- `design/onWeekend.v1.pen` - 新增商品页设计稿

**实现步骤**：
1. 创建页面结构（wxml）
2. 创建页面样式（wxss）
3. 创建页面逻辑（js）

**页面结构（wxml）**：
```html
<view class="container">
  <!-- 图片上传区域 -->
  <view class="form-section">
    <view class="section-label">商品图片</view>
    <view class="image-uploader" bindtap="chooseImage" wx:if="{{!tempImagePath}}">
      <view class="upload-icon">+</view>
      <view class="upload-text">上传商品图片</view>
    </view>
    <view class="image-preview" wx:else>
      <image class="preview-img" src="{{tempImagePath}}" mode="aspectFill"></image>
      <view class="remove-btn" bindtap="removeImage">×</view>
    </view>
  </view>
  
  <!-- 商品名称 -->
  <view class="form-section">
    <view class="section-label">商品名称</view>
    <input 
      class="name-input" 
      placeholder="请输入商品名称" 
      maxlength="200"
      bindinput="handleNameInput"
      value="{{productName}}"
    ></input>
    <view class="error-tip" wx:if="{{nameError}}">{{nameError}}</view>
  </view>
  
  <!-- 条码信息 -->
  <view class="form-section">
    <view class="section-label">商品条码</view>
    <view class="barcode-display">
      <text class="barcode-value">{{barcode}}</text>
      <text class="barcode-tip">（扫码自动获取）</text>
    </view>
  </view>
  
  <!-- 保存按钮 -->
  <view class="save-btn {{canSubmit ? '' : 'disabled'}}" bindtap="handleSave" loading="{{saving}}">
    保存商品
  </view>
  
  <!-- 错误提示 -->
  <view class="global-error" wx:if="{{globalError}}">
    {{globalError}}
  </view>
</view>
```

**页面样式（wxss）**：
```css
.container {
  min-height: 100vh;
  background-color: #1c1c1e;
  padding: 24px;
  padding-bottom: 100px;
}

.form-section {
  margin-bottom: 24px;
}

.section-label {
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  margin-bottom: 12px;
}

.image-uploader {
  width: 120px;
  height: 120px;
  background-color: #2c2c2e;
  border: 2px dashed #8e8e93;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  color: #8e8e93;
  font-size: 36px;
  font-weight: 300;
}

.upload-text {
  color: #8e8e93;
  font-size: 12px;
  margin-top: 8px;
}

.image-preview {
  position: relative;
  width: 120px;
  height: 120px;
}

.preview-img {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.remove-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  background-color: #ff3b30;
  border-radius: 50%;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.name-input {
  background-color: #2c2c2e;
  border-radius: 12px;
  padding: 16px;
  color: #ffffff;
  font-size: 17px;
}

.name-input::placeholder {
  color: #8e8e93;
}

.error-tip {
  color: #ff3b30;
  font-size: 12px;
  margin-top: 8px;
}

.barcode-display {
  background-color: #2c2c2e;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
}

.barcode-value {
  color: #ffffff;
  font-size: 17px;
  font-weight: 500;
}

.barcode-tip {
  color: #8e8e93;
  font-size: 14px;
  margin-left: 8px;
}

.save-btn {
  position: fixed;
  bottom: 32px;
  left: 24px;
  right: 24px;
  height: 48px;
  background-color: #0a84ff;
  color: #ffffff;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  font-weight: 500;
}

.save-btn.disabled {
  background-color: #3a3a3c;
  color: #8e8e93;
}

.global-error {
  position: fixed;
  bottom: 100px;
  left: 24px;
  right: 24px;
  background-color: rgba(255, 59, 48, 0.9);
  color: #ffffff;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
}
```

**页面逻辑（js）**：
```javascript
const db = wx.cloud.database();

Page({
  data: {
    barcode: '',
    productName: '',
    tempImagePath: '',
    cloudImageId: '',
    nameError: '',
    globalError: '',
    saving: false
  },

  onLoad(options) {
    if (options.barcode) {
      this.setData({ barcode: options.barcode });
    } else {
      this.setData({ globalError: '缺少条码信息' });
    }
  },

  handleNameInput(e) {
    const name = e.detail.value;
    this.setData({ 
      productName: name,
      nameError: name.length > 200 ? '商品名称不能超过200字符' : ''
    });
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFiles[0].tempFilePath;
        this.setData({ tempImagePath: tempFilePath });
      }
    });
  },

  removeImage() {
    this.setData({
      tempImagePath: '',
      cloudImageId: ''
    });
  },

  get canSubmit() {
    return this.data.productName.trim() && 
           this.data.tempImagePath && 
           !this.data.nameError &&
           !this.data.saving;
  },

  async handleSave() {
    if (!this.data.canSubmit) return;
    
    this.setData({ saving: true, globalError: '' });
    
    try {
      // 检查条码是否已存在
      const checkRes = await db.collection('products')
        .where({ barcode: this.data.barcode })
        .get();
      
      if (checkRes.data.length > 0) {
        this.setData({ 
          globalError: '该条码商品已存在',
          saving: false 
        });
        return;
      }
      
      // 上传图片到云存储
      const uploadRes = await wx.cloud.uploadFile({
        cloudPath: `products/${Date.now()}-${Math.random()}.png`,
        filePath: this.data.tempImagePath
      });
      
      // 保存商品信息
      const userInfo = wx.getStorageSync('userInfo');
      await db.collection('products').add({
        data: {
          barcode: this.data.barcode,
          name: this.data.productName.trim(),
          imageUrl: uploadRes.fileID,
          creatorId: userInfo.openId,
          createdAt: db.serverDate()
        }
      });
      
      wx.showToast({ title: '商品已添加', icon: 'success' });
      
      // 跳转到商品详情页
      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/product/product?barcode=${this.data.barcode}`
        });
      }, 1500);
      
    } catch (err) {
      console.error(err);
      this.setData({ 
        globalError: '保存失败，请重试',
        saving: false 
      });
    }
  }
});
```

**为什么参考重要**：
- 确保表单验证逻辑正确（长度、必填）
- 图片上传处理符合云存储规范
- 条码重复检测防止数据重复

**验收标准**：

**Agent执行QA场景**：

场景：预填条码信息
- **工具**：Playwright
- **前置条件**：页面已部署
- **步骤**：
  1. 打开/pages/add-product/add-product?barcode=1234567890123
- **预期结果**：条码输入框显示"1234567890123"（只读）
- **失败指标**：条码未预填或可编辑
- **证据**：页面渲染截图

场景：上传商品图片
- **工具**：Playwright + Mock云存储
- **前置条件**：页面已部署
- **步骤**：
  1. Mock wx.chooseMedia选择图片成功
  2. Mock wx.cloud.uploadFile成功返回fileID
  3. 点击图片选择区域
  4. 选择图片
- **预期结果**：图片预览显示上传的图片
- **失败指标**：无预览或上传失败
- **证据**：预览区域截图、API调用日志

场景：保存新商品
- **工具**：Playwright + Mock数据库
- **前置条件**：页面已部署，表单填写完整
- **步骤**：
  1. 输入商品名"测试商品"
  2. Mock图片上传成功
  3. Mock数据库查询返回空（条码不存在）
  4. 点击"保存"按钮
- **预期结果**：
  - 数据库添加新商品
  - 显示成功提示"商品已添加"
  - 页面跳转至商品详情页
- **失败指标**：数据库未添加或无跳转
- **证据**：API调用日志、成功提示截图、跳转URL对比

场景：阻止重复条码
- **工具**：Playwright + Mock数据库
- **前置条件**：条码已存在于数据库
- **步骤**：
  1. 打开页面，条码为已存在的"1234567890123"
  2. Mock数据库查询返回商品数据
  3. 点击"保存"按钮
- **预期结果**：显示错误提示"该条码商品已存在"
- **失败指标**：未检测重复或允许重复
- **证据**：错误提示截图

场景：商品名称长度验证
- **工具**：Playwright测试输入
- **前置条件**：页面已部署
- **步骤**：
  1. 输入201个字符的商品名称
- **预期结果**：显示错误提示"商品名称不能超过200字符"
- **失败指标**：无验证或允许超长
- **证据**：错误提示截图

**提交**：是
- **提交信息**：`feat: implement product creation page`
- **文件**：`pages/add-product/add-product.wxml`, `pages/add-product/add-product.wxss`, `pages/add-product/add-product.js`
- **提交前检查**：录入页功能通过所有QA场景

---

### 任务 12：配置全局样式

**做什么**：
- 创建app.wxss全局样式文件
- 定义苹果深色系颜色变量
- 设置全局页面样式
- 确保所有页面主题一致

**不能做什么**：
- 不能混用深色和浅色主题
- 不能使用非苹果风格的配色

**推荐Agent配置**：
- **类别**：build（quick类别）
- **技能**：无特殊技能要求
- **理由**：样式配置操作

**并行化**：
- **可并行运行**：是
- **并行组**：无（与任务6-11可并行）
- **阻塞**：任务6、7（依赖云开发基础配置）
- **阻塞任务**：任务13

**参考**：

**苹果深色系配色方案**：
```css
/* 颜色变量 */
page {
  --bg-primary: #000000;
  --bg-secondary: #1c1c1e;
  --bg-tertiary: #2c2c2e;
  
  --text-primary: #ffffff;
  --text-secondary: #8e8e93;
  --text-tertiary: #636366;
  
  --accent-blue: #0a84ff;
  --accent-green: #30d158;
  --accent-red: #ff3b30;
  --accent-orange: #ff9f0a;
  
  --border-color: #38383a;
}

/* 全局页面样式 */
page {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', sans-serif;
  font-size: 17px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

/* 按钮样式 */
.btn-primary {
  background-color: var(--accent-blue);
  color: var(--text-primary);
  border-radius: 24px;
}

/* 输入框样式 */
.input {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
  border-radius: 12px;
}
```

**验收标准**：

**Agent执行QA场景**：

场景：验证全局深色主题
- **工具**：Playwright获取计算样式
- **前置条件**：app.wxss已配置
- **步骤**：
  1. 打开任意页面
  2. 获取body/page的背景色
- **预期结果**：背景色为#000000、#1c1c1e或#2c2c2e
- **失败指标**：存在浅色背景
- **证据**：CSS计算样式截图

**提交**：是
- **提交信息**：`style: add global Apple dark theme styles`
- **文件**：`app.wxss`
- **提交前检查**：全局样式通过QA验证

---

### 任务 13：页面集成测试

**做什么**：
- 测试完整用户流程（登录→扫码→查询/录入→评价）
- 验证所有页面间跳转正确
- 测试云数据库集成
- 修复发现的问题

**不能做什么**：
- 不能修改核心需求范围
- 不能添加新功能

**推荐Agent配置**：
- **类别**：build（quick类别）
- **技能**：无特殊技能要求
- **理由**：测试和修复任务

**并行化**：
- **可并行运行**：否
- **并行组**：无
- **阻塞**：任务8-12（依赖所有页面开发完成）
- **阻塞任务**：任务14

**验收标准**：

**Agent执行QA场景**：

场景：完整用户流程测试
- **工具**：Playwright + 微信开发者工具
- **前置条件**：所有页面开发完成
- **步骤**：
  1. 从登录页开始，完成微信授权
  2. 跳转到扫码页，完成扫码
  3. 根据扫描结果跳转到商品页或录入页
  4. 完成商品评价操作
- **预期结果**：完整流程无错误，各页面跳转正确
- **失败指标**：流程中断或页面错误
- **证据**：完整流程执行日志

**提交**：是
- **提交信息**：`test: complete integration testing`
- **文件**：无（测试记录）
- **提交前检查**：所有QA场景通过

---

### 任务 14：真机调试和优化

**做什么**：
- 在真机上测试小程序
- 优化性能和用户体验
- 修复真机上的问题
- 准备提交审核

**不能做什么**：
- 不能进行重大功能变更
- 不能修改核心设计

**推荐Agent配置**：
- **类别**：build（quick类别）
- **技能**：无特殊技能要求
- **理由**：测试和优化任务

**并行化**：
- **可并行运行**：否
- **并行组**：无
- **阻塞**：任务13（依赖集成测试完成）
- **阻塞任务**：无（最终任务）

**验收标准**：

**Agent执行QA场景**：

场景：真机测试扫码功能
- **工具**：微信开发者工具真机调试
- **前置条件**：代码已部署到真机
- **步骤**：
  1. 打开小程序
  2. 完成登录
  3. 测试扫码功能
- **预期结果**：扫码功能在真机上正常工作
- **失败指标**：扫码失败或相机异常
- **证据**：真机测试截图

**提交**：是
- **提交信息**：`perf: optimize for production and prepare for release`
- **文件**：优化后的代码
- **提交前检查**：真机测试通过

---

## 提交策略

| 任务完成后 | 提交信息 | 文件 | 验证命令 |
|-----------|---------|------|---------|
| 1 | `design: add login page design` | design/onWeekend.v1.pen | pencil_batch_get验证 |
| 2 | `design: add scan page design` | design/onWeekend.v1.pen | pencil_batch_get验证 |
| 3 | `design: add product detail page design` | design/onWeekend.v1.pen | pencil_batch_get验证 |
| 4 | `design: add product creation page design` | design/onWeekend.v1.pen | pencil_batch_get验证 |
| 5 | `feat: initialize WeChat Cloud Development` | app.json, app.js | 云开发控制台 |
| 6 | `feat: create database collections` | 云开发配置 | API查询验证 |
| 7 | `feat: configure database security rules` | 云开发安全规则 | 权限验证 |
| 8 | `feat: implement WeChat login page` | pages/login/* | Playwright测试 |
| 9 | `feat: implement scan page` | pages/scan/* | Playwright测试 |
| 10 | `feat: implement product detail page` | pages/product/* | Playwright测试 |
| 11 | `feat: implement product creation page` | pages/add-product/* | Playwright测试 |
| 12 | `style: add global Apple dark theme` | app.wxss | 样式验证 |
| 13 | `test: complete integration testing` | 无 | 完整流程测试 |
| 14 | `perf: optimize for production` | 优化后代码 | 真机测试 |

---

## 成功标准

### 验证命令

```bash
# 设计稿验证
pencil_batch_get --filePath "design/onWeekend.v1.pen" --nodeIds ["login", "scan", "product", "add-product"]

# 页面部署验证
# 在微信开发者工具中打开项目，所有页面可正常编译

# 云开发验证
curl "https://api.weixin.qq.com/tcb/databasecollectionget?access_token=XXX&env=XXX"
# 预期返回: {"collections": ["products", "reviews", "users"]}

# 真机测试
# 使用微信开发者工具真机调试，测试完整流程
```

### 最终检查清单

- [ ] 所有4个设计稿页面通过验证
- [ ] 云开发环境正常开通
- [ ] 数据库3个集合创建完成
- [ ] 数据库安全规则配置正确
- [ ] 登录页微信授权功能正常
- [ ] 扫码页扫码功能正常
- [ ] 商品详情页展示和评价功能正常
- [ ] 新增商品页录入功能正常
- [ ] 全局苹果深色系主题应用
- [ ] 完整用户流程测试通过
- [ ] 真机测试通过

---

## 已解决（Metis审查）

**问题1**：现有代码不匹配需求
- **解决**：完全替换现有登录实现，使用微信授权替代手动头像输入

**问题2**：设计文件为空
- **解决**：首先创建设计稿（任务1-4），再进行开发

**问题3**：缺少关键页面
- **解决**：创建所有4个页面（登录、扫码、商品、录入）

**问题4**：缺少云开发配置
- **解决**：任务5-7完成云开发环境、数据库、安全规则配置

**问题5**：主题不匹配
- **解决**：全局应用苹果深色系样式（任务12）

---

## 决策需要（待确认）

无。所有决策已在访谈中确认。

---

## 默认应用

- **评价排序**：按时间倒序（最新评价在前）
- **评分显示**：5颗星，1-5分
- **图片格式**：仅支持JPG/PNG
- **商品名称限制**：最大200字符
- **评价文字限制**：最大500字符
- **错误提示**：Toast形式显示
- **加载状态**：按钮loading或页面loading
