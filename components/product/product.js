// components/product/product.js
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * Component properties
   */
  properties: {
    
  },

  /**
   * Component initial data
   */
  data: {
    flag: true,
  },

  /**
   * Component methods
   */
  methods: {
    hidePopup() {
      this.setData({
        flag: !this.data.flag
      })
    },
    //展示弹框
    showPopup(e) {
      console.log("This calendar looks stupid");
      this.setData({
        flag: !this.data.flag
      },
      )
    }

  }
})
