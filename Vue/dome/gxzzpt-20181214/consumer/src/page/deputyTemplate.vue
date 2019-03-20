<template>
    <div class="content">
        <div class="banner">
            <!-- <img src="../assets/temporary-img/index2/机械加工banner.png" alt=""> -->
            <img :src="bannerImg" alt="">
             <div>
                 <div v-if="this.$route.query.index==530020">
                    <p>优质企业 专业设备 精准报价</p>
                    <div class="btn" @click="toPublish" v-if="(user.isValid&&!user.isManufacturer)||!user.isValid||(user.isValid&&user.isManufacturer&&user.isDemand)">发布需求 >></div>
                 </div>
                 <div v-if="this.$route.query.index==530010">
                     <p>云3D打印 从虚拟到现实 一键打印</p>
                    <div class="btn-wrapper">
                    <div class="btn" @click="autoQuote" v-if="(user.isValid&&!user.isManufacturer)||!user.isValid||(user.isValid&&user.isManufacturer&&user.isDemand)">自动报价 >></div>
                    <div class="btn" @click="toPublish()" v-if="(user.isValid&&!user.isManufacturer)||!user.isValid||(user.isValid&&user.isManufacturer&&user.isDemand)">人工报价 >></div>
                    </div>
                 </div>
            </div>
        </div>
        <div class="message">
            <div class="Notice">
                <div class="Notice-title">
                    <img src="../../static/img/new.png" alt="">
                    <p>最新发布</p>
                </div>
                <div class="Notice-cont" id="NoticeCont">
                    <ul>
                    <li v-for="(item,index) in Notice" :key="index">{{item}}</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="wrapper">
            <div class="wrapper-box-information">
                <div class="wrapper-left pull-left pull-shadow pull-hidden">
                    <div class="wrapper-title">
                        <span class="name">行业资讯</span>
                        <span class="more" @click="$router.push({path:'/crafts-list?moduleType=200040'})">更多 ></span>
                    </div>
                    <div class="wrapper-left-cont">
                        <div class="wrapper-left-details pull-left" v-if="IndustryInformations[0]!=undefined">
                            <div class="top">
                                <div class="img_list pull-left"><img :src="IndustryInformations1.coverPicturl!=undefined?IndustryInformations1.coverPicturl:defaultLogo" alt=""></div>
                                <div class="top-txt">
                                    <h3 class="pull-overflow pull-cursor" @click="goDetails(IndustryInformations1,'行业资讯')">{{IndustryInformations1.title}}</h3>
                                    <div class="evs" v-html="IndustryInformations1.content">
                                    </div>
                                </div>
                            </div>
                            <div class="bottom">
                                 <p class="pull-overflow pull-cursor" v-for="(item,index) in IndustryInformations.slice(1,4)" :key="index" @click="goDetails(item,'行业资讯')">{{item.title}}</p>
                            </div>
                        </div>
                        <div class="wrapper-left-details pull-left" v-if="IndustryInformations[4]!=undefined">
                            <div class="top">
                               <div class="img_list pull-left"><img :src="IndustryInformations2.coverPicturl!=undefined?IndustryInformations2.coverPicturl:defaultLogo" alt=""></div>
                                <div class="top-txt">
                                    <h3 class="pull-overflow pull-cursor" @click="goDetails(IndustryInformations2,'行业资讯')">{{IndustryInformations2.title}}</h3>
                                    <div class="evs" v-html="IndustryInformations2.content">
                                    </div>
                                </div>
                            </div>
                            <div class="bottom">
                                <p class="pull-overflow pull-cursor" v-for="(item,index) in IndustryInformations.slice(5,8)" :key="index" @click="goDetails(item,'行业资讯')">{{item.title}}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="wrapper-right pull-left pull-shadow pull-hidden" v-if="$route.query.index==530020">
                    <div class="wrapper-title">
                        <span class="name">最新询盘</span>
                        <span class="more"  @click="$router.push({path:'/enquiry/list'})">更多 ></span>
                    </div>
                    <div class="wrapper-left-cont">
                    <p class="news-right-list" v-for="(item,index) in enquiryList.slice(0,7)" :key="index">
                        <span class="news-right-txt pull-overflow pull-cursor" @click="goDetail(item)">{{item.itemName}}</span>
                        <span class="news-right-time pull-right"><i>剩余{{$dateTime.timeDetails(item.offerDeadlineTime).days}}天</i></span>
                    </p>
                    </div>
                </div>
                <div class="wrapper-right pull-left pull-shadow pull-hidden" v-if="$route.query.index==530010">
                    <div class="wrapper-title">
                        <span class="name">供应商排行</span>
                        <span class="more"  @click="$router.push({path:'/manufacturer-sort'})">更多 ></span>
                    </div>
                    <div class="wrapper-left-cont">
                    <p class="news-right-list" v-for="(item,index) in manufactureSortList.slice(0,7)" :key="index">
                        <span class="news-right-txt3D pull-overflow pull-cursor" @click="toManufacturerDetail(item)">{{item.companyName}}</span>
                    </p>
                    </div>
                </div>
            </div>
            <div class="wrapper-content">
                <div class="wrapper-content-Two" v-if="ProductData!=''">
                    <div class="content-title">产品案例 <span class="more" @click="$router.push({path:'/product-case'})">更多 ></span></div>
                    <div class="content-main">
                        <ul>
                            <li class="pull-left pull-shadow pull-cursors" v-for="(item,index) in ProductData.slice(0,10)" :key="index" @click="toProductDetail( item )" :class="(index + 1) % 5==0?'no-margin-right':''">
                                <div class="Imgs">
                                    <img :src="item.pictureUrls!=''?item.pictureUrls[0]:defaultLogo" alt="">
                                </div>
                            <h3 class="pull-overflow">{{item.productName}}</h3>
                            <p class="pull-overflow">工艺：<span style="color: #a09f9f;" v-if="item.techniqueInfo!=undefined">{{item.techniqueInfo.techniqueName}}</span></p>
                            <p class="pull-overflow">材料：{{item.material}}</p>
                            <p class="pull-overflow">单价：人民币[{{item.priceScope}}]/件</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="wrapper-content-One" v-if="TechnologysOne.length!=0||TechnologysTwo.length!=0">
                    <div class="content-title">材料工艺</div>
                    <div class="content-main">
                        <div class="TabList">
                            <el-tabs v-model="activeName" @tab-click="handleClick">
                                <el-tab-pane label="打印材料" name="first">
                                    <div class="ChartList">
                                        <ul>
                                            <li class="pull-shadow pull-left pull-cursors" v-for="(item,index) in Technologys.slice(0,4)" :key="index" @click="goDetails(item,'材料百科')" :class="(index + 1) % 4==0?'no-margin-right':''">
                                                <div class="Imgs">
                                                    <img :src="item.coverPicturl!=''?item.coverPicturl:defaultLogo" alt="">
                                                </div>
                                                <h3>{{item.title}}</h3>
                                                <div class="ChartLists" v-html="item.content"></div>
                                            </li>
                                        </ul>
                                    </div>
                                </el-tab-pane>
                                <el-tab-pane label="处理工艺" name="second">
                                    <div class="ChartList">
                                        <ul>
                                            <li class="pull-shadow pull-left pull-cursors" v-for="(item,index) in Technologys.slice(0,4)" :key="index" @click="goDetails(item,'工艺百科')" :class="(index + 1) % 4==0?'no-margin-right':''">
                                                <div class="Imgs">
                                                    <img :src="item.coverPicturl!=''?item.coverPicturl:defaultLogo" alt="">
                                                </div>
                                                <h3>{{item.title}}</h3>
                                                <div class="ChartLists" v-html="item.content"></div>
                                            </li>
                                        </ul>
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </div>
               <div class="wrapper-content-Three"  v-if="supplierData!=''">
                    <div class="content-title">供应商 <span class="more" @click="$router.push({path:'/manufacturer-library'})">更多 ></span></div>
                    <div class="content-main">
                    <ul>
                        <li class="pull-left pull-shadow pull-cursors" v-for="(item,index) in supplierData.slice(0,8)" :key="index"  @click="toManufacturerDetail( item )" :class="(index + 1) % 4==0?'no-margin-right':''">
                            <div class="Imgs" :class="item.logoUrl!=undefined?'':'NoLogo'">
                                <img v-if="item.logoUrl!=undefined" :src="item.logoUrl" alt="">
                                <span v-else>{{item.shortName}}</span>
                            </div>
                            <h3>{{item.companyName}}</h3>
                            <p class="pull-overflow"><label>工艺：</label> <span v-for="(items,index) in item.techniqueInfo" :key="index" v-if="items.techniqueName!=undefined" class="pull-inline">{{items.techniqueName}}</span></p>
                            <p class="pull-overflow"><label>行业：</label><span v-for="(items,index) in item.coopInfo.industryInfo" :key="index" class="pull-inline">{{items.industryName}}</span></p>
                            <p><label>工厂面积：</label>{{item.extendInfo.factoryAcreageStr}}</p>
                            <p class="pull-overflow"><label>区域：</label><span v-if="item.countryStr !=''&&item.countryStr !=undefined">({{item.countryStr}})</span>{{item.province}}{{item.city}}{{item.region}}</p>
                            <fieldset class="starability-basic-Info">
                             <legend>评分：</legend>
                            <el-rate v-model="item.commentScore.manufacSideScore"  disabled disabled-void-color='#dcdcdc'></el-rate>
                            </fieldset>
                        </li>
                    </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import p1 from "../../static/img/最新询盘-板金.png";
