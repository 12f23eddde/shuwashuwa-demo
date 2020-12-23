import { requestWithToken } from '../../api/user'
import { whoAmI } from '../../utils/util'
// pages/application-list/application-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    application:[

    ],
    activeNames: ['1'],
    pageLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
    this.setData({pageLoading: true})
    let data={"status":0}
    let applicationList=await requestWithToken('/api/volunteer/application','GET',data)
    console.log(applicationList)
    for(var i in applicationList){
      applicationList[i].imageURL = 'http://shuwashuwa.kinami.cc:8848/img/'+applicationList[i].cardPicLocation;
    }
    console.log(applicationList)
    this.setData({
      pageLoading: false,
      application:applicationList
    })
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
    console.log("mow in application list")
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

  // vant的collapse要用到
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
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
  replyApplication: async function(event){
    let applicationId = event.currentTarget.dataset.id
    let status=event.currentTarget.dataset.status
    console.log(applicationId,status)
    let form
    for(let i of this.data.application){
      if (i.formId==applicationId)
      {
        form=i
      }
    }
    form.department=form.department?form.department:""
    form.phoneNumber=form.phoneNumber?form.phoneNumber:""
    form.identity=form.identity?form.identity:""
    form.email=form.email?form.email:""
    form.status=status-'0'
    //回头再加留言功能  
    form.replyByAdmin=""
    console.log(form)
    await requestWithToken('/api/volunteer/application', 'PUT',form)
    let data={"status":0}
    let applicationList=await requestWithToken('/api/volunteer/application','GET',data)
    for(var json in applicationList){
      json["imageURL"] = "http://shuwashuwa.kinami.cc:8848/img/"+json[cardPicLocation]
    }
    this.setData({
      application:applicationList
    })
  },
  viewPic: async function(event){
    console.log(event.currentTarget.dataset)
    wx.previewImage({
      current: 'http://shuwashuwa.kinami.cc:8848/img/'+event.currentTarget.dataset.picurl, // 当前显示图片的http链接
      urls: ['http://shuwashuwa.kinami.cc:8848/img/'+event.currentTarget.dataset.picurl] // 需要预览的图片http链接列表
    })
  }
})