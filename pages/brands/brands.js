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