import { serviceStatusText, serviceStatusType } from "../../utils/shuwashuwa";

Component({
    options: {
        multipleSlots: true,
    },
    properties: {
        status: {
            type: Number,
            value: 0,
        }
    },
    data: {
        statusText: '未知',
        statusType: 'primary',
    },
    lifetimes: {
        attached: function() {
            this.setData({
                statusText: serviceStatusText(this.data.status),
                statusType: serviceStatusType(this.data.status),
            });
        },
    },
    methods: {
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
    }
})
