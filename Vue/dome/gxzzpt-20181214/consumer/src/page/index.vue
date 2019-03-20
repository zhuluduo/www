<template>
  <div id="index">
    <div class="content">
      <div class="latest-release content-item">
        <div class="title">最新发布</div>
        <div class="message-wrapper" @mouseenter="enterMsgBox" @mouseleave="leaveMsgBox" ref="messageWrapper">
          <div class="inner-wrapper" ref="innerWrapper1">
            <div class="info-item" :key="'msg-' + index" v-for="(item,index) in messageList">{{item}}刚刚发布了新的需求</div>
          </div>
        </div>
      </div>
      <div class="content-item banner-wrapper pull-ovflow IeCompatible">
        <div class="left">
          <img src="../../static/img/banner-new.png" alt="">
          <div class="guide-wrapper">
            <ul class="guide-list">
              <li class="guide-item" @click="$router.push({path:'/manufacturer-library'})">
                <img src="../../static/img/index-factory.png" alt="">
                <div class="font-12">找工厂</div>
              </li>
              <li class="guide-item" @click="$router.push({path:'/product-case'})">
                <img src="../../static/img/index-product.png" alt="">
                <div class="font-12">产品库</div>
              </li>
              <li class="guide-item" @click="$router.push({path: '/crafts-list', query:{moduleType: 200050}})">
                <img src="../../static/img/index-Notice.png" alt="">
                <div class="font-12">平台公告</div>
              </li>
              <li class="guide-item" @click="$router.push({path:'/enquiry/list'})">
                <img src="../../static/img/index-inquiry.png" alt="">
                <div class="font-12">最新询盘</div>
              </li>
              <li class="guide-item" @click="$router.push({path: '/contract', query: {index:5}})">
                <img src="../../static/img/index-question.png" alt="">
                <div class="font-12">常见问答</div>
              </li>
              <li class="guide-item" @click="$router.push({path:'/recruitment/index'})">
                <img src="../../static/img/index-recruitment.png" alt="">
                <div class="font-12">人才招聘</div>
              </li>
            </ul>
            <div class="amount-info">
              <div class="amount-item">已注册企业<span>{{companyCount}}</span>家</div>
              <div class="amount-item">已发布需求<span>{{requirementCount}}</span>条</div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="login-box" :class="user.isValid?'login-box-top':''">
            <img @click="$router.push({path:'/usercenter/my-require'});" v-if="user.isValid" class="avator" :src="user.portrait?user.portrait:require('../../static/img/icon-user.png')" alt="">
            <div class="font-14" v-if="user.isValid">{{user.companyName}}</div>
            <div class="font-14" v-if="user.isValid">{{user.username}}</div>
            <img v-if="!user.isValid" src="../../static/img/index-avator.png" class="avator" alt="">
            <div v-if="!user.isValid" class="font-14">欢迎来到大富智造云</div>
            <div class="btn-box" v-if="!user.isValid">
              <div class="login btn" @click="$login({})">登录</div>
              <div class="register btn" @click="$router.push({path: '/register/entry'})">注册</div>
            </div>
          </div>
          <div class="tech-box three-print">
            <!-- <img src="../../static/img/index-3dprint.png" alt="" @click="$router.push({path:'/deputy-index'})"> -->
            <img src="../../static/img/index-3dprint.png" alt="" @click="$router.push({path:'/deputyTemplate', query: {index:530010}})">
          </div>
          <div class="tech-box machining">
            <!-- <img src="../../static/img/index-machine.png" alt="" @click="$router.push({path:'/deputy-index2'})"> -->
            <img src="../../static/img/index-machine.png" alt="" @click="$router.push({path:'/deputyTemplate', query: {index:530020}})">
          </div>
        </div>
      </div>
      <div class="information-wrapper">
        <div class="topic-box item-box">
          <div class="title">
            <span class="name">新技术专区</span>
            <span class="more" @click="$router.push({path:'/topic/list'})">更多 ></span>
          </div>
          <div class="article" @click="toTopicDetail(techTopicItem.id)">
            <div class="article-title ellipsis">{{techTopicItem.title}}</div>
            <div class="article-content" v-html="techTopicItem.content"></div>
          </div>
          <div class="info-list">
            <div @click="toTopicDetail(item.id)" class="info-item ellipsis" v-for="(item, index) in techTopicList" :key="'topic-' + index" v-if="index !== 0">{{item.title}}</div>
          </div>
        </div>
        <div class="enquipment-box item-box">
          <div class="title">
            <span class="name">设备交易市场</span>
            <span class="more" @click="$router.push({path:'/enquipment/list'})">更多 ></span>
          </div>
          <div class="article clearfix">
            <img @click="toEnquipmentDetail(enquipmentItem.id)" :src="enquipmentItem.coverPicturl" alt="">
            <div class="right">
              <div class="article-title ellipsis">{{enquipmentItem.title}}</div>
              <div class="article-content" v-html="enquipmentItem.content">
                
              </div>
            </div>
          </div>
          <div class="info-list">
            <div class="info-item ellipsis" @click="toEnquipmentDetail(item.id)" v-for="(item, index) in enquipmentList" :key="'enquipment-' + index" v-if="index !== 0">{{item.title}}</div>
          </div>
        </div>
        <div class="manufacturer-box">
          <div class="title">
            <span class="name">供应商排行</span>
            <span class="more" @click="$router.push({path:'/manufacturer-sort'})">更多 ></span>
          </div>
          <div class="manufacturer-list">
            <div class="item ellipsis" v-for="(item,index) in manufactureSortList.slice(0,9)" @click="toManufacturerDetail(item)" :key="'manuf-' + index">
              <span>0{{index+1}}</span>
              <span>{{item.companyName}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="content-row" v-if="enquiryList!=''">
        <div class="row-title pull-ovflow">
          <span class="title pull-left">最新询盘</span>
          <span class="more pull-right" @click="$router.push({path:'/enquiry/list'})">更多 ></span>
        </div>
        <div class="list">
          <div class="list-item latest-inquiry" v-for="(item,index) in enquiryList" :style="{marginLeft:index%5==0?'0':'9px'}">
            <div class="top">
              <span class="title">{{item.requirementTypeText}}</span>
              <span class="index">{{item.currentIndex}}/{{item.requirementItemList.length}}</span>
            </div>
            <div>
              <div class="picture-box">
                <i class="el-icon-arrow-left" @click="prevEnquiry(item)" v-if="item.requirementItemList.length>1"></i>
                <div v-if="item.currentEnquiry.firstModelFileInfo" class="no-upload-img">
                    <img  :src="item.currentEnquiry.firstModelFileInfo?item.currentEnquiry.firstModelFileInfo.fileUrl:''" alt="">
                </div>
                <div v-else class="no-upload-img">未上传</div>
                <i class="el-icon-arrow-right" @click="nextEnquiry(item)" v-if="item.requirementItemList.length>1"></i>
              </div>
              <div class="name font-12">{{item.currentEnquiry.itemName}}</div>
              <div class="number font-12">{{item.currentEnquiry.estimateCount}}件</div>
              <div class="number font-12">还剩<span>{{$dateTime.timeDetails(item.offerDeadlineTime).days}}</span>天</div>
            </div>
            <div class="btn" @click="toEnquiryDetail(item)">报价</div>
          </div>
        </div>
      </div>
      <div class="beautiful-divider">
        <img src="../../static/img/index-adertsing.png" alt="">
      </div> 
      <div class="content-row" v-if="manufacturerList!=''">
         <div class="row-title pull-ovflow">
          <span class="title pull-left">供应商库</span>
          <span class="more pull-right" @click="$router.push({path: '/manufacturer-library'})">更多 ></span>
        </div>
        <div class="list">
          <div class="list-item manufacturer" v-for="(item,index) in manufacturerList" @click="toManufacturerDetail( item)" :style="{marginLeft:index%5==0?'0':'9px'}">
            <div class="logoList" :class="item.logoUrl!=undefined?'':'NoLogo'">
              <img v-if="item.logoUrl!=undefined" class="logo" :src="item.logoUrl" alt="">
              <span v-else>{{item.shortName}}</span>
              <!-- <img  class="logo" v-else src="../../static/img/defaultLogo.png" alt=""> -->
            </div>
            <div class="company-name ellipsis">{{item.companyName}}</div>
            <div class="font-12 ellipsis">主工艺：<span class="operation" v-for="(item,index) in item.techniqueInfo" :key="index" v-if="item.techniqueName!=undefined">{{item.techniqueName}}</span></div>
            <div class="font-12 ellipsis">主设备：<span v-for="(items,index) in item.equipmentInfo" :key="index" class="pull-inline">{{items.equipmentName}}</span></div>
            <div class="font-12 ellipsis">行业：{{item.coopInfo.industryInfo|industryFilter}}</div>
            <div class="font-12 ellipsis">区域：{{item.countryStr}} {{item.province}}</div>
          </div>
        </div>
      </div>
      <div class="content-row" v-if="productList!=''">
        <div class="row-title pull-ovflow">
          <span class="title pull-left">产品案例</span>
          <span class="more pull-right" @click="$router.push({path:'/product-case'})">更多 ></span>
        </div>
        <div class="list">
          <div class="list-item product" v-for="(item,index) in productList" @click="toProductDetail( item )" :style="{marginLeft:index%5==0?'0':'9px'}">
            <div class="product-logo">
              <img v-if="item.pictureUrls!=undefined" class="logo" :src="item.pictureUrls[0]" alt="">
              <img  class="logo" v-else src="../../static/img/defaultLogo.png" alt="">
              </div>
            <div class="name ellipsis">{{item.productName}}</div>
            <div class="font-12 ellipsis">工艺：<span class="font-12" v-if="item.techniqueInfo!=undefined">{{item.techniqueInfo.techniqueName}}</span></div>
            <div class="font-12 ellipsis">材料：{{item.material}}</div>
            <div class="font-12">单价：人民币[{{item.priceScope}}]/件</div>
          </div>
        </div>
      </div>
      <div class="content-row">
        <div class="row-title pull-ovflow">
          <span class="title pull-left">合作企业</span>
        </div>
        <div class="list">
          <img src="../../static/img/index-partners.png" alt="">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
export default {
  data() {
    return {
      timer: null,
      wrapper: '',
      innerWrapper1: '',
      innerWrapper2: '',
      messageList: [],
      rate: 4,
      service:'',
      productList:[],
      enquiryList:[],
      manufacturerList: [],
      RankingList:[],
      companyCount:0,
      requirementCount:0,
      techTopicList:[],
      techTopicItem:[],
      enquipmentList:[],
      enquipmentItem: [],
      manufactureSortList:[]
    }
  },
  created() {
    this.getEnquiryList();
    this.getManufacturerList();
    this.getProductList();
  //  this.getService();
    this.getMessageList();
    this.getRankingList();
    this.getCountData();
    this.getTechTopicData();
    this.getEnquipmentData();
    this.getManufacturerSortList();
  },
  filters: {
    techniqueInfoFilter: function( list ) {
      var str = '';
      if ( Array.isArray( list ) ) {
        list.map(( item ) => {
          str += item.techniqueName + ',';
        })
        str = str.substring( 0, str.length-1 );
      } 
      return str;
      
    },
    industryFilter: function( list ) {
      var str = '';
      if ( Array.isArray( list ) ) {
        list.map(( item ) => {
          str += item.industryName + ',';
        })
        str = str.substring( 0, str.length-1 );
      } 
      return str;
    }
  },
  computed: {
        ...mapState({
            user: state => state.user,
        }),
    },
  mounted() {
    this.wrapper = this.$refs.messageWrapper;
    this.innerWrapper1 = this.$refs.innerWrapper1;
   /*  this.innerWrapper2 = this.$refs.innerWrapper2; */
  //  this.innerWrapper2.innerHTML = this.innerWrapper1.innerHTML;
    this.timer = setInterval(this.scroll, 50);
  },
  methods: {

    enterMsgBox() {
      clearInterval(this.timer);
    },

    leaveMsgBox() {
      this.timer = setInterval(this.scroll, 30);
    },

    scroll() {
      this.wrapper.scrollLeft++;
			if(this.wrapper.scrollLeft >= this.innerWrapper1.offsetWidth/2) {
        this.wrapper.scrollLeft = 0;
    //    console.log('inner--', this.innerWrapper1.offsetWidth);
      }
    //  console.log('left--', this.wrapper.scrollLeft);
    },

    getService() {
      this.$http.post('/custom/service/all').then(( res ) => {
        if ( res.data.code == 200 ) {
          this.service = res.data.data[0];
        }
      })
    },

    getCountData() {
      this.$http.post('/commonData').then(( res ) => {
        if ( res.data.code == 200 ) {
          this.companyCount = res.data.data.companyCount;
          this.requirementCount = res.data.data.requirementCount;
        }
      })
    },

    getMessageList() {
      this.$http.post('/custom/message/getNewRequirements', {pageSize:5, pageIndex: 1}).then(( res ) => {
        if ( res.data.code == 200 ) {
          if ( Array.isArray(res.data.data) ) {
            this.messageList = res.data.data;
          } else {
            this.messageList = [];
          }
        }
      })
    },

    //供应商排行榜
    getRankingList(){
      this.$http.post('/custom/CompanyComment/getBestManufacturer',{pageSize:7,pageIndex:1}).then(( res ) => {
        if ( res.data.code == 200 ) {
          let manufacSideScoreInfo='';
          for(let ins in res.data.data){
            res.data.data[ins].manufacSideScoreInfo=(Math.round(res.data.data[ins].manufacSideScore*10))/10
          }
          this.RankingList = res.data.data;
        }
      })  
    },

    //获取询盘列表
    getEnquiryList() {
      this.$http.post('/custom/requirement/getLastestEnquiry',{pageSize:10,pageIndex:1}).then(( res ) => {
        if ( res.data.code == 200 ) {
          if ( Array.isArray(res.data.data) ) {
            this.enquiryList = res.data.data;
            this.enquiryList.map(( enquiry ) => {
              this.$set(enquiry, 'currentEnquiry', enquiry.requirementItemList[0]);
              this.$set(enquiry, 'currentIndex', 1);
            })
          } else {
            this.enquiryList = [];
          }
          
        }
      })
    },
    prevEnquiry( enquiry ) {
      if ( enquiry.currentIndex > 1 ) {
        enquiry.currentEnquiry = enquiry.requirementItemList[ enquiry.currentIndex-2 ];
        enquiry.currentIndex--;
      } else {
        enquiry.currentEnquiry = enquiry.requirementItemList[ enquiry.requirementItemList.length-1 ];
        enquiry.currentIndex = enquiry.requirementItemList.length;
      }
    },
    nextEnquiry( enquiry ) {
      if ( enquiry.currentIndex != enquiry.requirementItemList.length ) {
        enquiry.currentEnquiry = enquiry.requirementItemList[ enquiry.currentIndex ];
        enquiry.currentIndex++;
      } else {
        enquiry.currentEnquiry = enquiry.requirementItemList[ 0 ];
        enquiry.currentIndex = 1;
      }
    },
    //获取供应商列表
    getManufacturerList() {
      this.$http.post('/getManufacturerList',{pageSize:10, pageIndex: 1}).then(( res ) => {
        if ( res.data.code == 200 ) {
          if ( Array.isArray(res.data.data.list) ) {
            this.manufacturerList = res.data.data.list;
          } else {
            this.manufacturerList = [];
          }
        }
      })
    },

    //获取产品案例
    getProductList() {
      this.$http.post('/custom/productCase/list', {pageSize: 10, pageIndex: 1}).then(( res ) => {
        if ( res.data.code == 200 ) {
          if ( Array.isArray(res.data.data) ) {
            this.productList = res.data.data;
          } else {
            this.productList = [];
          }
          
        }
      })
    },

    //获取新技术数据
    async getTechTopicData() {
      let res = await this.$http.post('/custom/techTopic/list',{isMe: false, pageIndex:1, pageSize:4});
      if ( res.data.code == 200 && Array.isArray(res.data.data) ) {
          this.techTopicList = res.data.data;
          let result = await this.$http.post('/custom/techTopic/get',{id: this.techTopicList[0].id});
          if ( result.data.code == 200 ) {
            this.techTopicItem = result.data.data;
          }
        }
    },

    toTopicDetail( id ) {
      let {href} = this.$router.resolve({path:'/topic/detail', query:{id: id}});
      window.open(href, '_blank');
    },

    //获取设备交易数据
    async getEnquipmentData() {
      let res = await this.$http.post('/custom/EquipSale/getList',{pageIndex:1, pageSize:4});
      if ( res.data.code == 200 && Array.isArray(res.data.data) ) {
          this.enquipmentList = res.data.data;
          let result = await this.$http.post('/custom/EquipSale/get',{id: this.enquipmentList[0].id});
          if ( result.data.code == 200 ) {
            this.enquipmentItem = result.data.data;
          }
        }
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
                pageTotal=0
            }
              this.manufactureSortList=data;
            }
            }else{
              this.manufactureSortList=[];
            }
        }) 
    },

    toEnquipmentDetail( id ) {
      let {href} = this.$router.resolve({path:'/enquipment/detail', query:{id: id}});
      window.open(href, '_blank');
    },

    toEnquiryDetail( item ) {
      let { href } = this.$router.resolve({path:'/enquiry/detail', query:{requireId: item.id}});
      window.open(href, '_blank');
    },

    toProductDetail( item ) {
      let { href } = this.$router.resolve({path:'/product-detail', query:{productId: item.id}});
      window.open(href, '_blank');
    },

    toManufacturerDetail( item ) {
      let { href } = this.$router.resolve({path: '/manufacturer-audits',query:{companyId: item.id}});
      window.open(href, '_blank');
    },
    resolveTag(index,id){
        let routeData = this.$router.resolve({path: '/contract', query: {index: index,id:id}});
        window.open(routeData.href, '_blank');
    },
  }
}
</script>

