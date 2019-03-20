<template>
  <el-row class="warp" :loading="loading">
    <el-col :span="24" class="warp-breadcrum nav_top">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/product/list' }">在售商品</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/product/all' }">商品上架</el-breadcrumb-item>
        <el-breadcrumb-item>新增商品</el-breadcrumb-item>
      </el-breadcrumb>
    </el-col>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-row>
        <el-col style="padding-top:10px;" :span="24" align="left">
          <el-form-item label="商品图片:" prop="picUrl">
            <el-upload
              class="avatar-uploader"
              :action="url"
              name="files"
              :show-file-list="false"
              :on-success="img1Handler"
              :beforeUpload="beforeUpload">
              <img v-if="ruleForm.picUrl" :src="imgurl" class="avatar"/>
              <i class="el-icon-upload2 avatar-uploader-icon"/>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" >
          <el-form-item label="商品类型:" prop="type" placeholder="请选择商品类型">
            <el-select v-model="ruleForm.type" size="small">
              <el-option label="标品" value="1" >标品</el-option>
              <el-option label="非标品" value="0">非标品</el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="一级分类:" prop="selectedDepartment">
            <el-select v-model="ruleForm.selectedDepartment"  clearable placeholder="请选择" size="small">
              <el-option v-for="item in Primarydata" class="group" :key="item.name" :label="item.name" :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="二级分类:" prop="selectedDepart" required>
            <el-select v-model="selectedDepart"  placeholder="请选择" class="selectedDepart" size="small">
              <el-option v-for="item in subCategories" :key="item.name" :label="item.name" :value="item.id" :id="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称:" prop="name">
            <el-input v-model="ruleForm.name" size="small" class="jfun-form-input"/>
          </el-form-item>
          <el-form-item label="商品条码:" prop="barcode">
            <el-input v-model="ruleForm.barcode" @keyup.enter.native="getGS1Product" id="barcodes" placeholder="输入条码并回车可自动填充信息" size="small" class="jfun-form-input"/>
          </el-form-item>
          <el-form-item label="商品品牌:" prop="brand">
            <el-input v-model="ruleForm.brand" size="small" class="jfun-form-input"/>
          </el-form-item>
          <el-form-item label="商品单位:" prop="pkg">
            <el-input v-model="ruleForm.pkg" size="small" class="jfun-form-input"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商品规格:" prop="spec">
            <el-input v-model="ruleForm.spec" size="small" class="jfun-form-input"/>
          </el-form-item>
          <el-form-item label="保质天数:" prop="expirationDays">
            <el-input v-model="ruleForm.expirationDays" size="small" class="jfun-form-input"/>
          </el-form-item>
          <el-form-item label="采购价格:" prop="purchasePrice" required>
            <el-input v-model="ruleForm['products'][0]['purchasePrice']" @input="onpurchasePrice(ruleForm)" id="inputNumber"  size="small" class="jfun-form-input"/>
          </el-form-item>
          <el-form-item label="零售价格:" prop="sellingPrice" required>
            <el-input v-model="ruleForm['products'][0]['sellingPrice']"  @input="onsellingPrice(ruleForm)"  size="small" class="jfun-form-input"/>
          </el-form-item>
          <el-form-item label="商品毛利:"  >
            <el-input v-model="GrossProfit" disabled="disabled" size="small" class="jfun-form-input"/>
          </el-form-item>
          <el-form-item label="库存数量:" prop="inventory" required>
            <el-input v-model="ruleForm['products'][0]['inventory']"size="small" class="jfun-form-input"/>
          </el-form-item>
          <el-form-item label="安全天数:" prop="safetyInventoryDays" required>
            <el-input v-model="ruleForm['products'][0]['safetyInventoryDays']"  size="small" class="jfun-form-input"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col align="center">
          <el-button @click="$router.push('all')" icon="close" size="small">取消</el-button>
          <el-button type="primary" @click="submitForm('ruleForm')" icon="check" size="small">新增并上架</el-button>
        </el-col>
      </el-row>
    </el-form>
  </el-row>
