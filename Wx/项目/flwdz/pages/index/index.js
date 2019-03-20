//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    loadingHidden: true,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    num:0,
    scrTop:200+'%',
    imgUrls: [
      '../images/1.jpg',
      '../images/2.jpg',
      '../images/3.jpg',
      '../images/4.jpg',
      '../images/5.jpg',
      '../images/6.jpg',
      '../images/7.jpg',
      '../images/8.jpg',
      '../images/9.jpg',
    ],
    swiperIndex: 0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    this.setData({
      loadingHidden: false
    });
    this.Loading();
    this.countDown();

  },

  Loading(){
    var num=this.data.num;
    console.log(num)
    var timer=setInterval(()=>{
      num++;
      Math.min(num,100);
      if(num >=100){
        clearInterval(timer);
        timer=null;
        this.setData({
          loadingHidden: true,
        })
      }
      this.setData({
        num:num,
        scrTop: Math.floor((100 - num) * 1.8) + 'px'
      })
    },50)
    // var oWave = document.getElementById('wave');
    // var oNum = document.getElementById('num');
    // var oProgress = document.getElementById('progress');

    // var num = oNum.getAttribute('num');
    // var timer = setInterval(function () {
    //   num++;
    //   Math.min(num, 100);
    //   if (num >= 100) {
    //     clearInterval(timer);
    //     timer = null;
    //   }
    //   oNum.innerHTML = num;
    //   oProgress.style.top = Math.floor((100 - num) * 1.8) + 'px';

    // }, 100);
  },
  swiperChange(e) {
    this.setData({
      swiperIndex: e.detail.current
    })
  },
  countDown:function(){
    // this.setData({
    //   num: 5
    // })
    // var a = this.data.num;
    // var time = setInterval(()=>{
    //   a--;
    //   this.setData({
    //     num:a
    //   })
    //   if(a==0){
    //     // 跳转带返回最多10层--打开新页面	
    //     wx.navigateTo({
    //       url: '../fmc/fmc'
    //     })
    //     clearInterval(time)
    //   }
    // },1000)
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
