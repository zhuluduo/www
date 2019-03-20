Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentAlarmList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var alarmList = this.getCurrentAlarmList();
    this.setData({
      currentAlarmList:alarmList
    })
  },

  getCurrentAlarmList:function(){
    return [{
      serialNumber:'ERQETQERQ',
      ip:'192.168.20.32',
      idcName:'芳村机房',
      rack:'A01',
      type:'服务器',
      service:'磁盘满',
      level:'紧急',
      info:'/home分区使用率已超过90%',
      startTime:new Date()
    }, {
      serialNumber: '5-21-1234',
      ip: '192.168.20.12',
      idcName: '芳村机房',
      rack: 'A01',
      type: '探针',
      service: 'telnet异常',
      level: '紧急',
      info: '6011端口无法访问',
      startTime: new Date()
    }]
  }

})