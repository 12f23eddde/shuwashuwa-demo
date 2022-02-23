export type WeValidatorRule = {
    /** 必填 */
    required?: boolean,
    /** 正则通用 */
    pattern?: string,
    /** 电子邮件格式 */
    email?: boolean,
    /** URL网址 */
    url?: boolean,
    /** 座机号 例如：010-1234567、0551-1234567 */
    tel?: boolean,
    /** 11位手机号 */
    mobile?: boolean,
    /** 身份证号 */
    idcard?: boolean,
    /** 字段值相同校验 例如：密码和确认密码 */
    equalTo?: string,
    /** 字段值不能相同校验 */
    notEqualTo?: string,
    /** 是否包含某字符 */
    contains?: string,
    /** 不能包含某字符 */
    notContains?: string,
    /** 长度为多少的字符串 */
    length?: number,
    /** 最少多长的字符串 */
    minlength?: number,
    /** 最多多长的字符串 */
    maxlength?: number,
    /** 某个范围长度的字符串 */
    rangelength?: [number, number],
    /** 数字 */
    number?: boolean,
    /** 正整数数字 */
    digits?: boolean,
    /** 大于多少的数字 */
    min?: number,
    /** 小于多少的数字 */
    max?: number,
    /** 大于且小于多少的数字 */
    range?: [number, number],
    /** 中文字符 */
    chinese?: boolean,
    /** 最少多少个中文字符 */
    minChinese?: number,
    /** 最多多少个中文字符 */
    maxChinese?: number,
    /** 大于且小于多少个中文字符 */
    rangeChinese?: [number, number],
    /** 日期（默认使用 new Date(value) 校验） */
    date?: boolean,
    /** 日期（ISO标准格式）例如：2019-09-19，2019/09/19 */
    dateISO?: boolean,
    /** ipv4地址 */
    ipv4?: boolean,
    /** ipv6地址 */
    ipv6?: boolean,
}


export type WeValidatorOptions = _WeValidatorOptionsPartial & {
    /** 验证字段的规则 */
    rules: Record<string, WeValidatorRule>,
    /** 验证字段错误的提示信息 小程序默认使用showToast 普通web浏览器默认使用alert */
    messages: Record<string, {[K in keyof WeValidatorRule]?: string}>,
}

type _WeValidatorOptionsPartial = {
    /** 是否校验多个字段 */
    multiCheck?: false,
    /** 错误信息显示方式 */
    onMessage?: (result: WeValidatorResult) => void,
} | {
    /** 是否校验多个字段 */
    multiCheck: true,
    /** 错误信息显示方式 */
    onMessage?: (result: WeValidatorResult[]) => void,
}

export type WeValidatorResult = {
    /** 提示文字 */
    msg: string,
    /** 表单控件的 name */
    name: string,
    /** 表单控件的值 */
    value: string,
    /** rules 验证字段传递的参数 */
    param: Record<string, any>,
}

export type WeValidatorInstance = {
    /** 校验数据，会显示错误信息，校验所有字段规则 */
    checkData: (data: Record<string, any>, onMessage?: (result: WeValidatorResult |  WeValidatorResult[]) => void) => boolean,
    /** 校验数据，会显示错误信息，只校验对应的字段 */
    checkFields: (data: Record<string, any>, fields: string[], onMessage?: (result: WeValidatorResult |  WeValidatorResult[]) => void) => boolean,
    /** 校验数据是否有效，不会提示错误信息 */
    isValid: (data: Record<string, any>, fields: string[]) => boolean,
    /** 动态添加字段校验 */
    addRules: (option: WeValidatorOptions) => void,
    /** 动态添加字段校验 */
    addRule: (name: string, option: WeValidatorRule) => void,
    /** 动态移除字段校验 */
    removeRules: (names: string[]) => void,
    /** 静态方法：函数校验 */
    checkValue(ruleName: string, value: any, param: any): boolean,
}

