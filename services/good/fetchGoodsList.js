/* eslint-disable no-param-reassign */
import { config } from '../../config/index';

/** 获取商品列表 */
function mockFetchGoodsList(params) {
  const { delay } = require('../_utils/delay');
  const { getSearchResult } = require('../../model/search');

  const data = getSearchResult(params);

  if (data.spuList.length) {
    data.spuList.forEach((item) => {
      item.spuId = item.spuId;
      item.thumb = item.primaryImage;
      item.title = item.title;
      item.price = item.minSalePrice;
      item.originPrice = item.maxLinePrice;
      item.desc = '';
      if (item.spuTagList) {
        item.tags = item.spuTagList.map((tag) => tag.title);
      } else {
        item.tags = [];
      }
    });
  }
  return delay().then(() => {
    return data;
  });
}

/** 获取商品列表 */
export function fetchGoodsList(params) {
  if (config.useMock) {
    return mockFetchGoodsList(params);
  }

  // 调用真实API
  return new Promise((resolve, reject) => {
    const { pageNum = 1, pageSize = 30, keyword = '', sort = 0 } = params || {}

    let url = `${config.apiBaseUrl}/products?page=${pageNum}&limit=${pageSize}`
    if (keyword) {
      url += `&keyword=${encodeURIComponent(keyword)}`
    }

    wx.request({
      url,
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          const { list, total } = res.data.data

          // 转换数据格式以匹配商品列表页面期望的格式
          const spuList = list.map(item => ({
            spuId: item.spuId,
            thumb: item.primaryImage,
            title: item.title,
            price: item.minSalePrice,
            originPrice: item.maxLinePrice,
            desc: '',
            tags: item.spuTagList ? item.spuTagList.map(tag => tag.title) : [],
            primaryImage: item.primaryImage,
            minSalePrice: item.minSalePrice,
            maxLinePrice: item.maxLinePrice,
            spuTagList: item.spuTagList || [],
          }))

          resolve({
            spuList,
            totalCount: total
          })
        } else {
          reject(new Error('获取商品列表失败'))
        }
      },
      fail: (err) => {
        console.error('获取商品列表失败:', err)
        reject(err)
      }
    })
  })
}
