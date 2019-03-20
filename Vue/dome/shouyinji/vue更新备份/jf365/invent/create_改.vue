<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>库存管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/inventory/list' }">商品入库</el-breadcrumb-item>
          <el-breadcrumb-item>新增入库</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <!--<el-col :span="4">-->
        <!--<el-input @keyup.enter.native="search" placeholder="扫描或输入商品条码/商品名称" v-model="params.searchWord" size="small"/>-->
      <!--</el-col>-->
      <el-col :span="4">
        <!--<el-button type="primary" @click="search" icon="search" size="small">搜索</el-button>-->
        <el-button type="primary" @click="Add_goods" size="small">添加商品</el-button>
        <el-button size="small" @click="remove_all">全部移除</el-button>      </el-col>
      <el-col :span="13">
        <el-input placeholder="备注" v-model="remark" size="small"/>
      </el-col>
      <el-col :span="4" class="tool-bar">
        <el-tooltip class="item" effect="light" content="返回商品入库列表" placement="left" >
          <el-button :plain="true" type="warning" @click="$router.push('list')" size="small">返回列表</el-button>
        </el-tooltip>
        <el-button type="primary" @click="save(list)" size="small">提交入库</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="list" v-loading="loading" show-summary :summary-method="listSummary">
          <el-table-column prop="no" label="商品编号" width="120"/>
          <el-table-column prop="name" label="商品名称"/>
          <el-table-column prop="barcode" label="商品条码" width="170"/>
          <el-table-column prop="expirationDays" label="保质期" width="100"/>
          <el-table-column prop="pkg" label="单位" width="100"/>
          <el-table-column prop="productionDate" label="生产日期" width="150">
            <template scope="scope">
              <el-date-picker
                v-model="scope.row.productionDate"
                type="date" size="mini" style="width:auto;"/>
            </template>
          </el-table-column>
          <el-table-column prop="purchasePrice" label="采购价格" width="100">
            <template scope="scope">
              <el-input v-model="scope.row.purchasePrice" @change="rowSummary(scope.row)" size="mini"/>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="入库数量" width="100">
            <template scope="scope">
              <el-input v-model="scope.row.quantity" @change="rowSummary(scope.row)" size="mini"/>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额小计" width="100"/>
          <el-table-column label="操作" width="70" align="right">
            <template scope="scope">
              <el-button :plain="true" type="danger" @click="list.splice(scope.$index, 1)" size="small">排除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-col  :sm="24" :md="24" :lg="24">
      <el-dialog title="商品添加" :visible.sync="dialogFormVisible" ref='dialog' size="small" top="10%" @close="remov()">
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
              <el-input @keyup.enter.native="handleFilter" placeholder="扫描或输入商品条码/商品名称" v-model="params.searchWord"/>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="handleFilter" icon="search">搜索</el-button>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="24">
          <el-table :data="tableData_Load" style="width: 100%" v-loading="listLoading" ref="multipleTable"
                    @selection-change="handleSelectionChange"
                    @select="select_ck"
                    @select-all="select_all"
                    tooltip-effect="dark" class="tableData_Load">
            <el-table-column type="selection" width="55"></el-table-column>
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
            :page-size=params.pageSize
            layout="total,prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </el-col>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel" class="fr">取 消</el-button>
          <el-button type="primary" @click="update"  class="fr mg_r" >确 定</el-button>
        </div>
      </el-dialog>
    </el-col>

    <el-dialog title="提示" :visible.sync="showDialog" size="tiny">
      <h3>入库成功！</h3>
      <div>入&emsp;库&emsp;人：{{operator}}</div>
      <div>入库单号：{{no}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="$router.push('list')">确 定</el-button>
      </span>
    </el-dialog>
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
        loading: false,
        showDialog:false,
        remark:'',
        no:'',
        operator:'',
        /*分页多选*/
        storage:[],
        params:{ //弹出商品添加
          searchWord:'',
          firstCategoryId: '',
          secondCategoryId: '',
          page: 1,
          pageSize: 15,
        },
        tableData_Load:[],
        currentPage3:1,
        total:1,
        /*分类*/
        Primarydata:[],
        selectedDepart: '',
        selectedDepartment: '',
        listLoading: false,
        dialogFormVisible:false
      }
    },
    computed: {
      /*dialog分类查找*/
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
      /*分页多选*/
      /*多页单选择*/
      select_ck(selection, row){
        this.storage = selection.reduce( function(coll,item){
          coll.push( item );
          return coll;
        }, this.storage);
      },
      /*多页多选择*/
      select_all(selection){
        this.storage = selection.reduce( function(coll,item){
          coll.push( item );
          return coll;
        }, this.storage);
      },
      /*分页*/
      handleSizeChange(val) {
        this.params.pagesize = val;
        this.getTable();
      },
      handleCurrentChange(val) {
        this.params.page = val;
        this.getTable();
      },
      /*商品查找与添加*/
      Add_goods(){
        this.dialogFormVisible = true;
        this.getTable();
        this.Primaryone();
      },
      /*移除商品*/
      remove_all(){
        $('.tableData tbody tr').html("");
        this.list = [];
      },
      cancel(){
        this.storage=[];
        this.dialogFormVisible = false;
      },
      remov(){
        this.storage=[];
        this.dialogFormVisible = false;
      },
      /*check选择商品*/
      handleSelectionChange(val){
        this.multipleSelection = val;
      },
      handleFilter(){
        this.getTable();
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
          this.$notify.error({
            title: '错误',
            message: '这是一条错误的提示消息'
          });
        });
      },
      /*dialog数据查询*/
      getTable() {
        let url=bus.host+'/pos/api/product/list';
        let pg = "?page=" + (this.params.page - 1) + "&size=" + this.params.pageSize;
        this.listLoading = true;
        this.params.firstCategoryId = this.$data.selectedDepartment;
        this.params.secondCategoryId = this.$data.selectedDepart;
        this.$http.post(url + pg, this.params, {}).then((response) => {
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
      /*分页多选*/

      update() {
        this.loading = true;

            let content=this.storage;
            content.forEach(function(e){
              if(e.products.length==0){
                  e['id']='';
                  e['purchasePrice']=0;
                  e['sellingPrice']=0;
                  e['inventory']=0;
                  e['safetyInventoryDays']=0;
                  e['amount']=0;
              }else{
                let product=e.products[0];
                e['purchasePrice']=product.purchasePrice;
                e['sellingPrice']=product.sellingPrice;
                e['inventory']=product.inventory;
                e['safetyInventoryDays']=product.safetyInventoryDays;
                e['amount']=0;
              };
            });

            content.forEach(function(e){
              e.productionDate='';
            });
            this.list = content.reduce( function(coll,item){
              coll.push( item );
              return coll;
            }, this.list);
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
            this.storage=[];
            this.loading = false;

      },

//      /**
//       * 搜索
//       * */
//      search(){
//        if(this.params.searchWord==''){
//          this.$message({
//            message: '请输入关键字搜索商品！',
//            type: 'warning'
//          });
//          return;
//        }
//        this.loadList();
//      },
      /**
       * 提交入库
       * */
      save(rows){
          if(rows.length==0){
            this.$message({message: '请先添加需要入库的商品！', type: 'error'});
            return;
          }
          this.loading=true;
          if(this.validate(rows)){
              // 输入验证通过，构造提交参数进行提交
            let items=new Array();
            rows.forEach((e)=>{
              let item={
                base: {id: e.id},
                productionDate:dateFormat(e.productionDate,'yyyy-MM-dd hh:mm:ss'),
                purchasePrice: e.purchasePrice,
                quantity: e.quantity,
                amount: e.amount,
              }
              items.push(item);
            });
            let params={
              remark:this.remark,
              stockInItems:items
            };
            let url = bus.host + '/pos/api/inventory/stockin/create'
            this.$http.post(url, params).then((res) => {
              let data=res.data;
              if(data.success == false&&status==200){
                this.$alert('您没有此操作权限', '对不起', {
                  confirmButtonText: '确定',
                });
                return;
              }
              let msg=data.msg;
              this.no=msg.no;
              this.operator=msg.operator;
              this.showDialog=true;
            }, (res) => {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            });
          }
          this.loading=false;
      },
      rowSummary:function (row) {
          let purchasePrice=row.purchasePrice==null?0:row.purchasePrice;
          let quantity=row.quantity==null?0:row.quantity;
          row.amount=math.accMul(purchasePrice,quantity);
      },
      listSummary(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          switch (index){
            case 0:
              sums[index] = '合计';
              break;
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 9:
              sums[index] = '--';
              break;
            default:
              const values = data.map(item => Number(item[column.property]));
              sums[index] = values.reduce((prev, curr) => {
                return math.accAdd(prev,curr);
              }, 0);
          }
        });
        return sums;
      },
      validate(rows) {
          try{
            rows.forEach((e)=>{
              if(e.productionDate==''){
                this.$message({message: '生产日期不能为空！', type: 'warning'});
                throw e;
              }
              if(e.purchasePrice==null||e.purchasePrice=='') {
                this.$message({message: '采购价不能为空！', type: 'warning'});
                throw e;
              }
              if(!/^\d+(\.\d+)?$/.test(e.purchasePrice)){
                this.$message({message: '采购价不合法！', type: 'warning'});
                throw e;
              }
              if(e.quantity==null||e.quantity==0||e.quantity=='') {
                this.$message({message: '入库数量不能为空！', type: 'warning'});
                throw e;
              }
              if(!/^\d+$/.test(e.quantity)) {
                this.$message({message: '入库数量不合法！', type: 'warning'});
                throw e;
              }
            });
            return true;
          }catch(e){
            return false;
          }
      }
    }
  }
</script>
<style>
  .breadcrumb-border{border-bottom:1px solid #efefef;margin-bottom:10px;}
  .el-breadcrumb{padding:5px 0px;}
  .el-pagination{padding: 10px 0px;}
  .el-table{margin-top:10px;}
  .tool-bar{text-align: right;}
</style>

