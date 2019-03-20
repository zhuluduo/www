//接受data文件中的脚本
var postsData = require('../../data/posts-data.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //this.setData 用于将数据从逻辑层发送到视图层
    this.setData({
      posts_key: postsData.postList
    })
  },
  onPostTab:function(event){
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'posts-detail/index?id=' + postId,
    })
  },
 /** onSwiperItemTap:function(event){
      var postID=event.currentTarget.dataset.postid;
      wx.navigateTo({
        url: 'posts-detail/index?id=' + postID,
      })
  },**/
  //target和currentTaget的区别
  //前者：指当前点击的组件--后者指实践捕获的组件
  onSwiperTap:function(event){
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'posts-detail/index?id=' + postId,      
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(22222)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(33333)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log(44444)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log(55555)
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
    console.log(777777)
  }
})