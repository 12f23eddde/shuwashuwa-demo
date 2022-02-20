// import stores
import { userStore } from './stores/user'
import { globalStore } from './stores/global'

import { login } from './api_new/login'
import { getCurrentUserInfo } from './api_new/user'

App({
  onLaunch: function () {
    // 存储log
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    login() // 登录
    .then(() => {
      getCurrentUserInfo() // 获取用户信息
    })
  },

  globalData: {
    baseURL: "http://shuwashuwa.kinami.cc:8848",
    tmplID: 'DzU2gPVQgkKsknQ1dAXRjGoByDjphw252gBvltWir1Q',
    userToken: null,
    userInfo: null,
    userId: null,
    volunteerId: null,
    wechatUserInfo: null,
    userStore: userStore,
    globalStore: globalStore
  }
})
