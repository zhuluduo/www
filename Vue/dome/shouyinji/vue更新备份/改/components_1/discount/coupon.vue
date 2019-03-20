<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum nav_top">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>优惠劵</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="warp-breadcrum border-default">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="demo-ruleForm form-inline DetermineForm">
        <div class="Determine">
          <el-form-item label="活动名称" prop="name" class="fl rminename">
            <el-input v-model="ruleForm.name" class="form-control"></el-input>
          </el-form-item>
          <el-form-item label="是否可与其他促销活动同时使用" prop="Dmresource" class="fl Dmresource ml-defaul">
            <el-radio-group v-model="ruleForm.Dmresource">
              <el-radio :label="3">是</el-radio>
              <el-radio :label="6">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="mbCoupon font-z14">
          促销类别：<span>优惠券</span>
        </div>
        <el-form-item label="活动有效期" required>
            <el-date-picker prop="date1"
                    v-model="ruleForm.date1"
                    type="datetimerange"
                    placeholder="选择时间范围">
            </el-date-picker>
        </el-form-item>
        <el-form-item label="优惠券面值" prop="name1" >
          <el-input v-model="ruleForm.name1" placeholder="￥" class="form-control" ></el-input>
        </el-form-item>
        <el-form-item label="发放张数" prop="name2" >
          <el-input v-model="ruleForm.name2" placeholder="请输入数字" class="form-control" type="number"></el-input>
        </el-form-item>
        <el-form-item label="使用条件" prop="resource">
          <el-radio-group v-model="ruleForm.resource">
            <el-radio :label="5" name="startPriceRadio">单笔满</el-radio>
            <input type="number" class="form_input" id="startPrice" value="">
            <span class="formtxt">元使用;</span>
            <el-radio :label="7" name="startPriceRadio">不限制</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="参与商品" prop="type" class="Dmck">
          <el-checkbox-group v-model="ruleForm.type">
            <el-checkbox label="全部1" name="type"></el-checkbox>
            <el-checkbox label="酒水2" name="type"></el-checkbox>
            <el-checkbox label="酒水3" name="type"></el-checkbox>
            <el-checkbox label="酒水4" name="type"></el-checkbox>
            <el-checkbox label="全部5" name="type"></el-checkbox>
            <el-checkbox label="酒水6" name="type"></el-checkbox>
            <el-checkbox label="酒水7" name="type"></el-checkbox>
            <el-checkbox label="酒水8" name="type"></el-checkbox>
            <el-checkbox label="全部9" name="type"></el-checkbox>
            <el-checkbox label="酒水0" name="type"></el-checkbox>
            <el-checkbox label="酒水01" name="type"></el-checkbox>
            <el-checkbox label="酒水02" name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>


    <script>
      import Vue from 'vue';
      import {bus} from '../../bus.js';
    export default {
        data() {
            return {
                ruleForm: {
                    name: '',
                    region: '',
                    date1: '',
                    delivery: false,
                    name1:'',
                    name2:'',
                    type:[],
                    resource: 7,
                    desc: '',
                    Dmresource:3
                },
                rules: {
                    name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                    ],
                    name1: [
                        { required: true, message: '请输入优惠券面值', trigger: 'blur' },
                    ],
                    name2: [
                        { required: true, message: '请输入发放张数', trigger: 'blur' },
                    ],
                    date1: [
                        {  required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    desc: [
                        {max: 50, message: '50字符以内', trigger: 'blur' },
                    ],
                    type: [
                        {type: 'array',  required: true, message: '请至少选择一个参与商品', trigger: 'change' }
                    ],
                }
            };
        },
        methods: {
          /**
           * @param  {object} created  信息查询
           */
//          created(){
//            let url = bus.host+'/pos/api/product/detail/'
//            let id = this.$route.query.id;
//            this.$http.get(url+id).then((response) => {
//              let upcaead=response.data.msg;
//              this.ruleForm = upcaead;
//              this.ruleForm.id = upcaead.id;
//            }, (response) => {
//              this.$notify.error({
//                title: '错误',
//                message: '这是一条错误的提示消息'
//              });
//            });
//          },
          /**
           * @param  {object} submitForm  数据提交
           */
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
//                      let url =  bus.host+'/pos/api/product/update'
//                      this.$http.put(url, this.ruleForm).then((response)=> {
//                        if (response.data.success == true) {
//                          this.$message({
//                            message: '数据修改成功',
//                            type: 'success'
//                          });
//                        }
//                      });
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        }
    }
</script>
<style>
  .form-inline ,.form-inline .form-control {
    display: inline-block;
    width: auto;
    vertical-align: middle;}
  input[type=number] {
    -moz-appearance:textfield;
  }
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .form_input{
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
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 60px;
  }
  .formtxt{display: inline-block;padding: 0 5px;font-size: 14px;}
  .mbCoupon{margin:0 0 22px 26px;color: #48576a; }
  .Determine{overflow: hidden;height: auto;}
  .rminename ,.Dmresource{width: 300px}
  .DetermineForm{width: 720px}
  .DetermineForm .el-form-item__label , .Dmck .el-checkbox-group .el-checkbox{width: 100px;}
  .Dmresource .el-form-item__label{width: 210px;}
  .DetermineForm .el-form-item__error , .Dmck .el-form-item__content{margin-left: 100px}
  .DetermineForm .el-textarea{width: 300px;}
  .Dmck .el-checkbox+.el-checkbox ,.Dmck .el-form-item__error{margin-left: 0}
</style>
