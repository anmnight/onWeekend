App({
  onLaunch() {
    const brands = wx.getStorageSync('brands');
    if (!brands) {
      wx.setStorageSync('brands', []);
    }

    const records = wx.getStorageSync('records');
    if (!records) {
      wx.setStorageSync('records', []);
    }
  }
})