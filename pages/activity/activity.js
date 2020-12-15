import {getCurrentActivities,getActivitySlot,requestWithSAToken} from '../../api/activity'
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
    /*
    //测试用:添加事件
    var newActData={
      "activityName": "string",
      "endTime": "1926-08-17 11:45:14",
      "location": "string",
      "startTime": "1919-08-10 11:45:14",
      "timeSlots": [
        {
          "endTime": "1926-08-17 11:45:14",
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
    let currentActivityList= await getCurrentActivities(currentTime,false)
    console.log('CurrentActivityList:',currentActivityList)
    for (var i in currentActivityList){
      let TimeSlot= await getActivitySlot(currentActivityList[i].id)
      console.log('Time slot of activity id ',currentActivityList[i].id,':',TimeSlot)
    }
    this.setData({
      currentActivity: currentActivityList
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

  }
})