<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>系统设置</el-breadcrumb-item>
          <el-breadcrumb-item>店铺设置</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="14">
        <div class="Store_setting">
          <el-form :model="ruleForm" ref="ruleForm"  class="demo-ruleForm">
            <div class="Store_top Store_paddLeft">
              <h2 class="Store_title">基本信息</h2>
              <el-form-item label="便利店编号：" prop="name">
                <span>11111111111111111111111</span>
              </el-form-item>
              <el-form-item label="店主姓名：" prop="name">
                <span>11111111111111111111111</span>
              </el-form-item>
              <el-form-item label="注册手机：" prop="name">
                <span>11111111111111111111111</span>
              </el-form-item>
              <el-form-item label="营业执照编号：" prop="name">
                <span>11111111111111111111111</span>
              </el-form-item>
              <el-form-item label="便利店名称：" prop="name">
                <span>11111111111111111111111</span>
              </el-form-item>
              <el-form-item label="所属区域：" prop="name">
                <span>11111111111111111111111</span>
              </el-form-item>
              <el-form-item label="店铺地址：" prop="name">
                <span>11111111111111111111111</span>
              </el-form-item>
              <el-form-item label="银行卡：" prop="name">
                <span>11111111111111111111111</span>
              </el-form-item>
              <el-form-item label="微信支付账号：" prop="name">
                <span>11111111111111111111111</span>
              </el-form-item>
              <el-form-item label="支付宝账号：" prop="name">
                <span>11111111111111111111111</span>
              </el-form-item>
            </div>
            <div class="Store_bottom Store_paddLeft">
              <div class="Store_upload">
                <el-form-item label="便利店图标：" prop="picUrl" >
                  <el-upload
                    class="avatar-uploader"
                    :action="url"
                    name="files"
                    :show-file-list="false"
                    :on-success="imgHandler"
                    :before-upload="beforeUpload">
                    <img v-if="ruleForm.picUrl" :src="imageUrl" class="avatar">
                    <i class="el-icon-upload2 avatar-uploader-icon"/>
                  </el-upload>
                </el-form-item>





              </div>
              <el-form-item label="外卖营业时间：" >
                <el-time-picker
                  is-range
                  v-model="ruleForm.business_hours"
                  format="HH:mm:ss"
                  placeholder="选择营业时间">
                </el-time-picker>
              </el-form-item>
              <el-form-item label="商品起送金额：" >
                <el-input v-model="ruleForm.money" class="form-inline Store_width" size="small"></el-input>
                <span class="Store_txt">元，另需配送费</span>
                <el-input v-model="ruleForm.money" class="form-inline Store_width" size="small"></el-input>
                <span class="Store_txt">元</span>
              </el-form-item>
              <el-form-item label="外卖配送半径：" >
                <el-input v-model="ruleForm.money" class="form-inline Store_width" size="small"></el-input><span class="Store_txt">km</span>
              </el-form-item>
              <div class="Store_button Store_cent">
                <el-form-item>
                  <el-button @click="resetForm('ruleForm')" icon="close" size="small">取&nbsp;&nbsp;消</el-button>
                  <el-button type="primary" icon="check" @click="submitForm('ruleForm')" size="small">保&nbsp;&nbsp;存</el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="Stor_money">
          <span>￥10000</span>
          我的钱包
        </div>
        <div class="Stor_codeBox">
            <div class="codeImg">
              <img :src="codeImg" v-if="codeImg!=''" alt="二维码">
              <el-button type="primary" @click="codeImage" size="small" v-else>生成二维码</el-button>
            </div>
            <div class="codeTxt">
              <span class="codeDownload">门店小程序二维码
                <el-button type="primary"  @click="dowCode" size="small" >下载<a href="" id="dowCode"></a></el-button>
              </span>
              <span>提示：</span>
              <span>扫一扫</span>
              <span>可自助买单,告别排队!</span>
              <span>还可以叫外卖哦!</span>
            </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {bus} from '../../bus.js'
  import {dateFormat} from '../../utils/date.js';
    export default{
      data(){
            return {
              url:bus.host+'/pos/api/upload',
              codeImg:'',
              ruleForm:{
                name:'1111166666',
                money:'',
                business_hours:[],
                picUrl:'',
              },
              imageUrl:'',
            }
        },
        methods: {
          wechatImg(){
            let url='https://www.jfun365.cn:443/wbl/api/store/generation/wechat/appimg';
            this.$http.get(url).then((res)=>{
              let codeImg=res.data.msg;
              console.log(res)
              console.log(res.data)
              if(res.data.success==false){
                this.$message({
                  message:res.data.msg,
                  type: 'warning'
                });
                return false;
              }
              this.codeImg=codeImg;
            }).catch((res)=>{

            })
          },
          submitForm(formName) {
            this.$refs[formName].validate((valid) => {
              if (valid) {
                if(this.ruleForm.business_hours[0]==null&&this.ruleForm.business_hours[0]==undefined&&this.ruleForm.business_hours[1]==null&&this.ruleForm.business_hours[1]==undefined){
                  this.$message({
                    message: '请选择营业时间',
                    type: 'warning'
                  });
                  return false;
                }else {
                  let startBusiness=dateFormat(this.ruleForm.business_hours[0],'hh:mm:ss');
                  let endBusiness=dateFormat(this.ruleForm.business_hours[1],'hh:mm:ss');
                  console.log(startBusiness)
                  console.log(endBusiness)
                  this.ruleForm.business_hours=[startBusiness,endBusiness]
                  console.log(this.ruleForm.business_hours)
                }
              } else {
                return false;
              }
            });
          },
          resetForm(formName) {
            this.$refs[formName].resetFields();
          },
          /*图片上传*/
          imgHandler(res, file){
            this.ruleForm.picUrl = res.msg[0];
            this.imgurl=bus.imgHost+res.msg;
//            this.ruleForm.imageUrl = URL.createObjectURL(file.raw);
          },
          beforeUpload(file){
            const isImg = file.type === 'image/jpeg' || file.type === 'image/png'||file.type === 'image/gif';
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isImg) {
              this.$message.error('上传图片只能是jpg/png/gif格式!');
            }
            if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isImg && isLt2M;
          },
          /*生成二维码*/
          codeImage(){
            this.wechatImg();
          },
          dowCode(){
						// <el-button type="primary"  @click="dowCode" size="small" >下载<a href="" id="dowCode"></a></el-button>

            let live= $("#dowCode");
            let urls="http://pic4.nipic.com/20091217/3885730_124701000519_2.jpg"
            live.attr("href",urls)
            live.attr("download","下载")
          },
          },
          mounted() {

          }
    }
