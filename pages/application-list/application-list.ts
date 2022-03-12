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
        application: [

        ],
        pageLoading: false,
        feedBackShow: false,
        appDataSet: {
            id: null,
            status: "",
            url: ""
        },

        applications: [] as (Application & {imageUrl?: string, previewUrl?: string})[],
        applicationsLoading: false,
        showFeedback: false,

        activeNames: ['1'],

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

        submitLoading: false,
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
            // 生成图片URL
            const _app = applications.map(a => {
                return {
                    ...a,
                    previewUrl: `${globalStore.backendUrl}/img/100_${a.cardPicLocation}`,
                    imageUrl: `${globalStore.backendUrl}/img/${a.cardPicLocation}`
                }
            })
            if (_app.length > 0) {
                this.setData({
                    applications: _app
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
    auditApplicationAsync: async function(){
        this.setData({
            submitLoading: true,
        })
        try {
            const appAudit = {
                formId: this.data.formId,
                status: this.data.status,
                replyByAdmin: this.data.replyByAdmin
            } as Application
            const res = await auditApplication(appAudit)
            if (!res) throw new Error('审核失败')
            Notify({ type: 'success', message: '审核成功' })
        } catch (e: any) {
            Notify({ type: 'danger', message: '审核失败' })
            console.error(e)
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
        Dialog.confirm({
            title: '确认页面',
            message: "确定要通过志愿者申请吗？",
        })
            .then(() => {
                this.setData({
                    status: 1,
                    showFeedback: false
                })
                this.auditApplicationAsync()
            })
            .catch(() => {
                // on cancel
            });
    },

    /**
        与onConfirm不同，onReject对应的是popup里面的那个按钮，所以event和onCorfirm的event有很大不同
        也不能直接用wxfor的item的数据
        因此虽然代码和onconfirm相似但是逻辑其实不一样
        从这里调replyApplication的话，event的dataset是空的，因此三目运算符会选择data里的数据作为参数
        数据是popup弹出时设置的
    */
    onReject: function (event: WechatEventType) {
        Dialog.confirm({
            title: '确认页面',
            message: "确定要拒绝志愿者申请吗？",
        })
            .then(() => {
                this.setData({
                    status: 2,
                    showFeedback: false
                });
                this.auditApplicationAsync()
            })
            .catch(() => {
                // on cancel
            });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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