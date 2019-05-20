const app = getApp()
const db = wx.cloud.database()

// pages/self/self.js
Page({

  /**
   * Page initial data
   */
  data: {
    level: 1,
    exp: 0,
    levelUpNeed: 100,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    id: 0
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    // var scene = decodeURIComponent(options.scene);
    // console.log("========")
    // console.log(options);
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
      wwx.getUserInfo({
        withCredentials: true,
        success: function (res) {
          //此处为获取微信信息后的业务方法

        },
        fail: function () {
          //获取用户信息失败后。请跳转授权页面
          wx.showModal({
            title: '警告',
            content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateTo({
                  url: '../login/login',
                })
              }
            }
          })
        }
      })
    }

    var that = this;
    db.collection('wxuser').where({
      wxname: app.globalData.userInfo.nickName
    }).get({
      success(res) {
        that.setData({
          exp: res.data[0].exp,
          level: res.data[0].level,
          id: res.data[0]._id
        })
        console.log(res.data[0].exp)
        console.log(res.data[0]._id)
        console.log(that.id)
      },
      fail(res) {
        console.log('fail')
      }
    })
  },

  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  gainExp() {
    var expIncr = 20
    if (this.data.exp + expIncr >= this.data.levelUpNeed) {
      this.setData({
        level: ++this.data.level,
        levelUpNeed: this.data.levelUpNeed + 100,
      })
    }
    this.setData({
      exp: this.data.exp + expIncr
    })

  },

  gainCredit() {

  },

  scan() {
    var that = this
    wx.scanCode({
      onlyFromCamera: false,
      scanType: [],
      success: function (res) {
       
        //预留判断用户今日扫码，打卡次数或店家二维码是否合法
        // if (userLocationArrayList.indexOf(res.result.locationId ) == -1) {
            //加经验
            // that.gainExp()
            // //加积分
            // that.gainCredit()
            // //存储积分，等级，经验至数据库
            //userLocationArrayList.add(res.result.locationId)
            // wx.showToast({
            //   title: '打卡成功',
            // })
        //}
        if (true) {
          //加经验
          that.gainExp()
          //加积分
          that.gainCredit()
          //存储积分，等级，经验至数据库
          
          wx.showToast({
            title: '打卡成功',
          })

          // console.log(that._id)
          //   db.collection('wxuser').doc(that.id).update({
          //       data : {
          //         exp: that.exp,
          //         level: that.level
          //       },
          //     success: console.log,
          //     fail: console.error
          //   })
        }
        console.log("Scan successful")
      },
      fail: function (res) {
        console.log("Scan fail")
      },
      complete: function (res) {
        console.log("Scan complete")
      },
    })
  },

  wallettap(e) {
    console.log("", e)

    wx.navigateTo({
      url: '../wallet/wallet'
    })
    console.log(e.currentTarget.dataset.offsetLeft)
  }
})