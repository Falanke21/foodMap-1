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
        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp);

        var location_id = res.result.substring(6)
        var year = res.result.substring(0, 4)
        var month = res.result.substring(4, 6)

        //获取年份  
        var Y = date.getFullYear();
        //获取月份  
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);

        console.log(location_id)
        if (Y == year && M == month) {
          db.collection('location').where({ _id: location_id }).get({
            success(result) {
              try {
                wx.showToast({
                  title: '打卡' + result.data[0].name + '成功',
                })
                //加经验
                that.gainExp()
                //加积分
                that.gainCredit()
                //存储积分，等级，经验至数据库

                const newExp = that.data.exp
                const newlvl = that.data.level
                console.log(that._id)

                db.collection('wxuser').where({
                  _openid: app.globalData.openid
                }).get({
                  success(res) {
                    db.collection('wxuser').doc(res.data[0]._id).update({
                      data: {
                        exp: newExp,
                        level: newlvl
                      },
                      success: res => {

                      },
                      fail: err => {
                        icon: 'none',
                          console.error('[数据库] [更新记录] 失败：', err)
                      }
                    })
                  },
                  fail(res) {
                    console.log('fail')
                  }
                })
              }
              catch (e) {
                wx.showToast({
                  title: '打卡失败',
                })
              }
            },
            fail(result) {
              wx.showToast({
                title: '打卡失败',
              })
            }
          })
        }
        else {
          wx.showToast({
            title: '二维码已过期',
          })
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