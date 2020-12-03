// Credit: http://github.com/LoveChenJinwen/weappVant
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 将active属性传递给van-tabbar
    active:{
      type: Number,
      value: 0
    }
  },
  data: {
    // For all icons:
    // https://youzan.github.io/vant-weapp/#/icon
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "home-o",
      text: "首页"
    }, {
      pagePath: "/pages/order/order",
      iconPath: "todo-list-o",
      text: "维修单"
    }, {
      pagePath: "/pages/activity/activity",
      iconPath: "medal-o",
      text: "活动"
    }, {
      pagePath: "/pages/user/user",
      iconPath: "user-o",
      text: "我的"
    }]
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onChange(value) {
      let url = this.data.list[value.detail].pagePath;
      wx.switchTab({ url });
    }
  },
  lifetimes: {
    
  }
})