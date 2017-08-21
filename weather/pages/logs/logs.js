//logs.js
var util = require('../../utils/util.js')

Page({
  data: {
    tqInfo:null,
    searchTxt:'',
    disable:true,
    keys:'',
    pos:'',
    city:'',
    todaytq:'',
    tqwd:'' 
  },
  onLoad: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        var longitude = res.longitude
        var latitude = res.latitude
        wx.request({
          url: 'http://ditu.amap.com/service/regeo',//本地的坐标
          data: {
          longitude: longitude,
          latitude: latitude
          },
          header: {
            'Content-Type':'application/json,application/json'
          },
          success: function(res) {
            var shuju = res.data.data
              //console.log(shuju)
            that.setData({   //建立临时数据库，储存数据值，并传给page的data数据库中
              pos:shuju,
              city:shuju.city,
             // searchTxt: shuju.district,
            })
            wx.request({
              url: 'http://wthrcdn.etouch.cn/weather_mini',
              data: {             //url请求中的数据库是url的参数数据，可以更改、添加、赋值，只对url负责。
                city: that.data.city
              },
              header: {
                'Content-Type': 'application.json,application.json'
              },
              success: function (res) {
                console.log(res)
                var tqInfo = res.data.data
                var tqwd = res.data.data
                var tq = res.data.data.forecast   //近几天的天气数据信息
               // for (var i = 0; i < tq.length; i++) {
                 // tq[i].fengli = tq[i].fengli.slice(-6, -3)
                 // tq[i].low = tq[i].low.slice(3)
                 // tq[i].high = tq[i].high.slice(3)
               // }
                var todaytq = tq[0]
                tq[0].fengli = tq[0].fengli.slice(-6, -3)
                that.setData({
                  todaytq: todaytq,
                  tqwd: tqwd
                })
               // console.log(todaytq)
              },
            })
          },
        })
      },
     
    })
    
  },

  searchBtn:function(e){/*触发点击查询 */
    var that= this
    var searchTxt = this.data.searchTxt
    var ziku = new RegExp(/^[\u4E00-\u9FA5]+$/)     /*RegExp() 对象用于存储检索模式。 */
    var url = 'http://wthrcdn.etouch.cn/weather_mini'
    //console.log(url)
    if (ziku.test(searchTxt)) {   /*A.test(B) 方法检索字符串中的指定值。返回值是 true 或 false。A代表正则 */
      wx.request({
        url: url,        
        data:{
          city: searchTxt
        },
        header:{
          'content-type':'application/json,application/json'
        }, 
        success:function(res){
       //   console.log(res)   /*res返回一个statusCode(表示请求数据是否成功的状态码)， 一个status（请求的数据是否有效的状态码，找没找到） */
          if (res.data.status==1000){
            wx.navigateTo({
              url: '../index/index?city=' + searchTxt,
              success:function(res){
             //   console.log('跳转查询页面成功')
              },
              fail:function(){
              //  console.log("fail")
              },
              complete:function(){
            //  console.log("wangcheng")
              }
            })
          }else{
           // var searchTxt = this.data.searchTxt            
            wx.showModal({
              title: '错误提示',
              content: '输入城市名称有误',
              showCancel: true,
              cancelText: '取消',
              cancelColor: 'red',
              confirmText: '重新输入',
              confirmColor: 'blue',
              success:function(res){
                if (res.confirm){
                 // console.log("点击了确认")
                  that.setData({
                    keys: ''
                  })
                }
              }
                          
            })
          }
        }
      })

    }else{
      wx.showToast({
        title: '内容格式如：北京',
        icon: 'info',
        duration: 2000,
        mask: true      
      })
    }
     
  },
  searchTxt:function(e){/* 查询开关是否禁用*/ 
   // console.log(e.detail)
    this.setData({
      disable: e.detail.value==''?true:false,
      searchTxt: e.detail.value
    })
  }

})
