<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: 'list' }">盘点管理</el-breadcrumb-item>
          <el-breadcrumb-item>盘点明细</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row class="data-table" :gutter="2">
      <el-col :span="24" class="f-tac check-tit">
        <div class="f-ib check-tit-pd img_inv"> 盘点二维码：<img :src=this.$route.query.img></div>
        <div class="f-ib check-tit-pd">盘点批号：<span>{{this.$route.query.coupheckNo}}</span></div>
        <div class="f-ib check-tit-pd">盘点状态：<span v-if="this.$route.query.Status==0">正在进行中</span>
          <span v-if="this.$route.query.Status==1">已 完 成</span>
          <span v-if="this.$route.query.Inventory==0">正在进行中</span>
        </div>
      </el-col>
    </el-row>
    <el-row class="data-table data-table-pd" :gutter="2">
      <el-col :span="3">
        <el-select v-model="selectedDepartment" clearable placeholder="一级分类" id="id_ment" size="small">
          <el-option class="idment" v-for="item in Primarydata" :key="item.name" :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="selectedDepart" clearable placeholder="二级分类" size="small">
          <el-option class="idmento" v-for="item in subCategories" :key="item.name" :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input @keyup.enter.native="handleFilter" placeholder="输入商品条码/商品名称" v-model.trim="listQuery.searchWord"
                  size="small"/>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="handleFilter" :loading="loading" icon="search" size="small"> 查 询 </el-button>
      </el-col>
      <el-col :span="10" align="right">
        <el-button :plain="true" type="warning" @click="$router.push('list')" size="small" icon="arrow-left">返回列表</el-button>
        <el-button v-if="this.$route.query.Status==1 || this.$route.query.Inventory==1"  type="primary" @click="export_check" size="small" icon="caret-right" :loading="loading">导出盘点</el-button>
        <el-button  v-if="this.$route.query.Status==0 || this.$route.query.Inventory==0" type="primary" @click="End_check" size="small" icon="check" :loading="loading" >结束盘点</el-button>

      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="24" v-loading="loading">
        <el-table stripe border :data="list"  v-loading="loading" element-loading-text="数据加载中" @sort-change="sortList"
                  :default-sort="{prop: 'startTime', order: 'descending'}" >
          <el-table-column prop="base.name" label="商品名称" width="300"></el-table-column>
          <el-table-column prop="base.barcode" label="商品条码"></el-table-column>
          <el-table-column prop="base.spec" label="规格"></el-table-column>
          <el-table-column prop="base.pkg" label="单位"></el-table-column>
          <el-table-column prop="base.secondCategory.name" label="分类" ></el-table-column>
          <el-table-column prop="inventory" label="系统库存" sortable="custom"></el-table-column>
          <el-table-column prop="stocktaking" label="盘点库存" sortable="custom"></el-table-column>
          <el-table-column prop="quantity" label="缺失数量" sortable="custom"></el-table-column>
          <el-table-column prop="status" label="状态" sortable="custom">
            <template scope="scope">
              <el-tag v-if="scope.row.status==1" type="success">已 盘 点</el-tag>
              <el-tag v-if="scope.row.status==0" type="warning">未 盘 点</el-tag>
            </template>
          </el-table-column>
          <el-table-column  v-if="this.$route.query.Status==0 || this.$route.query.Inventory==0" label="操作" width="100">
            <template scope="scope">
              <el-button v-if="scope.row.checkInfo.checkStatus==0"  :plain="true" type="warning" @click="Stock_change(scope.row,scope.$index)" size="small" icon="edit">库存修正</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage1"
          :page-size="listQuery.pageSize"
          layout="prev, pager, next, jumper, total"
          :total="total">
        </el-pagination>
        <el-dialog :visible.sync="dialogTableVisible" custom-class="detailed" size="tiny" @close="show()">
          <div v-if="this.Endcheck==1">
            <div class="f-tac Endcheck-siz">请仔细检查商品是否已全部盘点完成</div>
            <div slot="footer" class="dialog-footer f-tac">
              <el-button @click="dialogTableVisible = false" icon="close" size="small">取 消</el-button>
              <el-button type="primary" @click="check_submit" icon="check" size="small" >确 定</el-button>
            </div>
          </div>
          <div v-else>
            <el-row :gutter="20">
              <el-form :model="ruleForm" class="ruleForm_cent">
                <el-form-item prop="barcode" label="商品条码：" class="f-fwb">
                  <span>{{ruleForm.barcode}}</span>
                </el-form-item>
                <el-form-item prop="name" label="商品名称：" class="f-fwb">
                  <span>{{ruleForm.name}}</span>
                </el-form-item>
                <el-form-item scope="scope" prop="inventory" label="系统库存：">
                  <span>{{ruleForm.inventory}}</span>
                </el-form-item>
                <el-form-item scope="scope" label="盘点库存：">
                  <span> <el-input v-model="ruleForm.stocktaking" auto-complete="off" class="form-inline"
                                   size="small"></el-input></span>
                </el-form-item>
              </el-form>
            </el-row>
            <div slot="footer" class="dialog-footer f-tac" style="margin-top: 20px">
              <el-button @click="dialogTableVisible = false" icon="close" size="small">取 消</el-button>
              <el-button type="primary" @click="submitForm" icon="check" size="small">确 定</el-button>
            </div>
          </div>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {bus} from '../../../bus.js';
  import math from '../../../utils/math.js';
  import {dateFormat} from '../../../utils/date.js';
  export default {
    data() {
      return {
        url: bus.host + '/pos/api/check/detailslist',
        list: [],
        listSort: {},
        listQuery: {
          pageSize: 15,
          page: 1,
          firstCategoryId: '',
          searchWord: '',
          secondCategoryId: '',
          checkNo: this.$route.query.coupheckNo,
          id: this.$route.query.Id,
        },
        /*库存修正*/
        ruleForm: {
          id: '',
          checkNo: '',
          name: '',
          barcode: '',
          inventory: '',
          stocktaking: '',
        },
        /*一二级分类*/
        selectedDepartment: '',
        Primarydata: [],
        selectedDepart: '',
        /*分页*/
        currentPage1: 1,
        total: 1,
        Endcheck: '',
        loading: false,
        dialogTableVisible: false,
      }
    },
    computed: {
      /*一二级分类实时查询*/
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
      /*分页*/
      handleSizeChange(val) {
        this.listQuery.pagesize = val;
        this.listTable();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.listTable();
      },
      /*分类*/
      Primaryone() {
        let url = bus.host + '/pos/api/category/list/0'
        this.$http.get(url, {}).then((response) => {
          if (response.data.success == false) {
          } else {
            this.Primarydata = response.data.msg;
          }
        }, (response) => {
          this.$notify.error({title: ' 错 误 ', message: '这是一条错误的提示消息'});
        });
      },

      // 处理点击排序
      sortList(sort){
        this.listSort = this.trimSort(sort);
        this.listTable();
      },
      trimSort(sort){
        if (sort.order != null)
          sort.order = sort.order.replace('ending', '');
        return sort;
      },
      /*数据加载与查询*/
      listTable(){
        if (this.$route.query.Id) {
          this.listQuery.firstCategoryId = this.$data.selectedDepartment;
          this.listQuery.secondCategoryId = this.$data.selectedDepart;
          this.listQuery.checkNo = this.$route.query.coupheckNo;
          this.listQuery.id = this.$route.query.Id;
          let pg = "?page=" + (this.listQuery.page - 1) + "&size=" + this.listQuery.pageSize;
          this.loading = true;
          if (this.listSort.order != null) {
            pg += '&sort=' + this.listSort.prop + ',' + this.listSort.order;
          }else {
            pg += '&sort=' + 'createTime' + ',' + 'desc';
          }
          this.$http.post(this.url + pg, this.listQuery, {}).then((res) => {
            let ListTab = res.data.msg.content;
            this.list = null;
            this.list = ListTab;
            this.total = res.data.msg.totalElements;
            this.loading = false;
          }, (res) => {
            this.$message.error(' 错 误 ');
          })
        } else {
          this.$message.error('此次盘点已被删除');
        }
      },
      /*通过条码或准确收索单一商品直接弹出输入框*/
      handleFilter(){
        let search= this.listQuery.searchWord
        this.listTable();
        for(var i=0;i<this.list.length;i++){
          if(search==this.list[i].base.name&&search !=''){
            let lists=this.list[i]
            this.Stock_change(lists)
          }
          if(search==this.list[i].base.barcode&&search !=''){
            let lists=this.list[i]
            this.Stock_change(lists)
          }
        }

      },
      /*详情*/
      Stock_change(row){
        this.Stock_changes(row)
      },
      Stock_changes(row){
        this.ruleForm.id = row.product.id;
        this.ruleForm.checkNo = row.checkInfo.checkNo;
        this.ruleForm.name = row.base.name;
        this.ruleForm.barcode = row.base.barcode;
        this.ruleForm.inventory = row.inventory;
        this.ruleForm.stocktaking = row.stocktaking;
        this.dialogTableVisible = true;
      },
      /*库存修正*/
      submitForm() {
        if (this.ruleForm.stocktaking == null || this.ruleForm.stocktaking == '' || this.ruleForm.stocktaking == undefined) {
          this.$message({message: '库存数量不能为空！', type: 'error'});
          return false;
        }
        if (this.ruleForm.stocktaking != null) {
          if (!/^\d+$/.test(this.ruleForm.stocktaking)) {
            this.$message({message: '库存数量不合法！', type: 'error'});
            return false;
          }
        }
        let parment = {
          checkInfo: {checkNo: this.ruleForm.checkNo},
          inventory: this.ruleForm.inventory,
          product: {id: this.ruleForm.id},
          stocktaking: this.ruleForm.stocktaking,
        }
        let url = bus.host + '/pos/api/check/updatedetail'
        this.$http.put(url, parment).then((response) => {
          if (response.data.success == false) {
            this.$message.error(response.data.msg);

          } else {
            this.$message({
              message: response.data.msg,
              type: 'success'
            });
          }
          this.listTable();
          this.Endcheck = '';
          this.dialogTableVisible = false;
        }, (response) => {
          this.$notify.error({title: '错误', message: '盘点失败'});
        });
      },
      /*导出盘点*/
      export_check(){
        let url = bus.host + '/pos/api/check/exceldetail'
        this.listQuery.firstCategoryId = this.$data.selectedDepartment;
        this.listQuery.secondCategoryId = this.$data.selectedDepart;
        this.listQuery.checkNo = this.$route.query.coupheckNo;
        this.listQuery.id = this.$route.query.Id;
        this.loading = true;
        this.$http.post(url, this.listQuery, {}).then((res) => {
          if (res.data.success == false) {
            this.$message.error('导出失败！');
            this.loading = false;
            return false;
          } else {
            this.loading = false;
            this.$notify.success({message:'导出成功,正在下载...',duration:1000,onClose:function () {
              window.location=res.data.msg;
            }});
          }
        }, (res) => {
          this.$message.error('错误');
        })
      },
      /*结束盘点*/
      End_check(){
        this.Endcheck = 1;
        this.dialogTableVisible = true;
      },
      /*结束盘点*/
      check_submit(){
        let url = bus.host + '/pos/api/check/sava'
        let coupheckNo = "?checkNo=" + this.$route.query.coupheckNo;
        this.$http.get(url + coupheckNo).then((res) => {
          if (res.data.success == false) {
            this.$message.error(res.data.msg);
            this.dialogTableVisible = false;
            return false;
          } else {
            this.dialogTableVisible = false;
            this.$message({message: res.data.msg, type: 'success'});
            setTimeout(() => {this.$router.push('list');},500)
          }
          this.Endcheck = '';
        }, (res) => {
          this.$message.error('错误');
        })
      },
      /*loading取消*/
      show(){
        this.Endcheck = '';
      }
    },
    mounted() {
      this.listTable();
      this.Primaryone();
    }
  }
