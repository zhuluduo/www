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
          <el-form-item label="满赠方式：">
            <el-col :span="20" class="padd_L">
              <el-col :span="24" style="padding:0 10px 10px 0">
                <span class="formtxt">满：</span>
                  <el-input type="number" v-model="ruleForm.full" class="width_pad"></el-input>
                <span class="formtxt">元</span>
              </el-col>
              <el-col :span="24" class="padd_L">
                  <span class="formtxt">赠送商品：</span>
                    <el-input v-model="ruleForm.basename" disabled="disabled" placeholder="扫描或输入商品条码" style="width: auto"></el-input>
                    <v-dialogbox  v-on:trans-let="upGiveaway" :child-com="this.$route.query.code" :child-val="this.$route.query.value" :child-up="1"></v-dialogbox>
                  <span class="formtxt">数量：</span>
                  <el-input type="number" v-model="ruleForm.quantity" class="width_pad"></el-input>
              </el-col>
            </el-col>
          </el-form-item>
          <el-form-item label="参与商品:" class="Dmck">
            <el-col :span="24" style="padding: 0 10px 10px 0">
              <v-dialogbox  v-on:trans-list="update" :child-com="this.$route.query.code" :child-val="this.$route.query.value" :child-up="2"></v-dialogbox>
              <el-button @click="empty_goods(3)">清空所选商品</el-button>
            </el-col>
            <el-col :span="24" class="padd_L" style="width: 650px">
              <el-table :data="tableData" id="tableData_ov" class="tableData">
                <el-table-column type="index" label="序号" width="70"></el-table-column>
                <el-table-column prop="name" label="商品名称"></el-table-column>
                <el-table-column prop="barcode" label="商品条码" width="160"></el-table-column>
                <el-table-column prop="spec" label="规格" width="80"></el-table-column>
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
        ruleForm:{
          name:'',
          typeName:'',
          remark:'',
          typeCode: '',
          full:'',
          basename:'',
          quantity:'',
          baseList:[],
        },
        Activity_time: '',
        tableData:[],
        tableData_Load:[],
        clicktag:0,
        Giveaway1:false,
        Giveaway2:false,
        listLoading: false,
        dialogFormVisible: false,
        submitForm_loading:false,
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {max: 30, message: '最多输入30个字符', trigger: 'blur'}
          ],
        },

      };
    },
    methods: {
      /*表格数据清空*/
      empty_goods(){
        $('.tableData tbody tr').html("");
        this.tableData = [];
      },
      /*dialog商品删除*/
      showremove(row, index){
        this.tableData.splice(index, 1)
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
            this.ruleForm.full=obj.full;
            this.ruleForm.basename=obj.base.name;
            this.ruleForm.quantity=obj.base.quantity;
            this.GiveawayID=obj.base.id;
            this.GiveawayNo=obj.base.barcode;
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

      upGiveaway(storage){
          let Giveaway = storage;
          this.ruleForm.basename = Giveaway[0].name;
          this.GiveawayID = Giveaway[0].id;
          this.GiveawayNo = Giveaway[0].barcode;
          this.$message({
            message: '商品添加成功！！！',
            type: 'success'
          });
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
            if (this.ruleForm.full == null || this.ruleForm.full == '') {
              this.$message({message: '满多少钱不能为空！', type: 'warning'});
              this.submitForm_loading=false;
              return false;
            }
            if (this.GiveawayID == null || this.GiveawayID == '') {
              this.$message({message: '赠送品不能为空！', type: 'warning'});
              this.submitForm_loading=false;
              return false;
            }
            if (this.ruleForm.quantity == null || this.ruleForm.quantity == '') {
              this.$message({message: '赠送品数量不能为空！', type: 'warning'});
              this.submitForm_loading=false;
              return false;
            }
            if(this.tableData==''||this.tableData==null){
              this.$message({message: '参与商品不能为空！', type: 'warning'});
              this.submitForm_loading=false;
              return false;
            }
            this.ruleForm.version = '1';
            this.ruleForm.rule = "{\"full\":" + this.ruleForm.full + ",\"base\":{\"id\":\"" +this.GiveawayID + "\",\"name\":\"" + this.ruleForm.basename + "\",\"barcode\": \"" + this.GiveawayNo + "\",\"quantity\":" + this.ruleForm.quantity + "}}";
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
              this.submitForm_loading=false;
              this.$message({message: res.data.msg, type: 'error'});
            })
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    mounted(){
      this.created();
    },
  }
</script>
<style>
  .fl_bolk{display:inline-block;float: left}
  .fullslist .ful_m{margin-top: 3px;}
  .fullmode{width: 30px;float: left;margin-top: 5px;}
  .fullgift{margin-left: 40px;}
  #coupon .el-input__inner{height: 30px}
  .fullgoodscode ,.fullgoodscode input{width: 150px}
  .fullgoodsleng ,.fullgoodsleng input{width: 50px}
  .width_pad{width: 100px;padding: 0 10px;}
</style>
<style scoped lang="scss">
</style>
