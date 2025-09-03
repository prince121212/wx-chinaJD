import { config } from '../../config/index';

/** 获取商品列表 */
function mockFetchGoodsList(pageIndex = 1, pageSize = 20) {
  const { delay } = require('../_utils/delay');
  const { getGoodsList } = require('../../model/goods');
  return delay().then(() =>
    getGoodsList(pageIndex, pageSize).map((item) => {
      return {
        spuId: item.spuId,
        thumb: item.primaryImage,
        title: item.title,
        price: item.minSalePrice,
        originPrice: item.maxLinePrice,
        tags: item.spuTagList.map((tag) => tag.title),
      };
    }),
  );
}

/** 获取商品列表 */
export function fetchGoodsList(pageIndex = 1, pageSize = 20, categoryId = '', keyword = '') {
  if (config.useMock) {
    return mockFetchGoodsList(pageIndex, pageSize);
  }
  
  // 构建请求参数
  const params = {
    page: pageIndex,
    limit: pageSize,
  };
  
  if (categoryId) {
    params.categoryId = categoryId;
  }
  
  if (keyword) {
    params.keyword = keyword;
  }
  
  const queryString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');
    
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${config.apiBaseUrl}/products?${queryString}`,
      method: 'GET',
      success: (res) => {
        if (res.statusCode === 200 && res.data.success) {
          // 转换数据格式以匹配小程序期望的格式
          const formattedData = res.data.data.list.map((item) => ({
            spuId: item.spuId,
            thumb: item.primaryImage,
            title: item.title,
            price: item.minSalePrice || (item.minPrice * 100), // 优先使用minSalePrice（已经是分），否则转换minPrice
            originPrice: item.maxLinePrice || (item.minOriginPrice * 100), // 优先使用maxLinePrice（已经是分），否则转换minOriginPrice
            tags: item.spuTagList ? item.spuTagList.map(tag => tag.title) : (item.category ? [item.category.name] : []),
          }));
          resolve(formattedData);
        } else {
          console.error('API请求失败:', res.data.msg || '未知错误');
          reject(new Error(res.data.msg || '获取商品列表失败'));
        }
      },
      fail: (error) => {
        console.error('网络请求失败:', error);
        reject(new Error('网络请求失败'));
      }
    });
  });
}
