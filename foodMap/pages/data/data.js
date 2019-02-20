// pages/data/data.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  user_info_request: function () {
    var that = this;
    var user_id = wx.getStorageSync('userid');
    wx.request({
      //请求链接 //这里需要改
      url: 'http://wechat.square.com/WechatUser/get_user/userid/',
      //发送的数据 
      data: {
        user_id: user_id
      },
      //成功回调
      success: function (res) {
        that.setData({
          //具体名称要改 //在原本的page里就要有这些variable //记得加上
          user_name: res.data.data.nickname,
          user_level: res.data.data.level,
          user_exp: res.data.data.exp
        })
      },
    })

  },

  populate_map_request: function () {
    var that = this;
    wx.request({
      url: 'http://localhost:443/getMap',
      method: 'GET',
      //header 需要吗？
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)//打印到控制台
        var marker_list = res.data.marker_list;
        if (marker_list == null) {
          var toastText = '数据获取失败';
          wx.showToast({
            title: toastText,
            icon: '',
            duration: 2000
          });
        } else {
          //一个for loop function
          create_marker(list);
        }
      }
    })
  },

  location_info: function () {
    var that = this;
    wx.request({
      url: 'http://localhost:443/getWord',
      data: {
        //rest_id应该要在page的data里define，
        // 在marker onTapde1时候set好
        restarunt_id: that.data.restarunt_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)//打印到控制台
        var message = res.data.message;
        if (message == null) {
          var toastText = '数据获取失败';
          wx.showToast({
            title: toastText,
            icon: '',
            duration: 2000
          });
        } else {
          that.setData({
            rest_name: res.data.data.restarunt_name,
            rest_location: res.data.data.restarunt_location,
            rest_likes: res.data.data.restarunt_likes,
            rest_info: res.data.data.restarunt_info,
          })
        }
      }
    })
  },
  

})