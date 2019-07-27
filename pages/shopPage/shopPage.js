// pages/popupPage/popupPage.js
function getRandomColor() {
  const rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    nickName: '',
    avatarUrl: '',
    openId: '',
    flag: true,
    likes: 0,
    name: 'defa_name',
    images: ["https://6d6f-moca-map-3c18df-1258691048.tcb.qcloud.la/maxresdefault.jpg?sign=b4fed99b8b4ac597f6a981d80608359a&t=1551563642", "https://pbs.twimg.com/profile_images/558329813782376448/H2cb-84q_400x400.jpeg", "https://i.ytimg.com/vi/3flWbxiQeY4/maxresdefault.jpg", "https://pbs.twimg.com/media/CpHIAjtWYAERUMP.jpg"],
    mkid: 0,
    // name: 'defa_name',
    address: 'defa_add',
    describ: 'defa_des',
    hours: 'defa_hours',
    imageUrl: [],
    likes: 0,
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

  //回到地图
  backToMap: function () {
    wx.navigateBack();
  },
  //展示弹框
  showPopup() {
    this.setData({
      flag: !this.data.flag
    })
  },
  //赞一哈
  // addLike() {
  // this.setData({
  //   likes: ++this.data.likes
  // })
  // this.addExp()
  // },
  addLike: function (e) {
    wx.switchTab({
      url: '../self/self',
    })
  },


  addExp() {
    var that = this
  },

  navigate: function (e) {
    wx.openLocation({
      latitude: 31.2961220000,
      longitude: 121.5157870000,
      name: !this.data.name,
      address: !this.data.address
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var dbid = options.dbid
    console.log(dbid)
    that.setData({
      mkid: dbid
    })
    console.log(that.data.mkid)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl
          })
        }
      })
    }
    const db = wx.cloud.database()
    var loc_id = parseInt(that.data.mkid)
    const _ = db.command
    db.collection('location').where({
      dbid: loc_id
    }).get({
      success(res) {
        var new_like = that.data.likes
        db.collection('location').doc(res.data[0]._id).update({
          data: {
            likes: _.inc(1)
          },
          success: res => {
            console.log(res)
          },
          fail: err => {
            icon: 'none',
              console.error('[数据库] [更新记录] 失败：', err)
          }
        })
      },
      fail(res) {
        console.log('fail')
      }
    })
  },

  init_img_url: function (lis) {
    var url_lis = []
    for (var i = 0; i < lis.length; i++) {
      url_lis.push(lis[i])
    }
    return url_lis
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
    var that = this
    console.log('onRead')
    wx.cloud.init()
    const db = wx.cloud.database()
    // var that = this
    var id_l
    var loc_id = parseInt(that.data.mkid)
    db.collection('location').where({
      dbid: loc_id
    }).get({
      success(res) {
        id_l = res.data
        //console.log(id_l[0])
        var lis = that.init_img_url(id_l[0].image)
        console.log(lis)
        that.setData({
          name: id_l[0].shopName,
          address: id_l[0].address,
          describ: id_l[0].description,
          hours: id_l[0].hours,
          likes: id_l[0].likes,
          imageUrl: lis
        })
      }
    })

   
    console.log(that.data.images)
    console.log(that.data.imageUrl)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 通过这个函数来从popup page跳转到coupon page
   */
  showCoupon: function (e) {
    console.log(e);
    wx.navigateTo({
      url: '../couponPage/couponPage?name=' + this.data.name + '&shopId=' + this.data.mkid,
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})