import p2 from "../../static/img/最新询盘-冲压.png";
import p3 from "../../static/img/最新询盘-机加工.png";
export default {
  data() {
    return {
      select: {},
      service:'',
      inputContent: "",
      activeName:'first',
      defaultLogo:require('../../static/img/defaultLogo.png'),
      bannerImg:this.$route.query.index==530010?require('../assets/temporary-img/index3/PPbanner.png'):require('../assets/temporary-img/index2/机械加工banner.png'),
      param:{
        techniqueType:parseInt(this.$route.query.index),
        pageIndex: 1,
        pageSize: 10
      },
      multipleList:{
        techniqueType:parseInt(this.$route.query.index),
        moduleTypes:[],
        pageIndex: 1,
        pageSize: 10
      },
      Notice:[],
      enquiryList:[],
      supplierData:[], //供应商库
      ProductData:[], //产品案例
      IndustryInformations:[],
      IndustryInformations1:{},
      IndustryInformations2:{},
      Technologys:[],
      TechnologysOne:[],
      TechnologysTwo:[],
      IndustryCases:[],
      manufactureSortList:[]
    };
  },
  computed:{
      ...mapState({
          user: state => state.user,
      }),
  },
  watch:{
    '$route' (to, from) {
       this.bannerImg=this.$route.query.index==530010?require('../assets/temporary-img/index3/PPbanner.png'):require('../assets/temporary-img/index2/机械加工banner.png');
       this.param.techniqueType=parseInt(this.$route.query.index);
       this.multipleList.techniqueType=parseInt(this.$route.query.index);
       this.TemplateList();
    }
  },
  methods: {
    // 3D打印
    //获取服务
    getService() {
      this.$http.post('/custom/service/all').then(( res ) => {
        if ( res.data.code == 200 ) {
          this.service = res.data.data[0];
        }
      })
    },
    autoQuote() {
      if ( this.user.isValid ) {
        this.$router.push({path: '/quote/auto', query:{serviceId:this.service.id}});
      } else {
        this.$login({});
      }

    },

    toPublish() {
      if ( this.user.isValid ) {
        let url=this.$route.query.index==530010?'/quote/3d':'/quote/manual';
        this.$router.push({path:url, query:{techniqueType:parseInt(this.$route.query.index)}});
      } else {
        this.$login({});
      }
    },

    //材料工业tabs
    handleClick(tab, event){
       if(this.activeName=='first'){
           this.Technologys=this.TechnologysOne;
       }else{
           this.Technologys=this.TechnologysTwo;
       }
    },

    //公告
    interfaceOne(){
        this.$http.post('/custom/message/getNewRequirements',this.assignInfo(this.param)).then((res)=>{
            if(res.data.code==200&&res.data.data!=undefined){
                this.Notice=res.data.data;
                this.$scrollLeft.scrollLefts('NoticeCont')
            }
        });
    },
    //最新询盘
    interfaceTwo(){
        this.enquiryList=[];
        this.$http.post('/custom/requirement/getLastestEnquiryList',this.assignInfo(this.param)).then((res)=>{
         if(res.data.code==200&&res.data.data!=undefined){
             if ( Array.isArray(res.data.data) ) {
                 let enquiryList=res.data.data;
                 enquiryList.map((val)=>{
                     val.requirementItemList.map((vs)=>{
                        let enquiryData={
                            id:val.id,
                            itemName:vs.itemName,
                            day:val.day,
                            hour:val.hour,
                            techniqueInfo:val.techniqueInfo,
                            offerDeadlineTime:val.offerDeadlineTime,
                            Time:val.offerDeadlineTime.split(" ")[0],
                        }
                        this.enquiryList.push(enquiryData)
                     })
                 })
             }else{
                this.enquiryList=[]
             }
         }
        });

    },
    getManufacturerSortList() {
        let url="/getManufacturerList";
        let params={
            keyword:'',
            pageIndex: 1,
            pageSize:20,
            techniqueTypeList:[],
            industryIds:[],
        }
        this.$http.post(url,params).then((res)=>{
            if(res.data.code ==200){
              let data=res.data.data.list;
            if(data!=undefined){
            if(data.constructor !=Array){
                data=[];
            }
              this.manufactureSortList=data;
            }
            }else{
              this.manufactureSortList=[];
            }
        }) 
    },

    //行业资讯/材料百科/工艺百科
     interfaceThree(){
       let url='/custom/information/list';
       this.IndustryInformation(url);
       setTimeout(() => {this.Material(url);}, 100);
       setTimeout(() => {this.Technology(url);}, 200);

    },
   IndustryInformation(url){ //行业资讯
       this.multipleList.moduleTypes=[200040];
       this.$http.post(url,this.assignInfo(this.multipleList)).then((res)=>{
         if ( res.data.code == 200 ) {
            if ( Array.isArray(res.data.data) ) {
                this.IndustryInformations = res.data.data;
                this.IndustryInformations1=this.IndustryInformations[0] || {content:"",coverPicturl:'',title:''}
                this.IndustryInformations1.content=this.IndustryInformations[0]!=undefined?this.IndustryInformations[0].content:'';
                this.IndustryInformations2=this.IndustryInformations[4] || {content:"",coverPicturl:'',title:''}
                this.IndustryInformations2.content=this.IndustryInformations[4]!=undefined?this.IndustryInformations[1].content:'';
            } else {
                this.IndustryInformations = [];
            }
          }
       })
    },
   Material(url){//材料
       this.multipleList.moduleTypes=[200020];
       this.$http.post(url,this.assignInfo(this.multipleList)).then((res)=>{
          if ( res.data.code == 200 ) {
            if ( Array.isArray(res.data.data) ) {
                this.TechnologysOne = res.data.data;
                this.TechnologysOne.map((vas)=>{
                    if(vas.coverPicturl==undefined){
                        vas.coverPicturl='';
                    }
                })
            } else {
                this.TechnologysOne = [];
            }
          }
       })
    },
   Technology(url){//工艺
       this.multipleList.moduleTypes=[200010]; 
       this.$http.post(url,this.assignInfo(this.multipleList)).then((res)=>{
         if ( res.data.code == 200 ) {
            if ( Array.isArray(res.data.data) ) {
                this.TechnologysTwo = res.data.data;
                this.TechnologysTwo.map((vas)=>{
                    if(vas.coverPicturl==undefined){
                        vas.coverPicturl='';
                    }
                })
            } else {
                this.TechnologysTwo = [];
            }
          }
       })
    },

    //产品案例
   getProductList(){
        let url="/custom/productCase/list";
        this.$http.post(url,this.param).then((res)=>{
          if ( res.data.code == 200 ) {
            if ( Array.isArray(res.data.data) ) {
                this.ProductData = res.data.data;
            } else {
                this.ProductData = [];
            }
          }
        });
     },

    //供应商库
    supplierLibrary(){
     let url="/getManufacturerList";
        this.$http.post(url,this.assignInfo(this.param)).then((res)=>{
          if(res.data.code==200&&res.data.data!=undefined){
             let data=res.data.data.list;
             if ( Array.isArray(data) ) {
                this.supplierData=data;
             }else{
                this.supplierData=[] 
             }
         }
        });
    },

    //跳转
    goDetails(item,name){
        let parmes={
            id: item.id,
            name: item.tags,
            moduleName:name 
        }
        this.Jumps('/crafts-detail',parmes)
    },
    goDetail(row) {
        this.JumpRout(row)
    },
    JumpRout(item){
        let url=''
        if(item.techniqueInfo!=undefined){
            if(item.techniqueInfo.techniqueType==530010){
            url='/enquiry/detailInfo'    
            }else{
            url='/enquiry/detail'
            }
        }else{
            url='/enquiry/detail'
        }
        this.$router.push({path:url, query:{requireId: item.id}})
    },
    toManufacturerDetail(item){
      let { href } = this.$router.resolve({path: '/manufacturer-audits',query:{companyId: item.id}});
      window.open(href, '_blank');
    },
    toProductDetail( item ) {
      let parmes={
          productId: item.id
      }
      this.Jumps('/product-detail',parmes)
    },
    toManufacturerDetail( item ) {
      let parmes={
          companyId: item.id
      }
      this.Jumps('/manufacturer-audits',parmes)
    },
    Jumps(url,query){
      let { href } = this.$router.resolve({path:url, query:query});
      window.open(href, '_blank');
    },
    assignInfo(a){
     return JSON.parse(JSON.stringify(a))
    },
    TemplateList(){
        this.getService();  
        this.interfaceOne();
        this.interfaceThree();
        this.interfaceTwo();
        this.getManufacturerSortList();
        this.getProductList();
        this.supplierLibrary();
    }
  },
  mounted() {
    this.TemplateList();
  },
};
</script>
<style lang="less">

