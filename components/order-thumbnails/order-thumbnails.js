// components/order-thumbnails/order-thumbnails.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    iconPath: 'components\order-thumbnails\rejectedOrder.png',
    num: 1,
    date: '1970-01-01',
    module: 'None',
    requests: 'None',
    status: 'REJECTED',
    orderDetails: 'None',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {
      this.setData({
        activeNames: event.detail,
      });
    },
  }
})
