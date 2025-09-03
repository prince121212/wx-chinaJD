import { config } from '../../config/index';
import { mockIp, mockReqId } from '../../utils/mock';

/** 获取结算mock数据 */
function mockFetchSettleDetail(params) {
  const { delay } = require('../_utils/delay');
  const { genSettleDetail } = require('../../model/order/orderConfirm');

  return delay().then(() => genSettleDetail(params));
}

/** 提交mock订单 */
function mockDispatchCommitPay() {
  const { delay } = require('../_utils/delay');

  return delay().then(() => ({
    data: {
      isSuccess: true,
      tradeNo: '350930961469409099',
      payInfo: '{}',
      code: null,
      transactionId: 'E-200915180100299000',
      msg: null,
      interactId: '15145',
      channel: 'wechat',
      limitGoodsList: null,
    },
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 891,
    success: true,
  }));
}

/** 获取结算数据 */
export function fetchSettleDetail(params) {
  if (config.useMock) {
    return mockFetchSettleDetail(params);
  }

  // 返回空的结算数据结构
  return new Promise((resolve) => {
    resolve({
      data: {
        storeGoodsList: [],
        userAddress: null,
        invoiceInfo: null,
        couponsInfo: [],
        logisticsInfo: {
          logisticsType: 1,
          logisticsName: '快递配送',
          logisticsFee: 0,
        },
        totalGoodsAmount: 0,
        totalAmount: 0,
        totalDiscountAmount: 0,
        finalPayAmount: 0,
      }
    });
  });
}

/* 提交订单 */
export function dispatchCommitPay(params) {
  if (config.useMock) {
    return mockDispatchCommitPay(params);
  }

  return new Promise((resolve) => {
    resolve('real api');
  });
}

/** 开发票 */
export function dispatchSupplementInvoice() {
  if (config.useMock) {
    const { delay } = require('../_utils/delay');
    return delay();
  }

  return new Promise((resolve) => {
    resolve('real api');
  });
}
