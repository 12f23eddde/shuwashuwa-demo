import {
  createService, getService, submitForm, submitDraft,
  cancelService, auditService, completeService, feedbackService, 
  workService, cancelWorkService, getHelpMessage
} from '../../api/service'
import {uploadImage} from '../../api/file'
import {getIncomingActivities, getCurrentActivities, getActivitySlot} from '../../api/activity'
import {formatTime} from '../../utils/util'
import Notify from '@vant/weapp/notify/notify'
import Dialog from '@vant/weapp/dialog/dialog'
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
    descriptionAdvice: "string",

    problemSummary: "string",
    result: true,
    serviceFormId: 0,
    status: 0,

    volunteerMessage: "",
    userMessage: "",
    
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
    helpMessage: '获取帮助信息失败，请和茨菇小哥哥🤺',
    submitLoading: false,

    disableEdit: true,
    editable: true,
    auditable: true,
    workable: true,
  },

  onSubmit: async function (){
    // 编辑
    if(this.data.disableEdit){
      this.setData({
        disableEdit: false,
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
    })

    this.loadService(this.data.serviceEventId)
  },

  onCancel: async function(){
    this.setData({ submitLoading: true })
    await Dialog.confirm({
      title: "取消维修",
      message:"您确定要取消当前维修吗？此操作不可逆。"
    }).then(async ()=>{
      let res = await cancelService(this.data.serviceEventId)
      console.log(res)
    })
    wx.navigateBack({
      delta: 0,
    })
    this.setData({ submitLoading: false })
  },

  onSave: async function (){
    this.setData({ submitLoading: true })
    await submitDraft(this.data)
    this.setData({ submitLoading: false })
  },

  onAuditPass: async function(){
    this.setData({ submitLoading: true })
    if(!this.validator2.checkData(this.data)) return;
    await auditService({
      message: this.data.descriptionAdvice,
      problemSummary: this.data.problemSummary,
      result: true,
      serviceEventId: this.data.serviceEventId,
      serviceFormId: this.data.serviceFormId
    })
    this.loadService(this.data.serviceEventId)
    this.setData({ submitLoading: false })
  },

  onAuditFail: async function(){
    if(!this.validator2.checkData(this.data)) return;
    this.setData({ submitLoading: true })
    await auditService({
      message: this.data.descriptionAdvice,
      problemSummary: this.data.problemSummary,
      result: true,
      serviceEventId: this.data.serviceEventId,
      serviceFormId: this.data.serviceFormId
    })
    this.loadService(this.data.serviceEventId)
    this.setData({ submitLoading: false })
  },

  onWork: async function(){
    this.setData({ submitLoading: true })
    await workService(this.data.serviceEventId)
    this.loadService(this.data.serviceEventId)
    this.setData({ submitLoading: false })
  },

  onCancelWork: async function(){
    this.setData({ submitLoading: true })
    await cancelWorkService(this.data.serviceEventId)
    this.loadService(this.data.serviceEventId)
    this.setData({ submitLoading: false })
  },

  onComplete: async function(){
    this.setData({ submitLoading: true })
    await completeService(this.data.serviceEventId, this.data.volunteerMessage)
    this.loadService(this.data.serviceEventId)
    this.setData({ submitLoading: false })
  },

  onFeedBack: async function(){
    this.setData({ submitLoading: true })
    await feedbackService(this.data.serviceEventId, this.data.userMessage)
    this.loadService(this.data.serviceEventId)
    this.setData({ submitLoading: false })
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
    let currentActivityList = await getCurrentActivities(currentTime, false)
    .catch((err) => {
      this.activityClose()
      throw err
    })
    console.log(incomingActivityList, currentActivityList)
    incomingActivityList.push(...currentActivityList)
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
    let currDate = new Date(event.detail)
    // 将currDate做了神奇的处理，输出年月
    this.setData({
      calenderShow: false,
      boughtTime: formatTime(currDate).split(' ')[0],
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
      let res = await uploadImage(image.url)
      // 更新imagesToUpload
      const { imagesToUpload = [] } = this.data;
      imagesToUpload.push({ ...image, url: app.globalData.baseURL + '/img/' + res, isImage: true });
      this.setData({ imagesToUpload });
      // 更新imageList
      const { imageList = [] } = this.data;
      imageList.push(res);
      this.setData({ imageList });
    }
  },
  uploadCancel: async function(event){
    if(this.data.disableEdit) return;
    let imageToDelete = event.detail.index
    const { imagesToUpload = [] } = this.data;
    imagesToUpload.splice(imageToDelete, 1)
    this.setData({ imagesToUpload });
    // 更新imageList
    const { imageList = [] } = this.data;
    imageList.splice(imageToDelete, 1)
    this.setData({ imageList });
  },

  helpClick: async function(event){
    // this.setData({
    //   helpMessage: await getHelpMessage()
    // })
    this.setData({helpShow: true})
  },
  helpClose: async function(event){
    this.setData({helpShow: false})
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
    this.validator2 = new WeValidator({
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
        descriptionAdvice: {required: true},
        problemSummary: {required: true},
      },
      messages: {
        descriptionAdvice: {required: '请填写审核消息'},
        problemSummary: {required: '请填写故障'},
      },
    })
  },

  // id >= 0 加载现有service
  // id < 0 创建service
  loadService: async function (id) {
    let curr_service = null;
    if (id >= 0){  // 加载维修单, 如果不是草稿不开启编辑
      curr_service = await getService(id)
      if (curr_service.draft){this.setData({ disableEdit: false})}
      else{this.setData({ disableEdit: true})}
    } else {  // id 为空 新建维修单,默认开启编辑
      curr_service = await createService()
      this.setData({
        disableEdit: false
      })
    }
    console.log(curr_service)
    // 同步事件中最后一张维修单
    let lastForm = curr_service.serviceForms[curr_service.serviceForms.length-1]
    this.setData(lastForm)
    this.setData({
      serviceFormId: lastForm.formID,
    })
    // 解决没有独显型号的问题
    this.setData({
      serviceEventId: curr_service.id,
      activityId: curr_service.activityId,
      problemSummary: curr_service.problemSummary,
      status: curr_service.status,
      graphicsModel: (this.data.graphicsModel? this.data.graphicsModel : '没有独立显卡'),
      hasDiscreteGraphics: (this.data.hasDiscreteGraphics === null? false: this.data.hasDiscreteGraphics),
      underWarranty: (this.data.underWarranty === null? false: this.data.underWarranty)
    })

    // 加载activityName与timeslot
    if(this.data.activityId){
      let timeslots = await getActivitySlot(this.data.activityId)
      for (let timeslot of timeslots){
        if (timeslot.timeSlot == this.data.timeSlot){
          this.setData({
            timeslotChosen: timeslot.startTime + ' - ' + timeslot.endTime
          })
          break;
        }
      }
    }

    // 加载images
    if(this.data.imageList){
      for(let imagePath of this.data.imageList){
        const { imagesToUpload = [] } = this.data;
        imagesToUpload.push({
          name: imagePath,
          thumb: app.globalData.baseURL + '/img/100_' + imagePath,
          url: app.globalData.baseURL + '/img/' + imagePath,
          isImage: true
        });
      this.setData({ imagesToUpload });
      }
    }

    // 可以编辑,创建新维修或者是自己的维修
    if (curr_service.userId === app.globalData.userId){
      this.setData({
        editable: true,
        // auditable: false,
        // workable: false
      })
    }
    // 可以接单,不能自己接自己
    if(app.globalData.userInfo.volunteer && curr_service.userId !== app.globalData.userId){
      this.setData({
        editable: false,
        workable: true
      })
    }
    // 可以审核,不能自己审自己
    if(app.globalData.userInfo.admin && curr_service.userId !== app.globalData.userId){
      this.setData({
        editable: false,
        auditable: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options)
    // 微信这options也太神秘了, 是string型的undefined
    if (options.id != "undefined"){  // 加载维修单, 默认不开启编辑
      this.loadService(options.id)
    } else {  // id 为空 新建维修单,默认开启编辑
      this.loadService(-1)
    }
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