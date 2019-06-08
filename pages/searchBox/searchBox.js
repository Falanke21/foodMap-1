// pages/searchBox/searchBox.js
var WxSearch = require('../../utils/wxSearchView/wxSearchView.js');

Page({

  /**
   * Page initial data
   */
  data: {
    // Results in drop down list
    schrRes: [
      {name: '我喜欢'},
      {name: 'copy'},
      {name: 'paste'},
      {name: 'push --force'},
      {name: 'merge -f'},
      {name: 'commit -m ""'}
    ],
    hiddenDropDown: true
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this
    WxSearch.init(
      that,
      ['奶茶', '烧烤', "炸鸡", "甜食", '日料', '小笼包'],
      ['北方菜', '粤菜', '四川菜', "鲁菜"],
      that.mySearchFunction,
      that.myGobackFunction
    );

    var that = this;
    var locations = []
    wx.cloud.init()
    const db = wx.cloud.database()
    
    db.collection('location').get({
      success (res) {
        that.setData({
          schrRes: res.data
        })
      }
    })

    var x = this.editDist("cat", "CAT");
    console.log("测试EditDistance函数", x)
  },

  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数


  editDist: function (word1, word2) {
    let dp = new Array(2);
    dp = dp.fill().map(() => (new Array(word1.length + 1)));
    dp[0][0] = 0;

    for (let i = 1; i < dp[0].length; i++) {
      dp[0][i] = dp[0][i - 1] + 1;
    }

    for (let i = 1; i < word2.length + 1; i++) {
      for (let j = 0; j < dp[0].length; j++) {
        if (j === 0) {
          dp[i % 2][j] = dp[(i - 1) % 2][j] + 1;
          continue;
        }
        dp[i % 2][j] = Math.min(dp[(i - 1) % 2][j], dp[(i - 1) % 2][j - 1], dp[i % 2][j - 1]) + 1;
        if (word2[i - 1] === word1[j - 1]) dp[i % 2][j] = dp[(i - 1) % 2][j - 1];
      }
    }

    return dp[word2.length % 2][word1.length];
  },
  // 4 搜索回调函数  
  mySearchFunction: function (value) {
    console.log("mySearchFunction Triggered")
    // do your job here
    this.setData({
      hiddenDropDown: true
    })
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
    console.log("myGobackFunction Triggered")
    // do your job here
    // 示例：返回
    wx.redirectTo({
      url: '../index/index?searchValue=返回'
    })
  },

  tapItem: function(e) {
    console.log("tapping", e.currentTarget);
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