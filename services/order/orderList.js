import { config } from '../../config/index';

/** 获取订单列表mock数据 */
function mockFetchOrders(params) {
  const { delay } = require('../_utils/delay');
  const { genOrders } = require('../../model/order/orderList');

  return delay(200).then(() => genOrders(params));
}

/** 获取订单列表数据 */
export function fetchOrders(params) {
  if (config.useMock) {
    return mockFetchOrders(params);
  }

  // 调用真实API
  return new Promise((resolve, reject) => {
    const { parameter } = params || {}
    const { pageSize = 10, pageNum = 1, orderStatus } = parameter || {}

    let url = `${config.apiBaseUrl}/orders?page=${pageNum}&limit=${pageSize}`
    if (orderStatus !== undefined && orderStatus !== -1) {
      url += `&status=${orderStatus}`
    }

    wx.request({
      url,
      method: 'GET',
      header: {
        'authorization': 'user_test123' // 临时用户token
      },
      success: (res) => {
        if (res.data.success) {
          resolve({
            data: {
              orders: res.data.data.list || [],
              total: res.data.data.total || 0
            }
          })
        } else {
          reject(new Error('获取订单列表失败'));
        }
      },
      fail: (err) => {
        console.error('获取订单列表失败:', err);
        // 如果API调用失败，返回空列表
        resolve({
          data: {
            orders: [],
            total: 0
          }
        })
      }
    });
  });
}

/** 获取订单列表mock数据 */
function mockFetchOrdersCount(params) {
  const { delay } = require('../_utils/delay');
  const { genOrdersCount } = require('../../model/order/orderList');

  return delay().then(() => genOrdersCount(params));
}

/** 获取订单列表统计 */
export function fetchOrdersCount(params) {
  if (config.useMock) {
    return mockFetchOrdersCount(params);
  }

  // 调用真实API
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${config.apiBaseUrl}/orders/count`,
      method: 'GET',
      header: {
        'authorization': 'user_test123' // 临时用户token
      },
      success: (res) => {
        if (res.data.success) {
          resolve({
            data: res.data.data || []
          })
        } else {
          reject(new Error('获取订单统计失败'));
        }
      },
      fail: (err) => {
        console.error('获取订单统计失败:', err);
        // 如果API调用失败，返回空统计
        resolve({
          data: []
        })
      }
    });
  });
}
