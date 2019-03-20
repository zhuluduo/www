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
      <!--<el-col :span="4">-->
        <!--<el-input @keyup.enter.native="search" placeholder="扫描或输入商品条码/商品名称" v-model="params.searchWord" size="small"/>-->
      <!--</el-col>-->
      <el-col :span="6">
        <!--<el-button type="primary" @click="search" icon="search" size="small">搜索</el-button>-->
        <el-button type="primary" @click="Addgoods" size="small">添加商品</el-button>
        <el-button size="small" @click="removeall">全部移除</el-button>
      </el-col>
      <el-col :span="4" class="tool-bar f-fr">
        <el-tooltip class="item" effect="light" content="返回报损单列表" placement="left" >
          <el-button :plain="true" type="warning" @click="$router.push('list')" size="small">返回列表</el-button>
        </el-tooltip>
        <el-button type="primary" @click="save(list)" size="small">提交报损</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <el-table :data="list" v-loading="loading">
          <el-table-column prop="name" label="商品名称" width="310" />
          <el-table-column prop="barcode" label="商品条码" width="180"/>
          <el-table-column prop="spec" label="规格"/>
          <el-table-column prop="pkg" label="单位" />
          <el-table-column prop="secondCategory.name" label="分类"/>
          <el-table-column prop="purchasePrice" label="采购价格"/>
          <el-table-column prop="quantity" label="报损数量" width="100">
            <template scope="scope">
              <el-input v-model="scope.row.quantity"   size="mini"/>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="报损原因" >
            <template scope="scope">
              <el-input  type="textarea" v-model="scope.row.reason"  size="mini"  autosize/>
            </template>
          </el-table-column>
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
        <el-row>
          <el-col :span="5">
              <el-row><el-col align="center">已选商品</el-col></el-row>
              <el-row>
                <el-col ><p style="border:dashed orange 1px;" v-for="product in selectedProducts">{{product.name}}</p></el-col>
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
                <el-input @keyup.enter.native="handleFilter" placeholder="扫描或输入商品条码/商品名称" v-model="params.searchWord" size="small"/>
              </el-col>
              <el-col :span="3">
                <el-button type="primary" @click="handleFilter" icon="search" size="small">搜索</el-button>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-table :data="tableData_Load" style="width: 100%" v-loading="listLoading" ref="multipleTable"
                          @select="handleSelectionChange"
                          @select-all="handleSelectionChange"
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
            </el-row>
          </el-col>
        </el-row>

        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel" class="fr">取 消</el-button>
          <el-button type="primary" @click="update"  class="fr mg_r" >确 定</el-button>
        </div>
      </el-dialog>
    </el-col>
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
          <!--<el-col :span="24" class="btoom_table">-->
            <!--<label class="dialog-la">报损总数：</label>-->
            <!--<div class="dialog-cont">￥300元</div>-->
          <!--</el-col>-->
        </div>
        <el-col :span="24" class="tool-bar">
          <el-button @click="deleteId">取消</el-button>
          <el-button type="primary" @click="$router.push('list')">确 定</el-button>
        </el-col>
      </el-row>
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
        delete_Id:'',
        no:'',
        createTime:'',
        username:'',
        quantity:'',
        operator:'',
        selectedProducts:[], // 已选中商品
        params:{ //弹出商品添加
          searchWord:'',
          productStatus:1, // 查询在售商品，非在售商品不允许报损
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
//      /*多页单选择*/
//      select_ck(selection, row){
//        this.storage = selection.reduce( function(coll,item){
//          coll.push( item );
//          return coll;
//        }, this.storage);
//      },
//      /*多页多选择*/
//      select_all(selection){
//        this.storage = selection.reduce( function(coll,item){
//          coll.push( item );
//          return coll;
//        }, this.storage);
//      },
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
      Addgoods(){
        this.dialogFormVisible = true;
        this.getTable();
        this.Primaryone();
      },
      /*移除商品*/
      removeall(){
        $('.tableData tbody tr').html("");
        this.list = [];
      },
      cancel(){
        //this.storage=[];
        this.dialogFormVisible = false;
      },
      remov(){
        this.storage=[];
        this.dialogFormVisible = false;
      },
      /*check选择商品*/
      handleSelectionChange(selection,row){
        // 合并之前已经选中的商品，并去重
        let uniqueMap = new Map();
        this.selectedProducts.forEach((value,index)=>{
          uniqueMap.set(value.id,value);
        });

        let selected; // 记录当前被点击的复选框
        if(row){ // 如果不是全选则检查当前点击的复选框之前是否已经被选中
          selected = uniqueMap.get(row.id);
        }
        let excludeId;
        if(selected){ // 若当前复选框之前已经被选中，则排除掉
          excludeId=selected.id;
        }

       /* if(!row){
          // 若row为undefined,表明这是全选框,则判断selection是否有元素，若有则代表当前点击是要取消全选
          if(selection.length>0){
            selection.forEach(e=>this.$refs.multipleTable.toggleRowSelection(e,false));
          }
        }else{

        }*/

        selection.forEach(e=>uniqueMap.set(e.id,e));
        this.selectedProducts = [];
        uniqueMap.forEach((v,k)=>{
          if(v.id!=excludeId) //若当前复选框之前已经被选中，则排除掉
            this.selectedProducts.push(v);
          else{
            this.$refs.multipleTable.toggleRowSelection(row,false);
          }
        });

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
        //this.listLoaded();
      },
      update() {
//          let content=this.multipleSelection;
        let content=this.selectedProducts;
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
              e['id']=product.id;
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
        this.selectedProducts=[];
        this.dialogFormVisible = false;
      },
//      /*搜索*/
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
      /*删除*/
      deleteId(){
        this.delete_Id;
        let url=bus.host+'/pos/api/inventory/scrap/delete/'+this.delete_Id;
        this.$axios.get(url).then((res)=>{
         this.showDialog = false;
          })
      },
      /*提交*/
      save(rows){
        if(rows.length==0){
          this.$message({message: '请先添加需要报损的商品！', type: 'error'});
          return;
        }
        this.loading=true;
        if(this.validate(rows)) {
          // 输入验证通过，构造提交参数进行提交
          let scrapItems = new Array();
          rows.forEach((e) => {
            let item = {
              product: e.products[0],
              purchasePrice: e.purchasePrice,
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
            this.$message({
              message: '测试',
              type: 'warning'
            });
          });
        }
        this.loading=false;
      },
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
    updated(){
      let selectedMap = new Map();
      this.selectedProducts.forEach(e=>selectedMap.set(e.id,e));
      this.tableData_Load.forEach((row)=>{
        let tmp = selectedMap.get(row.id);
        if(tmp!=null&&tmp!=undefined){
          this.$refs.multipleTable.toggleRowSelection(row,true)
        }
      });
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
</style>
<style scoped lang="scss">
  .dialog_cont{width: 400px;margin: auto}
  .btoom_table{margin-bottom: 15px;}
  .dialog-la{width: 80px;vertical-align:middle;float:left;text-align:right;}
  .dialog-cont{margin-left:90px;  word-wrap: break-word;  }
</style>
