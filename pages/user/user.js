// pages/user/user.js
import {getUserInfo, updateUserInfo} from '../../api/user'
import Toast from '@vant/weapp/toast/toast'
import Notify from '@vant/weapp/notify/notify'
import WeValidator from 'we-validator/index'

Page({
  // 由于微信对双向绑定的支持非常狗屎, 因此只能把userinfo给拆了
  // 微信文档, 永远的谜语人
  data: {
    userName: '',
    studentId: '',
    phoneNumber: '',
    nickName: '',
    identity: '',
    grade: '',
    email: '',
    department: '',
    comment: '',
  },

  // 由于微信原生不支持表单验证，引入wevalidator
  // 虽然不好看，但是这的确是最简单的方法力
  // https://github.com/ChanceYu/we-validator
  initValidator: function(){
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
    WeValidator.onMessage = function(data){
      Notify({ type: 'danger', message: data.msg });
    }

    this.validator = new WeValidator({
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.initValidator()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loadUserInfo()
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