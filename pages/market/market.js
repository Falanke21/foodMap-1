
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

    merchandiseList: [],
    foodList: [],
    lifeList: [],
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
        this.setList(this.data.merchandiseList)
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

  //设置前端 生活与食品商家list
  setList: function (lis) {
    console.log(lis)
    var that = this
    var food = []
    var life = []
    if(lis.length == 0){return;}
    for (var i = 0; i < lis.length; i++) {
      if(lis[i].source == 'food'){
        food.push(lis[i])
      }
      else {
        life.push(lis[i])
      }
    }
    this.setData({
      foodList: food,
      lifeList: life,
    })
    console.log(this.data.foodList)
    console.log(this.data.lifeList)
  },

  showProduct: function(e) {
    var dbid = e.currentTarget.id;
    wx.navigateTo({
      url: '../couponPage/couponPage?shopId=' + dbid,
    })
  },
})