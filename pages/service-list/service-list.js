import {listServices, cancelService, workService, getService} from '../../api/service'
import {getCurrentActivities} from '../../api/activity'
import {getUserInfo} from '../../api/user'
import {checkUserInfo, whoAmI} from '../../utils/util'
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
    userName: '',

    activeNames: ['1'],
    pageLoading: false,

    addIconSrc: '/res/icons/addOrder.png',
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
          { text: '我的维修单', value: 7 },
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

  // 左滑删除
  onClose(event) { 
    const { position, instance } = event.detail;
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          title: "取消维修",
          message:"您确定要取消当前维修吗？此操作不可逆。"
        }).then(async ()=>{
          // console.log(res)
          let serviceEventId = event.currentTarget.dataset.id
          let res = await cancelService(serviceEventId)
          instance.close()
          this.loadServices()
        })
        break;
    }
  },

  // 根据menuValue和用户权限把serviceList拼出来
  // 对于相同的menuValue, 用户权限不同看到的东西也是不一样的
  loadServices: async function(){
    this.setData({
      serviceList: [],
      pageLoading: true
    })

    let val = this.data.menuValue
    let res = []
    // 一个options就够
    if (0 <= val && val <= 5){
      res = await this.loadServicebyVal(val)
      this.setData({
        serviceList: res
      })
    }else if (val===6) {  // 活动中维修单需要多次请求
      let i = 0;
      for (i = 2; i <= 4; i++) {
        let temp = await this.loadServicebyVal(i)
        res.push(...temp)  // Nice ES6
      }
    }else if (val===7) {
      let i = 0;
      for (i = 0; i <= 5; i++) {
        let temp = await this.loadServicebyVal(i)
        res.push(...temp)  // Nice ES6
      }
    }
    this.setData({
      serviceList: res,
      pageLoading: false
    })
  },

  mapStatusToIcon: function(status){
    if (status == 0){
      return '/pages/service-list/rejectedOrder.png'
    }
    if (status == 1){
      return '/pages/service-list/verifyingOrder.png'
    }
    else {
      return '/pages/service-list/comfirmedOrder.png'
    }
  },

  loadServicebyVal: async function(val) {
    let option = {}
      option.status = val
      option.closed = 'false'
      if(this.data.user) {option.client = app.globalData.userId}
      if(val === 0) {
        option.draft = 'true'
        option.client = app.globalData.userId
      }
      else {option.draft = 'false'}
      // 只是志愿者不是管理员，不能看到别人的维修单
      if((this.data.volunteer && !this.data.admin) && (val === 4 || val == 5)) {
        option.volunteer = app.globalData.volunteerId
      }
      console.log('[loadservices] val=' + val + ' user='+ this.data.user + ' admin= ' + this.data.admin + ' volunteer=' + this.data.volunteer, option)
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

  goToDetail: async function(event) {
    this.setData({
      addIconSrc: '/res/icons/addOrderTouched.png'
    })
    wx.vibrateShort({
      type: 'medium',
      success: (res) => {},
    })
    if(!await checkUserInfo()) return;
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/service-detail/service-detail?id=' + id
    })
    this.setData({
      addIconSrc: '/res/icons/addOrder.png'
    })
  },

  onCancel: async function(event){
    const { position, instance } = event.detail;
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
      })
      this.loadServices()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

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
    if(!app.globalData.userInfo){  // 避免userInfo不存在
      await getUserInfo()
    }
    this.setData({  // 注意,这里的定义修改了
      addIconSrc: '/res/icons/addOrder.png',
      user: !app.globalData.userInfo.admin && !app.globalData.userInfo.volunteer,
      volunteer: app.globalData.userInfo.volunteer,
      admin: app.globalData.userInfo.admin
    })
    this.initMenu()  // 不需要网络请求，好耶
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