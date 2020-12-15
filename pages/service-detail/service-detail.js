import {createService, getService} from '../../api/service'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let new_service = null;
    console.log(options)
    // id 为空，在新建维修单
    // 微信这options也太神秘了
    if (options.id != "undefined"){
      new_service = await getService(options.id)
    } else {
      new_service = await createService()
    }
    this.setData({
      service: new_service
    })
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

  }
})