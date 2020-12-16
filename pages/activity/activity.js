import {getCurrentActivities,getIncomingActivities,getActivitySlot,getSlotTime,requestWithSAToken} from '../../api/activity'
import {listServices} from '../../api/service'
import Toast from '@vant/weapp/toast/toast'
import Notify from '@vant/weapp/notify/notify'
import WeValidator from 'we-validator/index'
import { requestWithToken } from '../../api/user'
const util = require('../../utils/util')

// pages/activity/activity.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inEditService:[

    ],
    inQueueService:[

    ],
    currentActivity:[

    ],
    incomingActivity:[

    ],
  },

  loadCurrentServices: async function(){
    let app=getApp()
    let client=util.parseToken(app.globalData.userToken).userid
    let option={
      'client':client,
      'status':0,
      'closed':'false'
    }
    console.log(option)
    let inEditServiceList=await listServices(option)
    console.log("inEditServiceList:",inEditServiceList)
    option.status=3
    let inQueueServiceList=await listServices(option)
    console.log("inQueueServices:",inQueueServiceList)
    this.setData({
        inEditService:inEditServiceList,
        inQueueService:inQueueServiceList
    })
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
    this.loadCurrentServices()
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

  },

  gotoOrder(event){
    wx.switchTab({
      url: '../service-list/service-list',
    })
  },

  loadCurrentActivities: async function(){
    //await this.AddActivitiesForTest()
    var time=require('../../utils/util.js')
    let currentTime=time.formatTime(new Date())
    //Here, the second parameter is use for enable filter(to get current Acts) of not(to get all Acts)
    let currentActivityList= await getCurrentActivities(currentTime,true)
    let incomingActivityList= await getIncomingActivities(currentTime)
    console.log('CurrentActivityList:',currentActivityList)
    /*
    for (let i in currentActivityList){
      let startAndEndTime=await getSlotTime(currentActivityList[i].id,0)
      console.log(startAndEndTime.startTime)
      console.log(startAndEndTime.endTime)
    }*/
    console.log('IncomingActivityList:',incomingActivityList)
    this.setData({
      currentActivity: currentActivityList,
      incomingActivity: incomingActivityList
    })
  },

  continueEnter: async function (event) {
    console.log(event.currentTarget.dataset)
    let url = '/pages/service-detail/service-detail?id='+event.currentTarget.dataset.serviceeventid;
    wx.navigateTo({
      url: url,
    })
  },

  deleteEvent: async function (event) {
    console.log(event.currentTarget.dataset)
    let requestRes=await requestWithToken('/api/service','DELETE',event.currentTarget.dataset.serviceeventid)
    console.log(requestRes)
    this.loadCurrentServices()
  },

  AddActivitiesForTest: async function(){
    let newActData={
      "activityName": "Merry Christmas Forever",
      "endTime": "2026-08-17 11:45:14",
      "location": "301",
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
    newActData.activityName="Merry Christmas in the Future"
    newActData.startTime="2021-08-10 11:45:14"
    newActData.timeSlots[0].startTime="2021-08-10 11:45:14"
    newAct= await requestWithSAToken('POST',newActData)
    console.log(newAct)
    newActData.activityName="Merry Christmas in the past"
    newActData.startTime="1919-08-10 11:45:14"
    newActData.timeSlots[0].startTime="1919-08-10 11:45:14"
    newActData.endTime="1926-08-17 11:45:14"
    newActData.timeSlots[0].endTime="1926-08-10 11:45:14"
    newAct= await requestWithSAToken('POST',newActData)
    console.log(newAct)
  }
})