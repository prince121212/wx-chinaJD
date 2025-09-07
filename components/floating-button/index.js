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
    fromPage: '',
    // 动画状态
    isAnimating: false,
    // 图标颜色
    iconColor: '#52c41a'
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

      // 根据当前页面设置图标颜色
      this.updateIconColor();
    }
  },

  observers: {
    'currentPage': function(currentPage) {
      this.updateIconColor();
    }
  },

  methods: {
    // 更新图标颜色
    updateIconColor() {
      const { currentPage } = this.properties;
      let iconColor = '#52c41a'; // 默认绿色

      if (currentPage === 'usercenter') {
        iconColor = '#ff4d4f'; // 个人中心页面显示红色
      }

      this.setData({ iconColor });
    },

    // 播放翻转动画
    playRotateAnimation() {
      this.setData({ isAnimating: true });

      // 动画结束后重置状态
      setTimeout(() => {
        this.setData({ isAnimating: false });
      }, 600); // 动画持续时间
    },

    onTap() {
      // 播放翻转动画
      this.playRotateAnimation();

      const { currentPage } = this.properties;
      const { fromPage } = this.data;

      // 延迟跳转，让动画播放完一部分
      setTimeout(() => {
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
      }, 200); // 延迟200ms跳转
    }
  }
});
