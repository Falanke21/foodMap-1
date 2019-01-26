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
    demoData: 'XXXX',
    Product: {},
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
    var url = "https://www.xxx.com/query";//查询数据的URL
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
nearby_search:function(){
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
      complete: function (res){
        console.log(res);
      }
  });
}
})
