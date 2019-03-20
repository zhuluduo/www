<template>
<div>
    <div class="enquiry-details">
    <div class="enquiry-details-one pull-left">
        <p>
            <span class="enquiry-details-one-name">询盘编号：</span>
            <span class="enquiry-details-one-id">{{InquiriesDeta.requirementNo}}</span>
            <span class="enquiry-details-one-btn">{{InquiriesDeta.requirementStatusText}}</span>
        </p>
    </div>
    <div class="enquiry-details-two ">
        <span class="enquiry-details-title">询盘信息</span>
        <div class="enquiry-details-cont">
            <div class="enquiry-details-cont-left">
                <p><label>发布人：</label><span>{{userInfo.nickName}} ({{userInfo.companyName}} {{userInfo.jobTitle}})</span></p>
                <p><label>创建时间：</label><span>{{InquiriesDeta.createTime}}</span></p>
                <p><label>报价截止日期：</label><span>{{InquiriesDeta.offerDeadlineTime}}</span></p>
                <p><label>主工艺：</label><span class="pull-inline">{{InquiriesDeta.techniqueInfo?InquiriesDeta.techniqueInfo.techniqueName:'无'}}</span></p>
                <p><label>所属行业：</label><span>{{InquiriesDeta.industryInfo?InquiriesDeta.industryInfo.industryName:'无'}}</span></p>
                <p><label>当前报价人次：</label><span>{{InquiriesDeta.haveOfferCount}}次</span></p>
                <p><label>送货地区：</label><span>{{InquiriesDeta.deliveryProvince + InquiriesDeta.deliveryCity}}</span></p>
                <p><label>结算方式：</label><span>{{InquiriesDeta.settlementTypeText}}{{InquiriesDeta.settlementPeriodText}}</span></p>
                <p><label>询价方式：</label><span>{{InquiriesDeta.enquiryTypeText}}</span></p>
                <p><label>联系人信息：</label><span>请在PC端查看联系人信息</span></p>
            </div>
        </div>
    </div>
    <div class="enquiry-details-sher ">
        <span class="enquiry-details-title">零件信息</span>
        <div class="enquiry-details-cont" v-for="(item,index) in InquiriesDeta.requirementItemList" :key="index">
            <div class="enquiry-details-cont-left">
                <p><label>零件编号：</label><span>{{item.itemNo}}</span></p>
                <p><label>零件名称：</label><span>{{item.itemName}}</span></p>
                <p><label>材料：</label><span>{{item.material||'-'}}</span></p>
                <p><label>需求数量：</label><span >{{item.estimateCount}}</span></p>
                <p><label>报价区间：</label><span class="pull-inline" v-for="(items,index) in item.ladderPriceInfo"  :key="index" v-if="item.isLadderPrice==true"><i v-if="!items.to">></i>{{items.from}}<i v-if="items.to">-</i>{{items.to}}</span></p>
                <p><label>附件：</label><span>请在PC端查看附件</span></p>
            </div>
            <div class="enquiry-details-cont-right">
                    <img v-lazy="item.firstModelFileInfo&&item.firstModelFileInfo.thumbnailUrl?item.firstModelFileInfo.thumbnailUrl:imgInfo"  alt="">
                </div>
            </div>
        </div>
    </div>
        <DialogSlot :toggle.sync='toggle' :direction='"top"' :WH='"30%"' :LandState='true'  v-if="isRouterAlive">
            <div class="GoLand">
                <span class="LandTitle">登录后查看详细询盘信息</span>
                <div class="LandBtn">
                    <span class="el-button-primary"  @click="$router.push({path:'/login'})">去登录</span>
                    <span class="el-button-default" @click="$router.push({path:'/register/entry'})">注册</span>
                </div>
            </div>
        </DialogSlot>
</div>
</template>

