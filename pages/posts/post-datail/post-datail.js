var postdata = require('../../../data/posts-data.js');
var app = getApp();

Page({
    data: {
        isplaymusci: false,
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        var postId = options.postid;
        var postData = postdata.postList[postId];
        this.setData({
            postData: postData
        });
        this.data.collId = postId;
        // 同步加载缓存
        //  wx.setStorageSync('key',"疾风剑豪")
        // 读取收藏缓存
        var postsCollected = wx.getStorageSync('posts_collected');
        if (postsCollected) {
            var postCollected = postsCollected[postId]
            this.setData({
                collected: postCollected
            })
        }
        else {
            var postsCollected = {};
            wx.setStorageSync('posts_collected', postsCollected);
        };
        // 读取分享缓存
        var postsshared = wx.getStorageSync('posts_shar');
        if (postsshared) {
            var postshar = postsshared[postId]
            this.setData({
                share: postshar
            })
        }
        else {
            var postsshared = {};
            wx.setStorageSync('posts_shar', postsshared);
        };

        // 设置音乐
        if (app.globalDta.g_isplaymusci && app.globalDta.g_musciId === this.data.collId) {
            this.setData({
                isplaymusci: true,
            })
        }
        this.onBackgroundAudio();

    },
    onBackgroundAudio: function (e) {
        // 监听音乐播放状态
        var that = this;
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isplaymusci: true
            });
            app.globalDta.g_isplaymusci = true;
            app.globalDta.g_musciId = that.data.collId;

        });
        // 监听音乐暂停状态
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isplaymusci: false
            });
            app.globalDta.g_isplaymusci = false;
            app.globalDta.g_musciId = null;
        });
        wx.onBackgroundAudioStop(function () {
            that.setData({
                isplaymusci: false
            });
            app.globalDta.g_isplaymusci = false;
            app.globalDta.g_musciId = null;
        })
    },

    // 读取收藏缓存根据数据的布尔值控制收藏图片
    oncollTap: function (e) {
        // this.getpostsCollectedSYC();
        this.getgetpostsCollectedASY();

    },
    // 封装异步本地缓存 方法和同步差不多只是小小改动，但如果没有耦合业务的话不建议用异步，很容易混乱！
    getgetpostsCollectedASY: function () {
        var that = this;
        wx.getStorage({
            key: 'posts_collected',
            success: function (res) {
                var postsCollected = res.data;
                var postCollected = postsCollected[that.data.collId];
                postCollected = !postCollected;
                postsCollected[that.data.collId] = postCollected;
                that.showModal(postsCollected, postCollected);
            },
        })
    },

    // 封装同步本地缓存方法

    getpostsCollectedSYC: function () {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.collId];
        postCollected = !postCollected;
        postsCollected[this.data.collId] = postCollected;
        this.showModal(postsCollected, postCollected);

    },
    // 读取分享缓存根据数据的布尔值控制收藏图片
    onshareTap: function (e) {
        var postsshared = wx.getStorageSync('posts_shar');
        var postshar = postsshared[this.data.collId]
        console.log(postshar);
        postshar = !postshar;
        postsshared[this.data.collId] = postshar;
        this.showActionSheet(postshar, postsshared);
    },

    showActionSheet: function (postshar, postsshared) {
        var that = this;
        var itemlist = ['分享到宝宝圈', '分享到朋友圈', '分享到微博'];
        wx.showActionSheet({
            itemList: itemlist,
            success: function (res) {
                wx.showModal({
                    title: '提示',
                    content: postshar ? itemlist[res.tapIndex] : '是否取消分享',
                    success: function (res) {
                        if (res.confirm) {
                            wx.setStorageSync('posts_shar', postsshared);
                            that.setData({
                                share: postshar,
                            });
                        }
                    }
                })

            },
        })
    },

    showModal: function (postsCollected, postCollected) {
        var that = this;
        wx.showModal({
            title: '提示',
            content: postCollected ? '确认收藏！' : '取消收藏？',
            success: function (res) {
                if (res.confirm) {
                    wx.setStorageSync('posts_collected', postsCollected);
                    that.setData({
                        collected: postCollected,
                    });
                    wx.showToast({
                        title: postCollected ? "收藏成功" : "取消成功",
                        icon: "loading",
                        duration: 400,
                    })
                }
            }
        })
    },
    // 通过之定义setData变量来控制音乐api
    onmusictap: function (e) {
        var musicId = this.data.collId;
        var postdataed = postdata.postList
        var isplaymusic = this.data.isplaymusci;
        if (isplaymusic) {
            // wx.stopBackgroundAudio();
            wx.pauseBackgroundAudio();
            this.setData({
                isplaymusci: false
            });

        } else {
            wx.playBackgroundAudio({
                dataUrl: postdataed[musicId].music.dataUrl,
                title: postdataed[musicId].music.title,
                coverImgUrl: postdataed[musicId].music.coverImgUrl,
            });
            this.setData({
                isplaymusci: true
            });
        }
    },

})