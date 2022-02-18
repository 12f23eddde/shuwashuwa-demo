import type { User } from "./user";

export interface ApplicationSubmission {
    /** 学生证照片的位置 */
    cardPicLocation: string,
    /** 申请理由 */
    reasonForApplication: string,
}

export interface ApplicationQuery {
    /** 目标申请表中的管理员id */
    adminId: number,
    /** 0为待审核，1为通过，2为不通过,可用值:0,1,2 */
    status: number,
    /** 目标申请表中的申请者用户id 若发起请求的用户无特殊权限，该项被强制赋值为本人id*/
    userId: number,
}

export interface Application extends User {
    /** 回复的管理员的管理员id */
    adminId?: number,
    /** 回复的管理员的姓名 */
    adminName?: string,
    /** 校园卡照片的路径 */
    cardPicLocation?: string,
    createTime?: string,
    /** 志愿者申请表id */
    formId: number,
    /** 用户填写的申请理由 */
    reasonForApplication?: string,
    /** 管理员的回复 */
    replyByAdmin: string,
    /** 管理员给出的状态,1表示通过,2表示拒绝 */
    status: number,
    /** 申请表审核时间，以yyyy-MM-dd HH:mm:ss表示 */
    updatedTime?: string,
    /** 发起申请的用户的姓名 */
    userId?: number,
}