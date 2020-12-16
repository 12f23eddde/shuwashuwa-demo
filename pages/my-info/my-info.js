import {getUserInfo, updateUserInfo} from '../../api/user'

const app = getApp()

Page({
  data: {
    userInfo: {},
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
      email: ''
    }
  },

  onLoad: function () {
    this.loadUserInfo()
  },

  onShow: function() {
    this.loadUserInfo()
  },
  
  // 由于微信原生不支持表单验证，引入wevalidator
  // 虽然不好看，但是这的确是最简单的方法力
  // https://github.com/ChanceYu/we-validator
  initValidator: function(){
    this.validator = new WeValidator({
      multiCheck: true,
      // onMessage可以修改验证不通过时的行为，默认为toast
      /*
      data 参数
      {
          msg, // 提示文字
          name, // 表单控件的 name
          value, // 表单控件的值
          param // rules 验证字段传递的参数
      }
      */
      onMessage: function(data){
        console.log(data)
        // Notify({ type: 'danger', message: data.msg });
  
        // Credit: @vant/weapp/toast/toast.js
        var pages = getCurrentPages();
        var page = pages[pages.length - 1];
  
        // It's F*cking Magic!!!
        // 直接修改this.data不能更改视图层, 只能用setData
        // Credit: https://www.cnblogs.com/bushui/p/11595281.html
        for (var name in data){
          var targetStr = "errMsg." + name
          page.setData({
            [targetStr]: data[name].msg
          })
        }
      },
      rules: {
        userName: {
          required: true
        },
        studentId: {
          required: true,
          length: 10
        },
        phoneNumber: {
          required: true,
          mobile: true
        },
        email: {
          email: true
        }
      },
      messages: {
        userName: {
          required: '您的姓名不能为空'
        },
        phoneNumber: {
          required: '您的手机号不能为空',
          mobile: '手机号格式不正确'
        },
        studentId: { // 非必填字段
          required: '您的学号不能为空',
          length: '请您输入正确的学号'
        },
        email: {
          email: '请输入正确的邮箱地址'
        }
      },
    })
  },

  // 加载用户信息，并放到data内
  loadUserInfo: async function(){
    let userinfo = await getUserInfo()
    // [后期可能需要更改] 直接替换this.data的全部内容
    this.setData(userinfo)
    console.log(userinfo)
  },

  // 提交更改，并重新加载用户信息
  onSubmit: async function(){
    this.clearErrMsg()
    if(!this.validator.checkData(this.data)) return
    // [后期可能需要更改] 尝试直接传this.data(可能有数据用不到?)
    await updateUserInfo(this.data)
    .catch((err)=>{
      Toast.fail('信息提交失败');
      throw err
    })
    Toast.success('信息更新成功');
    this.loadUserInfo()
  },

  onClickChange: function(event) {
    let id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/user/user'
    })
  },

  clearErrMsg: async function(){
    // Credit: https://www.cnblogs.com/bushui/p/11595281.html
    for (var name in this.data.errMsg){
      var targetStr = "errMsg." + name
      this.setData({
        [targetStr]: ''
      })
    }
  },
})
