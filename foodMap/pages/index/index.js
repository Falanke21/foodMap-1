//index.js

//获取应用实例

const app = getApp()
var QQMapWX = require('../qqmap-wx.js');

// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: '开发密钥（key）' // 必填
});

Page({
  // 引入SDK核心类
  data: {
    barcode: "",
    hiddenLoading: true,
    hiddenData: true,
    hiddenDropdown: true,
    hiddenClear: true,
    longitude: -79.3849,
    init_long: -79.3849,
    init_lat: 43.6529,
    latitude: 43.6529,
    demoData: 'XXXX',
    Product: {},
    map: false
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.cloud.init()
    const db = wx.cloud.database()
    var that = this

    db.collection('location').where({
      type: "restaurant"
    }).get({
      success(res) {
        var lis = res.data
        console.log(lis)
         var mks = that.init_marker(lis);
        console.log(mks)
        that.setData({
          markers: mks
        })

      }
    })

  },

  init_marker: function (lis) {
    var mks = []
    for (var i = 0; i < lis.length; i++) {
      mks.push({
        id: lis[i].id,
        iconPath: "../../image/ic_location.png",
        longitude: lis[i].longtitude,
        latitude: lis[i].latitude,
        width: 40,
        height: 30,
        callout: {
          content: lis[i].name || '',
          fontSize: 14,
          bgColor: "#FFF",
          borderWidth: 1,
          borderColor: "#CCC",
          padding: 4,
          display: "ALWAYS",
          textAlign: "center"
        }

      })
    }
    return mks
  },


  onLoad: function () {
    var that = this;
    // 获取定位，并把位置标示出来
    app.getLocationInfo(function (locationInfo) {
      console.log('map', locationInfo);
      that.setData({
        longitude: locationInfo.longitude,
        latitude: locationInfo.latitude,
      })
    })

    wx.getSystemInfo({
      success: function (res) {
        console.log('getSystemInfo');
        console.log('windowWidth is ' + res.windowWidth);
        console.log('windowHeight is ' + res.windowHeight);
        that.setData({
          map_width: res.windowWidth,
          map_height: res.windowHeight,
          controls: [
            {
              id: 1,
              iconPath: '/image/locate.png',
              position: {
                //left: res.windowWidth * 290 / 375,
                //top: res.windowHeight * 400 / 812,
                left: 290,
                top: 400,
                width: 60,
                height: 60
              },
              clickable: true
            },
            {
              id: 2,
              iconPath: '/image/search.png',
              position: {
                //left: res.windowWidth * 290 / 375,
                //top: res.windowHeight * 330 / 812,
                left: 290,
                top: 330,
                width: 60,
                height: 60
              },
              clickable: true
            }]
        })
      }
    })

    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        that.moveTolocation();
      },
    }),
      that.setData({ init_lat: this.data.latitude, init_long: this.data.longitude })
  },

  
  query: function (e) {
    var url = "https://www.google.com/query";//查询数据的URL
    var that = this;
    if (that.data.barcode == undefined
      || that.data.barcode == null
      || that.data.barcode.length <= 0) {
      that.setData({ hiddenData: true });
      wx.showToast({
        title: '请输入条码',
        image: '/images/fail.png',
        duration: 2000
      });
      return;
    }

    wx.request({
      url: url,
      data: { barcode: that.data.barcode },
      method: 'GET',
      success: function (res) {
        var result = res.data;
        if (result.Status != 0) {
          that.setData({ hiddenData: true });
          wx.showToast({
            title: result.Message,
            image: '/images/fail.png',
            duration: 2000
          })
          return;
        }

        that.setData({ Product: result.Data, hiddenData: false });

        wx.showToast({
          title: "获取数据成功",
          image: '/images/ok.png',
          duration: 2000
        })
      },

      fail: function (e) {
        var toastText = '获取数据失败' + JSON.stringify(e);
        that.setData({
          hiddenLoading: !that.data.hiddenLoading,
          hiddenData: true
        });

        wx.showToast({
          title: toastText,
          icon: '',
          duration: 2000
        })
      },

      complete: function () {
        // complete
      }
    })
  },



  // 事件触发，调用接口
  nearby_search: function () {
    var _this = this;
    // 调用接口
    qqmapsdk.search({
      keyword: 'kfc',  //搜索关键词
      location: '39.980014,116.313972',  //设置周边搜索中心点
      success: function (res) { //搜索成功后的回调
        var mks = []
        for (var i = 0; i < res.data.length; i++) {
          mks.push({ // 获取返回结果，放到mks数组中
            title: res.data[i].title,
            id: res.data[i].id,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng,
            iconPath: "/resources/my_marker.png", //图标路径
            width: 20,
            height: 20
          })
        }

        _this.setData({ //设置markers属性，将搜索结果显示在地图中
          markers: mks
        })
      },

      fail: function (res) {
        console.log(res);
      },

      complete: function (res) {
        console.log(res);
      }
    });
  },

  getLngLat: function () {
    var that = this;
    this.mapCtx = wx.createMapContext("myMap");
    this.mapCtx.getCenterLocation({
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          map: true,
        })
      }
    })
  },

  /**
 * 移动到中心点
 */
  moveTolocation: function () {
    //mapId 就是你在 map 标签中定义的 id
    var mapCtx = wx.createMapContext("myMap");
    mapCtx.moveToLocation();
  },

  regionchange(e) {
    // 地图发生变化的时候，获取中间点，也就是选择的位置
    if (e.type == 'end') {
      this.getLngLat()
    }
  },
  
  bindSearchBtn: function (e) {
    wx.navigateTo({
      url: '/components/searchBox/searchBox'
    })
  }

  , controltap: function (e) {
    console.log('map control id: ' + e.controlId)
    var id = e.controlId
    // 定位
    if (id == 1) {
      this.moveTolocation()
    // 搜索
    } else if (id == 2) {
      this.bindSearchBtn()
    }
    
  }, 
  bindcallouttap: function (e) {
    console.log("头上文字被点击", e)
    wx.navigateTo({
      url: '../popupPage/popupPage',
    })
  },

  markertap(e) {
    console.log("", e)
    wx.navigateTo({
      url: '../popupPage/popupPage'
    })
  }

})