<style lang="less" scoped>
.pull-left{float: left;}
.pull-right{float: right;}
.pull-ovflow{overflow: hidden;}
.operation+.operation{
  &::before{
    content:",";
  }
}
#index{
  background: #f5f5f5;
  padding-bottom: 20px;
  .content{
    width: 1200px;
    margin: 0 auto;
    font-size: 12px;
    color: #777;
    div,ul,li,span,img{
      box-sizing: border-box;
    }
    .ellipsis{
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .font-14{
      font-size: 14px;
      height: 14px;
      line-height: 14px;
    }
    .font-12{
      font-size: 12px;
      line-height: 12px;
      height: 12px;
      text-align: center;
      color: #a09f9f;
    }
    .latest-release{
      display: flex;
      justify-content: flex-start;
      height: 30px;
      font-size: 12px;
      color: #6c6c6c;
      line-height: 30px;
      padding-top: 4px;
      .title{
        width: 80px;
        margin-left: 9px;
        background: #f5f5f5 url(../../static/img/index-horn-icon.png) no-repeat scroll center left;
        text-indent: 22px;
        float: left;
        margin-top: 7px;
        line-height: 16px;
      }
      .message-wrapper{
        width: 1090px;
        margin-left: 30px;
        overflow: hidden;
        .inner-wrapper{
          width: 3000px;
          .info-item {
            display: inline-block;
            width: 300px;
            margin-left: 40px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
      
    }
    .banner-wrapper{
        width: 1220px;
        margin-left: -10px;
        padding: 7px 10px;
        box-sizing: border-box;
      .left{
        width: 982px;
        float: left;
        img{
          display: block;
          width: 100%;
          height: 260px;
        }
        .guide-wrapper{
          height: 102px;
          margin-top: 8px;  
          background: #fff url(../../static/img/index-guide-bg.png) no-repeat top left;
          box-shadow: 0px 2px 9px 0px rgba(180, 180, 180, 0.3);
          .guide-list{
            margin-left: 27px;
            width: 715px;
            height: 102px;
            float: left;
            .guide-item{
              width: 110px;
              height: 102px;
              float: left;
              margin-right: 9px;
              cursor: pointer;
              transition:transform .2s;
              -ms-transition:-webkit-transform .2s; /* IE 9  */
              -webkit-transition:-webkit-transform .2s; /* Safari */
              &:hover{
                transform:translate(0,-5px);
                -ms-transform:translate(0,-5x); /* IE 9 */
                -webkit-transform:translate(0,-5px); /* Safari and Chrome */
              }
              img{
                width: 46px;
                height: 46px;
                margin: 0 auto;
                margin-top: 15px;
              }
              .font-12{
                margin-top: 10px;
              }
            }
          }
          .amount-info{
            width: 239px;
            height: 57px;
            border-left: 1px solid #e2e2e2;
            padding: 5px 0 0 38px;
            float: right;
            margin-top: 19px;
            .amount-item{
              line-height: 24px;
              span{
                display: inline-block;
                width: 60px;
                text-align: left;
                margin: 0 12px 0 20px;
                color: #3f8def;
                font-weight: 700;
              }
            }
          }
        }
      }
      .right{
        float: right;
        width: 204px;
        .login-box{
          height: 148px;
          margin-bottom: 11px;
          background-color: #ffffff;
          border-radius: 4px;
          box-shadow: 0px 2px 9px 0px rgba(180, 180, 180, 0.3);
          padding-top: 14px;
          .avator{
            display: block;
            width: 46px;
            height: 46px;
            border-radius: 50%;
            margin: 0 auto;
          }
          .font-14{
            color: #555;
            text-align: center;
            margin-top: 14px;
          }
          .btn-box{
            margin-top: 15px;
            padding: 0 24px;
            .btn{
              width: 66px;
              height: 26px;
              border: 1px solid #3f8def;
              border-radius: 12px;
              font-size: 14px;
              line-height: 26px;
              text-align: center;
              cursor: pointer;
            }
            .login{
              color: #3f8def;
              float: left;
            }
            .register{
              color: #fff;
              background: #3f8def;
              float: right;
            }
          }
        }
        .login-box-top{
          padding-top: 26px;
          .font-14{
          font-size: 12px;
          margin-top: 7px;
          }
        }
        .tech-box{
          height: 102px;
          background-color: #ffffff;
          border-radius: 4px;
          box-shadow: 0px 2px 9px 0px rgba(180, 180, 180, 0.3);
          cursor: pointer;
          &:hover{
            opacity: .8;
          }
        }
        .machining{
          margin-top: 7px;
        }
      }
    }
    .beautiful-divider{
      margin-top:18px;
    }
    .information-wrapper{
      height: 246px;
      .title{
        height: 16px;
        border-left: 4px solid #3f8def;
        line-height: 16px;
        margin-top: 13px;
        margin-bottom: 14px;
        .name{
          display: inline-block;
          height: 16px;
          font-size: 16px;
          text-indent: 12px;
          color: #6b6b6b;
        }
        .more{
          display: inline-block;
          height: 16px;
          color: #3f8def;
          cursor: pointer;
          line-height: 16px;
          margin-left: 30px;
        }
      }
      .item-box{
        float: left;
        width: 439px;
        height: 100%;
        background: #fff;
        margin-right: 10px;
        padding: 0 47px 0 13px;
        .article{
          .article-title{
            font-size: 14px;
            height: 14px;
            line-height: 14px;
            color: #777;
            margin-bottom: 8px;
          }
          .article-content{
            font-size: 12px;
            color: #a09f9f;
            line-height: 22px;
            height: 65px;
            overflow: hidden;
            p{
              img{
                display: none !important;
              }
            }
          }
        }
        .info-list{
          margin-top: 24px;
          .info-item{
            text-indent: 6px;
            position: relative;
            cursor: pointer;
            padding: 0 0 0 4px;
            height: 12px;
            line-height: 12px;
            & + .info-item{
              margin-top: 17px;
            }
            &:before {
              position: absolute;
              content: "";
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background: #919191;
              left: 0px;
              top: 50%;
              margin-top: -2px;
            }
            &:hover {
              color: #3f8def;
              text-decoration: underline;
            }
          }
        }
      }
      .enquipment-box{
        img{
          display: block;
          float: left;
          width: 130px;
          height: 88px;
        }
        .right{
          float: left;
          width: 232px;
          height: 88px;
          margin-left: 9px;
        }
      }
      .manufacturer-box{
        float: left;
        width: 302px;
        height: 100%;
        background: #fff;
        padding: 0 18px;
        .manufacturer-list{
          .item{
            height: 14px;
            cursor: pointer;
            &:hover{
              span{
                color: #3f8def;
              }
            }
            & + .item{
              margin-top: 7px;
            }
            span{
              display: inline-block;
              height: 12px;
              line-height: 12px;
              color: #777;
              & + span{
                margin-left: 15px;
              }
            }
          }
        }
      }
    }
    .content-row{
      margin-top: 20px;
      .row-title{
        position: relative;
        font-weight: 700;
        margin-bottom: 5px;
        .title{
          float: left;
          width: 100px;
          height: 16px;
          line-height: 16px;
          font-size: 16px;
          text-indent: 12px;
          color: #6b6b6b;
          font-weight: normal;
        }
        &::before{
          content: '';
          position: absolute;
          left: 0;
          width: 4px;
          height: 16px;
          background: #3f8def;
        }
        .more{
          float: left;
          font-size: 12px;
          cursor: pointer;
          line-height: 16px;
          color: #3f8def;
          font-weight: normal;
        }
      }
      .list{
        overflow: hidden;
        width: 1220px;
        margin-left: -10px;
        padding: 10px 10px;
        box-sizing: border-box;
        .list-item{
          background: #fff;
          width: 232px;
          max-width: 232px;
          min-width: 232px;
          float: left;
          box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
        }
        .list-item:nth-child(n+6){
          margin-top: 9px;
        }
        
        .latest-inquiry{
          height: 246px;
          padding: 16px 23px 16px 20px;
          .top{
            width: 100%;
            height:14px;
            margin-bottom: 20px;
            .title{
              font-size: 14px;
              height: 14px;
              line-height: 14px;
            }
            .index{
              color: #9a9999;
              float: right;
              padding-right: 9px;
              line-height: 14px;
            }
          }
          .picture-box{
            // display: flex;
            // justify-content: space-between;
            // align-items: center;
            width: 169px;
            height: 60px;
            margin: 0 auto;
            position: relative;
            i{
              font-size: 14px;
              color: #b9b9b9;
              cursor: pointer;
              float: left;
              position: absolute;
              top: 50%;
              margin-top: -7px;
            }
            img{
              width: 60px;
              height: 60px;
              margin: auto;
            }
            .no-upload-img{
              display: block;
              width: 60px;
              height: 60px;
              margin: auto 40px;
              margin-left: 55px;
              background: #e7e7e7;
              text-align: center;
              line-height: 60px;
              font-size: 14px;
              color: #878787;
              float: left;
            }
          }
          .name{
            margin-top: 20px;
          }
          .font-12{
            margin-bottom: 10px;
            span{
              margin: 0 3px;
              color: #3f8def;
            }
          }
          .btn{
            width: 60px;
            height: 26px;
            border: 1px solid #e2e2e2;
            border-radius: 4px;
            text-align: center;
            line-height: 26px;
            margin: 17px auto 17px;
            color: #9a9999;
            cursor: pointer;
            &:hover{
              background: #3f8def;
              border: 1px solid #3f8def;
              color: #fff;
            }
          }
        }
        .manufacturer{
          cursor: pointer;
          height: 228px;
          padding: 22px 19px;
          .logoList{
            	width: 155px;
              height: 60px;
              border: solid 1px #fff;
              text-align: center;
              margin: auto;
              margin-bottom: 19px;
          }
          .logo{
            height: 60px;
            max-height: 60px;
            max-width: 153px;
            padding: 2px 0;
            box-sizing: border-box;
            margin-top: -1px;
            display: block;
            width: auto;
            margin: auto;
          }
          .NoLogo{
            line-height: 60px;
            span{font-size: 30px;font-weight: bold;color: #a8a8a8;} 
          }
          .company-name{
            font-size: 15px;
            height: 15px;
            line-height: 15px;
            margin-bottom: 13px;
          }
          .font-12{
            margin-bottom: 12px;
            text-align: left;
          }
        }
        .product{
          cursor: pointer;
          padding: 19px;
          height: 266px;
          .product-logo{
            display: block;
            width: 154px;
            height: 120px;
            line-height: 117px;
            text-align: center;
            margin: 0 auto;
            margin-bottom: 17px;
            img{
              max-width:152px;
              max-height:118px;
              display:inline-block;
              width: auto;
              margin:auto;
              vertical-align: middle;
              
            }
          }
          // .logo{
          //   display: block;
          //   max-width: 195px;
          //   height: 120px;
          //   margin: 0 auto;
          //   margin-bottom: 17px;

          // }
          .name{
            font-size: 15px;
            height: 15px;
            line-height: 15px;
            margin-bottom: 15px;
          }
          .font-12{
            margin-bottom: 13px;
            text-align: left;
          }
        }
      }
    }
  }
}
.IeCompatible{
  .IeCenter{
    margin: 0 10px;
  }
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
</style>

