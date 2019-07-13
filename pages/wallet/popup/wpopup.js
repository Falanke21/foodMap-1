// pages/wallet/popup/wpopup.js.js
Page({

  /**
   * Page initial data
   */
  data: {
    alphaData:null,
    betaData:null,
    ticketId:null,
    couponObject: null
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      ticketId: options.ticketId,
    })
    console.log(this.data.ticketId)
    const db = wx.cloud.database();
    var that = this;

    var ticket = parseInt(this.data.ticketId);
    db.collection('merchandise').where({
      id: ticket
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

  modalcnt: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认使用此券？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.alphaClick(null);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },

  alphaClick: function(even) {
    var that = this
    var animation1 = wx.createAnimation({})
    animation1.opacity(0.2).step({duration:1000})
    this.setData({alphaData: animation1.export()})
    var animation2 = wx.createAnimation({})
    animation2.opacity(0).step({ duration:5})
    this.setData({betaData: animation2.export()})
    let timer = setTimeout(() => {
      clearTimeout(timer)
      that.deleteTicket()
      that.increase_count()
      that.direct()
    }, 1000)
    
  },

  direct: function () {
    wx.navigateTo({
      url: '/pages/wallet/wallet'
    })
  },

  getOpenId() {
    var openid = wx.getStorageSync('userid');
    this.setData({
      openId: openid
    })
  },

  deleteTicket() {
    this.getOpenId();
    var userTickets = wx.getStorageSync('userTickets');
    for (var i = 0; i < userTickets.length; i++) {
      if (userTickets[i] == this.data.ticketId) {
        userTickets.splice(i, 1);
        break;
      }
    }
    console.log(userTickets)
    const db = wx.cloud.database();
    db.collection('wxuser').where({
      _openid: this.data.openId
    }).get({
      success(res) {
        db.collection('wxuser').doc(res.data[0]._id).update({
          data: {
            wallet: userTickets
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

  increase_count(){
    const db = wx.cloud.database();
    var that = this;

    var ticket = parseInt(this.data.ticketId);
    // Get current used_num from database
    db.collection('merchandise').where({
      id: ticket
    }).get({
      success: function (res) {
        console.log(res.data[0])
        var use_num = res.data[0].used_num + 1
        // console.log(use_num)
      },
    })
    // Update database
    const dtb = wx.cloud.database();
    dtb.collection('merchandise').where({
      id: ticket
    }).get({
      success(res) {
        console.log(use_num)
        dtb.collection('merchandise').doc(res.data[0].used_num).update({
          data: {
            used_num: use_num
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
})