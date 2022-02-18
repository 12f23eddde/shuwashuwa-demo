import type { WechatResponseType, WechatErrorType } from "../models/wechatType";

import { userStore } from "../stores/user";
import { globalStore } from "../stores/global";

import { wxRequest } from "../utils/wxp";

import { login } from "./login";

// handle login failures
// this function throw an error
export const handleRequestFail = (e: { errMsg: string } | Error) => {
    const message = e instanceof Error ? e.message : e.errMsg;
    console.log('[request]', message);
    // show toast to comfort user
    wx.showToast({
        title: '请求失败:' + message,
        icon: 'none'
    })
    throw e
}

type IAnyObject = { [key: string]: any };
type RequestMethod = "GET" | "OPTIONS" | "HEAD" | "POST" | "PUT" | "DELETE" | "TRACE" | "CONNECT";

/**
 * request 使用token请求API, 并自动刷新Token
 * @param url 相对于backendUrl的url（如/api/user/login）
 * @param method 请求方法（默认GET）
 * @param data 请求参数 （默认空）
 * @returns Promise<T | undefined> 请求成功返回类型为T的数据, 请求失败返回undefined
 */
export const request = async <
    T extends string | IAnyObject | ArrayBuffer =
    | string
    | IAnyObject
    | ArrayBuffer
>(url: string, method?: RequestMethod | undefined, data?: any | undefined): Promise<T|undefined> => {
    const backendUrl = globalStore.backendUrl;

    let res: WechatResponseType<T> | null = null;

    try {
        // they are promises, so we can await them
        res = await wxRequest<T>({
            url: backendUrl + url,
            method: method || 'GET',
            data: data,
            header: {
                'token': userStore.token
            }
        });
    } catch (e) {
        handleRequestFail(e);
        return;
    }

    // http error
    if (res.statusCode !== 200) {
        console.log('[request]', res.statusCode, res.data);
        handleRequestFail(new Error(String(res.statusCode)));
        return;
    }

    // token fails, try again
    if ([40005, 40006, 40007].includes(res.data.code)) {
        await login();

        let retries = 3;
        while (!userStore.isLoggedIn && retries > 0) {
            // delay 5s
            await new Promise(resolve => setTimeout(resolve, 5000));
            // try again
            retries--;
        }
        if (!userStore.isLoggedIn) {
            handleRequestFail(new Error('登录失败'));
            return;
        }

        // now we have token, try again
        try {
            // they are promises, so we can await them
            res = await wxRequest<T>({
                url: backendUrl + url,
                method: method || 'GET',
                data: data,
                header: {
                    'token': userStore.token
                }
            });
        } catch (e) {
            handleRequestFail(e);
            return;
        }
    }

    // safe to return
    if (res.data.code == 200) {
        return res.data.data;
    } else {
        // this is not what we expected, but works fine
        throw { errCode: res.data.code, errMsg: res.data.data } as WechatErrorType;
    }
}

