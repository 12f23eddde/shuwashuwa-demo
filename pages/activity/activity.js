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
    currentActivity:[

    ],
    onComingActivity:[

    ],
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

  loadCurrentActivities: async function(){
    //await AddActivitiesForTest()
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
    this.setData({
      currentActivity: currentActivityList,
      onComingActivity: incomingActivityList
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
  AddActivitiesForTest: async function(){
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