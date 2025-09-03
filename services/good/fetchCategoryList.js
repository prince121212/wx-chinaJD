import { config } from '../../config/index';

/** 获取商品列表 */
function mockFetchGoodCategory() {
  const { delay } = require('../_utils/delay');
  const { getCategoryList } = require('../../model/category');
  return delay().then(() => getCategoryList());
}

/** 获取商品列表 */
export function getCategoryList() {
  if (config.useMock) {
    return mockFetchGoodCategory();
  }

  // 调用真实API
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${config.apiBaseUrl}/categories`,
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          resolve(res.data.data);
        } else {
          reject(new Error('获取分类列表失败'));
        }
      },
      fail: (err) => {
        console.error('获取分类列表失败:', err);
        reject(err);
      }
    });
  });
}
