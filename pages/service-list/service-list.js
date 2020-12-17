import {listServices, cancelService, workService, getService} from '../../api/service'
import {getCurrentActivities} from '../../api/activity'
import {getUserInfo} from '../../api/user'
import Dialog from '@vant/weapp/dialog/dialog'

const app = getApp()

Page({

  /**
   * 0 待编辑 self user
   * 1 待审核 all admin
   * 2 未签到 all admin
   * 3 待接单 all volunteer
   * 4 维修中 self volunteer
   * 5 已完成 all user
   * 6 活动中 all user
   */
  data: {
    menuValue: 0,
    menuOptions: [],
    serviceList: [],

    user: false,
    admin: false,
    volunteer: false,

    activeNames: ['1'],
  },

  initMenu: function (){
    if(this.data.admin){  // 是管理员
      this.setData({
        menuOptions: [
          { text: '待编辑', value: 0 },
          { text: '待审核', value: 1 },
          { text: '未签到', value: 2 },
          { text: '待接单', value: 3 },
          { text: '维修中', value: 4 },
          { text: '已完成', value: 5 },
          { text: '活动中', value: 6 },
          { text: '所有维修单', value: 7 },
        ]
      })
    }else if(this.data.volunteer){  // 是志愿者
      this.setData({
        menuValue: 7,
        menuOptions: [
          { text: '所有维修单', value: 7 },
          { text: '待编辑', value: 0 },
          { text: '待接单', value: 3 },
          { text: '维修中', value: 4 },
          { text: '已完成', value: 5 },
          { text: '活动中', value: 6 },
        ]
      })
    }else{  // 是普通用户
      this.setData({
        menuOptions: [
          { text: '所有本人维修单', value: 7 },
          { text: '待编辑', value: 0 },
          { text: '活动中', value: 6 },
          { text: '已完成', value: 5 },
        ]
      })
    }
  },

  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },

  // 根据menuValue和用户权限把serviceList拼出来
  // 对于相同的menuValue, 用户权限不同看到的东西也是不一样的
  loadServices: async function(){
    let val = this.data.menuValue
    // 一个options就够
    if (0 <= val && val <= 5){
      let res = await this.loadServicebyVal(val)
      if (res[0].closed === false) {
        this.setData({
          serviceList: res
        })
      }
    }else if (val===6) {  // 活动中维修单需要多次请求

    }else if (val===7) {
      this.setData({
        serviceList: []
      })
      let i = 0;
      let res = []
      for (i = 0; i <=5; i++) {
        let temp = await this.loadServicebyVal(i)
        if (temp !== []) {
          let j = 0
          for (j = 0; j < temp.length; j++) {
            if(temp[j].closed === false) {
              res.push(temp[j])
            }
          }
        }
      }
      this.setData({
        serviceList: res
      })
    }
  },

  mapStatusToIcon: function(status){
    if (status == 0){
      return '/pages/service-list/rejectedOrder.png'
    }
    if (status == 1){
      return '/pages/service-list/verifyingOrder.png'
    }
    else {
      return '/pages/service-list/comfirmededOrder.png'
    }
  },

  loadServicebyVal: async function(val) {
    let option = {}
      option.status = val
      option.closed = false
      if(this.data.user) {option.client = app.globalData.userId}
      if(val === 0) {
        option.draft = true
        option.client = app.globalData.userId
      }
      else {option.draft = false}
      if(this.data.volunteer && val === 3) {option.volunteer = app.globalData.userId}
      // console.log('[loadservices] val=' + val + ' user='+ this.data.user + ' admin= ' + this.data.admin + ' volunteer=' + this.data.volunteer, option)
      let res = await listServices(option)
      let i = 0
      for (i = 0; i < res.length; i++) {
        let serviceEventId = res[i].serviceEventId
        let r_ = await getService(serviceEventId)
        let problemType = r_.serviceForms[r_.serviceForms.length - 1].problemType
        res[i].problemType = problemType
        if (res[i].status === 0) {
          res[i].iconPath = '/pages/service-list/rejectedOrder.png'
        }
        else if (res[i].status === 1) {
          res[i].iconPath = '/pages/service-list/verifyingOrder.png'
        }
        else {
          res[i].iconPath = '/pages/service-list/comfirmedOrder.png'
        }
      }
      return res
  },

  goToDetail(event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/service-detail/service-detail?id=' + id
    })
  },

  onCancel: async function(event){
    const { position, instance } = event.detail;
    console.log(position)
    console.log(instance)
    if (position === 'right') {
      await Dialog.confirm({
        title: "取消维修",
        message:"您确定要取消当前维修吗？此操作不可逆。"
      }).then(async ()=>{
        console.log(this.data.serviceEventId)
        let serviceEventId = event.currentTarget.dataset.id
        let res = await cancelService(serviceEventId)
        console.log(res)
        instance.close()
        this.loadServices()
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    if(!app.globalData.userInfo){  // 避免userInfo不存在
      await getUserInfo()
    }
    this.setData({
      user: !app.globalData.userInfo.admin && !app.globalData.userInfo.volunteer,
      volunteer: !app.globalData.userInfo.admin && app.globalData.userInfo.volunteer,
      admin: app.globalData.userInfo.admin
    })
    this.initMenu()  // 不需要网络请求，好耶
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
    this.loadServices()
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
    this.loadServices()
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

  onChangeURL: async function (event) {
    let url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: url,
    })
  }
})