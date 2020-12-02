// Promisify all wx requests -> wxp
// Credit: https://www.jianshu.com/p/69307a720fa1
// e.g. wx.Login -> wxp.Login
import { promisifyAll, promisify } from 'miniprogram-api-promise';
export const wxp = {}
promisifyAll(wx, wxp)