// pages/wallet/popup/wpopup.js.js
Page({

  /**
   * Page initial data
   */
  data: {
    alphaData:null,
    betaData:null
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  alphaClick: function(even) {
    var animation1 = wx.createAnimation({})
    animation1.opacity(0.2).step({duration:1000})
    this.setData({alphaData: animation1.export()})
    var animation2 = wx.createAnimation({})
    animation2.opacity(0).step({ duration:5})
    this.setData({betaData: animation2.export()})
  }
})