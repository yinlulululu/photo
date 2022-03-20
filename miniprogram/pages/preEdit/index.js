// miniprogram/pages/preEdit/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图配置
    autoplay: true,
    interval: 3000,
    duration: 1200,
    detail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const sizeDetail = JSON.parse(decodeURIComponent(options.data))
    this.setData({
      detail: sizeDetail
    })
    const data = {
      "swiperDatas": [{
          "id": 1,
          "imgurl": "./needs/1.jpg"
        },
        {
          "id": 2,
          "imgurl": "./needs/2.jpg"
        },
        {
          "id": 3,
          "imgurl": "./needs/3.jpg"
        }
      ]
    };
    this.setData({
      swiperDatas: data.swiperDatas
    })
  },

  // 相册选择
  chooseImage() {
    //选择打开相册
    wx.chooseMedia({
      count: 1,
      mediaType: 'image',
      sourceType: ['album'],
      sizeType: 'original',
      camera: 'back',
      success: (res) => {
        this.imgUpload(res.tempFiles[0].tempFilePath)
      },
      fail() {
        wx.showToast({
          title: '取消选择',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  // 相机拍照
  chooseCamera() {
    const {
      width,
      height,
      name
    } = this.data.detail
    //选择相机拍照
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.camera']) {
          wx.navigateTo({
            url: '/pages/camera/index',
            success: function (res) {
              res.eventChannel.emit('chooseCamera', {
                width,
                height,
                name
              })
            }
          })
        } else {
          wx.authorize({
            scope: 'scope.camera',
            success() {},
            fail() {
              that.openConfirm()
            }
          })
        }
      },
      fail() {}
    })
  },

  // 开启摄像头
  openConfirm() {
    wx.showModal({
      content: '检测到您没打开访问摄像头权限，是否打开？',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        //点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => {}
          })
        } else {
          console.log('用户点击取消')
        }
      }
    });
  },

  // 上传原图
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
        this.goEditPage(result)
      }).catch((error) => {
        // wx.hideLoading()
        console.log(error)
        wx.showToast({
          title: '人像分割失败'
        })
      })
  },

  // 编辑图片
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