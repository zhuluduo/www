<template>
    <div class="home-cont">
        <section loian-id='1' class="recommend pull-bottom area-slider clearfix">
            <div class="slider-wrap pull-fl">
                <img :src="img" alt="">
            </div>
            <div class="slider-right pull-fr">
                <ul>
                    <li v-for="item in 6"><img :src="img" alt=""></li>
                </ul>
            </div>
        </section>
        <section loian-id='2' class="douga pull-bottom clearfix" v-for="(item,indexs) in live" :key="indexs">
            <div class="column-left pull-fl">
                <header class="home-cont-header clearfix">
                    <h3 class="header-title">
                        <img :src="xingfang" alt="">
                        <span class="title">正在直播</span>
                    </h3>
                    <div class="header-btn pull-fr">
                        <button class="el-button btn-read"><i class="loian-icon"></i>换一批</button>
                        <button class="el-button btn-more">更多 <i class="loian-icon"></i></button>
                    </div>
                </header>
                <div class="home-cont-main crop-margin">
                    <figure class="home-cont-list pull-fl " v-for="(items,index) in item.recommend" :key="index" >
                        <div @mouseenter="onVer(indexs,index)" @mouseleave="onOut(indexs,index)">
                           <div class="contImg pull-cursor">
                                <img :title='items.title' :src="!items.toggle?items.pic:items.system_cover" alt="">
                            </div>
                            <div class="contTxt">
                                <p class="txt">{{items.remark}}</p>
                                <p class="num ">
                                    <span class="play "><i class="loian-icon"></i> {{items.online}}</span>
                                    <span class="danmu "><i class="loian-icon"></i>14</span>
                                </p>
                            </div>
                        </div>
                    </figure> 
                </div>
            </div>
            <div class="column-right ranking pull-fr">
                <header class="rank-head clearfix">
                    <h3>排行榜</h3>
                    <div class="rank-tab pull-fr">
                        <span class="active">日榜</span>
                        <span>周榜</span>
                    </div>
                </header>
                <div class="rank-main">
                    <ul class="rank-cont">
                        <li class="rank-item" v-for="(items,index) in item.ranking" :key="index">
                            <i class="rank-numm">{{index+1}}</i>
                            <span class="rank-title">{{items.uname}}</span>
                            <div class="rank-detail pull-shadow">
                                这是测试的详情数据
                            </div>
                        </li>
                    </ul>
                    <p class="rank-link pull-cursor">查看更多</p>
                </div>
            </div>
        </section>

    </div>
</template>

