import {requestWithToken} from "./user";
import {wxp} from '../utils/wxp';

export const requestSubscription = async function(tmplIds){
  // 修复tmplIds为空的问题
  if(tmplIds.length === 0) return;
  let requestData = await wxp.requestSubscribeMessage({
    tmplIds: tmplIds
  })
  .catch((err)=>{
    wx.showToast({
      title:  err.errMsg,
      icon: 'none'
    })
    throw err
  })
  return requestData
}

export const getTemplateIDs = async function(options){
  let tmplIDs = await requestWithToken('/api/user/notice')
  let auth_subscribe = (await wxp.getSetting({withSubscriptions: true})).subscriptionsSetting
  console.log(auth_subscribe)
  // 从tmplIDs移除已经同意过的通知
  // isIterable Credit:https://stackoverflow.com/questions/18884249/checking-whether-something-is-iterable
  // if (auth_subscribe.mainSwitch && typeof(auth_subscribe.itemSettings[Symbol.iterator]) === 'function'){
  //   for (template of auth_subscribe.itemSettings){
  //     if(auth_subscribe.itemSettings[template]!=='accept') continue;
  //     let idx = tmplIDs.findIndex(template)
  //     if (idx >= 0){
  //       tmplIDs.splice(idx, 1)  // remove idx
  //     }
  //   }
  // }
  console.log('[getTemplateIDs]', tmplIDs)
  return tmplIDs
}