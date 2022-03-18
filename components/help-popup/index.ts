import { wxRequest } from '../../utils/wxp'
import { globalStore } from '../../stores/global'
import { towxmlType } from '../../models/towxmlType'

const towxml = require('../towxml/index') as towxmlType

Component({
    // 组件选项
    options: {
        multipleSlots: true,
    },
    behaviors: [],
    properties: {
        /** 是否显示遮罩 */
        show: {
            type: Boolean,
            value: false,
        },
        /** 帮助文件的URL (支持.md或.html) 例如: /static/help.md 或 https://a.com/b.html */
        url: {
            type: String,
            required: true,
        },
        /** popup组件的custom-style */
        style: {
            type: String,
            value: '',
        }
    },
    // 组件数据
    data: {
        isPageHidden: false, // 页面是否处于隐藏状态
        eventListeners: {} as { [key: string]: (event: any) => void }, // wxml组件事件监听器
        helpMessage: null as any // 帮助文档内容
    },
    // 数据监听器
    observers: {},
    // 组件方法
    methods: {
        init() { 
            this.getWxml()
        },

        /** 获取wxml */
        async getWxml() {
            let url = this.properties.url

            let contentType: 'markdown' | 'html' = 'markdown'
            if (url.endsWith('.md')) {
                contentType = 'markdown'
            }
            else if (url.endsWith('.html')) {
                contentType = 'html'
            } else {
                throw new Error('不支持的文件类型: ' + url)
            }

            // 是相对路径？
            if (url.startsWith('/')) {
                url = globalStore.backendUrl + url
            }
            
            console.log('getWxml', url)

            let response = null;

            try {
                response = await wxRequest<string>({
                    url,
                    method: 'GET',
                })
            } catch (e) {
                console.error(e)
                throw e
            }

            if (!response.data) {
                throw new Error('获取帮助文件失败: ' + url)
            }

            const res = towxml(response.data as unknown as string, contentType, {
                base: globalStore.backendUrl,
                events: this.data.eventListeners,
            })

            this.setData({
                helpMessage: res
            })
        },

        /** 点击关闭按钮 */
        onClose() {
            this.triggerEvent('close')
        }
    },

    // 组件生命周期
    lifetimes: {
        created: () => { },
        attached() {
            this.init()
        },
        ready() { },
        moved() { },
        detached() { },
    },

    definitionFilter() { },
    // 页面生命周期
    pageLifetimes: {
        // 页面被展示
        show() {
            const { isPageHidden } = this.data
            // show事件发生前，页面不是处于隐藏状态时
            if (!isPageHidden) {
                return
            }
            // 重新执行定时器等操作
        },
        // 页面被隐藏
        hide() {
            this.setData({
                isPageHidden: true,
            })
            // 清除定时器等操作
        },
        // 页面尺寸变化时
        resize() { },
    },
})
