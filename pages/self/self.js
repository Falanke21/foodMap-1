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
    id: 0,
    scanRecord: [],
    likes: 0,
    credit: 0,
    imageUrl: '/image/moon.png',
    credit: 150
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

    var that = this;
    db.collection('wxuser').where({
      _openid: app.globalData.openid
    }).get({
      success(res) {
        that.setData({
          exp: res.data[0].exp,
          level: res.data[0].level,
          id: res.data[0]._id,
          scanRecord: res.data[0].scanRecord,
          credit: res.data[0].credit
        })
        // console.log(res.data[0].exp)
        // console.log(res.data[0]._id)
        // console.log(that.id)
        // console.log(that.data.scanRecord)
      },
      fail(res) {
        console.log('fail')
      }
    })

    if (that.level >= 1 && that.level < 5) {
      that.setData({
        imageUrl: '/image/star.png'
      })
    }
    else if (that.level >= 5 && that.level < 10) {
      that.setData({
        imageUrl: '/image/moon.png'
      })
    }
    else if (that.level >= 10 && that.level < 15) {
      that.setData({
        imageUrl: '/image/sun.png'
      })
    }
    else {
      that.setData({
        imageUrl: '/image/diamond.png'
      })
    }

  },

  /**   
   * 生命周期函数--监听页面显示   
   */
  onShow: function () {
    // 为了能兑换券后，刷新持有积分 
    this.onLoad()
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
        levelUpNeed: this.data.levelUpNeed,
        exp: 0,
      })
    }
    this.setData({
      exp: this.data.exp + expIncr
    })

  },

  addLike(location_id) {
    wx.cloud.callFunction({
      name: 'incLikes',
      data: {
        update_id: location_id,
      },
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.error('[云函数] [insertDB] 增加Subject失败', err)
      }
    })
  },

  gainCredit() {
    var creditInc = 1
    this.setData({
      credit: this.data.credit + creditInc
    })
  },

  scan() {
    var that = this
    var user = []
    wx.scanCode({
      onlyFromCamera: false,
      scanType: [],
      success: function (res) {
        // !!!二维码格式： 【年+月+日】+location id!!!
        // e.g. 201907065c7dbbaa0426979891e85e5d

        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp);

        var location_id = res.result.substring(8)
        var year = res.result.substring(0, 4)
        var month = res.result.substring(4, 6)

        //获取年份  
        var Y = date.getFullYear();
        //获取月份  
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);

        console.log(location_id);
        if (Y == year && M == month) {
          db.collection('location').where({ _id: location_id }).get({
            success(result) {

              try {
                var location_index = -1;
                for (var i = 0; i < that.data.scanRecord.length; i++) {
                  if (location_id == that.data.scanRecord[i].dbid) {
                    location_index = i;
                  }
                }
                if (location_index != -1) {
                  console.log(that.data.scanRecord[location_index].date.toLocaleDateString())
                  console.log(new Date().toLocaleDateString());
                  if (that.data.scanRecord[location_index].date.toLocaleDateString() == new Date().toLocaleDateString()) { //看日期
                    if (that.data.scanRecord[location_index].entries <= 1) {
                      console.log(location_id);
                      that.scan_success(location_id);
                      console.log("成功啦1");

                    } else {
                      console.log("exceed tries");
                    }
                    that.data.scanRecord[location_index].entries++;
                  } else {
                    that.data.scanRecord[location_index].date = new Date();
                    that.data.scanRecord[location_index].entries = 1;
                    that.scan_success(location_id);
                    console.log("成功啦2");
                  }
                } else {
                  that.data.scanRecord.push({ dbid: location_id, date: new Date(), entries: 1 })
                  that.scan_success(location_id);
                  console.log(that.data.scanRecord);
                }

                wx.showToast({
                  title: '打卡' + result.data[0].name + '成功',
                })
                
                update_user();

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
            title: '打卡失败',
          })
        }
        console.log("Scan successful")
      },
      fail: function (res) {
        wx.showToast({
          title: '扫描失败',
        })
      },
      complete: function (res) {
        console.log("Scan complete")
      },

    })
  },

  scan_success(location_id){
    this.gainExp();
    this.gainCredit();
    this.addLike(location_id);
  },

  update_user(){
    var newExp = that.data.exp
    var newlvl = that.data.level
    var newScanRecord = that.data.scanRecord
    var newLike = that.data.likes
    var newCredit = that.data.credit

    db.collection('wxuser').where({
      _openid: app.globalData.openid
    }).get({
      success(res) {
        db.collection('wxuser').doc(res.data[0]._id).update({
          data: {
            exp: newExp,
            level: newlvl,
            scanRecord: newScanRecord,
            credit: newCredit
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
  },

  wallettap(e) {
    console.log("", e)

    wx.navigateTo({
      url: '../wallet/wallet'
    })
    console.log(e.currentTarget.dataset.offsetLeft)
  },
  navada(e) {
    wx.navigateTo({
      url: './UTADA/about',
    })
  } ,
  navmoca(e) {
    wx.navigateTo({
      url: './MOCA/about',
    })
  } 
})