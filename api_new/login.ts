import type { WechatResponseType } from "../models/wechatType";
import type { LoginRes } from "../models/login";

import { parseToken } from "../utils/token-parser";

import { userStore } from "../stores/user";
import { globalStore } from "../stores/global";

import { wxRequest } from "../utils/wxp";

import { emitErrorToast } from "../utils/ui";

/**
 * 通过微信的rescode获取token, 并保存到userStore
 * 如果存在其它登录请求正在进行, 则直接返回
 * @returns {Promise<void>}
 */
export const login = async (): Promise<void> => {
    // try to acquire mutex
    if (!globalStore.acquireLoginMutex()) {
        console.log('[login] login mutex is locked');
        return;
    }
    try {
        const backendUrl = globalStore.backendUrl;
        const resCode = await wx.login() as unknown as { code: string };

        let loginRes: WechatResponseType<LoginRes> | null = null;
        try {
            // they are promises, so we can await them
            loginRes = await wxRequest<LoginRes>({
                url: backendUrl + '/api/user/login',
                data: {
                    'code': resCode.code
                }
            });
        } catch (e: any) {
            emitErrorToast(e);
            return;
        }

        // check token
        if (loginRes.data.code !== 200 || !loginRes.data.data.token) {
            emitErrorToast(new Error('获取到的Token为空'));
            return;
        }

        // save token
        userStore.setToken(loginRes.data.data.token);

        // log token info
        const tokenObj = parseToken(loginRes.data.data.token);
        const expDate = new Date(tokenObj.exp * 1000);
        console.log(`[login] token: ${userStore.token} UserId: ${tokenObj.userid} Exp: ${expDate.toLocaleString()}`);

    } finally {
        // release mutex
        globalStore.releaseLoginMutex();
    }
}

/* getUserInfo is removed since Apr 2021 */
/* ref: https://developers.weixin.qq.com/community/develop/doc/000cacfa20ce88df04cb468bc52801 */
// export const getWechatUserInfo = async () => {
//     const userInfo = await wx.getUserInfo({withCredentials: true});
//     return userInfo;
// }