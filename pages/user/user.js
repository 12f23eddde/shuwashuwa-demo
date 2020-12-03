// pages/user/user.js
import {getUserInfo, updateUserInfo} from '../../api/user'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    studentId: '',
    phoneNumber: '',
    nickName: '',
    identity: '',
    grade: '',
    email: '',
    department: '',
    comment: ''
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
    this.loadUserInfo()
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

  loadUserInfo: async function(){
    let userinfo = await getUserInfo()
    this.setData({
      currUserInfo: userinfo
    })
    console.log(userinfo)
  },

  onSubmit: async function(){
    await updateUserInfo({
      "comment": "string",
      "department": "string",
      "email": "string",
      "grade": "string",
      "identity": "string",
      "nickName": "string",
      "phoneNumber": "string",
      "studentId": "string",
      "userName": "string"
    })
    .then(
      wx.showToast({
        title: '用户信息更新成功',
        icon: 'none'
      })
    )
    .catch((err)=>{
      wx.showToast({
        title: '用户信息提交失败',
        icon: 'none'
      })
      throw(err)
    })
  }
})