import {requestWithToken} from './user'
import {wxp} from '../utils/wxp'

// 新建一个维修事件
// 返回一个serviceEvent
export const createService = async function(){
  let requestData = await requestWithToken('/api/service', 'POST')
  console.log('createService:', requestData)
  return requestData
}

// 获取一个维修事件的详细信息
// 返回一个serviceEvent
export const getService = async function(id){
  let requestData = await requestWithToken('/api/service/detail', 'GET', {eventId:id})
  console.log('getService:', requestData)
  return requestData
}

export const submitForm = async function(data){
  let requestData = await requestWithToken('/api/service/commit', 'POST', data)
  console.log('submitForm:', requestData)
  return requestData.data
}

export const submitDraft = async function(data){
  let requestData = await requestWithToken('/api/service/draft', 'PUT', data)
  console.log('submitDraft:', requestData)
  return requestData.data
}

/*
options: {
  activity:0 报名的活动id
  client:0 创建维修事件的用户id
  closed:true 维修事件是否关闭
  createLower:yyyy-MM-dd HH:mm:ss 创建时间下界
  createUpper:yyyy-MM-dd HH:mm:ss 创建时间上界
  draft:true 是否有云端保存的草稿
  status:0 该次维修处于的状态
            0:等待用户编辑
            1:等待管理员审核
            2:审核通过（待签到）
            3:等待志愿者接单
            4:维修中
            5:维修完成
  volunteer:0 接单的志愿者id
}
*/
// 返回符合查询条件的service简略信息 List=[{},{},{},{},{}]
export const listServices = async function(options){
  let requestData = await requestWithToken('/api/service/', 'GET', options)
  return requestData
}

// ref: http://shuwashuwa.kinami.cc:8848/swagger-ui.html#/event-controller/handleShutdownUsingDELETE
export const cancelService = async function(id){
  let requestData = await requestWithToken('/api/service','DELETE', {serviceEventId: id})
  return requestData
}

export const requestSubscription = async function(tmplIds){
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