</script>
<style rel="stylesheet/scss" lang="scss" >
  .Store_width input{width: 100px;}
  .Store_top{
    .el-form-item{margin-bottom: 0}
    label{
      width: 120px;
      font-size: 15px;
      padding-right: 0px;
    }
    span{
      color: #999;
      font-size: 15px;
    }
  }
  .Store_bottom{
    .el-form-item{margin-bottom: 5px;}
    label{
      width: 120px;
      font-size: 15px;
      padding-right: 0px;
    }
  }
  .Store_upload{
    .el-upload--text ,i{
      width:200px;
      height: 120px;
    }
    i{
      line-height: 120px;
    }
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  *{
    font-weight: normal;
    font-style: normal;
  }
  .form-inline, .form-inline .form-control {
    display: inline-block;
    width: auto;
    vertical-align: middle;
  }
  .Store_cent{
    text-align: center;
  }
  .Store_setting{
    box-sizing: border-box;
    .Store_title{
      margin: 0 0 5px 0;
      padding-bottom: 10px;
      font-size: 16px;
      position: relative;
      &::after{
        content: '';
        width: 90%;
        position: absolute;
        left: 0;
        bottom: 0;
        height: 1px;
        border-bottom: 1px dashed #ccc;
      }
    }
    .Store_paddLeft{
        padding-left: 2%;
    }
  }
  .Store_txt{
    padding: 0 5px;
  }
  .Stor_money{
    width: 180px;
    height: 80px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    box-sizing: border-box;
    padding-top: 12px;
    text-align: center;
    font-size: 14px;
    margin-top: 30px;
    span{
      font-size: 24px;
      display: block;
    }
  }
  .Store_bottom {
    margin-top: 30px;
  }
  .Stor_codeBox{
    width: 380px;
    height: 180px;
    margin-top: 20px;
    border: 1px dashed #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    .codeImg{
      width: 180px;
      height: 180px;
      line-height: 150px;
      padding: 10px;
      text-align: center;
      box-sizing: border-box;
      float: left;
      img{
        width: 100%;
        height: 100%;
      }
    }
      .codeTxt{
        width: 200px;
        height: 180px;
        float: left;
        padding-top: 50px;
        margin-left: -2px;
        text-align: center;
        box-sizing: border-box;
        span{
          display: block;
          color: #999;
          font-size: 14px;
          padding-right: 25px;
        }
      .codeDownload{
        font-size: 15px;
        padding-bottom: 10px;
        button{
          position: relative;
        }
        a{
          position: absolute;
          left: 0;
          top:0;
          width: 100%;
          height: 100%;
          color: #fff;
          cursor: pointer;
          &:hover{
            text-decoration: underline;
          }
        }
      }
      }
  }
  .Store_button{margin-top: 5%;}
  /*@media screen and (max-width:1366px) {*/
    /*.Store_setting  .Store_paddLeft{*/
      /*padding-left: 18% ;*/
    /*}*/
  /*}*/
</style>
