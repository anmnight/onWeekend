# 品牌卡片页面优化实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将品牌管理页改为卡片式布局，支持拍照背景，添加品牌流程增加扫码/手动输入选项

**Architecture:** 修改品牌管理页面 WXML/WXSS/JS，storage 增加图片字段，添加图片选择和模糊处理

**Tech Stack:** 微信小程序原生框架

---

## 文件结构

```
├── pages/brands/brands.wxml      # 修改 卡片式布局、添加弹窗
├── pages/brands/brands.wxss      # 修改 卡片样式、弹窗样式
├── pages/brands/brands.js        # 修改 添加流程逻辑、图片选择
├── utils/storage.js              # 修改 Brand 数据结构增加 bgImage 字段
└── data/brands.json              # 初始品牌库（可保留空）
```

---

## Task 1: 更新 storage.js 支持品牌图片

**Files:**
- Modify: `utils/storage.js`

- [ ] **Step 1: 修改 storage.js - Brand 数据结构增加 bgImage 字段**

```javascript
// 修改 addBrand 函数
function addBrand(barcode, brandName, bgImage) {
  const brands = getBrands();
  brands.push({ barcode, brandName, bgImage: bgImage || '' });
  wx.setStorageSync('brands', brands);
}

// 修改 deleteBrand 函数（保持不变）

// 修改 findBrandByBarcode 函数（保持不变）
```

- [ ] **Step 2: Commit**

```bash
git add utils/storage.js
git commit -m "feat: add bgImage field to brand structure"
```

---

## Task 2: 品牌卡片样式

**Files:**
- Modify: `pages/brands/brands.wxss`

- [ ] **Step 1: 添加卡片样式**

```css
.container {
  padding: 20px;
  min-height: 100vh;
}

.brand-card {
  position: relative;
  height: 160px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
}

.card-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  filter: blur(10px);
  transform: scale(1.1);
}

.card-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
}

.card-content {
  position: relative;
  z-index: 1;
  height: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #0a84ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}

.brand-name {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
}

.brand-barcode {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
}

.card-footer {
  display: flex;
  justify-content: flex-end;
}

.delete-btn {
  padding: 8px 16px;
  background-color: rgba(255,59,48,0.8);
  border-radius: 16px;
}

.delete-btn text {
  color: #ffffff;
  font-size: 14px;
}

/* 添加按钮 */
.add-btn-fixed {
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: #0a84ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(10,132,255,0.4);
}

.add-btn-fixed::after {
  border: none;
}

/* 弹窗样式 */
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.6);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.modal-content {
  width: 100%;
  max-height: 70vh;
  background-color: #1c1c1e;
  border-radius: 16px 16px 0 0;
  padding: 20px;
}

.modal-title {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-bottom: 20px;
}

.modal-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-option {
  background-color: #2c2c2e;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-option text {
  color: #ffffff;
  font-size: 16px;
}

.modal-cancel {
  margin-top: 12px;
  background-color: #3a3a3c;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.modal-cancel text {
  color: #8e8e93;
  font-size: 16px;
}

/* 输入表单 */
.form-section {
  margin-bottom: 20px;
}

.form-label {
  font-size: 14px;
  color: #8e8e93;
  margin-bottom: 8px;
}

.form-input {
  background-color: #2c2c2e;
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 16px;
  width: 100%;
  box-sizing: border-box;
}

.form-buttons {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.form-buttons button {
  flex: 1;
  height: 48px;
  border-radius: 24px;
  font-size: 16px;
}

.btn-secondary-form {
  background-color: #2c2c2e;
  color: #ffffff;
}

/* 图片选择 */
.image-picker {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.image-item {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.image-item image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.add-image-btn {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  border: 2px dashed #8e8e93;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  color: #8e8e93;
}

.empty-tip {
  text-align: center;
  padding: 60px 20px;
  font-size: 14px;
  color: #8e8e93;
}
```

- [ ] **Step 2: Commit**

```bash
git add pages/brands/brands.wxss
git commit -m "feat: add brand card styles with blur background"
```

---

## Task 3: 品牌卡片 WXML 布局

**Files:**
- Modify: `pages/brands/brands.wxml`

- [ ] **Step 1: 重写 brands.wxml**

