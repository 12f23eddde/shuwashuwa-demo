import {requestWithToken} from "./user";
import {wxp} from '../utils/wxp';
//获取未开始活动列表
export const getCurrentActivities = async function(currentTime){
  let data={
    endLower: currentTime,
    startUpper:currentTime
  }
  let requestRes = await requestWithToken('/api/activity','GET',data)
  return requestRes
}

export const getAllActivities = async function(){
  let requestRes = await requestWithToken('/api/activity','GET')
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
    if(requestRes[i].timeSlot==slotID){
      let time={
        'startTime':requestRes[i].startTime,
        'endTime':requestRes[i].endTime
      }
      return(time)
    } 
  }
  throw {"errCode":40000, "errMsg":"The activity do not have correspond time slot"}
}

//测试用的，记得删掉——
//Edit from requestWithToken in api/user.js
export const requestWithSAToken = async function(method, data){
  let app = getApp()
  let baseURL = app.globalData.baseURL
  let requestRes = await wxp.request({
    url: baseURL+'/api/super/activity',
    header: {
      //此处应有SA token
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

export const checkIn = async function(activityId){
  let requestRes = await requestWithToken('/api/activity/attend?activity=' + activityId,'PUT')
  return requestRes
}