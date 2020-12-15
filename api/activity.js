import {requestWithToken} from "./user";
//获取未开始活动列表
export const getComingActivities = async function(){
  let app = getApp()
  let baseURL = app.globalData.baseURL
  let requestRes = await requestWithToken(baseURL + '/api/activity/coming','GET')
  return requestRes
}

export const getActivitySlot = async function(activityId){
  let app = getApp()
  let baseURL = app.globalData.baseURL
  console.log(baseURL + '/api/activity/slot?activityId='+activityId)
  let requestRes = await requestWithToken(baseURL + '/api/activity/slot?activityId='+activityId,'GET')
  return requestRes
}
