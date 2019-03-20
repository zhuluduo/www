<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>库存管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/scrap/list' }">报损单</el-breadcrumb-item>
          <el-breadcrumb-item>新增报损</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="4">
      </el-col>
      <el-col :span="5">
        <el-button type="primary" @click="Add_goods" size="small" icon="plus">添加商品</el-button>
        <el-button size="small" @click="removeall" icon="delete">全部移除</el-button>
      </el-col>
      <el-col :span="4" class="tool-bar f-fr">
        <el-tooltip class="item" effect="light" content="返回报损单列表" placement="left" >
          <el-button :plain="true" type="warning" @click="$router.push('list')" size="small" icon="arrow-left">返回列表</el-button>
        </el-tooltip>
        <el-button type="primary" @click="save(list)" size="small" icon="check">提交报损</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <el-table :data="list" stripe>
          <el-table-column prop="name" label="商品名称" width="300" />
          <el-table-column prop="barcode" label="商品条码" width="180"/>
          <el-table-column prop="expirationDays" label="规格"/>
          <el-table-column prop="pkg" label="单位" />
          <el-table-column prop="secondCategory.name" label="分类"/>
          <el-table-column prop="purchasePrice" label="采购价格">
            <template scope="scope">
              <span v-model="scope.row['products'][0]['purchasePrice']">{{scope.row['products'][0]['purchasePrice']}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="报损数量" width="100">
            <template scope="scope">
              <el-input v-model="scope.row.quantity"   size="mini"/>
            </template>
          </el-table-column>
          <el-table-column prop="reason" label="报损原因" >
            <template scope="scope">
              <el-input  type="textarea" v-model="scope.row.reason"  size="mini"  autosize/>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="70" align="right">
            <template scope="scope">
              <el-button :plain="true" type="danger" @click="list.splice(scope.$index, 1)" size="small" icon="delete">排除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog  title="报损添加成功"  :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false"  :show-close="false" size="tiny" class="dialog_box">
      <el-row :gutter="20">
        <div >
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">报损单号：</label>
            <div class="dialog-cont">{{no}}</div>
          </el-col>
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">报损时间：</label>
            <div class="dialog-cont">{{createTime}}</div>
          </el-col>
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">报损人：</label>
            <div class="dialog-cont">{{username}}</div>
          </el-col>
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">报损总数：</label>
            <div class="dialog-cont">{{quantity}}件</div>
          </el-col>
        </div>
        <el-col :span="24" class="tool-bar">
          <el-button @click="deleteId" icon="close">取消</el-button>
          <el-button type="primary" @click="$router.push('list')" icon="check">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-col  :sm="24" :md="24" :lg="24">
      <el-dialog title="商品添加" :visible.sync="dialogFormVisible" ref='dialog' top="7%" >
        <el-row :gutter="10">
          <el-col :span="5" style="border:1px solid rgb(244, 240, 237);padding:3px;">
            <!--<el-row align="center" style="background-color: rgb(106, 92, 72);color:white;"><el-col align="center">已选商品(共{{storage.length}}个)</el-col></el-row>-->
            <!--<el-row style="height: 750px;overflow: auto;" class="scrollbar scrollbar_tag">-->
                <!--<el-tag-->
                  <!--:key="item.name" v-for="(item, index) in storage" :closable="true" :close-transition="false" @close="handleClose(item)">-->
                  <!--&lt;!&ndash;{{item.name.length>11?item.name.substring(0,11)+'...':item.name}}&ndash;&gt;-->
                  <!--{{item.name}}-->
                <!--</el-tag>-->
            <!--</el-row>-->
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
                <el-select v-model="selectedDepartment" clearable placeholder="一级分类" id="id_ment" size="small">
                  <el-option class="idment" v-for="item in Primarydata" :key="item.name" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-col>
              <el-col :span="6">
                <el-select v-model="selectedDepart" clearable placeholder="二级分类" size="small">
                  <el-option class="idmento" v-for="item in subCategories" :key="item.name" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-col>
              <el-col :span="9">
                <el-input @keyup.enter.native="handleFilter" placeholder="扫描或输入商品条码/商品名称" v-model="listQuery.searchWord" size="small"/>
              </el-col>
              <el-col :span="3" align="right">
                <el-button type="primary" @click="handleFilter" icon="search" size="small">搜索</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-table stripe :data="tableData_Load" style="width: 100%" v-loading="listLoading" ref="multipleTable" row-key="id"
                        @selection-change="handleSelectionChange"
                        tooltip-effect="dark" >
                <el-table-column type="selection"  :reserve-selection="true" width="55"></el-table-column>
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
            <el-button type="primary" @click="update"  size="small" icon="check">确 定</el-button>
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
        list: [],
//        loading: false,
        showDialog:false,
        no:'',
        delete_Id:'',
        createTime:'',
        username:'',
        quantity:'',
        operator:'',
        /*dialog商品选择*/
        dialogFormVisible: false,
        listLoading: false,
        tableData_Load:[],
        Primarydata:[],
        storage:[],
        selectedDepart: '',
        selectedDepartment: '',
        /*分页搜索*/
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
      /*dialog商品选择*/
      Add_goods(){
        this.dialogFormVisible = true;
        this.getTable();
        this.Primaryone();
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
          this.$notify.error({title: '错误',message: '这是一条错误的提示消息'});
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
        this.storage=selection;
      },
      handleFilter(){
        this.getTable();
      },
//      /*删除左侧选中商品*/
//      handleClose(item){
//        this.storage.splice(this.storage.indexOf(item), 1);
//      },
      /*dialog数据查询*/
      getTable() {
        let url=bus.host+'/pos/api/product/list';
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
          this.listLoading = false;
        }, (response) => {
          this.$notify.error({
            title: '错误',
            message: '这是一条错误的提示消息'
          });
        });
      },
      /*数据确定（提交）*/
      update() {
        this.storage=this.multipleSelection;
        this.list = this.storage;
        this.list .forEach(function(e){
          e.productionDate='';
        });
        this.list = this.storage
        let idValueMap=[];
        this.list.forEach(function(e){
          idValueMap[e.id]=e;
        });
        let valArr=new Array();
        for(let k in idValueMap){
          valArr.push(idValueMap[k]);
        }
        this.list=valArr;
        this.$message({
          message: '商品添加成功！！！',
          type: 'success'
        });
        this.dialogFormVisible = false;
      },
      /*dialog商品选择*/
      /*清空所有商品*/
      removeall(){
        this.list = [];
        this.$refs.multipleTable.clearSelection();
      },
      /*提交*/
      save(rows){
        if(rows.length==0){
          this.$message({message: '请先添加需要报损的商品！', type: 'error'});
          return;
        }
        if(this.validate(rows)) {
          // 输入验证通过，构造提交参数进行提交
          let scrapItems = new Array();
          rows.forEach((e) => {
            let item = {
              product: e.products[0],
              purchasePrice: e.products[0].purchasePrice,
              quantity: e.quantity,
              reason: e.reason,
            }
            scrapItems.push(item);
          });
          let params = {
            scrapItems: scrapItems
          };
          let url = bus.host + '/pos/api/inventory/scrap/create'
          this.$http.post(url, params).then((res) => {
            let data = res.data;
            if (!data.success) {
              this.$alert('您没有此操作权限', '对不起', {
                confirmButtonText: '确定',
              });
              return;
            }
            let msg = data.msg;
            this.delete_Id=msg.id;
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
      deleteId(){
        this.delete_Id;
        let url=bus.host+'/pos/api/inventory/scrap/delete/'+this.delete_Id;
        this.$axios.get(url).then((res)=>{
          this.showDialog = false;
        })
      },
    /*验证*/
      validate(rows){
        try {
          rows.forEach((e)=>{
            if(e.quantity==''||e.quantity==null||e.quantity==undefined){
              this.$message({message: '报损数量不能为空！', type: 'warning'});
              throw e;
            }
            if(e.reason==''||e.reason==null||e.reason==undefined){
              this.$message({message: '报损原因不能为空！', type: 'warning'});
              throw e;
            }
            if(!/^\d+$/.test(e.quantity)) {
              this.$message({message: '报损数量不合法！', type: 'warning'});
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
  .breadcrumb-border{border-bottom:1px solid #efefef;margin-bottom:10px;}
  .el-breadcrumb{padding:5px 0px;}
  .el-pagination{padding: 10px 0px;}
  .el-table{margin-top:10px;}
  .tool-bar{text-align: right;}
  .dialog_box .el-dialog__body .dialog-la ,.dialog_box .el-dialog__body.dialog-cont{}
  .dialog_box .el-dialog__body .dialog_bnt{text-align: center;}
  .scrollbar_tag .el-table{border: none;}
  .scrollbar_tag .el-table .cell{padding: 0 2px;}
  .scrollbar_tag .el-table th.is-leaf, .scrollbar_tag .el-table td{border-bottom: none;}
  .scrollbar_tag .el-table th, .el-table td{height: 30px;}
  .scrollbar_tag .el-table__body-wrapper{max-height: 747px;overflow-x: hidden;}
  .scrollbar_tag .el-table tr{position: relative;}
  .scrollbar_tag .cell button{position:absolute;right:18px;border:none;padding:5px;top:5px;}
  .scrollbar_tag .el-table tr span{width: 142px;}
  @media (max-width:1366px) {  .scrollbar_tag .el-table tr span{width: 83px;}}
</style>
<style scoped lang="scss">
  .dialog_cont{width: 400px;margin: auto}
  .btoom_table{margin-bottom: 15px;}
  .dialog-la{width: 80px;vertical-align:middle;float:left;text-align:right;}
  .dialog-cont{margin-left:90px;  word-wrap: break-word;  }
</style>
