export const getWords = (index) => {
    let user = localStorage.getItem('gxzzpt2_mobile_words');
    var jsonObj = JSON.parse(user);
    for (let i in jsonObj) {
        if (index != undefined) {
            if (i == index) {
                return jsonObj[i].item
            }
        } else {
            return []
        }
    }
};

export const isWechatBrowser = () => {
    let userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}


export const weixin = {
    share: (link, desc, title, imgUrl, timestamp, nonceStr, signature) => {
        wx.config({
            debug: false,
            appId: 'wx32aa0ee4fe7e8e6e',
            timestamp: timestamp,
            nonceStr: nonceStr,
            signature: signature,
            jsApiList: [
                'checkJsApi',
                'onMenuShareAppMessage'
            ]
        });
        wx.ready(function () {
            wx.checkJsApi({
                jsApiList: ['updateAppMessageShareData','onMenuShareAppMessage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
                success: function (res) {
                    // 以键值对的形式返回，可用的api值true，不可用为false
                    // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                }
            });
            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                link: link,
                desc: desc, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: imgUrl, // 分享图标
                success: function () {
                    // 用户确认分享后执行的回调函数
                },
                cancel: function () {
                    // 用户取消分享后执行的回调函数
                }
            });
        });
        wx.error(function (res) {
        })
    }
}



