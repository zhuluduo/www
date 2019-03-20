<template>
	<div id="manufacturerLibrary">
        <div class="bread-crumb"><span class="pull-cursor" @click="$router.push({path:'/index'})">首页</span> > <span> 供应商库</span></div>
        <div class="manufacturer-library-header pull-shadow">
            <div class="manufacturer-library-checkbox">
                <div class="checkbox-title">
                   工艺：
                </div>
                <div id="BtnToggle-txt-One"  class="checkbox-content ImgState HeightMin">
                <div class="treeData">
                    <el-menu
                        mode="horizontal"
                        menu-trigger='hover'
                        unique-opened
                        background-color="#fff">
                        <NavMenu :navMenus="menuData"  @nodeClick="TechnologyClick" ></NavMenu>
                    </el-menu>
                </div>
                <div class="Img-W">
                   <i class="el-icon-arrow-up BtnToggle BtnToggleTop" id="BtnToggleOne" ></i>
                </div>
                </div>
            </div>
            <div class="manufacturer-library-checkbox">
                <div class="checkbox-title">
                   行业：
                </div>
                <div id="BtnToggle-txt-Two" class="checkbox-content ImgState HeightMin">
                 <div class="treeData">
                    <el-menu
                        mode="horizontal"
                        menu-trigger='hover'
                        unique-opened
                        background-color="#fff">
                        <NavMenu :navMenus="industryData"  @nodeClick="industryClick"></NavMenu>
                    </el-menu>
                </div>
                <div class="Img-W">
                   <i class="el-icon-arrow-up BtnToggle BtnToggleTop" id="BtnToggleTwo" ></i>
                </div>
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
        <div class="manufacturer-library-box"  v-loading="loading" element-loading-text="数据加载中">
         <p class="No-data pull-shadow" v-if="NoData==false"><img src="../../static/img/no-data.png" alt=""> 暂无数据</p>
         <manufacturerList :tableData='tableData'></manufacturerList>
        </div>

        <div class="pagination">
            <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page.currentPage"
            :page-size="page.size"
            layout="total, prev, pager, next"
            :total="page.total">
        </el-pagination>
        </div>
    </div>
</template>

