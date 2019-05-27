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
    userid:"",
    test: ""
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.setStorageSync('test', "testing testing")
    var test = wx.getStorageSync('test')
    this.setData({
      test: test
    })
    console.log(test)
  },
  // 事件处理函数：跳转到登陆页
  bindUserLogin: function () {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  onShow: function () {
    var that = this
    this.getUserInfo_permission();
    if(this.data.hasUserInfo){
      this.getOpenid();
      this.loadUser();

      
      //离开launch 页面
      let timer = setTimeout(() => {
      clearTimeout(timer)
      this.direct()
    }, 1000)
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
        }else if(user.length == 1){
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
        wxname: nickName,
        wallet: [],
        scanRecord:[]
      },
      success(res) {
        console.log(res)
      },
      fail: console.error
    })
  },
  // 获取用户openid
  getOpenid() {
    var that = this;
    var openid;
    wx.cloud.callFunction({
      name: 'getOpenid',
      complete: res => {
        console.log('云函数获取到的openid: ', res.result.openId)
        openid = res.result.openId;
        that.setData({
          openid: openid
        })
        wx.setStorageSync("userid", res.result.openId)
        var userid = wx.getStorageSync('userid')
        this.setData({
          userid: userid
        })
        console.log('本地openid 已同步为： ',userid)
        app.globalData.openid = this.data.userid
        console.log('Global data 更新为：', app.globalData)
      }
      
    })
    
    return openid
  }


  
})