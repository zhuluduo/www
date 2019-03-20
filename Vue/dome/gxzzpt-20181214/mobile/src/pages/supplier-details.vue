<template>
<div>
    <div class="supplier-details">
        <div class="supplier-details-one pull-left">
            <div class="supplier-details-one-top">
                <p>{{SupplierData.companyName}}</p>
            </div>
            <div class="supplier-details-one-bottom">
                <div class="img" :class="!SupplierData.logoUrl?'cont-left-span':''">
                    <img v-if="SupplierData.logoUrl" :src="SupplierData.logoUrl" alt="">
                    <span v-else>{{SupplierData.shortName}}</span>
                </div>
                <div class="text">
                    <p>主要工艺：</p>
                    <p class="TechnologyList">
                        <span class="pull-inline" v-for="(item,index) in SupplierData.techniqueInfo" :key="index">{{item.techniqueName}}</span>
                    </p>
                </div>
            </div>
        </div>
        <div class="supplier-details-two ">
            <span class="supplier-details-title">公司介绍</span>
            <div class="supplier-details-cont">
                <div class="supplier-details-cont-left">
                    <p id="toggleText" class="cont-left-text min-H">
                        {{extendInfo.introduceInfo?extendInfo.introduceInfo:''}}
                        <span v-if="!extendInfo.introduceInfo">暂无数据</span>
                    </p>
                    <div id="BtnToggle" class="icon-More BtnToggleTop"><i class="iconfont icon-leftArrows"></i></div>
                </div>
            </div>
        </div>
        <div class="supplier-details-two ">
            <span class="supplier-details-title">公司信息</span>
            <div class="supplier-details-cont">
                <div class="supplier-details-cont-left">
                    <p><label>国家/地区：</label><span>{{SupplierData.countryStr}}{{SupplierData.province}}{{SupplierData.city}}{{SupplierData.region}}</span></p>
                    <p><label>地址：</label><span>{{SupplierData.address}}</span></p>
                    <p><label>成立年份：</label><span>{{SupplierData.foundingTime}}</span></p>
                    <p><label>雇员数量：</label><span>{{SupplierData.extendInfo?SupplierData.extendInfo.employeeScaleStr:''}}</span></p>
                    <p><label>年产值：</label><span>{{SupplierData.extendInfo?SupplierData.extendInfo.yearlyOutputStr:''}}</span></p>
                    <p><label>最大年产能：</label><span v-if="SupplierData.extendInfo&&SupplierData.extendInfo.maxYearlyOutput!=undefined">{{SupplierData.extendInfo.maxYearlyOutput}}万元</span></p>
                    <p><label>总资产：</label><span v-if="SupplierData.extendInfo&&SupplierData.extendInfo.totalAssets!=undefined">{{SupplierData.extendInfo.totalAssets}}万元</span></p>
                    <p><label>工厂面积：</label><span>{{SupplierData.extendInfo?SupplierData.extendInfo.factoryAcreageStr:''}}</span></p>
                </div>
            </div>
        </div>
         <div class="supplier-details-two ">
            <span class="supplier-details-title">设备清单</span>
            <div class="supplier-details-cont">
                <div class="supplier-details-cont-table-header">
                   <p class="table-col-5">设备名称</p>
                   <p class="table-col-2">台数</p>
                   <p class="table-col-2">型号</p>
                </div>
                <div v-if="SupplierData.equipmentInfo==''" class="supplier-details-cont-table-cont">
                    <p class="Noevaluate">暂无数据</p>
                </div>
                <div class="supplier-details-cont-table-cont" v-for="(item,index) in SupplierData.equipmentInfo" :key="index">
                    <p class="table-col-5">{{item.equipmentName}}</p>
                    <p class="table-col-2">{{item.total}}</p>
                    <p class="table-col-2">{{item.equipmentModel}}</p>
                </div>
            </div>
        </div>
        <div class="supplier-details-two ">
            <span class="supplier-details-title">资格认证</span>
            <div class="supplier-details-cont">
                <div class="supplier-details-cont-table-header">
                   <p class="table-col-5">名称</p>
                   <p class="table-col-2">有效期</p>
                   <p class="table-col-2">附件</p>
                </div>
                <div v-if="SupplierData.qualificationInfo==''" class="supplier-details-cont-table-cont">
                    <p class="Noevaluate">暂无数据</p>
                </div>
                <div class="supplier-details-cont-table-cont" v-for="(item,index) in SupplierData.qualificationInfo" :key="index">
                    <p class="table-col-5">{{item.qualificationName}}</p>
                    <p class="table-col-2">{{item.qualificationIndate}}</p>
                    <p class="table-col-2">请在PC端查看</p>
                </div>
            </div>
        </div>
    </div>
        <DialogSlot :toggle.sync='toggle' :direction='"top"' :WH='"30%"' :LandState='true'  v-if="isRouterAlive">
            <div class="GoLand">
                <span class="LandTitle">登录后查看更多供应商信息</span>
                <div class="LandBtn">
                    <span class="el-button-primary"  @click="$router.push({path:'/login'})">去登录</span>
                    <span class="el-button-default" @click="$router.push({path:'/register/entry'})">注册</span>
                </div>
            </div>
        </DialogSlot>
