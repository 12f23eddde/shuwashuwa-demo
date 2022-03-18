// import observe from '../miniprogram_npm/minii/api/observe'
import { observe } from 'minii'
import type { User } from '../models/user';

class UserStore {
    user: User | null;
    isLoggedIn: boolean;
    token: string;

    constructor() {
        this.user = null;
        this.isLoggedIn = false;
        this.token = '';
    }

    setToken(token: string) {
        this.token = token;
        this.isLoggedIn = true;
    }

    unsetToken() {
        this.token = '';
        this.isLoggedIn = false;
    }

    setUser(user: User) {
        this.user = user;
        this.isLoggedIn = true;
    }
}

interface UserStoreGuarded {
    readonly user: User | null;
    readonly isLoggedIn: boolean;
    readonly token: string;

    setToken(token: string): void;
    unsetToken(): void;
    setUser(user: User): void;
}

export const userStore = observe(new UserStore(), 'user') as UserStoreGuarded;