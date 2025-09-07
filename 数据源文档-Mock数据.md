# Mock 数据源文档

## 概述
本项目包含完整的 Mock 数据系统，用于开发和测试阶段模拟真实的后端数据。Mock 数据分布在 `model/` 和 `services/` 目录中，通过配置开关控制是否使用 Mock 数据。

## 配置控制

### 全局配置
位置: `config/index.js`
```javascript
export const config = {
  useMock: true,  // true: 使用Mock数据, false: 使用真实API
  apiBaseUrl: 'http://localhost:3000/api/miniprogram',
  // ...其他配置
};
```

## Mock 数据架构

### 目录结构
```
model/                    # Mock 数据模型
├── activities.js         # 活动数据
├── activity.js          # 单个活动数据
├── address.js           # 地址数据
├── cart.js              # 购物车数据
├── category.js          # 分类数据
├── comments.js          # 评论数据
├── coupon.js            # 优惠券数据
├── good.js              # 商品详情数据
├── goods.js             # 商品列表数据
├── promotion.js         # 促销数据
├── search.js            # 搜索数据
├── swiper.js            # 轮播图数据
├── usercenter.js        # 用户中心数据
├── comments/            # 评论相关
│   └── queryDetail.js   # 评论详情
└── order/               # 订单相关
    ├── applyService.js  # 售后服务
    ├── orderConfirm.js  # 订单确认
    ├── orderDetail.js   # 订单详情
    └── orderList.js     # 订单列表

services/                # 数据服务层
├── _utils/              # 工具函数
│   ├── delay.js         # 延迟模拟
│   └── timeout.js       # 超时处理
├── activity/            # 活动服务
├── address/             # 地址服务
├── cart/                # 购物车服务
├── comments/            # 评论服务
├── coupon/              # 优惠券服务
├── good/                # 商品服务
├── home/                # 首页服务
├── order/               # 订单服务
├── promotion/           # 促销服务
└── usercenter/          # 用户中心服务
```

## 核心 Mock 数据

### 1. 商品数据 (model/good.js)

#### 商品详情结构
```javascript
const goodDetail = {
  saasId: '88888888',
  storeId: '1000',
  spuId: '0',
  title: '白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙',
  primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png',
  images: [
    'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png',
    'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09b.png'
  ],
  video: {
    url: 'https://tdesign.gtimg.com/miniprogram/template/retail/video.mp4',
    poster: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png'
  },
  minSalePrice: 25900,
  maxSalePrice: 25900,
  maxLinePrice: 31900,
  spuStockQuantity: 100,
  soldNum: 1020,
  isPutOnSale: 1,
  categoryIds: [1, 2],
  spuTagList: [
    { id: '13001', title: '限时抢购', image: null }
  ],
  skuList: [
    {
      skuId: '135681624',
      thumb: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png',
      price: '25900',
      originPrice: '31900',
      stockQuantity: 50,
      specInfo: [
        { specId: '10011', specTitle: '颜色', specValue: '白色' },
        { specId: '10012', specTitle: '尺码', specValue: 'S' }
      ]
    }
  ],
  spuLimitList: [
    { text: '限购5件' }
  ],
  desc: [
    'https://tdesign.gtimg.com/miniprogram/template/retail/goods/details-1.png'
  ]
};
```

#### 商品列表数据
```javascript
// 包含约100个商品的完整列表
const allGoods = [
  // 服装类
  {
    spuId: '0',
    title: '白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙',
    primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png',
    minSalePrice: 25900,
    maxLinePrice: 31900,
    spuTagList: [{ id: '13001', title: '限时抢购', image: null }]
  },
  // 数码类
  {
    spuId: '1',
    title: '腾讯极光盒子4智能网络电视机顶盒6K千兆网络机顶盒4K高分辨率',
    primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-3a.png',
    minSalePrice: 32900,
    maxLinePrice: 39900
  },
  // ...更多商品数据
];
```

### 2. 分类数据 (model/category.js)
```javascript
const categoryList = [
  {
    groupId: '24948',
    name: '服装',
    thumbnail: 'https://tdesign.gtimg.com/miniprogram/template/retail/category/cate-1.png',
    children: [
      {
        groupId: '249481',
        name: '女装',
        thumbnail: 'https://tdesign.gtimg.com/miniprogram/template/retail/category/cate-1-1.png'
      },
      {
        groupId: '249482',
        name: '男装',
        thumbnail: 'https://tdesign.gtimg.com/miniprogram/template/retail/category/cate-1-2.png'
      }
    ]
  },
  {
    groupId: '24949',
    name: '数码',
    thumbnail: 'https://tdesign.gtimg.com/miniprogram/template/retail/category/cate-2.png',
    children: [
      {
        groupId: '249491',
        name: '手机',
        thumbnail: 'https://tdesign.gtimg.com/miniprogram/template/retail/category/cate-2-1.png'
      }
    ]
  }
];
```

