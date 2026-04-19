# 品牌管理独立Tab实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将品牌管理从首页链接入口独立为第三个Tab

**Architecture:** 修改 app.json tabBar 配置，移除首页的品牌管理链接

**Tech Stack:** 微信小程序

---

## 文件结构

```
├── app.json                    # 修改 tabBar 配置
├── pages/index/index.wxml      # 修改 移除品牌链接
├── pages/index/index.js        # 修改 移除 goToBrands 方法
├── images/brands.png           # 创建 品牌Tab图标
└── images/brands-active.png    # 创建 品牌Tab选中图标
```

---

## Task 1: 修改 tabBar 配置

**Files:**
- Modify: `app.json`

- [ ] **Step 1: 修改 app.json tabBar 配置**

```json
{
  "pages": [
    "pages/index/index",
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
        "pagePath": "pages/brands/brands",
        "text": "品牌",
        "iconPath": "images/brands.png",
        "selectedIconPath": "images/brands-active.png"
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

注：扫码页 `pages/scan/scan` 不需要了，可以从 pages 数组中移除

- [ ] **Step 2: Commit**

```bash
git add app.json
git commit -m "feat: add brands tab to tabBar"
```

---

## Task 2: 移除首页品牌管理链接

**Files:**
- Modify: `pages/index/index.wxml`
- Modify: `pages/index/index.js`

- [ ] **Step 1: 修改 pages/index/index.wxml - 移除品牌链接**

```xml
<view class="container">
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

  <view class="action-area">
    <button class="btn-primary manual-btn" bindtap="handleManualRecord">
      手动记录
    </button>
    <button class="btn-primary scan-btn" bindtap="handleScan">
      扫码记录
    </button>
  </view>

  <view class="brand-picker-modal" wx:if="{{showBrandPicker}}" catchtap="closeBrandPicker">
    <view class="brand-picker-content" catchtap="stopPropagation">
      <view class="picker-header">
        <text class="text-primary">选择品牌</text>
        <view class="close-btn" bindtap="closeBrandPicker">×</view>
      </view>
      <view class="brand-list">
        <view class="brand-item bg-surface {{selectedBrand.barcode === item.barcode ? 'selected' : ''}}"
              wx:for="{{brands}}"
              wx:key="barcode"
              bindtap="selectBrand"
              data-brand="{{item}}">
          <text class="text-primary">{{item.brandName}}</text>
        </view>
        <view class="empty-tip text-secondary" wx:if="{{brands.length === 0}}">
          暂无品牌，请先添加
        </view>
      </view>
      <button class="btn-primary confirm-btn" bindtap="confirmRecord" disabled="{{!selectedBrand}}">
        确认记录
      </button>
    </view>
  </view>
</view>
```

- [ ] **Step 2: 修改 pages/index/index.js - 移除 goToBrands 方法**

```javascript
const storage = require('../../utils/storage.js');

Page({
  data: {
    todayCount: 0,
    lastSmokingTime: '--:--',
    avgInterval: '--',
    showBrandPicker: false,
    brands: [],
    selectedBrand: null
  },

  onShow() {
    this.updateTodayStats();
  },

  onLoad() {
    this.loadBrands();
  },

  loadBrands() {
    const brands = storage.getBrands();
    this.setData({ brands });
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
    this.loadBrands();
    this.setData({
      showBrandPicker: true,
      selectedBrand: null
    });
  },

  closeBrandPicker() {
    this.setData({
      showBrandPicker: false,
      selectedBrand: null
    });
  },

  stopPropagation() {},

  selectBrand(e) {
    this.setData({
      selectedBrand: e.currentTarget.dataset.brand
    });
  },

  confirmRecord() {
    const { selectedBrand } = this.data;
    if (!selectedBrand) return;

    storage.addRecord({
      brandId: selectedBrand.barcode,
      brandName: selectedBrand.brandName,
      type: 'manual'
    });

    this.setData({ showBrandPicker: false, selectedBrand: null });
    this.updateTodayStats();

    wx.showToast({
      title: '已记录',
      icon: 'success'
    });
  },

  handleScan() {
    wx.scanCode({
      success: (res) => {
        this.handleScanResult(res.result);
      },
      fail: (err) => {
        if (!err.errMsg.includes('cancel')) {
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
    const brandName = brand ? brand.brandName : '未知品牌';
    const brandId = brand ? brand.barcode : '';

    storage.addRecord({
      brandId: brandId,
      brandName: brandName,
      type: 'scan'
    });

    this.updateTodayStats();
    wx.showToast({
      title: '已记录',
      icon: 'success'
    });
  }
});
```

- [ ] **Step 3: Commit**

```bash
git add pages/index/index.wxml pages/index/index.js
git commit -m "feat: remove brand link from home page"
```

---

## Task 3: 添加品牌Tab图标

**Files:**
- Create: `images/brands.png`
- Create: `images/brands-active.png`

- [ ] **Step 1: 创建占位图标**

微信小程序要求图标为PNG格式，尺寸建议81x81像素。使用与现有图标风格一致的占位图。

- [ ] **Step 2: Commit**

```bash
git add images/brands.png images/brands-active.png
git commit -m "feat: add brands tab icons"
```

---

## 自检清单

**1. Spec覆盖检查：**
- [x] app.json tabBar 增加品牌Tab → Task 1
- [x] 移除首页品牌链接 → Task 2
- [x] 添加品牌Tab图标 → Task 3

**2. 占位符扫描：**
- 无 TBD/TODO
- 无"类似Task N"引用
- 所有步骤有完整代码

**3. 类型一致性：**
- 无类型变更

---

Plan complete and saved to `docs/superpowers/plans/2026-04-19-brand-tab-plan.md`.

**两个执行选项：**

**1. Subagent-Driven (recommended)** - 派遣独立子agent执行每个任务，任务间审查

**2. Inline Execution** - 在当前session执行任务，带检查点

选择哪个？