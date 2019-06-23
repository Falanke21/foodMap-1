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
    couponObject: null
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
        })
      },
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    console.log("This product is of id: " + this.data.id)
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

  exchange:function(){
    var that = this;

    const _ = db.command

    db.collection('wxuser').where({
      _openid: app.globalData.openid
    }).get({
      success(res) {
        db.collection('wxuser').doc(res.data[0]._id).update({
          data: {
            wallet: _.push(that.data.id)
          },
          success: function (res) {
            wx.showToast({
              title: '成功购买！',
              icon: "success",
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
      minusStatus: false
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
      minusStatus: minusStatus
    });
  }

})