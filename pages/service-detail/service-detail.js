import {createService, getService, submitDraft, submitForm} from '../../api/service'

Page({
  data: {
    activityId: 0,
    boughtTime: "1919-08-10",
    brand: "string",
    computerModel: "string",
    cpuModel: "string",
    graphicsModel: "string",
    hasDiscreteGraphics: true,
    imageList: [],
    laptopType: "string",
    problemDescription: "string",
    problemType: "string",
    serviceEventId: 0,
    timeSlot: 0,
    underWarranty: true
  },

  onSubmit: async function (){
    await submitForm(this.data)
  },

  onSave: async function (){
    await submitDraft(this.data)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let curr_service = null;
    console.log(options)
    // 微信这options也太神秘了, 是string型的undefined
    // id 为空，新建维修单
    if (options.id != "undefined"){
      curr_service = await getService(options.id)
    } else {
      curr_service = await createService()
    }
    // 同步事件中最后一张维修单
    let lastForm = curr_service.serviceForms[curr_service.serviceForms.length-1]
    this.setData(lastForm)
    this.setData({
      serviceEventId:curr_service.id
    })
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

  }
})