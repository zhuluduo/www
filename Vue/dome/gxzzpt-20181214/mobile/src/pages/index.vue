<template>
<div>
    <div id="index">
        <div class="swipeBox">
            <mt-swipe :show-indicators="false">
                <mt-swipe-item><img src="../../static/img/banner.png" alt=""></mt-swipe-item>
            </mt-swipe>
        </div>
        <div class="banner">
            <ul>
                <li>
                    <div class="bannerImg" @click="$router.push({path:'/Enquiry'})">
                        <img src="../../static/img/inquiry.png" alt="">
                        <p>最新询盘</p>
                    </div>
                </li>
                <li>
                    <div class="bannerImg" @click="$router.push({path:'/supplierLibrary'})">
                        <img src="../../static/img/factory.png" alt="">
                        <p>找工厂</p>
                    </div>
                </li>
                <li>
                    <div class="bannerImg" @click="$router.push({path:'/productLibrary'})">
                        <img src="../../static/img/product.png" alt="">
                        <p>产品库</p>
                    </div>
                </li>
            </ul>
        </div>
        <div class="inquiry">
            <div class="inquiryTitle">
                <div class="TitleName">
                    <span class="left mainColor">最新询盘 </span>
                </div>
                <div class="more" @click="$router.push({path:'/Enquiry'})">
                    <span class="mainColor">更多</span>
                    <i class="iconfont icon-rightArrows"></i>
                </div>
            </div>
            <div class="inquiryContent">
            <div class="list-boxs">
                <ListSlot   v-for="(item,index) in dataInfo.slice(0,7)" v-bind:key="index" :Index='index' v-bind:image="item.requirementItemList[0].firstModelFileInfo?item.requirementItemList[0].firstModelFileInfo.thumbnailUrl:''" :shopNumber='true' :url='url'  :params="{id:item.id}">
                <span slot='Title'>{{item.requirementItemList[0].itemName}}</span>
                <span slot='Number'> {{item.requirementItemList[0].estimateCount}}件</span>
                <p slot='text3'><span >工艺：{{item.techniqueInfo?item.techniqueInfo.techniqueName:' '}}</span></p>
                <p slot='text4'><span >截止日期：{{item.offerDeadlineTime?item.offerDeadlineTime.split(" ")[0]:''}}</span></p>
                <span slot='btnName'>立即报价</span>
                </ListSlot>
            </div>
            </div>
        </div>
        <div class="registerBtn" v-if="!user.token">
            <mt-button  type="primary" @click="$router.push({path:'/register/entry'})">注册</mt-button>
            <p >免费注册，查看更多询盘</p>
        </div>
    </div>
</div>
</template>
<script>
import ListSlot from '../components/ListSlot';
import RequirmentService from '../services/RequirmentService.js'
import LoginService from '../services/LoginService.js'
import DialogSlot from '../components/DialogSlot.vue';
import {Toast} from 'mint-ui';
export default {
    data(){
        return{
            allLoaded:false,
            InquiriesData: new RequirmentService(),
            loginService: new LoginService,
            url:'/EnquiryDetails',
            dataInfo: [],
            toggle:false,
            user:'',
        }
    },
    created() {
        this.user =this.$LocalStorage.gxzzpt2_mobile();
        if ( this.$route.query.code ) {
            this.loginService.loginByWechat( this.$route.query.code );
        }
    },
    components:{
        ListSlot,  
    },
    mounted(){
       this.LatestInquiry();

    },
    props: [],
    methods: {
        loadTop() {
            // 加载更多数据
            this.$refs.loadmore.onTopLoaded();
        },
        loadBottom() {
        // 加载更多数据
        // this.allLoaded = true;// 若数据已全部获取完毕
        this.$refs.loadmore.onBottomLoaded();
        },
        register(){

        },
        async LatestInquiry(){
            let params={
                pageIndex:1,
                pageSize:10
            }
            var result = await this.InquiriesData.InquiriesList(params)
            this.dataInfo=result.data;
        },
    }

}

</script>

<style lang="scss" scoped>
$mainColor:#3f8def;
#index{
    width: 100%;
    .swipeBox{
        height: 294px;
        width: 100%;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .banner{
        ul{
            margin-bottom: 20px;
            height: 214px;
            display: flex;
            align-items: center;
            background-color: #fff;
            >li{
                flex: 1;
                .bannerImg{
                    text-align: center;
                    img{
                        width: 108px;
                        height: 108px;
                    }
                    p{
                        margin-top: 20px;
                    }
                }
            }
        }
    }
    .inquiry{
        background-color: #fff;
        .inquiryTitle{
            padding: 0 21px;
            height: 86px; 
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1.5px solid #e2e2e2;
            .TitleName{
                font-size: 28px;
                span{font-weight: bold;}
                span::before {
                    content: ".";
                    font-size: 24px;
                    width: 6px;
                    margin-right:8px; 
                    vertical-align: top;
                    background-color: $mainColor;
                }
            }
            .more{
                i{
                    font-size: 24px;
                    color: $mainColor;
                }
            }
        }
        .inquiryContent{
                border-bottom: 1px solid #e2e2e2;
                padding-bottom: 1px;
            ul{
                padding: 0 21px;
                >li{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #e2e2e2;
                    .ContentLeft{
                        display: flex;
                        align-items: center;
                        .inquiryImg{
                            padding: 36px 0;
                            img{
                                width: 96px;
                                height: 96px;
                            }
                        }
                        .inquiryInfo{
                            margin-left: 40px;
                            color: #6b6b6b;
                            i{
                                color: #a09f9f;
                            }
                        }
                    }
                }
                li:last-child{
                    border: none;
                }
            }
        }
    }
    .registerBtn{
        margin-top: 19px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 25px 0;
        background-color: #fff;
        button{
            width: 92px;
	        height: 48px;
            font-size: 22px;
            padding: 0;
            background-color: #3f8def;
        }
         button+ button{
             margin-left: 20px;
         }
        p{
            margin-left: 15px;
        }

    }
    .fz26 {font-size: 26px;}
    .fz24 {font-size: 24px;}
}
</style>
