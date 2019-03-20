import util from '../../utils/util.js';
import { vedios } from '../../mock.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        vtab: 1,
        vedioList_hot: null,
        vedioList_amuse: null,
        vedioList_variety: null,
        vedioList_information: null,
        line_ml: '70',
        hasMore: true,
        isLoading: true,
        page: 0,
        datasize: 3
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // this.requestVedios();
        this.getList('down');
    },
    getList(type) {
        // 改变加载状态
        this.setData({
            isLoading: true,
            hasMore: true
        })
        type === 'down' ? this.setData({ page: 0 }) : null;
        // 请求数据
        util.request({
            url: 'vedios',
            mock: true,
            data: {
                page: this.data.page, //最后一条
                datasize: this.data.datasize, //每次传几个
                type: this.data.vtab, //第几个tab
                tag: 'vedio',
                langs: 'en'
            }
        }).then(res => {
            console.log(res.data)
                // if (res.res != 0) {
            this.processData(type, res.data, res.res)
            this.setData({
                    isLoading: false
                })
                // }
        }).catch(e => {
            this.setData({
                isLoading: true,
                hasMore: false
            })
            wx.stopPullDownRefresh()
            wx.showToast({ title: `网络错误!`, duration: 1000, icon: "none" })
        })
    },
    processData(type, list, status) {
        console.log('length ' + list.length)
        if (status != 0) {
            if (type === 'up') { // 上滑处理
                if (this.data.vtab == 1) {
                    this.setData({
                        vedioList_hot: this.data.vedioList_hot.concat(list)
                    })
                } else if (this.data.vtab == 2) {
                    this.setData({
                        vedioList_amuse: this.data.vedioList_amuse.concat(list)
                    })
                } else if (this.data.vtab == 3) {
                    this.setData({
                        vedioList_amuse: this.data.vedioList_variety.concat(list)
                    })
                } else if (this.data.vtab == 4) {
                    this.setData({
                        vedioList_amuse: this.data.vedioList_information.concat(list)
                    })
                }

                // 下拉则直接新数据替旧数据
            } else { // 下拉出来
                if (this.data.vtab == 1) {
                    this.setData({
                        vedioList_hot: list
                    })
                } else if (this.data.vtab == 2) {
                    this.setData({
                        vedioList_amuse: list
                    })
                } else if (this.data.vtab == 3) {
                    this.setData({
                        vedioList_variety: list
                    })
                } else if (this.data.vtab == 4) {
                    this.setData({
                        vedioList_information: list
                    })
                }
                wx.stopPullDownRefresh()
            }
            this.setData({
                page: this.data.page + this.data.datasize,
                isLoading: false,
                hasMore: true
            })
        } else {
            if (type === 'down') {
                wx.showToast({ title: `没有数据`, duration: 1500, icon: "none" })
                this.setData({
                    isLoading: false,
                    hasMore: false
                })
            } else {
                this.setData({
                    isLoading: false,
                    hasMore: false
                })
            }
        }
    },
    onPullDownRefresh() {
        this.getList('down');
        this.setData({
            isLoading: true
        })
    },
    // 不明白 
    onReachBottom() {
        if (this.data.isLoading) {
            // 防止数据还没回来再次触发加载
            return;
        }
        this.getList('up');
    },
    changeTab: function(e) {
        let line_ml = this.data.line_ml;
        let vtab = e.currentTarget.dataset.vtab
        switch (vtab) {
            case '1':
                line_ml = '70';
                break;
            case '2':
                line_ml = '260';
                break;
            case '3':
                line_ml = '450';
                break;
            case '4':
                line_ml = '635';
                break;
        }
        this.setData({
            vtab,
            line_ml,
            page: 0
        })
        this.getList('down');
    }

})