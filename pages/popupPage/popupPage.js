// pages/popupPage/popupPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    likes: 0,
    name: 'defa_name',
    images: ["https://6d6f-moca-map-3c18df-1258691048.tcb.qcloud.la/maxresdefault.jpg?sign=b4fed99b8b4ac597f6a981d80608359a&t=1551563642", "https://pbs.twimg.com/profile_images/558329813782376448/H2cb-84q_400x400.jpeg", "https://i.ytimg.com/vi/3flWbxiQeY4/maxresdefault.jpg", "https://pbs.twimg.com/media/CpHIAjtWYAERUMP.jpg"],
    mkid: 0,
    // name: 'defa_name',
    address: 'defa_add',
    describ: 'defa_des',
    hours: 'defa_hours',
    likes: 0
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
  addLike() {
    this.setData({
      likes: ++this.data.likes
    })
  },

  navigate: function(e){
    wx.openLocation({
      latitude: 31.2961220000,
      longitude: 121.5157870000,
      name: !this.data.name,
      address:!this.data.address
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
        console.log(id_l[0])
        that.setData({
          name: id_l[0].name,
          address: id_l[0].address,
          describ: id_l[0].describ,
          hours: id_l[0].hours,
          likes: id_l[0].likes
        })
      }
    })
    console.log(that.data.name)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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