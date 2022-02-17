import type { ServiceEvent, ServiceEventDetail, ServiceQuery, ServiceAudit, ServiceComplete, ServiceFeedback } from "../models/service";
import { request } from "./request";

/* everyone */

export const getServiceEventList = (query?: ServiceQuery) => {
    return request<ServiceEvent[]>("/api/service/", "GET", query);
}

export const getServiceEventCount = (query?: ServiceQuery) => {
    return request<string>("/api/service/count", "GET", query);
}

export const getServiceEventDetail = (serviceId: number) => {
    return request<ServiceEventDetail>("/api/service/detail", "GET", { id: serviceId });
}

/* user */

export const createServiceEvent = () => {
    return request<ServiceEventDetail>("/api/service/", "POST");
}

export const cancelServiceEvent = (serviceId: number) => {
    return request<string>("/api/service/", "DELETE", { eventID: serviceId });
}

export const submitServiceEvent = (service: ServiceEventDetail) => {
    return request<string>("/api/service/", "POST", service);
}

export const submitServiceDraft = (service: ServiceEventDetail) => {
    return request<string>("/api/service/draft", "PUT", service);
}

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
    return request<string>("/api/service/work", "PUT", { eventID: serviceId });
}

export const returnServiceEvent = (serviceId: number) => {
    return request<string>("/api/service/work", "DELETE", { eventID: serviceId });
}