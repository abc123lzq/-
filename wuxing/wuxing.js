// 思路是用1和和0来控制对应黄星和灰星
function converStart(starts) {
    // 只要第一个数字1~5
    var num = starts.toString().substring(0, 1);
    var array = [];
    // 五颗星循环五次
    for (var i = 1; i <= 5; i++) {
        if (i <= num) {
            // 符合条件的都加入1
            array.push(1)
        } else {
            array.push(0);
        }
    }
    return array;
};
// 多次异步加载豆瓣，干脆把它封装，在callback实现，代码优化
function http(url, callback) {
    wx.request({
        url: url,
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
            "Content-Type":"application/wxml"
        }, // 设置请求的 header
        success: function (res) {
            callback(res.data)
        }
    })
}

module.exports = {
    ConverStart: converStart,
    http:http,
}