<script>
import NavMenu from './NavMenu.vue'
import manufacturerList from './manufacturer-list.vue'
export default {
   components: {
       NavMenu,manufacturerList
    },
  inject:['reload'],  
  data () {
    return {
     keyword: '',
     Form:{
        techniqueData:[],
        TradeList:[],
     },
     tableData:[],
     ProductList:[//产品图片集合
         'http://dw.tatfookcloud.com/static/ae/3c/fc/86/706/e11/e8b/35a/005056a828db.jpg',
         'http://dw.tatfookcloud.com/static/de/5c/bb/9c/752/611/e89/243/005056a828db.jpg'
     ],
     loading:false,
     NoData:true,

     Rate:{ //评分
      quality:4,
      Price:4.5,
      goods:5,
      speed:3.5,
      ability:5
     },
      // 分页信息
      page:{
        currentPageIndex:1, // 当前页
        size:15, // 每页大小
        total:0, // 总页数
     },
     minImg:true,

     menuData:[],
     industryData:[],
     TechnologDate:[],
     industryList:[],
     DataList:[],
    }
  },

    watch: {
        $route: function( route ) {
            this.keyword = route.query.searchKey || '';
            this.createds();
        },
    },

   created(){
    let _this=this;
    //获取个人信息枚举
    this.keyword = this.$route.query.searchKey || '';
    this.techniqueCheck();
    _this.createds();
    setTimeout(() => {
        _this.BtnToggle();
    }, 500);
   },
  methods:{
    /*数据初始化*/
    createds(){
     let _this=this;
     let url="/getManufacturerList";
     let params={
        keyword: this.keyword,
        pageIndex: _this.page.currentPageIndex,
        pageSize:_this.page.size,
        techniqueTypeList:this.TechnologDate,
        industryIds:this.industryList,
      }
      _this.loading=true;
     _this.$http.post(url,params).then(res=>{
        if(res.data.code ==200){
        let data=res.data.data.list;
        let pageTotal=res.data.data.pagination.recordCount;
        if(data!=undefined){
        if(data.constructor !=Array){
           data=[];
           pageTotal=0
           _this.NoData=false
        }else{
           _this.NoData=true
        }
        _this.page.total=pageTotal;
        for(let i=0;i<data.length;i++){
          if(data[i].coopInfo===undefined){
            data[i].coopInfo={}
            data[i].coopInfo.industryInfo=[]
           }
          if(data[i].extendInfo===undefined){
            data[i].extendInfo.employeeScaleStr='';
            data[i].extendInfo.factoryAcreageStr='';
            data[i].extendInfo.yearlyOutput='';
          }
        }
        _this.tableData=data;
        // _this.tableData.map((ele, i) => {
        //     _this.tableData[i].index=i;
        //     this.$set(ele, "index", i + 1); 
        // });
        // console.log(_this.tableData)
         window.scrollTo(0,0);
        }
        }else{
          _this.tableData=[];
          _this.NoData=false
        }

        _this.loading=false;
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
         this.createds()
     },
     industryClick(val){
         this.IsContains(val)
         if(!this.IsContain(this.industryList,val.id)){
             this.industryList.push(val.id)
         }else{
             this.industryList.splice(this.industryList.indexOf(val.id), 1);
         }
         this.createds()
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

    /*处理分页事件*/
    handleSizeChange(val) {
      this.page.size = val;
      this.createds();
    },
    handleCurrentChange(val) {
      this.page.currentPageIndex = val;
      this.createds();
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

    //重置数据
    resetData(){
        this.reload()
    },


    /*查看更多*/
    BtnToggle(){
       var BtnToggleTextOne=document.getElementById("BtnToggle-txt-One");
       var BtnToggleTextTwo=document.getElementById("BtnToggle-txt-Two");
       var BtnToggle=document.getElementById('BtnToggleOne');
       var BtnToggleTwo=document.getElementById('BtnToggleTwo');
       BtnToggle.onclick = function(){
        if (BtnToggle.className == "el-icon-arrow-up BtnToggle BtnToggleTop"){
            BtnToggle.className = "el-icon-arrow-up BtnToggle BtnToggleBottom";
            BtnToggleTextOne.className="checkbox-content ImgState HeightOut"
        }else{
            BtnToggle.className = "el-icon-arrow-up BtnToggle BtnToggleTop";
            BtnToggleTextOne.className="checkbox-content ImgState HeightMin"
        }
        }
        BtnToggleTwo.onclick = function(){
        if (BtnToggleTwo.className == "el-icon-arrow-up BtnToggle BtnToggleTop"){
            BtnToggleTwo.className = "el-icon-arrow-up BtnToggle BtnToggleBottom";
            BtnToggleTextTwo.className="checkbox-content ImgState HeightOut"
        }else{
            BtnToggleTwo.className = "el-icon-arrow-up BtnToggle BtnToggleTop";
            BtnToggleTextTwo.className="checkbox-content ImgState HeightMin"
        }
        }
    },
  },
  mounted(){
  },
}
</script>
<style lang='less'>
  #manufacturerLibrary{
    .checkbox-content{
        .el-checkbox+.el-checkbox{
            margin-left:0;
        }
         .el-checkbox{
            width: 133px;
            margin-bottom: 15px;
            overflow: hidden;
            -o-text-overflow: ellipsis;
               text-overflow: ellipsis;
            white-space: nowrap;
         }
         .el-checkbox__label{
             width: 105px;
         }
    }
    .starability-basic{
      span{
        .el-rate__icon{
            font-size: 13px!important;
            margin-right: 3px!important;
        }
      }
    }
     .manufacturer-library-header{
        .el-checkbox__label{
           font-size: 12px;
        }
     }
  }
</style>

<style scoped lang='less'>
.pull-cursor{cursor: pointer;}
.pull-shadow{
    box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    -webkit-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    -moz-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
}
.pagination{
    margin-top: 10px;
    margin-bottom: 55px;
    button{
     width: 530px!important;
     height: 45px!important;
     font-size: 18px!important;
    }
}
.ellipsis{
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}
.pull-inline{display: inline-block!important;}
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
.pull-inline+.pull-inline{
    &::before{
        content:",";
        width: 5px;
        display: inline-block;
        padding-left: 2px;
    }
}
  #manufacturerLibrary{
     width: 1200px;
     min-height:500px;
     margin: auto;
     margin-top:15px;
     box-sizing: border-box;
     font-size: 12px!important;
     .bread-crumb{
        margin-bottom:10px;
        span+span{
        color: #3f8def;;
        }
     }
     .manufacturer-library-header{
        width: 1200px;
	    min-height:85px;
        background-color: #fff;
        padding: 15px;
        box-sizing: border-box;
        .manufacturer-library-checkbox{
            min-height: 36px;
            margin-top: -10px;
            .checkbox-title{
                width: 40px;
                padding-top: 10px;
                font-family: MicrosoftYaHei;
                letter-spacing: 0px;
                color: #a09f9f;
                float: left;
            }
            .checkbox-content{
                margin-left: 40px;
                padding-top: 10px;
            }
        }
        //  .manufacturer-library-checkbox+ .manufacturer-library-checkbox{min-height: auto;}
     }
     .manufacturer-library-box{
         width:100%;
         height:100%;
         margin-top:17px;
         .manufacturer-library-details-top{margin-bottom:10px;}
         .manufacturer-library-details{
             width:100%;
             height:205px;
             background-color: #ffffff;
             padding: 20px 0 18px 0;
             box-sizing: border-box;
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
     }
  }
.HeightOut{
    height: auto!important;
    }
    .HeightMin{
    height: 50px!important;
    overflow: hidden;
}
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
  .ImgState{
      position: relative;
      .Img-W{
        position: absolute;
        right: 10px;
        top: 16px;
        cursor: pointer;
        i{font-size: 14px;}
      }
  }
.checkedBox{
        background: #fff;
        overflow: hidden;
        min-height: 35px;
    .checkTitle,.checkReset,.checkCont{float: left;}
    .checkCont{
        width: 1025px;
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
