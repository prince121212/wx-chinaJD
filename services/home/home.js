import { config, cdnBase } from '../../config/index';

/** 获取首页数据 */
function mockFetchHome() {
  const { delay } = require('../_utils/delay');
  const { genSwiperImageList } = require('../../model/swiper');
  return delay().then(() => {
    return {
      swiper: genSwiperImageList(),
      tabList: [
        {
          text: '精选推荐',
          key: 0,
        },
        {
          text: '夏日防晒',
          key: 1,
        },
        {
          text: '二胎大作战',
          key: 2,
        },
        {
          text: '人气榜',
          key: 3,
        },
        {
          text: '好评榜',
          key: 4,
        },
        {
          text: 'RTX 30',
          key: 5,
        },
        {
          text: '手机也疯狂',
          key: 6,
        },
      ],
      activityImg: `${cdnBase}/activity/banner.png`,
    };
  });
}

/** 获取首页数据 */
export function fetchHome() {
  if (config.useMock) {
    return mockFetchHome();
  }

  // 调用真实API
  return new Promise((resolve, reject) => {
    // 获取轮播图数据
    wx.request({
      url: `${config.apiBaseUrl}/banners`,
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          resolve({
            swiper: res.data.data,
            tabList: [
              {
                text: '精选推荐',
                key: 0,
              },
              {
                text: '茶具',
                key: 1,
              },
              {
                text: '餐具',
                key: 2,
              },
              {
                text: '创意瓷',
                key: 3,
              },
            ],
            activityImg: `${cdnBase}/activity/banner.png`,
          });
        } else {
          reject(new Error('获取轮播图失败'));
        }
      },
      fail: (err) => {
        console.error('获取轮播图失败:', err);
        reject(err);
      }
    });
  });
}
