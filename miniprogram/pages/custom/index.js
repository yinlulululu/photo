// pages/custom/index.js
import tool from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    width: 295,
    height: 413,
    name: '',
    px: '295*413 px',
    size: '25*35 mm'
  },

  changeName: tool.debounce(function (e) {
    if (e[0].detail) {
      this.setData({
        name: e[0].detail
      })
    }
  }, 500),

  changeWidth: tool.debounce(function (e) {
    if (e[0].detail) {
      this.setData({
        width: Number(e[0].detail),
        px: `${Number(e[0].detail)}*${this.data.height} px`,
        size: `${Math.floor(Number(e[0].detail)/11.8)}*${Math.floor(this.data.height/11.8)} mm`
      })
    }
  }, 500),

  changeHeight: tool.debounce(function (e) {
    if (e[0].detail) {
      this.setData({
        height: Number(e[0].detail),
        px: `${this.data.width}*${Number(e[0].detail)} px`,
        size: `${Math.floor(this.data.width/11.8)}*${Math.floor(Number(e[0].detail)/11.8)} mm`
      })
    }
  }, 500),

  addSize() {
    if (!this.isNull(this.data)) {
      console.log(111)
      wx.showToast({
        title: '非法输入字符',
        icon: 'error',
        duration: 2000
      })
    } else {
      console.log(this.data)
      // 存入数据库
      const db = wx.cloud.database()
      const {
        name,
        width,
        height,
        size,
        px
      } = this.data
      db.collection('photo_size').add({
        data: {
          name,
          width,
          height,
          size,
          px,
          category_id: '4'
        }
      }).then(res => {
        console.log(res)
        wx.showToast({
          title: '已保存',
          duration: 2000
        })
        wx.reLaunch({
          url: '/pages/home/index'
        })
      })
    }
  },

  isNull() {
    const {
      width,
      height,
      name
    } = this.data
    const reg = /^\d+$/;
    if (!name || !reg.test(width) || !reg.test(height)) {
      return false
    } else {
      return true
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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