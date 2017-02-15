var postDat = require('../../data/posts-data.js');

Page({
    onTap: function () {
        只有五层子页面所以少用层级跳
        wx.navigateTo({
            url: '../posts/post'
            // 平级跳
        })
        // wx.redirectTo({
        //     url: '../posts/post',

        // })
    }
})