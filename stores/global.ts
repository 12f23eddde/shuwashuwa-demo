import observe from 'minii/src/api/observe';

class GlobalStore {
    loginMutex: boolean;
    backendUrl: string;

    constructor() {
        this.loginMutex = false;
        this.backendUrl = "";
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
}

interface GlobalStoreGuarded {
    readonly loginMutex: boolean;
    readonly backendUrl: string;
    setBackendUrl(url: string): void;
    acquireLoginMutex(): boolean;
    releaseLoginMutex(): boolean;
}

export const globalStore = observe(new GlobalStore(), 'global') as GlobalStoreGuarded;