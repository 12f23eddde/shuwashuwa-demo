
// import observe from '../miniprogram_npm/minii/api/observe'
import { observe } from 'minii'

import type { IAnyObject } from '../models/wechatType'

class GlobalStore {
    loginMutex: boolean;
    backendUrl: string;
    tabParams: IAnyObject | null;

    constructor() {
        this.loginMutex = false;
        // 默认后端地址
        this.backendUrl = "http://shuwashuwa.kinami.cc";
        this.tabParams = null;
    }

    setBackendUrl(url: string) {
        this.backendUrl = url;
    }

    acquireLoginMutex() {
        if(this.loginMutex) return false;
        this.loginMutex = true;
        return true;
    }

    releaseLoginMutex() {
        if (!this.loginMutex) return false;
        this.loginMutex = false;
        return true;
    }

    setTabParams(data: IAnyObject){
        this.tabParams = data;
    }

    getAndUnsetTabParams(){
        const _temp = this.tabParams;
        this.tabParams = null;
        return _temp;
    }
}

interface GlobalStoreGuarded {
    readonly loginMutex: boolean;
    readonly backendUrl: string;
    setBackendUrl(url: string): void;
    acquireLoginMutex(): boolean;
    releaseLoginMutex(): boolean;
    setTabParams(data: IAnyObject): void;
    getAndUnsetTabParams(): IAnyObject;
}

export const globalStore = observe(new GlobalStore(), 'global') as GlobalStoreGuarded;