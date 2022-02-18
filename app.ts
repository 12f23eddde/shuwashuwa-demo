// import stores
require('./stores/index')

import { login } from './api_new/login'

App({
  onLaunch: function () {
    // 存储log
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
   
    // 登录
    login()
  },

  globalData: {
    baseURL: "http://shuwashuwa.kinami.cc:8848",
    tmplID: 'DzU2gPVQgkKsknQ1dAXRjGoByDjphw252gBvltWir1Q',
    userToken: null,
    userInfo: null,
    userId: null,
    volunteerId: null,
    wechatUserInfo: null,
  }
})
