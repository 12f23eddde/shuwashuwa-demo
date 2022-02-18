// 12f23eddde - Mar 1 2021
// requires admin privilege

export interface ServiceEvent {
    /** 参加的活动的名称 */
    activityName: string,
    /** 是否关闭 */
    closed: boolean,
    /** 电脑型号 */
    computerModel: string,
    /** 维修事件创建时间，以yyyy-MM-dd HH:mm:ss表示 */
    createTime: string,
    /** 是否有草稿状态的维修单 */
    draft: boolean,
    /** 预约时间段的结束时间，以yyyy-MM-dd HH:mm:ss表示 */
    endTime: string,
    /** 问题概括 */
    problemSummary: string,
    /** 维修事件id */
    serviceEventId: number,
    /** 预约时间段的开始时间，以yyyy-MM-dd HH:mm:ss表示 */
    startTime: string,
    /** 维修事件状态 */
    status: ServiceStatus,
    /** 发起维修申请的用户姓名 */
    userName: string,
    /** 接单的志愿者姓名 */
    volunteerName: string
}

export interface ServiceForm {
    /** 选择的活动序号 */
    activityId: number,
    /** 购买日期，用yyyy-mm表示,示例值(1919-08) */
    boughtTime: string,
    /** 电脑品牌 */
    brand: string,
    /** 电脑型号 */
    computerModel: string,
    /** cpu型号 */
    cpuModel: string,
    /** 审核意见 */
    descriptionAdvice?: string,
    /** 维修表单ID */
    formID?: number,
    /** 显卡型号 */
    graphicsModel: string,
    /** 是否有独立显卡 */
    hasDiscreteGraphics: boolean,
    /** 图片文件名列表（图片应已调用相关接口上传） */
    imageList: string[],
    /** 笔记本类型 */
    laptopType: string,
    /** 问题描述 */
    problemDescription: string,
    /** 问题种类--硬件or软件 */
    problemType: string,
    /** 审核维修单的管理员Id */
    replyAdminId?: number,
    /** 选择的活动时间段 */
    timeSlot: number,
    /** 是否在保修期内 */
    underWarranty: boolean
}

export interface ServiceEventDetail extends ServiceEvent {
    /** 参加的活动的id */
    activityId: number,
    /** 用户反馈 */
    feedback: string,
    /** 维修事件id */
    id: number,
    /** 由志愿者填写的维修结果 */
    repairingResult: string,
    /** 用户提交的历史维修单 */
    serviceForms: ServiceForm[],
    /** 预约的时间段 */
    timeSlot: number,
    /** 发起维修申请的用户id */
    userId: number,
    /** 接单的志愿者的邮件地址 */
    volunteerEmail: string,
    /** 接单的志愿者的志愿者id */
    volunteerId: number,
    /** 接单的志愿者的电话号码 */
    volunteerPhoneNumber: string
}

// ref: http://shuwashuwa.kinami.cc:8848/doc.html#/Released/event-controller/getServiceEventListUsingGET
/** all attributes are optional */
export interface ServiceQuery {
    /** 报名的活动id */
    activity?: number,
    /** 创建维修事件的用户id，若发起请求的用户无特殊权限，该项被强制赋值为本人id */
    client?: number,
    /** 维修事件是否关闭 */
    closed?: boolean,
    /** 创建时间下界，以yyyy-MM-dd HH:mm:ss表示 */
    createLower?: string,
    /** 创建时间上界，以yyyy-MM-dd HH:mm:ss表示 */
    createUpper?: string,
    /** 是否有云端保存的草稿 */
    draft?: boolean,
    /** 该次维修处于的状态 */
    status?: ServiceStatus,
    /** 接单的志愿者id */
    volunteer?: number
}


export enum ServiceStatus {
    /** 0:等待用户编辑  */
    TOEDIT,
    /** 1:等待管理员审核  */
    TOAUDIT,
    /** 2:审核通过（待签到） */
    PASSED,
    /** 3:等待志愿者接单 */
    TOWORK,
    /** 4:维修中 */
    WORKING,
    /** 5:维修完成 */
    FINISHED
}

export interface ServiceAudit {
    /** 审核不通过的原因，或想对用户说的话,示例值(记得把电脑带过来) */
    message: string,
    /** 对电脑问题的简要概括,示例值(重装系统) */
    problemSummary: string,
    /** 是否审核通过 */
    result: boolean,
    /** 审核的维修事件ID */
    serviceEventId: number,
    /** 审核的维修单ID */
    serviceFormId: number,
}

export interface ServiceComplete {
    /** 反馈消息 */
    message: string,
    /** 维修事件id */
    serviceEventId: number,
}

export interface ServiceFeedback {
    /** 反馈消息 */
    message: string,
    /** 维修事件id */
    serviceEventId: number,
}