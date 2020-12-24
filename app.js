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

  // 当用户登录时，获取微信用户信息，并在shuwashuwa上登录
  onLogin: async function(){
    let userInfoRes = await user.getWechatUserInfo()
    if(userInfoRes){
      this.globalData.wechatUserInfo = userInfoRes
    }
    await user.login();
  },

  globalData: {
    baseURL:"http://shuwashuwa.kinami.cc:8848",
    tmplID: 'DzU2gPVQgkKsknQ1dAXRjGoByDjphw252gBvltWir1Q',
    userToken: null,
    userInfo: null,
    userId: null,
    volunteerId: null,
    wechatUserInfo: null,
  }
})