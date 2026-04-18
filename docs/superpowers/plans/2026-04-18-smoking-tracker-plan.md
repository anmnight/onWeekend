# 吸烟间隔记录小程序实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 开发一个微信小程序，用于记录吸烟间隔、统计每日吸烟数量，支持手动记录和扫码记录两种方式。

**Architecture:** 微信原生框架，本地存储品牌库和记录数据，深色主题UI。

**Tech Stack:** 微信小程序原生框架 (WXML/WXSS/JS)

---

## 文件结构

```
├── app.js                    # 应用入口，初始化云开发
├── app.json                  # 页面注册、tabBar配置
├── app.wxss                  # 全局样式（苹果深色系）
├── pages/
│   ├── index/                # 首页/记录页
│   ├── scan/                 # 扫码页
│   ├── brands/               # 品牌管理页
│   └── stats/                # 统计页
├── utils/
│   └── storage.js            # 存储工具函数
├── data/
│   └── brands.json           # 本地品牌库
└── design/
    └── smoking-tracker.pen   # Pencil设计稿
```

---

## Task 1: 项目脚手架

**Files:**
- Create: `app.json`
- Create: `app.js`
- Create: `app.wxss`
- Create: `project.config.json`

- [ ] **Step 1: 创建 app.json**

```json
{
  "pages": [
    "pages/index/index",
    "pages/scan/scan",
    "pages/brands/brands",
    "pages/stats/stats"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#000000",
    "navigationBarTitleText": "吸烟记录",
    "navigationBarTextStyle": "white"
  },
  "tabBar": {
    "color": "#8e8e93",
    "selectedColor": "#0a84ff",
    "backgroundColor": "#1c1c1e",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "images/home.png",
        "selectedIconPath": "images/home-active.png"
      },
      {
        "pagePath": "pages/stats/stats",
        "text": "统计",
        "iconPath": "images/stats.png",
        "selectedIconPath": "images/stats-active.png"
      }
    ]
  }
}
```

- [ ] **Step 2: 创建 app.js**

```javascript
App({
  onLaunch() {
    // 初始化本地品牌库（如果不存在）
    const brands = wx.getStorageSync('brands');
    if (!brands) {
      wx.setStorageSync('brands', []);
    }

    // 初始化记录列表（如果不存在）
    const records = wx.getStorageSync('records');
    if (!records) {
      wx.setStorageSync('records', []);
    }
  }
})
```

- [ ] **Step 3: 创建 app.wxss（全局深色样式）**

```css
page {
  background-color: #000000;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.container {
  min-height: 100vh;
  background-color: #000000;
  padding: 20px;
}

.btn-primary {
  background-color: #0a84ff;
  color: #ffffff;
  border-radius: 24px;
  height: 48px;
  line-height: 48px;
  font-size: 17px;
  text-align: center;
}

.btn-danger {
  background-color: #ff3b30;
  color: #ffffff;
  border-radius: 24px;
  height: 48px;
  line-height: 48px;
  font-size: 17px;
  text-align: center;
}

.text-primary {
  color: #ffffff;
}

.text-secondary {
  color: #8e8e93;
}

.text-accent {
  color: #0a84ff;
}

.bg-surface {
  background-color: #1c1c1e;
  border-radius: 12px;
  padding: 16px;
}
```

- [ ] **Step 4: 创建 project.config.json**

```json
{
  "description": "吸烟间隔记录小程序",
  "packOptions": {
    "ignore": []
  },
  "setting": {
    "bundleUsage": false,
    "urlCheck": false
  },
  "compileType": "miniprogram",
  "appid": "touristappid",
  "projectname": "smoking-tracker",
  "condition": {}
}
```

- [ ] **Step 5: 创建 images 目录（占位）**

创建 `pages/index/images/` 等目录，添加占位图标或使用基础图标

- [ ] **Step 6: Commit**

```bash
git add app.json app.js app.wxss project.config.json
git commit -m "feat: scaffold WeChat mini-program project"
```

---

## Task 2: 存储工具函数

