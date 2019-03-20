<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>库存管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/inventory/list' }">商品入库</el-breadcrumb-item>
          <el-breadcrumb-item>新增入库</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="3">
        <el-badge :value="'已选'+list.length+'个商品'" class="item">
          <el-button type="primary" @click="showProductDialog" icon="plus" size="small">添加商品</el-button>
        </el-badge>
      </el-col>
      <el-col :span="2">
        <el-select  clearable class="filter-item"   v-model="payStatus" placeholder="请选择结算状态" size="small">
          <el-option v-for="item in options" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="10">
        <el-input placeholder="备注" v-model="remark" size="small"/>
      </el-col>
      <el-col :span="9" class="tool-bar ">
        <el-tooltip class="item badge__content" effect="light" content="返回商品入库列表" placement="left" >
          <el-button :plain="true" type="warning" @click="$router.push('list')" size="small" icon="arrow-left">返回列表</el-button>
        </el-tooltip>
        <el-button type="primary" @click="save(list)" size="small" icon="check">提交入库</el-button>
      </el-col>
    </el-row>
    <el-row>

      <el-col>
        <el-table stripe border :data="list" show-summary :summary-method="listSummary">
          <el-table-column type="index" width="60"/>
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="barcode" label="商品条码" width="200"/>
          <el-table-column prop="expirationDays" label="保质期" width="150"/>
          <el-table-column prop="pkg" label="单位" width="100"/>
          <el-table-column prop="productionDate" label="生产日期" width="150">
            <template scope="scope">
              <el-date-picker
                v-model="scope.row.productionDate"
                type="date" size="mini" style="width:auto;"/>
            </template>
          </el-table-column>
          <el-table-column prop="purchasePrice" label="采购价格" width="120">
            <template scope="scope">
              <el-input v-model="scope.row['products'][0]['purchasePrice']" @change="rowSummary(scope.row)" size="mini"/>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="入库数量" width="120">
            <template scope="scope">
              <el-input v-model="scope.row.quantity" @change="rowSummary(scope.row)" size="mini"/>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="金额小计" width="120"/>
          <el-table-column label="操作" width="120" align="right">
            <template scope="scope">
              <el-button :plain="true" type="danger" @click="list.splice(scope.$index, 1)" size="small" icon="delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-dialog title="选择商品" :visible.sync="productDialogVisible" @close="show()">
      <el-row :gutter="10">
        <el-col :span="5" style="border:1px solid rgb(244, 240, 237);padding:3px;">
          <el-row  class="scrollbar selectedProducts_tag">
            <el-row align="center" style="background-color: rgb(106, 92, 72);color:white;"><el-col align="center">已选商品(共{{selectedProducts.length}}个)</el-col></el-row>
            <el-table :data="selectedProducts" :show-header="false" style="width: 100%">
              <el-table-column label="" show-overflow-tooltip>
                <template scope="scope" >
                  <el-tag type="primary" :class="scope.row.barcode==''?'tagError':''">{{scope.row.name}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label=""  width="25">
                <template scope="scope" >
                  <el-button :plain="true" type="danger" @click="handleClose($event,scope.$index, scope.row)" size="small" icon="delete"></el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-col>
        <el-col :span="19">
          <el-row :gutter="2">
            <el-col :span="6">
              <el-select v-model="params.firstCategoryId" clearable placeholder="一级分类" size="small">
                <el-option v-for="item in categories" :key="item.name" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="params.secondCategoryId" clearable placeholder="二级分类" size="small">
                <el-option v-for="item in subCategories" :key="item.name" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-col>
            <el-col :span="9">
              <el-input @keyup.enter.native="handleFilter" placeholder="扫描或输入商品条码/商品名称" v-model.trim="params.searchWord" size="small" id="searchWordID"/>
            </el-col>
            <el-col :span="3" align="right">
              <el-button type="primary" @click="handleFilter" :loading="loading" icon="search" size="small">搜索</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-table stripe border v-loading="loading" element-loading-text="加载中..." :data="products" ref="multipleTable" row-key="id"
                      @selection-change="handleSelectionChange"  selectionchangeclass="scrollbar" @row-click="toggleSelect" :highlight-current-row="true"
                      @sort-change="sortList" :default-sort = "{prop: 'createTime', order: 'descending'}">
              <el-table-column type="selection" :reserve-selection="true" width="30" :selectable="selectable"/>
              <el-table-column sortable="custom" prop="name" label="商品名称"/>
              <el-table-column sortable="custom" prop="barcode" label="商品条码" />
              <el-table-column sortable="custom" prop="pkg" label="商品单位" width="100"/>
              <el-table-column sortable="custom" prop="firstCategoryName" label="一级分类" width="110"/>
              <el-table-column sortable="custom" prop="categoryName" label="二级分类" width="110">
                <template scope="scope">
                  {{scope.row.secondCategory.name}}
                </template>
              </el-table-column>
              <el-table-column sortable="custom" prop="status" label="上下架状态" width="110">
                <template scope="scope">
                  <span v-show="scope.row['products'][0]['status']==0">下架</span>
                  <span v-show="scope.row['products'][0]['status']==1">上架</span>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
              @size-change="changeSize"
              @current-change="changePage"
              :current-page.sync="page.currentPage"
              :page-size="page.size"
              layout="prev, pager, next, jumper, total"
              :total="page.total">
            </el-pagination>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col align="right">
          <el-button @click="productDialogVisible= false" size="small" icon="close">取 消</el-button>
          <el-button type="primary" @click="dialogConfirm" size="small" icon="check">确 定</el-button>
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

        options:[ // 结算类型
          { key:1, name: '已结清' },
          { key:0, name: '未结清' }
        ],
        list: [],
        products:[],
        del: true,
        params:{
          searchWord:'',
        },
        selectedProducts: [],
        selected:false,
        categories:[], // 商品分类
        parentChildCategoryMap:[], // 父分类与子分类列表的映射

        params:{ // 列表查询参数
          productType:'', // 当前列表取所有已上架商品
          searchWord:'', // 模糊搜索关键字
          firstCategoryId:'', // 一级分类ID
          secondCategoryId:'', // 二级分类ID
        },
        loading: false,
        showDialog:false,
        productDialogVisible:false,
        submitForm_loading:false,
        delete_Id:'',
        remark:'',
        payStatus:null,
        no:'',
        storageID:'',
        operator:'',
        listSort:{},
        page:{ // 分页信息
          currentPage:1, // 当前页
          size:10, // 每页大小
          total:1, // 总页数
        },
      }
    },
    computed: {
      /*选中一级分类，加载二级分类*/
      subCategories() {
        return this.$data.parentChildCategoryMap[this.$data.params.firstCategoryId];
      },
      editSecondCategories() {
        return this.$data.parentChildCategoryMap[this.$data.ruleForm.firstCategoryId];
      },
    },
    methods: {
      selectable(row,index){
        if(row.id==='DEFAULTID'){
          return false;
        }
        return true;
      },
      trimSort(sort){
        if(sort.order!=null)
          sort.order=sort.order.replace('ending','');
        return sort;
      },
      // 处理点击排序
      sortList(sort){
        this.listSort=this.trimSort(sort);
        this.loadList();
      },
      /*处理分页事件*/
      changeSize(val) {
        this.page.size = val;
        this.loadList();
      },
      changePage(val) {
        this.page.currentPage = val;
        this.loadList();
      },
      handleSelectionChange(selection) {
        this.storageID=selection;
        let idValueMap = [];
        selection.forEach(function (e) {
          idValueMap[e.id] = e;
        });
        let valArr = new Array();
        for (let k in idValueMap) {
          valArr.push(idValueMap[k]);
        }
        this.selectedProducts =valArr
      },
      loadList() {
        this.loading = true;
        let url=bus.host+'/pos/api/product/list?page='+(this.page.currentPage-1)+'&size='+this.page.size;
        if(this.listSort.order!=null){
          url+='&sort='+this.listSort.prop+','+this.listSort.order;
        }
        this.$axios.post(url,this.params).then((res) => {
          let data = res.data;
          if(!data.success){
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
            this.loading = false;
            return;
          }
          let content=data.msg.content;
          content.forEach(e=>e['amount']=0);
          content.forEach(function(e){
            e.productionDate='';
          });
          this.products=data.msg.content;
          $("#searchWordID input").focus();
          $("#searchWordID input").select();
          this.page.total =data.msg.totalElements;
          if(this.params.searchWord!=''||this.params.searchWord!=undefined||this.params.searchWord!=null){
            if(this.products.length<=1){
              for(var i=0;i<this.products.length;i++){
                  this.$refs.multipleTable.toggleRowSelection(this.products[i],true);
                if(this.products[i].id==='DEFAULTID'||this.products[i].barcode===''){
                  this.$refs.multipleTable.toggleRowSelection(this.products[i],false);
                }
                  if( this.storageID.length !=this.selectedProducts.length){
                    this.$message({message: '该商品已存在请勿重复添加', type: 'warning'});
                    this.$refs.multipleTable.toggleRowSelection(this.products[i],false);
                  }
                }
              }
          }
          this.loading = false;
        }, (res) => {
          this.$notify.error({
            title: '错误',
            message: '这是一条错误的提示消息'
          });
        });
      },
      handleClose(e,index,row){
        this.selectedProducts.splice(index,1)
        if( this.storageID.length !=this.selectedProducts.length){
          this.$refs.multipleTable.toggleRowSelection(this.storageID[index],false);
        }
      },
      handleFilter(){
          this.loadList();
      },
      /*根据父ID获取子分类列表*/
      loadCategory(parentId) {
        let url = bus.host+'/pos/api/category/list/'+parentId;
        this.$axios.get(url,{}).then((res) => {
          if(!res.data.success) throw res;
          this.categories = res.data.msg;
          // 父分类与子分类映射
          let sub=this.$data.parentChildCategoryMap;
          this.categories.forEach(e=>sub[e.id]=e.subCategories);
        }).catch(err=>{
          this.$notify.error({
            title: '错误！',
            message: err.data.msg
          });
        });
      },
      /*搜索*/
      search(){
        if(this.params.searchWord==''){
          this.$message({
            message: '请输入关键字搜索商品！',
            type: 'warning'
          });
          return;
        }
        this.loadList();
      },
      /*提交入库*/
      save(rows){
        if(rows.length==0){
          this.$message({message: '请先添加需要入库的商品！', type: 'error'});
          return;
        }
        if (this.payStatus == null ){
          this.$message({message: '请选择结算状态！', type: 'error'});
          return;
        }
        this.loading=true;
        if(this.validate(rows)){
          this.del = true;
          // 输入验证通过，构造提交参数进行提交
          let items=new Array();
          rows.forEach((e)=>{
            let item={
              base: {id: e.id},
              productionDate:dateFormat(e.productionDate,'yyyy-MM-dd hh:mm:ss'),
              purchasePrice: e.products[0].purchasePrice,
              quantity: e.quantity,
              amount: e.amount,
              pkg:e.pkg
            }
            items.push(item);
          });
          let params={
            remark:this.remark,
            stockInItems:items,
            payStatus:this.payStatus
          };
          this.$confirm('确认入库吗？')
            .then(_=>{
              params.status=1;
              let url = bus.host + '/pos/api/inventory/stockin/create'
              this.$http.post(url, params).then((res) => {
                let data=res.data;
                if(!data.success){
                  this.$message({
                    message: data.msg,
                    type: 'warning'
                  });
                  return;
                }
                let self = this;
                this.$message({
                  message: '商品入库成功！',
                  type: 'success',
                  duration:1000,
                  onClose:function () {
                    self.$router.push('/inventory/list');
                  }
                });
              }, (res) => {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
              });
            })
            .catch(_ => {});
        }
        this.loading=false;
      },

      deleteId(){
        this.delete_Id;
        let url=bus.host+'/pos/api/inventory/stockin/delete/'+this.delete_Id;
        this.$axios.delete(url).then((res)=>{
          this.del = false;
          this.showDialog = false;
          this.submitForm_loading=false;
        })
        this.del = true;
      },
      rowSummary:function (row) {
        let purchasePrice=row.products[0].purchasePrice==null?0:row.products[0].purchasePrice;
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
            if(e.products[0].purchasePrice==null||e.products[0].purchasePrice==''||e.products[0].purchasePrice==0) {
              this.$message({message: '采购价不能为空或为零！', type: 'warning'});
              throw e;
            }
            if(e.products[0].purchasePrice==0){
              this.$message({message: '采购价不能为0！', type: 'warning'});
              throw e;
            }
            if(!/^\d+(\.\d+)?$/.test(e.products[0].purchasePrice)){
              this.$message({message: '采购价不合法！', type: 'warning'});
              throw e;
            }
            if(e.quantity==null||e.quantity==0||e.quantity=='') {
              this.$message({message: '入库数量不能为空或为零！', type: 'warning'});
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
      },

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
      showProductDialog(){
        this.loadCategory(0); // 加载商品分类
        this.loadList(); // 加载商品列表
        this.productDialogVisible=true;
        this.page.currentPage=1;
//        if(this.$refs.multipleTable){
//          this.$refs.multipleTable.clearSelection();
//        }
      },
      /*dialog页面关闭清除其他属性*/
      show(){
        this.$data.params.firstCategoryId='';
        this.$data.params.secondCategoryId='';
        this.params.searchWord='';
        this.list=='';
        this.$refs.multipleTable.clearSelection();
      },
      // 在选择商品弹窗中点击确认
      dialogConfirm(){

        if(this.selectedProducts==undefined){
          this.$message.error('请选择商品');
          return false;
        }else if(this.selectedProducts.length==0){
          this.$message.error('请选择商品');
          return false;
        }else {
//           把选择的商品添加到列表中并去重
//          let idToProductMap = new Map();
//          this.list.forEach(e=>idToProductMap.set(e.id,e));
//          this.selectedProducts.forEach(e=>{
//            if(!idToProductMap.get(e.id)){
//              this.list.push(e);
//            }
//          });
          let submitConfirm=true;
          this.selectedProducts.forEach((e)=>{
            if(e.barcode===''){
              submitConfirm=false
            }
          })
          if(submitConfirm==true){
            let content = this.selectedProducts
            this.list = content.reduce(function (coll, item) {
              item.productionDate=dateFormat(new Date(),'yyyy-MM-dd');
              coll.push(item);
              return coll;
            }, this.list);
            let idValueMap = [];
            this.list.forEach(function (e) {
              e.productionDate = new Date();
              idValueMap[e.id] = e;
            });
            let valArr = new Array();
            for (let k in idValueMap) {
              valArr.push(idValueMap[k]);
            }
            this.list = valArr;
            this.$message({message: '商品添加成功！', type: 'success'});
            this.loading = false;
            this.productDialogVisible = false;
            this.$data.params.firstCategoryId='';
            this.$data.params.secondCategoryId='';
            this.params.searchWord='';
            this.list=='';
            this.$refs.multipleTable.clearSelection();
          }else {
            this.$message({
              message: '请删除已添加的无码商品',
              type: 'warning'
            });
          }
        }
      },
      /*确认提交*/
      btnsuccess(){
        this.submitForm_loading=true;
        this.$message({message: '数据提交成功', type: 'success',duration:1000});
        setTimeout(() => {this.$router.push('list');},1000)
      },
    }
  }
