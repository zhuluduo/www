// server.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serialNumber: '',
    ipAddr: '',
    attrList: [],
    modalHidden: true,
    statusList: [],
    idcList: [],
    rackList: [],
    envList: [],
    roleList: [],
    modalTitle: '',
    curServerItem: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var serialNumber = options.serial_number || '';
    var serverItem = this.getServerInfo(serialNumber);

    var attrList = this.refreshAttrList(serverItem);

    this.setData({
      serialNumber: serialNumber,
      ipAddr: serverItem.ipAddr,
      attrList: attrList,
      curServerItem: serverItem
    })
    //console.log(idcList[0].id);
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
  /**
   * 根据服务器序列号获取服务器信息
   */
  getServerInfo: function (serialNumber) {
    return wx.getStorageSync("serverInfo") || {};
  },

  refreshAttrList: function (serverItem) {
    var attrList = [{
      key: '机房',
      logo: '/img/idc.png',
      index: 'idcName',
      List: 'idcList'
    }, {
      key: '机架',
      logo: '/img/rack.png',
      index: 'rack',
      List: 'rackList'
    }, {
      key: '部署链路',
      logo: '/img/signal.png',
      index: 'envName',
      List: 'envList'
    }, {
      key: '设备状态',
      logo: '/img/status.png',
      index: 'status',
      List: 'statusList'
    }, {
      key: '服务器角色',
      logo: '/img/role.png',
      index: 'role',
      List: 'roleList'
    }];
    attrList.map(function (d) {
      d.value = serverItem[d.index];
    });
    return attrList;
  },

  clickToEdit: function (e) {
    var that = this;
    var serverItem = that.data.curServerItem;
    var statusList = [{
      id: 31,
      name: '在用'
    }, {
      id: 32,
      name: '待用'
    }, {
      id: 33,
      name: '下线'
    }];
    statusList.map(function (d) {
      d.checked = serverItem.status === d.name ? true : false;
    })

    var idcList = [{
      id: 11,
      name: '芳村机房'
    }, {
      id: 12,
      name: '三水机房'
    }];
    idcList.map(function (d) {
      d.checked = serverItem.idcName === d.name ? true : false;
    })

    var rackList = [{
      id: 21,
      name: '1号机架'
    }, {
      id: 22,
      name: '2号机架'
    }];
    rackList.map(function (d) {
      d.checked = serverItem.rack === d.name ? true : false;
    })

    var envList = [{
      id: 0,
      name: '省网'
    }, {
      id: 1,
      name: 'IDC'
    }, {
      id: 2,
      name: '缓存出口'
    }];
    envList.map(function (d) {
      d.checked = serverItem.envName === d.name ? true : false;
    })

    var roleList = [{
      id: 41,
      name: '采集服务器'
    }, {
      id: 42,
      name: 'NameNode'
    }, {
      id: 43,
      name: 'DataNode'
    }];
    roleList.map(function (d) {
      d.checked = serverItem.role === d.name ? true : false;
    });
    this.setData({
      statusList: statusList,
      idcList: idcList,
      rackList: rackList,
      envList: envList,
      roleList: roleList
    })
    var c = [];
    c = e.currentTarget.dataset.item.List;
    //var f=c === 'envList' ? true : false;
    //console.log(f);
    if (c === 'envList') {
      this.setData({
        modalTitle: '选择' + e.currentTarget.dataset.item.key,
        modalHidden: false,
        radioHidden: true,
        checkboxHidden: false,
        modalList: this.data[c]
      })
    } else {
      this.setData({
        modalTitle: '选择' + e.currentTarget.dataset.item.key,
        modalHidden: false,
        radioHidden: false,
        checkboxHidden: true,
        modalList: this.data[c]
      })
    }

  },

  confirm: function () {
    //demo中只能设置服务器状态字段
    var that = this;
    that.data.statusList.forEach(function (d) {
      if (d.checked) {
        that.data.curServerItem.status = d.name;
      }
    });
    that.data.idcList.forEach(function (d) {
      if (d.checked) {
        that.data.curServerItem.idcName = d.name;
      }
    });
    that.data.rackList.forEach(function (d) {
      if (d.checked) {
        that.data.curServerItem.rack = d.name;
      }
    });
    that.data.envList.forEach(function (d) {
      if (d.checked) {
        that.data.curServerItem.envName = d.name;
      }
    });
    that.data.roleList.forEach(function (d) {
      if (d.checked) {
        that.data.curServerItem.role = d.name;
      }
    });
    wx.setStorageSync("serverInfo", that.data.curServerItem);
    var attrList = that.refreshAttrList(that.data.curServerItem);
    that.setData({
      modalHidden: true,
      attrList: attrList
    });
  },
  /**
   * 模态框取消按钮操作
   */
  cancel: function () {
    this.setData({
      modalHidden: true
    })
  },
  /**
   * 单选框选择操作
   */
  radioChange: function (e) {
    var that = this;
    that.data.statusList.map(function (d) {
      d.checked = e.detail.value == d.id ? true : false;
    })
    that.data.idcList.map(function (d) {
      d.checked = e.detail.value == d.id ? true : false;
    })
    that.data.rackList.map(function (d) {
      d.checked = e.detail.value == d.id ? true : false;
    })
    that.data.envList.map(function (d) {
      d.checked = e.detail.value == d.id ? true : false;
    })
    that.data.roleList.map(function (d) {
      d.checked = e.detail.value == d.id ? true : false;
    })
  },
  /**
   * 多选框选择操作
   */
  checkboxgroupBindchange: function (e) {
    var that = this;
    var temp1 = e.detail.value
    //console.log(this)
    var temp2 = ''

    if (temp1.length != 0) {
      if (temp1.length < 3) {
        for (var i = 0, len = temp1.length; i < len; i++) {
          temp2 = temp2 + this.data.envList[temp1[i]].name + '  '
        }
        that.data.curServerItem.envName = temp2;

      } else {
        temp2 = temp2 + this.data.envList[temp1[0]].name + '  ' + this.data.envList[temp1[1]].name + '等'
        that.data.curServerItem.envName = temp2;
      }
    } else {
      that.data.curServerItem.envName = '';
    }
  }

})