<script>
export default {
    data() {
        return {
            active: 0,
            img:require('../../../../static/img/q.jpg'),
            xingfang:'http://imgs.aixifan.com/cms/2017_11_01/1509501641707.gif',
            xingfan:'http://cdn.aixifan.com/dotnet/artemis/u/cms/www/201812/10184949jb5iznff.gif',
            live:[
                {
            "ranking": [  //正在直播
                {
                    "face": "https://i0.hdslb.com/bfs/face/09042ebcde49445793c0a40402e784df79822582.jpg",
                    "link": "https://live.bilibili.com/650",
                    "online": 123067,
                    "roomid": 4350043,
                    "title": "躺鸡王",
                    "uname": "一米八的坤儿"
                },
                {
                    "face": "https://i0.hdslb.com/bfs/face/6bbeb93dd72c60cb7ad2e876b241d0360d7f0d38.gif",
                    "link": "https://live.bilibili.com/246",
                    "online": 86824,
                    "roomid": 26057,
                    "title": "麻将新人第二天，真的很菜！（雀魂）",
                    "uname": "杆菌无敌"
                },
                {
                    "face": "https://i0.hdslb.com/bfs/face/9c7f133022a1532a0f0a3ab164f40593f23f7a4c.jpg",
                    "link": "https://live.bilibili.com/404",
                    "online": 64309,
                    "roomid": 12265,
                    "title": "快乐爬塔一下",
                    "uname": "陈哥1"
                },
                {
                    "face": "https://i1.hdslb.com/bfs/face/35278c5951b5903318c6b56dfecf72411c6c8836.jpg",
                    "link": "https://live.bilibili.com/684",
                    "online": 55019,
                    "roomid": 66251,
                    "title": "【第五人格】喵喵喵~",
                    "uname": "春去丶残秋"
                },
                {
                    "face": "https://i0.hdslb.com/bfs/face/37bfd9a9f40eb9ff52b697e204386ab918ccd742.jpg",
                    "link": "https://live.bilibili.com/387",
                    "online": 47660,
                    "roomid": 280446,
                    "title": "尼蔻尼蔻尼，萌新第一次玩LOL",
                    "uname": "叶落莫言"
                },
                {
                    "face": "https://i2.hdslb.com/bfs/face/4a9f93ec2b4f340e294b5e90ee79943f7f258258.jpg",
                    "link": "https://live.bilibili.com/526",
                    "online": 47184,
                    "roomid": 5311231,
                    "title": "带你见证nova4盛大发布，还有大礼哦",
                    "uname": "青衣才不是御姐呢"
                }
            ],
            "online_total": 6256,
            "dynamic": 617428,
            "text_link": {
                "text": "233秒居然能做这些！",
                "link": "//vc.bilibili.com"
            },
            "recommendAnchor": [],
            "promote": [],
            "recommend": [
                {
                    "areaId": 1,
                    "areaName": "单机联机",
                    "area_v2_id": 107,
                    "area_v2_name": "其他游戏",
                    "area_v2_parent_id": 2,
                    "area_v2_parent_name": "游戏",
                    "face": "https://i1.hdslb.com/bfs/face/6709f57ce01718220127336f140c6f2f86c9bac7.jpg",
                    "link": "https://live.bilibili.com/919919",
                    "online": 20077,
                    "pic": "https://i0.hdslb.com/bfs/live/c78eefcc87802aa6bcf0336f71d87d83117877e5.jpg",
                    "system_cover": "https://i0.hdslb.com/bfs/live/919919.jpg?12171511",
                    "remark": "今天状态很好，肯定能一币",
                    "roomid": 919919,
                    "title": "今天状态很好，肯定能一币",
                    "uname": "木糖纯和庄不纯"
                },
                {
                    "areaId": 10,
                    "areaName": "唱见舞见",
                    "area_v2_id": 190,
                    "area_v2_name": "唱见电台",
                    "area_v2_parent_id": 5,
                    "area_v2_parent_name": "电台",
                    "face": "https://i2.hdslb.com/bfs/face/5e576d42ff2981390f43658cf7b16435e0407c34.jpg",
                    "link": "https://live.bilibili.com/4301689",
                    "online": 3497,
                    "pic": "https://i0.hdslb.com/bfs/live/29a700bca5da13887c7c8890aae536213cbf31fd.jpg",
                    "system_cover": "https://i0.hdslb.com/bfs/live/4301689.jpg?12171512",
                    "remark": "【辛甘】天气变凉注意保暖",
                    "roomid": 4301689,
                    "title": "【辛甘】天气变凉注意保暖",
                    "uname": "-辛甘-"
                },
                {
                    "areaId": 6,
                    "areaName": "生活娱乐",
                    "area_v2_id": 145,
                    "area_v2_name": "视频聊天",
                    "area_v2_parent_id": 1,
                    "area_v2_parent_name": "娱乐",
                    "face": "https://i0.hdslb.com/bfs/face/cfae9838fdf7eff6e755bac3d3eb00e6175b9dd3.jpg",
                    "link": "https://live.bilibili.com/44579",
                    "online": 670,
                    "pic": "https://i0.hdslb.com/bfs/live/room_cover/0e1b33980eab074e73b403a1a80d29a2efdac5ba.jpg",
                    "system_cover": "https://i0.hdslb.com/bfs/live/44579.jpg?12171512",
                    "remark": "我像只聿儿在你的荷塘",
                    "roomid": 44579,
                    "title": "我像只聿儿在你的荷塘",
                    "uname": "萌之聿"
                },
                {
                    "areaId": 6,
                    "areaName": "生活娱乐",
                    "area_v2_id": 145,
                    "area_v2_name": "视频聊天",
                    "area_v2_parent_id": 1,
                    "area_v2_parent_name": "娱乐",
                    "face": "https://i1.hdslb.com/bfs/face/f0605a69f52deba8cf6b5fd7bf624173c9b99cb1.jpg",
                    "link": "https://live.bilibili.com/1445045",
                    "online": 15907,
                    "pic": "https://i0.hdslb.com/bfs/live/user_cover/beffaf088bc3f2fa57326b8891f40a3b6484475b.jpg",
                    "system_cover": "https://i0.hdslb.com/bfs/live/1445045.jpg?12171509",
                    "remark": "一只身体不舒服的腿腿TVT",
                    "roomid": 1445045,
                    "title": "一只身体不舒服的腿腿TVT",
                    "uname": "大腿儿想吃肉"
                },
                {
                    "areaId": 10,
                    "areaName": "唱见舞见",
                    "area_v2_id": 21,
                    "area_v2_name": "视频唱见",
                    "area_v2_parent_id": 1,
                    "area_v2_parent_name": "娱乐",
                    "face": "https://i1.hdslb.com/bfs/face/78bcbb3e173eb49948d6bb3755e8c2cf124e42d9.jpg",
                    "link": "https://live.bilibili.com/9600277",
                    "online": 2499,
                    "pic": "https://i0.hdslb.com/bfs/live/c2f70c68752a96e1f371210b3e8665d367301d17.jpg",
                    "system_cover": "https://i0.hdslb.com/bfs/live/9600277.jpg?12171509",
                    "remark": "你的日系美少女！❤",
                    "roomid": 9600277,
                    "title": "你的日系美少女！❤",
                    "uname": "果果爱喝椰奶"
                },
                {
                    "areaId": 4,
                    "areaName": "电子竞技",
                    "area_v2_id": 86,
                    "area_v2_name": "英雄联盟",
                    "area_v2_parent_id": 2,
                    "area_v2_parent_name": "游戏",
                    "face": "https://i0.hdslb.com/bfs/face/78fa5d4db47cc192fef38b3336dbeae2a4370f98.jpg",
                    "link": "https://live.bilibili.com/11090072",
                    "online": 45410,
                    "pic": "https://i0.hdslb.com/bfs/live/77bc20676eac7695118c01abf1859ebbe6832451.jpg",
                    "system_cover": "https://i0.hdslb.com/bfs/live/11090072.jpg?12171509",
                    "remark": "你系咪傻噶",
                    "roomid": 11090072,
                    "title": "你系咪傻噶",
                    "uname": "Fireloli"
                },
                {
                    "areaId": 3,
                    "areaName": "网络游戏",
                    "area_v2_id": 91,
                    "area_v2_name": "炉石传说",
                    "area_v2_parent_id": 2,
                    "area_v2_parent_name": "游戏",
                    "face": "https://i1.hdslb.com/bfs/face/c1bf58cf846fd8eef4ef688451aee454ce978a14.jpg",
                    "link": "https://live.bilibili.com/78551",
                    "online": 1171,
                    "pic": "https://i0.hdslb.com/bfs/live/room_cover/a45d3002b391259656ad77e2b885e51c530c8632.jpg",
                    "system_cover": "https://i0.hdslb.com/bfs/live/78551.jpg?12171509",
                    "remark": "做一个合格的贪比（我全都要）",
                    "roomid": 78551,
                    "title": "做一个合格的贪比（我全都要）",
                    "uname": "丶慕凡"
                },
                {
                    "areaId": 4,
                    "areaName": "电子竞技",
                    "area_v2_id": 86,
                    "area_v2_name": "英雄联盟",
                    "area_v2_parent_id": 2,
                    "area_v2_parent_name": "游戏",
                    "face": "https://i2.hdslb.com/bfs/face/472c91ccbf385e65999341f33bf4aed06436c1dd.jpg",
                    "link": "https://live.bilibili.com/10248",
                    "online": 3114,
                    "pic": "https://i0.hdslb.com/bfs/live/7266d1cf712e8577f0abdc5e62b08ec616221ba4.jpg",
                    "system_cover": "https://i0.hdslb.com/bfs/live/10248.jpg?12171509",
                    "remark": "LOL",
                    "roomid": 10248,
                    "title": "LOL",
                    "uname": "yuki琥珀"
                },
                {
                    "areaId": 12,
                    "areaName": "手游直播",
                    "area_v2_id": 163,
                    "area_v2_name": "第五人格",
                    "area_v2_parent_id": 3,
                    "area_v2_parent_name": "手游",
                    "face": "https://i2.hdslb.com/bfs/face/07716f23d9963ece103eedc63faa267d5d254199.jpg",
                    "link": "https://live.bilibili.com/283980",
                    "online": 7362,
                    "pic": "https://i0.hdslb.com/bfs/live/f0a8f5c8ccd0889b959eb3922a9952659a26b37e.jpg",
                    "system_cover": "https://i0.hdslb.com/bfs/live/283980.jpg?12171511",
                    "remark": "【第五人格】小鳄鱼上六阶的励志故事",
                    "roomid": 283980,
                    "title": "【第五人格】小鳄鱼上六阶的励志故事",
                    "uname": "KK不打马赛克"
                },
                {
                    "areaId": 10,
                    "areaName": "唱见舞见",
                    "area_v2_id": 190,
                    "area_v2_name": "唱见电台",
                    "area_v2_parent_id": 5,
                    "area_v2_parent_name": "电台",
                    "face": "https://i1.hdslb.com/bfs/face/1ddd6a9b68291b476d93300b06df3cd85ae1df4a.jpg",
                    "link": "https://live.bilibili.com/302816",
                    "online": 6172,
                    "pic": "https://i0.hdslb.com/bfs/live/05f04b4dc2231bb783347d39c63741516549e259.jpg",
                    "system_cover": "https://i0.hdslb.com/bfs/live/302816.jpg?12171511",
                    "remark": "【软】陪伴 ❤",
                    "roomid": 302816,
                    "title": "【软】陪伴 ❤",
                    "uname": "枕边小软"
                }
            ]
        }
            ]
        }
    },
    methods: {
        onVer(ins,index){
          this.$set( this.live[ins].recommend[index],"toggle", true)
        },
        onOut(ins,index){
          this.$set( this.live[ins].recommend[index],"toggle", false)
        }
    },
    mounted() {
    },
}
</script>

