<template>
    <div style="display: inline-block">
      <div v-if="this.childComs==5||this.childVal==5||this.childComs==3||this.childVal==3" style="display: inline-block">
        <el-button v-if="this.childUps==2" type="primary" @click="Add_goods">添加商品</el-button>
        <el-button v-if="this.childUps==1" type="primary" @click="Giveaway_search(1)">...</el-button>
      </div>
      <div v-if="this.childComs==6||this.childVal==6" style="display: inline-block">
        <el-tooltip class="item" effect="dark" content="商品添加" placement="top">
          <el-button type="success" icon="plus" @click="Add_Package(this.childCmd)" size="small"></el-button>
         </el-tooltip>
      </div>
      <div v-if="this.childComs!=5&&this.childVal!=5&&this.childComs!=3&&this.childVal!=3&&this.childComs!=6&&this.childVal!=6" style="display: inline-block">  <el-button type="primary" @click="Add_goods">添加商品</el-button></div>
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
          <el-button type="primary" @click="update(this.childCmd)"  class="fr mg_r" :class="this.Giveaway1==true?'checked_len_true':'checked_len_false'">确 定</el-button>
          <!--<el-button type="primary" v-if="this.childComs==5||this.childVal==5&&this.Giveaway2==true" @click="update"  class="fr mg_r" :class="this.Giveaway2==false?'checked_len_true':'checked_len_false'">确 定2</el-button>-->
          <el-button type="primary" v-if="this.Giveaway1==true" @click="upGiveaway"  class="fr mg_r" :class="this.Giveaway1==false?'checked_len_true':'checked_len_false'">确 定</el-button>
          <!--<el-button type="primary" v-if="this.childComs==6||this.childVal==6" @click="updategroup(this.childCmd)"  class="fr mg_r" >确 定</el-button>-->
        </div>
      </el-dialog>
    </div>
</template>


    <script>
      import Vue from 'vue';
      import {bus} from '../../bus.js';
    export default {
      props: ['childCom','childUp','childVal','childCmd','productGroups'],
        data() {
            return {
              url: bus.host + '/pos/api/product/list',
              storage:[],
              Primarydata:[],
              Primarydata:[],
              tableData_Load:[],
              selectedDepart: '',
              selectedDepartment: '',
              multipleSelection:'',
              listLoading: false,
              dialogFormVisible: false,
              Giveaway1:false,
              Giveaway2:false,
              currentGroupIndex:null, // 当前正在修改分组索引值
              listQuery: {
                searchWord: '',
                productStatus: 1,
                firstCategoryId: '',
                secondCategoryId: '',
                page: 1,
                pageSize: 8,
              },
              total: 1,
              currentPage3: 1,
              childComs: this.childCom,
              childVals:this.childVal,
              childUps:this.childUp,
              childCmds:this.childCmd,
              productGroup:this.productGroups,
            };
        },
      computed: {
        /*subCategories 数据联动*/
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
          /*分页*/
          handleSizeChange(val) {
            this.listQuery.pagesize = val;
            this.getTable();
          },
          handleCurrentChange(val) {
            this.listQuery.page = val;
            this.getTable();
          },
          /*dialog数据收索*/
          handleFilter(){
            this.getTable();
          },
          /*dialog商品选中*/
          handleSelectionChange(selection){
            this.multipleSelection = selection;
            this.storage=selection;
            if (this.Giveaway == 1 ) {
              if (selection.length > 1) {
                this.$message({
                  message: '赠送商品只能为一',
                  type: 'warning'
                });
              }
            }
          },
          selectable(row, index){
            if (row.id === 'DEFAULTID') {
              return false;
            }
            return true;
          },
          /*多级联动*/
          Primaryone(){
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
          /*数据添加*/
          Add_goods(){
            this.dialogFormVisible = true;
            this.getTable();
            this.Primaryone();
          },
          Add_Package(index){
            this.currentGroupIndex = index;
            this.dialogFormVisible = true;
            this.getTable();
            this.Primaryone();
          },
          /*满赠*/
          Giveaway_search(){
            this.dialogFormVisible = true;
            this.Giveaway1=true
            this.getTable();
            this.Primaryone();
          },
          /*弹框*/
          getTable(){
            this.Giveaway = this.Giveaway1;
            let pg = "?page=" + (this.listQuery.page - 1) + "&size=" + this.listQuery.pageSize;
            this.listLoading = true;
            this.listQuery.firstCategoryId = this.$data.selectedDepartment;
            this.listQuery.secondCategoryId = this.$data.selectedDepart;
            this.$http.post(this.url + pg, this.listQuery, {}).then((response) => {
              if (response.data.success == false) {
                this.$notify.error({title: '错误', message: '您没用权限哦！'});
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
          /*取消清空分类选择*/
          show(){
            this.$data.selectedDepartment='';
            this.$data.selectedDepart='';
            this.listQuery.searchWord='';
            this.storage=='';
            this.$refs.multipleTable.clearSelection();
            this.Giveaway1=false;
            this.Giveaway2=false;
          },
          update(){
            if(this.multipleSelection==undefined){
              this.$message.error('请选择商品');
              return false;
            }else if(this.multipleSelection==0){
              this.$message.error('请选择商品');
              return false;
            }else {
              if(this.childComs==6||this.childVal==6){
                this.$emit('trans-list', this.storage, this.childCmds);
              }else {
                this.$emit('trans-list', this.storage );
              }
              this.$message({message: '商品添加成功', type: 'success'});
              this.dialogFormVisible = false;
              this.$data.selectedDepartment='';
              this.$data.selectedDepart='';
              this.listQuery.searchWord='';
              this.storage=='';
              this.currentPage3=1;
              this.$refs.multipleTable.clearSelection();
            }
          },
          upGiveaway(){
            if(this.multipleSelection==undefined){
              this.$message.error('请选择商品');
              return false;
            }else if(this.multipleSelection==0){
              this.$message.error('请选择商品');
              return false;
            }else if (this.multipleSelection.length > 1) {
              this.$message({message: '赠送商品只能为一', type: 'warning'});
              return false;
            } else {
              this.$emit('trans-let',this.storage);
              this.$message({message: '商品添加成功', type: 'success'});
              this.dialogFormVisible = false;
              this.$data.selectedDepartment='';
              this.$data.selectedDepart='';
              this.listQuery.searchWord='';
              this.storage=='';
              this.Giveaway1 = false;
              this.$refs.multipleTable.clearSelection();
            }
          }
        },
    }
</script>
<style>
  .checked_len_true{display: none}
  .checked_len_false{display: block}
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
  /*.DetermineForm{width: 820px}*/
  .DetermineForm .el-form-item__label , .Dmck .el-checkbox-group .el-checkbox{width: 100px;}
  .Dmresource .el-form-item__label{width: 210px;}
  .DetermineForm .el-form-item__error , .Dmck .el-form-item__content{margin-left: 100px}
  .DetermineForm .el-textarea{width: 300px;}
  .Dmck .el-checkbox+.el-checkbox ,.Dmck .el-form-item__error{margin-left: 0}
</style>