### 3. 轮播图数据 (model/swiper.js)
```javascript
const swiperList = [
  {
    img: 'https://tdesign.gtimg.com/miniprogram/template/retail/swiper/banner-1.png',
    text: '1'
  },
  {
    img: 'https://tdesign.gtimg.com/miniprogram/template/retail/swiper/banner-2.png',
    text: '2'
  },
  {
    img: 'https://tdesign.gtimg.com/miniprogram/template/retail/swiper/banner-3.png',
    text: '3'
  },
  {
    img: 'https://tdesign.gtimg.com/miniprogram/template/retail/swiper/banner-4.png',
    text: '4'
  }
];
```

### 4. 购物车数据 (model/cart.js)
```javascript
const cartData = {
  isNotEmpty: true,
  storeGoods: [
    {
      storeId: '1000',
      storeName: '云Mall深圳旗舰店',
      storeStatus: 1,
      totalDiscountSalePrice: '9990',
      promotionGoodsList: [
        {
          title: '满减满折回归',
          promotionCode: 'MERCHANT',
          promotionSubCode: 'MYJ',
          promotionId: '159174555838121985',
          tagText: ['满100元减99.9元'],
          promotionStatus: 3,
          tag: '满减',
          description: '满100元减99.9元,已减99.9元',
          goodsPromotionList: [
            {
              uid: '88888888205468',
              saasId: '88888888',
              storeId: '1000',
              spuId: '12',
              skuId: '135691622',
              isSelected: 1,
              thumb: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-3a.png',
              title: '腾讯极光盒子4智能网络电视机顶盒6K千兆网络机顶盒4K高分辨率',
              specs: [
                { specId: '10011', title: '颜色', value: '黑色' },
                { specId: '10012', title: '尺码', value: '简约款' }
              ],
              price: '32900',
              originPrice: '39900',
              quantity: 1,
              stockQuantity: 99,
              limitQuantity: 0,
              isInvalid: false
            }
          ]
        }
      ],
      shortageGoodsList: []
    }
  ],
  invalidGoodItems: []
};
```

### 5. 优惠券数据 (model/coupon.js)
```javascript
const couponData = {
  key: '1',
  status: 'default',  // 'default' | 'useless' | 'disabled'
  type: 1,           // 1: 满减券, 2: 折扣券
  value: 1800,       // 优惠金额(分) 或 折扣值
  tag: '',
  desc: '满100元可用',
  base: 10000,       // 使用门槛(分)
  title: '生鲜满减券',
  timeLimit: '2019.11.18-2023.12.18',
  currency: '¥'
};
```

### 6. 用户中心数据 (model/usercenter.js)
```javascript
const userCenterData = {
  userInfo: {
    avatarUrl: 'https://we-retail-static-1300977798.cos.ap-guangzhou.myqcloud.com/retail-ui/components-exp/avatar/avatar-1.jpg',
    nickName: 'TDesign 🌟',
    phoneNumber: '13438358888',
    gender: 2
  },
  countsData: [
    { num: 2, name: '积分', type: 'point' },
    { num: 10, name: '优惠券', type: 'coupon' }
  ],
  orderTagInfos: [
    { orderNum: 1, tabType: 5 },   // 待付款
    { orderNum: 1, tabType: 10 },  // 待发货
    { orderNum: 1, tabType: 40 },  // 待收货
    { orderNum: 0, tabType: 0 }    // 待评价
  ],
  customerServiceInfo: {
    servicePhone: '4006336868',
    serviceTimeDuration: '每周三至周五 9:00-12:00  13:00-15:00'
  }
};
```

### 7. 订单数据 (model/order/)

