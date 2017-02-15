// pages/movice/movice-more/movice-more.js
var wuxing = require("../../../wuxing/wuxing")
var app = getApp();
Page({
  data: {
    navigationTitle: {},
    movies: {},
    requestUrl: {},
    toCount: 0,
    isEmpty: true,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var cateTip = options.cateTip;
    this.data.navigationTitle = cateTip;
    var dataUrl = "";
    switch (cateTip) {
      case "热门电影":
        dataUrl = app.globalDta.g_doubanHttp + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalDta.g_doubanHttp + "/v2/movie/coming_soon";
        break;
      case "top250":
        dataUrl = app.globalDta.g_doubanHttp + "/v2/movie/top250";
        break;
    };
    this.data.requestUrl = dataUrl;
    wuxing.http(dataUrl, this.callback)
  },
  // 下滚加载
  onReachBottom: function (e) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.toCount + "&count=20";
    wuxing.http(nextUrl, this.callback);
    // wx.showToast({
    //   icon:'loading'
    // })
    wx.showNavigationBarLoading()
  },
  // 上拉刷新
  onPullDownRefresh: function (e) {
    var refertUrl = this.data.requestUrl + "?start=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    wuxing.http(refertUrl, this.callback);

  },
  callback(data) {
    var movies = [];
    for (var index in data.subjects) {
      var subject = data.subjects[index];
      var title = subject.title;
      if (title.length > 6) {
        title = title.substring(0, 6) + "..."
      }
      var temp = {
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        moviedId: subject.id,
        wuxing: wuxing.ConverStart(subject.rating.stars),
      }
      movies.push(temp);
    }
    var totalMovies = {}
    // 假设电影内容不为空，那么我就把这个电影内容（movies）的基础上加上新的电影内容
    if (!this.data.isEmpty) {
      // concat()方法用于连接两个数组
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    };
    this.setData({
      movies: totalMovies
    });
    this.data.toCount = this.data.toCount + 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },
  onReady: function (e) {
    wx.setNavigationBarTitle({
      title: this.data.navigationTitle,
    })
  },

})


