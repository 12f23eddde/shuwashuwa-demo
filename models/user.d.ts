// {
//     "department": "",
//     "email": "",
//     "identity": "",
//     "phoneNumber": "",
//     "studentId": "",
//     "userName": "",
//     "userid": 0
// }

/** (userid or userId?) */
export interface User {
    /** 用户ID */
    userid?: number,
    /** 用户姓名 */
    userName: string,
    /** 学号 */
    studentId: string,
    /** 用户手机号 */
    phoneNumber: string,
    /** 用户身份 */
    identity: string,
    /** 用户邮箱 */
    email: string,
    /** 用户所在部门 */
    department: string,
    /** 是否是管理员 */
    admin?: boolean,
    /** 是否是志愿者 */
    volunteer?: boolean,
}

export type Volunteer = User | { volunteerId: number }