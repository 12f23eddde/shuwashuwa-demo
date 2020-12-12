import {requestWithToken} from "./user";

export const getMyApplication = async function(){
  let requestData = await requestWithToken('/api/user/application/mine')
  console.log('getMyApplication:', requestData)
  return requestData
}

export const postMyApplication = async function(application){
  let requestData = await requestWithToken('/api/user/application', 'POST', application)
  console.log('postMyApplication:', requestData)
}

// requires admin privilege
export const getAllApplication = async function(){
  let requestData = await requestWithToken('/api/user/application', 'GET', application)
  console.log('postMyApplication:', requestData)
  return requestData
}

// requires admin privilege
export const auditApplication = async function(){
  let requestData = await requestWithToken('/api/user/application', 'PUT', application)
  console.log('postMyApplication:', requestData)
  return requestData
}