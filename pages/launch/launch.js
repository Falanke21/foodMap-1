// pages/launch/launch.js
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    let timer = setTimeout(() => {
      clearTimeout(timer)
      this.direct()
    }, 2000)
  },


  direct: function (){
    // let auth = utils.ifLogined()
     let url = '/pages/index/index'
    // if (auth) {
    //   url = '/pages/index/index'
    // }
    wx.switchTab({
      url,
    })
  },


  
})