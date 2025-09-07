import { fetchHome } from '../../services/home/home';
import { fetchGoodsList } from '../../services/good/fetchGoods';
import { fetchUserCenter } from '../../services/usercenter/fetchUsercenter';
import Toast from 'tdesign-miniprogram/toast/index';

Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '我的店铺',
    },
    tabList: [],
    goodsList: [],
    goodsListLoadStatus: 0,
    pageLoading: false,
  },

  goodListPagination: {
    index: 0,
    num: 20,
  },

  privateData: {
    tabIndex: 0,
  },

  onShow() {
    this.getTabBar().init();
    this.init();
  },

  onLoad() {
    this.init();
  },

  onReachBottom() {
    if (this.data.goodsListLoadStatus === 0) {
      this.loadGoodsList();
    }
  },

  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.loadUserInfo();
    this.loadHomePage();
  },

  // 加载用户信息
  loadUserInfo() {
    fetchUserCenter().then(({ userInfo }) => {
      this.setData({
        userInfo: userInfo || { avatarUrl: '', nickName: '我的店铺' },
      });
    }).catch(() => {
      // 如果获取失败，使用默认值
      this.setData({
        userInfo: { avatarUrl: '', nickName: '我的店铺' },
      });
    });
  },

  // 加载首页数据（复用首页逻辑）
  loadHomePage() {
    this.setData({ pageLoading: true });
    fetchHome()
      .then(({ tabList }) => {
        this.setData({
          tabList,
          pageLoading: false,
        });
        this.loadGoodsList(true);
      })
      .catch((err) => {
        console.error('获取首页数据失败:', err);
        this.setData({ pageLoading: false });
      });
  },

  // 加载商品列表
  loadGoodsList(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    }

    this.setData({ goodsListLoadStatus: 1 });

    const pageSize = this.goodListPagination.num;
    let pageIndex = this.privateData.tabIndex * pageSize + this.goodListPagination.index + 1;
    if (fresh) {
      pageIndex = 0;
    }

    return fetchGoodsList(pageIndex, pageSize)
      .then((res) => {
        this.setData({
          goodsList: fresh ? res.spuList : this.data.goodsList.concat(res.spuList),
          goodsListLoadStatus: res.spuList.length > 0 ? 0 : 2,
        });

        this.goodListPagination.index = pageIndex;
        this.goodListPagination.status = res.spuList.length < pageSize ? 'nomore' : '';

        return this.setData({ goodsListLoadStatus: 0 });
      })
      .catch((err) => {
        this.setData({ goodsListLoadStatus: 3 });
        return Promise.reject(err);
      })
      .finally(() => {
        wx.stopPullDownRefresh && wx.stopPullDownRefresh();
      });
  },

  // Tab切换处理
  tabChangeHandle(e) {
    this.privateData.tabIndex = e.detail.value;
    this.loadGoodsList(true);
  },

  // 商品点击处理
  goodListClickHandle(e) {
    const { index } = e.detail;
    const { spuId } = this.data.goodsList[index];
    wx.navigateTo({
      url: `/pages/goods/details/index?spuId=${spuId}`,
    });
  },

  // 加入购物车处理
  goodListAddCartHandle() {
    Toast({
      context: this,
      selector: '#t-toast',
      message: '加入购物车成功',
      icon: 'check-circle',
    });
  },

  // 重试加载
  onReTry() {
    this.loadGoodsList();
  },
});
