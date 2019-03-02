// miniprogram/pages/testGetData/testGetData.js

function getRandomColor() {
  const rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

Page({

  /**
  * Page initial data
  */
  data: {
    long: 0,
    lat: 0,
    address: 'hello',
    test: null,
    src: '',
    danmuList: [
      {
        text: '第 1s 出现的弹幕',
        color: '#ff0000',
        time: 1
      },
      {
        text: '第 3s 出现的弹幕',
        color: '#ff00ff',
        time: 3
      }]
  },

  inputValue: '',

  onReady(res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  bindInputBlur(e) {
    this.inputValue = e.detail.value
  },

  bindButtonTap() {
    const that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front', 'back'],
      success(res) {
        that.setData({
          src: res.tempFilePath
        })
      }
    })
  },

  bindSendDanmu() {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
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