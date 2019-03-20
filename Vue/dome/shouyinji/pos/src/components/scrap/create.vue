<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>库存管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/scrap/list' }">出库管理</el-breadcrumb-item>
          <el-breadcrumb-item>新增出库</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="4">
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="Add_goods" size="small" icon="plus">添加商品</el-button>
        <el-button size="small" @click="removeall" icon="delete">全部移除</el-button>
      </el-col>
      <el-col :span="16" class="tool-bar f-fr">
        <el-select v-model="scrapType" placeholder="请选择出库类型" size="small">
          <el-option key="0" label="调货" value="0"/>
          <el-option key="1" label="报损" value="1"/>
        </el-select>
        <el-tooltip class="item" effect="light" content="返回出库单列表" placement="left">
          <el-button :plain="true" type="warning" @click="$router.push('list')" size="small" icon="arrow-left">返回列表
          </el-button>
        </el-tooltip>
        <el-button type="primary" @click="save(list)" size="small" icon="check">提交出库</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <el-table stripe border :data="list">
          <el-table-column prop="name" label="商品名称" width="300"/>
          <el-table-column prop="barcode" label="商品条码" width="180"/>
          <el-table-column prop="spec" label="规格"/>
          <el-table-column prop="pkg" label="单位"/>
          <el-table-column prop="secondCategory.name" label="分类"/>
          <el-table-column prop="purchasePrice" label="采购价格">
            <template scope="scope">
              <span
                v-model="scope.row['products'][0]['purchasePrice']">{{scope.row['products'][0]['purchasePrice']}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="出库数量" width="100">
            <template scope="scope">
              <el-input v-model="scope.row.quantity" size="mini"/>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="出库原因">
            <template scope="scope">
              <el-input placeholder="请输入50个字符之内的字符" type="textarea" v-model="scope.row.reason" size="mini" autosize/>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70" align="right">
            <template scope="scope">
              <el-button :plain="true" type="danger" @click="list.splice(scope.$index, 1)" size="small" icon="delete">
                排除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <!--<el-dialog  title="确认提交"  :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false"  :show-close="false" size="tiny" class="dialog_box">-->
    <el-dialog title="确认提交" :visible.sync="showDialog" @close="shows()" size="tiny" class="dialog_box">
      <el-row :gutter="20">
        <div>
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">出库单号：</label>
            <div class="dialog-cont">{{no}}</div>
          </el-col>
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">出库时间：</label>
            <div class="dialog-cont">{{createTime}}</div>
          </el-col>
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">出库人：</label>
            <div class="dialog-cont">{{operator}}</div>
          </el-col>
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">出库总数：</label>
            <div class="dialog-cont">{{quantity}}件</div>
          </el-col>
        </div>
        <el-col :span="24" class="tool-bar">
          <el-button @click="deleteId" icon="close">取消</el-button>
          <el-button type="primary" @click="btnsuccess" icon="check" :loading="submitForm_loading">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-col :sm="24" :md="24" :lg="24">
      <el-dialog title="商品添加" :visible.sync="dialogFormVisible" ref='dialog' top="7%" @close="show()">
        <el-row :gutter="10">
          <el-col :span="5" style="border:1px solid rgb(244, 240, 237);padding:3px;">
            <el-row class="scrollbar scrollbar_tag scrollbar_tags">
              <el-row align="center" style="background-color: rgb(106, 92, 72);color:white;">
                <el-col align="center">已选商品(共{{storage.length}}个)</el-col>
              </el-row>
              <el-table
                :data="storage"
                :show-header="false"
                style="width: 100%">
                <el-table-column label="" show-overflow-tooltip>
                  <template scope="scope">
                    <el-tag type="primary" :class="scope.row.barcode==''?'tagError':''">{{scope.row.name}}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="" width="23">
                  <template scope="scope">
                    <el-button :plain="true" type="danger" @click="handleClose($event,scope.$index, scope.row)" size="small"
                               icon="delete"></el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </el-col>
          <el-col :span="19">
            <el-row :gutter="2">
              <el-col :span="6">
                <el-select v-model="selectedDepartment" clearable placeholder="一级分类" id="id_ment" size="small">
                  <el-option class="idment" v-for="item in Primarydata" :key="item.name" :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-select v-model="selectedDepart" clearable placeholder="二级分类" size="small">
                  <el-option class="idmento" v-for="item in subCategories" :key="item.name" :label="item.name"
                             :value="item.id"></el-option>
                </el-select>
              </el-col>
              <el-col :span="9">
                <el-input @keyup.enter.native="handleFilter" placeholder="扫描或输入商品条码/商品名称" v-model.trim="listQuery.searchWord" size="small" id="searchWordID"/>
              </el-col>
              <el-col :span="3" align="right">
                <el-button type="primary" @click="handleFilter" icon="search" size="small">搜索</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-table stripe :data="tableData_Load" style="width: 100%" v-loading="listLoading" ref="multipleTable"
                        row-key="id" @selection-change="handleSelectionChange" @row-click="toggleSelect" tooltip-effect="dark">
                <el-table-column type="selection" :reserve-selection="true" width="55"
                                 :selectable="selectable"></el-table-column>
                <el-table-column prop="name" label="商品名称"></el-table-column>
                <el-table-column prop="barcode" label="商品条码"></el-table-column>
                <el-table-column prop="spec" label="规格"></el-table-column>
                <el-table-column prop="pkg" label="单位" width="80"></el-table-column>
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
        </el-row>
        <el-row>
          <el-col align="right">
            <el-button @click="dialogFormVisible = false" size="small" icon="close">取 消</el-button>
            <el-button type="primary" @click="update" size="small" icon="check">确 定</el-button>
          </el-col>
        </el-row>
      </el-dialog>
    </el-col>
  </div>
</template>
<script>
  import {bus} from '../../bus.js';
  import {dateFormat} from '../../utils/date.js';
  import math from '../../utils/math.js';

  export default{
    data(){
      return {
        scrapType:'',
        list: [],
//        loading: false,
        showDialog: false,
        no: '',
        delete_Id: '',
        createTime: '',
        del: true,
        username: '',
        quantity: '',
        operator: '',
        storageID:'',
        /*dialog商品选择*/
        dialogFormVisible: false,
        listLoading: false,
        submitForm_loading: false,
        tableData_Load: [],
        Primarydata: [],
        storage: [],
        selectedDepart: '',
        selectedDepartment: '',
        /*分页搜索*/
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
      }
    },
    computed: {
      /*数据联动*/
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
      selectable(row, index){
        if (row.id === 'DEFAULTID') {
          return false;
        }
        return true;
      },
      /*dialog商品选择*/
      Add_goods(){
        this.dialogFormVisible = true;
        this.getTable();
        this.Primaryone();
        this.currentPage3=1;
      },
      /*多级联动*/
      Primaryone() {
        let url = bus.host + '/pos/api/category/list/0'
        this.$http.get(url, {}).then((response) => {
          if (response.data.success == false) {
          } else {
            this.Primarydata = response.data.msg;
          }
        }, (response) => {
          this.$notify.error({title: '错误', message: '这是一条错误的提示消息'});
        });
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
        this.storageID=selection;
        let idValueMap = [];
        selection.forEach(function (e) {
          idValueMap[e.id] = e;
        });
        let valArr = new Array();
        for (let k in idValueMap) {
          valArr.push(idValueMap[k]);
        }
        this.storage =valArr;
      },
      handleFilter(){
        this.getTable();
      },
      /*dialog数据查询*/
      getTable() {
        let url = bus.host + '/pos/api/product/list';
        let pg = "?page=" + (this.listQuery.page - 1) + "&size=" + this.listQuery.pageSize;
        this.listLoading = true;
        this.listQuery.firstCategoryId = this.$data.selectedDepartment;
        this.listQuery.secondCategoryId = this.$data.selectedDepart;
        this.$http.post(url + pg, this.listQuery, {}).then((response) => {
          if (response.data.success == false) {
            this.$notify.error({
              title: '错误',
              message: '您没用权限哦！'
            });
          }
          this.total = response.data.msg.totalElements;
          this.tableData_Load = response.data.msg.content;
          $("#searchWordID input").focus();
          $("#searchWordID input").select();
          if(this.listQuery.searchWord !=''){
            if(this.listQuery.searchWord!=''||this.listQuery.searchWord!=undefined||this.listQuery.searchWord!=null){
              if(this.tableData_Load.length<=1){
                for(var i=0;i<this.tableData_Load.length;i++){
                  this.$refs.multipleTable.toggleRowSelection(this.tableData_Load[i],true);
                  if(this.tableData_Load[i].id==='DEFAULTID'){
                    this.$refs.multipleTable.toggleRowSelection(this.tableData_Load[i],false);
                  }
                  if( this.storageID.length !=this.storage.length){
                    this.$message({message: '该商品已存在请勿重复添加', type: 'warning'});
                    this.$refs.multipleTable.toggleRowSelection(this.tableData_Load[i],false);
                  }
                }
              }
            }
          }
          this.listLoading = false;
        }, (response) => {
          this.$notify.error({
            title: '错误',
            message: '这是一条错误的提示消息'
          });
        });
      },
      /*删除左侧选中商品*/
      handleClose(e,index,row){
        this.storage.splice(index,1)
        if( this.storageID.length !=this.storage.length){
          this.$refs.multipleTable.toggleRowSelection(this.storageID[index],false);
        }
      },
      /*更改单前列选中状态*/
      toggleSelect(row, event, column){
        if(row.id==='DEFAULTID')return;
        if(row.barcode===''){
          this.$message({
            message: '商品无条码',
            type: 'warning'
          });
        }
        this.$refs.multipleTable.toggleRowSelection(row);
      },
      /*取消清空分类选择*/
      show(){
        this.$data.selectedDepartment = '';
        this.$data.selectedDepart = '';
        this.listQuery.searchWord = '';
        this.storage == '';
        this.$refs.multipleTable.clearSelection();
      },
      /*数据确定（提交）*/
      update() {
        if (this.multipleSelection == undefined) {
          this.$message.error('请选择商品');
          return false;
        } else if (this.multipleSelection.length == 0) {
          this.$message.error('请选择商品');
          return false;
        } else {
          let submitConfirm=true;
          this.storage.forEach((e)=>{
            if(e.barcode===''){
              submitConfirm=false
            }
          })
          if(submitConfirm==true){
            let content = this.storage
            content.forEach(function (e) {
              if (e.products.length == 0) {
                e['id'] = '';
                e['purchasePrice'] = 0;
                e['sellingPrice'] = 0;
                e['inventory'] = 0;
                e['safetyInventoryDays'] = 0;
                e['amount'] = 0;
              } else {
                let product = e.products[0];
                e['id'] = product.id;
                e['purchasePrice'] = product.purchasePrice;
                e['sellingPrice'] = product.sellingPrice;
                e['inventory'] = product.inventory;
                e['safetyInventoryDays'] = product.safetyInventoryDays;
                e['amount'] = 0;
              }
              ;
            });
            content.forEach(function (e) {
              e.productionDate = '';
            });
            this.list = content.reduce(function (coll, item) {
              coll.push(item);
              return coll;
            }, this.list);
            let idValueMap = [];
            this.list.forEach(function (e) {
              idValueMap[e.id] = e;
            });
            let valArr = new Array();
            for (let k in idValueMap) {
              valArr.push(idValueMap[k]);
            }
            this.list = valArr;
            this.dialogFormVisible = false;
            this.$data.selectedDepartment = '';
            this.$data.selectedDepart = '';
            this.listQuery.searchWord = '';
            this.storage == '';
            this.$refs.multipleTable.clearSelection();
          }else {
            this.$message({
              message: '请删除已添加的无码商品',
              type: 'warning'
            });
          }
        }
      },
      /*dialog商品选择*/
      /*清空所有商品*/
      removeall(){
        this.list = [];
        this.$refs.multipleTable.clearSelection();
      },
      /*提交*/
      save(rows){
        if (rows.length == 0) {
          this.$message({message: '请先添加需要出库的商品！', type: 'error'});
          return;
        }
        if(this.scrapType==''){
          this.$message({message: '请选择出库类型！', type: 'error'});
          return;
        }

        if (this.validate(rows)) {
          this.del = true;
          // 输入验证通过，构造提交参数进行提交
          let scrapItems = new Array();
          var ts = true;
          rows.forEach((e) => {
            let item = {
              product: e.products[0],
              purchasePrice: e.products[0].purchasePrice,
              quantity: e.quantity,
              reason: e.reason,
            }
            if (item.reason.length > 50) {
              ts = false;
              return false;
            }
            scrapItems.push(item);
          });
          if (ts == false) {
            this.$alert('输入字符过长', '对不起', {
              confirmButtonText: '确定',
            });
            return false;
          }
          let params = {
            type:this.scrapType,
            scrapItems: scrapItems
          };
          let url = bus.host + '/pos/api/inventory/scrap/create'
          this.$http.post(url, params).then((res) => {
            let data = res.data;
            if (!data.success) {
              this.$alert(data.msg, '提示', {
                confirmButtonText: '确定',
              });
              return;
            }
            let msg = data.msg;
            this.delete_Id = msg.id;
            this.no = msg.no;
            this.createTime = msg.createTime;
            this.username = msg.user.telephone;
            this.operator = msg.operator;
            this.quantity = msg.quantity;
            this.showDialog = true;
          }, (res) => {
            this.$message.error('提交失败');
          });
        }
      },
      /*提交取消生成订单*/
      shows(){
        if (this.del) {
          this.deleteId();
          this.del = true;
        }
      },
      deleteId(){
        this.delete_Id;
        let url = bus.host + '/pos/api/inventory/scrap/delete/' + this.delete_Id;
        this.$axios.get(url).then((res) => {
          this.del = false;
          this.showDialog = false;
          this.submitForm_loading = false;
        })
        this.del = true;
      },
      /*确认提交*/
      btnsuccess(){
        this.submitForm_loading = true;
        this.$message({message: '数据提交成功', type: 'success', duration: 1000});
        setTimeout(() => {
          this.$router.push('list');
        }, 1000)
      },
      /*验证*/
      validate(rows){
        try {
          rows.forEach((e) => {
            if (e.quantity == '' || e.quantity == null || e.quantity == undefined) {
              this.$message({message: '出库数量不能为空！', type: 'warning'});
              throw e;
            }
            if (!/^\d+$/.test(e.quantity)) {
              this.$message({message: '出库数量不合法！', type: 'warning'});
              throw e;
            }
            if (e.reason == '' || e.reason == null || e.reason == undefined) {
              this.$message({message: '出库原因不能为空！', type: 'warning'});
              throw e;
            }
          })
          return true;
        } catch (e) {
          return false;
        }
      }
    },
    mounted() {

    }
  }
</script>
<style>
  .breadcrumb-border {
    border-bottom: 1px solid #efefef;
    margin-bottom: 10px;
  }

  .el-breadcrumb {
    padding: 5px 0px;
  }

  .el-pagination {
    padding: 10px 0px;
  }

  .el-table {
    margin-top: 10px;
  }

  .tool-bar {
    text-align: right;
  }

  .dialog_box .el-dialog__body .dialog-la, .dialog_box .el-dialog__body.dialog-cont {
  }

  .dialog_box .el-dialog__body .dialog_bnt {
    text-align: center;
  }

  .scrollbar_tag .el-table {
    border: none;
  }

  .scrollbar_tag .el-table .cell {
    padding: 0 2px;
  }

  .scrollbar_tag .el-table th.is-leaf, .scrollbar_tag .el-table td {
    border-bottom: none;
  }

  .scrollbar_tag .el-table th, .el-table td {
    height: 30px;
  }

  .scrollbar_tags .el-table__body-wrapper {
    max-height: 747px;
    overflow-x: hidden;
  }

  .scrollbar_tag .el-table tr {
    position: relative;
  }

  .scrollbar_tag .cell button {
    position: absolute;
    right: 18px;
    border: none;
    padding: 5px;
    top: 5px;
  }

</style>
<style scoped lang="scss">
  .scrollbar_tag .el-table tr span {
    width: 142px;
  }

  @media (max-width: 1366px) {
    .scrollbar_tag .el-table tr span {
      width: 85px !important;
    }
  }
  .dialog_cont {
    width: 400px;
    margin: auto
  }

  .btoom_table {
    margin-bottom: 15px;
  }

  .dialog-la {
    width: 80px;
    vertical-align: middle;
    float: left;
    text-align: right;
  }

  .dialog-cont {
    margin-left: 90px;
    word-wrap: break-word;
  }
  .tagError{background-color: #ff4949;color: #fff;}
</style>
