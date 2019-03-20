<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum nav_top">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="demo-ruleForm DetermineForm">
        <el-col  :sm="24" :md="24" :lg="24">
          <el-form-item label="活动名称:" prop="name">
          <el-input v-model="ruleForm.name" class="form-inline"></el-input>
          </el-form-item>
          <el-form-item label="促销类别:" >
          {{ruleForm.typeName}}
          </el-form-item>
          <el-form-item label="活动有效期:" required>
          <el-date-picker
          v-model="Activity_time"
          type="datetimerange"
          placeholder="开始日期">
          </el-date-picker>
          </el-form-item>
          <el-form-item label="折扣设置:" prop="discount" >
          <el-input v-model="ruleForm.discount" class="form-inline" @input="Discount_input(ruleForm)"></el-input>
          <span class="edtit font-z14 ds-inblok">（如：8折，即输入数字：0.8）</span>
          </el-form-item>
          <el-form-item label="参与商品:" class="Dmck">
          <el-col :span="24" style="padding: 0 10px 10px 0">
            <v-dialogbox  v-on:trans-list="update"></v-dialogbox>
            <el-button @click="empty_goods">清空所选商品</el-button>
          </el-col>
          <el-col :span="24" class="padd_L" style="width: 650px">
          <el-table :data="tableData" id="tableData_ov" class="tableData">
          <el-table-column type="index" label="序号" width="70"></el-table-column>
          <el-table-column prop="name" label="商品名称"></el-table-column>
          <el-table-column prop="barcode" label="商品条码" width="160"></el-table-column>
          <el-table-column prop="spec" label="规格" width="80"></el-table-column>
          <el-table-column label="操作" width="80">
          <template scope="scope">
          <el-button type="danger" @click="showremove(scope.row,scope.$index)" size="small">删除</el-button>
          </template>
          </el-table-column>
          </el-table>
          </el-col>
          </el-form-item>
        </el-col>
        <el-col  :sm="24" :md="24" :lg="24">
          <el-form-item label="备注:" prop="remark">
            <el-input type="textarea"  v-model="ruleForm.remark" ></el-input>
          </el-form-item>
        </el-col>
        <el-col  :sm="24" :md="24" :lg="24">
          <el-form-item class="txt-cent">
          <el-button type="primary" @click="submitForm('ruleForm')" :loading="submitForm_loading">保存</el-button>
          <el-button @click="$router.push('promotion')">取消</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>
  </el-row>
</template>


<style>

</style>

