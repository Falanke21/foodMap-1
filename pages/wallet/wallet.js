// pages/wallet/wallet.js
Page({

  /**
   * Page initial data
   */
  data: {
    openId: "",
    displayTicket: "",
    hasUserInfo: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  getOpenId() {
    var openid = wx.getStorageSync('userid');
    this.setData({
      openId: openid
    })
  },

  loadTicket() {
    const db = wx.cloud.database()
    var that = this;
    db.collection('wxuser').where({
      _openid: this.data.openId
    }).get({
      success(res) {
        var userTickets = [];
        for (var i = 0; i < res.data[0].wallet.length; i++) {
          userTickets.push(res.data[0].wallet[i])
        };
        wx.setStorageSync('userTickets', userTickets); // 缓存user tickets
      }
    })
    db.collection('merchandise').get({
      success(res) {
        var allTickets = res.data;
        wx.setStorageSync('allTickets', allTickets); // 缓存databse tickets
      }
    })
    var displayT = [];
    var userT = wx.getStorageSync('userTickets')
    var allT = wx.getStorageSync('allTickets')
    for (var i = 0; i < userT.length; i++) {
      for (var j = 0; j < allT.length; j++) {
        if (userT[i] == allT[j].id) {
          allT[j].expire_date = allT[j].expire_date.slice(0, 10);
          displayT.push(allT[j]);
        }
      }
    }
    this.setData({
      displayTicket: displayT
    })
    console.log("these tickets will be displayed")
    console.log(this.data.displayTicket)
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    this.getOpenId()
    console.log('openId is === ' + this.data.openId)
    this.loadTicket()
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function() {

  }
})