</template>
<script>
    import Vue from 'vue';
    import lodash from 'lodash';
    import {bus} from '../../bus.js';

    export default{
      data(){
            return {
              loading:false,
                url:bus.host+'/pos/api/upload',
                selectedDepart:'',
                //selectedDepartment:'',
                Primarydata:[],
                GrossProfit:'',
                ruleForm: {
                  selectedDepartment:'',
                    barcode:'',
                    name:'',
                    brand:'',
                    pkg:'',
                    type:'',
                    spec:'',
                    picUrl:'',
                    expirationDays:'',
                    retail:'',
                    securityData:'',
                    products:[{
                        status:'1',
                        purchasePrice:'',
                        sellingPrice:'',
                        safetyInventoryDays:'',
                        inventory:'',
                    }],
                    secondCategory:{
                        id:'',
                    }
                },
                rules: {
                  type: [
                    { required: true, message: '请选择商品类型', trigger: 'change' }
                  ],
                  selectedDepartment: [
                    { required: true, message: '请选择一级分类', trigger: 'change' }
                  ],
                  /*selectedDepart: [
                    { required: true, message: '请选择二级分类', trigger: 'change' }
                  ],*/
                    name: [
                        { required: true, message: '请填写商品名称',trigger: 'blur'  }
                    ],
                  barcode: [
                        { required: true, message: '请填写商品条码', trigger: 'blur' }
                    ],
                  brand:[
                    {required: true, message: '请填写商品品牌', trigger: 'blur' }
                  ],
                  expirationDays:[
                    {required: true, message: '请填写商品保质期', trigger: 'blur' },
                    {  pattern:/^[0-9]\d*$/ ,message: '保质天数不能小于0或为小数'},
                  ],
                    pkg: [
                        { required: true, message: '请填写商品单位',trigger: 'blur'  }
                    ],
                    spec: [
                        { required: true, message: '请填写商品规格',trigger: 'blur'  }
                    ],
                },
              imgurl:'',
            }
        },
        computed: {
            /**
             * 分类数据联动
             * */
            subCategories() {
                let list = [], selectedDepart = this.$data.ruleForm.selectedDepartment;
              $(".selectedDepart input[ type='text' ]").val('')
                this.$data.Primarydata.forEach(function(d) {
                    if(d.id == selectedDepart) {
                      list = d.subCategories;
                    }
                });
                return list;
            },
        },

        methods: {
          /*限制获取商品信息的频率*/
          getGS1Product: _.debounce(
            function () {
              this.loading=true;
              let url =bus.host+'/pos/api/product/gs1/';
              this.$http.get(url+this.ruleForm.barcode,{}).then((response) => {
                if(!response.data.success){
                  this.ruleForm.name='';
                  this.ruleForm.brand='';
                  this.ruleForm.spec='';
                  this.loading=false;
                  return;
                }
                this.ruleForm.name=response.data.msg.name;
                this.ruleForm.brand=response.data.msg.brand;
                this.ruleForm.spec=response.data.msg.spec;
                this.loading=false;
              }).catch((err)=>{
                this.loading=false;
              });;
            },
            500
          ),

            /**
             * 数据上传
             * */
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                  if (valid) {
                    let rows=this.ruleForm;
                    this.ruleForm.secondCategory.id = this.$data.selectedDepart;
                    if (this.$data.selectedDepart == '') {
                      this.$message.error('请选择二级分类');
                      return false;
                    } else if (this.validate(rows)){
                      this.ruleForm['products'][0]['purchasePrice']=this.ruleForm['products'][0]['purchasePrice'].replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
                      this.ruleForm['products'][0]['sellingPrice']=this.ruleForm['products'][0]['sellingPrice'].replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
                      this.ruleForm.name=$.trim(this.ruleForm.name);
                      this.ruleForm.barcode=$.trim(this.ruleForm.barcode);
                      let url = bus.host + '/pos/api/product/create'
                      this.$http.post(url, this.ruleForm).then((response) => {
                      if (!response.data.success) {
                        this.$message({
                          message: response.data.msg,
                          type: 'warning'
                        });
                        return;
                      }
                      this.$confirm('新增商品成功，并已上架！', {
                        confirmButtonText: '继续添加',
                        cancelButtonText: '返回上一级',
                        type: 'warning'
                      }).then(() => {
                        this.removform();
                        this.$refs[formName].resetFields();
                      }).catch(() => {
                        this.$router.push('/product/list');
                      });
                    }).catch((err) => {
                      this.$message.error(err.data.msg);
                    });
                  }
                }
                });
            },

            cancel() {
                this.removform();
                this.$refs[formName].resetFields();
            },

          removform(){
            $("input").val('');
            $("img").attr('src','');
          },
            /**
             * 图片上传
             * */
          img1Handler(res, file) {
            this.ruleForm.picUrl = res.msg[0];
              this.imgurl=bus.imgHost+res.msg;
          },
          beforeUpload(file) {
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
            /**
             * 一级分类
             */
            Primarycrea() {
                let url = bus.host+'/pos/api/category/list/0'
                this.$http.get(url,{}).then((response) => {
                    if(response.data.success == false&&response.status==200){
//                        this.$router.push('/erro/401');
                      this.$message({
                        message: response.data.msg,
                        type: 'warning'
                      });
                      return false;
                    }else {
                        this.Primarydata = response.data.msg;
                    }
                }, (response) => {
                    this.$notify.error({
                        title: '错误',
                        message: '这是一条错误的提示消息'
                    });
                });
            },
          /**
           *  采购价-零售价-库存-安全库存天数(检验)
           */
          onpurchasePrice(val){
            val['products'][0]['purchasePrice']=val['products'][0]['purchasePrice'].replace(/[^\d.]/g,'').replace(/\.{2,}/g,".").replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
            this.GrossProfit = val['products'][0]['sellingPrice'] - val['products'][0]['purchasePrice']
          },
          onsellingPrice(val){
            val['products'][0]['sellingPrice']=val['products'][0]['sellingPrice'].replace(/[^\d.]/g,'').replace(/\.{2,}/g,".").replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
            this.GrossProfit = val['products'][0]['sellingPrice'] - val['products'][0]['purchasePrice']
          },
//          oninventory(val){
//            val['products'][0]['inventory']=val['products'][0]['inventory'].replace(/[^\d]/g,'');
//          },
//          onsafetyInventoryDays(val){
//            val['products'][0]['safetyInventoryDays']=val['products'][0]['safetyInventoryDays'].replace(/[^\d]/g,'');
//          },
//
//          checkNumber(){
//            var inputNumber =$('#inputNumber input').val();
//            if(!/^[-]?[0-9]*\.?[0-9]+(eE?[0-9]+)?$/.test(inputNumber)){
//              alert('Please input a valid number!');
//              return false;
//            }
//          },
          onpurchasePrice(val){
            this.GrossProfit = (val['products'][0]['sellingPrice'] - val['products'][0]['purchasePrice']).toFixed(2)
          },
          onsellingPrice(val){
            this.GrossProfit = (val['products'][0]['sellingPrice'] - val['products'][0]['purchasePrice']).toFixed(2)
          },
          validate(rows) {
            try{
                if(rows['products'][0]['purchasePrice']==null||rows['products'][0]['purchasePrice']==''||rows['products'][0]['purchasePrice']==0) {
                  this.$message({message: '采购价不能为空或小于0！', type: 'warning'});
                  throw e;
                }
                if(!/^\d+(\.\d+)?$/.test(rows['products'][0]['purchasePrice'])){
                  this.$message({message: '采购价不合法！', type: 'warning'});
                  throw e;
                }
                if(rows['products'][0]['sellingPrice']==null||rows['products'][0]['sellingPrice']==''||rows['products'][0]['sellingPrice']==0) {
                  this.$message({message: '零售价不能为空或小于0！', type: 'warning'});
                  throw e;
                }
                if(!/^\d+(\.\d+)?$/.test(rows['products'][0]['sellingPrice'])){
                  this.$message({message: '零售价不合法！', type: 'warning'});
                  throw e;
                }
                if(rows['products'][0]['inventory']==null||rows['products'][0]['inventory']==''||rows['products'][0]['inventory']<0) {
                  this.$message({message: '库存数量不能为空或小于0！', type: 'warning'});
                  throw e;
                }
                if(!/^\d+$/.test(rows['products'][0]['inventory'])) {
                  this.$message({message: '库存数量不合法！', type: 'warning'});
                  throw e;
                }
                if(rows['products'][0]['safetyInventoryDays']==null||rows['products'][0]['safetyInventoryDays']==''||rows['products'][0]['safetyInventoryDays']==0) {
                  this.$message({message: '安全天数不能为空或小于0！', type: 'warning'});
                  throw e;
                }
                if(!/^\d+$/.test(rows['products'][0]['safetyInventoryDays'])) {
                  this.$message({message: '安全天数不合法！', type: 'warning'});
                  throw e;
                }
              return true;
            }catch(e){
              return false;
            }
          },
          barcodes(){
            setTimeout(() => {
              let url =bus.host+'/pos/api/product/gs1/'
              this.$http.get(url+this.ruleForm.barcode,{}).then((response) => {
                if(response.data.msg.brand == '' && response.data.msg.spec == ''){
                  this.$message({
                    message:'条码不存在或有误，请核对！',
                    type: 'warning'
                  });
                  this.ruleForm.name='';
                  this.ruleForm.brand='';
                  this.ruleForm.spec='';
                  return false;
                }else {
                  this.ruleForm.name=response.data.msg.name;
                  this.ruleForm.brand=response.data.msg.brand;
                  this.ruleForm.spec=response.data.msg.spec;
                }
              });
            }, 1000);
          },
        },

        mounted() {
            this.Primarycrea();
        }
    }
</script>
<style>
  .jfun-form-input{width:242px;}
  .demo-ruleForm .el-form-item {
    margin-bottom: 12px;
  }
</style>
