Component({
  data: {
    projLogo: '/images/shuwashuwa.png',
    title: 'shuwashuwa'
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
    }
  }
})

