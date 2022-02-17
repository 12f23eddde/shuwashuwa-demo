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
    userid: number,
    userName: string,
    studentId: string,
    phoneNumber: string,
    identity: string,
    email: string,
    department: string
}

export type Volunteer = User | { volunteerId: number }