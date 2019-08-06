// pages/searchBox/searchBox.js
var WxSearch = require('../../utils/wxSearchView/wxSearchView.js');

Page({

  /**
   * Page initial data
   */
  data: {
    // Results in drop down list
    schrRes: [],
    rankingRes: [],
    rankedRes: [],
    chs_tags: [],
    eng_tags: [],
    img_url_list: [],
    hiddenSchrRes: true
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this
    WxSearch.init(
      that,
      ['川味轩', '云尚米线', "降龙爪爪", "嘿糖", "Snow Lava"],
      ['VRulez', 'R&K Salon', '云顶国养生堂', "COLA PET"],
      that.mySearchFunction,
      that.myGoBackFunction
    );
    this.fetchLocations();
    this.fetchImgUrl();
    this.fetchLocationTags();
  },

  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数

  // Fetch img_urls from the cloud
  fetchImgUrl: function () {
    var that = this;
    wx.cloud.init()
    const db = wx.cloud.database()

    db.collection('img_url').get({
      success(res) {
        that.setData({
          // Default image of respective type
          img_url_list: res.data[0]
        })
      }
    })
  },

  // Fetch location data from the cloud
  fetchLocations: function () {
    wx.cloud.callFunction({
      // cloud function name
      name: 'fetchAllDocRecs',
      data: {
        docName: 'location',
      }
    })
      .then(res => {
        wx.setStorageSync('fetchLocations', res.result.data)
      })
      .catch(console.error);

    var that = this;
    that.setData({
      schrRes: wx.getStorageSync("fetchLocations")
    });
  },

  // Fetch tags of locations from the cloud
  fetchLocationTags: function () {
    var that = this;
    wx.cloud.init()
    const db = wx.cloud.database()
    db.collection('location_tag').get({
      success(res) {
        wx.setStorageSync("loc_tags", res.data)
      }
    })
    that.setData({
      chs_tags: wx.getStorageSync("loc_tags")[0].tags,
      eng_tags: wx.getStorageSync("loc_tags")[1].tags
    })
  },

  // 4 搜索回调函数
  mySearchFunction: function (value) {
    var inputValue = value.trim();
    var that = this;
    console.log("mySearchFunction Triggered")
    // do your job here
    wx.cloud.init()
    const db = wx.cloud.database()
    var locations = []
    db.collection('location').where({
      shopName: {
        $regex: '.*' + inputValue + '.*'
      },
    }).get({
      success(res) {
        console.log("res", res.data)
        locations = res.data

        // When no result is found, display the alternatives list
        if (locations.length == 0) {
          // Unhide the search alternatives list
          that.setData({
            hiddenSchrRes: false
          })
          console.log("No such location")
          wx.showToast({
            title: "没有相似的结果\n从候选中选一个吧",
            icon: 'none',
            duration: 2000,
            masks: true
          })
          // Found only one result, directly jump to it
        } else if (locations.length == 1) {
          console.log("There are only one result")
          wx.showLoading({
            title: '加载中',
          })
          // Load the only result directly
          console.log("Found such location")
          console.log(locations[0])
          var dbid = locations[0].dbid
          setTimeout(function () {
            wx.hideLoading()
            wx.redirectTo({
              url: '../shopPage/shopPage?dbid=' + dbid
            })
          }, 1000)
          // found more than one result, display the options
        } else {
          console.log("Found more than one result")
          wx.showToast({
            title: '找到多个结果',
            icon: 'success',
            duration: 500
          })
          // Unhide the search alternatives list
          that.setData({
            rankedRes: locations
          })
          that.setData({
            hiddenSchrRes: false
          })
        }
      }
    })


  },

  // 5 返回回调函数
  myGoBackFunction: function () {
    // If a list of search alternatives is displayed, hide the list
    if (!this.data.hiddenSchrRes) {
      // 页面数据
      var temData = this.data.wxSearchData;
      // 更新数据
      temData.value = "";
      temData.tipKeys = [];
      // 更新视图
      this.setData({
        wxSearchData: temData,
        hiddenSchrRes: true
      });
    
    // Else when the search histories and hot-searches are being displayed, navigate back
    } else {
      wx.navigateBack({
      })
    }
  },

  tapItem: function (e) {
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