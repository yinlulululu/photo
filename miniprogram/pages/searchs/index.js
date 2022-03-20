// pages/searchs/index.js
import tool from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    photoSizeList: []
  },

  // change
  onChange: tool.debounce(function (e) {
    if (e[0].detail) {
      this.setData({
        value: e[0].detail
      })
      this.searchData()
    } else {
      this.setData({
        value: '',
        photoSizeList: []
      })
    }
  }, 500),

  //搜索数据
  searchData(e) {
    wx.showLoading({
      title: '搜索中...',
    })
    const db = wx.cloud.database()
    const MAX_LIMIT = 6;
    db.collection('photo_size').where({
        name: {
          $regex: '.*' + this.data.value,
          $options: 'i'
        }
      })
      .limit(MAX_LIMIT)
      .get({
        success: res => {
          wx.hideLoading()
          this.setData({
            photoSizeList: res.data,
          });
        }
      })
  },

  // 去尺寸详情
  goNextPage(e) {
    wx.navigateTo({
      url: '/pages/preEdit/index?index=' + e.currentTarget.dataset.index + '&data=' + JSON.stringify(this.data.photoSizeList[e.currentTarget.dataset.index])
    })
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