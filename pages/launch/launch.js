const app = getApp()

// pages/launch/launch.js
Page({

  globalData: {
    appid: 'wx675248299f115b5b',//请勿透露，请勿转载，请勿截图，此程序专属id
    secret: '97ede34cbbd1e55ed7776724df55a69f',//如上
  },

  /**
   * Page initial data
   */
  data: {
    motto: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    openid:''
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    //this.getUserInfo_permission();
    //this.getOpenid();

    // this.loadUser();
    // let timer = setTimeout(() => {
    //   clearTimeout(timer)
    //   this.direct()
    // }, 500)
    
  },
  // 事件处理函数：跳转到登陆页
  bindUserLogin: function () {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  onShow: function () {
    this.getUserInfo_permission();
    if(this.data.hasUserInfo){
      this.getOpenid();
      this.loadUser();

      //离开launch 页面
      let timer = setTimeout(() => {
      clearTimeout(timer)
      this.direct()
    }, 2000)
    }
    
  },

  getUserInfo_permission: function (){
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
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
    console.log("hi")
    console.log(this.data.userInfo.nickName)
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
    console.log("loadUser")
    console.log(this.data.userInfo)
    db.collection('wxuser').where({
      wxname: this.data.userInfo.nickName
    }).get({
      success(res) {
        var user = res.data
        console.log(user)
        console.log(user.length)
        if(user.length == 0){
          console.log("new user")
          that.db_createUser();
        }else{
          console.log("user exits")
        }
      }
    })
  },
  db_createUser: function (){
    wx.cloud.init()
    const db = wx.cloud.database()
    var that = this
    var nickName = this.data.userInfo.nickName

    db.collection('wxuser').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        exp: 0,
        image: this.data.userInfo.avatarUrl,
        level:1,
        openid:this.getOpenid(),
        wxname: nickName
      },
      success(res) {
        console.log(res)
      },
      fail: console.error
    })
  },
  // 获取用户openid
  getOpenid() {
    let that = this;
    var openid;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result)
        openid = res.result.openId;
        that.setData({
          openid: openid
        })
      }
    })
    return openid
  }


  
})