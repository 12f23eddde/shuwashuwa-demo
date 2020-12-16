import {createService, getService, submitDraft, submitForm} from '../../api/service'
import {uploadImage} from '../../api/file'
import {getIncomingActivities, getActivitySlot, getSlotTime} from '../../api/activity'
import {formatTime} from '../../utils/util'
import Notify from '@vant/weapp/notify/notify'
import WeValidator from 'we-validator/index'

const app = getApp()

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
    underWarranty: true,
    
    activityList: [],
    activityNames: [],
    activityChosen: '',
    activityShow: false,
    activityLoading:false,

    timeslotList: [],
    timeslotNames: [],
    timeslotChosen: '',
    timeslotShow: false,
    timeslotLoading:false,

    calenderShow: false,
    calenderMinDate: new Date(2010, 0, 1).getTime(),
    calenderMaxDate: new Date().getTime(),
    calenderCurrDate: null,

    pcTypes: ['二合一/平板', '轻薄本', '游戏本', '台式机', 'Mac'],
    typeShow: false,

    problemTypes: ['软件相关', '硬件相关', '我不清楚'],
    problemShow: false,

    imagesToUpload: [],

    helpShow: false,
    submitLoading: false,

    disableEdit: true,
    editable: true,
    auditable: false,
    workable: false,
    editText: "编辑"
  },

  onSubmit: async function (){
    // 编辑
    if(this.data.disableEdit){
      this.setData({
        disableEdit: false,
        editText:"提交"
      })
      return
    }

    // 提交
    if(!this.validator.checkData(this.data)) return
    this.setData({
      submitLoading: true
    })
    console.log(this.data)
    await submitForm(this.data)
    .catch((err)=>{
      Notify({type:"danger", message:err.errMsg})
      this.setData({
        submitLoading: false
      })
      throw err
    })
    this.setData({
      submitLoading: false,
      disableEdit: true,
      editText:"编辑"
    })
  },

  onSave: async function (){
    await submitDraft(this.data)
  },

  activityClick: async function(){
    if(this.data.disableEdit) {
      return
    }

    this.setData({
      activityShow: true,
      activityLoading: true
    })

    // 加载activity 感谢pjy
    let currentTime = formatTime(new Date())
    let incomingActivityList = await getIncomingActivities(currentTime)
    .catch((err) => {
      this.activityClose()
      throw err
    })
    this.setData({
      activityList: incomingActivityList
    })
    let incomingActivityNames = []
    for (let activity of incomingActivityList){
      incomingActivityNames.push(activity.activityName)
    }
    this.setData({
      activityNames: incomingActivityNames,
      activityLoading: false
    })
  },
  activityConfirm: async function(event){
    const { picker, value, index } = event.detail;
    this.setData({
      activityChosen: value,
      activityId: this.data.activityList[index].id,
      activityShow: false
    });
  },
  activityClose: async function(){
    this.setData({
      activityShow: false
    });
  },

  timeslotClick: async function(){
    if(this.data.disableEdit) {
      return
    }

    if(!this.data.activityChosen){
      Notify({type:'danger', message:'请先选择活动'})
      return
    }
    this.setData({
      timeslotShow: true,
      timeslotLoading: true
    })

    // 加载timeslot 感谢pjy
    let incomingTimeSlots = await getActivitySlot(this.data.activityId)
    .catch((err) => {
      this.timeslotClose()
      throw err
    })
    this.setData({
      timeslotList: incomingTimeSlots
    })
    let incomingTimeSlotNames = []
    for (let timeslot of incomingTimeSlots){
      incomingTimeSlotNames.push(timeslot.startTime + ' - ' + timeslot.endTime)
    }
    this.setData({
      timeslotNames: incomingTimeSlotNames,
      timeslotLoading: false
    })
  },
  timeslotConfirm: async function(event){
    const { picker, value, index } = event.detail;
    this.setData({
      timeslotChosen: value,
      timeSlot: this.data.timeslotList[index].timeSlot,
      timeslotShow: false
    });
  },
  timeslotClose: async function(){
    this.setData({
      timeslotShow: false
    });
  },

  calenderClick() {
    if(this.data.disableEdit) {
      return
    }
    this.setData({
      calenderShow: true
    })
    console.log(this.data)
  },
  // 日期选择相关
  calenderConfirm: function(event) {
    console.log(event.detail)
    this.setData({
      calenderShow: false,
      boughtTime: formatTime(event.detail).split(' ')[0],
    });
  },
  calenderClose: function(){
    this.setData({
      calenderShow: false
    });
  },

  gpuSwitch: function({ detail }){
    this.setData({
      hasDiscreteGraphics: detail,
    })
    if(detail){
      this.setData({
        graphicsModel: '',
      })
    }else{
      this.setData({
        graphicsModel: '没有独立显卡',
      })
    }
  },

  warrantySwitch: function({ detail }){
    this.setData({
      underWarranty: detail,
    })
  },

  typeClick: function(){
    if(this.data.disableEdit) {
      return
    }
    this.setData({
      typeShow: true
    })
  },
  typeConfirm: function(event){
    const { picker, value, index } = event.detail;
    this.setData({
      laptopType: value,
      typeShow: false
    })
  },
  typeClose: function(){
    this.setData({
      typeShow: false
    })
  },

  problemClick: function(){
    if(this.data.disableEdit) {
      return
    }
    this.setData({
      problemShow: true
    })
  },
  problemConfirm: function(event){
    const { picker, value, index } = event.detail;
    this.setData({
      problemType: value,
      problemShow: false
    })
  },
  problemClose: function(){
    this.setData({
      problemShow: false
    })
  },
  
  uploadConfirm: async function(event){
    let imagesChosen = event.detail.file
    if(typeof(imagesChosen) == 'undefined' || !imagesChosen){
      throw {"errCode": 40000, "errMsg": "[uploadConfirm] event.detail contains no file"}
    }
    for (let image of imagesChosen){
      let res = uploadImage(image.url)
      // 更新imagesToUpload
      const { imageList = [] } = this.data;
      imageList.push({ ...image, url: app.globalData.baseURL + '/img/' + res });
      this.setData({ imageList });
      console.log(imageList)
    }
  },

  onClickIcon: async function(event){
    this.setData({
      helpShow: true
    })
  },

  initValidator: function(){
    this.validator = new WeValidator({
      // onMessage可以修改验证不通过时的行为，默认为toast
      /*
      data 参数
      {
          msg, // 提示文字
          name, // 表单控件的 name
          value, // 表单控件的值
          param // rules 验证字段传递的参数
      }
      */
      onMessage: function(data){
        console.log(data)
        Notify({ type: 'danger', message: data.msg })
      },
      rules: {
        activityId: {required: true},
        boughtTime: {required: true},
        brand: {required: true},
        computerModel: {required: true},
        cpuModel: {required: true},
        graphicsModel: {required: true},
        hasDiscreteGraphics: {required: true},
        laptopType: {required: true},
        problemDescription: {required: true},
        problemType: {required: true},
        serviceEventId: {required: true},
        timeSlot: {required: true},
        underWarranty: {required: true},
      },
      messages: {
        activityId: {required: '请选择活动'},
        boughtTime: {required: '请选择购买时间(不用很精确)'},
        brand: {required: '请填写品牌'},
        computerModel: {required: '请填写型号'},
        cpuModel: {required: '请填写CPU型号'},
        graphicsModel: {required: '请填写独立显卡型号'},
        hasDiscreteGraphics: {required: 'Switch状态为null'},
        laptopType: {required: '请选择电脑类型'},
        problemDescription: {required: '请填写故障描述'},
        problemType: {required: '请选择故障类型'},
        serviceEventId: {required: 'serviceEventIdError'},
        timeSlot: {required: '请选择时段'},
        underWarranty: {required: 'Switch状态为null'},
      },
    })
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
    // 解决没有独显型号的问题
    this.setData({
      serviceEventId:curr_service.id,
      graphicsModel: (this.data.graphicsModel? this.data.graphicsModel : '没有独立显卡'),
      hasDiscreteGraphics: (this.data.hasDiscreteGraphics === null? false: this.data.hasDiscreteGraphics),
      underWarranty: (this.data.underWarranty === null? false: this.data.underWarranty)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.initValidator()
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