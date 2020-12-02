const util = require('../utils/util')
import {wxp} from '../utils/wxp';

// 登录
const login = async function(baseURL='http://shuwashuwa.kinami.cc:8848'){
  // 前端获取微信res.code
  let loginRes = await wx.login()
  
  // 后端通过openid获取token
  // wx.request 似乎不是Promise，故做封装
  let requestRes = await wxp.request({
    url: baseURL + '/api/user/login',
    data:{
      'code': loginRes.code
    }
  })
  .catch((err)=>{
    console.log('[getToken] request ', err.errMsg)
    wx.showToast({
      title: '获取Token失败:' + err.errMsg,
      icon: 'none'
    })
    throw err
  })
  
  // 检验是否得到了token
  if(requestRes && requestRes.data.code == 200){
    let resObj = util.parseToken(requestRes.data.data.token)
    let date = new Date();
    date.setTime(resObj.exp * 1000);
    console.log('[login] Success uid =', resObj.userid, ', token expires at', util.formatTime(date));
    console.log(resObj)
    return requestRes.data.data.token
  }
  else{
    console.log('[getToken] ErrorCode=', requestRes.data.code, requestRes.data.data, requestRes)
    wx.showToast({
      title: '获取Token失败:' + requestRes.data.data,
      icon: "none"
    })
    throw {"errCode":requestRes.data.code, "errMsg":requestRes.data.data}
  }
}

const getWechatUserInfo = async function(){
  let userinfoRes = await wx.getSetting({
    withSubscriptions: true,
  }).catch((err)=>{console.log(err)})
  return userinfoRes
}

module.exports = {
  login: login, 
  getWechatUserInfo: getWechatUserInfo
}