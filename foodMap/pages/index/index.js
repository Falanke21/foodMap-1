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
    this.popup = this.selectComponent("#popup");
  },

  showPopup() {
    this.popup.showPopup();
  },

  onLoad: function () {
    var that = this;
    // 获取定位，并把位置标示出来
    app.getLocationInfo(function (locationInfo) {
      console.log('map', locationInfo);
      that.setData({
        longitude: locationInfo.longitude,
        latitude: locationInfo.latitude,
        markers: [
          {
            id: 0
            , iconPath: '../../image/ic_location.png'
            , longitude: locationInfo.longitude
            , latitude: locationInfo.latitude
            , width: 30
            , height: 30
          }

        ]
      })
    })

    wx.getSystemInfo({
      success: function (res) {
        console.log('getSystemInfo');
        console.log(res.windowWidth);
        that.setData({
          map_width: res.windowWidth,
          map_height: res.windowWidth,
          controls: [
            {
              id: 1,
              iconPath: '/image/locate.png',
              position: {
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

  bindBarcodeInput: function (e) {
    this.setData({
      barcode: e.detail.value
    })
  },

  bindBarcodeFocus: function (e) {
    this.setData({
      hiddenDropdown: false,
      hiddenClear: false
    })
  },

  bindBarcodeBlur: function (e) {
    this.setData({
      hiddenDropdown: true,
      hiddenClear: true
    })
  },

  scan: function (e) {
    var that = this;
    wx.scanCode({
      success: function (res) {
        that.setData({
          barcode: res.result
        });
        that.query(e);
      },

      fail: function () {
        that.setData({
          barcode: "",
          hiddenData: true
        });
      },

      complete: function () {

        // complete

      }
    })
  },

  setDemoData: function (e) {
    this.setData({
      barcode: this.data.demoData
    });
  },

  clear: function (e) {
    this.setData({
      barcode: "",
      hiddenData: true
    });
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
          markers: [
            {
              id: 0,
              iconPath: "../../image/peiqi.png",
              longitude: -79.3832,
              latitude: 43.6532,
              width: 40,
              height: 30
            },
            {
              id: 2,
              iconPath: "../../image/search.png",
              longitude: -79.4142,
              latitude: 43.6532,
              width: 40,
              height: 30
            }, 
            {
              id: 3, 
              iconPath: "../../image/map.png", 
              longitude: 114.3605, 
              latitude: 30.5448, 
              width: 30, 
              height: 30
            }
          ]
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

  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },

  regionchange(e) {
    // 地图发生变化的时候，获取中间点，也就是用户选择的位置
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
    console.log(e.controlId)
    var id = e.controlId
    // 定位
    if (id == 1) {
      this.moveTolocation()
    // 搜索
    } else if (id == 2) {
      this.bindSearchBtn()
    }
    
  }, 
  
  markertap(e) {
    console.log(e)
    wx.navigateTo({
      url: '../popupPage/popupPage'
    })
  }

})