// import functions
var user = require('./api/user')
var util = require('./utils/util')

App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    this.onLogin()
  },

  onLogin: async function(){
    const resUserInfo = await user.getWechatUserInfo();
    if (resUserInfo) {
      this.globalData.wechatUserInfo = resUserInfo
    }

    const resToken = await user.login();
    console.log(resToken)
    if (resToken) {
      this.globalData.userToken = resToken
    }
  },

  globalData: {
    baseURL:"http://shuwashuwa.kinami.cc:8848",
    tmplID: 'DzU2gPVQgkKsknQ1dAXRjGoByDjphw252gBvltWir1Q',
    userToken: null,
    userInfo: null,
    userId: null,
    wechatUserInfo: null,
  }
})