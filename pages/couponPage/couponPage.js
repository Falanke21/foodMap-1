
const MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June.', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id : 0,
    year: new Date().getFullYear(),      // 年份
    month: new Date().getMonth() + 1,    // 月份
    day: new Date().getDate(),
    str: MONTHS[new Date().getMonth()],  // 月份字符串
    shopName:'defa_name',
    couponList: ["no data in cloud"],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      shopId: options.shopId,
      shopName: options.name,
    })
  },

  onReady: function () {
    const db = wx.cloud.database();
    var that = this;
    
    var shopId = parseInt(this.data.shopId);
    db.collection('merchandise').where({
      belong: shopId
    }).get({
      success: function(res){
        console.log(res)
        that.setData({
          couponList:res.data,
        })
      },
    })
  },

  showProduct: function (e) {
    console.log(e)
    var productId = e.currentTarget.id;
    wx.navigateTo({
      url: '../productPage/productPage?id=' + productId,
    })
  },

  toShop: function (e) {
    wx.navigateTo({
      url: '../shopPage/shopPage?dbid=' + this.data.shopId,
    })
  }
})