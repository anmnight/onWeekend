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