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

  /**
    * Lifecycle function--Called when page load
    */
  onLoad: function (options) {
    this.getOpenId()
    console.log('openId is === ' + this.data.openId)
    this.loadWallet();
    var userT = wx.getStorageSync('userTickets');
    if (userT.length > 0) {
      this.loadTicket();
    }
  },

  tap: function(e) {
    wx.navigateTo({
      url: '/pages/wallet/popup/wpopup'
    })
  },

  getOpenId() {
    var openid = wx.getStorageSync('userid');
    this.setData({
      openId: openid
    })
  },

  loadWallet(){
    const db = wx.cloud.database()
    var that = this;
    db.collection('wxuser').where({
      _openid: this.data.openId
    }).get({
      success(res) {
        console.log(res.data[0].wallet.length)
        if (res.data[0].wallet.length > 0) {
          var userTickets = [];
          for (var i = 0; i < res.data[0].wallet.length; i++) {
            userTickets.push(res.data[0].wallet[i])
          };
          wx.setStorageSync('userTickets', userTickets); // 缓存user tickets
        };
      }
    })
  },

  loadTicket() {
    const db = wx.cloud.database()
    var that = this;
    
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

})