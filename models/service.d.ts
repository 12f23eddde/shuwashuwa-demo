// 12f23eddde - Mar 1 2021
// requires admin privilege

export interface ServiceEvent {
    activityName: string,
    closed: boolean,
    computerModel: string,
    createTime: string,
    draft: boolean,
    endTime: string,
    problemSummary: string,
    serviceEventId: number,
    startTime: string,
    status: ServiceStatus,
    userName: string,
    volunteerName: string
}

export interface ServiceForm {
    activityId: number,
    boughtTime: string,
    brand: string,
    computerModel: string,
    cpuModel: string,
    descriptionAdvice: string,
    formID: number,
    graphicsModel: string,
    hasDiscreteGraphics: boolean,
    imageList: string[],
    laptopType: string,
    problemDescription: string,
    problemType: string,
    replyAdminId: number,
    timeSlot: number,
    underWarranty: boolean
}

export interface ServiceEventDetail extends ServiceEvent {
    activityId: number,
    feedback: string,
    id: number,
    repairingResult: string,
    serviceForms: ServiceForm[],
    timeSlot: number,
    userId: number,
    volunteerEmail: string,
    volunteerId: number,
    volunteerPhoneNumber: string
}

// ref: http://shuwashuwa.kinami.cc:8848/doc.html#/Released/event-controller/getServiceEventListUsingGET
/** all attributes are optional */
export interface ServiceQuery {
    activity?: number,
    client?: number,
    closed?: boolean,
    createLower?: string,
    createUpper?: string,
    draft?: boolean,
    status?: ServiceStatus,
    volunteer?: number
}

/**  0:等待用户编辑 1:等待管理员审核 2:审核通过（待签到） 3:等待志愿者接单 4:维修中 5:维修完成 */
export enum ServiceStatus {
    TOEDIT,
    TOAUDIT,
    PASSED,
    TOWORK,
    WORKING,
    FINISHED
}

export interface ServiceAudit {
    message: string,
    problemSummary: string,
    result: boolean,
    serviceEventId: number,
    serviceFormId: number,
}

export interface ServiceComplete {
    message: string,
    serviceEventId: number,
}

export interface ServiceFeedback {
    message: string,
    serviceEventId: number,
}