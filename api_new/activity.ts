import { request } from "../api_new/request"
import type { Activity, ActivityInfo, ActivityQuery, TimeSlot } from "../models/activity";

export const getActivityList = async (query?: ActivityQuery) => {
    return request<ActivityInfo[]>("/api/activity", "GET", query);
}

export const getActivityTimeSlots = async (activityid: number) => {
    return request<TimeSlot[]>("/api/activity/slot", "GET", { activity: activityid });
}

export const attendActivity = async (activityid: number) => {
    return request<string>("/api/activity/attend", "POST", { activity: activityid });
}

export const hasAttendedActivity = async (activityid: number) => {
    return request<string>("/api/activity/attend", "GET", { activity: activityid });
}