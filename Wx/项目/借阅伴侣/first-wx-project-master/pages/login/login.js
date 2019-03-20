// login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
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
  phoneInput: function (e) {
    this.setData({
      account: e.detail.value
    })
  },
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },
  transformRequest: function (obj) {
    var str = [];
    for (var p in obj)
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
  },
  login: function () {
    var that = this;
    var postContent = {
      username: that.data.account,
      password: that.data.password,
      remember_me: true
    };
    if (that.data.account.length === 0 || that.data.password.length === 0) {
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'loading',
        duration: 2000
      })
    } else {
      wx.request({
        url: 'https://pmweb.haohandata.com:8181/pmweb/api/account/login',
        data:that.transformRequest(postContent),
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function (res) {
          if(res.statusCode === 200){
            wx.setStorageSync('JSESSIONID', res.data.sessionId);                    wx.switchTab({
              url: '/pages/index/index'
            })         
          }else{
            that.handleError('用户名或密码错误');
          }
        },
        fail: function (res) {
          console.log(res);
          that.handleError('请求错误');
        }
      })
    }
  },
  handleError: function(errorMsg){
    wx.showToast({
      title: errorMsg,
      icon: 'warn',
      duration: 2000
    })
  }
})