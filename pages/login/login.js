// pages/login/login.js
const app = getApp()
Page({
  data: {
    motto: '发布',
    // 初始化用户信息：userInfo hasUserInfo
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
  },
  // 点击“点击授权一键登录，调用getUserInfo获取用户信息”
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    // 获取到用户信息后，调用wx.navigateBack()返回上一页，即个人中心页，wx.navigateBack()一定要在这个位置：
    wx.navigateBack()
  }
})