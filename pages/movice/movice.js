var app = getApp();
var wuxing = require("../../wuxing/wuxing.js")
Page({
    data: {
        top: {},
        hot: {},
        ready: {},
        showSearchbox: true,
        hideSearchbox: false,
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var dbTopUrl = app.globalDta.g_doubanHttp + "/v2/movie/top250" + "?start=0&&count=3";
        // console.log(dbTopUrl)
        var dbHotUrl = app.globalDta.g_doubanHttp + "/v2/movie/in_theaters" + "?start=0&&count=3";
        var dbReadyUrl = app.globalDta.g_doubanHttp + "/v2/movie/coming_soon" + "?start=0&&count=3";
        this.getdytop(dbTopUrl, "top", "top250");
        this.getdyhot(dbHotUrl, "hot", "热门电影");
        this.getdyready(dbReadyUrl, "ready", "即将上映");
    },
    // 转跳更多
    onMoreTap: function (e) {
        var cateTip = e.currentTarget.dataset.catetips; //本来是cateTips 但解析器变全小写了了，所以只能跟着写小写，不然就undfined
        wx.navigateTo({
            url: 'movice-more/movice-more?cateTip=' + cateTip,
            success: function (res) {
                // success
            }
        })
    },
    // 跳转到电影详情页
    onMovieList: function (e) {
        var moviedId = e.currentTarget.dataset.moviedid;
        wx.navigateTo({
            url: 'movie-detail/movie-detail?id=' + moviedId,
            success: function (res) {
                console.log(moviedId)
            }
        })

    },
    getdytop: function (url, key, tipkey) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                "Content-Type": "application/wxml"
            }, // 设置请求的 header
            success: function (res) {
                that.processDoubanData(res.data, key, tipkey)
            },
            fail: function () {
                // fail
            },
        })
    },
    getdyhot: function (url, key, tipkey) {
        var that = this; s
        wx.request({
            url: url,
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                "Content-Type": "application/wxml"
            }, // 设置请求的 header
            success: function (res) {
                that.processDoubanData(res.data, key, tipkey)
            },
            fail: function () {
                // fail
            },
        })
    },
    getdyready: function (url, key, tipkey) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                "Content-Type": "appliaction/wxml"
            }, // 设置请求的 header
            success: function (res) {
                that.processDoubanData(res.data, key, tipkey)
            },
            fail: function () {
                // fail
            },
        })
    },
    // 搜索框设置
    onSearchFocus: function (e) {
        this.setData({
            showSearchbox: false,
            hideSearchbox: true,
        })
    },
    onclosebox: function (e) {
        this.setData({
            showSearchbox: true,
            hideSearchbox: false,
        })
    },

    onsearchBlur: function (e) {
        var text = e.detail.value;
        var searchUrl = app.globalDta.g_doubanHttp + "/v2/movie/search?q=" + text;
        this.getdyhot(searchUrl, "searchContent", "");
    },

    // 封装获取内容
    processDoubanData: function (moviesDouban, key, tipkey) {
        var movies = [];
        for (var index in moviesDouban.subjects) {
            var subject = moviesDouban.subjects[index];
            var title = subject.title;
            if (title.length >= 6) {
                title = title.substring(0, 6) + "...";
            };
            var temp = {
                title: title,
                average: subject.rating.average,
                coverageUrl: subject.images.large,
                moviedId: subject.id,
                wuxing: wuxing.ConverStart(subject.rating.stars),
            }
            movies.push(temp);
           
        };
        // 通过绑定key来设置每个模板的key内容
        var readyData = {};
        readyData[key] = {
            movies: movies,
            tipkey: tipkey
        };
        this.setData(readyData)
    },
})