// miniprogram/pages/edit/index.js
const hexRgb = require('./hex-rgb')
let canOnePointMove = false
let onePoint = {
  x: 0,
  y: 0
}
let twoPoint = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageData: {
      height: 431,
      width: 295,
      name: '一寸',
      tmpOriginImgSrc: 'cloud://yinlu-3bit0.7969-yinlu-3bit0-1302890904/tmp/imgDivision/undefined/2022-03-03/1646320757440-0.1356908205569285.png'
    },
    filePath: 'cloud://yinlu-3bit0.7969-yinlu-3bit0-1302890904/tmp/imgDivision/undefined/2022-03-03/1646320757440-0.1356908205569285.png',
    showScale: 480 / 295,
    rpxRatio: 1, //此值为你的屏幕CSS像素宽度/750，单位rpx实际像素
    showColorPicker: false,
    colorData: {
      //基础色相，即左侧色盘右上顶点的颜色，由右侧的色相条控制
      hueData: {
        colorStopRed: 255,
        colorStopGreen: 0,
        colorStopBlue: 0,
      },
      //选择点的信息（左侧色盘上的小圆点，即你选择的颜色）
      pickerData: {
        x: 0, //选择点x轴偏移量
        y: 480, //选择点y轴偏移量
        red: 0,
        green: 0,
        blue: 0,
        hex: '#000000'
      },
      //色相控制条的位置
      barY: 0
    },
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    initImgWidth: 0,
    initImgHeight: 0,
    originImgWidth: 0,
    originImgHeight: 0,
    scale: 1,
    rotate: 0,
    bgc: '#ffffff',
    photoBg: '#ffffff',
    clothes: [],
    hairs: [],
    cloth: {
      show: false,
      src: '',
      initImgWidth: 0,
      initImgHeight: 0,
      originImgWidth: 0,
      originImgHeight: 0,
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      scale: 1,
      rotate: 0,
    },
    hair: {
      show: false,
      src: '',
      initImgWidth: 0,
      initImgHeight: 0,
      originImgWidth: 0,
      originImgHeight: 0,
      width: 0,
      height: 0,
      left: 0,
      top: 0,
      scale: 1,
      rotate: 0,
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '图片加载中',
    // })
    this.getImageData();
    this.setRpxRatio();
    this.getClothes();
    this.getHairs()
  },

  // 接受参数
  getImageData() {
    const eventChannel = this.getOpenerEventChannel && this.getOpenerEventChannel()
    eventChannel && eventChannel.on('sendImageData', (data) => {
      const {
        width,
        imageDivisionResultFileId
      } = data
      console.log(data)
      this.setData({
        imageData: data,
        showScale: (480 / (+width)),
        filePath: imageDivisionResultFileId
      })
    })
  },

  // 设置屏幕宽度比例
  setRpxRatio() {
    const _this = this
    wx.getSystemInfo({
      success(res) {
        _this.setData({
          rpxRatio: res.screenWidth / 750
        })
      }
    })
  },

  // 获取衣服数据
  async getClothes() {
    await wx.cloud.callFunction({
      name: 'getClothes',
    }).then((res) => {
      this.setData({
        clothes: res.result.data
      })
    })
  },

  // 选择衣服
  selectClothes(e) {
    this.setData({
      cloth: {
        ...this.data.cloth,
        src: e.currentTarget.dataset.url,
        show: true
      }
    })
  },

  // 获取发型数据
  async getHairs() {
    await wx.cloud.callFunction({
      name: 'getHairs',
    }).then((res) => {
      this.setData({
        hairs: res.result.data
      })
    })
  },

  // 选择发型
  selectHairs(e) {
    console.log(e)
    this.setData({
      hair: {
        ...this.data.hair,
        src: e.currentTarget.dataset.url,
        show: true
      }
    })
  },


  // 图片显示成功处理
  bindload: function (e) {
    wx.hideLoading({})
    const that = this
    const photoSizeObj = {
      width: this.data.imageData.width,
      height: this.data.imageData.height
    }
    const {
      width,
      height
    } = e.detail
    const _width = photoSizeObj.width
    const _height = _width * height / width

    const imgLoadSetData = {
      originImgWidth: width,
      originImgHeight: height,
      initImgWidth: _width,
      initImgHeight: _height,
      width: _width,
      height: _height,
      left: _width / 2,
      top: _height / 2 + photoSizeObj.height - _height + 120
    }
    const outerDataName = e.currentTarget.dataset.dataname
    that.setData(outerDataName ? {
      [outerDataName]: {
        ...that.data[outerDataName],
        ...imgLoadSetData
      }
    } : imgLoadSetData)
  },

  // 切换背景
  toggleBg(e) {
    const bgc = e.currentTarget.dataset.color;
    const showColorPicker = bgc === 'custom';
    const photoBg = showColorPicker ? this.data.colorData.pickerData.hex : {
      red: '#F80100',
      blue: '#438edb',
      white: '#ffffff',
      transparent: 'transparent'
    } [bgc]
    this.setData({
      bgc,
      photoBg,
      showColorPicker
    })
  },

  //关闭拾色器
  closeColorPicker() {
    this.setData({
      showColorPicker: false
    })
  },

  //选择改色时触发（在左侧色盘触摸或者切换右侧色相条）
  onChangeColor(e) {
    //返回的信息在e.detail.colorData中
    this.setData({
      colorData: e.detail.colorData,
      photoBg: e.detail.colorData.pickerData.hex
    })
  },

  // 图片合成
  async composeImage() {
    wx.showLoading({
      title: '制作中...',
    })
    const {
      photoBg,
      filePath,
      cloth,
      hair
    } = this.data
    const {
      width,
      height
    } = this.data.imageData


    // 将颜色转为 rgba值
    const bgc = hexRgb(photoBg, {
      format: 'array'
    })
    // 底图
    const baseImg = {
      bgc,
      width,
      height
    }
    // 人像图
    const peopleImg = {
      imgId: filePath,
      src: filePath,
      ...this.computedXY(baseImg, this.data)
    }
    // 发饰图
    const hairImg = {
      imgId: hair.src,
      src: hair.src,
      ...this.computedXY(baseImg, hair)
    }
    // 衣服图
    const clothImg = {
      imgId: cloth.src,
      src: cloth.src,
      ...this.computedXY(baseImg, cloth)
    }
    console.log(baseImg, peopleImg, hairImg, clothImg)
    // 组合图片顺序
    const data = [baseImg, peopleImg, hairImg, clothImg]
    // 合成图片 返回url
    const {
      result
    } = await wx.cloud.callFunction({
      name: 'imageCompose',
      data: {
        imgType: 'jpg',
        dataType: 'url',
        data
      }
    })

    this.downloadAndToComplate(result.value)

  },

  // 下载并跳转
  async downloadAndToComplate(url) {
    let msg = ''
    try {
      // 下载图片到本地
      const {
        tempFilePath,
        dataLength
      } = await this.downloadImg(url)
      const {
        width,
        height,
        name
      } = this.data.imageData
      const size = (dataLength / 1024).toFixed(2)
      msg = `图片像素${width + ' * ' + height}，图片大小${size}kb`

      // 保存图片到相册
      await this.saveImage(tempFilePath)

      // 存入数据库
      const db = wx.cloud.database()
      db.collection('works').add({
        data: {
          name,
          width,
          height,
          size,
          tempFilePath,
          date: this.processDate(new Date())
        }
      }).then(res => {
        console.log(res)
      })

      wx.redirectTo({
        url: './complete/index?msg=' + msg + '&tempFilePath=' + tempFilePath + '&url=' + url,
      })


    } catch (error) {
      console.log(error)
      msg = '下载失败，点击下图预览保存图片。'
      wx.redirectTo({
        url: '../complete/index?msg=' + msg + '&tempFilePath=' + url + '&url=' + url,
      })
    }
  },

  // 计算相对底图的 x ， y
  computedXY(baseImg, imgData) {
    const left = (imgData.left - imgData.initImgWidth / 2)
    const top = (imgData.top - imgData.initImgHeight / 2)
    const noScaleImgHeight = baseImg.width * imgData.initImgHeight / imgData.initImgWidth
    const resultImgWidth = baseImg.width * imgData.scale
    const resultImgHeight = noScaleImgHeight * imgData.scale
    const scaleChangeWidth = (resultImgWidth / 2 - baseImg.width / 2)
    const scaleChangeHeight = (resultImgHeight / 2 - noScaleImgHeight / 2)
    const x = left - scaleChangeWidth
    const y = top - scaleChangeHeight
    return {
      x,
      y,
      width: resultImgWidth,
      height: resultImgHeight
    }
  },

  // 将远端图片，下载到本地
  downloadImg(url) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url, //仅为示例，并非真实的资源
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            console.log(res)
            resolve(res)
          } else {
            reject(res)
          }
        },
        fail(error) {
          reject(error)
        }
      })
    })
  },

  // 保存图片到相册
  saveImage(tempFilePath, isVip) {
    return new Promise((resolve, reject) => {
      wx.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: () => {
          this.setData({
            downloadSuccess: true
          })
          wx.showToast({
            title: '下载成功'
          })
          resolve()
        },
        fail(res) {
          wx.getSetting({
            success(res) {
              if (res.authSetting['scope.writePhotosAlbum']) {
                wx.showToast({
                  title: '下载失败，点击帮助',
                  icon: 'none'
                })
                reject(new Error('错误'))
              } else {
                wx.openSetting({
                  success() {},
                  fail(res) {
                    wx.showToast({
                      title: '失败，写入相册权限未授权',
                      icon: 'none'
                    })
                    reject(new Error('错误'))
                  }
                })
              }
            },
            fail() {
              reject(new Error('错误'))
            }
          })
        },
      })
    })
  },

  touchstart: function (e) {
    var that = this
    if (e.touches.length < 2) {
      canOnePointMove = true
      onePoint.x = e.touches[0].pageX * 2
      onePoint.y = e.touches[0].pageY * 2
    } else {
      twoPoint.x1 = e.touches[0].pageX * 2
      twoPoint.y1 = e.touches[0].pageY * 2
      twoPoint.x2 = e.touches[1].pageX * 2
      twoPoint.y2 = e.touches[1].pageY * 2
    }
  },
  touchmove: function (e) {
    var that = this
    const outerDataName = e.currentTarget.dataset.dataname
    const thatData = outerDataName ? this.data[outerDataName] : that.data

    if (e.touches.length < 2 && canOnePointMove) {
      var onePointDiffX = e.touches[0].pageX * 2 - onePoint.x
      var onePointDiffY = e.touches[0].pageY * 2 - onePoint.y
      const imgSetData = {
        msg: '单点移动',
        left: thatData.left + onePointDiffX,
        top: thatData.top + onePointDiffY
      }
      that.setData(outerDataName ? {
        [outerDataName]: {
          ...that.data[outerDataName],
          ...imgSetData
        }
      } : imgSetData)
      onePoint.x = e.touches[0].pageX * 2
      onePoint.y = e.touches[0].pageY * 2
    } else if (e.touches.length > 1) {
      var preTwoPoint = JSON.parse(JSON.stringify(twoPoint))
      twoPoint.x1 = e.touches[0].pageX * 2
      twoPoint.y1 = e.touches[0].pageY * 2
      twoPoint.x2 = e.touches[1].pageX * 2
      twoPoint.y2 = e.touches[1].pageY * 2
      // 计算角度，旋转(优先)
      var perAngle = Math.atan((preTwoPoint.y1 - preTwoPoint.y2) / (preTwoPoint.x1 - preTwoPoint.x2)) * 180 / Math.PI
      var curAngle = Math.atan((twoPoint.y1 - twoPoint.y2) / (twoPoint.x1 - twoPoint.x2)) * 180 / Math.PI
      if (Math.abs(perAngle - curAngle) > 1) {
        // that.setData({
        // 	msg: '旋转',
        // 	rotate: thatData.rotate + (curAngle - perAngle)
        // })
      } else {
        // 计算距离，缩放
        var preDistance = Math.sqrt(Math.pow((preTwoPoint.x1 - preTwoPoint.x2), 2) + Math.pow((preTwoPoint.y1 - preTwoPoint.y2), 2))
        var curDistance = Math.sqrt(Math.pow((twoPoint.x1 - twoPoint.x2), 2) + Math.pow((twoPoint.y1 - twoPoint.y2), 2))
        const imgSetData = {
          msg: '缩放',
          scale: thatData.scale + (curDistance - preDistance) * 0.005
        }
        that.setData(outerDataName ? {
          [outerDataName]: {
            ...that.data[outerDataName],
            ...imgSetData
          }
        } : imgSetData)
      }
    }
  },
  touchend: function (e) {
    var that = this
    canOnePointMove = false
  },

  processDate(_date) {
    var y = _date.getFullYear();
    var m = _date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = _date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = _date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = _date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    var second = _date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
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