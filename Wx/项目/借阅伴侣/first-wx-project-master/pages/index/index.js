//index.js
//获取应用实例
var app = getApp()
var config = require('../../config.js')
Page({
  data: {
    topTabItems: ['出口', '机房'],
    currentTopItem: 0,
    envList: [],
    idcList: [],
    swiperHeight: "0",
    currentProject: {},
    actionSheetHidden: true,
    projectList: [],
    modalHidden: true,
    scanResult: '',
    serialNumber: '',
    sessionId: ''
  },
  //切换顶部标签
  switchTab: function (e) {
    console.log(e);
    this.setData({
      currentTopItem: e.currentTarget.dataset.idx
    });
  },
  //点击切换项目组
  switchProject: function () {
    var that = this;
    that.setData({
      actionSheetHidden: !that.data.actionSheetHidden
    })
  },
  //选择新的项目组
  chooseProject: function (e) {
    console.log(e);
    var that = this;
    that.setData({
      currentProject: e.currentTarget.dataset.project,
      actionSheetHidden: !that.data.actionSheetHidden
    });
    that.getEnvList(e.currentTarget.dataset.project.id);
    that.getIdcList(e.currentTarget.dataset.project.id);
  },
  //左右滑动切换出口-机房
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTopItem: e.detail.current
    });
    if(that.data.currentTopItem == 0){
      that.getEnvList(that.data.currentProject.id);
    }else{
      that.getIdcList(that.data.currentProject.id);
    }
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this;

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    }),
      that.getProjectList();

  },
  onShow: function () {
    var animation = wx.createAnimation({
      duration: 1000,
      transformOrigin: "50% 50% 0",
      timingFunction: "ease-in"
    });
    this.animation = animation;
    animation.scale(1.5, 1.5).step();
    this.setData({
      animationData: animation.export()
    })
  },
  onReady: function () {

  },
  getProjectList: function () {
    var that = this;
    var sessionId = wx.getStorageSync('JSESSIONID');
    var currentProject = {};
    var api = config.getPmHost()+config.getPmApiList().PROJECT_GROUP;
    wx.request({
      url: api,
      header: {
        "Content-Type": "application/json",
        "Cookie": "JSESSIONID=" + sessionId
      },
      success: function (res) {
        var projectList = res.data;
        if (projectList.length > 0) {
          currentProject = projectList[0];
        }
        that.setData({
          sessionId: sessionId,
          projectList: projectList,
          currentProject: currentProject
        })
        that.getEnvList(currentProject.id);
        // that.getIdcList(currentProject.id);
      },
      fail: function () {
        console.log('error');
      }
    })
  },
  //下拉选择项目中的取消按钮功能
  actionSheetChange: function (e) {
    var that = this;
    that.setData({
      actionSheetHidden: !that.data.actionSheetHidden
    })
  },


  //扫描二维码或条形码
  scan: function () {
    var that = this;
    wx.scanCode({
      onlyFromCamera: true,
      success: function (res) {
        that.dealScanResult(res.result);
      },
      fail: function (res) {
        that.setData({
          modalHidden: false,
          scanResult: '扫码失败'
        })
      },
      complete: function (res) { },
    })
  },
  //确认扫码结果
  confirm: function () {
    var that = this;
    that.setData({
      modalHidden: true
    });
  },
  cancelScan: function () {
    var that = this;
    that.setData({
      modalHidden: true
    })
  },

  dealScanResult: function (result) {
    var that = this;
    if (that.judgeSerialNumberExist(result)) {
      that.setData({
        modalHidden: true
      });
      wx.navigateTo({
        url: '/pages/equipment/server?serial_number=' + result,
      })
    } else {
      that.setData({
        modalHidden: false,
        scanResult: "设备序列号：" + result + "不存在，请联系发货管理员进行添加",
        serialNumber: result
      })
    }
  },
  //判断扫描到设备序列号是否存在
  judgeSerialNumberExist: function (result) {
    return true;
  },

  //根据项目组ID获取链路环境列表
  getEnvList: function (projectGroupId) {
    console.log(projectGroupId);
    var that = this;
    var api = config.getPmHost() + config.getPmApiList().PROJECT_LINK;
    wx.request({
      url: api,
      data: {
        project_id: projectGroupId
      },
      header: {
        "Content-Type": "application/json",
        "Cookie": "JSESSIONID=" + that.data.sessionId
      },
      success: function (res) {
        var envList = res.data.map(function (d) {
          d.id = d.projectLinkId;
          d.name = d.typeName;
          if (d.typeNumList) {
            var serverNum = 0;
            var tmaNum = 0;
            var switchNum = 0;
            d.typeNumList.forEach(function (e) {
              if (e.typeName === '服务器') {
                serverNum = e.num;
              }
              if (e.typeName === 'TMA-SSS') {
                tmaNum = e.num;
              }
              if (e.typeName === '交换机') {
                switchNum = e.num;
              }
            });
            d.attr = '服务器数：' + serverNum + '，探针数：' + tmaNum + '，交换机数：' + switchNum;
          } else {
            d.attr = '设备数：0'
          }
          d.avator = '../../img/signal.png';
          d.alarmNum = 2;
          return d;
        });
        console.log(envList);
        that.setData({
          envList: envList,
          swiperHeight: envList.length * 80 + 50
        })
      },
      fail: function () {
        console.log('error');
      }
    })
  },
  /**
   * 根据项目组ID获取机房列表
   */
  getIdcList: function (projectGroupId) {
    console.log(projectGroupId);
    var that = this;
    var api = config.getPmHost()+config.getPmApiList().IDC_EQUIPMENT;
    wx.request({
      url: api,
      data: {
        project_id: projectGroupId
      },
      header: {
        "Content-Type": "application/json",
        "Cookie": "JSESSIONID=" + that.data.sessionId
      },
      success: function (res) {
        console.log(res.data);
        var idcList = res.data.map(function (idc) {
          if (idc.idcId) {
            idc.id = idc.idcId;
            idc.name = idc.idcName;
          } else {
            idc.id = 0;
            idc.name = '未设置';
          }
          if (idc.typeNumList) {
            var serverNum = 0;
            var tmaNum = 0;
            var switchNum = 0;
            idc.typeNumList.forEach(function (e) {
              if (e.typeName === '服务器') {
                serverNum = e.num;
              }
              if (e.typeName === 'TMA-SSS') {
                tmaNum = e.num;
              }
              if (e.typeName === '交换机') {
                switchNum = e.num;
              }
            });
            idc.attr = '服务器数：' + serverNum + '，探针数：' + tmaNum + '，交换机数：' + switchNum;
          } else {
            idc.attr = '设备数：0'
          }
          idc.avator = '../../img/idc.png';
          idc.alarmNum = 3;
          return idc;
        })
        that.setData({
          idcList: idcList,
          swiperHeight: idcList.length * 80 + 50
        })
      },
      fail: function () {
        console.log('error');
      }
    })
  }



})
