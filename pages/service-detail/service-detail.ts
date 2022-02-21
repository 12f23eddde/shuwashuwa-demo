import {
    createService, getService, submitForm, submitDraft,
    cancelService, auditService, completeService, feedbackService,
    workService, cancelWorkService, getHelpMessage
} from '../../api/service'
import { uploadImage, deleteImage, getHtmlWxml, getMarkdownWxml } from '../../api/file'
import { getIncomingActivities, getCurrentActivities, getActivitySlot } from '../../api/activity'
import { getTemplateIDs, requestSubscription } from '../../api/subscription'
import { formatTime } from '../../utils/util'

import Notify from '@vant/weapp/notify/notify'
import Dialog from '@vant/weapp/dialog/dialog'
import Toast from '@vant/weapp/toast/toast'
import WeValidator from 'we-validator/index'

const app = getApp()

import { getServiceEventDetail } from '../../api_new/service';
import { getActivityList, getActivityTimeSlots } from '../../api_new/activity'

import { formatDate } from '../../utils/date'
import { emitErrorToast } from '../../utils/ui'
import { ActivityQuery } from '../../models/activity'

Page({
    data: {
        // 维修单详情
        draft: false,
        activityId: 0,
        activityName: "",
        boughtTime: "1919-08-10",
        brand: "加载中",
        computerModel: "加载中",
        cpuModel: "加载中",
        graphicsModel: "加载中",
        hasDiscreteGraphics: true,
        imageList: [],
        laptopType: "加载中",
        problemDescription: "加载中",
        problemType: "加载中",
        serviceEventId: 0,
        timeSlot: 0,
        startTime: "加载中",
        endTime: "加载中",
        underWarranty: true,
        descriptionAdvice: "加载中",
        problemSummary: "加载中",
        result: true,
        serviceFormId: 0,
        status: 0,

        volunteerMessage: "",
        userMessage: "",

        activityList: [],
        activityNames: [],
        activityShow: false,
        activityLoading: false,

        timeslotList: [],
        timeslotNames: [],
        timeslotShow: false,
        timeslotLoading: false,

        calenderShow: false,
        calenderMinDate: new Date(2010, 0, 1).getTime(),
        calenderMaxDate: new Date().getTime(),
        calenderCurrDate: null,

        pcTypes: ['二合一/平板', '轻薄本', '游戏本', '台式机', 'Mac'],
        typeShow: false,

        problemTypes: ['软件相关', '硬件相关', '我不清楚'],
        problemShow: false,

        imagesToUpload: [],

        helpShow: false,
        helpMessage: '',
        helpMessageContent: '',  // 标识helpMessage里放了什么
        submitLoading: false,

        disableEdit: true,
        editable: false,
        auditable: false,
        workable: false,

        /** 模板ID */
        tmplIDs: [] as string[],
        templateLoading: false,
        serviceLoading: false
    },

    /** 获取维修单信息 */
    getServiceEventDetailAsync: async function () {
        this.setData({
            serviceLoading: true
        })
        try {
            /** 从this.data.serviceEventId 读取serviceId */
            const res = await getServiceEventDetail(this.data.serviceEventId)
            if (!res){
                emitErrorToast('获取维修单信息失败')
                return
            }
            console.log('getServiceEventDetail', res)
            this.setData({
                ...res,
            })

        } catch (e) {
            console.error(e)
        } finally {
            this.setData({
                serviceLoading: false
            })
        }
    },

    /** 获取进行中活动 */
    getIncomingActivitiesAsync: async function () {
        this.setData({
            activityLoading: true
        })
        try {
            const query: ActivityQuery = {
                endLower: formatDate(new Date()),
            }
            const res = await getActivityList(query)
            if (!res) {
                emitErrorToast('获取活动列表失败')
                return
            }
            this.setData({
                activityList: res,
            })
        } catch (e) {
            console.error(e)
        } finally {
            this.setData({
                activityLoading: false
            })
        }
    },

    /** 获取活动时间段 */
    getActivityTimeSlotsAsync: async function () {
        this.setData({
            timeslotLoading: true
        })
        try {
            const res = await getActivityTimeSlots(this.data.activityId)
            if (!res) {
                emitErrorToast('获取活动时间段失败')
                return
            }
            this.setData({
                timeslotList: res,
            })
        } catch (e) {
            console.error(e)
        } finally {
            this.setData({
                timeslotLoading: false
            })
        }
    },

    /** 获取模板ID */
    getTemplateIdsAsync: async function () {
        this.setData({
            templateLoading: true
        })
        try {
            const res = await getTemplateIDs()
            if (!res) {
                emitErrorToast('获取模板ID失败')
                return
            }
            console.log('getTemplateIds', res)
            this.setData({
                tmplIDs: res
            })
        } catch (e) {
            console.error(e)
        }
        finally {
            this.setData({
                templateLoading: false
            })
        }
    },

    // 编辑
    onEdit: function () {
        if (this.data.disableEdit) {
            this.setData({
                disableEdit: false,
            })
            return
        }
    },

    // 提交
    onSubmit: async function () {
        if (!this.validator.checkData(this.data)) return;
        // 弹出活动前须知
        if (!this.data.helpMessage || this.data.helpMessageContent !== 'notice') {
            Toast.loading({ // 加载并渲染为wxml可能需要一些时间，因此采用Toast避免用户误操作
                message: '加载中...',
                forbidClick: true,
            });
            const helpMsg = await getMarkdownWxml('https://shuwashuwa.kinami.cc/notice.md')
            this.setData({
                helpShow: true,
                helpMessage: helpMsg,
                helpMessageContent: 'notice'
            })
        } else {
            this.setData({ helpShow: true })
        }
        this.setData({
            submitLoading: true
        })
        console.log(this.data)
        await submitForm(this.data)
            .catch((err) => {
                Notify({ type: "danger", message: err.errMsg })
                this.setData({
                    submitLoading: false
                })
                throw err
            })
        this.setData({
            submitLoading: false,
            disableEdit: true,
        })

        this.loadService(this.data.serviceEventId)
    },

    onCancel: async function () {
        this.setData({ submitLoading: true })
        await Dialog.confirm({
            title: "取消维修",
            message: "您确定要取消当前维修吗？此操作不可逆。"
        })
            .then(async () => {
                let res = await cancelService(this.data.serviceEventId)
                console.log(res)
                wx.navigateBack({ delta: 0 })  // 返回上一页
            })
            .catch((err) => { })  // 点取消啥都不做
        this.setData({ submitLoading: false })
    },

    onSave: async function () {
        // 尝试解决维修单神秘消失的问题
        if (this.data.draft === false) return;
        this.setData({ submitLoading: true })
        await submitDraft(this.data)
            .catch((err) => {
                Notify({ type: "danger", message: err.errMsg })
                this.setData({
                    submitLoading: false
                })
                throw err
            })
        this.setData({ submitLoading: false })
    },

    onAuditPass: async function () {
        if (!this.validator2.checkData(this.data)) return;
        this.setData({ submitLoading: true })
        await auditService({
            message: this.data.descriptionAdvice,
            problemSummary: this.data.problemSummary,
            result: true,
            serviceEventId: this.data.serviceEventId,
            serviceFormId: this.data.serviceFormId
        }).catch((err) => {
            this.setData({ submitLoading: false })
            throw err
        })
        this.loadService(this.data.serviceEventId)
        this.setData({ submitLoading: false })
    },

    onAuditFail: async function () {
        if (!this.validator2.checkData(this.data)) return;
        this.setData({ submitLoading: true })
        await auditService({
            message: this.data.descriptionAdvice,
            problemSummary: this.data.problemSummary,
            result: false,
            serviceEventId: this.data.serviceEventId,
            serviceFormId: this.data.serviceFormId
        }).catch((err) => {
            this.setData({ submitLoading: false })
            throw err
        })
        this.loadService(this.data.serviceEventId)
        this.setData({ submitLoading: false })
    },

    onWork: async function () {
        this.setData({ submitLoading: true })
        await workService(this.data.serviceEventId)
            .catch((err) => {
                this.setData({ submitLoading: false })
                throw err
            })
        this.loadService(this.data.serviceEventId)
        this.setData({ submitLoading: false })
    },

    onCancelWork: async function () {
        this.setData({ submitLoading: true })
        await cancelWorkService(this.data.serviceEventId)
            .catch((err) => {
                this.setData({ submitLoading: false })
                throw err
            })
        this.loadService(this.data.serviceEventId)
        this.setData({ submitLoading: false })
    },

    onComplete: async function () {
        this.setData({ submitLoading: true })
        await completeService(this.data.serviceEventId, this.data.volunteerMessage)
            .catch((err) => {
                this.setData({ submitLoading: false })
                throw err
            })
        this.loadService(this.data.serviceEventId)
        this.setData({ submitLoading: false })
    },

    onFeedBack: async function () {
        if (!this.data.userMessage) {
            Notify({ type: 'danger', message: '请填写反馈消息' })
            return
        }
        this.setData({ submitLoading: true })
        await feedbackService(this.data.serviceEventId, this.data.userMessage)
            .catch((err) => {
                this.setData({ submitLoading: false })
                throw err
            })
        this.loadService(this.data.serviceEventId)
        this.setData({ submitLoading: false })
        Notify({ type: 'success', message: '反馈成功' })
    },

    activityClick: async function () {
        if (this.data.disableEdit) {
            return
        }

        this.setData({
            activityShow: true,
            activityLoading: true
        })

        // 加载activity 感谢pjy
        let currentTime = formatTime(new Date())
        let incomingActivityList = await getIncomingActivities(currentTime)
            .catch((err) => {
                this.activityClose()
                throw err
            })
        let currentActivityList = await getCurrentActivities(currentTime)
            .catch((err) => {
                this.activityClose()
                throw err
            })
        console.log(incomingActivityList, currentActivityList)
        incomingActivityList.push(...currentActivityList)
        this.setData({
            activityList: incomingActivityList
        })
        let incomingActivityNames = []
        for (let activity of incomingActivityList) {
            incomingActivityNames.push(activity.activityName)
        }
        this.setData({
            activityNames: incomingActivityNames,
            activityLoading: false
        })
    },
    activityConfirm: async function (event) {
        const { picker, value, index } = event.detail;
        this.setData({
            activityName: value,
            activityId: this.data.activityList[index].id,
            activityShow: false
        });
    },
    activityClose: async function () {
        this.setData({
            activityShow: false
        });
    },

    timeslotClick: async function () {
        if (this.data.disableEdit) {
            return
        }

        if (!this.data.activityName) {
            Notify({ type: 'danger', message: '请先选择活动' })
            return
        }
        this.setData({
            timeslotShow: true,
            timeslotLoading: true
        })

        // 加载timeslot 感谢pjy
        let incomingTimeSlots = await getActivitySlot(this.data.activityId)
            .catch((err) => {
                this.timeslotClose()
                throw err
            })
        this.setData({
            timeslotList: incomingTimeSlots
        })
        let incomingTimeSlotNames = []
        for (let timeslot of incomingTimeSlots) {
            incomingTimeSlotNames.push(timeslot.startTime + ' - ' + timeslot.endTime)
        }
        this.setData({
            timeslotNames: incomingTimeSlotNames,
            timeslotLoading: false
        })
    },
    timeslotConfirm: async function (event) {
        const { picker, value, index } = event.detail;
        this.setData({
            startTime: this.data.timeslotList[index].startTime,
            endTime: this.data.timeslotList[index].endTime,
            timeSlot: this.data.timeslotList[index].timeSlot,
            timeslotShow: false
        });
    },
    timeslotClose: async function () {
        this.setData({
            timeslotShow: false
        });
    },

    calenderClick() {
        if (this.data.disableEdit) {
            return
        }
        this.setData({
            calenderShow: true
        })
        console.log(this.data)
    },
    // 日期选择相关
    calenderConfirm: function (event) {
        let currDate = new Date(event.detail)
        // 将currDate做了神奇的处理，输出年月
        this.setData({
            calenderShow: false,
            boughtTime: formatTime(currDate).split(' ')[0],
            boughtMonth: formatTime(currDate).split(' ')[0].split('-').slice(0, 2).join('-')
        });
    },
    calenderClose: function () {
        this.setData({
            calenderShow: false
        });
    },

    gpuSwitch: function ({ detail }) {
        this.setData({
            hasDiscreteGraphics: detail,
        })
        if (detail) {
            this.setData({
                graphicsModel: '',
            })
        } else {
            this.setData({
                graphicsModel: '没有独立显卡',
            })
        }
    },

    warrantySwitch: function ({ detail }) {
        this.setData({
            underWarranty: detail,
        })
    },

    typeClick: function () {
        if (this.data.disableEdit) {
            return
        }
        this.setData({
            typeShow: true
        })
    },
    typeConfirm: function (event) {
        const { picker, value, index } = event.detail;
        this.setData({
            laptopType: value,
            typeShow: false
        })
    },
    typeClose: function () {
        this.setData({
            typeShow: false
        })
    },

    problemClick: function () {
        if (this.data.disableEdit) {
            return
        }
        this.setData({
            problemShow: true
        })
    },
    problemConfirm: function (event) {
        const { picker, value, index } = event.detail;
        this.setData({
            problemType: value,
            problemShow: false
        })
    },
    problemClose: function () {
        this.setData({
            problemShow: false
        })
    },

    uploadConfirm: async function (event) {
        let imagesChosen = event.detail.file
        if (typeof (imagesChosen) == 'undefined' || !imagesChosen) {
            throw { "errCode": 40000, "errMsg": "[uploadConfirm] event.detail contains no file" }
        }
        for (let image of imagesChosen) {
            let res = await uploadImage(image.url)
            // 更新imagesToUpload
            const { imagesToUpload = [] } = this.data;
            imagesToUpload.push({ ...image, url: app.globalData.baseURL + '/img/' + res });
            this.setData({ imagesToUpload });
            console.log(imagesToUpload)
            // 更新imageList
            const { imageList = [] } = this.data;
            imageList.push(res);
            this.setData({ imageList });
        }
    },
    uploadCancel: async function (event) {
        if (this.data.disableEdit) return;
        let imageToDelete = event.detail.index
        const { imagesToUpload = [] } = this.data;
        imagesToUpload.splice(imageToDelete, 1)
        this.setData({ imagesToUpload });
        // 更新imageList
        const { imageList = [] } = this.data;
        await deleteImage(imageList[imageToDelete])  // 删除图片
        imageList.splice(imageToDelete, 1)
        this.setData({ imageList });
    },
    uploadOversize: function () {
        Notify({ type: 'danger', message: '图片大小超出限制' })
    },

    // helpClick在模拟器上的结果和真机区别很大，建议以真机为准
    helpClick: async function (event) {
        if (!this.data.helpMessage || this.data.helpMessageContent !== 'help') {
            Toast.loading({ // 加载并渲染为wxml可能需要一些时间，因此采用Toast避免用户误操作
                message: '加载中...',
                forbidClick: true,
            });
            const helpMsg = await getMarkdownWxml('https://shuwashuwa.kinami.cc/help.md')
            this.setData({
                helpShow: true,
                helpMessage: helpMsg,
                helpMessageContent: 'help'
            })
        } else {
            this.setData({ helpShow: true })
        }
    },

    helpClose: async function (event) {
        // 提示用户点击的内容 放到popup里
        // Notify({type:'success', message:'为了便于您获知维修的进展情况，我们需要向您发送消息'})
        // 要求微信订阅消息授权
        await requestSubscription(this.data.tmplIDs).catch((err) => { }) // ignore errors
        this.setData({ helpShow: false })
    },

    initValidator: function () {
        this.validator = new WeValidator({
            // onMessage可以修改验证不通过时的行为，默认为toast
            /*
            data 参数
            {
                msg, // 提示文字
                name, // 表单控件的 name
                value, // 表单控件的值
                param // rules 验证字段传递的参数
            }
            */
            onMessage: function (data) {
                console.log(data)
                Notify({ type: 'danger', message: data.msg })
            },
            rules: {
                activityId: { required: true },
                boughtTime: { required: true },
                brand: { required: true },
                computerModel: { required: true },
                cpuModel: { required: true },
                graphicsModel: { required: true },
                hasDiscreteGraphics: { required: true },
                laptopType: { required: true },
                problemDescription: { required: true },
                problemType: { required: true },
                serviceEventId: { required: true },
                timeSlot: { required: true },
                underWarranty: { required: true },
            },
            messages: {
                activityId: { required: '请选择活动' },
                boughtTime: { required: '请选择购买时间(不用很精确)' },
                brand: { required: '请填写品牌' },
                computerModel: { required: '请填写型号' },
                cpuModel: { required: '请填写CPU型号' },
                graphicsModel: { required: '请填写独立显卡型号' },
                hasDiscreteGraphics: { required: 'Switch状态为null' },
                laptopType: { required: '请选择电脑类型' },
                problemDescription: { required: '请填写故障描述' },
                problemType: { required: '请选择故障类型' },
                serviceEventId: { required: 'serviceEventIdError' },
                timeSlot: { required: '请选择时段' },
                underWarranty: { required: 'Switch状态为null' },
            },
        })
        this.validator2 = new WeValidator({
            // onMessage可以修改验证不通过时的行为，默认为toast
            /*
            data 参数
            {
                msg, // 提示文字
                name, // 表单控件的 name
                value, // 表单控件的值
                param // rules 验证字段传递的参数
            }
            */
            onMessage: function (data) {
                console.log(data)
                Notify({ type: 'danger', message: data.msg })
            },
            rules: {
                descriptionAdvice: { required: true },
                problemSummary: { required: true },
            },
            messages: {
                descriptionAdvice: { required: '请填写审核消息' },
                problemSummary: { required: '请填写故障' },
            },
        })
    },

    // id >= 0 加载现有service
    // id < 0 创建service
    loadService: async function (id) {
        let curr_service = null;
        if (id >= 0) {  // 加载维修单, 如果不是自己的维修单不开启编辑
            curr_service = await getService(id)
            if (curr_service.userId === app.globalData.userId && curr_service.draft) { this.setData({ disableEdit: false }) }
            else { this.setData({ disableEdit: true }) }
        } else {  // id 为空 新建维修单,默认开启编辑
            curr_service = await createService()
            this.setData({
                disableEdit: false
            })
        }
        console.log(curr_service)
        // 同步事件中最后一张维修单
        let lastForm = curr_service.serviceForms[curr_service.serviceForms.length - 1]
        this.setData(lastForm)
        this.setData({
            serviceFormId: lastForm.formID,
        })
        // 解决没有独显型号的问题
        this.setData({
            draft: curr_service.draft,
            serviceEventId: curr_service.id,
            activityId: curr_service.activityId,
            activityName: curr_service.activityName,
            endTime: curr_service.endTime,
            startTime: curr_service.startTime,
            problemSummary: curr_service.problemSummary,
            status: curr_service.status,
            graphicsModel: (this.data.graphicsModel ? this.data.graphicsModel : '没有独立显卡'),
            hasDiscreteGraphics: (this.data.hasDiscreteGraphics === null ? false : this.data.hasDiscreteGraphics),
            underWarranty: (this.data.underWarranty === null ? false : this.data.underWarranty)
        })

        // 处理一些中间变量
        this.setData({
            boughtMonth: this.data.boughtTime ? this.data.boughtTime.split('-').slice(0, 2).join('-') : ''
        })

        // 加载images, 避免填写完成后图片加载两遍
        this.setData({
            imagesToUpload: []
        })
        if (this.data.imageList) {
            for (let imagePath of this.data.imageList) {
                const { imagesToUpload = [] } = this.data;
                imagesToUpload.push({
                    name: imagePath,
                    thumb: app.globalData.baseURL + '/img/100_' + imagePath,
                    url: app.globalData.baseURL + '/img/' + imagePath,
                    isImage: true
                });
                this.setData({ imagesToUpload });
            }
        }

        // 可以编辑,创建新维修或者是自己的维修
        if (curr_service.userId === app.globalData.userId) {
            this.setData({
                editable: true,
                auditable: false,
                workable: false
            })
        }
        // 可以接单,不能自己接自己
        if (app.globalData.userInfo.volunteer && curr_service.userId !== app.globalData.userId) {
            this.setData({
                editable: false,
                workable: true
            })
        }
        // 可以审核,不能自己审自己
        if (app.globalData.userInfo.admin && curr_service.userId !== app.globalData.userId) {
            this.setData({
                editable: false,
                auditable: true
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        console.log(options)
        // 微信这options也太神秘了, 是string型的undefined
        if (options.id != "undefined") {  // 加载维修单, 默认不开启编辑
            this.loadService(options.id)
        } else {  // id 为空 新建维修单,默认开启编辑
            this.loadService(-1)
        }
        // 如果在订阅时加载模板列表，无法调用订阅(认为不是由tap触发的,不知道为啥)
        this.setData({
            tmplIDs: await getTemplateIDs()
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.initValidator()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.onSave()
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        this.onSave()
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

    }
})