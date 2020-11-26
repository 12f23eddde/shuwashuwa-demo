Component({
  data: {
    selected: 1,
    color: "#7A7E83",
    selectedColor: "#ffffff",
    picsrc: [
      "/images/icon_component_HL.png",
      "/images/icon_API.png"
    ],
    list: [{
      pagePath: "/pages/my-info/my-info",
      iconPath: '/images/icon_API.png',
      selectedIconPath: '/images/icon_API_HL.png',
      text: "功能中心"
    }, {
      pagePath: "/pages/index/index",
      iconPath: '/images/icon_component.png',
      selectedIconPath: '/images/icon_component_HL.png',
      text: "我的信息"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index,
      })
    },
    setList() {

    }
  }
})
