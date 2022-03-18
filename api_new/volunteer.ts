import { request } from "./request"
import type { User } from "../models/user";

import type { Application, ApplicationQuery, ApplicationSubmission } from "../models/application";

/* admin */

export const getVolunteerInfo = async (userId: number) => {
    return request<User>("/api/volunteer", "GET", { userID: userId });
}

export const getVolunteerList = async () => {
    return request<User[]>("/api/volunteer/list", "GET");
}

export const auditApplication = async (application: Application) => {
    return request<string>("/api/volunteer/application", "PUT", application);
}

export const addVolunteer = async (userInfo: User) => {
    return request<string>("/api/volunteer", "POST", userInfo);
}

export const deleteVolunteer = async (userId: number) => {
    return request<string>("/api/volunteer", "DELETE", { userID: userId });
}

export const updateVolunteer = async (userInfo: User) => {
    return request<string>("/api/volunteer", "PUT", userInfo);
}

/* volunteer */

export const getApplicationList = async (query?: ApplicationQuery) => {
    return request<Application[]>("/api/volunteer/application", "GET", query);
}

export const submitApplication = async (submission: ApplicationSubmission) => {
    return request<string>("/api/volunteer/application", "POST", submission);
}

export const getVolunteerId = async () => {
    return request<string>("/api/volunteer/id", "GET");
}