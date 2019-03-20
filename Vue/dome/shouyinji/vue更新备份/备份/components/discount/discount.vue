<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum nav_top">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="demo-ruleForm DetermineForm">
        <el-col  :sm="24" :md="24" :lg="14">
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
          <el-button type="primary" @click="Add_goods">添加商品</el-button>
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
          <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-col>
        <el-col  :sm="24" :md="24" :lg="24">
          <el-dialog title="商品添加" :visible.sync="dialogFormVisible" ref='dialog' >
            <el-col :span="24">
              <el-row :gutter="10">
                <el-col :span="3">
                  <el-select v-model="selectedDepartment" clearable placeholder="一级分类" id="id_ment">
                    <el-option class="idment" v-for="item in Primarydata" :key="item.name" :label="item.name"
                               :value="item.id"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <el-select v-model="selectedDepart" clearable placeholder="二级分类">
                    <el-option class="idmento" v-for="item in subCategories" :key="item.name" :label="item.name"
                               :value="item.id"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-input @keyup.enter.native="handleFilter" placeholder="扫描或输入商品条码/商品名称" v-model="listQuery.searchWord"/>
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" @click="handleFilter" icon="search">搜索</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="24">
              <el-table :data="tableData_Load" style="width: 100%" v-loading="listLoading" ref="multipleTable" row-key="id"
                        @selection-change="handleSelectionChange"
                        tooltip-effect="dark" class="tableData_Load">
                <el-table-column type="selection"  :reserve-selection="true" width="55"></el-table-column>
                <el-table-column prop="name" label="商品名称"></el-table-column>
                <el-table-column prop="barcode" label="商品条码"></el-table-column>
                <el-table-column prop="spec" label="规格"></el-table-column>
                <el-table-column prop="pkg" label="单位"></el-table-column>
                <el-table-column prop="secondCategory.name" label="分类"></el-table-column>
              </el-table>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage3"
                :page-size=listQuery.pageSize
                layout="total,prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </el-col>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false" class="fr">取 消</el-button>
              <el-button type="primary" @click="update"  class="fr mg_r" >确 定</el-button>
            </div>
          </el-dialog>
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
  export default {
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
        listQuery: {
          searchWord: '',
          productStatus: 1,
          firstCategoryId: '',
          secondCategoryId: '',
          page: 1,
          pageSize: 15,
        },
        total: 1,
        currentPage3: 1,
        Activity_time: '',
        tableData:[],
        tableData_Load:[],
        Primarydata:[],
        allUsers:[],
        selectedDepart: '',
        selectedDepartment: '',
        clicktag:0,
        submitForm_loading:false,
        listLoading: false,
        dialogFormVisible: false,
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {max: 30, message: '最多输入30个字符', trigger: 'blur'}
          ],
        },
      }
    },
    computed: {
      /**
       * @param  {object} subCategories 数据联动
       */
      subCategories() {
        let list = [];
        let selectedDepart = this.$data.selectedDepartment;
        this.$data.Primarydata.forEach(function (d) {
          if (d.id == selectedDepart) {
            list = d.subCategories;
          }
        });
        return list;
      },
    },
    methods: {
      Primaryone() {
        let url = bus.host + '/pos/api/category/list/0'
        this.$http.get(url, {}).then((response) => {
          if (response.data.success == false) {
          } else {
            this.Primarydata = response.data.msg;
          }
        }, (response) => {
          this.$notify.error({
            title: '错误',
            message: '这是一条错误的提示消息'
          });
        });
      },

      /*表格数据添加*/
      Add_goods(){
        this.dialogFormVisible = true;
        this.getTable();
      },
      /*表格数据清空*/
      empty_goods(){
        $('.tableData tbody tr').html("");
        this.tableData = [];
      },
      /*分页*/
      handleSizeChange(val) {
        this.listQuery.pagesize = val;
        this.getTable();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.getTable();
      },
      /*dialog商品选中*/
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      /*dialog商品删除*/
      showremove(row, index){
        this.tableData.splice(index, 1)
      },
      /*dialog数据收索*/
      handleFilter(){
        this.getTable();
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
      /*dialog数据查询*/
      getTable() {
        let pg = "?page=" + (this.listQuery.page - 1) + "&size=" + this.listQuery.pageSize;
        this.listLoading = true;
        this.listQuery.firstCategoryId = this.$data.selectedDepartment;
        this.listQuery.secondCategoryId = this.$data.selectedDepart;
        this.$http.post(this.url + pg, this.listQuery, {}).then((response) => {
          if (response.data.success == false) {
            this.$notify.error({
              title: '错误',
              message: '您没用权限哦！'
            });
          }
          this.total = response.data.msg.totalElements;
          this.tableData_Load = response.data.msg.content;
          this.listLoading = false;
        }, (response) => {
          this.$notify.error({
            title: '错误',
            message: '这是一条错误的提示消息'
          });
        });
      },
      /*dialog选择确定*/
      update(){
        let select_ckeck = this.multipleSelection;
          let tab = [];
          tab = this.tableData;
          select_ckeck.forEach(function (i) {
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
          this.dialogFormVisible = false;
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
           this.ruleForm.baseList=this.tableData;
            if (this.Activity_time[0] == null && this.Activity_time[0] == undefined && this.Activity_time[1] == null && this.Activity_time[1] == undefined) {
              this.$message({message: '请输入活动有效日期', type: 'warning'});
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
              this.$message({
                message: '折扣不能为空',
                type: 'warning'
              });
              return false;
            }
            this.ruleForm.version = '1';
            this.ruleForm.rule = "{\"discount\":" + this.ruleForm.discount + "}";
            let url = bus.host + '/pos/api/promotion/updataandcreate';
            if (this.clicktag == 0) {
              this.clicktag = 1;
              setTimeout(function () { this.clicktag = 0 }, 5000);
            this.$axios.put(url ,this.ruleForm).then((res) => {
              if(res.data.success == true){
                this.$message({
                  message: '恭喜你，这是一条成功消息',
                  type: 'success'
                });
                this.$router.push('promotion');
              }
            },(res)=>{
              this.$message.error('错了哦，这是一条错误消息');
              })}
          } else {
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
      this.Primaryone();
    },

  }
</script>
