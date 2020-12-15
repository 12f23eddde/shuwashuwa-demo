import {getCurrentActivities,getIncomingActivities,getActivitySlot,getSlotTime,requestWithSAToken} from '../../api/activity'
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

  loadCurrentActivities: async function(){
    /*
    //测试用:添加事件
    let newActData={
      "activityName": "Merry Christmas Forever",
      "endTime": "2026-08-17 11:45:14",
      "location": "string",
      "startTime": "1919-08-10 11:45:14",
      "timeSlots": [
        {
          "endTime": "2026-08-17 11:45:14",
          "startTime": "1919-08-10 11:45:14",
          "timeSlot": 0
        }
      ]
    }
    let newAct= await requestWithSAToken('POST',newActData)
    console.log(newAct)
    */
    var time=require('../../utils/util.js')
    let currentTime=time.formatTime(new Date())
    //Here, the second parameter is use for enable filter(to get current Acts) of not(to get all Acts)
    let currentActivityList= await getCurrentActivities(currentTime,true)
    let incomingActivityList= await getIncomingActivities(currentTime)
    console.log('CurrentActivityList:',currentActivityList)
    for (let i in currentActivityList){
      //let TimeSlot= await getActivitySlot(currentActivityList[i].id)
      //console.log('Time slot of activity id ',currentActivityList[i].id,':',TimeSlot)
      let startAndEndTime=await getSlotTime(currentActivityList[i].id,0)
      console.log(startAndEndTime.slice(0,19))
      console.log(startAndEndTime.slice(19))
    }
    console.log('IncomingActivityList:',incomingActivityList)
    for (let i in incomingActivityList){
      let TimeSlot= await getActivitySlot(incomingActivityList[i].id)
      console.log('Time slot of activity id ',incomingActivityList[i].id,':',TimeSlot)
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
    this.loadCurrentActivities()
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