import { ServiceEvent } from "../../models/service";

Component({
    options: {
        multipleSlots: true,
    },
    properties: {
        service: {
            type: Object,
            required: true,
        }
    },
    data: {
        statusText: '未知',
        statusType: 'primary',
        startTime: '',
    },
    lifetimes: {
        attached: function() {
            const service = this.data.service as ServiceEvent
            this.setData({
                statusText: this.serviceStatusText(service.status),
                statusType: this.serviceStatusType(service.status),
                startTime: service.startTime? service.startTime.split(' ')[1] : '',
            });
        },
    },
    methods: {
        goToServiceDetail: function() {
            const service = this.data.service as ServiceEvent
            wx.navigateTo({
                url: '/pages/service-detail/service-detail?id=' + service.serviceEventId
            })
        },

        serviceStatusText: (status: number) => {
            switch (status) {
                case 0:
                    return '待填写';
                case 1:
                    return '待审核';
                case 2:
                    return '待签到';
                case 3:
                    return '待接单';
                case 4:
                    return '维修中';
                case 5:
                    return '已完成';
                default:
                    return '状态未知';
            }
        },
        serviceStatusType: (status: number) => {
            switch (status) {
                case 0:
                    return 'primary';
                case 1:
                    return 'primary';
                case 2:
                    return 'warning';
                case 3:
                    return 'warning';
                case 4:
                    return 'success';
                case 5:
                    return 'danger';
                default:
                    return 'primary';
            }
        }
    },
})
