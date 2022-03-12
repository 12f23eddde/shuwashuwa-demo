import { getCurrentPage } from "../miniprogram_npm/@vant/weapp/common/utils";
import { WechatEventType } from "../models/wechatType";

// Credit: http://github.com/LoveChenJinwen/weappVant
Component({
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    data: {
        // For all icons:
        // https://youzan.github.io/vant-weapp/#/icon
        list: [{
            pagePath: "/pages/index/index",
            iconPath: "home-o",
            name: "主页"
        }, {
            pagePath: "/pages/service-list/service-list",
            iconPath: "todo-list-o",
            name: "维修单"
        }, {
            pagePath: "/pages/my-info/my-info",
            iconPath: "user-o",
            name: "我的"
        }],
        active: -1,
    },

    methods: {
        onChange(event: WechatEventType) {
            const pageIndex = event.detail;
            wx.switchTab({
                url: this.data.list[pageIndex].pagePath
            })
        },
    },

    lifetimes: {
        /* 加载时设置当前页面 */
        ready: function() {
            const currentPage = getCurrentPage();
            const pagePath = "/" + currentPage.route;
            const pageIndex = this.data.list.findIndex(item => item.pagePath === pagePath);
            this.setData({
                active: pageIndex
            });
        }
    }
})