import { config } from '../../config/index';

/** 获取个人中心信息 */
function mockFetchUserCenter() {
  const { delay } = require('../_utils/delay');
  const { genUsercenter } = require('../../model/usercenter');
  return delay(200).then(() => genUsercenter());
}

/** 获取个人中心信息 */
export function fetchUserCenter() {
  if (config.useMock) {
    return mockFetchUserCenter();
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
          const { userInfo, countsData, orderTagInfos } = res.data.data
          resolve({
            userInfo: {
              avatarUrl: userInfo.avatarUrl || 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/avatars/avatar_1bddf6fc-2b4e-435a-824a-a0579600fc8d_0a6203ea-62c3-47ab-a631-ea8a95f8493c.webp',
              nickName: userInfo.nickname || '微信用户',
              phoneNumber: userInfo.phone || '',
              gender: userInfo.gender || 0,
            },
            countsData: countsData || [
              { num: 0, name: '积分', type: 'point' },
              { num: 0, name: '优惠券', type: 'coupon' },
            ],
            orderTagInfos: [
              {
                title: '待付款',
                iconName: 'wallet',
                orderNum: orderTagInfos?.[0]?.orderNum || 0,
                tabType: 5,
                status: 1,
              },
              {
                title: '待发货',
                iconName: 'deliver',
                orderNum: orderTagInfos?.[1]?.orderNum || 0,
                tabType: 10,
                status: 2,
              },
              {
                title: '待收货',
                iconName: 'package',
                orderNum: orderTagInfos?.[2]?.orderNum || 0,
                tabType: 40,
                status: 3,
              },
              {
                title: '待评价',
                iconName: 'comment',
                orderNum: 0,
                tabType: 60,
                status: 4,
              },
            ],
            customerServiceInfo: {
              servicePhone: '400-000-0000',
              serviceTimeDuration: '每天9:00-21:00',
            },
          })
        } else {
          reject(new Error('获取用户中心信息失败'))
        }
      },
      fail: (err) => {
        console.error('获取用户中心信息失败:', err)
        // 如果API调用失败，返回默认数据
        resolve({
          userInfo: {
            avatarUrl: 'https://pub-7d345f4cf2334fce864509d66ec976f3.r2.dev/avatars/avatar_1bddf6fc-2b4e-435a-824a-a0579600fc8d_0a6203ea-62c3-47ab-a631-ea8a95f8493c.webp',
            nickName: '微信用户',
            phoneNumber: '',
            gender: 0,
          },
          countsData: [
            { num: 0, name: '积分', type: 'point' },
            { num: 0, name: '优惠券', type: 'coupon' },
          ],
          orderTagInfos: [
            { title: '待付款', iconName: 'wallet', orderNum: 0, tabType: 5, status: 1 },
            { title: '待发货', iconName: 'deliver', orderNum: 0, tabType: 10, status: 2 },
            { title: '待收货', iconName: 'package', orderNum: 0, tabType: 40, status: 3 },
            { title: '待评价', iconName: 'comment', orderNum: 0, tabType: 60, status: 4 },
          ],
          customerServiceInfo: {
            servicePhone: '400-000-0000',
            serviceTimeDuration: '每天9:00-21:00',
          },
        })
      }
    })
  });
}