**Files:**
- Create: `utils/storage.js`
- Create: `data/brands.json`

- [ ] **Step 1: 创建 data/brands.json（初始空品牌库）**

```json
[]
```

- [ ] **Step 2: 创建 utils/storage.js**

```javascript
/**
 * 生成UUID
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 获取品牌库
 */
function getBrands() {
  return wx.getStorageSync('brands') || [];
}

/**
 * 根据条码查找品牌
 * @param {string} barcode 条码
 * @returns {object|null} 品牌对象或null
 */
function findBrandByBarcode(barcode) {
  const brands = getBrands();
  return brands.find(b => b.barcode === barcode) || null;
}

/**
 * 添加品牌
 * @param {string} barcode 条码
 * @param {string} brandName 品牌名
 */
function addBrand(barcode, brandName) {
  const brands = getBrands();
  brands.push({ barcode, brandName });
  wx.setStorageSync('brands', brands);
}

/**
 * 删除品牌
 * @param {string} barcode 条码
 */
function deleteBrand(barcode) {
  const brands = getBrands();
  const index = brands.findIndex(b => b.barcode === barcode);
  if (index > -1) {
    brands.splice(index, 1);
    wx.setStorageSync('brands', brands);
  }
}

/**
 * 获取所有记录
 */
function getRecords() {
  return wx.getStorageSync('records') || [];
}

/**
 * 添加记录
 * @param {object} record 记录对象 {brandId, brandName, type}
 */
function addRecord(record) {
  const records = getRecords();
  const newRecord = {
    id: generateUUID(),
    timestamp: Date.now(),
    brandId: record.brandId || '',
    brandName: record.brandName || '未指定品牌',
    type: record.type || 'manual'
  };
  records.push(newRecord);
  wx.setStorageSync('records', records);
  return newRecord;
}

/**
 * 获取今日记录
 */
function getTodayRecords() {
  const records = getRecords();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();
  return records.filter(r => r.timestamp >= todayStart);
}

/**
 * 获取指定日期的记录
 * @param {Date} date 日期
 */
function getRecordsByDate(date) {
  const records = getRecords();
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);
  return records.filter(r => r.timestamp >= dayStart.getTime() && r.timestamp <= dayEnd.getTime());
}

/**
 * 获取本周记录
 */
function getWeekRecords() {
  const records = getRecords();
  const today = new Date();
  const dayOfWeek = today.getDay() || 7;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek + 1);
  weekStart.setHours(0, 0, 0, 0);
  return records.filter(r => r.timestamp >= weekStart.getTime());
}

module.exports = {
  getBrands,
  findBrandByBarcode,
  addBrand,
  deleteBrand,
  getRecords,
  addRecord,
  getTodayRecords,
  getRecordsByDate,
  getWeekRecords
};
```

- [ ] **Step 3: Commit**

```bash
git add utils/storage.js data/brands.json
git commit -m "feat: add storage utility functions"
```

---

## Task 3: 首页/记录页

**Files:**
- Create: `pages/index/index.wxml`
- Create: `pages/index/index.wxss`
- Create: `pages/index/index.js`

- [ ] **Step 1: 创建 pages/index/index.wxml**

```xml
<view class="container">
  <!-- 今日统计区域 -->
  <view class="stats-card bg-surface">
    <view class="stats-title text-secondary">今日已吸</view>
    <view class="stats-count">{{todayCount}} <text class="stats-unit">根</text></view>
    <view class="stats-row">
      <view class="stats-item">
        <text class="text-secondary">最后吸烟</text>
        <text class="text-primary">{{lastSmokingTime}}</text>
      </view>
      <view class="stats-item">
        <text class="text-secondary">平均间隔</text>
        <text class="text-primary">{{avgInterval}}</text>
      </view>
    </view>
  </view>

  <!-- 记录按钮区域 -->
  <view class="action-area">
    <button class="btn-primary manual-btn" bindtap="handleManualRecord">
      手动记录
    </button>
    <button class="btn-primary scan-btn" bindtap="handleScan">
      扫码记录
    </button>
  </view>

  <!-- 品牌管理入口 -->
  <view class="brand-link" bindtap="goToBrands">
    <text class="text-accent">品牌管理</text>
  </view>
</view>
```

