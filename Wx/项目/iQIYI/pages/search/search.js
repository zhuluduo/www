import util from '../../utils/util.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchVal: "",
        result: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            searchVal: options.key
        })
        console.log(getCurrentPages())
    },
    //这里是页面B的 onShow 方法
    onShow: function() {
        var that = this
            //如果 isBack 为 true，就返回上一页
        if (that.data.isBack) {
            wx.navigateBack()
        }
    },
    bindKeyInput: function(e) {
        console.log(e.detail.value)
        this.setData({
            searchVal: e.detail.value.trim()
        })
        this.search();
    },
    clear: function() {
        this.setData({
            searchVal: '',
            result: []

        })
    },
    cancel: function() {
        console.log('fanhui')
        wx.navigateBack({
            delta: 1
        })
        this.setData({
            searchVal: ''
        })

    },
    search: function() {
        if (this.data.searchVal != '') {
            util.request({
                    url: `https://www.easy-mock.com/mock/5b0c37bed0e51c310ce24ab0/iqiyi/media#!method=get`,
                    mock: false,
                    data: {
                        key: this.data.searchVal
                    }
                })
                .then(res => {
                    this.setData({
                        result: res
                    })
                    console.log(this.data.result)
                })
        } else {
            this.setData({
                result: []
            })
        }

    },
    resultPage: function() {
        this.search();
        wx.navigateTo({
            url: `search-result/search-result`
        })
    },
    clickResult: function(e) {
        let index = e.currentTarget.dataset.num;
        let searchVal = this.data.searchVal;
        let StorageResult = [];
        let temp = [];
        const result = this.data.result;

        for (let i = 0; i < result.length; i++) {
            if (i == index) {
                temp = result.splice(i, 1);
            }
        }
        StorageResult = temp;
        for (let i in result) {
            StorageResult = [...StorageResult, result[i]]
        }
        wx.setStorage({
            key: 'searchResult',
            data: StorageResult,
            success: function(res) {
                wx.navigateTo({
                    url: `search-result/search-result?key=${searchVal}`
                })
            }
        })
    },
    resultPage: function() {
        let searchVal = this.data.searchVal;

        wx.setStorage({
            key: 'searchResult',
            data: this.data.result,
            success: function(res) {
                wx.navigateTo({
                    url: `search-result/search-result?key=${searchVal}`
                })
            }
        })
    },


})