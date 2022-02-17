import type { User } from "./user";

export type Volunteer = User & { volunteerId: number };

export interface ApplicationSubmission {
    cardPicLocation: string,
    reasonForApplication: string,
}

export interface ApplicationQuery {
    adminId: number,
    status: number,
    userId: number,
}

export interface Application extends User {
    adminId?: number,
    adminName: string,
    cardPicLocation: string,
    createTime?: string,
    department: string,
    email: string,
    formId: number,
    grade?: string,
    identity: string,
    phoneNumber: string,
    reasonForApplication?: string,
    replyByAdmin: string,
    status: number,
    studentId: string,
    updatedTime?: string,
    userId: number,
    userName: string,
}