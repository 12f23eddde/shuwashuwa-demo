import {wxp} from '../utils/wxp'

// 在所有请求需要在header里放token的都可用
// 包装了wxp.request, 在token失效时会自动更新token
export const uploadWithToken = async function(url, filePath){
  let app = getApp()
  let baseURL = app.globalData.baseURL
  // 不存在token, 重新生成token
  if(!app.globalData.userToken){
    console.log('userToken does not exist')
    await login()
  }
  // 尝试上传文件
  let uploadTask = await wxp.uploadFile({
    url: baseURL + url,
    header: {
      'token': app.globalData.userToken
    },
    name: 'file',
    filePath: filePath
  })

  // 如果发现token失效, 那就登录后再请求一次
  if(JSON.parse(uploadTask.data).code == 40005){
    await login()
    uploadTask = await wxp.uploadFile({
      url: baseURL + url,
      header: {
        'token': app.globalData.userToken
      },
      name: fileName,
      filePath: filePath
    })
  }

  console.log(uploadTask)

  let data = JSON.parse(uploadTask.data)

  if(data.code == 200){
    return data.data
  }else{
    throw {"errCode":data.code, "errMsg":data.data}
  }
}

export const chooseImage = async function(){
  let images = await wxp.chooseImage({
    count: 1,
  })
  console.log(images)
  return images.tempFilePaths[0]
}