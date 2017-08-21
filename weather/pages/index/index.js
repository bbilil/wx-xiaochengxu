//index.js
var util = require('../../utils/util.js')
//获取应用实例
//var app = getApp()
Page({
  data: {
   weatherInfo:null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
   // console.log('option')
    wx.showLoading({
      title: '正在加载中...',
    })
    var that = this
    var city = option.city
    var url = 'http://wthrcdn.etouch.cn/weather_mini'
    wx.request({
      url: url,
      data:{
        city:city
      },
      header:{
        "Content-Type":"application/json,application/json"
      },
      success:function(res){
        var data = res.data
        if(data.status==1000){
          wx.hideLoading()
        }
        //console.log(res)
        //console.log(data)
        
        var weatherList = data.data.forecast        
        for(var i=0;i<weatherList.length;i++){
          weatherList[i].fengli = weatherList[i].fengli.slice(-6,-3)  /*slice可以截取字符串和数组*/   /*当参数为一个参数，当为一个参数时，提取 是以start下标起至末尾(不包含结束)的部分素当start 为0 时， 等于说是 克隆一个新的数组，克 隆后 两个数组进行各自的操作，都互不影响，var clone = array.slice(0); slice() 方法可从已有的数组中返回选定的元素。请注意，该方法并不会修改数组，而是返回一个子数组*/
          
          weatherList[i].low = weatherList[i].low.slice(3)
          weatherList[i].high = weatherList[i].high.slice(3)
        }
       // console.log(typeof (weatherList[0].fengli))
        var todayweather = weatherList[0]
        var otherweather = weatherList.slice(1)  //循环从第二个开始到结束

        that.setData({
          weatherInfo:data.data,
          todayweather: todayweather,
          otherweather: otherweather,
          city:city
        })
      }
    })
  }
})
