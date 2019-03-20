<template>
    <div id="product-case">
        <div class="content">
            <div class="bread-crumb"><span class="pull-cursor" @click="$router.push({path:'/index'})">首页</span> > <span> 产品案例</span></div>
            <div class="procuct-types pull-shadow">
                <div class="type-item">
                    <div class="label">工艺：</div>
                    <div class="checkbox-list checkbox-content ImgState HeightMin" id="BtnToggle-txt-One">
                            <div class="treeData">
                                <el-menu
                                    mode="horizontal"
                                    menu-trigger='hover'
                                    unique-opened
                                    background-color="#fff">
                                    <NavMenu :navMenus="menuData"  @nodeClick="TechnologyClick" ></NavMenu>
                                </el-menu>
                            </div>
                        <!-- <el-checkbox @change="selectTechnique(item)" v-model="item.isCheck" v-for="(item,index) in techniques" v-show="showTechnique(index)">{{item.techniqueName}}</el-checkbox> -->
                        <i class="arrow-icon el-icon-arrow-up BtnToggle BtnToggleTop" id="BtnToggleOne"></i>
                    </div>
                </div>
                <div class="type-item">
                    <div class="label">行业：</div>
                    <div class="checkbox-list checkbox-content ImgState HeightMin" id="BtnToggle-txt-Two">
                        <div class="treeData">
                            <el-menu
                                mode="horizontal"
                                menu-trigger='hover'
                                unique-opened
                                background-color="#fff">
                                <NavMenu :navMenus="industryData"  @nodeClick="industryClick"></NavMenu>
                            </el-menu>
                        </div>
                        <!-- <el-checkbox @change="selectIndustry( item )" v-model="item.isCheck" v-for="(item,index) in industrys" v-show="showIndustry(index)">{{item.industryName}}</el-checkbox> -->
                        <i class=" arrow-icon el-icon-arrow-up BtnToggle BtnToggleTop" id="BtnToggleTwo"></i>
                    </div>
                </div>
                <div class="checkedBox">
                <div class="checkTitle">已选条件：</div>
                <div class="checkCont">
                <span v-for="(item,index) in DataList" :key="index">{{item.name}}</span>
                </div>
                <div class="checkReset" @click="resetData">
                <i class="el-icon-refresh"></i>重置
                </div>
                </div>
            </div>
            <div class="product-list-box" v-loading="loading" element-loading-text="数据加载中">
            <div class="product-list clearfix">
                <div @click="$router.push({path:'/product-detail', query:{productId: item.id}})" class="product-item pull-shadow" v-for="(item,index) in productList" :key="index" :class="(index + 1) % 5==0?'no-margin-right':''">
                    <div class="logoList">
                        <img v-if="item.pictureUrls!=undefined" :src="item.pictureUrls[0]" alt="">
                        <img v-else src="../../static/img/defaultLogo.png" alt="">
                    </div>
                    <div class="name info ellipsis">{{item.productName}}</div>
                    <div class="info ellipsis">工艺：<span style="color: #a09f9f;" v-if="item.techniqueInfo!=undefined">{{item.techniqueInfo.techniqueName}}</span></div>
                    <div class="info ellipsis">材料：{{item.material}}</div>
                    <div class="info ellipsis">单价：人民币[{{item.priceScope}}]/件</div>
                </div>
            </div>
            <!-- <div v-if="productList.length<=0" style="pading:20px;text-align:center;font-size:16px;line-height:20px;"><i class="el-icon-info" style="font-size:20px;color:#3f8def;line-height:20px;margin-right:10px;"></i>暂无数据</div> -->
            <div v-if="productList.length<=0"><p class="No-data pull-shadow" ><img src="../../static/img/no-data.png" alt=""> 暂无数据</p></div>
            </div>
            <div class="pagination">
                <el-pagination @current-change="changePage" background layout="prev, pager, next" :page-count="pagination.pageCount" :current-page="pagination.currentPageIndex" :page-size="pagination.pageSize"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import NavMenu from './NavMenu.vue'
