import util from '../../../utils/util.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        video_id: '',
        isListHidden: true,
        isDescHidden: true,
        isLoading: true,
        isSelected: 1,
        mediaList: null,
        playerUrl: '',
        historyClear: true
    },
    onReady: function(res) {
        this.videoContext = wx.createVideoContext('myVideo')

    },
    onLoad: function(option) {

        console.log(option);

        this.setData({
            video_id: option.id,
            mediaList: null,
        })
        wx.setNavigationBarTitle({
            title: option.title
        })

        if (option.hasOwnProperty('num')) {
            this.requestVideo(option.num);
        } else {
            this.requestVideo();
        }

        // })


    },
    requestVideo: function(num = 0) {
        util.request({
                url: `https://www.easy-mock.com/mock/5b0c37bed0e51c310ce24ab0/iqiyi/media#!method=get`,
                mock: false,
                data: {
                    id: this.data.video_id,
                    tag: 'dramas',
                    langs: 'en'
                }
            })
            .then(res => {
                console.log(res)
                this.setData({
                    mediaList: res,
                    isLoading: false,
                    playerUrl: res.drama_num[num].video_url
                })
                this.pickNum(num);

            })
    },
    openList: function() {
        console.log('dianji')
        this.setData({
            isListHidden: false
        })
    },
    closeList: function() {
        this.setData({
            isListHidden: true
        })
    },
    openDesc: function() {
        let isDescHidden = !this.data.isDescHidden;
        this.setData({
            isDescHidden
        })
    },
    changenum: function(e) {
        let mediaList = this.data.mediaList;
        let playerUrl = this.data.playerUrl
        this.pickNum(e.currentTarget.dataset.num);

    },
    changevideo: function(e) {
        let mediaList = this.data.mediaList;
        let playerUrl = this.data.playerUrl
        for (let i of mediaList.recommend_video) {
            i.selected = parseInt(i.recommend_id) === parseInt(e.currentTarget.dataset.num) + 1
            if (i.selected) {
                playerUrl = i.video_url
            }
        }
        for (let i of mediaList.drama_num) {
            i.selected = false;
        }
        this.setData({
                mediaList,
                playerUrl
            })
            // console.log(this.data.mediaList)

    },
    pickNum: function(num) {
        let mediaList = this.data.mediaList;
        let playerUrl = this.data.playerUrl
        for (let i of mediaList.drama_num) {
            i.selected = parseInt(i.drama_id) === parseInt(num) + 1
            if (i.selected) {
                playerUrl = i.video_url
            }
        }
        for (let i of mediaList.recommend_video) {
            i.selected = false;
        }
        this.setData({
                mediaList,
                playerUrl
            })
            // console.log(this.data.mediaList)
    },
    next: function(e) {
        console.log("end");
    },
    stop: function(e) {
        console.log('stop');
    }
})