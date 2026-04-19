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
    if (!this.data.tempBarcode) {
      wx.showToast({ title: '请输入条码', icon: 'none' });
      return;
    }
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
    if (!tempBrandName) {
      wx.showToast({ title: '请输入品牌名', icon: 'none' });
      return;
    }
    if (!tempBarcode) {
      wx.showToast({ title: '请输入条码', icon: 'none' });
      return;
    }

    const success = storage.addBrand(tempBarcode, tempBrandName, tempBgImage);
    if (!success) {
      wx.showToast({ title: '品牌已存在', icon: 'none' });
      return;
    }

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