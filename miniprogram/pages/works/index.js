// pages/works/index.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    workList: []
  },

  //获取数据
  getSizeList() {
    wx.showLoading({
      title: '加载中...',
    })
    const db = wx.cloud.database()
    db.collection('works').where({
        _openid: getApp().globalData.openid
      })
      .get({
        success: res => {
          console.log(res);
          wx.hideLoading()
          this.setData({
            workList: res.data,
          });
        }
      })
  },

  // 删除
  remove(e) {
    const db = wx.cloud.database()
    const that = this
    Dialog.confirm({
        message: '确定要删除这张证件照吗？',
      }).then(() => {
        // on close
        db.collection('works').doc(e.target.dataset.id).remove({
          success: function (res) {
            console.log(res)
          }
        }).then(res => {
          that.getSizeList()
        })
      })
      .catch(() => {
        // on cancel
      });

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