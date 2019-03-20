<template>
    <div class="manufacturer-list">
          <div class="manufacturer-library-details manufacturer-library-details-top pull-shadow" v-for="(items,index) in tableData" :key="index">
               <div class="library-details-left" :class="items.logoUrl!=undefined?'':'NoLogo'">
                   <div class="maxImg " :class="minImg==false||items.productCaseInfo.list==''?'maxImg-top':''">
                       <img v-if="items.logoUrl!=undefined" :src="items.logoUrl" alt="" >
                       <span v-else>{{items.shortName}}</span>
                       <!-- <img v-else src="../../static/img/defaultLogo.png" alt=""> -->
                   </div>
                   <div class="minImg" v-if="minImg !=false&&items.productCaseInfo.list!=''">
                       <img v-for="(item,index) in items.productCaseInfo.list.slice(0,2)" :key="index" :src="item.pictureUrls[0]" alt="">
                   </div>
                   <p v-if="minImg !=false&&items.productCaseInfo.list!=''" @click="ImgJump(items)">查看全部{{items.productCaseInfo.list.length}}个产品</p>
               </div>
               <div class="sort-list" v-if="sort==true">
                   <img v-if="items.index==1" src="../../static/img/sort1.png" alt="">
                   <img v-if="items.index==2" src="../../static/img/sort2.png" alt="">
                   <img v-if="items.index==3" src="../../static/img/sort3.png" alt="">
                   <img v-if="items.index>=4&&items.index<=99" src="../../static/img/sort4.png" alt="">
                   <span v-if="items.index>=4&&items.index<=99">{{items.index}}</span>
               </div>
               <div class="library-details-center">
                  <span class="details-center-nav" @click="resolveTag(items)">{{items.companyName}}</span>
                  <el-row>
                    <el-col :span="12" class="span12">
                        <el-col :span="24" class="span24">
                            <el-col :span="6" class="span6">工艺：</el-col>
                            <el-col :span="18" class="ellipsis">
                                <span v-for="(item,index) in items.techniqueInfo" :key="index" class="pull-inline">{{item.techniqueName}}</span>
                            </el-col>
                        </el-col>
                        <el-col :span="24" class="span24">
                            <el-col :span="6" class="span6">区域：</el-col>
                            <el-col :span="18"><span v-if="items.countryStr !=''&&items.countryStr !=undefined">({{items.countryStr}})</span>{{items.province}}{{items.city}}{{items.region}}</el-col>
                        </el-col>
                        <el-col :span="24" class="span24">
                            <el-col :span="6" class="span6">行业：</el-col>
                            <el-col :span="18" class="ellipsis">
                                <span v-for="(items,index) in items.coopInfo.industryInfo" :key="index" class="pull-inline">{{items.industryName}}</span>
                            </el-col>
                        </el-col>
                        <el-col :span="24" class="span24">
                            <el-col :span="6" class="span6">企业类型：</el-col>
                            <el-col :span="18">{{items.companyClassStr}}</el-col>
                        </el-col>
                    </el-col>
                    <el-col :span="12">
                        <el-col :span="24" class="span24">
                            <el-col :span="6" class="span6">资质认证：</el-col>
                            <el-col :span="18">
                                <span v-for="(item,index) in items.qualificationInfo" :key="index" class="pull-inline">{{item.qualificationName}}</span>
                            </el-col>
                        </el-col>
                        <el-col :span="24" class="span24">
                            <el-col :span="6" class="span6">工厂面积：</el-col>
                            <el-col :span="18">{{items.extendInfo.factoryAcreageStr}}</el-col>
                        </el-col>
                        <el-col :span="24" class="span24">
                            <el-col :span="6" class="span6">雇员数量：</el-col>
                            <el-col :span="18">{{items.extendInfo.employeeScaleStr}}</el-col>
                        </el-col>
                        <el-col :span="24" class="span24">
                            <el-col :span="6" class="span6">年产值：</el-col>
                            <el-col :span="18">{{items.extendInfo.yearlyOutputStr}}</el-col>
                        </el-col>
                    </el-col>
                  </el-row>
               </div>
               <div class="library-details-right">
                   <div class="details-score">
                       <fieldset class="starability-basic">
                           <legend>交付时间：</legend>
                            <el-rate v-model="items.commentScore.deliveryTimeScore" disabled disabled-void-color='#dcdcdc'></el-rate>
                       </fieldset>
                        <fieldset class="starability-basic">
                           <legend>产品质量：</legend>
                            <el-rate v-model="items.commentScore.productQualityScore" disabled disabled-void-color='#dcdcdc'></el-rate>
                       </fieldset>
                        <fieldset class="starability-basic">
                           <legend>产品价格：</legend>
                            <el-rate v-model="items.commentScore.productPriceScore" disabled disabled-void-color='#dcdcdc'></el-rate>
                       </fieldset>
                        <fieldset class="starability-basic">
                           <legend>服务质量：</legend>
                            <el-rate v-model="items.commentScore.serviceQualityScore" disabled disabled-void-color='#dcdcdc'></el-rate>
                       </fieldset>
                        <fieldset class="starability-basic">
                           <legend>技术能力：</legend>
                            <el-rate v-model="items.commentScore.technologyAbilityScore" disabled disabled-void-color='#dcdcdc'></el-rate>
                       </fieldset>
                   </div>
               </div>
           </div>
    </div>
