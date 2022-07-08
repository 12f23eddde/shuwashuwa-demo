import { formatDate } from '../../utils/date'
import { getApplicationList, getVolunteerId } from '../../api_new/volunteer'
import { getServiceEventCount, getServiceEventList } from '../../api_new/service'
import { getActivityList, attendActivity } from '../../api_new/activity'

import { globalStore } from '../../stores/global'
import { userStore } from '../../stores/user'
import type { ServiceQuery, ServiceEvent } from '../../models/service'
import type { ActivityInfo, ActivityQuery } from '../../models/activity'
import type { Application, ApplicationQuery } from '../../models/application'

import { ensureUserInfo } from '../../utils/shuwashuwa'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

import { serviceStatusText } from '../../utils/shuwashuwa'
import { emitErrorToast } from '../../utils/ui'
import { getCurrentUserInfo } from '../../api_new/user'

Page({
    /**
     * Page watched data
     */
    data: {
        // activities
        /** 即将开始的活动 */
        incomingActivities: [] as ActivityInfo[],
        /** 当前活动 */
        currentActivities: [] as ActivityInfo[],
        activitiesLoading: false,

        // services
        /** 我发起的进行中维修单 */
        activeServices: [] as ServiceEvent[],
        /** 我正在编辑的维修单数 */
        inEditServiceCount: -1,
        myServicesLoading: false,
        /** 我接单的维修单 */
        workingServices: [] as ServiceEvent[],

        /** 需要审核的维修单数 */
        inAuditServiceCount: -1,
        inAuditServiceCountLoading: false,

        /** 需要接单的维修单数 */
        inAcceptServiceCount: -1,
        inAcceptServiceCountLoading: false,

        // applications
        /** 我的志愿者申请 */
        myApplication: null as Application | null,
        applicationsLoading: false,
        /** 需要审核的志愿者申请 */
        inAuditApplicationCount: -1,
        inAuditApplicationCountLoading: false,

        activityTabActive: 0,
        serviceTabActive: 0,
    },

    /** 载入进行中的活动 */
    getActivitiesAsync: async function () {
        this.setData({
            activitiesLoading: true
        })
        try {
            const options: ActivityQuery = {
                endLower: formatDate(new Date()),
            }
            console.log('getActivitiesAsync', options)
            const activities = await getActivityList(options)
            console.log('incoming activities refreshed', activities)
            if (!activities) {
                throw new Error('获取活动列表失败')
            }
            this.setData({
                incomingActivities: activities.filter(a => Date.parse(a.startTime) > Date.now()),
                currentActivities: activities.filter(a => Date.parse(a.startTime) <= Date.now()),
            })
        } catch (e) {
            console.error(e)
        } finally {
            this.setData({
                activitiesLoading: false
            })
        }
    },

    /** 获取我发起的维修单 */
    getMyServicesAsync: async function () {
        this.setData({
            myServicesLoading: true
        })
        try {
            const userId = userStore.user?.userid;
            const options: ServiceQuery = {
                client: userId,
                closed: false,
            }
            console.log('get my services', options)
            const myServices = await getServiceEventList(options)
            console.log('my services refreshed', myServices)
            if (!myServices) {
                throw new Error('获取维修单列表失败')
            }
            // active services
            const myActiveServices = myServices.filter(s => [0, 1, 2, 3, 4].includes(s.status)) // 不显示被删除的维修单
            this.setData({
                activeServices: myActiveServices,
            })
            // inedit services
            const inEditServiceCount = myServices.filter(s => s.status === 1).length
            this.setData({
                inEditServiceCount,
            })
        } catch (e) {
            console.error(e)
        } finally {
            this.setData({
                myServicesLoading: false
            })
        }
    },

    /** 我接单的维修单 */
    getWorkingServicesAsync: async function () {
        if (!userStore.user?.volunteer){
            return
        }
        this.setData({
            myServicesLoading: true
        })
        try {
            const volunteerId = Number(await getVolunteerId())
            const options: ServiceQuery = {
                volunteer: volunteerId,
                closed: false,
                status: 4
            }

            const workingServices = await getServiceEventList(options)
            console.log('working services refreshed', workingServices)
            if (!workingServices) {
                throw new Error('获取维修单列表失败')
            }
            this.setData({
                workingServices,
            })
    
        } catch (e: any) {
            emitErrorToast(e)
        } finally {
            this.setData({
                myServicesLoading: false
            })
        }
    },

    /** 载入当前活动待审核的维修单数 (管理员) */
    getInAuditServiceCountAsync: async function () {
        if (!userStore.user?.admin) {
            return
        }
        if (!this.data.currentActivities.length) {
            return
        }
        this.setData({
            servicesLoading: true
        })
        try {
            let count = 0
            for (let activity of this.data.currentActivities) {
                const options: ServiceQuery = {
                    activity: activity.id,
                    status: 1,
                    closed: false,
                }
                count += Number(await getServiceEventCount(options))
            }
            console.log('inAuditServiceCount refreshed', count)
            this.setData({
                inAuditServiceCount: count,
            })
        } catch (e: any) {
            emitErrorToast(e)
        } finally {
            this.setData({
                servicesLoading: false
            })
        }
    },

    /** 载入当前活动待接单的维修单数（志愿者） */
    getInAcceptServiceCountAsync: async function () {
        if (!userStore.user?.volunteer) {
            return
        }
        if (!this.data.currentActivities.length) {
            return
        }
        this.setData({
            inAcceptServiceCountLoading: true
        })
        try {
            let count = 0
            for (let activity of this.data.currentActivities) {
                const options: ServiceQuery = {
                    activity: activity.id,
                    status: 3,
                    closed: false,
                }
                count += Number(await getServiceEventCount(options))
            }
            console.log('inAcceptServiceCount refreshed', count)
            this.setData({
                inAcceptServiceCount: Number(count),
            })
        } catch (e) {
            console.error(e)
        } finally {
            this.setData({
                inAcceptServiceCountLoading: false
            })
        }
    },

    /** 载入我的志愿者申请 */
    getMyApplicationAsync: async function () {
        if (userStore.user?.volunteer) {
            return
        }
        this.setData({
            applicationsLoading: true,
        })
        try {
            const options: ApplicationQuery = {
                userId: userStore.user?.userid,
            }
            const applications = await getApplicationList(options)
            // 同时不应有多个申请
            console.log('applications refreshed', applications)
            if (!applications) {
                throw new Error('获取志愿者申请列表失败')
            }
            if (applications.length > 0) {
                this.setData({
                    myApplication: applications[applications.length - 1],
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

    /** 载入待审核的志愿者申请数 (管理员) */
    getInAuditApplicationCountAsync: async function () {
        if (!userStore.user?.admin) {
            return
        }
        this.setData({
            applicationsLoading: true
        })
        try {
            const options: ApplicationQuery = {
                status: 0,
            }
            const applications = await getApplicationList(options);
            console.log('active applications refreshed', applications)
            if (!applications) {
                throw new Error('获取志愿者申请列表失败')
            }
            const count = applications.length
            this.setData({
                inAuditApplicationCount: count,
            })
        } catch (e) {
            console.error(e)
        } finally {
            this.setData({
                applicationsLoading: false
            })
        }
    },

    /** 在活动中签到 */
    attendActivityAsync: async function (activityId: number) {
        try {
            const res = await attendActivity(activityId)
            console.log('attend activity', res)
            Toast.success('签到成功')
        } catch (e) {
            console.error(e)
            Toast.fail('签到失败')
        }
    },

    /** 刷新用户信息 */
    refreshUserInfoAsync: async function () {
        try {
            const user = await getCurrentUserInfo()
            console.log('user refreshed', user)
            if (!user) {
                throw new Error('获取用户信息失败')
            }
            userStore.setUser(user)
            /** 重新进入 */
            if (user.volunteer) {
                wx.reLaunch({
                    url: '/pages/index/index',
                })
            }
        } catch (e) {
            console.error(e)
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options: Record<string, string>) {
        // 签到
        // wechat converts undefined to 'undefined'
        if (typeof (options?.activity) !== 'undefined' && options.activity !== 'undefined') {
            try {
                const activityId = Number(options.activity);
                await this.attendActivityAsync(activityId);
            } catch (e) {
                console.error(e)
            }
        }

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
        // 获取参数
        const tabParams = globalStore.getAndUnsetTabParams()

        // 获取用户信息
        await ensureUserInfo();
        console.log(userStore.user)

        this.getActivitiesAsync() // 加载活动列表
            .then(() => {
                this.getInAuditServiceCountAsync() // 加载待审核的维修单数
                this.getInAcceptServiceCountAsync() // 加载待接单的维修单数
            })

        this.getMyServicesAsync() // 加载我的维修单
        this.getWorkingServicesAsync() // 加载接单维修单
        this.getMyApplicationAsync() // 加载我的志愿者申请
        this.getInAuditApplicationCountAsync() // 加载待审核的志愿者申请数
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

    goToActivityServiceList: function (e: any) {
        const activityId = e.currentTarget.dataset.id as number;
        globalStore.setTabParams({
            activity: activityId,
        })
        console.log('go to activity services', activityId)
        wx.switchTab({
            url: '/pages/service-list/service-list'
        })
    },

    goToStatusServiceList: function (e: any) {
        const status = e.currentTarget.dataset.status as number;
        globalStore.setTabParams({
            status: status,
        })
        console.log('go to status services', status)
        wx.switchTab({
            url: '/pages/service-list/service-list'
        })
    },

    goToServiceDetail: function (e: any) {
        const serviceId = e.currentTarget.dataset.id as number;
        wx.navigateTo({
            url: '/pages/service-detail/service-detail?id=' + serviceId,
        })
    },

    goToApplicationList: function (e: any) {
        wx.navigateTo({
            url: '/pages/application-list/application-list',
        })
    },
})