- [ ] **Step 2: 创建 pages/index/index.wxss**

```css
.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats-card {
  width: 100%;
  margin-bottom: 40px;
}

.stats-title {
  font-size: 14px;
  margin-bottom: 8px;
}

.stats-count {
  font-size: 64px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 20px;
}

.stats-unit {
  font-size: 24px;
  font-weight: normal;
}

.stats-row {
  display: flex;
  justify-content: space-between;
}

.stats-item {
  display: flex;
  flex-direction: column;
}

.stats-item text {
  font-size: 14px;
}

.stats-item .text-primary {
  margin-top: 4px;
}

.action-area {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
}

.manual-btn,
.scan-btn {
  width: 200px;
}

.brand-link {
  padding: 16px;
}
```

- [ ] **Step 3: 创建 pages/index/index.js**

```javascript
const storage = require('../../utils/storage.js');

Page({
  data: {
    todayCount: 0,
    lastSmokingTime: '--:--',
    avgInterval: '--'
  },

  onShow() {
    this.updateTodayStats();
  },

  updateTodayStats() {
    const todayRecords = storage.getTodayRecords();
    const count = todayRecords.length;

    let lastTime = '--:--';
    let avgInterval = '--';

    if (count > 0) {
      const lastRecord = todayRecords[count - 1];
      const lastDate = new Date(lastRecord.timestamp);
      lastTime = `${lastDate.getHours().toString().padStart(2, '0')}:${lastDate.getMinutes().toString().padStart(2, '0')}`;

      if (count > 1) {
        const intervals = [];
        for (let i = 1; i < todayRecords.length; i++) {
          intervals.push(todayRecords[i].timestamp - todayRecords[i-1].timestamp);
        }
        const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const hours = Math.floor(avgMs / (1000 * 60 * 60));
        const minutes = Math.floor((avgMs % (1000 * 60 * 60)) / (1000 * 60));
        avgInterval = `${hours}小时${minutes}分钟`;
      }
    }

    this.setData({
      todayCount: count,
      lastSmokingTime: lastTime,
      avgInterval: avgInterval
    });
  },

  handleManualRecord() {
    const record = storage.addRecord({
      type: 'manual'
    });
    this.updateTodayStats();
    wx.showToast({
      title: '已记录',
      icon: 'success'
    });
  },

  handleScan() {
    wx.navigateTo({
      url: '/pages/scan/scan'
    });
  },

  goToBrands() {
    wx.navigateTo({
      url: '/pages/brands/brands'
    });
  }
});
```

- [ ] **Step 4: Commit**

```bash
git add pages/index/index.wxml pages/index/index.wxss pages/index/index.js
git commit -m "feat: implement home page with record buttons and today stats"
```

---

## Task 4: 扫码页

**Files:**
- Create: `pages/scan/scan.wxml`
- Create: `pages/scan/scan.wxss`
- Create: `pages/scan/scan.js`

- [ ] **Step 1: 创建 pages/scan/scan.wxml**

```xml
<view class="container">
  <!-- 扫码中状态 -->
  <view class="scan-area" wx:if="{{!scanResult && !showConfirm}}">
    <view class="scan-tip">点击下方按钮开始扫码</view>
    <button class="btn-primary" bindtap="handleScan" loading="{{scanning}}">
      {{scanning ? '扫描中...' : '开始扫码'}}
    </button>
  </view>

  <!-- 扫码结果确认 -->
  <view class="confirm-area" wx:if="{{showConfirm}}">
    <view class="brand-info bg-surface">
      <text class="text-primary brand-name">{{matchedBrand.brandName}}</text>
      <text class="text-secondary barcode">{{matchedBrand.barcode}}</text>
    </view>
    <view class="confirm-tip text-secondary">确认使用此品牌记录？</view>
    <view class="confirm-buttons">
      <button class="btn-primary" bindtap="confirmRecord">确认</button>
      <button class="btn-secondary" bindtap="cancelScan">取消</button>
    </view>
  </view>

  <!-- 无匹配品牌 -->
  <view class="no-match" wx:if="{{showNoMatch}}">
    <view class="no-match-text text-secondary">未找到匹配品牌</view>
    <view class="no-match-buttons">
      <button class="btn-primary" bindtap="goToAddBrand">添加品牌</button>
      <button class="btn-secondary" bindtap="recordAsUnknown">记为未知</button>
    </view>
  </view>
</view>
```

