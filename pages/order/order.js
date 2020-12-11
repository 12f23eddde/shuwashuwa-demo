import Dialog from '@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    option1: [
      { text: '全部维修单', value: 0 },
      { text: '活跃维修单', value: 1 },
      { text: '已完成维修单', value: 2 }
    ],
    value1: 0,
    activeNames: ['1'],
    restoredReq: '',
    restoredAct: -1,
    List: [
      {
        iconPath: '/pages/order/rejectedOrder.png',
        num: 1,
        date: '1970-01-01',
        pcmodule: 'None',
        requests: 'None',
        status: 'REJECTED',
        orderDetails: 'None',
        reply: '已拒绝'
      },
      {
        iconPath: '/pages/order/comfirmedOrder.png',
        num: 2,
        date: '2020-12-25',
        pcmodule: 'xps-13',
        requests: '更换电池',
        status: 'ACCEPTED',
        orderDetails: '更换电池',
        reply: '已拒绝'
      },
      {
        iconPath: '/pages/order/comfirmedOrder.png',
        num: 3,
        date: '2020-12-25',
        pcmodule: 'xps-13',
        requests: '更换电池',
        status: 'ACCEPTED',
        orderDetails: '更换电池',
        reply: '已拒绝'
      },
      {
        iconPath: '/pages/order/comfirmedOrder.png',
        num: 4,
        date: '2020-12-25',
        pcmodule: 'xps-13',
        requests: '更换电池',
        status: 'ACCEPTED',
        orderDetails: '更换电池',
        reply: '已拒绝'
      },
      {
        iconPath: '/pages/order/comfirmedOrder.png',
        num: 5,
        date: '2020-12-25',
        pcmodule: 'xps-13',
        requests: '更换电池',
        status: 'ACCEPTED',
        orderDetails: '更换电池',
        reply: '已拒绝'
      },
      {
        iconPath: '/pages/order/comfirmedOrder.png',
        num: 6,
        date: '2020-12-25',
        pcmodule: 'xps-13',
        requests: '更换电池',
        status: 'ACCEPTED',
        orderDetails: '更换电池',
        reply: '已拒绝'
      },
      {
        iconPath: '/pages/order/comfirmedOrder.png',
        num: 7,
        date: '2020-12-25',
        pcmodule: 'xps-13',
        requests: '更换电池',
        status: 'ACCEPTED',
        orderDetails: '更换电池',
        reply: '已拒绝'
      },
      {
        iconPath: '/pages/order/comfirmedOrder.png',
        num: 8,
        date: '2020-12-25',
        pcmodule: 'xps-13',
        requests: '更换电池',
        status: 'ACCEPTED',
        orderDetails: '更换电池',
        reply: '已拒绝'
      },
    ],
  },

  onChange(event) {
    console.log(event)
    if (this.data.restoredAct === -1) {
      this.setData({
        activeNames: event.detail,
        restoredAct: event.detail,
        restoredReq: this.data.List[event.detail].requests,
        ['List['+event.detail+'].requests']: ''
      });
    } else {
      this.setData({
        activeNames: event.detail,
        ['List['+this.data.restoredAct+'].requests']: this.data.restoredReq,
        restoredAct: event.detail,
        restoredReq: this.data.List[event.detail].requests,
        ['List['+event.detail+'].requests']: ''
      });
    }
  },

/**
 * 需要更改！
 */
  onClose(event) {
    const { position, instance } = event.detail;
    console.log(event.detail)
    switch (position) {
      case 'left':
      case 'cell':
        instance.close();
        break;
      case 'right':
        Dialog.confirm({
          message: '确定删除吗？',
        }).then(() => {
          instance.close()
        });
        break;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   * 需要更改！
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  btnNewOrder: function (){
    wx.navigateTo({
      url: '/pages/order-add/order-add',
    })
  }
})