export default {
    components: {
       NavMenu
    },
    inject:['reload'],
    data() {
        return {
            industryChechboxLength: 8,
            techqiueCheckboxLength: 8,
            productList:[],
            industrys:[],
            techniques:[],
            industrys:[],
            pagination: {
                currentPageIndex: 1,
                pageSize: 8,
                pageCount: 0
            },
            searchParams: {
                techniques:[],
                industryIds:[],
                pageSize: 25,
                pageIndex: 1,
                keyword: ''
            },
            loading:false,
            menuData:[],
            industryData:[],
            TechnologDate:[],
            industryList:[],
            DataList:[],
        }
    },
    created() {
        this.searchParams.keyword = this.$route.query.searchKey || '';
        this.getIndustrys();
        this.getProductList();
        this.techniqueCheck();
        setTimeout(() => {
        this.BtnToggle();
        }, 500);
    },

    watch: {
        $route: function( route ) {
            this.searchParams.keyword = route.query.searchKey || '';
             this.getProductList();
        },
    },

    methods: {

        showTechnique( index ) {
            if ( index < this.techqiueCheckboxLength ) {
                return true;
            } else {
                return false;
            }
        },


        showIndustry( index ) {
            if ( index < this.industryChechboxLength ) {
                return true;
            } else {
                return false;
            }
        },
 

        //获取供应商列表
        getIndustrys() {
            this.$http.post('/custom/industry/all').then(( res ) => {
            if ( res.data.code ==200 ) {
                this.industrys = res.data.data;
                this.industrys.map(( item ) => {
                    this.$set(item, 'isCheck', false);
                })
            } else {
                this.$error(res.data.message);
            }
            })
        },

         changePage( pageIndex ) {
            this.searchParams.pageIndex = pageIndex;
            this.getProductList();
        },

        getProductList() {
            this.loading=true;
            this.searchParams.techniques=this.TechnologDate;
            this.searchParams.industrys=this.industryList;
            this.$http.post('/custom/productCase/list',this.searchParams).then(( res ) => {
                if ( res.data.code == 200 ) {
                    this.productList = res.data.data;
                    this.pagination = res.data.pagination;
                    window.scrollTo(0,0);
                }
                this.loading=false;
            })
        },

     /*选中--工艺---行业*/
     TechnologyClick(val){
        this.IsContains(val)
        if(!this.IsContain(this.TechnologDate,val.id)){
             this.TechnologDate.push(val.id)
         }else{
             this.TechnologDate.splice(this.TechnologDate.indexOf(val.id), 1);      
         }
         this. getProductList()
     },
     industryClick(val){
         this.IsContains(val)
         if(!this.IsContain(this.industryList,val.id)){
             this.industryList.push(val.id)
         }else{
             this.industryList.splice(this.industryList.indexOf(val.id), 1);
         }
         this. getProductList()
     },
    
    IsContains(val){
        if(!this.IsContain(this.DataList,val)){
            this.DataList.push(val)
        }else{
            this.DataList.splice(this.DataList.indexOf(val), 1);      
        }
    },

     IsContain(arr,value){
        for(var i=0;i<arr.length;i++)
        {
            if(arr[i]==value)
            return true;
        }
        return false;
    },
    /*获取工艺--行业数据*/
    techniqueCheck(){
        let parmes={}
            parmes.techniquePurpose=460020;
            parmes.techniqueType=null;
            parmes.removeEmpty=true;
          this.$http.post('/getTechniqueAndStructure',parmes).then(res=>{
              let data;
              let dataLength;
              if(res.data.code ==200){
                data=res.data.data;  
                dataLength=res.data.data.length;
              }else{
                data=[];
                dataLength=0
              }
              this.menuData=this.$conversion.LoadDataOne(data,dataLength)
        })

        let url="/custom/industryCatalog/all";
        this.$http.post(url).then(res=>{
              let data;
              let dataLength;
              if(res.data.code ==200){
                data=res.data.data;  
                dataLength=res.data.data.length;
              }else{
                data=[];
                dataLength=0
              }
              this.industryData=this.$conversion.LoadDataTwo(data,dataLength)
        })
    },
    /*查看更多*/
    BtnToggle(){
       var BtnToggleTextOne=document.getElementById("BtnToggle-txt-One");
       var BtnToggleTextTwo=document.getElementById("BtnToggle-txt-Two");
       var BtnToggle=document.getElementById('BtnToggleOne');
       var BtnToggleTwo=document.getElementById('BtnToggleTwo');
       BtnToggle.onclick = function(){
        if (BtnToggle.className == "arrow-icon el-icon-arrow-up BtnToggle BtnToggleTop"){
            BtnToggle.className = "arrow-icon el-icon-arrow-up BtnToggle BtnToggleBottom";
            BtnToggleTextOne.className="checkbox-list checkbox-content ImgState HeightOut"
        }else{
            BtnToggle.className = "arrow-icon el-icon-arrow-up BtnToggle BtnToggleTop";
            BtnToggleTextOne.className="checkbox-list checkbox-content ImgState HeightMin"
        }
        }
        BtnToggleTwo.onclick = function(){
        if (BtnToggleTwo.className == "arrow-icon el-icon-arrow-up BtnToggle BtnToggleTop"){
            BtnToggleTwo.className = "arrow-icon el-icon-arrow-up BtnToggle BtnToggleBottom";
            BtnToggleTextTwo.className="checkbox-list checkbox-content ImgState HeightOut"
        }else{
            BtnToggleTwo.className = "arrow-icon el-icon-arrow-up BtnToggle BtnToggleTop";
            BtnToggleTextTwo.className="checkbox-list checkbox-content ImgState HeightMin"
        }
        }
    },
    resetData(){
        this.reload()
    }
  }
}
</script>
<style lang="less">
.pull-cursor{cursor: pointer;}
.pull-shadow{
    box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    -webkit-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    -moz-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
}
.ellipsis{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
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
#product-case{
    div{
        box-sizing: border-box;
    }
    .clearfix{
        zoom: 1;
        &::after{
            display: block;
            visibility: hidden;
            clear: both;
            height: 0;
            content: '.';
        }
    }
    .content{
        width: 1200px;
        margin: 0 auto;
        min-height: 800px;
        .bread-crumb{
            margin-top: 15px;
            margin-bottom:10px;
            span+span{color: #3f8def;}
        }
        .procuct-types{
            padding:15px 16px 2px 16px;
            background: #fff;
            // .type-item+.type-item{margin-top: 5px;}
            .type-item{
                display: flex;
                margin-top: -10px;
                .label{
                    width: 40px;
                    padding-top: 13px;
                    color: #777;
                }
                .checkbox-list{
                    position: relative;
                    flex: 1;
                    padding-top: 10px;
                    .arrow-icon{
                        position: absolute;
                        top: 16px;
                        right: 15px;
                        font-size: 14px;
                        font-weight: 300;
                        color: #777;
                        cursor: pointer;
                    }
                }
                .el-checkbox__input{
                    vertical-align:baseline;
                }
                .el-checkbox{
                    margin-bottom: 10px;
                    width: 133px;
                    margin-left: 0;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    .el-checkbox__label{
                         text-overflow: ellipsis;
                        white-space: nowrap;
                        overflow: hidden;
                    }
                }
            }
        }
        .product-list{
            margin-top: 15px;
            .product-item{
                width: 232px;
                height: 266px;
                float: left;
                background-color: #ffffff;
                margin-bottom: 10px;
                margin-right: 10px;
                padding: 20px 20px 15px 20px;
                cursor: pointer;
                .logoList{
                    width: 154px;
                    height: 120px;
                    margin: auto;
                    text-align: center;
                    line-height: 118px;
                }
                img{
                    display: inline-block;
                    max-width: 152px;
                    max-height: 118px;
                    vertical-align: middle;
                }
                .info {
                    height: 14px;
                    line-height: 12px;
                    color: #a09f9f;
                    margin-bottom: 13px;
                    text-indent: 10px;
                }
                .name {
                    color: #777;
                    margin-top: 17px;
                    margin-bottom: 13px;
                    font-size: 14px;
                }
                
            }
        .no-margin-right{margin-right: 0}
        }
    }
}

</style>
<style lang="less" scoped>
#BtnToggleTwo,#BtnToggleOne{
    transition:all .2s;
    -moz-transition:all .2s; /* Firefox 4 */
    -webkit-transition:all .2s; /* Safari and Chrome */
    -o-transition:all .2s; /* Opera */
    }
    .BtnToggleTop{
    transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    -o-transform: rotate(180deg);
    }
    .BtnToggleBottom{
    transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    }
.HeightOut{height: auto!important;}
.HeightMin{
    height: 50px!important;
    overflow: hidden;
 }
.checkedBox{
        background: #fff;
        overflow: hidden;
        min-height: 35px;
    .checkTitle,.checkReset,.checkCont{float: left;}
    .checkCont{
        width: 1020px;
        min-height: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
        span{
            padding-right: 10px;
            padding-bottom: 6px;
            display: inline-block;
        }
    }
    .checkTitle,.checkReset{
        width: 70px;
        color: #a09f9f;
        i{
            padding-right: 3px;
            font-size: 13px;
        }
    }
    .checkTitle{
        // padding-left: 15px; 
    }
    .checkReset{
        cursor: pointer;
        text-align: right;
        padding-right: 15px;
    }
}
</style>

