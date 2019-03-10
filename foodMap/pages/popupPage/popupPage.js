// pages/popupPage/popupPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    likes: 0,
    images: ["https://6d6f-moca-map-3c18df-1258691048.tcb.qcloud.la/maxresdefault.jpg?sign=b4fed99b8b4ac597f6a981d80608359a&t=1551563642", "https://pbs.twimg.com/profile_images/558329813782376448/H2cb-84q_400x400.jpeg", "https://i.ytimg.com/vi/3flWbxiQeY4/maxresdefault.jpg", "https://pbs.twimg.com/media/CpHIAjtWYAERUMP.jpg"]
  },

  //回到地图
  backToMap: function () {
    wx.navigateBack();
  },
  //展示弹框
  showPopup() {
    this.setData({
      flag: !this.data.flag
    })
  },
  //赞一哈
  addLike() {
    this.setData({
      likes: ++this.data.likes
    })
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

  }
})