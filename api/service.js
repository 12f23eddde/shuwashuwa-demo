import {requestWithToken} from './user'
import {wxp} from '../utils/wxp'

export const createService = async function(){
  let requestData = await requestWithToken('/api/service', 'POST')
  console.log('createService:', requestData)
  return requestData
}

export const getService = async function(id){
  let requestData = await requestWithToken('/api/service/'+ id, 'GET')
  return requestData
}

// NOTE: id is Integer, not json
// ref: http://shuwashuwa.kinami.cc:8848/swagger-ui.html#/event-controller/handleShutdownUsingDELETE
export const cancelService = async function(id){
  let requestData = await requestWithToken('/api/service','DELETE',id)
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
