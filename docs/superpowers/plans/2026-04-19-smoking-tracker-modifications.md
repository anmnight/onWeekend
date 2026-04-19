# 吸烟记录小程序需求变更实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修改两个流程：手动记录时选择已有品牌；扫码记录时直接打开相机扫描，无需确认页

**Architecture:** 微信小程序，首页集成品牌选择器，扫码页简化为直接扫描+自动记录

**Tech Stack:** 微信小程序原生框架 (WXML/WXSS/JS)

---

## 变更说明

### 变更1：手动记录流程
- 现状：点击"手动记录"直接记录，品牌为"未指定品牌"
- 目标：点击"手动记录"弹出品牌选择器，选择品牌后记录

### 变更2：扫码记录流程
- 现状：首页→扫码页→显示确认页→用户确认→记录
- 目标：首页→直接打开相机扫描→匹配品牌自动记录→返回首页

---

## 文件结构

```
├── pages/index/index.wxml    # 修改：手动记录按钮
├── pages/index/index.js      # 修改：handleManualRecord改为弹出选择器
├── pages/index/index.wxss     # 修改：选择器样式
├── pages/scan/scan.wxml      # 修改：简化为扫描状态
├── pages/scan/scan.js        # 修改：扫描成功自动记录
└── utils/storage.js          # 无变更
```

---

## Task 1: 首页手动记录 - 添加品牌选择器

**Files:**
- Modify: `pages/index/index.wxml:17-24`
- Modify: `pages/index/index.js:45-53`
- Modify: `pages/index/index.wxss` (add picker styles)

- [ ] **Step 1: 修改 pages/index/index.wxml - 添加品牌选择弹窗**

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

  <view class="brand-link" bindtap="goToBrands">
    <text class="text-accent">品牌管理</text>
  </view>

  <!-- 品牌选择弹窗 -->
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

- [ ] **Step 2: 修改 pages/index/index.js - 品牌选择逻辑**

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
  },

  goToBrands() {
    wx.navigateTo({
      url: '/pages/brands/brands'
    });
  }
});
```

- [ ] **Step 3: 修改 pages/index/index.wxss - 添加选择器样式**

```css
/* 品牌选择器弹窗 */
.brand-picker-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.brand-picker-content {
  width: 100%;
  max-height: 60vh;
  background-color: #1c1c1e;
  border-radius: 16px 16px 0 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

.close-btn {
  font-size: 28px;
  color: #8e8e93;
  padding: 0 8px;
}

.brand-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
}

.brand-item {
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.brand-item.selected {
  background-color: #0a84ff;
}

.confirm-btn {
  width: 100%;
  margin-top: auto;
}
```

- [ ] **Step 4: 运行测试验证手动记录流程**

测试步骤：
1. 首页点击"手动记录"
2. 弹窗显示已有品牌列表
3. 选择一个品牌，点击"确认记录"
4. 验证 Toast 提示"已记录"
5. 验证今日统计数量+1

- [ ] **Step 5: Commit**

```bash
git add pages/index/index.wxml pages/index/index.js pages/index/index.wxss
git commit -m "feat: manual record shows brand picker for selection"
```

---

## Task 2: 扫码记录流程简化

**Files:**
- Modify: `pages/scan/scan.wxml`
- Modify: `pages/scan/scan.js`

- [ ] **Step 1: 修改 pages/scan/scan.wxml - 简化为扫描状态**

```xml
<view class="container">
  <view class="scan-area">
    <view class="scan-tip text-secondary">正在扫描...</view>
    <view class="scan-icon">📷</view>
  </view>
</view>
```

- [ ] **Step 2: 修改 pages/scan/scan.js - 打开页面直接扫描，扫描后自动记录**

```javascript
const storage = require('../../utils/storage.js');

Page({
  data: {
    currentBarcode: ''
  },

  onLoad() {
    this.startScan();
  },

  startScan() {
    wx.scanCode({
      success: (res) => {
        this.handleScanResult(res.result);
      },
      fail: (err) => {
        wx.showToast({
          title: '扫描失败',
          icon: 'none'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
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

    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2];
    if (prevPage && prevPage.updateTodayStats) {
      prevPage.updateTodayStats();
    }

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

- [ ] **Step 3: 运行测试验证扫码记录流程**

测试步骤：
1. 首页点击"扫码记录"
2. 直接打开扫码界面
3. 扫描烟盒条码
4. 自动记录并返回首页
5. 验证首页今日统计已更新

- [ ] **Step 4: Commit**

```bash
git add pages/scan/scan.wxml pages/scan/scan.js
git commit -m "feat: scan directly opens camera and auto-records"
```

---

## 自检清单

**1. Spec覆盖检查：**
- [x] 手动记录选择已有品牌 → Task 1
- [x] 扫码直接打开相机 → Task 2
- [x] 扫码自动记录 → Task 2

**2. 占位符扫描：**
- 无 TBD/TODO
- 无"类似Task N"引用
- 所有步骤有完整代码

**3. 类型一致性：**
- `storage.addRecord()` 参数：`{brandId, brandName, type}` ✓
- `storage.findBrandByBarcode()` 返回：`{barcode, brandName}` ✓

---

Plan complete and saved to `docs/superpowers/plans/2026-04-19-smoking-tracker-modifications.md`.

**两个执行选项：**

**1. Subagent-Driven (recommended)** - 派遣独立子agent执行每个任务，任务间审查

**2. Inline Execution** - 在当前session执行任务，带检查点

选择哪个？