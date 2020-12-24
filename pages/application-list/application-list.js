import { requestWithToken } from '../../api/user'
import { whoAmI } from '../../utils/util'
import Dialog from '@vant/weapp/dialog/dialog'
// pages/application-list/application-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    application:[

    ],
    activeNames: ['1'],
    adminFeedBack: '',
    pageLoading: false,
    feedBackShow: false,
    appDataSet:{
      id: null,
      status: "",
      url: ""
    }
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

  //确认通过，没有什么特殊的操作，只是把event作为参数传过去
  onConfirm: function(event){
    Dialog.confirm({
      title: '确认页面',
      message: "确定要通过志愿者申请吗？",
    })
      .then(() => {
        this.replyApplication(event)
      })
      .catch(() => {
        // on cancel
      });
  },

  /*
  与onConfirm不同，onReject对应的是popup里面的那个按钮，所以event和onCorfirm的event有很大不同
  也不能直接用wxfor的item的数据
  因此虽然代码和onconfirm相似但是逻辑其实不一样
  从这里调replyApplication的话，event的dataset是空的，因此三目运算符会选择data里的数据作为参数
  数据是popup弹出时设置的
  */
  onReject: function(event){
    Dialog.confirm({
      title: '确认页面',
      message: "确定要拒绝志愿者申请吗？",
    })
      .then(() => {
        this.replyApplication(event)
      })
      .catch(() => {
        // on cancel
      });
  },

  /*
  以下两个函数都是弹出窗口用到的
  有一个field可以输入反馈信息
  弹出时设置全局变量，关闭弹窗时再把全局变量清空
  保证appDataSet的有效声明周期与弹窗相同
  否则反馈信息可能会附加到其他的申请单上
   */
  onFeedBack: function(event){
    console.log(event.currentTarget.dataset)
    this.setData({
      feedBackShow: true,
      appDataSet: event.currentTarget.dataset
    });
  },

  feedBackClose: function(){
    let over_write = {
      id: null,
      status: "",
      url: ""
    }
    this.setData({
      feedBackShow: false,
      appDataSet: over_write
    });
  },

  //这个是vant的collapse展开需要的函数
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  
  //大部分是pjy写的，改了一点不知道有没有bug
  replyApplication: async function(event){
    let applicationId = event.currentTarget.dataset.id? event.currentTarget.dataset.id : this.data.appDataSet.id;
    let status = event.currentTarget.dataset.status? event.currentTarget.dataset.status : this.data.appDataSet.status;
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
    form.userName=form.userName?form.userName:"";
    //留言可能能用了
    form.replyByAdmin=this.data.adminFeedBack
    console.log(form)
    await requestWithToken('/api/volunteer/application', 'PUT',form)
    console.log("delete")
    let data={"status":0}
    let applicationList=await requestWithToken('/api/volunteer/application','GET',data)
    console.log(applicationList)
    let over_write = {
      id: null,
      status: "",
      url: ""
    }
    this.setData({
      application:applicationList,
      appDataSet: over_write
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