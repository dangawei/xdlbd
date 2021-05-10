// pages/login/login.js
const { login} = require('../../api/apiUrl.js');

import { throttle } from '../../utils/util.js';

let app = getApp()
const { Base64 } = require('js-base64/')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  // isClick: true,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const accInfo = wx.getStorageSync('acc_info')
    if (accInfo) {
      this.setData({
        user: accInfo.user,
        password: Base64.decode(accInfo.passW)
      })
    }
    app.isClick = false;
  },
  /**
   * 点击登录
   */
  login: throttle(function () {
    const { user, password } = this.data
    if (!user || !password) {
      wx.showModal({
        title: '温馨提示',
        content: '亲爱的运维人员，您可能忙晕了，账号密码不能为空哦 ~',
      })
      return
    }
    // if (app.isClick) {
    //   return
    // }
    login({ username: user, password,wx:1 }).then((result => {
      if (result.code == 0) {
        var res = result.data.user
        wx.setStorage({ key: 'cookie', data: result.data.token })
        
        app.cookie = result.data.token
        app.token = result.data['w-token']
        app.admin_user_id = res.id
        app.nickname = res.nickname
        app.company_name = res.company_name
        wx.navigateTo({
          url: '../system/system'
        })
        const base = Base64.encode(password)
        const accInfo = { user, passW: base }
        wx.setStorage({ key: 'acc_info', data: accInfo })
        wx.setStorage({ key: 'token', data: result.data['w-token'] })
        wx.setStorage({ key: 'admin_user_id', data: res.id })
        wx.setStorage({ key: 'nickname', data: res.nickname })
        wx.setStorage({ key: 'company_name', data: res.company_name })
        //bi用
        wx.setStorage({ key: 'company_id', data: res.company_id })
        wx.setStorage({ key: 'departments_id', data: res.departments_id })
       
        // common_index({}).then(res =>{
        //   app.admin_user_id = res.userinfo.id
        //   app.nickname = res.userinfo.nickname
        //   app.company_name = res.userinfo.company_name

        //   wx.setStorage({ key: 'admin_user_id', data: res.userinfo.id })
        //   wx.setStorage({ key: 'nickname', data: res.userinfo.nickname })
        //   wx.setStorage({ key: 'company_name', data: res.userinfo.company_name })

        //   return res.userinfo.id
        // }).then(uid =>{
        //   roleright({uid}).then(res => {//获取权限
        //     app.followModule = []
        //     app.operationModule = []
        //     for(let i = 0; i < res.length;i++){
        //       if(i < 6){
        //         app.followModule.push(res[i])
        //         this.traverse(res[i],i)
        //       }else{
        //         app.operationModule.push(res[i])
        //       }
        //     }
        //     wx.setStorage({ key: 'followModule', data: app.followModule })
        //     wx.setStorage({ key: 'operationModule', data: app.operationModule })
        //     wx.navigateTo({
        //       url: '../index/index'
        //     })

        //   }).catch(res => {
        //     this.isClick = true

        //   })
        // }).catch(res =>{
        //   this.isClick = true

        // })
      } else if (result.code == '201') {
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmText: '好的',
          content: '登录过期，请重新登录!',
          success(res) {
            if (res.confirm) {
              wx.reLaunch({
                url: '/pages/login/login',
              })
            }
          }
        })
      }else{
        
        wx.showModal({
          title: '提示',
          showCancel: false,
          confirmText: '好的',
          content: result.msg || '未请求到正确服务数据'
        })
      }
      
    })).catch((res => {
      this.isClick = true
    }))

  }, 1500),

 


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.isClick = true

  },

  /**
   * 清除输入值
   */
  clearMessage: function (e) {
    const that = this
    const type = e.currentTarget.dataset.type
    setTimeout(function () {
      that.setData({
        [type]: ''
      })
    }, 100)
  },
  /**
   * input框输入值
   */
  writeMessage: function (e) {
    const type = e.currentTarget.dataset.type
    this.setData({
      [type]: e.detail.value
    })
  },
  /**
   * input 框失去焦点
   */
  bindinputBlur: function (e) {
    this.setData({
      user: e.detail.value
    })
  }
})