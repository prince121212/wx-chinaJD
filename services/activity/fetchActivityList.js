import { config } from '../../config/index';

/** 获取活动列表 */
function mockFetchActivityList(pageIndex = 1, pageSize = 20) {
  const { delay } = require('../_utils/delay');
  const { getActivityList } = require('../../model/activities');

  return delay().then(() => getActivityList(pageIndex, pageSize));
}

/** 获取活动列表 */
export function fetchActivityList(pageIndex = 1, pageSize = 20) {
  if (config.useMock) {
    return mockFetchActivityList(pageIndex, pageSize);
  }

  // 返回空的活动列表，因为我们还没有活动数据
  return new Promise((resolve) => {
    resolve([]);
  });
}
