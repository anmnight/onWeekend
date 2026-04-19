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