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
        activeNames: ['1'],

        pageLoading: false,
        feedBackShow: false,
        appDataSet: {
            id: null,
            status: "",
            url: ""
        },

        applications: [] as (Application & {imageUrl: string})[],
        applicationsLoading: false,
        showFeedback: false,

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
        if (userStore.user?.volunteer) {
            return
        }
        this.setData({
            applicationsLoading: true,
        })
        try {
            const applications = await getApplicationList({})
            // 同时不应有多个申请
            console.log('applications refreshed', applications)
            if (!applications) {
                throw new Error('获取志愿者申请列表失败')
            }
            // 生成图片URL
            const _app = applications.map(a => {
                return {
                    ...a,
                    imageUrl: `${globalStore.backendUrl}/img/100_${a.cardPicLocation}`
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

    /*
        以下两个函数都是弹出窗口用到的
        有一个field可以输入反馈信息
        弹出时设置全局变量，关闭弹窗时再把全局变量清空
        保证appDataSet的有效声明周期与弹窗相同
        否则反馈信息可能会附加到其他的申请单上
     */
    onFeedBack: function (event) {
        console.log(event.currentTarget.dataset)
        this.setData({
            feedBackShow: true,
            appDataSet: event.currentTarget.dataset
        });
    },

    feedBackClose: function () {
        let over_write = {
            id: null,
            status: "",
            url: ""
        }
        this.setData({
            feedBackShow: false,
            appDataSet: over_write
        });
    },

    //这个是vant的collapse展开需要的函数
    onChange(event) {
        this.setData({
            activeNames: event.detail,
        });
    },

    //大部分是pjy写的，改了一点不知道有没有bug
    replyApplication: async function (event) {
        let applicationId = event.currentTarget.dataset.id ? event.currentTarget.dataset.id : this.data.appDataSet.id;
        let status = event.currentTarget.dataset.status ? event.currentTarget.dataset.status : this.data.appDataSet.status;
        console.log(applicationId, status)
        let form
        for (let i of this.data.application) {
            if (i.formId == applicationId) {
                form = i
            }
        }
        form.department = form.department ? form.department : ""
        form.phoneNumber = form.phoneNumber ? form.phoneNumber : ""
        form.identity = form.identity ? form.identity : ""
        form.email = form.email ? form.email : ""
        form.status = status - '0'
        form.userName = form.userName ? form.userName : "";
        //留言可能能用了
        form.replyByAdmin = this.data.adminFeedBack
        console.log(form)
        await requestWithToken('/api/volunteer/application', 'PUT', form)
        let data = { "status": 0 }
        let applicationList = await requestWithToken('/api/volunteer/application', 'GET', data)
        console.log(applicationList)
        let over_write = {
            id: null,
            status: "",
            url: ""
        }
        this.setData({
            application: applicationList,
            appDataSet: over_write
        })
    },

    viewPic: async function (event) {
        console.log(event.currentTarget.dataset)
        wx.previewImage({
            current: app.globalData.baseURL + '/img/' + event.currentTarget.dataset.picurl, // 当前显示图片的http链接
            urls: [app.globalData.baseURL + '/img/' + event.currentTarget.dataset.picurl] // 需要预览的图片http链接列表
        })
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
})