import { WechatErrorType } from "../models/wechatType";
import { globalStore } from "../stores/global";
import { userStore } from "../stores/user";
import { wxUploadFile } from "../utils/wxp";

import { emitErrorToast } from "../utils/ui";
import { CommonResponse } from "../models/commonResponse";

import { login } from "./login";
import { request } from "./request";

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

    } catch (e: any) {
        emitErrorToast(e);
        return;
    }

    const resObj = JSON.parse(res.data as string) as CommonResponse;
    console.log('uploadImage', resObj);

    // token fails, try again
    if ([40005, 40006, 40007].includes(resObj.code)) {
        await login();

        let retries = 3;
        while (!userStore.isLoggedIn && retries > 0) {
            // delay 2s
            await new Promise(resolve => setTimeout(resolve, 2000));
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
            emitErrorToast('上传失败');
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

/**
 * 上传图片到服务器
 * @param filePath 文件路径
 * @returns 图片在服务器中的文件名（可以使用/img/xxx.png或/img/100_xxx.png访问）
 */
export const uploadImage = async (filePath: string) => {
    return uploadFile('/api/image', 'file', filePath);
}

/**
 * 删除服务器上的图片
 * @param fileName 服务器中的文件名
 * @returns 删除结果
 */
export const deleteImage = async (fileName: string) => {
    return request<string>(`/api/image?fileName=${fileName}`, 'DELETE');
}


/**
 * 通过微信API选择本地图片
 * @param count 上传图片的数量
 * @param compressed 是否压缩
 * @returns string[] 图片的本地路径列表
 */
export const wxChooseImage = async (count: number, compressed?: boolean) => {
    const images = await wx.chooseImage({
        count: count,
        sizeType: Array(count).fill(compressed ? 'compressed' : 'original'),
    })
    console.log('chooseImage', images);
    return images.tempFilePaths
}