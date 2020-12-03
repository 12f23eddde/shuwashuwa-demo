// pages/user/user.js
import {getUserInfo, updateUserInfo} from '../../api/user'
import Toast from '@vant/weapp/toast/toast'

Page({
  // 由于微信对双向绑定的支持非常狗屎, 因此只能把userinfo给拆了
  // 微信文档, 永远的谜语人
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

  // 加载用户信息，并放到data内
  loadUserInfo: async function(){
    let userinfo = await getUserInfo()
    // [后期可能需要更改] 直接替换this.data的全部内容
    this.setData(userinfo)
    console.log(userinfo)
  },

  // 提交更改，并重新加载用户信息
  onSubmit: async function(){
    // [后期可能需要更改] 尝试直接传this.data(可能有数据用不到?)
    await updateUserInfo(this.data)
    .catch((err)=>{
      Toast.fail('信息提交失败');
      throw err
    })
    Toast.success('信息更新成功');
    this.loadUserInfo()
  }
})