</template>

<script>
export default {
    props: ['tableData','sort'],
    data(){
        return{
            minImg:true,
            NoData:false,
        }
    },
    methods:{
        /*图片详情跳转---产品案例*/
        ImgJump(items){
            let routeData = this.$router.resolve({path:'/manufacturer-audits',query: { 'companyId':items.id,'position':'second'}});
            window.open(routeData.href, '_blank');
        },

        resolveTag(items){
            let routeData = this.$router.resolve({path:'/manufacturer-audits',query: { 'companyId':items.id}});
            window.open(routeData.href, '_blank');
        },
    },
    mounted() {
    },
}
</script>
<style lang="less" scoped>
         .manufacturer-library-details-top{margin-bottom:10px;}
         .manufacturer-library-details{
             width:100%;
             height:205px;
             background-color: #ffffff;
             padding: 20px 0 18px 0;
             box-sizing: border-box;
             position: relative;
             .library-details-left,.library-details-center,.library-details-right{height: 180px;float: left;}
             .library-details-left{
                 width:200px;
                 margin-top: -5px;
                 .maxImg{
                    width: 90px;
                    height: 90px;
                    border-radius: 50%;
                    background-color: #fff;
                    border: 1px solid #e2e2e2;
                    margin: auto;
                    padding: 0 12px;
                    text-align: center;
                    line-height: 90px;
                    box-sizing: border-box;
                     img{
                        display: inline-block;
                        outline: none;
                        border: 0;
                        width: 100%;
                        min-height: 40px;
                        max-height: 56px;
                        vertical-align: middle;
                        margin-top: -4px;
                     }
                 }
                 .maxImg-top{margin-top:35px;}
                 .minImg{
                     width:155px;
                     height:57px;
                     margin: auto;
                     margin-top: 8px;
                     img{
                         width:72px;
                         height:57px;
                         display: inline-block;
                         background-color: #e2e2e2;
                         border: 1px solid #e2e2e2;
                     }
                     img+img{margin-left: 10px;}
                 }
                 p{
                    font-family: MicrosoftYaHei;
                    font-size: 12px;
                    font-weight: normal;
                    font-stretch: normal;
                    letter-spacing: 0px;
                    color: #3f8def;
                    text-align: center;
                    padding-top: 9px;
                    cursor: pointer;
                    &:hover{
                        text-decoration: underline
                    }
                 }
             }
             .NoLogo{
                .maxImg{
                    padding: 0 5px;
                    line-height: 15px;
                    padding-top: 36px; 
                    span{font-weight: bold;color: #a8a8a8;} 
                }
             }
             .sort-list{
                position: absolute;
                left: 178px;
                top: 0;
                span{
                    position: absolute;
                    top: 50%;
                    text-align: center;
                    width: 100%;
                    font-size: 20px;
                    margin-top: -9px;
                    color: #fff;
                    text-shadow: 0.7px 0.7px 0px rgba(103, 103, 103, 0.52);
                }
             }
             .library-details-center{
                 width:768px;
                 height:155px;
                 border-left: 1px #e2e2e2 solid;
                 border-right: 1px #e2e2e2 solid;
                 padding: 0 27px;
                 box-sizing: border-box;
                 .details-center-nav{
                    font-family: MicrosoftYaHei;
                    font-size: 16px;
                    font-weight: normal;
                    font-stretch: normal;
                    letter-spacing: 0px;
                    color: #646464;
                    margin: 0 0 10px 0;
                    display: block;
                    cursor: pointer;
                    &:hover{
                     color:#3f8def;
                    }
                 }
                 .span12{
                    // border-right: 1px solid #e8e8e8;
                 }
                 .span24{
                    height: 30px;
                    background-color: #fafafa;
                    line-height: 30px;
                    color: #777777;
                 }
                 .span24:nth-child(even){
                            background-color: #f7f7f7;
                        }
                 .span6{
                     color: #a09f9f;
                     padding-left: 13px;
                 }
             }
             .library-details-right{
                 width:230px;
                 .details-score{
                     width:148px;
                     height:155px;
                     margin: auto;
                     margin-top: 20px;
                     .starability-basic{
                        margin: 0;
                        padding: 0;
                        border: none;
                         legend{
                            width: 60px;
                            float: left;
                            color: #777777;
                            font-size: 12px;
                         }
                         label{
                            width: 18px;
                            height: 16px;
                            display: inline-block;
                         }
                         .StarsOk{
                                background-image: url(../../static/img/stars-ok.png);
                                background-repeat: no-repeat;
                         }
                         .StarsNo{
                                background-image: url(../../static/img/stars-no.png);
                                background-repeat: no-repeat;
                         }
                     }
                     .starability-basic+.starability-basic{margin-top:5px;}
                 }
             }
         }
     .No-data{
        text-align: center;
        height: 100px;
        line-height: 100px;
        font-size: 17px;
        background: #fff;
        img{
            width: 25px;
            height: 25px;
            vertical-align: middle;
            margin-right: 4px;
        }
    }
.pull-shadow{
    box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    -webkit-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    -moz-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
}
</style>



