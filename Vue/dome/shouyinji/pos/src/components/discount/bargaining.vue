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
          <el-form-item label="参与商品:" class="Dmck">
            <el-col :span="24" style="padding: 0 10px 10px 0">
              <!--<el-button type="primary" @click="Add_goods">添加商品</el-button>-->
              <v-dialogbox  v-on:trans-list="update"></v-dialogbox>
              <el-button @click="empty_goods">清空所选商品</el-button>
            </el-col>
            <el-col :span="24" class="padd_L" style="width: 650px">
              <el-table :data="tableData" id="tableData_ov" class="tableData">
                <el-table-column type="index" label="序号" width="70"></el-table-column>
                <el-table-column prop="name" label="商品名称"></el-table-column>
                <el-table-column prop="barcode" label="商品条码" width="160"></el-table-column>
                <el-table-column  label="零售价" width="80">
                  <template scope="scope">
                    {{scope.row['products'][0]['sellingPrice']}}
                  </template>
                </el-table-column>
                <el-table-column label="特惠价" >
                  <template scope="scope">
                    <el-input type="number" v-model="scope.row.specialOffer" :value="scope.row.specialOffer" @input="Discount_check(scope.row)"/>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="80">
                  <template scope="scope">
                    <el-button type="danger" @click="showremove(tableData,scope.$index)" size="small">删除</el-button>
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
  import dialogbox from './dialogbox';
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
          remark:'',
          typeCode: '',
          baseList:[],
        },
        Activity_time: '',
        startTime:'',
        endTime:'',
        tableData:[],
        clicktag:0,
        submitForm_loading:false,
        listLoading: false,
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {max: 30, message: '最多输入30个字符', trigger: 'blur'}
          ],
        },
      }
    },
    methods: {
      /*表格数据清空*/
      empty_goods(){
        $('.tableData tbody tr').html("");
        this.tableData = [];
      },
      /*dialog商品删除*/
      showremove(row, index){
        this.tableData.splice(index, 1);
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
            this.ruleForm.remark=res.remark;
            let obj=eval('('+ res.rule+')');
            this.tableData.forEach(function (i, index) {
              i.specialOffer=obj.baseList[index].products[0].specialOffer;
            })
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
          let checked=storage
          let tab = [];
          tab = this.tableData;
        checked.forEach(function (i) {
            let tablist = {
              id: i.id,
              name: i.name,
              barcode: i.barcode,
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
      Discount_check(val){
        if(val.specialOffer !=null){
          val.specialOffer =val.specialOffer.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
        }
      },
      /*数据提交*/
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitForm_loading=true;
            let  bool = true;
            this.ruleForm.baseList=this.tableData;
            if (this.Activity_time[0] == null && this.Activity_time[0] == undefined && this.Activity_time[1] == null && this.Activity_time[1] == undefined) {
              this.$message({message: '请输入活动有效日期', type: 'warning'});
              this.submitForm_loading=false;
              return false;
            } else {
              let startTime = dateFormat(this.Activity_time[0], 'yyyy-MM-dd hh:mm:ss');
              let endTime = dateFormat(this.Activity_time[1], 'yyyy-MM-dd hh:mm:ss');
              this.startTime = startTime;
              this.endTime = endTime;
            }
            if(this.$route.query.couponId){
              this.ruleForm.typeCode;
            }else {
              this.ruleForm.typeCode = this.$route.query.value;
            }
            if(this.tableData==''||this.tableData==null){
              this.$message({message: '参与商品不能为空！', type: 'warning'});
              this.submitForm_loading=false;
              return false;
            }
            this.ruleForm.version = '1';
            let bases = [];
            this.ruleForm.baseList.forEach(e=>{
              if(e.specialOffer==null||e.specialOffer == undefined||e.specialOffer == ''){
                this.$message({message: "商品特价不能为空", type: 'error'});
                bool =false;
                this.submitForm_loading=false;
              }else if (e.specialOffer<=0){
                this.$message({message: "商品特价不能小于0", type: 'error'});
                bool= false;
                this.submitForm_loading=false;
              }else if(!/^\d+(\.\d+)?$/.test(e.specialOffer)){
                this.$message({message: "商品特价不合法", type: 'error'});
                bool= false;
                this.submitForm_loading=false;
              }
              e.products[0].specialOffer = e.specialOffer;
              bases.push(e)
            })
            this.ruleForm.baseList = bases;
            let param = {
              startTime: this.startTime,
              endTime: this.endTime,
              name: this.ruleForm.name,
              rule: 'string',
              status: 0,
              type: 0,
              version: 0,
              typeCode: '7',
              typeName: this.ruleForm.typeName,
              remark:this.ruleForm.remark,
              baseList:this.ruleForm.baseList
            };
            if (this.ruleForm.id != null && this.ruleForm.id != undefined && this.ruleForm.id != '') {
              param.id = this.ruleForm.id;
            }
            if (bool==false){
              this.submitForm_loading=false;
              return false;
            }
            let url = bus.host + '/pos/api/promotion/updataandcreate'
            this.$axios.put(url, param).then((response) => {
              if (response.data.success == false) {
                this.$message({message: response.data.msg, type: 'error'});
                return;
              }
              let self = this;
              if(response.data.success == true){
                if(this.$route.query.couponId){
                  this.$message({message: '活动修改成功', type: 'success',duration:1000});
                }else {
                  this.$message({message: '活动添加成功', type: 'success',duration:1000});
                }
                setTimeout(() => {self.$router.push('promotion');},1000)
              }
            }, (response) => {
              this.$message({message: response.data.msg, type: 'error'});
              this.submitForm_loading=false;
            });
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
    }
  }
</script>
