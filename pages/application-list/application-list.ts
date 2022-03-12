import { userStore } from '../../stores/user'
import { globalStore } from '../../stores/global'

import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'

import type { Application } from '../../models/application'
import { auditApplication, getApplicationList } from '../../api_new/volunteer'
import { emitErrorToast } from '../../utils/ui'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
import { ensureUserInfo } from '../../utils/shuwashuwa'
import type { WechatEventType } from '../../models/wechatType'

// pages/application-list/application-list.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        applications: [] as Application[],
        applicationsLoading: false,
        showFeedback: false,

        imagesToUpload: [] as Record<string, string | boolean>[],

        /** 回复的管理员的姓名 */
        adminName: '',
        /** 校园卡照片的路径 */
        cardPicLocation: '',
        /** 志愿者申请表id */
        formId: -1,
        /** 用户填写的申请理由 */
        reasonForApplication: '',
        /** 管理员的回复 */
        replyByAdmin: '',
        /** 管理员给出的状态,1表示通过,2表示拒绝 */
        status: -1,
        /** 发起申请的用户的姓名 */
        userId: -1,

        /** 用户姓名 */
        userName: '',
        /** 用户手机号 */
        phoneNumber: '',
        /** 用户邮箱 */
        email: '',
        /** 用户身份 */
        identity: '',
        /** 用户院系 */
        department: '',
        /** 用户学号 */
        studentId: '',

        submitLoading: false,
        auditable: false,
    },

    /** 载入志愿者申请 */
    getApplicationAsync: async function () {
        this.setData({
            applicationsLoading: true,
        })
        try {
            const applications = await getApplicationList({
                status: 0,
            })
            // 同时不应有多个申请
            console.log('applications refreshed', applications)
            if (!applications) {
                throw new Error('获取志愿者申请列表失败')
            }
            if (applications.length > 0) {
                this.setData({
                    applications
                })
            }
        } catch (e) {
            console.error(e)
        } finally {
            this.setData({
                applicationsLoading: false,
            })
        }
    },

    /** 审核志愿者申请 */
    auditApplicationAsync: async function () {
        this.setData({
            submitLoading: true,
        })
        try {
            if (!this.data.replyByAdmin) {
                Notify({ type: 'danger', message: '请填写反馈信息' })
                return
            }
            // 补全空项
            const appAudit: any = Object.fromEntries(Object.entries(this.data).map(([k, v]) => v? [k, v]: [k, '未填写']))
            console.log('appAudit', appAudit)
            await auditApplication(appAudit)
            Notify({ type: 'success', message: '审核成功' })
        } catch (e: any) {
            console.error(e)
            Notify({ type: 'danger', message: '审核失败' })
        } finally {
            this.setData({
                submitLoading: false,
            })
        }
    },

    /** 展开抽屉 */
    onChange(event: WechatEventType) {
        this.setData({
            activeNames: event.detail,
        });
    },

    onShowPopup(event: WechatEventType) {
        const application = event.currentTarget?.dataset.application
        console.log(application)

        this.setData({
            ...application,
            showFeedback: true,
            auditable: userStore.user?.admin,
            imagesToUpload: [
                {
                    name: application.cardPicLocation,
                    thumb: globalStore.backendUrl + '/img/100_' + application.cardPicLocation,
                    url: globalStore.backendUrl + '/img/' + application.cardPicLocation,
                    isImage: true
                }
            ]
        })

    },

    onHidePopup(event: WechatEventType) {
        this.setData({
            replyByAdmin: '',
            showFeedback: false,
        })
    },

    /** 确认通过，没有什么特殊的操作，只是把event作为参数传过去 */
    onConfirm: function (event: WechatEventType) {
        this.setData({
            status: 1,
        })
        try {
            this.auditApplicationAsync()
            this.setData({
                showFeedback: false
            })
        } catch (e: any) {
            Notify({ type: 'danger', message: e.message })
        }
    },

    /** 不通过维修单 */
    onReject: function (event: WechatEventType) {
        this.setData({
            status: 2,
        })
        try {
            this.auditApplicationAsync()
            this.setData({
                showFeedback: false
            })
        } catch (e: any) {
            Notify({ type: 'danger', message: e.message })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        await ensureUserInfo()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {
        await ensureUserInfo()
        this.getApplicationAsync()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    onPullDownRefresh: function () {
        this.getApplicationAsync().then(
            () => wx.stopPullDownRefresh()
        )
    },
})