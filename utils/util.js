var base64 = require('../utils/base64.js');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// eval() is disabled by tencent... wtf
const parseToken = (token) => {
  token = String(token);
  var splitString = token.split('.')[1]
  var encodedString = base64.decode(splitString)
  return JSON.parse(encodedString)
}

module.exports = {
  formatTime: formatTime,
  parseToken: parseToken
}
