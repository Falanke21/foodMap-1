
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
    name:'defa_name',
    couponList: ["no data in cloud"],
    url_lis: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
    name:options.name
    })
  },

  onReady: function () {
    console.log("This product is of id: " + this.data.id)
    console.log("This page's name is "+this.data.name)
    this.popup = this.selectComponent("#product");
    const db = wx.cloud.database();
    console.log(db)
    var that = this;
    db.collection('coupon_test').where({
      shop:that.data.name
    }).get({
      success(res){
        console.log(res)
        that.setData({
          couponList:res.data,
        })
      }
    })
    db.collection('img_url').where({
      type: "location_img_url"
    }).get({
      success(res) {
        that.setData({
          url_lis: res.data[0],
        })
      }
    })
  },

  showProduct: function (e) {
    var dbid = e.currentTarget.dataset.index + 1;
    wx.navigateTo({
      url: '../productPage/product?id=' + dbid,
    })
  },
})