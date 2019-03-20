<template>
    <div class="screenSlot">
        <div class="search-cont">
            <div class="search">
            <div class="search-bottom">
                <input type="text" v-model="keyword" placeholder="寻找供应商">
            </div>
            <!-- <i @click="close" class="iconfont icon-leftArrows"></i> -->
            <span @click="close">取消</span>
        </div>
        <div class="Technology">
            <span class="title">工艺：</span>
            <div id="Technology-icon" class="icon-More BtnToggleTop" @click="toggleText('Technology-icon','Technology-check')"><i class="iconfont icon-leftArrows"></i></div>
            <div id="Technology-check" class="checkbox-list min-H">
                <el-checkbox-group 
                    v-model="techniqueTypeList">
                        <el-checkbox  v-for="(item,index) in TechnologyData" :label="item.id" :key="item.id"  :class="(index + 1) % 2==0?'M-left':''">{{item.techniqueName}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <div class="industry">
            <span class="title">行业：</span>
            <div id="industry-icon" class="icon-More BtnToggleTop" @click="toggleText('industry-icon','industry-check')"><i class="iconfont icon-leftArrows"></i></div>
            <div id="industry-check" class="checkbox-list min-H">
                <el-checkbox-group 
                    v-model="industryIds">
                    <el-checkbox  v-for="(item,index) in industryData" :label="item.id" :key="item.id" :class="(index + 1) % 2==0?'M-left':''">{{item.industryName}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        </div>
        <div class="searchFooter">
            <span class="el-button-default" @click="onReset">重置</span>
            <span class="el-button-primary" @click='onSubmit'>确定</span>
        </div>
    </div>
</template>

<script>
import CompanyService from '../services/CompanyService.js'
    export default {
    	data(){
            return{
                keyword:'',
                CompanyService:new CompanyService(),
                TechnologyData:[],
                industryData:[],
                techniqueTypeList:[],
                industryIds:[]
            }
        },
        created() {
        },
        mounted(){
            this.Technology();  
            this.industry(); 

        },
        props: [],
        methods: {
        async Technology(){
            let params={
                techniquePurpose:460020,
            }
           let data = await this.CompanyService.getTechNameList(params);
            this.TechnologyData=data.data;
        },
        async industry(){
           let data = await this.CompanyService.getTechnologyList();
           this.industryData=data.data;
        },
        close(){
           this.$bus.$emit('StateToggle', false)
        },
        onSubmit(){
            let parmas={
                keyword:this.keyword,
                techniqueTypeList:this.techniqueTypeList,
                industryIds:this.industryIds
            }
            this.$emit('Screening-data',parmas);
            this.$bus.$emit('StateToggle', false)
            this.onReset();
        },
        onReset(){
          this.keyword='';  
          this.techniqueTypeList=[];
          this.industryIds=[];
        },
         toggleText(id,id2){
          let btn = document.getElementById(id);
          let checkToggle=document.getElementById(id2);
          if(btn.className=='icon-More BtnToggleTop'){
             btn.className = "icon-More BtnToggleBottom";
             checkToggle.className="checkbox-list max-auto"
          }else{
             btn.className = "icon-More BtnToggleTop";
             checkToggle.className="checkbox-list min-H"
          }
        }
        },
    }

</script>

<style lang="scss">
.screenSlot{
  .el-checkbox__input{
      float: left;
    .el-checkbox__inner{
        border-radius: 50%;
        width: 19PX;
        height: 19PX;
        border: solid 1.5px #c9c9c9;
    }
    .el-checkbox__inner::after{
        height: 8PX;
        width: 5PX;
        left: 5PX;
        top: 3PX;
    }
  }
  .el-checkbox__input.is-checked{
      .el-checkbox__inner{
        background-color:#3f8def;
        border: solid 1.5px #3f8def;
      }
  }
  .el-checkbox__label{
     max-width: calc(100% - 8px);
     display: block;
     padding-left:40px;
     word-break: break-all;
     word-wrap: break-word;
     white-space: pre-wrap;
     vertical-align: top;
  }
}
</style>

<style lang="scss" scoped>
.screenSlot{
    position: relative;
    padding-left:15px;
    padding-right: 15px;
    .search-cont{
        padding-bottom: 200px;
        // max-height: calc(100% - 200px);
        // overflow-y: auto;
        // overflow-x: hidden;
    }
    .search{
        margin-top: 15px;
        margin-bottom: 24px;
        width: 100%;
        height: 68px;
        display:box;
        display: -webkit-box;
        span{
            font-size: 24px;
            display: inline-block;
            height: 68px;
            line-height: 68px;
            display: block;
            padding-left:35px;
            padding-right:0px;
            text-align: left;
        }
        .search-bottom{
            width:100%;
	        height: 68px;
            border: solid 1.5px #d0d0d0;
            -webkit-box-flex: 1;
            input{
                width: 100%;
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
        }
    }
    .Technology,.industry{
        position: relative;
       .title{
        font-size: 26px;
        color: #a09f9f;
        display:inline-block;
        margin-bottom: 20px;
       }
        .icon-More{
            width: 30%;;
	        height: 37px;
            text-align: right;
            float: right;
            i{
            font-size:40px;
            color: #a09f9f;
            display: inline-block;
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
    }
    .industry{
        margin-top: 30px;
    }
    .checkbox-list{
        overflow: hidden;
        label{
        width: 49%;
        margin: 0;
        font-size: 26px;
        color: #6b6b6b;
        margin-bottom: 15px;
        }
    }
    .checkbox-list.min-H{
        label:nth-child(12){
            padding-bottom:60px;
        }
    }
    .checkbox-list.max-auto{
        label:nth-child(12){
            padding-bottom:0;
        }
    }
    .M-left{
        margin-left: 2%!important;
        vertical-align: top;
    }
    .searchFooter{
    padding:50px;
    padding-bottom: 70px;
    display: flex;
    justify-content:space-between;
    align-items: center;
    position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
    z-index: 8888;
    background: #fff;
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
  .min-H{
      height:185PX;
  }
  .max-auto{
      height:auto;
  }
}
</style>