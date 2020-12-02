// Credit: http://github.com/LoveChenJinwen/weappVant
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },
  /**
   * 组件的初始数据
   */
  data: {
    // For all icons:
    // https://youzan.github.io/vant-weapp/#/icon
    selected: 0,
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
      iconPath: "setting-o",
      text: "我的"
    }]
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onChange(value) {
      let url = this.data.list[value.detail].pagePath;
      this.setData({
        selected: value.detail
      })
      wx.switchTab({ url });
    }
  }
})