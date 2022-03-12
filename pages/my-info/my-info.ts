// import {getUserInfo, updateUserInfo} from '../../api/user'
// import {uploadImage, deleteImage} from '../../api/file'
// import {postApplication, getMyApplication} from '../../api/application'
// import {whoAmI, checkUserInfo} from '../../utils/util'

import { ensureUserInfo, whoAmI } from '../../utils/shuwashuwa'

import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import WeValidator from '../../miniprogram_npm/we-validator/index'

import type { WeValidatorInstance, WeValidatorOptions, WeValidatorResult } from '../../models/weValidatorType'
import type { WechatEventType } from '../../models/wechatType'
import { userStore } from '../../stores/user'
import { updateCurrentUserInfo } from '../../api_new/user'
import { getApplicationList, submitApplication } from '../../api_new/volunteer'
import type { User } from '../../models/user'
import { deleteImage, uploadImage } from '../../api_new/file'
import { globalStore } from '../../stores/global'

Page({
    data: {
        // showcase
        myRole: '',

        // userInfo
        /** 用户ID */
        userid: -1,
        /** 用户姓名 */
        userName: '',
        /** 学号 */
        studentId: '',
        /** 用户手机号 */
        phoneNumber: '',
        /** 用户身份 */
        identity: '',
        /** 用户邮箱 */
        email: '',
        /** 用户所在部门 */
        department: '',
        /** 是否是管理员 */
        admin: false,
        /** 是否是志愿者 */
        volunteer: false,

        userInfoLoading: false,
        submitLoading: false,
        disableEdit: true,

        // application
        showApplication: false,
        applicationLoading: false,
        /** 学生证照片的位置 */
        cardPicLocation: '',
        /** 申请理由 */
        reasonForApplication: '',
        /** 申请状态 -1 为未提交 */
        status: -1,

        imagesToUpload: [] as Record<string, string|boolean>[],

        // form error message
        errMsg: {
            userName: '',
            studentId: '',
            phoneNumber: '',
            email: '',
            reasonForApplication: '',
            cardPicLocation: '',
        },

        // magic tap
        tapCount: 0,
        tapTime: 0,
    },

    // validator
    userValidator: null as WeValidatorInstance | null,
    applicationValidator: null as WeValidatorInstance | null,

    /** 初始化表单验证 */
    initValidator: function () {
        const showErrMsg = (res: Record<string, WeValidatorResult>) => {
            Object.keys(res).forEach(key => {
                this.setData({
                    [`errMsg.${res[key].name}`]: res[key].msg,
                })
            })
        }

        this.userValidator = new WeValidator({
            multiCheck: true,
            onMessage: showErrMsg,
            rules: {
                userName: { required: true },
                studentId: { required: true, length: 10 },
                phoneNumber: { required: true, mobile: true },
                email: { email: true }
            },
            messages: {
                userName: { required: '您的姓名不能为空' },
                phoneNumber: { required: '您的手机号不能为空', mobile: '手机号格式不正确' },
                studentId: { required: '您的学号不能为空', length: '请您输入正确的学号' },
                email: { email: '请输入正确的邮箱地址' }
            },
        } as WeValidatorOptions) as unknown as WeValidatorInstance

        // 不必需学生证图片了
        this.applicationValidator = new WeValidator({
            multiCheck: true,
            onMessage: showErrMsg,
            rules: {
                reasonForApplication: { required: true },
            },
            messages: {
                reasonForApplication: { required: '请填写申请理由' },
            },
        } as WeValidatorOptions) as unknown as WeValidatorInstance
    },

    /** 获取用户信息 */
    getUserInfoAsync: async function () {
        this.setData({
            userInfoLoading: true
        })
        try {
            const myRole = await whoAmI()
            this.setData({
                ...userStore.user,
                myRole
            })
        } catch (e: any) {
            console.error(e)
        } finally {
            this.setData({
                userInfoLoading: false
            })
        }
    },

    /** 提交用户信息 */
    submitUserInfoAsync: async function () {
        this.setData({
            submitLoading: true
        })
        try {
            await updateCurrentUserInfo(this.data as User)
            Notify({ type: 'success', message: '修改成功' })
        } catch (e: any) {
            console.error(e)
            Notify({ type: 'danger', message: '修改失败' })
        } finally {
            this.setData({
                submitLoading: false
            })
        }
    },

    /** 获取我的志愿者申请 */
    getMyApplicationAsync: async function () {
        this.setData({
            applicationLoading: true
        })
        try {
            // 待审核状态的志愿者申请
            const myAuditingApplications = await getApplicationList({
                userId: this.data.userid,
                status: 0
            })
            // 存在待审核的申请
            if (myAuditingApplications && myAuditingApplications.length > 0) {
                this.setData({
                    reasonForApplication: myAuditingApplications[0].reasonForApplication,
                    cardPicLocation: myAuditingApplications[0].cardPicLocation,
                    status: myAuditingApplications[0].status,
                })
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            this.setData({
                applicationLoading: false
            })
        }
    },

    /** 提交志愿者申请 */
    submitApplicationAsync: async function () {
        this.setData({
            applicationLoading: true
        })
        try {
            await submitApplication({
                reasonForApplication: this.data.reasonForApplication,
                cardPicLocation: this.data.cardPicLocation
            })
            Notify({ type: 'success', message: '提交成功' })
        } catch (e: any) {
            console.error(e)
            Notify({ type: 'danger', message: e.errMsg? e.errMsg: '提交失败' })
        } finally {
            this.setData({
                applicationLoading: false
            })
        }
    },

    /** 清除error message */
    clearErrMsg: async function () {
        Object.keys(this.data.errMsg).forEach(key => {
            this.setData({
                [`errMsg.${key}`]: ''
            })
        })
    },

    /** 点击编辑/提交用户信息 */
    onEditUserInfo: async function () {
        this.clearErrMsg()
        // 编辑
        if (this.data.disableEdit) {
            this.setData({ disableEdit: false })
            return
        }

        // 提交
        if (!this.userValidator?.checkData(this.data as User)) return;
        this.setData({ 
            submitLoading: true, 
            disableEdit: true 
        })
        await this.submitUserInfoAsync()
        // 更新用户信息
        await this.getUserInfoAsync()
    },

    /** 点击显示申请菜单 */
    onShowApplication: async function(){
        // 已经有申请了
        if (this.data.status === 0){
            return
        }
        this.clearErrMsg()
        this.setData({
            showApplication: true
        })
    },

    /** 隐藏志愿者申请菜单 */
    onHideApplication: function(){
        this.setData({
            showApplication: false
        })
    },

    /** 点击提交志愿者申请 */
    onSubmitApplication: async function(){
        this.clearErrMsg()
        if (!this.applicationValidator?.checkData({
            reasonForApplication: this.data.reasonForApplication,
            cardPicLocation: this.data.cardPicLocation
        })) return;
        this.setData({
            applicationLoading: true
        })

        await this.submitApplicationAsync()

        // 上传完毕后清空信息
        this.setData({
            submitLoading: false,
            cardPicLocation: '',
            imagesToUpload: [],
            reasonForApplication: '',
            showApplication: false
        })
    },

    /** 点击上传图片 */
    uploadConfirm: async function (event: WechatEventType) {
        const image = event.detail.file
        console.log('uploadConfirm', image)
        
        const fileName = await uploadImage(image.url)

        // 更新imagesToUpload
        const { imagesToUpload } = this.data;
        imagesToUpload.push({ ...image, url: globalStore.backendUrl + '/img/' + fileName });
        this.setData({ imagesToUpload });
        console.log(imagesToUpload)
        // 更新imageList
        this.setData({ cardPicLocation: fileName });
    },

    /** 取消上传图片 */
    uploadCancel: async function (event: WechatEventType) {
        // 更新imagesToUpload
        const imageToDelete = event.detail.index
        const { imagesToUpload  } = this.data;
        imagesToUpload.splice(imageToDelete, 1)
        this.setData({ imagesToUpload });
        // 更新imageList
        await deleteImage(imageToDelete)
        this.setData({ cardPicLocation: '' });
    },

    /** 连续点击5次，进入debug页面 */
    onMagicTap: function(e: WechatEventType){
        const currentTime = e.timeStamp
        const prevTime = this.data.tapTime
        
        // 点击小于300ms
        if (currentTime - prevTime < 300 || prevTime === 0) {
            this.setData({
                tapTime: currentTime,
                tapCount: this.data.tapCount + 1
            })
            console.log('tapCount', this.data.tapCount)
        } else {
            this.setData({
                tapTime: 0,
                tapCount: 0
            })
        }

        // 连续点击5次 进入debug页面
        if (this.data.tapCount === 5) {
            Dialog.confirm({
                title: '进入调试页面',
                message: '如果您不清楚这是什么，请点击取消',
            })
                .then(() => {
                    wx.navigateTo({
                    url: '/pages/debug/debug'
                    })
                })
                .catch(()=>{})

            this.setData({
                    tapCount: 0,
                    tapTime: 0
            })
        }
    },

    onLoad: async function () {
        this.initValidator()
    },

    onShow: async function () {
        await ensureUserInfo()
        await this.getUserInfoAsync()
        // 未填写用户信息，开启编辑
        if (this.data.userName == '') {
            this.setData({
                disableEdit: false
            })
        }
        
        this.getMyApplicationAsync()

        this.setData({
            tapCount: 0,
            tapTime: 0
        })
    },

    /** 前往申请表页面 */
    goToApplicationList: function () {
        wx.navigateTo({ url: '/pages/application-list/application-list' })
    },

    /** 前往测试页面 */
    goToDebug: function(){
        wx.navigateTo({ url: '/pages/debug/debug' })
    }
})
