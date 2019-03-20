<template>
    <div id="common-header">
        <div class="top">
            <div class="content" ref="headerContent">
                <div v-if="showLogo" class="tatfook-index" @click="$router.push({path:'/index'})">首页</div>
                <div class="Individual_state" v-if="!user.isValid">
                    <span @click="$router.push({path: '/register/provider'})">我是供应商</span>
                    <span @click="$router.push({path: '/register/demander'})">我是需求方</span>
                </div>
                <div class="nav-list">
                    <div class="nav-item service">
                        <span>制造服务</span>
                        <ul class="drop-down-box">
                            <li @click="$router.push({path:'/deputyTemplate', query: {index:530010}})">3D打印</li>
                            <li @click="$router.push({path:'/deputyTemplate', query: {index:530020}})">机械加工</li>
                            <!-- <li @click="$router.push({path:'/deputy-index3'})">注塑加工</li> -->
                        </ul>
                    </div>
                    <div class="nav-item" @click="$router.push({path:'/manufacturer-library'})">供应商库</div>
                    <div class="nav-item" @click="$router.push({path:'/product-case'})">产品案例</div>
                    <div class="nav-item industry">
                        <span>行业相关</span>
                        <ul class="drop-down-box">
                            <li v-for="(item,index) in moduleList" @click="selectMoule(item)" :key="index">{{item.moduleName}}</li>
                        </ul>
                    </div>
                    <div v-if="user.isValid" class="nav-item message" @click="$router.push({path:'/usercenter/sys-message'})">
                        <span>站内消息</span>
                        <span v-if="messageCount>0"  v-bind:class="{CountLess:true,CountMore:messageCount>99}">{{messageCount>99?"99+":messageCount}}</span>
                    </div>
                    <div class="nav-item car" :class="{'car_Badge':buycarTalcount>0}" @click="$router.push({path:'/buycar'})">
                        <span>购物车</span>
                        <span v-if="buycarTalcount>0"  v-bind:class="{CountLess:true,CountMore:buycarTalcount>99}">{{buycarTalcount>99?"99+":buycarTalcount}}</span>
                    </div>
                    <div class="nav-item lf-border user" :style="{'padding-right':user.isValid?'0px':'25px'}">
                        <span v-if="!user.isValid" @click="login">登录</span>
                        <img @click="$router.push({path:'/usercenter'});" v-if="user.isValid" class="avator" :src="user.portrait?user.portrait:require('../../static/img/icon-user.png')" alt="">
                        <span v-if="user.isValid" @click="$router.push({path:'/usercenter'})">管理中心<i class="el-icon-caret-bottom"></i></span>
                        <ul class="drop-down-box" v-if="user.isValid">
                            <li @click="$router.push({path:'/usercenter/my-require'})" v-if="user.isDemand">我的询盘</li>
                            <li @click="$router.push({path:'/usercenter/received-require'})" v-if="user.isManufacturer">我的报价</li>
                            <li @click="$router.push({path:'/usercenter/company-information'})" v-if="user.companyType==160020">企业档案</li>
                            <li @click="$router.push({path:'/usercenter/account-settings'})">个人设置</li>
                            <li @click="logout">退出登录</li>
                        </ul>
                    </div>
                    <div v-if="!user.isValid" class="nav-item register" @click="$router.push({path: '/register/entry'})">注册</div>
                </div>
            </div>
        </div>
        <div class="search-nav">
            <div class="content" ref="searchContent">
                <div class="logo">
                    <img @click="$router.push({path: '/index'})" src="../../static/img/logo-new.png" alt="">
                </div>
                <div ref="searchBox" class="search-box" :class="((user.isManufacturer&&user.isDemand)||!user.isValid)?'maxs-widthOfdafu':'maxs-width'">
                    <el-input placeholder="请输入内容" @keydown.native="searchByKeyboard($event)" v-model="searchKey" class="input-with-select">
                        <el-select v-model="searchType" slot="prepend" placeholder="请选择" class="pre-select"  @change='searcUrl(searchType)'>
                            <el-option v-for="item in searchData" :key="item.value" :label="item.label" :value="item.value">{{item.label}}</el-option>
                        </el-select>
                        <el-button type="primary" slot="append" class="search-btn" @click="search">搜索</el-button>
                    </el-input>
                </div>
                <div class="pulish-requirement">
                    <!-- <div class="btn" @click.stop="showServiceModal=true">发布需求</div>
                    <div class="btn" v-if="this.isManufacturer!=true"  @click="isManufacturerTag">成为供应商</div> -->
                    <!-- {{user.isValid}} -->
                    <div class="btn" v-if="!user.isValid" @click="$router.push({path: '/register/demander'})">成为需求方</div>
                    <div class="btn" v-if="!user.isValid" @click="$router.push({path: '/register/provider'})">成为供应商</div>
                    <!-- <div class="btn" @click.stop="showServiceModal=true" v-if="user.isValid">发布询盘</div> -->
                    <div class="btn pulish-y" v-if="user.isValid&&this.$LocalStorage.gxzzpt2_consumer().isDemand==true" @click="$router.push({path: '/quote/manual', query:{techniqueType:530020}});">发布询盘</div>
                    <div class="btn pulish-y" v-if="user.isValid&&this.$LocalStorage.gxzzpt2_consumer().isManufacturer==true" @click="$router.push({path:'/enquiry/list'})">查看询盘</div>
                </div>
            </div>
        </div>
        <div @click.stop="hide" class="service-wrapper" v-if="showServiceModal">
            <div @click.stop="empty" class="service-modal">
                <div class="service-item">
                    <div class="title">3D打印</div>
                    <div class="info">完善的3D打印工艺</div>
                    <div class="info">最快10分钟内上机</div>
                    <div class="info">1-7天交货</div>
                    <div class="btn" @click.stop="$router.push({path: '/quote/manual', query:{techniqueType:530010}});showServiceModal=false;">发布需求</div>
                </div>
                <div class="service-item">
                    <div class="title">机械加工</div>
                    <div class="info">CNC、车床加工、五轴</div>
                    <div class="info">最快10分钟内上机</div>
                    <div class="info">1-7天交货</div>
                    <div class="btn" @click.stop="$router.push({path: '/quote/manual', query:{techniqueType:530020}});showServiceModal=false;">发布需求</div>
                </div>
                <!-- <div class="service-item">
                    <div class="title">注塑加工</div>
                    <div class="info">生产速度快、效率高</div>
                    <div class="info">最快10分钟内上机</div>
                    <div class="info">1-7天交货</div>
                    <div class="btn" @click.stop="$router.push({path: '/artificial-quotation', query:{requirementType: 106060, requirementName: '注塑加工'}});showServiceModal=false;">发布需求</div>
                </div> -->
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
export default {
    data() {
        return {
            showLogo: true,
            service:'',
            moduleList:[],
            searchKey: '',
            searchType: 0,
            showServiceModal: false,
            ajaxData: {
                pageIndex: 1,
                pageSize: 5,
                // keyWord: ""
            },
            timer: null,
            searchUrls:{
                url:''
            },
            searchData:[
                {label:'供应商',value:0,url:'/manufacturer-library'},
                {label:'产品案例',value:1,url:'/product-case'},
                {label:'工艺百科',value:2,url:'/crafts-list',index:200010},
                {label:'材料百科',value:3,url:'/crafts-list',index:200020},
                {label:'行业资讯',value:4,url:'/crafts-list',index:200040},
                {label:'平台公告',value:5,url:'/crafts-list',index:200050},
                {label:'行业案例',value:6,url:'/crafts-list',index:200030},
            ],
            isManufacturer:false,
        }
    },
    created() {
        var userJson = window.localStorage.getItem('gxzzpt2_consumer');
        if (userJson) {
            var userObj = JSON.parse(userJson);
            this.setUser(userObj);
            if(userObj.companyType==160010){
                this.isManufacturer=true;
            }else{
                if(userObj.companyType==160020&&userObj.isManufacturer==true){
                    this.isManufacturer=true;
                }else{
                    this.isManufacturer=false;
                }
            }
            //轮询
            this.timer = setInterval(() => {
            this.getMessageCount();
            }, 1000*60);
        }
        this.getModuleList();
        this.getMessageCount();
        this.searchUrls.url='/manufacturer-library'
    },
    mounted() {
        this.getTotalcount()
        /* let self = this;
        var initWindowWidth = document.documentElement.clientWidth;
        var searchContentWidth = self.$refs.searchContent.clientWidth;
        window.onresize = function() {
            initWindowWidth = document.documentElement.clientWidth;
            searchContentWidth = self.$refs.searchContent.clientWidth;
            if ( initWindowWidth < 1200 ) {
                let scaleWidth = 1200 - initWindowWidth;
                if ( !self.user.isValid ) {
                    self.$refs.searchBox.style.width = (645 - scaleWidth) + 'px';
                }  else {
                    self.$refs.searchBox.style.width = (775 - scaleWidth) + 'px';
                }
            }
        } */
    },
    computed: {
        ...mapState({
            user: state => state.user,
            buycarTalcount:state =>state.buytoTalcount,//获取购物车商品总数；
            messageCount:state =>state.messageCount,//获取消息总数；
        }),
    },
    methods: {
        empty() {

        },
        login() {
            this.$login({});
        },
        hide() {
            this.showServiceModal = false;
        },
        searchByKeyboard( e ) {
            if ( e.keyCode == 13 ) {
                this.search();
            }
        },
        //获取服务
        getService() {
            this.$http.post('/custom/service/all').then(( res ) => {
                if ( res.data.code == 200 ) {
                this.service = res.data.data[0];
                }
            })
        },
        ...mapActions(['setUser','setBuyCount','setMessageCount']),
        //轮询接口;
        getMessageCount(){
            this.$http.post('/custom/message/updateMessage', this.ajaxData).then(( res ) => {
                 if (res.data.code == 200) {
                    let messageCount =res.data.unreadCount?res.data.unreadCount:0;
                    this.setMessageCount(messageCount)
                }
            })
        },
        //获取购物车商品数量；
        getTotalcount(){
            const localGoods = JSON.parse(localStorage.getItem("goods"));
            // 先定义 totalcount数量为0;
            let Totalcount = 0;
            for (const keys in localGoods){
                Totalcount += localGoods[keys]
            }
            this.setBuyCount(Totalcount);
        },
        searcUrl(item){
            for(let i=0;i<this.searchData.length;i++){
                if(this.searchData[i].value==item){
                    this.searchUrls=this.searchData[i]
                }
            }
        },
        //查询
        search() {
            let pathInfo=this.$route.path;
            if(pathInfo=='/manufacturer-sort'||pathInfo=='/manufacturer-library'){
                this.$router.push({path:this.$route.path, query: {moduleType:this.searchUrls.index,searchKey: this.searchKey}});
            }else{
                this.$router.push({path:this.searchUrls.url, query: {moduleType:this.searchUrls.index,searchKey: this.searchKey}});
            }
        },
        //获取行业相关
        getModuleList() {
            this.$http.post('/custom/module/all').then(( res ) => {
                if ( res.data.code == 200 ) {
                    this.moduleList = res.data.data;
                }
            })
        },
        //选择行业相关
        selectMoule( item ) {
        this.$router.push({path:'/crafts-list', query:{moduleType:item.moduleType}});
        },
        //登出
        logout() {
            this.$http.post('/exit').then((res) => {
                if (res.data.code == 200) {
                    localStorage.setItem('gxzzpt2_consumer', '');
                    this.setUser('');
                    this.$router.push({ path: '/index'});
                    this.setMessageCount(0)
                }
            });
        },
        //成为供应商
        // isManufacturerTag(){
        //     let routeData = this.$router.resolve({path: '/be-manufacturer'});
        //     window.open(routeData.href, '_blank');
        // },
    }
}
</script>