```xml
<view class="container">
  <!-- 品牌列表 -->
  <view class="brand-list">
    <view class="brand-card" wx:for="{{brands}}" wx:key="barcode">
      <view class="card-bg" style="background-image: url({{item.bgImage}})" wx:if="{{item.bgImage}}"></view>
      <view class="card-mask"></view>
      <view class="card-content">
        <view class="card-header">
          <view class="brand-avatar" style="background-color: {{item.avatarColor}}">
            {{item.brandName.substr(0, 1)}}
          </view>
          <view class="brand-info">
            <view class="brand-name">{{item.brandName}}</view>
            <view class="brand-barcode">{{item.barcode}}</view>
          </view>
        </view>
        <view class="card-footer">
          <view class="delete-btn" bindtap="deleteBrand" data-barcode="{{item.barcode}}">
            <text>删除</text>
          </view>
        </view>
      </view>
    </view>

    <view class="empty-tip" wx:if="{{brands.length === 0}}">
      暂无品牌\n点击右下角"+"添加
    </view>
  </view>

  <!-- 添加按钮 -->
  <view class="add-btn-fixed" bindtap="showAddOptions">+</view>

  <!-- 添加选项弹窗 -->
  <view class="modal-mask" wx:if="{{showOptions}}" bindtap="closeOptions">
    <view class="modal-content" catchtap="stopPropagation">
      <view class="modal-title">添加品牌</view>
      <view class="modal-options">
        <view class="modal-option" bindtap="scanBarcode">
          <text>📷</text>
          <text>扫描二维码</text>
        </view>
        <view class="modal-option" bindtap="showManualInput">
          <text>✏️</text>
          <text>手动输入条码</text>
        </view>
      </view>
      <view class="modal-cancel" bindtap="closeOptions">
        <text>取消</text>
      </view>
    </view>
  </view>

  <!-- 手动输入条码弹窗 -->
  <view class="modal-mask" wx:if="{{showManual}}" bindtap="closeManual">
    <view class="modal-content" catchtap="stopPropagation">
      <view class="modal-title">输入条码</view>
      <view class="form-section">
        <input class="form-input" placeholder="请输入条码" bindinput="onBarcodeInput" value="{{tempBarcode}}"/>
      </view>
      <view class="form-buttons">
        <button class="btn-secondary-form" bindtap="closeManual">取消</button>
        <button class="btn-primary" bindtap="confirmBarcode">下一步</button>
      </view>
    </view>
  </view>

  <!-- 完善品牌信息弹窗 -->
  <view class="modal-mask" wx:if="{{showBrandForm}}" bindtap="closeBrandForm">
    <view class="modal-content" catchtap="stopPropagation">
      <view class="modal-title">完善品牌信息</view>
      <view class="form-section">
        <view class="form-label">条码</view>
        <input class="form-input" value="{{tempBarcode}}" disabled/>
      </view>
      <view class="form-section">
        <view class="form-label">品牌名称</view>
        <input class="form-input" placeholder="请输入品牌名称" bindinput="onBrandNameInput" value="{{tempBrandName}}"/>
      </view>
      <view class="form-section">
        <view class="form-label">卡片背景照片</view>
        <view class="image-picker">
          <view class="image-item" wx:if="{{tempBgImage}}">
            <image src="{{tempBgImage}}" mode="aspectFill"/>
          </view>
          <view class="add-image-btn" bindtap="chooseImage">+</view>
        </view>
      </view>
      <view class="form-buttons">
        <button class="btn-secondary-form" bindtap="closeBrandForm">取消</button>
        <button class="btn-primary" bindtap="saveBrand" disabled="{{!tempBrandName}}">保存</button>
      </view>
    </view>
  </view>
</view>
```

- [ ] **Step 2: Commit**

```bash
git add pages/brands/brands.wxml
git commit -m "feat: add brand card wxml with modal dialogs"
```

---

## Task 4: 品牌管理 JS 逻辑

**Files:**
- Modify: `pages/brands/brands.js`

- [ ] **Step 1: 重写 brands.js**

