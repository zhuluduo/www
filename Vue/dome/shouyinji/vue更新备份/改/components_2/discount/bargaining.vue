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
        <el-col  :sm="24" :md="24" :lg="24">
          <el-dialog title="商品添加" :visible.sync="dialogFormVisible" ref='dialog' @close="show()" >
            <el-col :span="5" style="border:1px solid rgb(244, 240, 237);padding:3px;">
              <el-row  class="scrollbar scrollbar_tag">
                <el-row align="center" style="background-color: rgb(106, 92, 72);color:white;"><el-col align="center">已选商品(共{{storage.length}}个)</el-col></el-row>
                <el-table
                  :data="storage"
                  :show-header="false"
                  style="width: 100%">
                  <el-table-column label="" show-overflow-tooltip>
                    <template scope="scope" >
                      <el-tag type="primary" >{{scope.row.name}}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label=""  width="23">
                    <template scope="scope" >
                      <el-button :plain="true" type="danger" @click="storage.splice(scope.$index, 1)" size="small" icon="delete"></el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-row>
            </el-col>
            <el-col :span="19">
              <el-row :gutter="2">
                <el-col :span="6">
                  <el-select v-model="selectedDepartment" clearable placeholder="一级分类" id="id_ment">
                    <el-option class="idment" v-for="item in Primarydata" :key="item.name" :label="item.name"
                               :value="item.id"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <el-select v-model="selectedDepart"  placeholder="二级分类" class="selectedDepart">
                    <el-option class="idmento" v-for="item in subCategories" :key="item.name" :label="item.name"
                               :value="item.id"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="9">
                  <el-input @keyup.enter.native="handleFilter" placeholder="扫描或输入商品条码/商品名称" v-model="listQuery.searchWord"/>
                </el-col>
                <el-col :span="3">
                  <el-button type="primary" @click="handleFilter" icon="search">搜索</el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-table :data="tableData_Load" style="width: 100%" v-loading="listLoading" ref="multipleTable" row-key="id"
                          @selection-change="handleSelectionChange"
                          tooltip-effect="dark" class="tableData_Load">
                  <el-table-column type="selection"  :reserve-selection="true" :selectable="selectable" width="55"></el-table-column>
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
              </el-row>
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
        startTime:'',
        endTime:'',
        tableData:[],
        storage:[],
        tableData_Load:[],
        Primarydata:[],
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
      /*分类subCategories 数据联动*/
      subCategories() {
        let list = [];
        let selectedDepart = this.$data.selectedDepartment;
        $(".selectedDepart input[ type='text' ]").val('')
        this.$data.Primarydata.forEach(function (d) {
          if (d.id == selectedDepart) {
            list = d.subCategories;
          }
        });
        return list;
      },
    },
    methods: {
      selectable(row, index){
        if (row.id === 'DEFAULTID') {
          return false;
        }
        return true;
      },
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
        this.Primaryone();
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
      handleSelectionChange(selection){
        this.multipleSelection = selection;
        this.storage=selection;
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
      /*清空分类选择*/
      show(){
        this.$data.selectedDepartment='';
        this.$data.selectedDepart='';
        this.listQuery.searchWord='';
        this.storage=='';
        this.$refs.multipleTable.clearSelection();
      },
      /*dialog选择确定*/
      update(){
        if(this.multipleSelection==undefined){
          this.$message.error('请选择商品');
          return false;
        }else if(this.multipleSelection.length==0){
          this.$message.error('请选择商品');
          return false;
        } else {
          this.storage = this.multipleSelection;
          let tab = [];
          tab = this.tableData;
          this.storage.forEach(function (i) {
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
          this.dialogFormVisible = false;
          this.$data.selectedDepartment='';
          this.$data.selectedDepart='';
          this.listQuery.searchWord='';
          this.storage=='';
          this.$refs.multipleTable.clearSelection();
        }
      },
      Discount_check(val){
        if(val.specialOffer !=null){
          val.specialOffer =val.specialOffer.replace(/[^\d.]/g, '').replace(/\.{2,}/g, ".").replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
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
              }
              if (e.specialOffer<0){
                this.$message({message: "商品特价不能小于0", type: 'error'});
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
