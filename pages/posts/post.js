var postDat = require('../../data/posts-data.js');
// 只能用相对路劲

Page({
    data: {
        //小程序没有dom，直接用数据绑定就可以{{}}
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载
        // 因为没服务器数据，我们假设下面的代码是服务取得的

        this.setData({
            posts_key: postDat.postList
        });

    },

    onPostTap(e){
        var postid = e.currentTarget.dataset.postid;
        wx.navigateTo({
          url: 'post-datail/post-datail?postid='+postid
        })
    }

});