<script>
  import Vue from 'vue';
  import {bus} from '../../bus.js';
  import {dateFormat} from '../../utils/date.js';
  import dialogbox from './dialogbox'
  export default {
    components:{
      'v-dialogbox':dialogbox,
    },
    data() {
      return {
        url: bus.host + '/pos/api/product/list',
        ruleForm: {
          name: '',
          typeName: '',
          discount:'',
          remark:'',
          typeCode: '',
          baseList:[],
        },
        Activity_time: '',
        tableData:[],
        allUsers:[],
        clicktag:0,
        submitForm_loading:false,
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {max: 30, message: '最多输入30个字符', trigger: 'blur'}
          ],
        },
      }
    },
    methods: {
      /*dialog商品删除*/
      showremove(row, index){
        this.tableData.splice(index, 1)
      },
      /*表格数据清空*/
      empty_goods(){
        $('.tableData tbody tr').html("");
        this.tableData = [];
      },
      /*页面加载数据查询*/
      created(){
        if(this.$route.query.couponId){
          let url = bus.host + '/pos/api/promotion/detail?couponId=';
          let id=this.$route.query.couponId;
          if(id==null){
            return false
          }
          this.$http.get(url+id).then((response)=>{
            let res=response.data.msg;
            this.ruleForm.typeCode=res.typeCode
            this.tableData=res.baseList;
            this.ruleForm.name=res.name;
            this.ruleForm.id = res.id;
            this.ruleForm.typeName=res.typeName;
            this.Activity_time=[new Date(res.startTime),new Date(res.endTime)];
            let obj=eval('('+ res.rule+')');
            this.ruleForm.discount=obj.discount;
            this.ruleForm.remark=res.remark;
          }, (response) => {
            this.$notify.error({
              title: '错误',
              message: '这是一条错误的提示消息'
            });
          })
        }else {
          this.ruleForm.typeName = this.$route.query.label;
          this.ruleForm.value = this.$route.query.value;
        }
      },
      /*dialog选择确定*/
      update(storage){
//        this.storage = this.multipleSelection;
        let checked=storage
        let tab = [];
        tab = this.tableData;
        checked.forEach(function (i) {
          let tablist = {
            id: i.id,
            name: i.name,
            barcode: i.barcode,
            spec: i.spec,
          };
          tab.push(i)
        })
        this.tableData = tab;
        let idValueMap = [];
        this.tableData.forEach(function (e) {
          idValueMap[e.id] = e;
        });
        let valArr = new Array();
        for (let k in idValueMap) {
          valArr.push(idValueMap[k]);
        }
        this.tableData = valArr;
        this.$message({
          message: '商品添加成功！！！',
          type: 'success'
        });
      },
      /*input输入校验*/
      Discount_input(val){
        if (val.discount != null) {
          val.discount = val.discount.replace(/[^\d.]/g, '').replace(/\.{2,}/g, ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
          if (val.discount > 1) {
            this.$message({
              message: '折扣不能大于1',
              type: 'warning'
            });
            val.discount = null;
          }
          if (val.discount < 0) {
            this.$message({
              message: '折扣不能小于0',
              type: 'warning'
            });
            val.discount = null;
          }
        }
        if (val.quantity) {
          val.quantity = val.quantity.replace(/[^\d.]/g, '');
        }
      },

      /*数据提交*/
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitForm_loading=true;
           this.ruleForm.baseList=this.tableData;
            if (this.Activity_time[0] == null && this.Activity_time[0] == undefined && this.Activity_time[1] == null && this.Activity_time[1] == undefined) {
              this.$message({message: '请输入活动有效日期', type: 'warning'});
              this.submitForm_loading=false;
              return false;
            } else {
              let startTime = dateFormat(this.Activity_time[0], 'yyyy-MM-dd hh:mm:ss');
              let endTime = dateFormat(this.Activity_time[1], 'yyyy-MM-dd hh:mm:ss');
              this.ruleForm.startTime = startTime;
              this.ruleForm.endTime = endTime;
            }
            if(this.$route.query.couponId){
              this.ruleForm.typeCode;
            }else {
              this.ruleForm.typeCode = this.$route.query.value;
            }
            if(this.ruleForm.discount==''||this.ruleForm.discount==null){
              this.$message({message: '折扣不能为空',type: 'warning'});
              this.submitForm_loading=false;
              return false;
            }
            if(this.tableData==''||this.tableData==null){
              this.$message({message: '参与商品不能为空！', type: 'warning'});
              this.submitForm_loading=false;
              return false;
            }
            this.ruleForm.version = '1';
            this.ruleForm.rule = "{\"discount\":" + this.ruleForm.discount + "}";
            let url = bus.host + '/pos/api/promotion/updataandcreate';
            this.$axios.put(url ,this.ruleForm).then((res) => {
              if(res.data.success == true){
                if(this.$route.query.couponId){
                  this.$message({message: '活动修改成功', type: 'success',duration:1000});
                }else {
                  this.$message({message: '活动添加成功', type: 'success',duration:1000});
                }
                setTimeout(() => {this.$router.push('promotion');},1000)
              }
            },(res)=>{
              this.$message({message: res.data.msg, type: 'error'});
              this.submitForm_loading=false;
              })
          }else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
    mounted()
    {
      this.created();
    },

  }
</script>
