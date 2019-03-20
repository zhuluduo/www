<template>
<div>
    <div class="supplierLibrary">
        <div class="supplier-library">
            <div class="search">
                <div class="search-left">
                    <input type="text" @keyup.enter="search" v-model="keyword" placeholder="寻找供应商">
                    <i class="iconfont icon-fangdajing" @click="search"></i>
                </div>
                <div class="search-right" @click="open">
                    <i class="iconfont icon-shaixuan1"></i>筛选
                </div>
            </div>
            <div class="supplier-library-box">
                <ul v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="30">
                    <li v-for="(item,index) in dataInfo" v-bind:key="index" @click="$router.push({path: '/supplierDetails', query: {companyId: item.id}})">
                        <div class="cont-left">
                            <div class="cont-left-img" :class="!item.logoUrl?'cont-left-span':''"><img v-if="item.logoUrl" v-lazy="item.logoUrl"  alt=""> <span v-else>{{item.shortName}}</span></div>
                            <p>{{item.extendInfo.employeeScaleStr}}</p>
                        </div>
                        <div class="cont-right">
                            <p class="cont-right-title">{{item.companyName}}</p>
                            <div class="cont-right-list">
                                <p v-if="item.province&&item.city"><span>{{item.province}}{{item.city}}{{item.region}}</span></p>
                                <p  v-if="item.techniqueInfo"><span class="pull-inline" v-for="(items,indexs) in item.techniqueInfo" :key="indexs">{{items.techniqueName}}</span></p>
                                <p  v-if="item.coopInfo.industryInfo"><span class="pull-inline" v-for="(items,indexs) in item.coopInfo.industryInfo" :key="indexs">{{items.industryName}}</span></p>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <DialogSlot :toggle.sync='toggle' :direction='"right"' :WH='"100%"' v-if="isRouterAlive">
           <screenSlot v-on:Screening-data="ScreeningData"></screenSlot> 
        </DialogSlot>
    </div>
</div>
</template>
<script>
import DialogSlot from '../components/DialogSlot.vue';
import screenSlot from '../components/screenSlot.vue';
import RequirmentService from '../services/RequirmentService.js'
    export default {
        components:{DialogSlot,screenSlot},
    	data(){
            return{
                message:'',
                Suppliers: new RequirmentService(),
                imgInfo:'./static/img/NoupImg.png',
                toggle:false,
                isRouterAlive:false,
                keyword:'',
                dataInfo:[],
                dataState:false,
                loading:false,
                pageIndexs:1,
                pageCount:0,
                recordCount:0,
                params:{
                  pageIndex:0,
                  pageSize:10,
                  keyword:'',
                  industryIds:[],
                  techniqueTypeList:[] 
                }
            }
        },
        created() {
        },
        watch:{
         toggle(){
           if(!this.toggle){
            setTimeout(()=>{
               this.isRouterAlive=false  
            },350)
           }
         }  
        },
        mounted(){
            this.SupplierList();
        },

        methods: {
        async SupplierList(){
        this.params.pageIndex=this.pageIndexs;
        var result = await this.Suppliers.Supplier(this.params)
        this.pageCount=result.data.pagination.pageCount;
        this.recordCount=result.data.pagination.recordCount;
        if(this.dataState==false){
            this.dataInfo=this.dataInfo.concat(result.data.list);
        }else{
            this.dataInfo=result.data.list;
        }
       },
       loadMore(){
        this.loading = true;
        if(this.recordCount<=10||this.pageIndexs==this.pageCount){
            this.loading = false;
        }else{
        setTimeout(() => {
            this.pageIndexs++;
            this.SupplierList();
            this.dataState==false
            this.loading = false;
        }, 500);
        }
        },
        search(){
           this.params.keyword=this.keyword;
           this.dataState=true
           this.SupplierList();
        },
        open(){
           this.isRouterAlive=true;
           setTimeout(()=>{
               this.toggle=true;
           },20)
        },
        ScreeningData(val){
            this.params.keyword=val.keyword;
            this.params.industryIds=val.industryIds;
            this.params.techniqueTypeList=val.techniqueTypeList;
            this.dataState=true;
            this.SupplierList();
        },
    },

}

</script>
<style lang="scss">

</style>

<style lang="scss" scoped>
.pull-inline:last-child{
  &::after{content:" ";display:none;}
}
.pull-inline{
    // display: inline-block!important;
    &::after{
        content:"、";
        width: 10px;
        display: inline-block;
        padding-left: 2px;
    }
}
    .supplier-library{
        .search{
            width: 720px;
            height: 98px;
            padding: 15px 20px;
            margin:10px 0;
            overflow: hidden;
            background-color: #ffffff;
            .search-left,.search-right{float: left;}
            .search-left{
                border: solid 1.5px #d0d0d0;
                input,i{float: left;}
                input{
                    width: 470px;
                    height: 66px;
                    line-height:50px;
                    text-indent: 10px;
                    background-color: #ffffff;
                    outline: 0;
                    -webkit-appearance: none;
                    background-color: transparent;
                    font-size: 26px;
                    color: inherit;
                }
                i{
                    display:inline-block;
                    width: 60px;
                    height: 66px;
                    line-height: 66px;
                    font-size: 40px;
                    color: #767676;
                }
            }
                .search-right{
                    float: right;
                    height: 66px;
                    line-height: 66px; 
                    font-size: 26px;
                    color: #6b6b6b;
                    i{color: #767676;padding-right: 10px;}
                }
        }
        .supplier-library-box{
            margin-top:20px;
            ul{
                li+li{margin-top:10px;}
                li{
                   padding:30px 20px;
                   background-color: #ffffff;
                   overflow: hidden;
                   .cont-left{
                       float: left;
                       .cont-left-img{
                           	width: 188px;
                            height: 104px;
                            line-height:104px;
                            padding:10px 0;
                            box-sizing: border-box;
                            border: solid 1.5px #e2e2e2;
                            margin: auto;
                            text-align: center;
                            img{
                                display: inline-block;
                                outline: none;
                                border: 0;
                                max-width: 180px;
                                height: 78px;
                                vertical-align: middle;
                                margin-top:-30px;
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
                       p{
                           font-size: 22px;
                           color: #a09f9f;
                           margin-top: 10px;
                           text-align: center;
                       }
                   }
                   .cont-right{
                       margin-left:215px;
                       .cont-right-title,.cont-right-list p{
                            max-width: calc(100% - 30px);
                            overflow: hidden;
                            text-overflow:ellipsis;
                            white-space: nowrap;
                       }
   
                       .cont-right-title{
                           font-size:24px;
                           transform: scaleY(1.15);
                           margin-top:-3px;
                           color: #6b6b6b;
                           padding-bottom:3px;
                       }
                       .cont-right-list{
                           p+p{
                            padding-top:0px;    
                           }
                           span{
                            font-size: 24px;
                            color: #a09f9f;
                           }
                       }
                   }
                }
            }
        }
    }
</style>
