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

    var that = this;
    db.collection('wxuser').where({
      wxname: app.globalData.openid
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