</script>
<style>
  .breadcrumb-border {
    border-bottom: 1px solid #efefef;
    margin-bottom: 10px;
  }

  .info-base label {
    width: 90px;
    color: #99a9bf;
  }

  .info-base .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  /*.check-dialog .el-dialog__header{padding:0px !important;}*/
  .detailed .el-dialog__header {
    display: none;
  }

  .detailed .el-form-item {
    margin-bottom: 0px;
  }

  .detailed input {
    width: 100px;
  }

  .f-fl {
    float: left;
  }

  .f-fr {
    float: right;
  }

  .f-fwb {
    font-weight: bold;
  }

  .f-tac {
    text-align: center;
  }

  .f-tr {
    text-align: right
  }
</style>
<style scoped lang="scss">
  .form-inline, .form-inline .form-control {
    display: inline-block;
    width: auto;
    vertical-align: middle;
  }

  .check-tit-pd {
    padding: 0 20px;
  }

  .check-dialog-siz {
    color: #000;
  }

  .check-dialog-img {
    margin: 10px auto;
    img {
      width: 180px;
      height: 150px;
      margin: 10px auto 2px;
      display: block;
    }
    span {
      display: block;
    }
  }

  .Endcheck-siz {
    margin: 20px 0 40px 0;
    font-size: 20px;
  }

  .check-tit {
    margin: 4px 0 16px;
    font-weight: bold;
    font-size: 21px;
  }

  .data-table-pd {
    border-top: 1px solid #e8e8e8;
    padding-top: 10px;
  }

  .ruleForm_cent {
    box-sizing: border-box;
    padding-left: 28%;
  }
  .img_inv{
    position: relative;
    vertical-align: middle;
  }
  .img_inv img{width: 100px;height: 100px;vertical-align: inherit;
    position: relative;
    z-index: 999;
    transition: transform 1s;
    -moz-transition: transform 1s;
    -webkit-transition: transform 1s;
    -o-transition: transform 1s;}
  .img_inv img:hover{
    transform: scale(2,2);cursor:pointer}
</style>
