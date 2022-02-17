/** timeslot (timeSlot: int >=0) */
export interface TimeSlot {
    timeSlot: number,
    startTime: string,
    endTime: string
}

/** activity (datetime as string) */
export interface Activity {
    activityId?: number,
    activityName: string,
    startTime: string,
    endTime: string,
    location: string,
    timeSlots: TimeSlot[]
}

export interface ActivityInfo {
    id: number,
    createTime: string,
    updatedTime: string
    activityName: string,
    startTime: string,
    endTime: string,
    location: string,
    status: number
}

export interface ActivityQuery {
    startLower?: string,
    startUpper?: string,
    endLower?: string,
    endUpper?: string
}