<style lang="less">
@media screen and (max-width: 1200px) {
    #common-header .top .content{
        padding-right: 15px;
    }
}

#common-header{
    .el-input__inner{
        height: 34px;
    }
    position: fixed;
    top: 0;
    z-index: 101;
    width: 100%;
    div{
        box-sizing: border-box;
    }
    .top{
        height: 46px;
        background: #2e2e2e;
        .content{
            width: 1200px;
            height: 46px;
            margin: 0 auto;
            .tatfook-index{
                float: left;
                height: 46px;
                line-height: 46px;
                color: #fff;
                text-indent: 23px;
                cursor: pointer;
                background: #2e2e2e url(../../static/img/index-home-icon.png) no-repeat center left;
                &:hover{
                    color: #3f8def;
                    text-decoration: underline;
                }
            }
            .Individual_state{
                float: left;
                height: 46px;
                line-height: 46px;
                color: #fff;
                margin-left: 35px;
                span{
                    cursor: pointer;
                    color: #fff;
                    &:hover{
                    color: #3f8def;
                    text-decoration: inherit;
                }
                }
                span+span{margin-left: 30px;}
            }
            .nav-list{
                float: right;
                .nav-item{
                    float: left;
                    padding: 0 25px;
                    height: 46px;
                    color: #fff;
                    line-height: 46px;
                    cursor: pointer;
                    text-align: center;
                    &:hover,& span:hover{
                        color: #3f8def;
                    }
                    span{
                        color: #fff;
                    }
                }
                .car_Badge{
                    margin-right: 22px;
                }
                .lf-border{
                    position: relative;
                    &::before{
                        content: '';
                        position: absolute;
                        top: 14px;
                        left: -2px;
                        width: 1px;
                        border-left: 1px solid #e2e2e2;
                        height: 18px;
                        opacity: 0.5;
                    }
                }
                .register{
                    padding-right: 0;
                    padding-left: 0;
                }
                .user{
                    .avator{
                        display: block;
                        float: left;
                        width: 38px;
                        height: 38px;
                        border-radius: 50%;
                        margin-top: 4px;
                    }
                    span{
                        display: inline-block;
                        line-height: 46px;
                        height: 46px;
                        margin-left: 11px;
                        .el-icon-caret-bottom{
                            color: #fff;
                            font-size: 16px;
                        }
                    }
                }
                .service,.industry,.user{
                    position: relative;
                    &:hover{
                       .drop-down-box{
                           display: block;
                           position: absolute;
                           top: 47px;
                           z-index: 100;
                           left: -20px;
                       }
                    }
                    .drop-down-box{
                        list-style: none;
                        display: none;
                        li{
                            width: 140px;
                            height: 40px;
                            line-height: 40px;
                            background: #2e2e2e;
                            color: #fff;
                            &:hover{
                                background: #545454;
                            }
                        }
                    }
                }
                .message,.car{
                    position: relative;
                    .CountLess{
                        position: absolute;
                        right: 5px;
                        top: 10px;
                        width: 20px;
                        height: 20px;
                        border-radius: 10px;
                        text-align: center;
                        background-color: #e14148;
                        color: #fff;
                        font-size: 12px;
                        line-height: 20px;
                    }
                    .CountMore{
                        width: 30px;
                        right: -4px;
                    }
                }
            }
        }
    }
    .search-nav{
        height: 68px;
        border-bottom: 1px solid #e2e2e2;
        background: #fff;
        .content{
            width: 1200px;
            margin: 0 auto;
            .logo{
                width: 194px;
                float: left;
                img{
                    margin-top: 11px;
                    cursor: pointer;
                }
            }
            .search-box{
                float: left;
                width: 645px;
                margin-top: 15px;
                margin-left: 85px;
                .input-with-select .el-input-group__prepend{
                    background: #fff;
                }
                .el-button--primary{
                    background: #3f8def;
                //    height: 34px;
                }
            }
            .maxs-widthOfdafu{width: 645px;}
            .maxs-width{width: 765px;}
            .pulish-requirement{
                 max-width: 240px;
                 float: left;
                 margin-left: 40px;
                 margin-top: 15px;
                .btn{
                    width: 112px;
                    height: 36px;
                    border: 1px solid #3f8def;
                    text-align: center;
                    line-height: 35px;
                    color: #3f8def;
                    cursor: pointer;
                    float: left;
                    border-radius: 4px;
                    &:hover{
                        background: #3f8def;
                        color: #fff;
                    }
                }
                .btn+.btn{
                margin-left: 12px;
                background: #f9b33c;
                color: #fff;
                border: 1px solid #f9b33c;
                padding: 0 18px;
                &:hover{
                opacity: .8;
                }}
                .btn.pulish-y{
                background: #f9b33c;
                color: #fff;
                border: 1px solid #f9b33c;
                padding: 0 18px;
                &:hover{
                opacity: .8;
                }
                }
            }
        }
    }
    .service-wrapper{
         position: fixed;
         top: 0;
         z-index: 102;
         width: 100%;
         height: 100%;
         background: rgba(0,0,0,.5);
         .service-modal{
            width: 525px;
            height: 320px;
            margin: auto;
            margin-top: 50px;
            padding: 21px 18px;
            background: #fff;
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
            .service-item{
                width: 234px;
                height: 278px;
                background: #f5f5f5;
                padding: 35px;
                float: left;
                & + .service-item {
                    margin-left: 21px;
                }
                .title{
                    font-size: 22px;
                    height: 22px;
                    line-height: 22px;
                    text-align: center;
                    color: #696969;
                    margin-bottom: 35px;
                }
                .info{
                    height: 14px;
                    line-height: 14px;
                    text-align: center;
                    color: #787878;
                    margin-bottom: 24px;
                }
                .btn{
                    width: 88px;
                    height: 32px;
                    color: #3f8def;
                    border: 1px solid #3f8def;
                    border-radius: 4px;
                    height: 32px;
                    line-height: 32px;
                    text-align: center;
                    margin: auto;
                    margin-top: 35px;
                    cursor: pointer;
                    &:hover{
                        background: #3f8def;
                        color: #fff;
                    }
                }
            }
        }
    }

}
@media screen and (max-width: 1024px) {
    #common-header .search-nav .content .search-box{
        width: 450px !important;
    }
}
</style>
