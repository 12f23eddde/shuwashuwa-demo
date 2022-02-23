import { emitErrorToast } from "../utils/ui";
import { request } from "./request";


export const getTemplateIDs = () => {
    return request<string[]>("/api/user/notice", "GET");
}

export const requestSubscription = async (templateIDs: string[]) => {
    try {
        await wx.requestSubscribeMessage({
            tmplIds: templateIDs,
        });
    } catch (e: any) {
        emitErrorToast(e);
    }
}