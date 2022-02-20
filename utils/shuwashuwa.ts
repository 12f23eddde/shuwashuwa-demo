import Dialog from '../miniprogram_npm/@vant/weapp/dialog/dialog';

import { userStore } from '../stores/user';
import { login } from '../api_new/login';
import { getCurrentUserInfo } from '../api_new/user';
import { emitErrorToast } from './ui';

import { parseToken } from './token-parser';

/**
 * 保证用户信息存在；如果组件需要用到用户信息，则调用此方法
 */
export const ensureUserInfo = async function () {
    if (!userStore.isLoggedIn) {
        await login();
    }
    if (!userStore.user) {
        const userInfo = await getCurrentUserInfo();
        if (!userInfo) {
            emitErrorToast('获取用户信息失败');
            return;
        }
        // 解析userId
        const userId = parseToken(userStore.token).userid;
        userInfo.userid = userId;

        userStore.setUser(userInfo);
    }
}

/**
 * 查询用户身份
 * @returns 用户身份 "管理员" | "志愿者" | "用户"
 */
export const whoAmI = async function () {
    await ensureUserInfo();
    if (userStore.user?.admin) {
        return '管理员';
    } else if (userStore.user?.volunteer) {
        return '志愿者';
    } else {
        return '用户';
    }
}

/**
 * 查询用户信息是否填写；如果未填写，则跳转到填写页面
 * 需要模板中存在Dialog
 * @returns 是否填写了用户信息
 */
export const checkUserInfo = async function () {
    await ensureUserInfo();
    if (!userStore.user?.userName) {
        Dialog.alert({
            message: '请您先填写个人信息',
        }).then(() => {
            wx.switchTab({ url: '/pages/my-info/my-info' })
        });
        return false;
    }
    return true;
}


export const serviceStatusText = (status: number) => {
    switch (status) {
        case 0:
            return '待填写';
        case 1:
            return '待审核';
        case 2:
            return '待签到';
        case 3:
            return '待接单';
        case 4:
            return '维修中';
        case 5:
            return '已完成';
        default:
            return '状态未知';
    }
}