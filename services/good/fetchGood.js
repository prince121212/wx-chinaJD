import { config } from '../../config/index';

/** 获取商品列表 */
function mockFetchGood(ID = 0) {
  const { delay } = require('../_utils/delay');
  const { genGood } = require('../../model/good');
  return delay().then(() => genGood(ID));
}

/** 获取商品列表 */
export function fetchGood(ID = 0) {
  if (config.useMock) {
    return mockFetchGood(ID);
  }

  // 调用真实API
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${config.apiBaseUrl}/products/${ID}`,
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          resolve(res.data.data);
        } else {
          reject(new Error('获取商品详情失败'));
        }
      },
      fail: (err) => {
        console.error('获取商品详情失败:', err);
        reject(err);
      }
    });
  });
}