#### 订单列表数据 (orderList.js)
```javascript
const orderList = [
  {
    orderNo: '132222623132329291',
    parentOrderNo: '132222623132329291',
    storeId: '1000',
    storeName: '云Mall深圳旗舰店',
    status: 10,  // 订单状态: 5-待付款, 10-待发货, 40-待收货, 100-已完成
    statusDesc: '待发货',
    amount: '26900',
    totalNum: 1,
    logisticsNo: '',
    goodsList: [
      {
        saasId: '88888888',
        storeId: '1000',
        spuId: '12',
        skuId: '135691622',
        thumb: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-3a.png',
        title: '腾讯极光盒子4智能网络电视机顶盒6K千兆网络机顶盒4K高分辨率',
        specs: [
          { specId: '10011', title: '颜色', value: '黑色' },
          { specId: '10012', title: '尺码', value: '简约款' }
        ],
        price: '26900',
        num: 1,
        titlePrefixTags: [{ text: '自营', type: 'primary' }]
      }
    ],
    buttons: [
      { type: 1, name: '查看详情' },
      { type: 2, name: '联系客服' }
    ],
    createTime: '2023-05-20 10:30:00'
  }
];
```

#### 订单详情数据 (orderDetail.js)
```javascript
const orderDetail = {
  orderNo: '132222623132329291',
  status: 10,
  statusDesc: '待发货',
  amount: '26900',
  freight: '0',
  discountAmount: '0',
  payAmount: '26900',
  createTime: '2023-05-20 10:30:00',
  payTime: '2023-05-20 10:35:00',
  deliveryTime: '',
  finishTime: '',
  storeInfo: {
    storeId: '1000',
    storeName: '云Mall深圳旗舰店',
    phone: '400-633-6868'
  },
  addressInfo: {
    name: '张三',
    phone: '13800138000',
    address: '广东省深圳市南山区科技园南区'
  },
  goodsList: [
    {
      saasId: '88888888',
      storeId: '1000',
      spuId: '12',
      skuId: '135691622',
      thumb: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-3a.png',
      title: '腾讯极光盒子4智能网络电视机顶盒6K千兆网络机顶盒4K高分辨率',
      specs: [
        { specId: '10011', title: '颜色', value: '黑色' },
        { specId: '10012', title: '尺码', value: '简约款' }
      ],
      price: '26900',
      num: 1,
      canApplyAfterSale: true
    }
  ],
  logisticsInfo: {
    logisticsNo: 'SF1234567890',
    logisticsCompany: '顺丰速运',
    logisticsStatus: '运输中',
    logisticsTrack: [
      {
        time: '2023-05-20 14:00:00',
        desc: '快件已发出',
        location: '深圳分拨中心'
      },
      {
        time: '2023-05-20 16:30:00',
        desc: '快件运输中',
        location: '广州转运中心'
      }
    ]
  }
};
```

### 8. 地址数据 (model/address.js)
```javascript
const addressData = {
  saasId: '88888888',
  uid: '88888888205500',
  id: '0',
  addressId: '0',
  phone: '17612345678',
  name: '幸运猫',
  countryName: '中国',
  countryCode: 'chn',
  provinceName: '甘肃省',
  provinceCode: '620000',
  cityName: '甘南藏族自治州',
  cityCode: '623000',
  districtName: '碌曲县',
  districtCode: '623026',
  detailAddress: '松日鼎盛大厦1层1号',
  isDefault: 1,
  addressTag: '',
  latitude: '34.59103',
  longitude: '102.48699',
  storeId: null
};
```

### 9. 评论数据 (model/comments.js)
```javascript
const commentsData = {
  totalCount: 47,
  data: [
    {
      spuId: '1',
      skuId: '135691625',
      commentId: '1',
      commentScore: 5,
      commentContent: '质量很好，物流很快，包装精美，值得购买！',
      commentResources: [
        {
          src: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/comment-1.png',
          type: 'image'
        }
      ],
      createTime: '2023-05-15 14:30:00',
      isAnonymous: false,
      userInfo: {
        avatarUrl: 'https://tdesign.gtimg.com/miniprogram/template/retail/avatar/avatar-1.png',
        nickName: '用户***123'
      },
      goodsInfo: {
        spuId: '1',
        thumb: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/dz-3a.png',
        title: '腾讯极光盒子4智能网络电视机顶盒',
        specInfo: [
          { specTitle: '颜色', specValue: '黑色' },
          { specTitle: '尺码', specValue: '简约款' }
        ]
      },
      reply: {
        replyContent: '感谢您的好评，我们会继续努力！',
        replyTime: '2023-05-16 09:00:00'
      }
    }
  ]
};
```

