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
  let requestData = await requestWithToken('/api/service/detail', 'GET', {id: id})
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

// ref: http://shuwashuwa.kinami.cc:8848/swagger-ui.html#/event-controller/handleShutdownUsingDELETE
export const cancelService = async function(id){
  let requestData = await requestWithToken('/api/service?eventID='+id,'DELETE')
  return requestData
}

/* 管理员-审核订单
  auditDTO: {
    "message": "记得把电脑带过来",
    "problemSummary": "string",
    "result": true,
    "serviceEventId": 0,
    "serviceFormId": 0
  }
*/
export const auditService = async function(auditDTO){
  let requestData = await requestWithToken('/api/service/audit','PUT', auditDTO)
  return requestData
}

/* 志愿者-完成订单
  resultDTO: {
    "message": "string",
    "serviceEventId": 0
  }
 */
export const completeService = async function(id, message){
  let requestData = await requestWithToken('/api/service/complete','PUT', {
    message: message,
    serviceEventId: id
  })
  return requestData
}

/* 用户-反馈
  feedbackDTO: {
    "message": "string",
    "serviceEventId": 0
  }
 */
export const feedbackService = async function(id, message){
  let requestData = await requestWithToken('/api/service/feedback','PUT', {
    message: message,
    serviceEventId: id
  })
  return requestData
}

// 志愿者-接单
export const workService = async function(id){
  let requestData = await requestWithToken('/api/service/work','PUT', {id: id})
  return requestData
}

// 志愿者-取消接单
export const cancelWorkService = async function(id){
  let requestData = await requestWithToken('/api/service/work','DELETE', {id: id})
  return requestData
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
  let requestData = await requestWithToken('/api/service', 'GET', options)
  return requestData
}

// 获取帮助信息(后续可能需要修改)
export const getHelpMessage = async function(){
  let requestData = await wxp.request({url: 'http://shuwashuwa.kinami.cc'})
  const pattern = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
  let body = pattern.exec(requestData.data)
  console.log(body)
  return body
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
