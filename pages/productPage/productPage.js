// pages/productPage/productPage.js
const app = getApp()
const db = wx.cloud.database();

Page({

  /**
   * Page initial data
   */
  data: {
    id: 0,
    minusStatus:true,
    addedNum:1,
    couponObject: null,
    userCredit: -1,
    creditNeed: 0,
    couponsToAppend: [],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      id: parseInt(options.id),
    })


    var that = this;

    db.collection('merchandise').where({
      id: that.data.id
    }).get({
      success: function (res) {
        console.log(res.data[0])
        that.setData({
          couponObject: res.data[0],
          creditNeed: res.data[0].credit,
        })
      },
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    console.log("This product is of id: " + this.data.id)

    var that = this;
    db.collection('wxuser').where({
      _openid: app.globalData.openid
    }).get({
      success(res) {
        console.log(res)
        that.setData({
          userCredit: res.data[0].credit
        })
        console.log("userCredit is " + that.data.userCredit)
      },
      fail: err => {
        icon: 'none',
          console.error('获取credit失败', err)
        wx.showToast({
          title: '获取credit失败',
          icon: "none",
        })
      }
    })
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

  promptExchange: function() {
    var that = this;
    wx.showModal({
      title: '确定兑换？',
      content: '花费：' + that.data.creditNeed,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.exchange()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  exchange: function(){
    var that = this;

    wx.showLoading({
      title: 'Loading',
    })

    if (this.data.creditNeed > this.data.userCredit) {
      wx.showToast({
        title: '您的Credit不足',
        icon: 'none',
      })
      return
    }

    var temp = [];
    for (var i = 0; i < that.data.addedNum; i++) {
      temp.push(that.data.id)
    }
    this.setData({
      couponsToAppend: temp,
    })
    const _ = db.command

    db.collection('wxuser').where({
      _openid: app.globalData.openid
    }).get({
      success(res) {
        db.collection('wxuser').doc(res.data[0]._id).update({
          data: {
            wallet: _.push(that.data.couponsToAppend),
            credit: _.inc(-1 * that.data.creditNeed)
          },
          success: function (res) {
            wx.showToast({
              title: '成功购买！',
              icon: "success",
              complete: wx.navigateBack({
                delta: 1,
              })
            })
          },
          fail: err => {
            icon: 'none',
              console.error('[数据库] [更新记录] 失败：', err)
            wx.showToast({
              title: '数据库更新失败，购买失败',
              icon: "none",
            })
          }
        })
      },
      fail(res) {
        wx.showToast({
          title: '数据库获取失败，购买失败',
          icon: "none",
        })
      }
    })
  },

  addNum: function () {
    var courseCount = this.data.addedNum;
    courseCount++;
    this.setData({
      addedNum: courseCount,
      minusStatus: false,
      creditNeed: courseCount * this.data.couponObject.credit,
    })
  },

  minusNum: function () {
    var courseCount = this.data.addedNum;
    if (courseCount > 1) {
      courseCount--;
    }
    //数字<=1时，开启 - 按钮的disable状态
    var minusStatus = courseCount <= 1 ? true : false;
    this.setData({
      addedNum: courseCount,
      minusStatus: minusStatus,
      creditNeed: courseCount * this.data.couponObject.credit,
    });
  }

})