import {requestWithToken} from "./user";
import { whoAmI } from "../utils/util";

export const getMyApplication = async function(){
  const app = getApp()
  await whoAmI()
  let options = {
    userId: app.globalData.userId
  }
  return listApplications(options)
}

/*
  application: {
    "cardPicLocation": "",
    "reasonForApplication": ""
  }
*/
export const postApplication = async function(application){
  let requestData = await requestWithToken('/api/volunteer/application', 'POST', application)
  console.log('postMyApplication:', requestData)
}

/* 管理员调用
  auditedApplication:{ 
    "department": "",
    "email": "",
    "formID": 0,
    "identity": "",
    "phoneNumber": "",
    "replyByAdmin": "",
    "status": 0,
    "studentId": "",
    "userName": ""
  }
*/
export const auditApplication = async function(auditedApplication){
  let requestData = await requestWithToken('/api/volunteer/application', 'PUT', auditedApplication)
  console.log('auditApplication:', requestData)
  return requestData
}

/*
  options: {
    adminId:0 报名的活动id
    status:0 0为待审核，1为通过，2为不通过
    userId:0 申请者用户id
  }
*/
// 返回符合查询条件的service简略信息 List=[{},{},{},{},{}]
export const listApplications = async function(options){
  let requestData = await requestWithToken('/api/volunteer/application', 'GET', options)
  return requestData
}