<script>
import RequirmentService from '../services/RequirmentService.js';
import DialogSlot from '../components/DialogSlot.vue';
    export default {
        components:{DialogSlot},
    	data(){
            return{
              EnquiryDetails: new RequirmentService(),
              imgInfo:'./static/img/NoupImg.png',
              InquiriesDeta:'',
              userInfo:'',
              toggle:false,
              isRouterAlive:false,
            }
        },

        created() {
        },
        mounted(){
           this.Inquiries();
            let user = localStorage.getItem('gxzzpt2_mobile');
            if(!user){
                this.open(); 
            }
        
        },
        methods: {
          async Inquiries(){
            let params={
                id:parseInt(this.$route.query.id)
            }
            let result = await this.EnquiryDetails.EnquiryDetails(params)
            if(result.code==200){
                this.InquiriesDeta=result.data;
            }else{
                this.InquiriesDeta={}
            }
            this.userInfo=this.InquiriesDeta.userInfo;
          },
          open(){
           this.isRouterAlive=true;
           setTimeout(()=>{
               this.toggle=true;
           },50) 
        },
        },

    }

</script>


<style lang="scss" scoped>
.pull-inline:last-child{
  &::after{content:" ";display:none;}
}
.pull-inline{
    display: inline-block!important;
    &::after{
        content:"、";
        width: 10px;
        display: inline-block;
        padding-left: 2px;
    }
}
.enquiry-details{
  .enquiry-details-one{
        margin-top: 10px;
        width: 720px;
        height: 88px;
        line-height:88px;
        background-color: #ffffff;
      p{
        span{
          display: inline-block;
          font-size: 24px;
        }
        .enquiry-details-one-name{color: #a09f9f;}
        .enquiry-details-one-id{color: #6b6b6b;}
        .enquiry-details-one-btn{
            width:auto;
            height: 38px;
            line-height: 38px;
            padding: 0 5px;
            font-size: 22px;
            color: #3f8def;
            margin-left: 56px;
            text-align: center;
            background-color: #e8f2ff;
            border: solid 2px #3f8def;
        }
      }
  }
  .enquiry-details-two,.enquiry-details-sher{
      background-color: #fff;
    .enquiry-details-title{padding:30px 20px;}
    .enquiry-details-cont{margin:0 20px;padding:30px 0}
    .enquiry-details-title{
        font-size: 26px;
        color: #a09f9f;
        background-color: #f1f1f1;
        display: block;
    }
    .enquiry-details-cont{
       p+p{padding-top: 30px;}
       p{
        font-size: 24px;
        label{color: #a09f9f;}
        span{color: #6b6b6b;}
       }
    }
  }
  .enquiry-details-sher{
      .enquiry-details-cont{
         overflow: hidden;
         border-bottom: 1.5px solid #e2e2e2; 
      }
      .enquiry-details-cont:last-child{
          border:none;
      }
      .enquiry-details-cont-left{
          width:calc(100% - 162px);
      }
      .enquiry-details-cont-left,.enquiry-details-cont-right{float: left;}
      .enquiry-details-cont-right{
          width: 162px;
          height: 162px;
          background-color: #3f8def;
          img{
              width: 100%;
              height:100%;
          }
      }
  }
}
.pull-left{padding-left: 20px;}
.GoLand{
    margin-top: 12%;
    .LandTitle{
        display:block;
        text-align: center;
        font-size:32px;
        margin-bottom:3%;
}
    .LandBtn{
        display: flex;
        justify-content:space-between;
        align-items: center; 
        padding:50px;
        span{
            width: 240px;
            height: 60px;
            font-size: 26px;
            text-align: center;
            line-height: 60px;
            display: inline-block;
            border-radius: 6px;
            cursor:pointer
        }
        .el-button-default{
            color: #444444;
            background-color: #f8f8f8;
            border: solid 2px #dfdfdf;
        }
        .el-button-primary{
            color: #ffffff;
            background-color: #3f8def;
        }  
    }
}
</style>