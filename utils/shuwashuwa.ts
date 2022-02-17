import { getUserInfo } from '../api/user.js';
import { Dialog } from '@vant/weapp';


// 用户身份（为了方便调试，直接用中文力）
// ['普通用户','管理员','志愿者']
// whoAmI能保证login()一定执行完毕，且在大多数情况下不会login()两次
export const whoAmI = async function(){
    const app = getApp()
    if(!app.globalData.userInfo){
      await getUserInfo()
    }
    if(!app.globalData.userInfo.admin && !app.globalData.userInfo.volunteer){
      return '普通用户'
    }else if(!app.globalData.userInfo.admin && app.globalData.userInfo.volunteer){
      return '志愿者'
    }else if(app.globalData.userInfo.admin){
      return '管理员'
    }else return ''
  }
  
  // 检查用户信息是否填写 注意Dialog in wxml
  export const checkUserInfo = async function(){
    const app = getApp()
    if(!app.globalData.userInfo){
      await getUserInfo()
    }
    if(!app.globalData.userInfo.userName){
      await Dialog.alert({
        message: '请您先填写个人信息',
      }).then(() => {
        wx.switchTab({url: '/pages/my-info/my-info'})
      });
      return false;
    }
    return true;
  }