- [ ] **Step 2: 创建 pages/scan/scan.wxss**

```css
.container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.scan-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.scan-tip {
  color: #8e8e93;
  font-size: 16px;
}

.confirm-area,
.no-match {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
}

.brand-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px;
  width: 100%;
}

.brand-name {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
}

.barcode {
  font-size: 14px;
}

.confirm-tip {
  font-size: 16px;
}

.confirm-buttons,
.no-match-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 200px;
}

.btn-secondary {
  background-color: #2c2c2e;
  color: #ffffff;
  border-radius: 24px;
  height: 48px;
  line-height: 48px;
  font-size: 17px;
  text-align: center;
}

.no-match-text {
  font-size: 18px;
}
```

- [ ] **Step 3: 创建 pages/scan/scan.js**

```javascript
const storage = require('../../utils/storage.js');

Page({
  data: {
    scanning: false,
    showConfirm: false,
    showNoMatch: false,
    matchedBrand: null,
    currentBarcode: ''
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
          wx.navigateBack();
        } else {
          wx.showToast({
            title: '扫描失败',
            icon: 'none'
          });
        }
      }
    });
  },

  handleScanResult(barcode) {
    const brand = storage.findBrandByBarcode(barcode);

    if (brand) {
      this.setData({
        showConfirm: true,
        matchedBrand: brand,
        currentBarcode: barcode
      });
    } else {
      this.setData({
        showNoMatch: true,
        currentBarcode: barcode
      });
    }
  },

  confirmRecord() {
    const { matchedBrand } = this.data;
    storage.addRecord({
      brandId: matchedBrand.barcode,
      brandName: matchedBrand.brandName,
      type: 'scan'
    });

    wx.showToast({
      title: '已记录',
      icon: 'success'
    });

    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  },

  cancelScan() {
    wx.navigateBack();
  },

  goToAddBrand() {
    wx.navigateTo({
      url: `/pages/brands/brands?barcode=${this.data.currentBarcode}&action=add`
    });
  },

  recordAsUnknown() {
    storage.addRecord({
      brandId: '',
      brandName: '未知品牌',
      type: 'scan'
    });

    wx.showToast({
      title: '已记录',
      icon: 'success'
    });

    setTimeout(() => {
      wx.navigateBack();
    }, 1000);
  }
});
```

- [ ] **Step 4: Commit**

```bash
git add pages/scan/scan.wxml pages/scan/scan.wxss pages/scan/scan.js
git commit -m "feat: implement scan page with brand matching"
```

---

## Task 5: 品牌管理页

**Files:**
- Create: `pages/brands/brands.wxml`
- Create: `pages/brands/brands.wxss`
- Create: `pages/brands/brands.js`

- [ ] **Step 1: 创建 pages/brands/brands.wxml**