### 10. 搜索数据 (model/search.js)
```javascript
const searchData = {
  searchHistory: [
    '连衣裙',
    '手机',
    '耳机',
    '数据线',
    '充电器'
  ],
  searchPopular: [
    '热销商品',
    '新品上市',
    '限时特价',
    '品牌专区',
    '数码配件'
  ],
  searchResult: {
    spuList: [
      // 搜索结果商品列表，结构同商品列表
    ],
    totalCount: 25,
    pageSize: 20,
    pageIndex: 1
  }
};
```

### 11. 活动数据 (model/activities.js & model/activity.js)
```javascript
// 单个活动数据结构
export function getActivity(key) {
  return {
    promotionId: `${key}`,
    title: `满减满折回归${key}`,
    description: null,
    promotionCode: 'MERCHANT',
    promotionSubCode: key % 2 === 0 ? 'MYJ' : 'MYG',
    tag: '满减',
    timeType: 1,
    startTime: '1588737710000',
    endTime: '1601467070000',
    teasingStartTime: null,
    activityLadder: [{ label: '满100元减99.9元' }]
  };
}

// 活动列表数据
export function getActivityList(baseID = 0, length = 10) {
  return new Array(length).fill(0).map((_, idx) => getActivity(idx + baseID));
}
```

### 12. 促销数据 (model/promotion.js)
```javascript
export function getPromotion(baseID = 0, length = 10) {
  return {
    list: getGoodsList(baseID, length).map((item) => ({
      spuId: item.spuId,
      thumb: item.primaryImage,
      title: item.title,
      price: item.minSalePrice,
      originPrice: item.maxLinePrice,
      tags: item.spuTagList.map((tag) => ({ title: tag.title }))
    })),
    banner: 'https://tdesign.gtimg.com/miniprogram/template/retail/promotion/banner-promotion.png',
    time: 1000 * 60 * 60 * 20,
    showBannerDesc: true,
    statusTag: 'running'
  };
}
```

### 13. 商品详情评论数据 (model/detailsComments.js)
```javascript
export function getGoodsDetailsComments() {
  return {
    homePageComments: [
      {
        spuId: '1722045',
        skuId: null,
        specInfo: null,
        commentContent: '收到货了，第一时间试了一下，很漂亮特别喜欢，大爱大爱，颜色也很好看。棒棒!',
        commentScore: 4,
        uid: '88881048075',
        userName: 'Dean',
        userHeadUrl: 'https://wx.qlogo.cn/mmopen/vi_32/5mKrvn3ibyDNaDZSZics3aoKlz1cv0icqn4EruVm6gKjsK0xvZZhC2hkUkRWGxlIzOEc4600JkzKn9icOLE6zjgsxw/132'
      }
    ]
  };
}

export function getGoodsDetailsCommentsCount() {
  return {
    commentCount: '47',
    badCount: '0',
    middleCount: '2',
    goodCount: '45',
    hasImageCount: '1',
    goodRate: 95.7,
    uidCount: '0'
  };
}
```

### 14. 提交评论数据 (model/submitComment.js)
```javascript
export function getGoods() {
  return {
    goods: [
      {
        squid: '1',
        checkItems: [
          {
            name: '匿名评价',
            value: 'anonymous',
            checked: false
          }
        ],
        detail: {
          image: 'https://wx.qlogo.cn/mmopen/vi_32/51VSMNuy1CyHiaAhAjLJ00kMZVqqnCqXeZduCLXHUBr52zFHRGxwL7kGia3fHj8GSNzFcqFDInQmRGM1eWjtQgqA/132',
          title: ''
        },
        goodComment: {
          rate: 0,
          label: '123',
          images: []
        }
      }
    ],
    storeComment: {
      logisticsRate: 0,
      servicesRate: 0
    }
  };
}
```

### 15. 工具函数数据 (utils/mock.js)
```javascript
// 生成随机IP
function mockIp() {
  return `10.${getRandomNum(1, 254)}.${getRandomNum(1, 254)}.${getRandomNum(1, 254)}`;
}

// 生成随机请求ID
function mockReqId() {
  return `${getRandomNum(100000, 999999)}.${new Date().valueOf()}${getRandomNum(1000, 9999)}.${getRandomNum(10000000, 99999999)}`;
}

// 生成随机字符串
function generateMixed(n, str) {
  var res = '';
  for (var i = 0; i < n; i++) {
    var id = Math.ceil(Math.random() * 35);
    res += str[id];
  }
  return res;
}
```

