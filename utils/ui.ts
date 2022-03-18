import type { WechatErrorType } from "../models/wechatType";

/**
 * return current page instance
 * ref: @vant/weapp/toast/toast.js
 * @returns 
 */
export const getCurrentPage = () => {
    var pages = getCurrentPages();
    return pages[pages.length - 1];
}

/**
 * parse error and emit a toast
 * @param error 
 */
export const emitErrorToast = (error: WechatErrorType | Error | string)  => {
    console.error(error);
    console.error((new Error).stack.split("\n")) // print stacktrace for debugging

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

    wx.showToast({
        title: message,
        icon: 'none'
    })
}