</script>
<style>
  .breadcrumb-border{border-bottom:1px solid #efefef;margin-bottom:10px;}
  .el-breadcrumb{padding:5px 0px;}
  .el-pagination{padding: 10px 0px;}
  .el-table{margin-top:10px;}
  .tool-bar{text-align: right;}
  .selectedProducts_tag .el-table{border: none;}
  .selectedProducts_tag .el-table .cell{padding: 0 2px;}
  .selectedProducts_tag .el-table th.is-leaf,.selectedProducts_tag .el-table td{border-bottom: none;}
  .selectedProducts_tag .el-table th, .el-table td{height: 30px;}
  .selectedProducts_tag .el-table__body-wrapper{max-height: 430px;overflow-x: hidden;}
  .selectedProducts_tag .el-table tr{position: relative;}
  .selectedProducts_tag .cell button{position:absolute;right:18px;border:none;padding:5px;top:5px;}
  .el-badge sup{z-index: 99}
</style>
<style scoped lang="scss">
  .selectedProducts_tag .el-table tr span {
    width: 140px;
  }
  @media (max-width: 1366px) {
    .selectedProducts_tag .el-table tr span {
      width: 85px !important;
    }
  }
  .dialog_cont{width: 400px;margin: auto}
  .btoom_table{margin-bottom: 15px;}
  .dialog-la{width: 80px;vertical-align:middle;float:left;text-align:right;}
  .dialog-cont{margin-left:90px;  word-wrap: break-word;  }
  .tagError{background-color: #ff4949;color: #fff;}
</style>

