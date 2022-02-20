import { WechatErrorType } from "../models/wechatType";
import { globalStore } from "../stores/global";
import { userStore } from "../stores/user";
import { wxUploadFile } from "../utils/wxp";

import { emitErrorToast } from "../utils/ui";
import { CommonResponse } from "../models/commonResponse";

import { login } from "./login";

/**
 * 通过wx.uploadFile上传文件
 * @param url 相对于backendUrl的url（如/api/user/login）
 * @param fileName 文件对应的 key，开发者在服务端可以通过这个 key 获取文件的二进制内容
 * @param filePath 要上传文件资源的路径 (本地路径)
 * @returns any (从服务器返回的数据)
 */
export const uploadFile = async (url: string, fileName: string, filePath: string): Promise<any> => {
    const backendUrl = globalStore.backendUrl;

    let res: WechatErrorType | null = null;

    try {
        // they are promises, so we can await them
        res = await wxUploadFile({
            url: backendUrl + url,
            header: {
                'token': userStore.token,
            },
            name: fileName,
            filePath: filePath
        })
    } catch (e) {
        emitErrorToast(e);
        return;
    }

    const resObj = JSON.parse(res.data) as CommonResponse;

    // token fails, try again
    if ([40005, 40006, 40007].includes(resObj.code)) {
        await login();

        let retries = 3;
        while (!userStore.isLoggedIn && retries > 0) {
            // delay 5s
            await new Promise(resolve => setTimeout(resolve, 5000));
            // try again
            retries--;
        }
        if (!userStore.isLoggedIn) {
            emitErrorToast(new Error('上传失败'));
            return;
        }

        // now we have token, try again
        try {
            // they are promises, so we can await them
            res = await wxUploadFile({
                url: backendUrl + url,
                header: {
                    'token': userStore.token,
                },
                name: fileName,
                filePath: filePath
            })
        } catch (e) {
            emitErrorToast(new Error('上传失败'));
            return;
        }
    }

    // safe to return
    if (resObj.code == 200) {
        return resObj.data;
    } else {
        // this is not what we expected, but works fine
        throw { errCode: resObj.code, errMsg: resObj.data } as WechatErrorType;
    }
}