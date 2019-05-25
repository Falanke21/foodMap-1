
const MONTHS = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May.', 'June.', 'July.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year: new Date().getFullYear(),      // 年份
    month: new Date().getMonth() + 1,    // 月份
    day: new Date().getDate(),
    str: MONTHS[new Date().getMonth()],  // 月份字符串

    merchandiseList: ["no data in cloud"],
    url_lis: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  onReady: function () {
    this.popup = this.selectComponent("#product");
    const db = wx.cloud.database();

    var that = this;
    
    db.collection('merchandise').get({
      success(res) {
        // res.data 是一个包含集合中有权限访问的所有记录的数据，不超过 20 条
        that.setData({
          merchandiseList: res.data,
        });
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

    console.log(this.data.url_lis)
  },

  showProduct: function(e) {
    console.log(e.currentTarget.id);
    wx.navigateTo({
      url: '../productPage/productPage?id=' + e.currentTarget.id,
    })
  },
})