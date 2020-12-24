import {getUserInfo, updateUserInfo} from '../../api/user'
import {uploadImage} from '../../api/file'
import {postApplication, getMyApplication} from '../../api/application'
import {whoAmI, checkUserInfo} from '../../utils/util'

import Notify from '@vant/weapp/notify/notify'
import WeValidator from 'we-validator/index'

const app = getApp()

Page({
  data: {
    myRole: '',

    applicationShow: false,
    reasonForApplication: '',
    cardPicLocation: '',
    imagesToUpload: [],
    admin: false,
    volunteer: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userName: '',
    studentId: '',
    phoneNumber: '',
    nickName: '',
    identity: '',
    grade: '',
    email: '',
    department: '',
    comment: '',
    errMsg: {
      userName: '',
      studentId: '',
      phoneNumber: '',
      email: '',
      reasonForApplication: '',
      cardPicLocation: '',
    },

    disableEdit: true,
    submitLoading: false
  },

  initValidator: function(){
    this.validator = new WeValidator({
      multiCheck: true,
      onMessage: function(data){
        let page = getCurrentPages().slice(-1)[0]
        for (let name in data){
          let targetStr = "errMsg." + name
          page.setData({
            [targetStr]: data[name].msg
          })
        }
      },
      rules: {
        userName: {required: true},
        studentId: {required: true, length: 10},
        phoneNumber: { required: true, mobile: true},
        email: { email: true }
      },
      messages: {
        userName: { required: '您的姓名不能为空'},
        phoneNumber: { required: '您的手机号不能为空', mobile: '手机号格式不正确'},
        studentId: { required: '您的学号不能为空', length: '请您输入正确的学号'},
        email: { email: '请输入正确的邮箱地址'}
      },
    })
    this.validator2 = new WeValidator({
      multiCheck: true,
      onMessage: function(data){
        let page = getCurrentPages().slice(-1)[0]
        for (let name in data){
          let targetStr = "errMsg." + name
          page.setData({
            [targetStr]: data[name].msg
          })
        }
      },
      rules: {
        cardPicLocation: {required: true},
        reasonForApplication: {required: true},
      },
      messages: {
        cardPicLocation: {required: 'color:red;'},
        reasonForApplication: {required: '请填写申请理由'},
      },
    })
  },

  onLoad: function () {
    this.initValidator()
  },

  onShow: function() {
    this.loadUserInfo()
  },

  // 加载用户信息，并放到data内
  loadUserInfo: async function(){
    let userinfo = await getUserInfo()
    this.setData({
      myRole: await whoAmI()
    })
    console.log(this.data.myRole)
    // [后期可能需要更改] 直接替换this.data的全部内容
    this.setData(userinfo)
  },

  onClickChange: async function(event) {
    this.clearErrMsg()
    // 编辑
    if(this.data.disableEdit){
      this.setData({ disableEdit: false })
      return
    }
    // 提交
    if(!this.validator.checkData(this.data)) return;
    this.setData({ submitLoading: true })
    await updateUserInfo(this.data)
    .catch((err)=>{
      this.setData({
        submitLoading: false
      })
      Notify({type:'danger', message: '用户信息上传失败'})
      throw err
    })
    this.setData({
      submitLoading: false,
      disableEdit: true,
    })
    this.loadUserInfo()
    Notify({type:'success', message: '用户信息更新成功'})
  },

  loadMyApplication: async function(){
    await whoAmI()
    if (app.globalData.userInfo.volunteer){  // 已经是志愿者了,爬
      return 1;
    }
    let myApplication = await getMyApplication()
    console.log('[myApplication]', myApplication)
    if(!myApplication || myApplication.length == 0) return -1;
    this.setData({
      myApplicationStatus: myApplication.slice(-1)[0].status,
      myApplicationMessage: myApplication.slice(-1)[0].replyByAdmin
    })
    return myApplication.slice(-1)[0].status
  },
  applicationClick: async function(){
    if (!await checkUserInfo()) return;
    let applicationStatus = await this.loadMyApplication()
    if (applicationStatus == 0 || this.data.volunteer){
      Notify({type: 'success', message: '您有正在审核的申请或您已经是志愿者'})
      return
    }
    this.clearErrMsg()
    this.setData({ applicationShow: true })
  },
  applicationClose: async function(){
    this.setData({ applicationShow: false })
  },
  applicationSubmit: async function(){
    this.clearErrMsg()
    if(!this.validator2.checkData(this.data)) return;
    this.setData({ submitLoading: true })
    await postApplication({
      "cardPicLocation": this.data.cardPicLocation,
      "reasonForApplication": this.data.reasonForApplication
    })
    .catch((err)=>{
      this.setData({ applicationShow: false, submitLoading: false})
      Notify({type:'danger', message: '申请上传失败'})
      throw err
    })
    Notify({type:'success', message: '申请上传成功'})
    // 上传完毕后清空信息
    this.setData({ 
      applicationShow: false, 
      submitLoading: false,
      cardPicLocation:'',
      reasonForApplication:''
    })
  },
  uploadConfirm: async function(event){
    console.log(event.detail)
    let image = event.detail.file
    let res = await uploadImage(image.url)
    // 更新imagesToUpload
    const { imagesToUpload = [] } = this.data;
    imagesToUpload.push({ ...image, url: app.globalData.baseURL + '/img/' + res});
    this.setData({ imagesToUpload });
    console.log(imagesToUpload)
    // 更新imageList
    this.setData({cardPicLocation: res});
  },
  uploadCancel: async function(event){
    let imageToDelete = event.detail.index
    const { imagesToUpload = [] } = this.data;
    imagesToUpload.splice(imageToDelete, 1)
    this.setData({ imagesToUpload });
    // 更新imageList
    this.setData({cardPicLocation: ''});
  },
  applicationAudit: async function(){
    wx.navigateTo({ url: '/pages/application-list/application-list' })
  },

  clearErrMsg: async function(){
    // Credit: https://www.cnblogs.com/bushui/p/11595281.html
    for (var name in this.data.errMsg){
      var targetStr = "errMsg." + name
      this.setData({
        [targetStr]: ''
      })
    }
  }
})
