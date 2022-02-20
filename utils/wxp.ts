// Promisify all wx requests -> wxp
// Credit: https://www.jianshu.com/p/69307a720fa1
// e.g. wx.Login -> wxp.Login

import { promisifyAll, promisify } from 'miniprogram-api-promise';

import type { WechatResponseType, RequestOption, UploadFileOption, WechatErrorType } from '../models/wechatType';

type IAnyObject = { [key: string]: any };

export const wxp = {} as typeof wx;
promisifyAll(wx, wxp);

/**
 * promisify wx.request
 */
export const wxRequest = promisify(wx.request) as <T extends string | IAnyObject | ArrayBuffer =
    | string
    | IAnyObject
    | ArrayBuffer
    >(options: RequestOption) => Promise<WechatResponseType<T>>;

/**
 * promisify wx.uploadFile
 * returns a wxUploadTask object
 */
export const wxUploadFile = promisify(wx.uploadFile) as (options: UploadFileOption) => Promise<WechatErrorType>;