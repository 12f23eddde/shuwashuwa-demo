// pages/debug/debug.js

import {login, deleteCurrentUser, requestWithToken} from '../../api/user'
import {requestSubscription} from '../../api/service'
import {uploadWithToken, chooseImage} from '../../api/file'
import {parseToken, whoAmI} from '../../utils/util'
import Dialog from '@vant/weapp/dialog/dialog'
import Toast from '@vant/weapp/toast/toast'

const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    currResCode: "复制res.code",
    currToken: "复制Token",
    currURL: "http://shuwashuwa.kinami.cc:8848",
    currTID: "DzU2gPVQgkKsknQ1dAXRjGoByDjphw252gBvltWir1Q",
    navigateURL: "/pages/user/user",
    admin:false,
    volunteer: false,
    myRole: ''
  },

  updateRole: async function(){
    let url = '/test/auth?admin='+this.data.admin+'&volunteer='+this.data.volunteer
    console.log(url)
    let res = await requestWithToken(url, 'PUT')
    console.log(res)
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
  onShow: async function () {
    this.setData({
      currURL: app.globalData.baseURL,
      currTID: app.globalData.tmplID,
      volunteer: app.globalData.userInfo.volunteer,
      admin: app.globalData.userInfo.admin,
      myRole: await whoAmI()
    })
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
  },

  deleteUser: function(){
    console.log(this.selectComponent('.van-dialog'))
    Dialog.confirm({
      title: "注销确认",
      message:"您确定要注销当前用户吗？此操作不可逆。"
    })
    .then(()=>{  // confirmed
      deleteCurrentUser()
      .then(()=>{
        Toast.success('用户已删除')
        wx.clearStorage()
      })
      .catch((err)=>{
        Toast.fail(err.errMsg)
        throw err
      })
    })
    .catch(()=>{  // canceled
    })
  },

  onChange: function(){
    app.globalData.baseURL = this.data.currURL
    app.globalData.tmplID = this.data.currTID
  },

  clearStorage: async function(){
    await wx.clearStorage({})
    wx.reLaunch({
      url: '../index/index'
    })
  },

  requestSub: async function(){
    let tmplIDs = [app.globalData.tmplID]
    requestSubscription(tmplIDs)
  },

  uploadPic: async function(){
    let imagePaths = await chooseImage()
    let uploadRes = await uploadWithToken('/api/image', imagePaths[0])
    Toast.success(uploadRes)
  },

  gotoURL: async function(){
    wx.navigateTo({
      url: this.data.navigateURL,
    })
  }
})