// pages/debug/debug.js
var login = require('../../api/user').login
var parseToken = require('../../utils/util').parseToken

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currResCode: "复制res.code",
    currToken: "复制Token"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getResCode: function() {
    wx.login({
      success: res => {
        if (res.code){
          console.log('[getResCode] res.code=' + res.code);
          this.setData({
            currResCode:res.code
          })
          wx.setClipboardData({
            data: res.code
          })
        }
      }
    })
  },

  getToken: async function(){
    let resToken = await login();
    console.log(resToken)
    if (resToken) {
      this.setData({
        currToken: resToken
      })
      let resObj = parseToken(resToken)
      console.log(resObj)
      wx.setClipboardData({
        data: resToken
      })
    }
  }
})