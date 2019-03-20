Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchVal: "",
        resultList: []
    },


    onLoad: function(options) {
        this.setData({
            searchVal: options.key,
        })

    },
    // 这里是页面C的 onUnload 方法
    onUnload: function() {
        var that = this
            //判断页面栈里面的页面数是否大于2
        if (getCurrentPages().length > 2) {
            //获取页面栈
            let pages = getCurrentPages()
                //给上一个页面设置状态
            let curPage = pages[pages.length - 2];
            let data = curPage.data;
            curPage.setData({ 'isBack': true });
        }
    },
    bindKeyInput: function() {
        wx.navigateTo({
            url: `../search?key=${this.data.searchVal}`
        })
    },
    onShow: function() {
        wx.getStorage({
            key: 'searchResult',
            success: (res) => {
                this.setData({
                    resultList: res.data,
                })
            }
        })
    },
    clickPlay: function(e) {
        let item = e.currentTarget.dataset.vid;
        let title = e.currentTarget.dataset.title;
        wx.navigateTo({
            url: `../../index/video-detail/video-detail?id=${item}&title=${title}`
        })
    },
    openDetail: function(e) {
        console.log(e);
        let num = e.currentTarget.dataset.num;
        let item = e.currentTarget.dataset.vid;
        let title = e.currentTarget.dataset.title;
        wx.navigateTo({
            url: `../../index/video-detail/video-detail?id=${item}&num=${num}&title=${title}`
        })
    }

})