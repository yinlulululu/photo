// miniprogram/pages/sizeList/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    category: "1",
    page: 0,
    photoSizeList: [],
  },

  //点击切换 
  clickTab: function (e) {
    this.setData({
      photoSizeList: [],
      category: e.detail.name
    });
    this.getSizeList()
  },

  //获取数据
  getSizeList() {
    wx.showLoading({
      title: '加载中...',
    })
    const db = wx.cloud.database()
    const MAX_LIMIT = 30
    const num = this.data.page * MAX_LIMIT
    db.collection('photo_size').where({
        category_id: this.data.category
      })
      .skip(num)
      .limit(MAX_LIMIT)
      .get({
        success: res => {
          // console.log(arrNum);
          wx.hideLoading()
          this.setData({
            photoSizeList: res.data
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
    this.getSizeList()
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