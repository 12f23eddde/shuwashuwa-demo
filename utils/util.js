import base64 from '../utils/base64.js';
import { getUserInfo } from '../api/user.js';
import Dialog from '@vant/weapp/dialog/dialog'

export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  // Mind this have been edited ———— as all our dates in api connected with '-'
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// eval() is disabled by tencent... wtf
export const parseToken = (token) => {
  token = String(token);
  var splitString = token.split('.')[1]
  var encodedString = base64.decode(splitString)
  return JSON.parse(encodedString)
}

export const getContext = function() {
  var pages = getCurrentPages();
  return pages[pages.length - 1];
}

export const addErrorToField = (context, elementId, errMsg) => {
  var toast = context.selectComponent(options.selector);
  if (!toast) {
    console.warn('未找到 van-toast 节点，请确认 selector 及 context 是否正确');
    return;
  }
}

// Credit: @vant/weapp/toast/toast.js
export const getCurrentPage = () => {
  var pages = getCurrentPages();
  return pages[pages.length - 1];
}

// 用户身份（为了方便调试，直接用中文力）
// ['普通用户','管理员','志愿者']
// whoAmI能保证login()一定执行完毕，且在大多数情况下不会login()两次
export const whoAmI = async function(){
  const app = getApp()
  if(!app.globalData.userInfo){
    await getUserInfo()
  }
  if(!app.globalData.userInfo.admin && !app.globalData.userInfo.volunteer){
    return '普通用户'
  }else if(!app.globalData.userInfo.admin && app.globalData.userInfo.volunteer){
    return '志愿者'
  }else if(app.globalData.userInfo.admin){
    return '管理员'
  }else return ''
}

// 检查用户信息是否填写 注意Dialog in wxml
export const checkUserInfo = async function(){
  const app = getApp()
  if(!app.globalData.userInfo){
    await getUserInfo()
  }
  if(!app.globalData.userInfo.userName){
    await Dialog.alert({
      message: '请您先填写个人信息',
    }).then(() => {
      wx.switchTab({url: '/pages/my-info/my-info'})
    });
    return false;
  }
  return true;
}