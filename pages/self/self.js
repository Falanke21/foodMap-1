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
    scanRecord:[],
    likes:0,
    imageUrl: '/image/diamond.png',
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
          scanRecord: res.data[0].scanRecord
        })
        console.log(res.data[0].exp)
        console.log(res.data[0]._id)
        console.log(that.id)
        console.log(that.data.scanRecord)
      },
      fail(res) {
        console.log('fail')
      }
    })

    if (that.level == 1) {
      that.setData({
        imageUrl: '/image/flower.png'
      })
    }
    else if (that.level == 2) {
      that.setData({
        imageUrl: '/image/star.jpg'
      })
    }
    else if (that.level == 3) {
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
        exp : 0,
      })
    }
    this.setData({
      exp: this.data.exp + expIncr
    })

  },

  addLike(location_id){
    console.log(location_id)
    this.setData({
      likes: ++this.data.likes
    })
    var that = this
    db.collection('location').where({
      _id: location_id
    }).get({
      success(res) {
        console.log(that.data.likes)
        db.collection('location').doc(location_id).update({
          data: {
            likes: 20,
          },
          success: res => {
            console.log("========")
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

  gainCredit() {

  },

  scan() {
    var that = this
    var user= []
    wx.scanCode({
      onlyFromCamera: false,
      scanType: [],
      success: function (res) {
        
        //预留判断用户今日扫码，打卡次数或店家二维码是否合法

        //加经验
        // that.gainExp()
        // //加积分
        // that.gainCredit()
        // //存储积分，等级，经验至数据库
        //userLocationArrayList.add(res.result.locationId)
        // wx.showToast({
        //   title: '打卡成功',
        // })
      
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
              that.setData({
                likes: result.data[0].likes
              })
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
                  if (that.data.scanRecord[location_index].date.toLocaleDateString() == new Date().toLocaleDateString()) {
                    if (that.data.scanRecord[location_index].entries <= 1) {
                      that.gainExp();
                      that.gainCredit();
                      that.addLike(location_id);
                      console.log("成功啦1");

                    } else {
                      console.log("exceed tries");
                    }
                    that.data.scanRecord[location_index].entries++;
                  } else {
                    that.data.scanRecord[location_index].date = new Date();
                    that.data.scanRecord[location_index].entries = 1;
                    that.gainExp();
                    that.gainCredit();
                    that.addLike(location_id);
                    console.log("成功啦2");
                  }
                } else {
                  that.data.scanRecord.push({ dbid: location_id, date: new Date(), entries: 1 })
                  that.gainExp();
                  that.gainCredit();
                  that.addLike(location_id);
                  console.log(that.data.scanRecord);
                }

                wx.showToast({
                  title: '打卡' + result.data[0].name + '成功',
                })
                // //加经验
                // that.gainExp()
                // //加积分
                // that.gainCredit()
                //存储积分，等级，经验至数据库

                const newExp = that.data.exp
                const newlvl = that.data.level
                const newScanRecord = that.data.scanRecord
                const newLike = that.data.likes
                
                // db.collection('location').doc(location_id).update({

                //   data: {
                //     likes: newLike
                //   },
                //   success: res => {
                //     console.log(newlike)
                //   },
                //   fail: err => {
                //     icon: 'none',
                //       console.error('[数据库] [更新记录] 失败：', err)
                //   }
                // })
                console.log(location_id)
                console.log(newLike)
                db.collection('wxuser').where({
                  _openid: app.globalData.openid
                }).get({
                  success(res) {
                    db.collection('wxuser').doc(res.data[0]._id).update({
                      data: {
                        exp: newExp,
                        level: newlvl,
                        scanRecord: newScanRecord
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
                //upldate like
                
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

  wallettap(e) {
    console.log("", e)

    wx.navigateTo({
      url: '../wallet/wallet'
    })
    console.log(e.currentTarget.dataset.offsetLeft)
  },

  navmoca(e){

  }
})