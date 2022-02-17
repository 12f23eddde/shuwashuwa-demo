import type { User } from "../models/user";
import { request } from "./request";

export const getCurrentUserInfo = () => {
    return request<User>("/api/user/info", "GET");
}

export const updateCurrentUserInfo = (userinfo: User) => {
    return request<string>("/api/user/info", "PUT", userinfo);
}

export const getTemplateIDs = () => {
    return request<string[]>("/api/user/notice", "GET");
}