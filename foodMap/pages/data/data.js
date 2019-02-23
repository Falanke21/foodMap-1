// miniprogram/pages/testGetData/testGetData.js
Page({

  /**
  * Page initial data
  */
  data: {
    long: 0,
    lat: 0,
    address: 'hello',
    test: null,
  },

  /**
  * Lifecycle function--Called when page load
  */
  onLoad: function (options) {
    wx.cloud.init()
    const db = wx.cloud.database()
    var that = this
    that.setData({
      long: 200,
      lat: 200,
      address: 'whats up'
    })
    /** 
    db.collection('location').doc('new bahen').update({
    data:{
    name: 'test success'
    },
    success(res){
    console.log(res.data)
    that.setData({
    test: 250,
    lat: 100,
    address: 'success'
    })
    }
    })
    */

    db.collection('location').where({
      name: "bahen"
    }).get({
      success(res) {
        console.log(res)
        console.log(res.data)
        console.log(res.data.name)
        that.setData({
          long: 100,
          lat: 100,
          address: 'success',
          test: res.data[0].name
        })
      }
    })

  },


})