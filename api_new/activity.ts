import { request } from "./request"
import type { Activity, ActivityInfo, ActivityQuery, TimeSlot } from "../models/activity";

/**
 * 根据条件筛选活动列表
 * @param query ActivityQuery
 * @returns Promise<ActivityInfo[]>
 */
export const getActivityList = async (query?: ActivityQuery) => {
    return request<ActivityInfo[]>("/api/activity", "GET", query);
}

/**
 * 查看一个活动的时间段列表
 * @param activityid 活动ID
 * @returns Promise<TimeSlot[]>
 */
export const getActivityTimeSlots = async (activityid: number) => {
    return request<TimeSlot[]>("/api/activity/slot", "GET", { activity: activityid });
}

/**
 * 用户活动现场签到
 * @param activityid 活动Id
 * @returns Promise<number> 状态改变的维修单数量
 */
export const attendActivity = async (activityid: number) => {
    return request<string>("/api/activity/attend", "PUT", { activity: activityid });
}

/**
 * 查询当前用户在某活动中是否进行有效签到
 * @param activityid 活动Id
 * @returns Promise<boolean>
 */
export const hasAttendedActivity = async (activityid: number) => {
    return request<string>("/api/activity/attend", "GET", { activity: activityid });
}