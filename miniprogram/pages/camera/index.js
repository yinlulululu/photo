// miniprogram/pages/camera/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cameraPostion: 'back',
    cameraImg: false,
    photoSrc: '',
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getEmitData()
  },

  // 接受参数
  getEmitData() {
    const eventChannel = this.getOpenerEventChannel && this.getOpenerEventChannel()
    eventChannel && eventChannel.on('chooseCamera', (data) => {
      console.log(data)
      this.setData({
        detail: data
      })
    })
  },


  // 反转相机
  reverseCamera() {
    if (this.data.cameraPostion === 'back') {
      this.setData({
        cameraPostion: 'front'
      })
      return
    }
    if (this.data.cameraPostion === 'front') {
      this.setData({
        cameraPostion: 'back'
      })
      return
    }
  },

  // 拍照
  photo() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          photoSrc: res.tempImagePath,
          cameraImg: true,
        })
      }
    })
  },

  // 去上传抠图编辑
  goEditPhoto() {
    if (this.data.photoSrc) {
      this.imgUpload(this.data.photoSrc)
    }
  },

  // 返回拍照
  goBackPhoto() {
    this.setData({
      cameraImg: false,
      photoSrc: ''
    })

  },

  // 上传原图， 后使用百度人像分割
  imgUpload(filePath) {
    const openid = app.globalData.openid
    if (!openid) return
    wx.showLoading({
      title: '图像检测中',
    })
    const fileName = filePath.split('tmp/')[1] || filePath.split('tmp_')[1];
    wx.cloud.uploadFile({
        cloudPath: `tmp/originfile/${openid}/${new Date().Format('yyyy-MM-dd')}/${fileName}`,
        filePath
      })
      .then(res => {
        this.imageDivision(res.fileID)
      })
      .catch(error => {
        console.log(error)
        wx.showToast({
          title: '图片上传失败',
          icon: 'error'
        })
      })
  },

  // 使用百度人像分割
  imageDivision(fileID) {
    wx.cloud.callFunction({
        name: 'imageDivision',
        data: {
          fileID
        }
      })
      .then(({
        result
      }) => {
        console.log(result)
        if (result) {
          this.goEditPage(result)
        } else {
          wx.showToast({
            title: '请重新拍照',
            icon: 'error'
          })
          this.goRepeat()
        }
      }).catch((error) => {
        console.log(error)
        wx.hideLoading()
        wx.showToast({
          title: '人像分割失败',
          icon: 'error'
        })
      })
  },

  /**
   * 去编辑页面
   */
  goEditPage(data) {
    const {
      width,
      height,
      name
    } = this.data.detail
    wx.navigateTo({
      url: '/pages/edit/index',
      success: function (res) {
        res.eventChannel.emit('sendImageData', {
          ...data,
          width,
          height,
          name
        })
      }
    })
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