### 16. 后端Mock数据 (backend/src/app/api/miniprogram/product-detail/route.ts)
```javascript
const mockProductDetail = {
  saasId: '88888888',
  storeId: '1000',
  spuId: 'SPU001',
  title: '白色短袖连衣裙荷叶边裙摆宽松韩版休闲纯白清爽优雅连衣裙',
  primaryImage: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png',
  images: [
    'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png',
    'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09b.png'
  ],
  video: null,
  available: 1,
  minSalePrice: 29800,
  minLinePrice: 29800,
  maxSalePrice: 29800,
  maxLinePrice: 40000,
  spuStockQuantity: 510,
  soldNum: 1020,
  isPutOnSale: 1,
  categoryIds: ['127880527393854975', '127880527393854976', '127880537778953984'],
  specList: [
    {
      specId: '10011',
      title: '颜色',
      specValueList: [
        {
          specValueId: '10012',
          specValue: '米色荷叶边',
          image: null
        }
      ]
    }
  ],
  skuList: [
    {
      skuId: '135681624',
      thumb: 'https://tdesign.gtimg.com/miniprogram/template/retail/goods/nz-09a.png',
      price: '29800',
      originPrice: '40000',
      stockQuantity: 255,
      specInfo: [
        { specId: '10011', specTitle: '颜色', specValue: '米色荷叶边' }
      ]
    }
  ]
};
```

## 数据服务层 (Services)

### 1. 延迟模拟 (services/_utils/delay.js)
```javascript
export function delay(time = Math.random() * 1000 + 500) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}
```

### 2. 商品服务示例 (services/good/fetchGood.js)
```javascript
import { config } from '../../config/index';

function mockFetchGood(ID = 0) {
  const { delay } = require('../_utils/delay');
  const { genGood } = require('../../model/good');
  return delay().then(() => genGood(ID));
}

export function fetchGood(ID = 0) {
  if (config.useMock) {
    return mockFetchGood(ID);
  }

  // 真实API调用
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${config.apiBaseUrl}/product-detail?id=${ID}`,
      method: 'GET',
      success: (res) => {
        if (res.data.success) {
          resolve(res.data.data);
        } else {
          reject(new Error('获取商品详情失败'));
        }
      },
      fail: reject
    });
  });
}
```

### 3. 首页服务 (services/home/home.js)
```javascript
function mockFetchHome() {
  const { delay } = require('../_utils/delay');
  const { genSwiperImageList } = require('../../model/swiper');
  return delay().then(() => {
    return {
      swiper: genSwiperImageList(),
      tabList: [
        { text: '精选推荐', key: 0 },
        { text: '夏日防晒', key: 1 },
        { text: '二胎大作战', key: 2 },
        { text: '人气榜', key: 3 },
        { text: '好评榜', key: 4 },
        { text: 'RTX 30', key: 5 },
        { text: '手机也疯狂', key: 6 }
      ],
      activityImg: `${cdnBase}/activity/banner.png`
    };
  });
}
```

## Mock 数据特性

### 1. 数据关联策略
- **ID 规律关联**: 使用数学关系维持数据关联，如 `ID % 10` 来关联相关数据
- **稳定关系**: 相同ID的数据在不同模块中保持一致的关联关系
- **可预测性**: 开发者可以根据ID预测相关数据的内容

### 2. 数据生成函数

#### 商品生成 (model/good.js)
```javascript
export function genGood(id, available = 1) {
  const specID = ['135681624', '135681628'];
  if (specID.indexOf(id) > -1) {
    return allGoods.filter((good) => good.spuId === id)[0];
  }
  const item = allGoods[id % allGoods.length];
  return {
    ...item,
    spuId: `${id}`,
    available: available,
    desc: item?.desc || defaultDesc,
    images: item?.images || [item?.primaryImage],
  };
}
```

#### 地址生成 (model/address.js)
```javascript
export function genAddress(id) {
  return {
    saasId: '88888888',
    uid: `8888888820550${id}`,
    id: `${id}`,
    addressId: `${id}`,
    phone: '17612345678',
    name: `幸运猫${id}`,
    detailAddress: `松日鼎盛大厦${id}层${id}号`,
    isDefault: `${id}` === '0' ? 1 : 0,
    addressTag: id === 0 ? '' : '公司'
  };
}

