// pages/productPage/productPage.js
Page({

  /**
   * Page initial data
   */
  data: {
    id: 0,
    minusStatus:true,
    addedNum:1,
    couponObject: null
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
    })


    const db = wx.cloud.database();
    var that = this;

    var couponId = parseInt(this.data.id);
    db.collection('merchandise').where({
      id: couponId
    }).get({
      success: function (res) {
        console.log(res.data[0])
        that.setData({
          couponObject: res.data[0],
        })
      },
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {
    console.log("This product is of id: " + this.data.id)
  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {
  
  },
  exchange:function(){
    wx.showToast({
      title: '成功',
      icon:"success",
      duration: 200
    })
  },
  addNum: function () {
    var courseCount = this.data.addedNum;
    courseCount++;
    this.setData({
      addedNum: courseCount,
      minusStatus: false
    })
  },
  minusNum: function () {
    var courseCount = this.data.addedNum;
    if (courseCount > 1) {
      courseCount--;
    }
    //数字<=1时，开启 - 按钮的disable状态
    var minusStatus = courseCount <= 1 ? true : false;
    this.setData({
      addedNum: courseCount,
      minusStatus: minusStatus
    });
  }

})