import {wxp} from '../utils/wxp'
import { login } from './user'
import { requestWithToken } from './user'
import towxml from '../components/towxml/index'

// 在所有请求需要在header里放token的都可用
// 包装了wxp.upload, 在token失效时会自动更新token
export const uploadWithToken = async function(url, fileName, filePath){
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
    name: fileName,
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

  // 非常神秘的是,data传的是String
  let data = JSON.parse(uploadTask.data)

  if(data.code == 200){
    return data.data
  }else{
    throw {"errCode":data.code, "errMsg":data.data}
  }
}

// count = 允许上传的图片数量
// compressed = 直接让微信压缩图片
// 返回所有选中图片的List ['a.jpg','b.jpg']
export const chooseImage = async function(count=1, compressed=true){
  let images = await wxp.chooseImage({
    count: count,
    sizeType: (compressed?'compressed':'original')
  })
  console.log(images)
  return images.tempFilePaths
}

// 上传一张图片
export const uploadImage = async function(filePath){
  return uploadWithToken('/api/image', 'file', filePath)
}

// 删除一张图片
export const deleteImage= async function(filePath){
  return requestWithToken('/api/image?fileName=' + filePath, 'DELETE')
}

// 获取一个markdown文件，并通过<towxml>将其渲染为wxml
// 由于<wxml>不支持bindtap prop, 故将bindtap作为参数传入
// Credit: https://github.com/sbfkcel/towxml
export const getMarkdownWxml = async function(url, bindtap=()=>{}){
  // url在后期可修改为相对url
  let requestData = await wxp.request({url: url})
  let decodedmsg = towxml(requestData.data,'markdown', {events:{tap:bindtap}})
  console.log(decodedmsg)
  return decodedmsg
}

// 获取一个html文件，并通过<towxml>将其渲染为wxml
// 由于<wxml>不支持bindtap prop, 故将bindtap作为参数传入
// Credit: https://github.com/sbfkcel/towxml
export const getHtmlWxml = async function(url, bindtap=()=>{}){
  // url在后期可修改为相对url
  let requestData = await wxp.request({url: url})
  let decodedmsg = towxml(requestData.data,'html', {events:{tap:bindtap}})
  console.log(decodedmsg)
  return decodedmsg
}