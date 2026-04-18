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