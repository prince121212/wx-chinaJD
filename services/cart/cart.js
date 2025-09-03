import { config } from '../../config/index';

/** 获取购物车mock数据 */
function mockFetchCartGroupData(params) {
  const { delay } = require('../_utils/delay');
  const { genCartGroupData } = require('../../model/cart');

  return delay().then(() => genCartGroupData(params));
}

/** 获取购物车数据 */
export function fetchCartGroupData(params) {
  if (config.useMock) {
    return mockFetchCartGroupData(params);
  }

  // 调用真实API
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${config.apiBaseUrl}/cart`,
      method: 'GET',
      header: {
        'authorization': 'user_test123' // 临时用户token
      },
      success: (res) => {
        if (res.data.success) {
          // 转换为mock数据格式
          const cartItems = res.data.data
          if (!cartItems || cartItems.length === 0) {
            resolve({
              data: {
                isNotEmpty: false,
                storeGoods: []
              }
            })
            return
          }

          // 简化的购物车数据格式
          const storeGoods = [{
            storeId: '1000',
            storeName: '云Mall深圳旗舰店',
            storeStatus: 1,
            totalDiscountSalePrice: '0',
            promotionGoodsList: [{
              title: '普通商品',
              promotionCode: 'NORMAL',
              promotionSubCode: 'NORMAL',
              promotionId: '0',
              tagText: [],
              promotionStatus: 1,
              tag: '',
              description: '',
              doorSillRemain: null,
              isNeedAddOnShop: 0,
              goodsPromotionList: cartItems.map(item => ({
                uid: `88888888${item.id}`,
                saasId: '88888888',
                storeId: '1000',
                spuId: item.sku.product.spuId,
                skuId: item.sku.skuId,
                isSelected: item.selected ? 1 : 0,
                thumb: item.sku.product.primaryImage,
                title: item.sku.product.title,
                primaryImage: item.sku.product.primaryImage,
                quantity: item.quantity,
                stockStatus: item.sku.stockQuantity > 0,
                stockQuantity: item.sku.stockQuantity,
                price: item.sku.price.toString(),
                originPrice: item.sku.originPrice.toString(),
                tagPrice: null,
                titlePrefixTags: [],
                roomId: null,
                specInfo: item.sku.specInfo ? JSON.parse(item.sku.specInfo) : [],
              }))
            }],
            shortageGoodsList: []
          }]

          resolve({
            data: {
              isNotEmpty: true,
              storeGoods
            }
          })
        } else {
          reject(new Error('获取购物车失败'));
        }
      },
      fail: (err) => {
        console.error('获取购物车失败:', err);
        // 如果API调用失败，返回空购物车
        resolve({
          data: {
            isNotEmpty: false,
            storeGoods: []
          }
        })
      }
    });
  });
}
