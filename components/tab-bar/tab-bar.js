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
      pagePath: "/pages/activity/activity",
      iconPath: "home-o",
      text: "主页"
    }, {
      pagePath: "/pages/service-list/service-list",
      iconPath: "todo-list-o",
      text: "维修单"
    }, {
      pagePath: "/pages/my-info/my-info",
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