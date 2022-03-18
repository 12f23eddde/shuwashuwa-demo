import type { ServiceEvent, ServiceEventDetail, ServiceForm, ServiceQuery, ServiceAudit, ServiceComplete, ServiceFeedback } from "../models/service";
import { request } from "./request";

/* everyone */

/**
 * 列出满足指定筛选条件的维修事件 (普通用户只能查看自己发起的维修)
 * @param query ServiceQuery
 * @returns Promise<ServiceEvent[]>
 */
export const getServiceEventList = (query?: ServiceQuery) => {
    return request<ServiceEvent[]>("/api/service/", "GET", query);
}

/**
 * 统计满足条件的维修事件数量 (没有权限限制)
 * @param query ServiceQuery
 * @returns Promise<number>
 */
export const getServiceEventCount = (query?: ServiceQuery) => {
    return request<string>("/api/service/count", "GET", query);
}

/**
 * 获取一次维修事件的详情
 * @param serviceId 维修事件ID
 * @returns Promise<ServiceEventDetail>
 */
export const getServiceEventDetail = (serviceId: number) => {
    return request<ServiceEventDetail>("/api/service/detail", "GET", { id: serviceId });
}

/* user */

/**
 * 创建维修事件
 * @returns Promise<ServiceEventDetail> 返回仅包含一个空白草稿的维修事件
 */
export const createServiceEvent = () => {
    return request<ServiceEventDetail>("/api/service/", "POST");
}

/**
 * 中止维修事件，取消预订 会将维修事件的closed标记置为true
 * @param serviceId 维修事件ID
 * @returns Promise<void>
 */
export const cancelServiceEvent = (serviceId: number) => {
    return request<string>(`/api/service?eventID=${serviceId}`, "DELETE");
}

/**
 * 提交维修单
 * @param service 维修事件
 * @returns Promise<string>
 */
export const submitServiceEvent = (service: ServiceForm) => {
    return request<string>("/api/service/commit", "POST", service);
}

/** 将维修单存储至本地 只保存最近的一份
 * @param service 维修事件
 * @returns Promise<void>
 */
export const saveServiceDraft = (service: ServiceForm) => {
    wx.setStorageSync('draft', service);
}

/** 从本地加载维修单草稿 */
export const getServiceDraft = () => {
    return wx.getStorageSync('draft') as ServiceForm;
}

/**
 * 保存维修单草稿到服务器
 * @param service 维修事件
 * @returns Promise<string>
 */
export const submitServiceDraft = (service: ServiceForm) => {
    return request<string>("/api/service/draft", "PUT", service);
}

/**
 * 用户对维修进行反馈
 * @param feedback 维修反馈
 * @returns Promise<string>
 */
export const feedbackServiceEvent = (feedback: ServiceFeedback) => {
    return request<string>("/api/service/feedback", "PUT", feedback);
}

/* admin */

export const auditServiceEvent = (audit: ServiceAudit) => {
    return request<string>("/api/service/audit", "PUT", audit);
}

/* volunteer */

export const completeServiceEvent = (complete: ServiceComplete) => {
    return request<string>("/api/service/complete", "PUT", complete);
}

export const takeServiceEvent = (serviceId: number) => {
    return request<string>(`/api/service/work?eventID=${serviceId}`, "PUT");
}

export const returnServiceEvent = (serviceId: number) => {
    return request<string>(`/api/service/work?eventID=${serviceId}`, "DELETE");
}