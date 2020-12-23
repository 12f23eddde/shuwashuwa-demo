const util = require('../utils/util')
import {wxp} from '../utils/wxp';

// 您不能直接在这里声明app
// app的生命周期还没有开始
// 您可以选择在函数里调用getApp(简单低效但是我懒)
// 或者在应用生命周期开始时手动为每一个模块的app赋值
// Credit: https://developers.weixin.qq.com/community/develop/doc/000ca80e3e89887e16a70b1c55bc04

// let app = getApp();

// 登录并从后台获取token
// 考虑到res.code有效期很短,建议您们更新token时调用login,获取res.code
export const login = async function(){
  let app = getApp()
  let baseURL = app.globalData.baseURL
  // 前端获取微信res.code
  let loginRes = await wxp.login()
  
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
  if(requestRes && requestRes.data.code === 200){
    let resObj = util.parseToken(requestRes.data.data.token)
    let date = new Date();
    date.setTime(resObj.exp * 1000);
    // 设置全局变量的值
    app.globalData.userToken = requestRes.data.data.token
    app.globalData.userId = resObj.userid
  
    console.log('[login] Success uid =', resObj.userid, ', token expires at', util.formatTime(date));
    
    // 当login时更新用户信息(后期可能会更改)
    let userInfoRes = await wxp.request({
      url: baseURL + '/api/user/info',
      header:{
        'token': app.globalData.userToken
      }
    })
    // 设置全局变量的值
    app.globalData.userInfo = userInfoRes.data.data
    return requestRes.data.data.token
    
  }else{
    console.log('[getToken] ErrorCode=', requestRes.data.code, requestRes.data.data, requestRes)
    wx.showToast({
      title: '获取Token失败:' + requestRes.data.data,
      icon: "none"
    })
    throw {"errCode":requestRes.data.code, "errMsg":requestRes.data.data}
  }
}

// 获取微信用户信息(用户头像,昵称)
export const getWechatUserInfo = async function(){
  let userinfoRes = await wx.getSetting({withSubscriptions: true})
  .catch((err)=>{
    console.log('[getWechatUserInfo]', err.errMsg)
    throw err
  })
  return userinfoRes
}

// 在所有请求需要在header里放token的都可用
// 包装了wxp.request, 在token失效时会自动更新token
export const requestWithToken = async function(url, method, data){
  let app = getApp()
  let baseURL = app.globalData.baseURL
  // 不存在token, 重新生成token
  if(!app.globalData.userToken){
    console.log('userToken does not exist')
    await login()
  }
  // 获取用户信息
  let requestRes = await wxp.request({
    url: baseURL + url,
    header: {
      'token': app.globalData.userToken
    },
    method: method,
    data: data
  })
  // 如果发现token失效, 那就登录后再请求一次
  if(requestRes.data.code == 40005){
    await login()
    requestRes = await wxp.request({
      url: baseURL + url,
      header: {
        'token': app.globalData.userToken
      },
      data: data
    })
  }
  if(requestRes.data.code == 200){
    return requestRes.data.data
  }else{
    throw {"errCode":requestRes.data.code, "errMsg":requestRes.data.data}
  }
}

// 获取用户信息
export const getUserInfo = async function(){
  let userinfo = await requestWithToken('/api/user/info')
  // 设置全局变量的值
  let app = getApp()
  app.globalData.userInfo = userinfo
  return userinfo
}

// 更新用户信息
export const updateUserInfo = async function(userinfo){
  let requestRes = await requestWithToken('/api/user/info','PUT', userinfo)
  return requestRes
}

// [测试] 删除当前用户
export const deleteCurrentUser = async function(){
  let requestRes = await requestWithToken('/test/myself','DELETE')
  return requestRes
}