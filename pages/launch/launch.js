const app = getApp()

// pages/launch/launch.js
Page({

  /**
   * Page initial data
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.getUserInfo_permission();
    let timer = setTimeout(() => {
      clearTimeout(timer)
      this.direct()
    }, 2000)
  },

  getUserInfo_permission: function (){
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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
  },
  
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  direct: function (){
    // let auth = utils.ifLogined()
     let url = '/pages/index/index'
    // if (auth) {
    //   url = '/pages/index/index'
    // }
    wx.switchTab({
      url,
    })
  },

  loadUser: function (){
    wx.cloud.init()
    const db = wx.cloud.database()
    var that = this

    db.collection('wxuser').where({
      wxname: userInfo.nickName
    }).get({
      success(res) {
        var user = res.data
        console.log(user)
        if(user.length == 0){
          that.createUser();
        }
      }
    })
  },
  createUser: function (){
    wx.cloud.init()
    const db = wx.cloud.database()
    var that = this
    db.collection('wxuser').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        exp: 0,
        image: userInfo.avatarUrl,
        level:1,
        unionid:"",
        wxname: userInfo.nickName
      },
      success(res) {
        console.log(res)
      },
      fail: console.error
    })
  }


  
})