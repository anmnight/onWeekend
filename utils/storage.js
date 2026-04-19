/**
 * 生成UUID
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * 获取品牌库
 */
function getBrands() {
  return wx.getStorageSync('brands') || [];
}

/**
 * 根据条码查找品牌
 * @param {string} barcode 条码
 * @returns {object|null} 品牌对象或null
 */
function findBrandByBarcode(barcode) {
  const brands = getBrands();
  return brands.find(b => b.barcode === barcode) || null;
}

/**
 * 添加品牌
 * @param {string} barcode 条码
 * @param {string} brandName 品牌名
 * @param {string} bgImage 背景图片路径
 */
function addBrand(barcode, brandName, bgImage) {
  const brands = getBrands();
  brands.push({ barcode, brandName, bgImage: bgImage || '' });
  wx.setStorageSync('brands', brands);
}

/**
 * 删除品牌
 * @param {string} barcode 条码
 */
function deleteBrand(barcode) {
  const brands = getBrands();
  const index = brands.findIndex(b => b.barcode === barcode);
  if (index > -1) {
    brands.splice(index, 1);
    wx.setStorageSync('brands', brands);
  }
}

/**
 * 获取所有记录
 */
function getRecords() {
  return wx.getStorageSync('records') || [];
}

/**
 * 添加记录
 * @param {object} record 记录对象 {brandId, brandName, type}
 */
function addRecord(record) {
  const records = getRecords();
  const newRecord = {
    id: generateUUID(),
    timestamp: Date.now(),
    brandId: record.brandId || '',
    brandName: record.brandName || '未指定品牌',
    type: record.type || 'manual'
  };
  records.push(newRecord);
  wx.setStorageSync('records', records);
  return newRecord;
}

/**
 * 获取今日记录
 */
function getTodayRecords() {
  const records = getRecords();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStart = today.getTime();
  return records.filter(r => r.timestamp >= todayStart);
}

/**
 * 获取指定日期的记录
 * @param {Date} date 日期
 */
function getRecordsByDate(date) {
  const records = getRecords();
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);
  return records.filter(r => r.timestamp >= dayStart.getTime() && r.timestamp <= dayEnd.getTime());
}

/**
 * 获取本周记录
 */
function getWeekRecords() {
  const records = getRecords();
  const today = new Date();
  const dayOfWeek = today.getDay() || 7;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - dayOfWeek + 1);
  weekStart.setHours(0, 0, 0, 0);
  return records.filter(r => r.timestamp >= weekStart.getTime());
}

module.exports = {
  getBrands,
  findBrandByBarcode,
  addBrand,
  deleteBrand,
  getRecords,
  addRecord,
  getTodayRecords,
  getRecordsByDate,
  getWeekRecords
};