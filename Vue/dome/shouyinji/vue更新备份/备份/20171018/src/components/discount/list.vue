<template>
  <el-row class="warp">
    <el-row class="breadcrumb-border nav_top">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/discount/promotion' }">促销管理</el-breadcrumb-item>
          <el-breadcrumb-item>活动类别</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-col :span="24" class=" border-default">
      <!--单品促销-->
      <el-col :span="24" v-if="this.ruleForm.typeCode==3||this.$route.query.value==3"><v-single></v-single></el-col>
      <!--满减-->
      <el-col :span="24" v-if="this.ruleForm.typeCode==4||this.$route.query.value==4"><v-reduce></v-reduce></el-col>
      <!--套餐-->
      <el-col :span="24" v-if="this.ruleForm.typeCode==6||this.$route.query.value==6"><v-composition></v-composition></el-col>
      <!--满赠-->
      <el-col :span="24" v-if="this.ruleForm.typeCode==5||this.$route.query.value==5"><v-present></v-present></el-col>
      <!--折扣-->
      <el-col :span="24" v-if="this.ruleForm.typeCode==1||this.$route.query.value==1"><v-discount></v-discount></el-col>
      <!--单品特价-->
      <el-col :span="24" v-if="this.ruleForm.typeCode==7||this.$route.query.value==7"><v-bargaining></v-bargaining></el-col>
    </el-col>
  </el-row>
</template>

<script>
  import Vue from 'vue';
  import {bus} from '../../bus.js';
  import single from './single'
  import reduce from './reduce'
  import composition from './composition'
  import present from './present'
  import discount from './discount'
  import bargaining from './bargaining'
  export default {
    components: {
      "v-single": single,
      "v-reduce": reduce,
      "v-composition": composition,
      "v-present": present,
      "v-discount": discount,
      "v-bargaining": bargaining,
    },
    data() {
      return {
        url: bus.host + '/pos/api/product/list',
        ruleForm: {
          typeCode: '',
        },
      };
    },
    methods: {
      /*数据查询*/
      created(){
        if (this.$route.query.couponId) {
          let url = bus.host + '/pos/api/promotion/detail?couponId='
          let id = this.$route.query.couponId;
          if (id == null) {
            return false;
          }
          this.$http.get(url + id).then((response) => {
            let upcaead = response.data.msg;
            this.ruleForm.typeCode = upcaead.typeCode;
          }, (response) => {
            this.$notify.error({
              title: '错误',
              message: '这是一条错误的提示消息'
            });
          });
        } else {
          this.ruleForm.typeName = this.$route.query.label;
          this.ruleForm.value = this.$route.query.value;
        }
      },

    }
    ,
    mounted()
    {
      this.created();
    }
  }
</script>
<style>
  .checked_len_true{display: none}
  .checked_len_false{display: block}
  .fl{float:left }
  .fr{float:right }
  .mg_r{margin-right: 10px}
  .mg-bot {margin-bottom: 10px  }
  .edtit { padding-top: 5px;  color: #9e9e9e  }
  .txt-cent { text-align: center;  }
  .padd_L { padding-left: 0px !important;  }
  .padd_R { padding-right: 0px !important;  }
  .padd_N { padding: 0px !important;  }
  .Dmresource_redia .el-form-item__label { width: 210px }
  #tableData_ov .el-table__body-wrapper {
    max-height: 500px;
    overflow: auto;
    overflow-x: hidden;
  }
  .form-inline, .form-inline .form-control {
    display: inline-block;
    width: auto;
    vertical-align: middle;
  }
  input[type=number] { -moz-appearance: textfield; }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none;  margin: 0;  }
  .form_input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #bfcbd9;
    box-sizing: border-box;
    color: #1f2d3d;
    display: inline-block;
    font-size: 14px;
    height: 36px;
    line-height: 1;
    outline: 0;
    padding: 3px 10px;
    transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
    width: 60px;
  }
  .formtxt { display: inline-block;  font-size: 14px;  }
  .mbCoupon { margin: 0 0 22px 26px;  color: #48576a;  }
  .Determine { overflow: hidden;  height: auto;  }
  .rminename { width: 300px  }
  .DetermineForm .el-form-item__label, .Dmck .el-checkbox-group .el-checkbox {  width: 110px; }
  .DetermineForm .el-form-item__error, .Dmck .el-form-item__content { margin-left: 110px  }
  .Dmresource_redia .el-form-item__label { width: 210px;  }
  .DetermineForm .el-textarea { width: 300px; }
  .Dmck .el-checkbox + .el-checkbox, .Dmck .el-form-item__error { margin-left: 0 }
  .fullslist .ful_m { margin-top: 3px;  }
  .fullmode {
    width: 30px;
    float: left;
    margin-top: 5px;
  }
  .fullgift { margin-left: 40px;}
  #coupon .el-input__inner { height: 30px }
  .fullgoodscode, .fullgoodscode input { width: 150px }
  .fullgoodsleng, .fullgoodsleng input { width: 50px }
  .prolab .el-form-item__label { width: 120px  }
  .Promotionlist li { margin-bottom: 10px; }
  .mini_heiht { height: 30px }
  .el-dialog__box .el-dialog__body { padding: 10px 20px;}
  .el-dialog__footer{overflow: hidden}
  .Grouptab .el-table__body-wrapper{overflow: hidden;}
  /*.Grouptab::-webkit-scrollbar-track{ -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);  background-color: #F5F5F5;  }*/
  /*.Grouptab::-webkit-scrollbar {  width: 6px;  background-color: #F5F5F5;  }*/
  /*.Grouptab::-webkit-scrollbar-thumb {background-color: #000000;}*/
</style>
<style scoped lang="scss">
  .Dmck label, .Dmck .formtxt {
    line-height: 35px;
  }

  /*.DetermineForm {*/
    /*width: 840px*/
  /*}*/
  .edtit {
    padding-top: 5px;
    font-size: 14px;
    color: #9e9e9e;
  }
  .Grouptab{
    border:1px solid #ECE5DF;
    padding:10px;
    max-height: 500px;
    overflow: auto;
    overflow-x: hidden;
  }
  .group_len{color: #20A0FF;}
</style>
