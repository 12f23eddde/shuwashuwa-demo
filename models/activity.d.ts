/** timeslot (timeSlot: int >=0) */
export interface TimeSlot {
    /** 时间段序号 */
    timeSlot: number,
    /** 开始时间，以yyyy-MM-dd HH:mm:ss表示 */
    startTime: string,
    /** 结束时间，以yyyy-MM-dd HH:mm:ss表示 */
    endTime: string
}

/** activity (datetime as string) */
export interface Activity {
    /** 要更新的活动id */
    activityId?: number,
    /** 活动名称 */
    activityName: string,
    /** 开始时间，以yyyy-MM-dd HH:mm:ss表示,示例值(1926-08-17 11:45:14) */
    startTime: string,
    /** 结束时间，以yyyy-MM-dd HH:mm:ss表示,示例值(1926-08-17 11:45:14) */
    endTime: string,
    /** 活动地点 */
    location: string,
    /** 活动分段信息 */
    timeSlots: TimeSlot[]
}

export interface ActivityInfo {
    /** 活动编号 */
    id: number,
    /** 活动创建时间，以yyyy-MM-dd HH:mm:ss表示	 */
    createTime: string,
    /** 活动创建时间，以yyyy-MM-dd HH:mm:ss表示	 */
    updatedTime: string
    /** 活动名称 */
    activityName: string,
    /** 开始时间，以yyyy-MM-dd HH:mm:ss表示	 */
    startTime: string,
    /** 结束时间，以yyyy-MM-dd HH:mm:ss表示 */
    endTime: string,
    /** 活动地点 */
    location: string,
    /** 活动状态（暂时没用） */
    status: number
}

export interface ActivityQuery {
    /** 结束时间下界，以yyyy-MM-dd HH:mm:ss表示 */
    startLower?: string,
    /** 结束时间上界，以yyyy-MM-dd HH:mm:ss表示 */
    startUpper?: string,
    /** 开始时间下界，以yyyy-MM-dd HH:mm:ss表示 */
    endLower?: string,
    /** 开始时间上界，以yyyy-MM-dd HH:mm:ss表示 */
    endUpper?: string
}