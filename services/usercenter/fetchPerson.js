import { config } from '../../config/index';

/** 获取个人中心信息 */
function mockFetchPerson() {
  const { delay } = require('../_utils/delay');
  const { genSimpleUserInfo } = require('../../model/usercenter');
  const { genAddress } = require('../../model/address');
  const address = genAddress();
  return delay().then(() => ({
    ...genSimpleUserInfo(),
    address: {
      provinceName: address.provinceName,
      provinceCode: address.provinceCode,
      cityName: address.cityName,
      cityCode: address.cityCode,
    },
  }));
}

/** 获取个人中心信息 */
export function fetchPerson() {
  if (config.useMock) {
    return mockFetchPerson();
  }

  // 调用真实API
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${config.apiBaseUrl}/user/info`,
      method: 'GET',
      header: {
        'authorization': 'user_test123' // 临时用户token
      },
      success: (res) => {
        if (res.data.success) {
          const { userInfo, countsData } = res.data.data
          resolve({
            avatarUrl: userInfo.avatarUrl || 'https://tdesign.gtimg.com/miniprogram/template/retail/avatar.png',
            nickName: userInfo.nickname || '微信用户',
            phoneNumber: userInfo.phone || '',
            gender: userInfo.gender || 0,
            address: {
              provinceName: '广东省',
              provinceCode: '440000',
              cityName: '深圳市',
              cityCode: '440300',
            }
          })
        } else {
          reject(new Error('获取用户信息失败'))
        }
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err)
        // 如果API调用失败，返回默认用户信息
        resolve({
          avatarUrl: 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/avatars/avatar_1bddf6fc-2b4e-435a-824a-a0579600fc8d_0a6203ea-62c3-47ab-a631-ea8a95f8493c.webp',
          nickName: '微信用户',
          phoneNumber: '138****8888',
          gender: 1,
          address: {
            provinceName: '广东省',
            provinceCode: '440000',
            cityName: '深圳市',
            cityCode: '440300',
          }
        })
      }
    })
  })
}
