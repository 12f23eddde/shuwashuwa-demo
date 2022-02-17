import { request } from "../api_new/request"
import type { User } from "../models/user";

import type { Application, ApplicationQuery, ApplicationSubmission } from "../models/volunteer";

/* admin */

const getVolunteerInfo = async (userId: number) => {
    return request<User>("/api/volunteer", "GET", { userID: userId });
}

const getVolunteerList = async () => {
    return request<User[]>("/api/volunteer/list", "GET");
}

const auditApplication = async (application: Application) => {
    return request<string>("/api/volunteer/application", "PUT", application);
}

const addVolunteer = async (userInfo: User) => {
    return request<string>("/api/volunteer", "POST", userInfo);
}

const deleteVolunteer = async (userId: number) => {
    return request<string>("/api/volunteer", "DELETE", { userID: userId });
}

const updateVolunteer = async (userInfo: User) => {
    return request<string>("/api/volunteer", "PUT", userInfo);
}

/* volunteer */

const getApplicationList = async (query?: ApplicationQuery) => {
    return request<Application[]>("/api/volunteer/application", "GET", query);
}

const submitApplication = async (submission: ApplicationSubmission) => {
    return request<string>("/api/volunteer/application", "POST", submission);
}

const getVolunteerId = async () => {
    return request<string>("/api/volunteer/id", "GET");
}