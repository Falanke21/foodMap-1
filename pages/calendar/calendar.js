
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

    //通过云函数调取所有商家
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getLocation',
    })
      .then(res => {
        console.log(res.result.data)
        that.setData({
           merchandiseList: res.result.data,

         });

      })
      .catch(console.error);

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
    var dbid = e.currentTarget.dataset.index+1;
    wx.navigateTo({
      url: '../popupPage/popupPage?dbid=' + dbid,
    })
  },
})