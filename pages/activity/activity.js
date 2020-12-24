import {
  getCurrentActivities,getIncomingActivities,getActivitySlot,getSlotTime,
  requestWithSAToken, checkIn
} from '../../api/activity'
import { listServices } from '../../api/service'
import { requestWithToken } from '../../api/user'
import { whoAmI } from '../../utils/util'
import { listApplications, getMyApplication } from '../../api/application'
import Toast from '@vant/weapp/toast/toast'
import Notify from '@vant/weapp/notify/notify'
import WeValidator from 'we-validator/index'

const util = require('../../utils/util')
const app = getApp()

// pages/activity/activity.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    inEditService:[],
    inQueueService:[],
    currentActivity:[],
    incomingActivity:[],
    inAuditService: [],
    inAuditApplication: [],
    myApplicationStatus: -1,
    myApplicationMessage: '',
    admin: false,
    volunteer: false,
    pageLoading: true,
  },

  loadCurrentServices: async function(){
    let client = app.globalData.userId
    let option = {
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

  // 只有管理员能调用接口
  loadAuditableServices: async function(){
    if ((await whoAmI() !== '管理员')) return;
    let options = {
      status: 1,
      closed: false
    }
    this.setData({
      inAuditService: await listServices(options)
    })
  },

  loadMyApplication: async function(){
    await whoAmI()
    if (app.globalData.userInfo.volunteer){  // 已经是志愿者了,爬
      return -1;
    }
    let lastApplication = await getMyApplication()
    console.log(lastApplication)
    // isIterable Credit:https://stackoverflow.com/questions/18884249/checking-whether-something-is-iterable
    if(typeof(auth_subscribe.itemSettings[Symbol.iterator]) !== 'function') return -1;
    this.setData({
      myApplicationStatus: lastApplication.slice(-1).status,
      myApplicationMessage: lastApplication.slice(-1).replyByAdmin
    })
    return lastApplication.status
  },

  // 只有管理员能调用此函数
  loadAuditableApplications: async function(){
    if ((await whoAmI() !== '管理员')) return;
    let options = {
      status: 0
    }
    this.setData({
      inAuditApplication: await listApplications(options)
    })
    console.log(this.data.inAuditApplication)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await whoAmI()  // 需要先获得Token
    if (typeof(options.activity) != "undefined" && options.activity != "undefined"){  // 加载维修单, 默认不开启编辑
      let res = await checkIn(options.activity)
      .catch((res)=>{
        Toast.fail('签到失败')
        console.log(res)
        throw res
      })
      Toast.success('签到成功')
      console.log(res)
    }
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
    await whoAmI() // 这里先执行一次whoAmI(), 保证login()先执行完成
    // 我们考虑到在login()之前就执行onShow(), userID还不存在, 显然不合理
    this.setData({
      admin: app.globalData.userInfo.admin,
      volunteer: app.globalData.userInfo.volunteer
    })
    // 以下并发执行
    this.loadCurrentServices()
    this.loadAuditableServices()
    this.loadCurrentActivities()
    this.loadAuditableApplications()
    this.loadMyApplicationStatus()
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

  gotoApplicationList(event){
    wx.navigateTo({
      url: '/pages/application-list/application-list',
    })
  },

  loadCurrentActivities: async function(){
    this.setData({pageLoading: true})
    //await this.AddActivitiesForTest()
    var time=require('../../utils/util.js')
    let currentTime=time.formatTime(new Date())
    let currentActivityList= await getCurrentActivities(currentTime)
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
      pageLoading: false,
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
    let newAct= await requestWithSAToken('/api/super/activity','POST',newActData)
    console.log(newAct)
    newActData.activityName="Merry Christmas in the Future"
    newActData.startTime="2021-08-10 11:45:14"
    newActData.timeSlots[0].startTime="2021-08-10 11:45:14"
    newAct= await requestWithSAToken('/api/super/activity','POST',newActData)
    console.log(newAct)
    newActData.activityName="Merry Christmas in the past"
    newActData.startTime="1919-08-10 11:45:14"
    newActData.timeSlots[0].startTime="1919-08-10 11:45:14"
    newActData.endTime="1926-08-17 11:45:14"
    newActData.timeSlots[0].endTime="1926-08-10 11:45:14"
    newAct= await requestWithSAToken('/api/super/activity','POST',newActData)
    console.log(newAct)
  },

  auditApplication: function(){
    wx.navigateTo({
      url: '../application-list/application-list',
    })
  }
})