// pages/activity/activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*
    为了方便比返回值多了几个数据
    毕竟现在js还没写莫得办法
    */
    List: [
      {
        activityName: "第一次活动",
        createTime: "1926-08-17 11:45:14",
        endTime: "1926-08-17 11:45:14",
        id: 0,
        location: "理教108",
        startTime: "1926-08-17 11:45:14",
        status: 0,
        statusString: "已完成",
        updatedTime: "1926-08-17 11:45:14"
      },
      {
        activityName: "第二次活动",
        createTime: "1926-08-17 11:45:14",
        endTime: "2020-12-13 17:00:00",
        id: 1,
        location: "二教525",
        startTime: "2020-12-13 13:00:00",
        status: 0,
        statusString: "未开始",
        updatedTime: "1926-08-17 11:45:14"
      }
    ]
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

  }
})