import { login } from '../../api_new/login'
import { request } from '../../api_new/request'
import { getTemplateIDs, requestSubscription } from '../../api_new/subscription'
import { ensureUserInfo, whoAmI } from '../../utils/shuwashuwa'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

import { userStore } from '../../stores/user'
import { globalStore } from '../../stores/global'
import { WechatErrorType, WechatEventType } from '../../models/wechatType'
import { getCurrentUserInfo } from '../../api_new/user'
import { reportData } from '../../utils/ui' 

Page({
    /**
     * 页面的初始数据
     */
    data: {
        currResCode: "复制res.code",
        currToken: "复制Token",
        currURL: "http://shuwashuwa.kinami.cc:8848",
        navigateURL: "/pages/my-info/my-info",
        /** 后端URL */
        backendUrl: '',
        /** 是否设置为管理员 */
        admin: false,
        /** 是否设置为志愿者 */
        volunteer: false,
        myRole: '',
        tmplIDs: []
    },

    /** 设置后端URL */
    setBackendUrl: function () {
        globalStore.setBackendUrl(this.data.backendUrl)
    },

    /** 设置当前用户的权限（测试环境） */
    updateRoleAsync: async function () {
        const url = `/test/auth?admin=${this.data.admin?1:0}&volunteer=${this.data.volunteer?1:0}`
        console.log(url)
        try {
            const res = await request<string>(url, 'PUT')
            console.log('updateRoleAsync', url, res)
        } catch (e) {
            console.log(e)
        }
        
        const userInfo = await getCurrentUserInfo()
        console.log('updateRoleAsync', userInfo)
        if(userInfo){
            userStore.setUser(userInfo)
        }
        
        this.setData({
            myRole: await whoAmI()
        })
    },

    onReportData: async function () {
        reportData()
        Toast.success('上报成功')
    },

    onChangeAdmin: function (e: WechatEventType) {
        this.setData({
            admin: e.detail
        })
        this.updateRoleAsync()
    },

    onChangeVolunteer: function (e: WechatEventType) {
        this.setData({
            volunteer: e.detail
        })
        this.updateRoleAsync()
    },

    /** 删除当前用户（测试环境） */
    deleteCurrentUserAsync: async function () {
        const url = "/test/myself"
        const res = await request<string>(url, "DELETE")
        console.log('deleteCurrentUserAsync', url, res)
    },

    /** 设置剪贴板 */
    setClipboardData: function (s: string) {
        wx.setClipboardData({
            data: s,
        })
    },

    /** 复制res.code到剪贴板 */
    onCopyCode: async function () {
        const res = await wx.login() as any
        this.setClipboardData(res.code)
    },

    /** 复制token到剪贴板 */
    onCopyToken: async function () {
        this.setClipboardData(userStore.token)
    },

    /** 清除缓存 */
    onClearStorage: async function () {
        await wx.clearStorage({})
        wx.reLaunch({
            url: '../index/index'
        })
    },

    /** 删除当前用户 */
    onDeleteCurrentUser: async function () {
        Dialog.confirm({
            title: "注销确认",
            message: "您确定要注销当前用户吗？此操作不可逆。"
        })
            .then(() => {  // confirmed
                this.deleteCurrentUserAsync()
                    .then(() => {
                        Toast.success('用户已删除')
                        wx.clearStorage()
                    })
                    .catch((err) => {
                        Toast.fail(err.errMsg)
                        throw err
                    })
            })
            .catch(() => {  // canceled
            })
    },

    /** 请求订阅 */
    onRequestSubscription: async function () {
        const tmplIDs = await getTemplateIDs()
        if (!tmplIDs || tmplIDs.length === 0) {
            Toast.fail('没有可用的模板')
            return
        }
        await requestSubscription(tmplIDs)
    },

    /** 切换环境 */
    onSwitchEnv: function () {
        if (this.data.backendUrl === 'https://dev.shuwashuwa.7nm.ltd') {
            this.setData({
                backendUrl: 'https://shuwashuwa.7nm.ltd'
            })
            globalStore.setBackendUrl(this.data.backendUrl)
            Toast.success('线上环境')
        } else {
            this.setData({
                backendUrl: 'https://dev.shuwashuwa.7nm.ltd'
            })
            globalStore.setBackendUrl(this.data.backendUrl)
            Toast.success('测试环境')
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {
        ensureUserInfo()
        this.setData({
            backendUrl: globalStore.backendUrl,
            admin: userStore.user?.admin,
            volunteer: userStore.user?.volunteer,
            myRole: await whoAmI()
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    gotoURL: async function () {
        try {
            await wx.navigateTo({
                url: this.data.navigateURL,
            })
        } catch (e: any) {
            await wx.switchTab({
                url: this.data.navigateURL
            })
        }
    }
})