import {requestWithToken} from "./user";
import {wxp} from '../utils/wxp';
//获取未开始活动列表
export const getCurrentActivities = async function(currentTime,filter){
  let data={
    endLower: currentTime,
    startUpper:currentTime
  }
  let requestRes
  if(filter){
    console.log("filter")
    requestRes = await requestWithToken('/api/activity','GET',data)
  }
  else{
    console.log("no filter")
    requestRes = await requestWithToken('/api/activity','GET')
  }
  return requestRes
}

export const getIncomingActivities = async function(currentTime){
  let data={
    startLower:currentTime
  }
  let requestRes = await requestWithToken('/api/activity','GET',data)
  return requestRes
}

export const getActivitySlot = async function(actId){
  let data={
    "activity":actId
  }
  let requestRes = await requestWithToken('/api/activity/slot','GET',data)
  return requestRes
}

//get slot time for specific activity and slot(
export const getSlotTime = async function(actId,slotID){
  let data={
    "activity":actId
  }
  let requestRes = await requestWithToken('/api/activity/slot','GET',data)
  for (let i in requestRes){
    if(requestRes[i].timeSlot==slotID)
      return(requestRes[i].startTime+requestRes[i].endTime)
  }
  console.log(requestRes)
  return requestRes
}

//测试用的，记得删掉——
//Edit from requestWithToken in api/user.js
export const requestWithSAToken = async function(method, data){
  let app = getApp()
  let baseURL = app.globalData.baseURL
  let requestRes = await wxp.request({
    url: baseURL+'/api/super/activity',
    header: {
      //此处应有SU token
      'token': ''
    },
    method: method,
    data: data
  })
  if(requestRes.data.code == 200){
    return requestRes.data.data
  }else{
    throw {"errCode":requestRes.data.code, "errMsg":requestRes.data.data}
  }
}