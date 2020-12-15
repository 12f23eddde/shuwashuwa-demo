import {getComingActivities,getActivitySlot} from '../../api/activity'
import Toast from '@vant/weapp/toast/toast'
import Notify from '@vant/weapp/notify/notify'
import WeValidator from 'we-validator/index'
// pages/activity/activity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  loadIncomingActivities: async function(){
    let incomingActivityList= await getComingActivities()
    console.log(incomingActivityList)
    for (var i in incomingActivityList){
      let activity=incomingActivityList[i]
      console.log(activity)
      let slots=await getActivitySlot(activity.id)
      console.log(slots)
      Toast(activity.id);
    } 
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
    this.loadIncomingActivities()
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