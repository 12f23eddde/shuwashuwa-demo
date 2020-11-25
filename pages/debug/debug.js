// pages/debug/debug.js
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

  getToken: function(){
    // getResCode
    wx.login({
      success: res => {
        if (res.code){
          console.log('[getResCode] res.code=' + res.code);
          wx.request({
            url: 'http://10.128.188.7:2333/api/user/login',
            data:{
              'code': res.code
            },
            success: resToken =>{
              if(typeof(resToken) != undefined && resToken && resToken.data.code == 200){
                this.setData({
                  currToken:resToken.data.data.token
                })
                wx.setClipboardData({
                  data: resToken.data.data.token
                })
                app.globalData.userToken = resToken.data.data.token
                console.log('[getToken] currToken=', resToken.data.data.token)
              }
              else{
                console.log('[getToken] ErrorCode=', resToken.data.code, resToken)
              }
            },
            fail: e => {
              this.setData({
                currToken:'获取Token失败'
              })
              console.log("[getToken] 获取Token失败", e)
            }
          })
        }
      }
    })
  }
})