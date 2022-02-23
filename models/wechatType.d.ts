/* wechat type defs */
/* which are not exported */

import type { CommonResponse } from './commonResponse';

export type IAnyObject = {[key: string]: any};

export interface RequestOption<
T extends string | IAnyObject | ArrayBuffer =
    | string
    | IAnyObject
    | ArrayBuffer
> {
    /** 开发者服务器接口地址 */
    url: string
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: any
    /** 请求的参数 */
    data?: string | IAnyObject | ArrayBuffer
    /** 返回的数据格式
     *
     * 可选值：
     * - 'json': 返回的数据为 JSON，返回后会对返回的数据进行一次 JSON.parse;
     * - '其他': 不对返回的内容进行 JSON.parse; */
    dataType?: 'json' | '其他'
    /** 开启 cache
     *
     * 最低基础库： `2.10.4` */
    enableCache?: boolean
    /** 开启 http2
     *
     * 最低基础库： `2.10.4` */
    enableHttp2?: boolean
    /** 开启 quic
     *
     * 最低基础库： `2.10.4` */
    enableQuic?: boolean
    /** 接口调用失败的回调函数 */
    fail?: any
    /** 设置请求的 header，header 中不能设置 Referer。
     *
     * `content-type` 默认为 `application/json` */
    header?: IAnyObject
    /** HTTP 请求方法
     *
     * 可选值：
     * - 'OPTIONS': HTTP 请求 OPTIONS;
     * - 'GET': HTTP 请求 GET;
     * - 'HEAD': HTTP 请求 HEAD;
     * - 'POST': HTTP 请求 POST;
     * - 'PUT': HTTP 请求 PUT;
     * - 'DELETE': HTTP 请求 DELETE;
     * - 'TRACE': HTTP 请求 TRACE;
     * - 'CONNECT': HTTP 请求 CONNECT; */
    method?:
        | 'OPTIONS'
        | 'GET'
        | 'HEAD'
        | 'POST'
        | 'PUT'
        | 'DELETE'
        | 'TRACE'
        | 'CONNECT'
    /** 响应的数据类型
     *
     * 可选值：
     * - 'text': 响应的数据为文本;
     * - 'arraybuffer': 响应的数据为 ArrayBuffer;
     *
     * 最低基础库： `1.7.0` */
    responseType?: 'text' | 'arraybuffer'
    /** 接口调用成功的回调函数 */
    success?: any
    /** 超时时间，单位为毫秒
     *
     * 最低基础库： `2.10.0` */
    timeout?: number
}

export interface RequestSuccessCallbackResult<
T extends string | IAnyObject | ArrayBuffer =
    | string
    | IAnyObject
    | ArrayBuffer
> {
    /** 开发者服务器返回的 cookies，格式为字符串数组
     *
     * 最低基础库： `2.10.0` */
    cookies: string[]
    /** 开发者服务器返回的数据 */
    data: T
    /** 开发者服务器返回的 HTTP Response Header
     *
     * 最低基础库： `1.2.0` */
    header: IAnyObject
    /** 网络请求过程中一些调试信息
     *
     * 最低基础库： `2.10.4` */
    profile: any
    /** 开发者服务器返回的 HTTP 状态码 */
    statusCode: number
    errMsg: string
}

export type WechatErrorType = {
    /** 从服务器返回的信息 */
    data?: string,
    /** 错误信息 */
    errCode: number,
    errMsg: string
}

export type WechatResponseType <T extends string | IAnyObject | ArrayBuffer =
    | string
    | IAnyObject
    | ArrayBuffer
> = RequestSuccessCallbackResult<CommonResponse<T>>;


export interface UploadFileOption {
    /** 要上传文件资源的路径 (本地路径) */
    filePath: string
    /** 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容 */
    name: string
    /** 开发者服务器地址 */
    url: string
    /** 接口调用结束的回调函数（调用成功、失败都会执行） */
    complete?: any
    /** 接口调用失败的回调函数 */
    fail?: any
    /** HTTP 请求中其他额外的 form data */
    formData?: IAnyObject
    /** HTTP 请求 Header，Header 中不能设置 Referer */
    header?: IAnyObject
    /** 接口调用成功的回调函数 */
    success?: any
    /** 超时时间，单位为毫秒
     *
     * 最低基础库： `2.10.0` */
    timeout?: number
}

export type WechatEventType = {
    detail: any,
    currentTarget?: {
        dataset: Record<string, any>
        [key: string]: any
    },
    target?: {
        dataset: Record<string, any>
        [key: string]: any
    },
    [key: string]: any
}