import base64 from '../utils/base64.js';

export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
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