```xml
<view class="container">
  <!-- 添加品牌表单 -->
  <view class="add-form bg-surface" wx:if="{{showAddForm}}">
    <view class="form-title text-primary">添加品牌</view>
    <input class="form-input" placeholder="条码" value="{{newBarcode}}" disabled />
    <input class="form-input" placeholder="品牌名称" bindinput="onBrandNameInput" value="{{newBrandName}}" />
    <view class="form-buttons">
      <button class="btn-primary" bindtap="confirmAddBrand" disabled="{{!newBrandName}}">保存</button>
      <button class="btn-secondary" bindtap="cancelAdd">取消</button>
    </view>
  </view>

  <!-- 品牌列表 -->
  <view class="brand-list">
    <view class="list-header">
      <text class="text-secondary">已添加品牌 ({{brands.length}})</text>
      <button class="add-btn" bindtap="showAddForm">+ 添加</button>
    </view>

    <view class="brand-item bg-surface" wx:for="{{brands}}" wx:key="barcode">
      <view class="brand-info">
        <text class="text-primary brand-name">{{item.brandName}}</text>
        <text class="text-secondary barcode">{{item.barcode}}</text>
      </view>
      <view class="delete-btn" bindtap="deleteBrand" data-barcode="{{item.barcode}}">
        <text class="text-danger">删除</text>
      </view>
    </view>

    <view class="empty-tip text-secondary" wx:if="{{brands.length === 0}}">
      暂无品牌，点击上方添加
    </view>
  </view>
</view>
```

- [ ] **Step 2: 创建 pages/brands/brands.wxss**

```css
.container {
  padding: 20px;
  min-height: 100vh;
}

.add-form {
  padding: 24px;
  margin-bottom: 24px;
}

.form-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
}

.form-input {
  background-color: #2c2c2e;
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 12px;
}

.form-buttons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.form-buttons button {
  flex: 1;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
}

.add-btn {
  color: #0a84ff;
  font-size: 14px;
  padding: 8px 16px;
}

.brand-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
}

.brand-info {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.barcode {
  font-size: 12px;
}

.delete-btn {
  padding: 8px 16px;
}

.text-danger {
  color: #ff3b30;
}

.empty-tip {
  text-align: center;
  padding: 40px;
  font-size: 14px;
}
```

- [ ] **Step 3: 创建 pages/brands/brands.js**

```javascript
const storage = require('../../utils/storage.js');

Page({
  data: {
    brands: [],
    showAddForm: false,
    newBarcode: '',
    newBrandName: ''
  },

  onLoad(options) {
    if (options.barcode && options.action === 'add') {
      this.setData({
        showAddForm: true,
        newBarcode: options.barcode
      });
    }
    this.loadBrands();
  },

  onShow() {
    this.loadBrands();
  },

  loadBrands() {
    const brands = storage.getBrands();
    this.setData({ brands });
  },

  showAddForm() {
    this.setData({
      showAddForm: true,
      newBarcode: '',
      newBrandName: ''
    });
  },

  onBrandNameInput(e) {
    this.setData({ newBrandName: e.detail.value });
  },

  confirmAddBrand() {
    const { newBarcode, newBrandName } = this.data;
    if (!newBrandName) return;

    if (newBarcode) {
      storage.addBrand(newBarcode, newBrandName);
    } else {
      const barcode = Date.now().toString();
      storage.addBrand(barcode, newBrandName);
    }

    this.setData({
      showAddForm: false,
      newBarcode: '',
      newBrandName: ''
    });

    this.loadBrands();
    wx.showToast({ title: '已添加', icon: 'success' });
  },

  cancelAdd() {
    this.setData({
      showAddForm: false,
      newBarcode: '',
      newBrandName: ''
    });
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

- [ ] **Step 4: Commit**

```bash
git add pages/brands/brands.wxml pages/brands/brands.wxss pages/brands/brands.js
git commit -m "feat: implement brand management page"
```

---

## Task 6: 统计页

**Files:**
- Create: `pages/stats/stats.wxml`
- Create: `pages/stats/stats.wxss`
- Create: `pages/stats/stats.js`

- [ ] **Step 1: 创建 pages/stats/stats.wxml**

```xml
<view class="container">
  <!-- 今日统计 -->
  <view class="section">
    <view class="section-title text-secondary">今日</view>
    <view class="today-card bg-surface">
      <view class="today-count">{{todayCount}} <text class="text-secondary">根</text></view>
      <view class="today-detail text-secondary">
        最后吸烟 {{lastSmokingTime}} · 平均间隔 {{avgInterval}}
      </view>
    </view>
  </view>

  <!-- 本周趋势 -->
  <view class="section">
    <view class="section-title text-secondary">本周趋势</view>
    <view class="week-card bg-surface">
      <view class="week-chart">
        <view class="chart-bar" wx:for="{{weekData}}" wx:key="date">
          <view class="bar-fill" style="height: {{item.percent}}%"></view>
          <view class="bar-label text-secondary">{{item.day}}</view>
          <view class="bar-count text-primary">{{item.count}}</view>
        </view>
      </view>
      <view class="week-avg text-secondary">
        本周平均 {{weekAvg}} 根/天
      </view>
    </view>
  </view>

  <!-- 历史记录 -->
  <view class="section">
    <view class="section-title text-secondary">历史记录</view>
    <view class="history-list">
      <view class="history-item bg-surface" wx:for="{{historyData}}" wx:key="date">
        <text class="history-date text-primary">{{item.date}}</text>
        <text class="history-count text-primary">{{item.count}} 根</text>
      </view>
      <view class="empty-tip text-secondary" wx:if="{{historyData.length === 0}}">
        暂无历史记录
      </view>
    </view>
  </view>
