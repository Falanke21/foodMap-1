// pages/searchBox/searchBox.js
var WxSearch = require('../../utils/wxSearchView/wxSearchView.js');

Page({

  /**
   * Page initial data
   */
  data: {
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this
    console.log("inputPassIn", options.inputPassIn)
    WxSearch.init(
      that,
      options.inputPassIn,
      ['奶茶', '烧烤', "炸鸡", "甜食", '日料', '小笼包'],
      ['北方菜', '粤菜', '四川菜', "鲁菜"],
      that.mySearchFunction,
      that.myGobackFunction
    );
    this.mySearchFunction(options.inputPassIn)
  },

  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数

  // 4 搜索回调函数  
  mySearchFunction: function (value) {
    console.log("mySearchFunction Triggered")
    // do your job here
    wx.cloud.init()
    const db = wx.cloud.database()
    var markerId
    db.collection('location').where({
      name: {
        $regex: '.*'+ value +'.*'
      },
    }).get({
      success(res) {
        var locations = res.data
        console.log(locations)
        if (locations.length == 0) {
          console.log("No such location")
          wx.showToast({
            title: '没有相似的结果\n即将自动跳转',
            icon: 'none',
            duration: 2000,
            masks: true
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          wx.showLoading({
            title: '加载中',
          })
          console.log("Found such location")
          console.log(locations[0])
          var dbid = locations[0].dbid
          setTimeout(function () {
            wx.hideLoading()
            wx.redirectTo({
              url: '../popupPage/popupPage?dbid=' + dbid
            })
          }, 1000)
        }
      }
    })
  },

  // 5 返回回调函数
  myGobackFunction: function () {
    console.log("muGobackFunction Triggered")
    // do your job here
    // 示例：返回
    wx.redirectTo({
      url: '../index/index?searchValue=返回'
    })
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

  }
})