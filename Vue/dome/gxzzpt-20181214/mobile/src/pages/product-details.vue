<template>
<div>
    <div class="product-details">
        <div class="product-details-one pull-left">
            <span class="name1">{{productData.productName}}</span>
            <span class="name2" @click="$router.push({path: '/supplierDetails',query:{companyId: productData.companyInfo.id}})">{{productData.companyInfo?productData.companyInfo.companyName:''}}</span>
        </div>
        <div class="product-details-two ">
            <span class="product-details-title">产品图片</span>
            <div class="product-details-cont">
               <div class="image-list" v-for="(item,index) in productData.pictureUrls" :key="index">
                   <img v-lazy="productData.pictureUrls?item:imgInfo" alt="">
               </div>
            </div>
        </div>
        <div class="product-details-two ">
            <span class="product-details-title">零件信息</span>
            <div class="product-details-cont">
                <div><label>行业：</label><p><span class="pull-inline"  v-for="(items,indexs) in industryList" :key="indexs">{{items.industryName}}</span></p></div>
                <div><label>工艺：</label><p><span class="pull-inline" v-for="(items,indexs) in companyTechniqueList" :key="indexs">{{items.techniqueInfo.techniqueName}}</span></p></div>
                <div><label>材料：</label><span>{{productData.material}}</span></div>
                <div><label>报价范围：</label><span>{{productData.priceScope||'无'}}</span></div>
            </div>
        </div>
    </div>
        <!-- <DialogSlot :toggle.sync='toggle' :direction='"top"' :WH='"30%"' :LandState='true'  v-if="isRouterAlive">
            <div class="GoLand">
                <span class="LandTitle">登录后查看更多供应商信息</span>
                <div class="LandBtn">
                    <span class="el-button-primary"  @click="$router.push({path:'/login'})">去登录</span>
                    <span class="el-button-default" @click="$router.push({path:'/register/entry'})">注册</span>
                </div>
            </div>
        </DialogSlot> -->
</div>
</template>

<script>
import RequirmentService from '../services/RequirmentService.js'
import DialogSlot from '../components/DialogSlot.vue';
    export default {
        components:{DialogSlot},
    	data(){
            return{
              productConts: new RequirmentService(),
              imgInfo:'../../static/img/NoupImg.png',
              productData:[],
              industryList:[],
              companyTechniqueList:[],
              toggle:false,
              isRouterAlive:false,
            }
        },

        created() {
        },
        mounted(){
            this.productCont();
            // let user = localStorage.getItem('gxzzpt2_mobile');
            // if(!user){
            //    this.open(); 
            // }
        
        },
        methods: {
         async productCont(){
            let params={
                id:parseInt(this.$route.query.productId)
            }
            var result = await this.productConts.Productdetails(params);
            this.productData=result.data;
            this.industryList=this.productData.companyInfo.companyCoopInfo.industryList;
            this.companyTechniqueList=this.productData.companyInfo.companyTechniqueList;
        },
        // open(){
        //    this.isRouterAlive=true;
        //    setTimeout(()=>{
        //        this.toggle=true;
        //    },50) 
        // },

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
.product-details{
  .product-details-one{
        margin-top: 10px;
        width: 720px;
        height: 88px;
        line-height:88px;
        padding: 0 20px;
        background-color: #ffffff;
    span{
        font-size: 24px;
        display:inline-block;
        float: left;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;  
    }
    .name1{color: #6b6b6b;width: 35%;}
    .name2{color: #3f8def;width: 63%;margin-left: 2%;text-align: right;}
  }
  .product-details-two,.product-details-sher{
      background-color: #fff;
    .product-details-title{padding:30px 20px;}
    .product-details-cont{margin:0 20px;padding:20px 0}
    .product-details-title{
        padding-top: 38px;
        font-size: 26px;
        color: #a09f9f;
        background-color: #f1f1f1;
        display: block;
    }
    .product-details-cont{
       div+div{padding-top: 30px;}
       div{
        font-size: 24px;
        overflow: hidden;
        label{color: #a09f9f;float: left;}
        span{color: #6b6b6b;}
        p{margin-left:70px;}
       }
      .image-list{
        display: block;
       	width: 100%;
	    height: 550px;
        line-height: 547px;
        text-align: center;
        margin: 0 auto; 
        img{
            max-width:100%;
            max-height: 547px;
            display: inline-block;
            width: auto;
            margin: auto;
            vertical-align: middle;
        }
      }  
    }
  }

}
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