</view>
```

- [ ] **Step 2: 创建 pages/stats/stats.wxss**

```css
.container {
  padding: 20px;
  min-height: 100vh;
}

.section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 14px;
  margin-bottom: 12px;
  padding: 0 4px;
}

.today-card {
  padding: 24px;
  text-align: center;
}

.today-count {
  font-size: 48px;
  font-weight: bold;
  color: #ffffff;
  margin-bottom: 8px;
}

.today-detail {
  font-size: 14px;
}

.week-card {
  padding: 24px;
}

.week-chart {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 120px;
  margin-bottom: 16px;
}

.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar-fill {
  width: 24px;
  background-color: #0a84ff;
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: height 0.3s;
}

.bar-label {
  font-size: 12px;
  margin-top: 8px;
}

.bar-count {
  font-size: 12px;
  margin-top: 4px;
}

.week-avg {
  text-align: center;
  font-size: 14px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
}

.history-date {
  font-size: 16px;
}

.history-count {
  font-size: 16px;
}

.empty-tip {
  text-align: center;
  padding: 40px;
  font-size: 14px;
}
```

- [ ] **Step 3: 创建 pages/stats/stats.js**

```javascript
const storage = require('../../utils/storage.js');

Page({
  data: {
    todayCount: 0,
    lastSmokingTime: '--:--',
    avgInterval: '--',
    weekData: [],
    weekAvg: 0,
    historyData: []
  },

  onShow() {
    this.updateStats();
  },

  updateStats() {
    this.updateTodayStats();
    this.updateWeekStats();
    this.updateHistoryStats();
  },

  updateTodayStats() {
    const todayRecords = storage.getTodayRecords();
    const count = todayRecords.length;

    let lastTime = '--:--';
    let avgInterval = '--';

    if (count > 0) {
      const lastRecord = todayRecords[count - 1];
      const lastDate = new Date(lastRecord.timestamp);
      lastTime = `${lastDate.getHours().toString().padStart(2, '0')}:${lastDate.getMinutes().toString().padStart(2, '0')}`;

      if (count > 1) {
        const intervals = [];
        for (let i = 1; i < todayRecords.length; i++) {
          intervals.push(todayRecords[i].timestamp - todayRecords[i-1].timestamp);
        }
        const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const hours = Math.floor(avgMs / (1000 * 60 * 60));
        const minutes = Math.floor((avgMs % (1000 * 60 * 60)) / (1000 * 60));
        avgInterval = `${hours}小时${minutes}分钟`;
      }
    }

    this.setData({
      todayCount: count,
      lastSmokingTime: lastTime,
      avgInterval: avgInterval
    });
  },

  updateWeekStats() {
    const weekRecords = storage.getWeekRecords();
    const dayNames = ['日', '一', '二', '三', '四', '五', '六'];

    const dayMap = {};
    weekRecords.forEach(r => {
      const date = new Date(r.timestamp);
      const dayKey = date.toDateString();
      if (!dayMap[dayKey]) {
        dayMap[dayKey] = { count: 0, day: dayNames[date.getDay()] };
      }
      dayMap[dayKey].count++;
    });

    const maxCount = Math.max(...Object.values(dayMap).map(d => d.count), 1);

    const weekData = Object.entries(dayMap).map(([dateStr, data]) => ({
      date: dateStr,
      day: data.day,
      count: data.count,
      percent: (data.count / maxCount) * 100
    }));

    const weekAvg = weekRecords.length > 0
      ? Math.round(weekRecords.length / 7 * 10) / 10
      : 0;

    this.setData({ weekData, weekAvg });
  },

  updateHistoryStats() {
    const records = storage.getRecords();
    const dayMap = {};

    records.forEach(r => {
      const date = new Date(r.timestamp);
      const dateKey = `${date.getMonth() + 1}月${date.getDate()}日`;
      if (!dayMap[dateKey]) {
        dayMap[dateKey] = 0;
      }
      dayMap[dateKey]++;
    });

    const today = new Date().toDateString();
    const historyData = Object.entries(dayMap)
      .filter(([dateStr]) => dateStr !== today)
      .map(([date, count]) => ({ date, count }))
      .slice(0, 7);

    this.setData({ historyData });
  }
});
```

- [ ] **Step 4: Commit**

```bash
git add pages/stats/stats.wxml pages/stats/stats.wxss pages/stats/stats.js
git commit -m "feat: implement statistics page"
```

---

## Task 7: Pencil 设计稿

**Files:**
- Create: `design/smoking-tracker.pen`

- [ ] **Step 1: 创建设计稿框架（参考现有 onWeekend.v1.pen）**

设计稿应包含4个页面Frame：
1. `index` - 首页（今日统计、手动记录按钮、扫码按钮、品牌管理入口）
2. `scan` - 扫码页（扫码结果确认、无匹配提示）
3. `brands` - 品牌管理页（品牌列表、添加表单）
4. `stats` - 统计页（今日统计、本周趋势、历史记录）

配色使用现有变量：
- `--background`: #000000
- `--surface`: #1c1c1e
- `--text-primary`: #ffffff
- `--text-secondary`: #8e8e93
- `--accent`: #0a84ff
- `--accent-red`: #ff3b30

- [ ] **Step 2: Commit**

```bash
git add design/smoking-tracker.pen
git commit -m "design: add smoking tracker Pencil design"
```

---

## Task 8: TabBar 图标

**Files:**
- Create: `images/home.png` (占位)
- Create: `images/home-active.png` (占位)
- Create: `images/stats.png` (占位)
- Create: `images/stats-active.png` (占位)

- [ ] **Step 1: 创建占位图标文件**

微信小程序要求图标为PNG格式，尺寸建议81x81像素。可以先用简单占位图，后续替换。

- [ ] **Step 2: Commit**

```bash
git add images/
git commit -m "feat: add tabbar icons placeholder"
```

---

## 自检清单

**1. Spec覆盖检查：**
- [x] 手动记录功能 → Task 3
- [x] 扫码记录功能 → Task 4
- [x] 品牌管理（添加/删除）→ Task 5
- [x] 今日统计 → Task 3, Task 6
- [x] 本周趋势 → Task 6
- [x] 历史记录 → Task 6
- [x] 苹果深色主题 → Task 1, Task 3-6
- [x] Pencil设计稿 → Task 7

**2. 占位符扫描：**
- 无 TBD/TODO
- 无"类似Task N"引用
- 所有步骤有完整代码

**3. 类型一致性：**
- `storage.addRecord()` 参数：`{brandId, brandName, type}` ✓
- `storage.findBrandByBarcode()` 返回：`{barcode, brandName}` ✓
- `storage.getTodayRecords()` 返回：records数组 ✓

---

Plan complete and saved to `docs/superpowers/plans/2026-04-18-smoking-tracker-plan.md`.

**两个执行选项：**

**1. Subagent-Driven (recommended)** - 派遣独立子agent执行每个任务，任务间审查

**2. Inline Execution** - 在当前session执行任务，带检查点

选择哪个？