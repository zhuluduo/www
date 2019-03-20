<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>系统设置</el-breadcrumb-item>
          <el-breadcrumb-item>打印设置</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row class="warp main_cont">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="demo-ruleForm">
        <fieldset class="field-title">
          <legend class="printit">小票打印设置</legend>
        </fieldset>
        <el-col :span="24" class=" border-default printInfo Smallticket_info">
          <div  class="Smallticket_Detail">
              <el-form-item label="问候语/宣传语设置:"  prop="receiptTagline" placeholder="30字以内" >
                <el-col :span="6">
                <el-input v-model="ruleForm.receiptTagline"></el-input>
                  </el-col>
              </el-form-item>
            <!--<div class="section_img">-->
            <!--<div class="img_up">-->
            <!--<span>添加二维码：</span>-->
            <!--<el-upload-->
            <!--class="avatar-uploader"-->
            <!--:action="uploadUrl"-->
            <!--name="files"-->
            <!--:show-file-list="false"-->
            <!--:on-success="img1Handler"-->
            <!--:beforeUpload="beforeUpload">-->
            <!--<img v-if="ruleForm.receiptQrcode" :src="imgurl" class="avatar">-->
            <!--<i class="el-icon-plus avatar-uploader-icon"></i>-->
            <!--</el-upload>-->
            <!--</div>-->
            <!--</div>-->
              <el-form-item label="小票打印份数:" prop="printNum">
                <el-radio-group v-model="ruleForm.printNum" class="radio_ck">
                  <el-radio label="1" >1张</el-radio>
                  <el-radio label="2" >2张</el-radio>
                  <el-radio label="3" >3张</el-radio>
                </el-radio-group>
              </el-form-item>
          </div>
        </el-col>

        <el-col :span="24" class=" border-default printInfo Price_info">
          <fieldset class="field-title">
            <legend class="printit">标价签打印设置</legend>
          </fieldset>
          <div  class="Price_Detail ml-defaul">
            <div class="section_deck">
              <el-form-item label="标签纸规格:">
                <el-input v-model="ruleForm.pricetagWidth" class="form-inline"></el-input><i>*</i>
                <el-input v-model="ruleForm.pricetagHeight" class="form-inline"></el-input>
                <span class="deck-txt">(单位：mm)</span>
              </el-form-item>
            </div>
            <div class="section_ck_cont">
              <el-form-item label="标签纸内容:">
                <el-checkbox-group v-model="pricetag" @change="handleChecked" class="cont_ck" name="cont_ck">
                  <el-checkbox  disabled="disabled" v-for="city in cities" :label="city.id" :key="city.id"  :checked='city.checked==0?false:true'>{{city.description}}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" class="btn-input-block">立即设置</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
  </div>
</template>
<script>

    import Vue from 'vue';
    import {bus} from '../../bus.js'

    export default{
        data(){
            return {
                uploadUrl:bus.host+'/pos/api/upload',
                url:bus.host+'/pos/api/store/update/print/setup',
                ruleForm:{
//                    receiptQrcode:'',
                    receiptTagline:'',
                    printNum:'',
                    pricetagWidth:'',
                    pricetagHeight:'',
                    pricetagFields:[{
                        id:'',
                    }],
                },
                data:{},
                cities:[],
                Checkedchage:'',
                rules: {
                    receiptTagline: [
                        { required: true, message: '问候语/宣传语', trigger: 'blur' },
                        {  max: 30, message: '输入字数最多为30字', trigger: 'blur' }
                    ],

                },
                pricetag:[],
                imgurl:'',
            }
        },
        methods: {
            /**
             * 图片上传
             * */
//            img1Handler(res, file) {
//              this.ruleForm.receiptQrcode = res.msg[0];
//              this.imgurl=bus.imgHost+res.msg;
//            },
//          beforeUpload(file) {
//            const isImg = file.type === 'image/jpeg' || file.type === 'image/png'||file.type === 'image/gif';
//            const isLt2M = file.size / 1024 / 1024 < 2;
//            if (!isImg) {
//              this.$message.error('上传图片只能是jpg/png/gif格式!');
//            }
//            if (!isLt2M) {
//              this.$message.error('上传头像图片大小不能超过 2MB!');
//            }
//            return isImg && isLt2M;
//          },

            handleChecked(){

            },

            /**
             * 数据提交
             * */

            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    var id;
                    var id_array=[];
                    var dataArr = [];
                    var ckinx;
                    $.each( $(".cont_ck input[type=checkbox]:checked"),function(i) {
                        ckinx=$(".cont_ck input[type=checkbox]:checked").length
                        var idser = {};
                        idser["id"] = $(this).val();
                        dataArr=eval(id_array);
                        dataArr.push(idser);
                    })
                    if ($(".cont_ck input[type=checkbox]:checked").length == ckinx) {
                        this.ruleForm.pricetagFields=dataArr;
                        let ckbox=$(".cont_ck input[type=checkbox]:checked");
                        for(var i=0;i<ckbox.length;i++){
                            this.ruleForm.pricetagFields[i].id = this.pricetag[i];
                        }
                    }
                    if (valid) {
                        this.$http.put(this.url, this.ruleForm).then((response)=> {
                                if(response.data.success == false&&response.status==200){
                                    this.$alert('您没有此操作权限', '对不起', {
                                        confirmButtonText: '确定',
                                    });
                                }else {
                                    if (response.data.success == true) {
                                        this.$message({
                                            message: '数据修改成功',
                                            type: 'success'
                                        });
                                    }
                                }
                        });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },

            /**
             * 数据查询
             * (rain)显示以获取的readio
             **/
            Queryinfor(){
                let url=bus.host + '/pos/api/store/detail';
                this.$http.get(url).then((response) => {
                    this.ruleForm=response.data.msg;
                    let rain=$('.radio_ck input');
                    for(var i=0;i<rain.length;i++){
                        let raatt=$('.radio_ck  input').eq(i).attr("value");
                        if(raatt==response.data.msg.printNum){
                          $('.radio_ck  .el-radio__input').eq(i).attr("class","el-radio__input is-checked")
                        }
                    }
                    $('.radio_ck  input').on('click',function (index) {
                       $(this).parent().attr("class","el-radio__input is-checked").parent().siblings().find('.el-radio__input').attr("class","el-radio__input")
                    })
                    this.cities=(response.data.msg).pricetagFields;
                  this.imgurl=bus.imgHost+response.data.msg.receiptQrcode;
                }, (response) => {
                    this.$notify.error({
                        title: '数据获取失败',
                        message: '请重新登录'
                    });
                });
            },
        },

        mounted() {
            this.Queryinfor();
        }
    }
</script>
<style>
  .section_ck_cont .el-checkbox__input.is-disabled + .el-checkbox__label{color:#000;}
</style>
<style lang="scss" scoped>
    .section_img{
        .img_up{width: 250px;}
    }
    .printInfo{
        .printit{
            font-size: 20px;
            color: #000;
        }
    }
    .Price_Detail{margin-left: 30px;}
    .Smallticket_Detail{
        margin-left: 30px;
        .section_title{
            span{display: block}
        }
    }
  .field-title{
    margin: 10px 0 0px;
    border: none;
    border-top: 1px solid #e2e2e2;
  }
    .field-title  .printit{
      font-size: 20px;
      color: #000;
    }
  .btn-input-block{margin-left: 120px;}
</style>