export function genAddressList(len = 10) {
  return new Array(len).fill(0).map((_, idx) => genAddress(idx));
}
```

#### 优惠券生成 (model/coupon.js)
```javascript
export function getCoupon(id = 0, status = 'default', type = (id % 2) + 1) {
  return {
    key: `${id}`,
    status,
    type,
    value: type === 2 ? 5.5 : 1800,
    tag: '',
    desc: parseInt(id) > 0 ? `满${parseInt(id) * 100}元可用` : '无门槛使用',
    base: 10000 * (parseInt(id) || 0),
    title: type === 2 ? `生鲜折扣券 - ${id}` : `生鲜满减券 - ${id}`,
    timeLimit: '2019.11.18-2023.12.18',
    currency: '¥'
  };
}
```

### 3. 服务层封装

#### 统一服务模式
```javascript
// 标准服务函数模板
export function fetchData(params) {
  if (config.useMock) {
    return mockFetchData(params);
  }

  // 真实API调用
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${config.apiBaseUrl}/endpoint`,
      method: 'GET',
      data: params,
      success: (res) => {
        if (res.data.success) {
          resolve(res.data.data);
        } else {
          reject(new Error(res.data.message || '请求失败'));
        }
      },
      fail: reject
    });
  });
}
```

#### 延迟和超时处理
```javascript
// services/_utils/delay.js
export function delay(time = Math.random() * 1000 + 500) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

// services/_utils/timeout.js
export function timeout(promise, time = 10000) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('请求超时')), time);
    })
  ]);
}
```

## 完整的Mock数据列表

### 商品相关
- **商品详情**: 100+ 个完整商品数据，包含多规格、多图片、价格、库存等
- **商品列表**: 支持分页、筛选、排序的商品列表数据
- **商品分类**: 多级分类结构，包含图标和缩略图
- **商品评论**: 用户评论、评分、图片、商家回复等
- **商品搜索**: 搜索历史、热门搜索、搜索结果

### 用户相关
- **用户信息**: 头像、昵称、手机号、性别等基本信息
- **用户地址**: 多个收货地址，包含默认地址设置
- **用户中心**: 积分、优惠券数量、订单统计等

### 订单相关
- **订单列表**: 不同状态的订单列表数据
- **订单详情**: 完整的订单信息，包含商品、地址、物流等
- **订单确认**: 结算页面所需的商品、地址、优惠券等数据
- **售后服务**: 退款、退货、换货等售后数据

### 营销相关
- **优惠券**: 满减券、折扣券、免邮券等多种类型
- **促销活动**: 限时抢购、满减活动、新人专享等
- **轮播图**: 首页轮播图数据

### 购物相关
- **购物车**: 多店铺购物车数据，包含促销信息
- **收藏夹**: 用户收藏的商品列表

## 使用指南

### 1. 开启Mock模式
```javascript
// config/index.js
export const config = {
  useMock: true,  // 设置为true启用Mock数据
  // ...
};
```

### 2. 添加新的Mock数据
```javascript
// 1. 在model/目录下创建数据模型
// model/newData.js
export function genNewData(id) {
  return {
    id,
    name: `数据${id}`,
    // ...其他字段
  };
}

// 2. 在services/目录下创建服务
// services/newData/fetch.js
function mockFetchNewData(id) {
  const { delay } = require('../_utils/delay');
  const { genNewData } = require('../../model/newData');
  return delay().then(() => genNewData(id));
}

export function fetchNewData(id) {
  if (config.useMock) {
    return mockFetchNewData(id);
  }
  // 真实API调用...
}
```

### 3. 数据一致性维护
- 使用相同的ID在不同模块中生成相关数据
- 保持数据结构与真实API一致
- 定期更新Mock数据以反映业务变化

## 注意事项

1. **数据真实性**: Mock数据应尽可能接近真实业务数据
2. **性能考虑**: 使用延迟模拟网络请求，但不要过长影响开发效率
3. **数据更新**: 定期检查和更新Mock数据，确保与最新业务需求一致
4. **错误模拟**: 可以添加错误情况的Mock数据来测试异常处理
5. **数据量**: 提供足够的数据量来测试分页、滚动加载等功能

## 迁移到真实API

当需要切换到真实API时：

1. 修改配置: `config.useMock = false`
2. 确保API接口返回的数据结构与Mock数据一致
3. 处理API可能的错误情况
4. 逐步迁移，可以部分模块使用Mock，部分使用真实API

Mock数据系统为项目提供了完整的开发和测试环境，确保在没有后端支持的情况下也能进行完整的前端开发工作。
```
```
