/**
 * Common response type
 * Skip type checking for data
 */

type IAnyObject = {[key: string]: any};

export interface CommonResponse<
T extends string | IAnyObject | ArrayBuffer =
    | string
    | IAnyObject
    | ArrayBuffer
> {
    code: number,
    message: string,
    data: T
}