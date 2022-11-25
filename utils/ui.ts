import type { WechatErrorType } from "../models/wechatType";
import { userStore } from "../stores/user";

/**
 * return current page instance
 * ref: @vant/weapp/toast/toast.js
 * @returns 
 */
export const getCurrentPage = () => {
    var pages = getCurrentPages();
    return pages[pages.length - 1];
}

/* upload log message to server */
export const uploadLogMsg = (msg: any, level: 'info' | 'warn' | 'error') => {
    if (!level) {
        level = 'info';
    }
    const wxLogger = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null;
    if (wxLogger) {
        wxLogger[level](msg);
    }
}

/**
 * parse error and emit a toast
 * @param error 
 */
export const emitErrorToast = (error: WechatErrorType | Error | string)  => {
    console.error(error);
    console.error((new Error).stack.split("\n")) 
    // print stacktrace for debugging

    let message = '网络错误 请稍后重试'
    
    if (typeof error === 'string') {
        message = error;
    } else if (error instanceof Error) {
        message = error.message
    } else {
        if (error.errMsg) {
            message = error.errMsg
        }
    } 

    uploadLogMsg(message, 'error')

    wx.showToast({
        title: message,
        icon: 'none'
    })
}

/** 
 * report data to wechat log server
*/
export const reportData = () => {
    // get User Info
    const { user } = userStore;
    uploadLogMsg(user?.userid + ' userInfo: ' + JSON.stringify(user, null, 2), 'info')

    // get router
    const pages = getCurrentPages();
    for (let page of pages){
        uploadLogMsg(user?.userid + ' page: ' + JSON.stringify(page.route, null, 2), 'info')
        uploadLogMsg(page.data, 'info')
    }
}