<style lang="scss" scoped>
    .pull-fl{float: left;}
    .pull-fr{float:right;}
    .pull-bottom{margin-bottom: 35px;clear: both;}
    .crop-margin{margin-right: -20px;}
    .pull-cursor{cursor: pointer;}
    .clearfix{zoom: 1;}
    .home-cont{
        img{width: 100%;height:100%;}
        .area-slider{
        height:270px;
        padding: 10px 10px 0 10px;
        box-sizing: border-box;
        }
        .slider-wrap{
            width:480px;
            height:248px;
        }
        .slider-right{
            width: 660px;
            height:248px;
            ul{
                margin: 0 -20px -20px 0;
                overflow: hidden;
                li{
                    width: 205px;
                    height:115px;
                    display: inline-block;
                    float: left;
                    vertical-align: top;
                    overflow: hidden;
                    border-radius: 3px;
                    margin: 0 20px 19px 0;
                    cursor: pointer;
                }
            }
        }
        .douga{padding:0 10px;}
        .column-left{
            width: 880px;
            .home-cont-header{
                width: 100%;
                margin-bottom: 10px;
                height: 40px;
                line-height: 40px;
                overflow: hidden;
                .header-title{
                    height: 40px;
                    line-height: 40px;
                    float: left;
                    font-size: 12px;
                }
                img{
                    width: 40px;
                    height: 40px;
                    display: inline-block;
                    border-radius: 0%;
                    margin-right: 12px;
                    float: none;
                }
                .title{
                    font-size: 18px;
                    font-weight: bold;
                    color: #122;
                    display: inline-block;
                    margin-right: 16px;
                    vertical-align: top;
                }
                .header-btn{
                    .btn-read{
                        .loian-icon{
                            display: inline-block;
                            width: 12px;
                            height: 13px;
                            vertical-align: top;
                            transition: all .5s;
                            margin-right: 5px;
                            background-position: -475px -89px;
                        }
                    }
                    .btn-more{
                        .loian-icon{
                            display: inline-block;
                            background-position: -478px -218px;
                            width: 6px;
                            height: 12px;
                            margin: -2px 0 0;
                            vertical-align: middle;
                            transition: all .2s;
                        }
                    }
                }
            }
            .home-cont-main{
                overflow: hidden;
                .home-cont-list{
                    width: 160px;
                    height: 136px;
                    margin-bottom: 18px;
                    margin: 0 20px 20px 0;
                    position: relative;
                    overflow: hidden;
                    .contImg{
                        width: 160px;
                        height: 90px;
                        margin-bottom: 0;
                        display:block;
                        border-radius: 3px;
                        overflow: hidden;
                        position: relative;
                    }
                    .contTxt{
                        font-size: 12px;
                        height: 50px;
                        overflow: hidden;
                        position: relative;
                        .txt{
                            height: 18px;
                            margin-top: 6px;
                            line-height: 18px;
                            overflow: hidden;
                            display: block;
                            font-size: 12px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            color: #222;
                        }
                        .num{
                            margin-top: 4px;
                            width:100%;
                            span{
                                line-height: 16px;
                                height: 18px;
                                display: inline-block;
                                width: 48%;
                                overflow: hidden;
                                font-size: 12px;
                                vertical-align: bottom;
                                color: #99a2aa;
                            }
                            i{
                                display: inline-block;
                                width: 12px;
                                height: 12px;
                                vertical-align: top;
                                margin-right: 5px;
                            }
                            .play{
                                .loian-icon{background-position: -282px -90px;}
                            }
                            .danmu{
                                .loian-icon{background-position: -282px -218px;}
                                text-align: right
                            }
                        }
                    }
                    &:hover .txt{
                        color: #00a1d6;
                        cursor: pointer;
                    }
                }
            }
        }
        .column-right{
            width: 260px;
        }
        .ranking{
            min-height: 360px;
            // overflow: hidden;
            .rank-head{
                margin-bottom: 10px;
                height: 40px;
                line-height:40px;
                overflow: hidden;
                h3{
                    float: left;
                    font-size: 18px;
                    font-weight: 400;
                }
                .rank-tab{
                    span{
                        padding: 0 10px;
                        height: 22px;
                        line-height: 22px;
                        display: inline-block;
                        color: #333;
                        font-size: 12px;
                        border-radius: 3px;
                        border: 1px solid transparent;
                        background: none;
                    }
                    span.active{
                        border-color: #fae7e8;
                        background: rgba(253,76,91,0.1);
                        color: #fd4c5b;
                    }
                }
            }
            .rank-main{
                margin-bottom: 15px;
                position: relative;
                font-size: 12px;
                .rank-cont{
                    min-height: 260px;
                    .rank-item{
                        padding: 0 0 0 28px;
                        position: relative;
                        height: 28px;
                        line-height: 28px;
                        list-style: none;
                        .rank-numm{
                            position: absolute;
                            color: #fff;
                            height: 18px;
                            line-height: 18px;
                            top: 0;
                            left: 0;
                            font-size: 12px;
                            min-width: 12px;
                            text-align: center;
                            background-color: #b8c0cc;
                            border-radius: 4px;
                            padding: 0 3px;
                            font-weight: bolder;
                            font-style: normal;
                        }
                        .rank-title{
                            line-height: 18px;
                            height: 18px;
                            overflow: hidden;
                            color: #222;
                            display: block;
                        }
                        .rank-detail{
                            width:320px;
                            height:180px;
                            box-sizing: border-box;
                            position:absolute;
                            top:-185px;
                            left:0;
                            z-index: 999;
                            display:none;
                            background: #fff;
                            overflow: hidden;
                        }
                        &:hover .rank-title{
                            color: #00a1d6;
                            cursor: pointer;
                        }
                        &:hover .rank-detail{
                            display:block;
                        }
                    }
                }
                .rank-link{
                    display: block;
                    height: 24px;
                    line-height: 24px;
                    background-color: #e5e9ef;
                    text-align: center;
                    border: 1px solid #e0e6ed;
                    color: #222;
                    border-radius: 4px;
                    transition: .2s;
                    &:hover{
                        background-color: #ccd0d7;
                        border-color: #ccd0d7;
                    }
                }
            }
        }
    }
</style>

