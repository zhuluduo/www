<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>库存管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/inventory/list' }">商品入库</el-breadcrumb-item>
          <el-breadcrumb-item>编辑入库</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row class="data-table" :gutter="2">
      <el-col :span="2" align="right">入库单号：</el-col>
      <el-col :span="4" align="left">{{detail.no}}</el-col>
      <el-col :span="3" align="right">入库人：</el-col>
      <el-col :span="4" align="left">{{detail.operator}}</el-col>
      <!--<el-col :span="3">入库数量：{{detail.quantity}}</el-col>
      <el-col :span="3">入库金额：{{detail.amount}}</el-col>-->
      <el-col :span="3" align="right">状态：</el-col>
      <el-col :span="8" align="left">
        <el-tag v-if="detail.status===0" type="danger">未确认</el-tag>
        <el-tag v-if="detail.status===1" type="success">已确认</el-tag></el-col>
    </el-row>
    <el-row :gutter="2" style="margin-top:10px;">
      <el-col :span="3">
        <el-badge :value="'已选'+list.length+'个商品'" class="item">
          <el-button type="primary" @click="showProductDialog" icon="plus" size="small">添加商品</el-button>
        </el-badge>
      </el-col>
      <el-col :sm="13" :md="15">
        <el-input placeholder="备注" v-model="remark" size="small"/>
      </el-col>
      <el-col :sm="8" :md="6" class="tool-bar" align="right" style="float:right;">
        <el-tooltip class="item" effect="light" content="返回商品入库列表" placement="left" >
          <el-button :plain="true" type="warning" @click="$router.push('/inventory/list')" size="small" icon="arrow-left">返回列表</el-button>
        </el-tooltip>
        <el-button type="primary" @click="update(list)" size="small" icon="check">保存</el-button>
        <el-button v-if="detail.status===0" type="danger" size="small"
                   @click="confirm(detail.id,detail.no,list)" icon="check">确认入库</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table stripe border :data="list" show-summary :summary-method="listSummary">
          <el-table-column type="index" width="60"/>
          <el-table-column prop="name" label="商品名称"/>
          <el-table-column prop="barcode" label="商品条码" width="170"/>
          <el-table-column prop="expirationDays" label="保质期" width="100"/>
          <el-table-column prop="pkg" label="单位" width="100"/>
          <el-table-column prop="productionDate" label="生产日期" width="130">
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
          <el-table-column label="操作" width="80" align="left">
            <template scope="scope">
              <el-button :plain="true" type="danger" @click="list.splice(scope.$index, 1)" size="small" icon="delete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!--<el-row :gutter="2" style="margin-top:10px;">-->
    <!--<el-col :span="3">-->
    <!--<el-badge :value="'已选'+list.length+'个商品'" class="item">-->
    <!--<el-button type="primary" @click="showProductDialog" icon="plus" size="small">添加商品</el-button>-->
    <!--</el-badge>-->
    <!--</el-col>-->
    <!--<el-col :span="19" class="tool-bar" align="right">-->
    <!--<el-tooltip class="item" effect="light" content="返回商品入库列表" placement="left" >-->
    <!--<el-button :plain="true" type="warning" @click="$router.push('/inventory/list')" size="small" icon="arrow-left">返回列表</el-button>-->
    <!--</el-tooltip>-->
    <!--</el-col>-->
    <!--<el-col :span="1" class="tool-bar" align="right">-->
    <!--<el-button type="primary" @click="update(list)" size="small" icon="check">保存</el-button>-->
    <!--</el-col>-->
    <!--<el-col :span="1" class="tool-bar" align="right">-->
    <!--<el-button v-if="detail.status===0" type="danger" size="small"-->
    <!--@click="confirm(detail.id,detail.no,list)" icon="check">入库</el-button>-->
    <!--</el-col>-->
    <!--</el-row>-->
    <el-dialog title="提示" :visible.sync="showDialog" size="tiny">
      <h3>入库成功！</h3>
      <div>入&emsp;库&emsp;人：{{operator}}</div>
      <div>入库单号：{{no}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="$router.push('list')">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="选择商品" :visible.sync="productDialogVisible">
      <el-row :gutter="10">
        <el-col :span="5" style="border:1px solid rgb(244, 240, 237);padding:3px;">
          <!--<el-row align="center" style="background-color: rgb(106, 92, 72);color:white;"><el-col align="center">已选商品(共{{selectedProducts.length}}个)</el-col></el-row>-->
          <!--<el-row style="height: 550px;overflow: auto;" class="scrollbar">-->
          <!--<p v-for="(product,index) in selectedProducts" style="margin:2px;text-align: right;">-->
          <!--<el-tag :closable="true" type="primary" style="width:100%;" @close="selectedProducts.splice(index,1)">-->
          <!--{{product.name.length>11?product.name.substring(0,11)+'...':product.name}}-->
          <!--</el-tag>-->
          <!--</p>-->
          <!--</el-row>-->
          <el-row  class="scrollbar selectedProducts_tag">
            <el-row align="center" style="background-color: rgb(106, 92, 72);color:white;"><el-col align="center">已选商品(共{{selectedProducts.length}}个)</el-col></el-row>
            <el-table :data="selectedProducts" :show-header="false" style="width: 100%">
              <el-table-column label="" show-overflow-tooltip>
                <template scope="scope" >
                  <el-tag type="primary" >{{scope.row.name}}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label=""  width="25">
                <template scope="scope" >
                  <el-button :plain="true" type="danger" @click="selectedProducts.splice(scope.$index, 1)" size="small" icon="delete"></el-button>
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
              <el-input @keyup.enter.native="loadList" placeholder="扫描或输入商品条码/商品名称" v-model="params.searchWord" size="small"/>
            </el-col>
            <el-col :span="3" align="right">
              <el-button type="primary" @click="loadList" :loading="loading" icon="search" size="small">搜索</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-table stripe border v-loading="loading" element-loading-text="加载中..." :data="products" ref="multipleTable" row-key="id"
                      @selection-change="handleSelectionChange" class="scrollbar" @row-click="toggleSelect" :highlight-current-row="true"
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
        detail:{},
        list: [],
        products:[],
        params:{
          searchWord:'',
        },
        selectedProducts: [],
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
        remark:'',
        no:'',
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

          this.products=data.msg.content;
          this.page.total =data.msg.totalElements;
          this.loading = false;
        }, (res) => {
          this.$notify.error({
            title: '错误',
            message: '这是一条错误的提示消息'
          });
        });
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
      toggleSelect(row, event, column){
        if(row.id==='DEFAULTID')return;
        this.$refs.multipleTable.toggleRowSelection(row);
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
      update(rows){
        this.loading=true;
        if (rows.length==0){
          this.$message({
            message: "请选择商品！！！",
            type: 'warning'
          });
          return false;
        };
        if(this.validate(rows)) {
          let params = this.getParams(rows);
          let url = bus.host + '/pos/api/inventory/stockin/update';
          this.$http.post(url, params).then((res) => {
            let data = res.data;
            if (!data.success) {
              this.$message({
                message: data.msg,
                type: 'warning'
              });
              this.loading = false;
              return;
            }
            let self = this;
            this.$message({
              message: '保存成功!',
              type: 'success',
              duration: 500,
              onClose: function () {
                self.$router.push('/inventory/list');
              }
            });
            this.loading = false;
          }, (res) => {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          });
        }
      },
      /*构造参数*/
      getParams(rows){
        if(rows.length==0){
          this.$message({message: '请先添加需要入库的商品！', type: 'error'});
          return;
        }
        this.loading=true;
          // 输入验证通过，构造提交参数进行提交
          let items=new Array();
          rows.forEach((e)=>{
            if(e.productionDate instanceof Date){
              e.productionDate = dateFormat(e.productionDate,'yyyy-MM-dd');
            }
            let item={
              id:e.stockItemId,
              base: {id: e.id},
              productionDate:e.productionDate+' 00:00:00',
              purchasePrice: e.purchasePrice,
              quantity: e.quantity,
              amount: e.amount,
              pkg:e.pkg,
            }
            items.push(item);
          });
          let params={
            id:this.detail.id,
            remark:this.remark,
            stockInItems:items
          };
          return params;
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
        let valid=false;
        try{
          rows.forEach((e)=>{
            if(e.productionDate==''){
              this.$message({message: '生产日期不能为空！', type: 'warning'});
              throw e;
            }
            if(e.purchasePrice==null||e.purchasePrice==''||e.purchasePrice===0) {
              this.$message({message: '采购价不能为空或小于0！', type: 'warning'});
              throw e;
            }
            if(!/^\d+(\.\d+)?$/.test(e.purchasePrice)){
              this.$message({message: '采购价不合法！', type: 'warning'});
              throw e;
            }
            if(e.quantity==null||e.quantity===0||e.quantity=='') {
              this.$message({message: '入库数量不能为空或小于0！', type: 'warning'});
              throw e;
            }
            if(!/^\d+$/.test(e.quantity)) {
              this.$message({message: '入库数量不合法！', type: 'warning'});
              throw e;
            }
          });
          valid=true;
        }catch(e){
          valid=false;
        }
        return valid;
      },

      handleSelectionChange(arr) {
        this.selectedProducts=arr;
      },
//      toggleSelect(row, event, column){
//        this.$refs.multipleTable.toggleRowSelection(row);
//      },
      showProductDialog(){
        this.loadCategory(0); // 加载商品分类
        this.loadList(); // 加载商品列表
        this.productDialogVisible=true;
        if(this.$refs.multipleTable){
          this.$refs.multipleTable.clearSelection();
        }
      },
      // 在选择商品弹窗中点击确认
      dialogConfirm(){
        // 把选择的商品添加到列表中并去重
        let idToProductMap = new Map();
        this.list.forEach(e=>idToProductMap.set(e.id,e));
        this.selectedProducts.forEach(e=>{
          if(!idToProductMap.get(e.id)){
            this.list.push(e);
          }
        });
        this.$message({
          message: '商品添加成功！！！',
          type: 'success'
        });
        this.loading = false;
        this.productDialogVisible=false;
      },
      // 确认入库
      confirm(stockInId,stockNo,rows){
        this.loading=true;
        let params = this.getParams(rows);
        if(params==undefined||params==null){
          return;
        }
        this.$confirm('确认对单号为['+stockNo+']的入库单进行入库吗？')
          .then(_=>{
            let url = bus.host + '/pos/api/inventory/stockin/update'
            this.$http.post(url, params).then((res) => {
              let data=res.data;
              if(!data.success){
                this.$message({
                  message: data.msg,
                  type: 'warning'
                });
                this.loading=false;
                return;
              }

              this.$http.put(bus.host+'/pos/api/inventory/stockin/confirm/'+stockInId).then(res=>{
                let data=res.data;
                if(!data.success){
                  this.$message({
                    message: data.msg,
                    type: 'warning'
                  });
                  this.loading=false;
                  return;
                }
                // 确认入库
                let self =this;
                this.$message({
                  message: '入库成功!',
                  type: 'success',
                  duration:500,
                  onClose:function(){
                    self.$router.push('/inventory/list');
                  }
                });
              }, (res) => {
                this.$message({
                  message: res.data.msg,
                  type: 'warning'
                });
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
    },
    mounted(){
      let id=this.$route.params.id;
      this.$axios.get(bus.host+'/pos/api/inventory/stockin/detail/'+id).then((res) => {
        let data = res.data;
        if(!data.success){
          this.$notify.error({
            title: '错误',
            message: data.msg
          });
        }
        let content=data.msg;
        this.detail=content;
        this.list=content.stockInItems;
        this.list.forEach(e=>{
          e.stockItemId=e.id;
          e.id=e.base.id;
          e.no=e.base.no;
          e.barcode=e.base.barcode;
          e.name=e.base.name;
          e.expirationDays=e.base.expirationDays;
          e.pkg=e.base.pkg;
        });
        this.remark=content.remark;
        this.loading = false;
      }, (res) => {
        this.$notify.error({
          title: '错误',
          message: '这是一条错误的提示消息'
        });
      });
    }
  }
</script>
<style>
  .breadcrumb-border{border-bottom:1px solid #efefef;margin-bottom:10px;}
  .el-breadcrumb{padding:5px 0px;}
  .el-pagination{padding: 10px 0px;}
  .el-table{margin-top:10px;}
  .tool-bar{text-align: right;}
  .selectedProducts_tag .el-table tr span{width: 142px;}
</style>

