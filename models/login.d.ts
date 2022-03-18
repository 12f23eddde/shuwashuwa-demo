/** SuperAdmin login credential */
export interface SALogin {
    userName: string,
    password: string
}

export interface LoginRes {
    token: string,
    isFirstlogin: boolean
}