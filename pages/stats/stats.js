const storage = require('../../utils/storage.js');

Page({
  data: {
    todayCount: 0,
    todayBrands: [],
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

    const brandMap = {};
    todayRecords.forEach(r => {
      if (!brandMap[r.brandName]) {
        brandMap[r.brandName] = 0;
      }
      brandMap[r.brandName]++;
    });
    const todayBrands = Object.entries(brandMap).map(([name, cnt]) => ({ name, count: cnt }));

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
      todayBrands,
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
        dayMap[dayKey] = { count: 0, day: dayNames[date.getDay()], brands: {} };
      }
      dayMap[dayKey].count++;
      const brandName = r.brandName || '未知品牌';
      if (!dayMap[dayKey].brands[brandName]) {
        dayMap[dayKey].brands[brandName] = 0;
      }
      dayMap[dayKey].brands[brandName]++;
    });

    const maxCount = Math.max(...Object.values(dayMap).map(d => d.count), 1);

    const weekData = Object.entries(dayMap).map(([dateStr, data]) => ({
      date: dateStr,
      day: data.day,
      count: data.count,
      percent: (data.count / maxCount) * 100,
      brands: data.brands
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
        dayMap[dateKey] = { count: 0, brands: {} };
      }
      dayMap[dateKey].count++;
      const brandName = r.brandName || '未知品牌';
      if (!dayMap[dateKey].brands[brandName]) {
        dayMap[dateKey].brands[brandName] = 0;
      }
      dayMap[dateKey].brands[brandName]++;
    });

    const today = new Date().toDateString();
    const historyData = Object.entries(dayMap)
      .filter(([dateStr]) => dateStr !== today)
      .map(([date, data]) => ({
        date,
        count: data.count,
        brands: data.brands
      }))
      .slice(0, 7);

    this.setData({ historyData });
  }
});