</div>
</template>

<script>
import RequirmentService from '../services/RequirmentService.js'
import DialogSlot from '../components/DialogSlot.vue';
    export default {
        components:{DialogSlot},
    	data(){
            return{
              Suppliers: new RequirmentService(),
              imgInfo:'../../static/img/NoupImg.png',
              SupplierData:[],
              extendInfo:'',
              toggle:false,
              isRouterAlive:false,
            }
        },
        created() {
        },
        mounted(){
        this.SupplierList();
        setTimeout(() => {
            this.toggleText();
        }, 900);
        let user = localStorage.getItem('gxzzpt2_mobile');
        if(!user){
            this.open(); 
        }
        },
        methods: {
          toggleText(){
            let BtnToggle=document.getElementById("BtnToggle");
            let BtnToggleText=document.getElementById("toggleText");
            BtnToggle.onclick = function(){ 
            if (BtnToggle.className == "icon-More BtnToggleTop"){ 
                BtnToggle.className = "icon-More BtnToggleBottom"; 
                BtnToggleText.className="cont-left-text H-auto"
            }else{ 
                BtnToggle.className = "icon-More BtnToggleTop";
                BtnToggleText.className="cont-left-text min-H"
            } 
          }  
        },
         async SupplierList(){
            let params={
                companyId:parseInt(this.$route.query.companyId)
            }
            var result = await this.Suppliers.Supplierdetails(params);
            this.SupplierData=result.data;
            this.extendInfo=this.SupplierData.extendInfo;
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
.Noevaluate{
    text-align: center;
}
.supplier-details{
  .supplier-details-one{
       background-color: #ffffff;
      .supplier-details-one-top{
        margin-top: 10px;
        width: 720px;
        height: 88px;
        line-height:88px;
        padding:0 20px;
        p{
            font-size: 30px;
            font-weight: bold;
            color: #6b6b6b;
            border-bottom: 1.5px solid #e2e2e2;
        }
      }
      .supplier-details-one-bottom{
            overflow: hidden;
            padding:20px; 
          .img{
            width: 236px;
            height: 116px;
            line-height: 116px;
            margin: auto;
            text-align: center;
            padding: 3px;
            border: solid 1.5px #e2e2e2;
            float: left;
            img{
                display: inline-block;
                outline: none;
                border: 0;
                width: 100%;
                height: 110px;
                vertical-align: middle;
                margin-top: -14px;
            }
          }
            .cont-left-span{
                display: table;
                line-height:42px;
                padding:10px 5px; 
                span{
                display: table-cell;
                vertical-align: middle;
                font-size:36px;
                font-weight: bold;
                }
            }
          .text{
              margin-left: 255px;
              p{
                font-size: 24px;
                color: #a09f9f;
              }
              .TechnologyList{
                margin-top: 30px;
                color: #6b6b6b;  
                span{
                  margin-bottom: 30px;   
                }
              }
          }
      }
  }
  .supplier-details-two{
      background-color: #fff;
    .supplier-details-title{padding:30px 20px;}
    .supplier-details-cont{margin:0 20px;padding:30px 0}
    .supplier-details-title{
        padding-top: 38px;
        font-size: 26px;
        color: #a09f9f;
        background-color: #f1f1f1;
        display: block;
    }
    .supplier-details-cont{
       p+p{padding-top: 30px;}
       p{
        font-size: 24px;
        label{color: #a09f9f;}
        span{color: #6b6b6b;}
       }
       .supplier-details-cont-left{
        .cont-left-text{
            line-height: 44px;
            color: #6b6b6b;
            overflow: hidden;
            span{
                display:block;
                text-align:center;
            }
        }
        .icon-More{
            width: 33px;
	        height: 20px;
            position: relative;
            left: 50%;
            margin-left: -16px;
            i{
            position:absolute;
            font-size: 37px;
            color: #3f8def;
            text-align: center;
            display: block;
            transition: all .2s;
            -moz-transition: all .2s;
            -webkit-transition: all .2s;
            -o-transition: all .2s;
            }
        }
        .BtnToggleTop{
           i{
            -webkit-transform: rotate(-90deg);
            -ms-transform: rotate(-90deg);
            transform: rotate(-90deg);
           }
        }
        .BtnToggleBottom{
            i{
            -webkit-transform: rotate(-270deg);
            -ms-transform: rotate(-270deg);
            transform: rotate(-270deg);
            }
        }
        .min-H{
            max-height:210px;
        }
        .H-auto{
           height:auto;
           padding-bottom: 5px;
        }
       }
       .supplier-details-cont-table-header,.supplier-details-cont-table-cont{
        overflow: hidden;
        p{
            padding: 0;
            padding-right:10px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;  
        }
        .table-col-5{width: 50%;float: left;}
        .table-col-2{width: 25%;float: left;}
       }
       .supplier-details-cont-table-header{
           border-bottom: 1.5px solid #e2e2e2;
           margin-bottom: 20px;
           p{
               font-size: 22px;
               color: #a09f9f;
               padding-bottom: 20px;
           }
       }
       .supplier-details-cont-table-cont{
           p{
               line-height: 58px;
               font-size: 24px;
                color: #6b6b6b;
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