```javascript
const storage = require('../../utils/storage.js');

const AVATAR_COLORS = ['#0a84ff', '#30d158', '#ff9f0a', '#ff375f', '#bf5af2', '#64d2ff'];

Page({
  data: {
    brands: [],
    showOptions: false,
    showManual: false,
    showBrandForm: false,
    tempBarcode: '',
    tempBrandName: '',
    tempBgImage: ''
  },

  onShow() {
    this.loadBrands();
  },

  loadBrands() {
    const brands = storage.getBrands();
    brands.forEach((b, i) => {
      b.avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
    });
    this.setData({ brands });
  },

  showAddOptions() {
    this.setData({ showOptions: true });
  },

  closeOptions() {
    this.setData({ showOptions: false });
  },

  stopPropagation() {},

  scanBarcode() {
    this.setData({ showOptions: false });
    wx.scanCode({
      success: (res) => {
        this.setData({
          tempBarcode: res.result,
          showBrandForm: true
        });
      },
      fail: () => {
        wx.showToast({ title: '扫描失败', icon: 'none' });
      }
    });
  },

  showManualInput() {
    this.setData({ showOptions: false, showManual: true });
  },

  closeManual() {
    this.setData({ showManual: false, tempBarcode: '' });
  },

  onBarcodeInput(e) {
    this.setData({ tempBarcode: e.detail.value });
  },

  confirmBarcode() {
    if (!this.data.tempBarcode) return;
    this.setData({ showManual: false, showBrandForm: true });
  },

  closeBrandForm() {
    this.setData({
      showBrandForm: false,
      tempBarcode: '',
      tempBrandName: '',
      tempBgImage: ''
    });
  },

  onBrandNameInput(e) {
    this.setData({ tempBrandName: e.detail.value });
  },

  chooseImage() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera', 'album'],
      success: (res) => {
        this.setData({ tempBgImage: res.tempFilePaths[0] });
      }
    });
  },

  saveBrand() {
    const { tempBarcode, tempBrandName, tempBgImage } = this.data;
    if (!tempBrandName) return;

    storage.addBrand(tempBarcode, tempBrandName, tempBgImage);

    this.setData({
      showBrandForm: false,
      tempBarcode: '',
      tempBrandName: '',
      tempBgImage: ''
    });

    this.loadBrands();
    wx.showToast({ title: '已添加', icon: 'success' });
  },

  deleteBrand(e) {
    const { barcode } = e.currentTarget.dataset;

    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个品牌吗？',
      success: (res) => {
        if (res.confirm) {
          storage.deleteBrand(barcode);
          this.loadBrands();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  }
});
```

- [ ] **Step 2: Commit**

```bash
git add pages/brands/brands.js
git commit -m "feat: add brand management logic with multi-step add flow"
```

---

## Task 5: 更新 storage.js 的 addBrand 函数

**Files:**
- Modify: `utils/storage.js`

- [ ] **Step 1: 更新 addBrand 函数支持 bgImage 参数**

```javascript
function addBrand(barcode, brandName, bgImage) {
  const brands = getBrands();
  brands.push({
    barcode,
    brandName,
    bgImage: bgImage || ''
  });
  wx.setStorageSync('brands', brands);
}
```

- [ ] **Step 2: Commit**

```bash
git add utils/storage.js
git commit -m "feat: update addBrand to support bgImage"
```

---

## 自检清单

**1. Spec覆盖检查：**
- [x] 卡片式布局 → Task 2, Task 3
- [x] 拍照背景模糊 → Task 2 (blur + mask)
- [x] 扫描/手动输入添加流程 → Task 3, Task 4
- [x] 完善品牌信息（名称+照片） → Task 4
- [x] 删除功能 → Task 4

**2. 占位符扫描：**
- 无 TBD/TODO
- 无"类似Task N"引用
- 所有步骤有完整代码

**3. 类型一致性：**
- `storage.addBrand(barcode, brandName, bgImage)` ✓
- 卡片 avatarColor 计算 ✓

---

Plan complete and saved to `docs/superpowers/plans/2026-04-19-brand-card-plan.md`.

**两个执行选项：**

**1. Subagent-Driven (recommended)** - 派遣独立子agent执行每个任务，任务间审查

**2. Inline Execution** - 在当前session执行任务，带检查点

选择哪个？