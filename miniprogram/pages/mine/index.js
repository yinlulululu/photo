// miniprogram/pages/mine/index.js
import tool from '../../utils/util'

const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        activeNames: ['1'],
        activeChildrenNames: ['1'],
        userInfo: {},
        authorized: false, // 用户头像昵称授权
        signed: false,
        canIUseGetUserProfile: true,
        message: ''
    },

    onInput: tool.debounce(function (e) {
        this.setData({
            message: e[0].detail
        })
    }, 500),

    handleClick() {
        // 存入数据库
        const db = wx.cloud.database()
        const {
            message
        } = this.data
        db.collection('message').add({
            data: {
                message
            }
        }).then(res => {
            wx.showToast({
                title: '已提交',
                duration: 2000
            })
            this.setData({
                message: ''
            })
        })
    },

    onChange(event) {
        this.setData({
            activeNames: event.detail,
        });
    },
    onChildrenChange(event) {
        this.setData({
            activeChildrenNames: event.detail,
        });
    },

    // 获取用户信息回调
    bindGetUserInfo(e) {
        if (e.detail.userInfo) {
            this.setUserInfo(e.detail.userInfo)
        }
    },

    // 新的获取用户信息事件回调
    getUserProfile(e) {
        if (this.data.isLatestInfo) return
        wx.getUserProfile({
            desc: '用于完善资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                console.log(res)
                this.setUserInfo(res.userInfo)
            }
        })
    },

    // 设置用户信息
    setUserInfo(userInfo) {
        console.log(userInfo)
        console.log(this.data.userInfo)
        this.setData({
            authorized: !!userInfo?.nickName,
            userInfo: {
                ...this.data.userInfo,
                ...userInfo
            }
        })
        const openid = app.globalData.openid
        console.log(openid)
        if (!openid) return

        wx.cloud.callFunction({
            name: 'setUserInfo',
            data: {
                _openid: openid,
                data: userInfo
            }
        }).then(res => {
            console.log(res)
        })
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (wx.getUserProfile) {
            this.setData({
                canIUseGetUserProfile: true
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    // 从数据库获取用户信息，并更新用户信息
    getUserInfo() {
        const that = this
        const openid = app.globalData.openid
        console.log(openid)
        if (!openid) return
        const db = wx.cloud.database()
        db.collection('user').where({
            _openid: openid
        }).get().then(res => {
            console.log(res)
            this.setData({
                userInfo: res.data[0],
                signed: res.data[0]?.signInDate.trim() === new Date().toDateString().trim()
            })

            // 如果是新接口，就算授权也不能直接获取用户信息，结束执行并设置已有信息
            if (this.data.canIUseGetUserProfile) {
                return this.setUserInfo(res.data[0])
            }

            wx.getSetting({
                success(res) {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                        wx.getUserInfo({
                            success: function (res) {
                                that.setUserInfo(res.userInfo)
                            }
                        })
                    } else {
                        that.setData({
                            authorized: false
                        })
                    }
                }
            })
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.timerFunc()
    },

    // 定时器，解决第一次进入页面没有openid 的问题
    timerFunc() {
        const openid = app.globalData.openid
        if (openid) {
            this.getUserInfo()
        } else {
            setTimeout(() => this.timerFunc(), 3000)
        }
    },
})