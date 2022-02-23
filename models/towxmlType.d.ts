export type towxmlOptions = {
    /** 静态相对资源的base路径。例如：https://xx.com/static/ */
    base?: string,
    /** 默认:light，用于指定主题'light'或'dark'，或其它自定义 */
    theme?: string,
    /** 用于为元素绑定事件。key为事件名称，value则必须为一个函数 */
    events?: { [key: string]: (event: any) => void },
}

export type towxmlType = (
    /** html或markdown字符串 */
    data: string, 
    /** 需要解析的内容类型 html或markdown */
    type: 'html' | 'markdown',
    /** 选项 */
    options?: towxmlOptions,
    ) => any