/* why wx formats dates differently? */

export const formatTime = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
  
    // Mind this have been edited ———— as all our dates in api connected with '-'
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  
  export const formatNumber = (n: number) => {
    const nStr = n.toString()
    return nStr[1] ? nStr : '0' + nStr
  }