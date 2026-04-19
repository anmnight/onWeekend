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