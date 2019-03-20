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
          <el-form :model="ruleForm" ref="ruleForm" class="demo-ruleForm">
            <div class="Store_top Store_paddLeft">
              <el-form-item label="便利店编号：" prop="name">
                <span class="Store_item">{{ruleForm.no}}</span>
              </el-form-item>
              <el-form-item label="店主姓名：" prop="name">
                <span class="Store_item">{{ruleForm.ownerName}}</span>
              </el-form-item>
              <el-form-item label="注册手机：" prop="name">
                <span class="Store_item">{{ruleForm.telephone}}</span>
              </el-form-item>
              <el-form-item label="营业执照编号：" prop="name">
                <span class="Store_item">{{ruleForm.licenseNo}}</span>
              </el-form-item>
              <el-form-item label="便利店名称：" prop="name">
                <span class="Store_item">{{ruleForm.name}}</span>
              </el-form-item>
              <el-form-item label="所属区域：" prop="name">
                <span class="Store_item">{{ruleForm.area}}</span>
              </el-form-item>
              <el-form-item label="店铺地址：" prop="name">
                <span class="Store_item">{{ruleForm.address}}</span>
              </el-form-item>
              <el-form-item label="店铺面积：" prop="name" class="areaSize">
                <div v-if="this.areaSizes==false">
                  <span class="Store_item" >{{ruleForm.areaSize}}</span><i class="el-icon-edit" @click="areaSizeChange"></i>
                </div>
                <el-input v-else v-model="ruleForm.areaSize" size="small" class="areaSizes"  placeholder="㎡"></el-input>
              </el-form-item>
              <el-form-item label="银行卡：" prop="name">
                <span class="Store_item">{{ruleForm.bankCard}}</span>
              </el-form-item>
              <el-form-item label="微信支付账号：" prop="name">
                <span class="Store_item">{{ruleForm.wechatAccount}}</span>
              </el-form-item>
              <el-form-item label="支付宝账号：" prop="name">
                <span class="Store_item">{{ruleForm.alipayAccount}}</span>
              </el-form-item>
            </div>
            <div class="Store_bottom Store_paddLeft">
              <div class="Store_upload">
                <el-form-item label="便利店图标：">
                  <el-upload class="avatar-uploader"
                             :action="uploadUrl"
                             name="files"
                             :show-file-list="false"
                             :on-success="imgHandler"
                             :before-upload="beforeUpload">
                    <img v-if="ruleForm.icon" :src="imageUrl" class="avatar">
                    <i class="el-icon-upload2 avatar-uploader-icon"/>

                  </el-upload>
                  <el-button type="primary" @click="deleteImg" class="delete" icon="delete" size="small"></el-button>
                </el-form-item>
              </div>
              <el-form-item label="外卖营业时间：">
                <el-time-select
                  :editable="false"
                  placeholder="起始时间"
                  v-model="startTime"
                  :picker-options="{
                    start: '00:00',
                    step: '00:30',
                    end: '24:00'
                  }"
                >
                </el-time-select>
                <el-time-select
                  :editable="false"
                  placeholder="结束时间"
                  v-model="endTime"
                  :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00'
                }">
                </el-time-select>
              </el-form-item>
              <el-form-item label="商品起送金额：">
                <el-input v-model.trim="ruleForm.upAmount" class="form-inline Store_width" size="small"></el-input>
                <span class="Store_txt">元，另需配送费</span>
                <el-input v-model="ruleForm.feeAmount" class="form-inline Store_width" size="small"></el-input>
                <span class="Store_txt">元</span>
              </el-form-item>
              <el-form-item label="外卖配送半径：">
                <el-input v-model="ruleForm.distance" class="form-inline Store_width" size="small"></el-input>
                <span class="Store_txt">KM</span>
              </el-form-item>
              <div class="Store_button Store_cent">
                <el-form-item>
                  <el-button @click="resetForm('ruleForm')" icon="close" size="small">取&nbsp;&nbsp;消</el-button>
                  <el-button type="primary" icon="check" @click="submitForm('ruleForm')" size="small">保&nbsp;&nbsp;存
                  </el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="Stor_money">
          <span>{{ruleForm.walletBalance}}</span>我的钱包
        </div>
        <div class="Stor_codeBox">
          <div class="codeImg">
            <img :src="codeImg" v-if="codeImg!=''" alt="二维码">
          </div>
          <div class="codeTxt">
              <span class="codeDownload">门店小程序二维码
                <a :href="codeImg"><el-button type="primary" size="small" icon="caret-right">下载</el-button></a>
              </span>
            <span>提示：</span>
            <span>扫一扫</span>
            <span>可自助买单,告别排队!</span>
            <!--<span>还可以叫外卖哦!</span>-->
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
        uploadUrl: bus.host + '/pos/api/upload',
        url: bus.host,
        codeImg: '',
        ruleForm: {},
        imageUrl: '',
        business_hours: [],
        startTime: '',
        endTime: '',
        areaSizes:false,
      }
    },
    methods: {
      storeDate(){
        let url = this.url + '/pos/api/store/detail';
        this.$http.get(url).then((res) => {
          let date = res.data.msg;
          if (res.data.success == false) {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
            return false;
          }
          this.ruleForm = date;
          if (date.walletBalance == null) {
            this.ruleForm.walletBalance = 0.00
          }
          this.codeImg = bus.host+'/pos/openapi/wechat/store/qrcode/'+this.ruleForm.id;
          this.imageUrl = date.icon;
          this.business_hours[0] = this.ruleForm.openTime;
          this.business_hours[1] = this.ruleForm.closeTime;
          this.startTime = this.business_hours[0]
          this.endTime = this.business_hours[1]
        }).catch((res) => {
        })
      },

      areaSizeChange(){
        this.areaSizes=true
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url = this.url + '/pos/api/store/update/print/setup';
            if($.trim(this.ruleForm.areaSize) == null ||  $.trim(this.ruleForm.areaSize) == '' ){
              this.$message({message: '请填写店铺面积！', type: 'warning'});
              return false;
            }
            if(!/^\d+(\.\d+)?$/.test(this.ruleForm.areaSize)) {
              this.$message({message: '店铺面积请填写数字！', type: 'warning'});
              throw false;
            }
            if($.trim(this.startTime) == null ||  $.trim(this.startTime) == '' ){
              this.$message({message: '请填写营业开门时间！', type: 'warning'});
              return false;
            }
            if($.trim( this.endTime) == null ||  $.trim( this.endTime) == '' ){
              this.$message({message: '请填写营业结束时间！', type: 'warning'});
              return false;
            }
            this.ruleForm.openTime = this.startTime.toString();
            this.ruleForm.closeTime = this.endTime.toString();
            if($.trim(this.ruleForm.distance) == null || $.trim( this.ruleForm.distance) == '' ){
              this.$message({message: '请填写配送距离！', type: 'warning'});
              return false;
            }
            if($.trim(this.ruleForm.feeAmount) == null ||  $.trim(this.ruleForm.feeAmount)=='' ){
              this.$message({message: '请填写配送费用！', type: 'warning'});
              return false;
            }
            if($.trim(this.ruleForm.upAmount) == null ||  $.trim(this.ruleForm.upAmount) == '' ){
              this.$message({message: '请填写起配送额！', type: 'warning'});
              return false;
            }

            if(!/^\d+(\.\d+)?$/.test(this.ruleForm.upAmount)) {
              this.$message({message: '起配送额不合法！', type: 'warning'});
              throw false;
            }
            if(!/^\d+(\.\d+)?$/.test(this.ruleForm.feeAmount)) {
              this.$message({message: '配送费用不合法！', type: 'warning'});
              throw false;
            }
            if(!/^\d+(\.\d+)?$/.test(this.ruleForm.distance)) {
              this.$message({message: '配送距离不合法！', type: 'warning'});
              throw false;
            }
            this.$http.put(url, this.ruleForm).then((res) => {
              if (res.data.success == false && res.status == 200) {
                this.$alert('您没有此操作权限', '对不起', {
                  confirmButtonText: '确定',
                });
              }
              this.areaSizes=false;
              this.$message.success(res.data.msg);
              this.storeDate();
            });
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.storeDate();
      },
      /*图片上传*/
      imgHandler(res, file){
        this.ruleForm.icon = "http://www.izjjf.cn/" + res.msg[0];
        this.imageUrl = "http://www.izjjf.cn/" + res.msg[0];
//        this.imageUrl = URL.createObjectURL(file.raw);
        this.loading=false;
      },
      deleteImg(){
        this.ruleForm.icon = null;
      },
      beforeUpload(file) {
        const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isImg) {
          this.$message.error('上传图片只能是jpg/png/gif格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        this.loading = true;
        return isImg && isLt2M;
      },

    },
    mounted() {
      this.storeDate();
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss">
  .Store_width input {
    width: 100px;
  }

  .Store_top {
    .el-form-item {
      margin-bottom: 0
    }
    label {
      width: 120px;
      font-size: 15px;
      padding-right: 0px;
    }
    span {
      color: #999;
      font-size: 15px;
    }
    .Store_item{
      padding-top: 2px;
      box-sizing: border-box;
      display: inline-block;
    }
  }

  .Store_bottom {
    .el-form-item {
      margin-bottom: 5px;
    }
    label {
      width: 120px;
      font-size: 15px;
      padding-right: 0px;
    }
  }

  .Store_upload {
    img {
      width: 100%;
      height: 100%;
    }
    .avatar-uploader{
      display: inline-block;
      float: left;
    }
    .delete{
      float: left;
      i{
        width: 12px;
        height:0px;
        line-height: 0px;
      }
    }
    .el-upload--text, i {
      width: 200px;
      height: 120px;
    }
    i {
      line-height: 120px;
    }
  }
  .areaSize{
    .Store_item{cursor: pointer;}
    .el-icon-edit{
      cursor: pointer;
      &:before{
        float: right;
        padding-left: 8px;
        font-size: 12px;
        padding-top: 2px;
        color: #999;
      }
    }
    .areaSizes{width:70px;}
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  * {
    font-weight: normal;
    font-style: normal;
  }

  .form-inline, .form-inline .form-control {
    display: inline-block;
    width: auto;
    vertical-align: middle;
  }

  .Store_cent {
    text-align: center;
  }

  .Store_setting {
    box-sizing: border-box;

    .Store_paddLeft {
      padding-left: 2%;
    }
  }

  .Store_txt {
    padding: 0 5px;
  }

  .Stor_money {
    width: 180px;
    height: 80px;
    border: 1px solid #e0e0e0;
    border-radius: 5px;
    box-sizing: border-box;
    padding-top: 12px;
    text-align: center;
    font-size: 14px;
    margin-top: 30px;
    span {
      font-size: 24px;
      display: block;
    }
  }

  .Store_bottom {
    margin-top: 30px;
  }

  .Stor_codeBox {
    width: 380px;
    height: 180px;
    margin-top: 20px;
    border: 1px dashed #ccc;
    border-radius: 5px;
    box-sizing: border-box;
    .codeImg {
      width: 180px;
      height: 180px;
      line-height: 150px;
      padding: 10px;
      text-align: center;
      box-sizing: border-box;
      float: left;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .codeTxt {
      width: 200px;
      height: 180px;
      float: left;
      padding-top: 50px;
      margin-left: -2px;
      text-align: center;
      box-sizing: border-box;
      span {
        display: block;
        color: #999;
        font-size: 14px;
        padding-right: 25px;
      }
      .codeDownload {
        font-size: 15px;
        padding-bottom: 10px;
        button {
          position: relative;
        }


      }
    }
  }

  .Store_button {
    margin-top: 5%;
  }

  /*@media screen and (max-width:1366px) {*/
  /*.Store_setting  .Store_paddLeft{*/
  /*padding-left: 18% ;*/
  /*}*/
  /*}*/
</style>
