import base64 from 'base64-utf8';

interface TokenObj {
    iat: string,
    exp: number,
    userid: number,
}

// eval() is disabled by tencent... wtf
export const parseToken = (token: string) => {
    token = String(token);
    const splitString = token.split('.')[1]
    const encodedString = base64.decode(splitString)
    return JSON.parse(encodedString) as TokenObj;
}