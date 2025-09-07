Component({
  properties: {
    // 当前页面类型，用于判断跳转逻辑
    currentPage: {
      type: String,
      value: 'home' // home, shop, usercenter
    }
  },

  data: {
    // 记录来源页面
    fromPage: ''
  },

  lifetimes: {
    attached() {
      // 从全局数据或页面栈获取来源页面信息
      const pages = getCurrentPages();
      if (pages.length > 1) {
        const prevPage = pages[pages.length - 2];
        const route = prevPage.route;
        if (route.includes('home')) {
          this.setData({ fromPage: 'home' });
        } else if (route.includes('shop')) {
          this.setData({ fromPage: 'shop' });
        }
      }
    }
  },

  methods: {
    onTap() {
      const { currentPage } = this.properties;
      const { fromPage } = this.data;

      switch (currentPage) {
        case 'home':
          // 从首页跳转到个人中心
          wx.switchTab({ url: '/pages/usercenter/index' });
          // 记录来源页面
          wx.setStorageSync('fromPage', 'home');
          break;
        
        case 'shop':
          // 从商店页跳转到个人中心
          wx.switchTab({ url: '/pages/usercenter/index' });
          // 记录来源页面
          wx.setStorageSync('fromPage', 'shop');
          break;
        
        case 'usercenter':
          // 从个人中心根据来源页面跳转
          const sourceFromStorage = wx.getStorageSync('fromPage') || 'home';
          if (sourceFromStorage === 'shop') {
            wx.switchTab({ url: '/pages/shop/index' });
          } else {
            wx.switchTab({ url: '/pages/home/home' });
          }
          break;
        
        default:
          wx.switchTab({ url: '/pages/usercenter/index' });
          break;
      }
    }
  }
});