.starability-basic-Info{
  i{font-size: 16px;}
}
.wrapper-content-One{
    .TabList{
      #tab-first,#tab-second{
        font-size: 12px;
      }
      #tab-second{}
      .el-tabs__item{color: #6c6c6c;}
      .el-tabs__item.is-active{color: #3f8def;}
      .el-tabs__nav-wrap::after{background-color:inherit;}
      .el-tabs__header{
        position: absolute;
        top: -40px;
        left: 112px;
      }
      .el-tabs__content{overflow: inherit;}
      .el-tabs__active-bar{bottom: 8px;}
    }
}
</style>

<style lang="less" scoped>
@common-color: #3f8def;
.pull-right{float: right;}
.pull-left{float: left;}
.pull-shadow{
    background: #fff;
    box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    -webkit-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    -moz-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
}
.pull-hidden{
    overflow: hidden;
}
.pull-overflow{
    overflow: hidden;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.ellipsis{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.pull-cursor{
    &:hover{
    color: #3f8def;
    text-decoration: underline;
    cursor: pointer;
    }
}
.pull-cursors{
    cursor: pointer;
}
.pull-inline{display: inline-block!important;}
.pull-inline+.pull-inline{
    &::before{
        content:",";
        width: 5px;
        display: inline-block;
        padding-left: 2px;
    }
}
.content {
  background: #f5f5f5;;
}
.banner {
  width: 100%;
  height:380px;
  position: relative;
  overflow: hidden;
  img{
      position: absolute;
      top:0;
      left:0;
      width:100%;
      height:380px;
      z-index: 88;
      }
  div{
    margin: auto;
    width: 1200px;
    height: 380px;
    position: relative;
    z-index: 99;
    p {
      height: 40px;
      font-size: 40px;
      line-height: 1;
      // letter-spacing: 2px;
      color: #ffffff;
      padding-top: 115px;
    }
    .btn {
      margin: 72px 0 0 0;
      width: 170px;
      height: 50px;
      background-color: #3f8def;
      // border-radius: 22px;
      text-align: center;
      line-height: 50px;
      color: #fff;
      font-size: 22px;
      cursor: pointer;
    }
  }
  .btn-wrapper{
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: center;
    justify-content: center;
    height: 50px;
    margin-top: 72px;
    .btn{
        width: 170px;
        height: 50px;
        background-color: #3f8def;
        text-align: center;
        line-height: 50px;
        color: #fff;
        font-size: 22px;
        cursor: pointer;
        margin: 0 50px;
    }
  }
}
.message{
    width: 100%;
    height: 30px;
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0,0,0,.05);
    margin-bottom: 16px;
    .Notice{
    width: 1200px;
    margin: auto;
    height: 100%;
    line-height: 30px;
     .Notice-title{
      width: 90px;
      height: 100%;
      float: left;
      img{
        width: 22px;
        float: left;
        padding: 4px 0;
      }
    }
    .Notice-cont{
        margin-left: 90px;
     span{
        display: inline-block;
        padding: 0 100px;
     }
    }
    #NoticeCont{
       width: 1100px;
       height: 30px;
       position: relative;
       overflow: hidden;
       ul{
        position: absolute;
        left: 0;
        top: 0;
           li{
            float: left;
            list-style: none;
            display: inline-block;
            margin-right:200px;
            height: 30px;
           }
       }
    }
    }
}
.wrapper {
  width: 1210px;
  padding: 5px;
  margin: auto;
  overflow: hidden;
  padding-bottom: 50px;
  .wrapper-box-information{
     height: 246px;
    .wrapper-left,.wrapper-right{padding:10px 15px;box-sizing: border-box;}
        .wrapper-title{
            .name{
              font-size: 16px;
              color: #6b6b6b;
              padding-left: 7px;
              position: relative;
              &::before{
                content: "";
                width: 3px;
                height: 16px;
                background: #3f8def;
                position: absolute;
                top: 3px;
                left: -2px;
              }
            }
            .more{
              color: #3f8def;
              padding-left: 20px;
              cursor: pointer;
            }
        }
    .wrapper-left{
        width: 812px;
        height: 246px;
        .wrapper-left-cont{
                overflow: hidden;
                margin-top: 15px;
            .wrapper-left-details+.wrapper-left-details{margin-left: 55px;}
            .wrapper-left-details{
                width:360px;
                .img_list{
                    width:127px;
                    height:88px;
                    text-align: center;
                    line-height: 83px;
                    border: solid 1px #e2e2e2;
                    img{
                      display: inline-block;
                      max-width: 130px;
                      max-height: 82px;
                      vertical-align: middle;
                    }
                }
                .top-txt{
                    padding-left: 140px;
                    h3{
                      font-size: 14px;
                      margin-bottom: 10px;
                    }
                    .evs{
                      height: 60px;
                      line-height: 20px;
                      overflow: hidden;
                      color: #a09f9f;
                      text-overflow: ellipsis;
                      display: -webkit-box;
                      -webkit-line-clamp: 3;
                      -webkit-box-orient: vertical;
                      }
                }
                .bottom{
                      margin-top: 20px;
                      p+p{margin-top: 12px;}
                      p{
                          position: relative;
                          padding-left: 10px;
                          &::before{
                            position: absolute;
                            content: "";
                            width: 4px;
                            height: 4px;
                            border-radius: 50%;
                            background: #cacaca;
                            left: 0;
                            top: 50%;
                            margin-top: -2px;
                          }
                        }
                }
            }
        }
    }
    .wrapper-right{
        width: 377px;
        height: 246px;
        margin-left: 10px;
        .news-right-list+.news-right-list{margin-top:9px;}
        .wrapper-left-cont{
            overflow: hidden;
            margin-top: 15px;
            .news-right-txt{
                max-width: 250px;
                display: inline-block;
            }
            .news-right-txt3D{
                max-width: 340px;
                display: inline-block;
            }
        }
    }
  }
  .wrapper-content{
        margin-top: 28px;
      .content-title{
        position: relative;
        font-size: 16px;
        color: #6b6b6b;
        padding-left: 12px;
        &::before{
          content: "";
          width: 4px;
          height: 16px;
          background: #3f8def;
          position: absolute;
          top: 4px;
          left: 0;
        }
        .more{
          	width: 24px;
            height: 12px;
            font-family: MicrosoftYaHei;
            font-size: 12px;
            cursor: pointer;
            padding-left:20px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0.7px;
            color: #3f8def;  
        }
      }
      .wrapper-content-One,.wrapper-content-Two,.wrapper-content-Three{margin-top: 15px;}
      .wrapper-content-One,.wrapper-content-Two,.wrapper-content-Three{
        ul{
            overflow: hidden;
            width: 1210px;
            margin-left: -5px;
            padding: 5px;
        }
        li{
            background-color: #ffffff;
            box-sizing: border-box;
            margin-right: 10px;
            margin-bottom: 10px;
        }
        .Imgs{
            text-align: center;
            margin: auto;
            img{
            vertical-align: middle;
            display: inline-block;
            }
        }
        .NoLogo{
            line-height: 60px;
            span{font-size: 30px;font-weight: bold;color: #a8a8a8;} 
        }
      }
      .wrapper-content-One{
          .TabList{
              position: relative;
              .ChartList{
                  margin-top:10px;
                  li{
                    width:292px;
                    height:325px;
                    padding: 23px 20px 10px 20px;
                    .Imgs{
                        width: 210px;
                        height: 165px;
                        line-height: 163px;
                        margin-bottom: 14px;
                        img{
                            max-width: 208px;
                            max-height: 163px;
                        }
                    }
                    h3{	font-size: 15px;margin-top: 11px;}
                    .ChartLists{
                        margin-top: 7px;
                        height: 75px;
                        line-height: 19px;
                        overflow: hidden;
                        color: #a09f9f;
                    }
                  }
              }
          }
      }
      .wrapper-content-Two{
        .content-main{
            margin-top: 4px;
            li{
                width:232px;
                height:266px;
                padding: 18px 20px 10px 20px;
                .Imgs{
                    width: 155px;
                    height: 120px;
                    line-height: 118px;
                    margin-bottom: 14px;
                    img{
                        max-width: 153px;
                        max-height: 118px;
                    }
                }
                h3{
                    font-size: 15px;
                    display: block;
                    margin-bottom: 10px;
                }
                p{color: #a09f9f;}
                P+p{padding-top: 9px;}
            }
        }
      }
      .wrapper-content-Three{
          .content-main{margin-top: 5px;}
          li{
            width:292px;
            height:315px;
            padding: 23px 20px 10px 20px;
            .Imgs{
                width: 250px;
                height: 105px;
                line-height: 103px;
                margin-bottom: 14px;
                img{
                    max-width: 253px;
                    max-height:103px;
                }
            }
            h3{
                font-size: 15px;
                display: block;
                margin-bottom: 10px;
            }
            p,span,label,legend{color: #a09f9f;}
            P+p{padding-top: 10px;}
            fieldset{
                padding-top: 10px;
                border: none;
                margin: 0;
                padding-left: 0;
                padding-right: 0;
                legend{float: left;}
            }
          }
      }
      .no-margin-right{margin-right:0!important;}
  }
}
</style>
