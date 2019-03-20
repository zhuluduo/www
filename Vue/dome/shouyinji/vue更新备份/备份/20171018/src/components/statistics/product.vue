<template>
  <div class="content-list">
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>统计分析</el-breadcrumb-item>
          <el-breadcrumb-item>商品分析</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="3">
        <el-select v-model="params.firstCategoryId" clearable placeholder="一级分类" size="small">
          <el-option v-for="item in categories" :key="item.name" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="params.secondCategoryId" clearable placeholder="二级分类" size="small">
          <el-option v-for="item in subCategories" :key="item.name" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input @keyup.enter.native="loadList" placeholder="扫描或输入商品条码/商品名称" v-model="params.searchWord" size="small"/>
      </el-col>
      <el-col :span="10">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          placeholder="选择日期范围"
          size="small"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-button type="primary" @click="search" :loading="loading" icon="search" size="small">查询</el-button>
      </el-col>
      <el-col :span="4" class="tool-bar">
        <el-button type="primary" @click="exportStatistics" size="small" icon="caret-right" :loading="loading">导出统计信息</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table v-loading="loading" stripe :data="productList" border @sort-change="sortList" :default-sort = "{prop: 'quantity', order: 'descending'}" show-summary :summary-method="productSummary">
          <el-table-column label="单品排行" align="center">
            <el-table-column sortable="custom" prop="name" label="商品名称" />
            <el-table-column sortable="custom" prop="barcode" label="商品条码"/>
            <el-table-column sortable="custom" prop="firstCategoryName" label="一级分类" width="100"/>
            <el-table-column sortable="custom" prop="secondCategoryName" label="二级分类" width="110"/>
            <el-table-column sortable="custom" prop="price" label="商品售价" width="100"/>
            <el-table-column sortable="custom" prop="quantity" label="销售数量" width="100"/>
            <el-table-column sortable="custom" prop="amount" label="销售金额" width="100"/>
            <el-table-column sortable="custom" prop="cost" label="销售成本" width="100"/>
            <el-table-column sortable="custom" prop="profit" label="毛利" width="80"/>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="changeProductSize"
          @current-change="changeProductPage"
          :current-page.sync="productPage.currentPage"
          :page-size="productPage.size"
          layout="prev, pager, next, jumper, total"
          :total="productPage.total">
        </el-pagination>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table v-loading="loading" stripe border :data="categoryList" @sort-change="sortList" :default-sort = "{prop: 'quantity', order: 'descending'}" show-summary :summary-method="categorySummary">
          <el-table-column label="品类排行" align="center">
            <el-table-column sortable="custom" prop="firstCategoryName" label="一级分类"/>
            <el-table-column sortable="custom" prop="secondCategoryName" label="二级分类"/>
            <el-table-column sortable="custom" prop="quantity" label="销售数量" width="120"/>
            <el-table-column sortable="custom" prop="amount" label="销售金额" width="120"/>
            <el-table-column sortable="custom" prop="cost"  label="销售成本" width="120"/>
            <el-table-column sortable="custom" prop="profit" label="毛利" width="120"/>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="changeCategorySize"
          @current-change="changeCategoryPage"
          :current-page.sync="categoryPage.currentPage"
          :page-size="categoryPage.size"
          layout="prev, pager, next, jumper, total"
          :total="categoryPage.total">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {bus} from '../../bus.js';
  import {dateFormat} from '../../utils/date.js';
  import math from '../../utils/math.js'
  export default{
    data(){
      return {
        loading:false,
        productList:[],
        categories:[], // 商品分类
        parentChildCategoryMap:[], // 父分类与子分类列表的映射
        productPage:{ // 分页信息
          currentPage:1, // 当前页
          size:15, // 每页大小
          total:1, // 总页数
        },
        categoryList:[],
        categoryPage:{ // 分页信息
          currentPage:1, // 当前页
          size:15, // 每页大小
          total:1, // 总页数
        },
        params:{ // 列表查询参数
          searchWord:'', // 模糊搜索关键字
          firstCategoryId:'', // 一级分类ID
          secondCategoryId:'', // 二级分类ID
        },
        listSort:{},
        dateRadio:'1',
        dateRange:'',
        ymdBegin:null,
        ymdEnd:null,
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              let date=new Date();
              const start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
              const end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
              start.setTime(start.getTime());
              picker.$emit('pick', [start, end]);
            }
          },
            {
              text: '昨天',
              onClick(picker) {
                let date=new Date();
                const start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
                const end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
                start.setTime(start.getTime()-24*60*60*1000);
                end.setTime(end.getTime()-24*60*60*1000);
                picker.$emit('pick', [start, end]);
              }
            },{
            text: '最近一周',
            onClick(picker) {
              let date=new Date();
              const start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
              const end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              let date=new Date();
              const start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
              const end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              let date=new Date();
              const start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
              const end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    computed: {
      /*选中一级分类，加载二级分类*/
      subCategories() {
        return this.$data.parentChildCategoryMap[this.$data.params.firstCategoryId];
      }
    },
    methods:{

      getDateBegin(ymd){
        //console.log(ymd);
        return ymd+' 00:00:00';
      },
      getStartDate(date){
        return new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
      },
      getEndDate(date){
        return new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
      },
      getDateEnd(ymd){
        //console.log(ymd);
        return ymd+' 23:59:59';
      },
      trimSort(sort){
        if(sort.order!=null)
          sort.order=sort.order.replace('ending','');
        return sort;
      },
      /*根据父ID获取子分类列表*/
      loadParentCategory(parentId) {
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
      // 处理点击排序
      sortList(sort){
        this.listSort=this.trimSort(sort);
        this.loadProduct();
        this.loadCategory();
      },
      /*处理单品分页事件*/
      changeProductSize(val) {
        this.productPage.size = val;
        this.loadProduct();
      },
      changeProductPage(val) {
        this.productPage.currentPage = val;
        this.loadProduct();
      },
      /*处理品类分页事件*/
      changeCategorySize(val) {
        this.categoryPage.size = val;
        this.loadCategory();
      },
      changeCategoryPage(val) {
        this.categoryPage.currentPage = val;
        this.loadCategory();
      },
      search(){
        if(this.dateRange!=undefined&&this.dateRange[0]!=null&&this.dateRange[0]!=undefined&&this.dateRange[1]!=null&&this.dateRange[1]!=undefined){
          this.ymdBegin=dateFormat(this.dateRange[0],'yyyy-MM-dd hh:mm:ss');
          this.ymdEnd=dateFormat(this.dateRange[1],'yyyy-MM-dd hh:mm:ss');
        }else{
          this.ymdBegin='';
          this.ymdEnd='';
        }
        this.loadProduct();
        this.loadCategory();
      },
      loadProduct(){
        this.loading=true;
        this.params.ymdBegin=this.ymdBegin;
        this.params.ymdEnd=this.ymdEnd;
        let url=bus.host+'/pos/api/statistics/product?page='+(this.productPage.currentPage-1);
        if(this.listSort.order!=null){
            url+='&sort='+this.listSort.prop+','+this.listSort.order;
        }
        this.$axios.post(url,this.params).then((res)=>{
          let data = res.data;
          if(!data.success){
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
            this.loading=false;
            return;
          }
          let msg=data.msg;
          this.productPage.total =msg.totalElements;
          this.productList=msg.content;
          this.loading=false;
        });
      },
      loadCategory(){
        this.loading=true;
        this.params.ymdBegin=this.ymdBegin;
        this.params.ymdEnd=this.ymdEnd;
        let url=bus.host+'/pos/api/statistics/category?page='+(this.categoryPage.currentPage-1);
        if(this.listSort.order!=null){
          url+='&sort='+this.listSort.prop+','+this.listSort.order;
        }
        this.$axios.post(url,this.params).then((res)=>{
          let data = res.data;
          if(!data.success){
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
            this.loading=false;
            return;
          }
          let msg=data.msg;
          this.categoryPage.total =msg.totalElements;
          this.categoryList=msg.content;
          this.loading=false;
        });
      },
      productSummary(param) {
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
      categorySummary(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          switch (index){
            case 0:
              sums[index] = '合计';
              break;
            case 1:
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
      // 导出销售记录
      exportStatistics(){
        let url=bus.host+'/pos/api/statistics/export';
        if(this.listSort.order!=null){
          url+='?sort='+this.listSort.prop+','+this.listSort.order;
        }
        this.loading = true;
        this.params.ymdBegin=this.ymdBegin;
        this.params.ymdEnd=this.ymdEnd;
        this.$axios.post(url,this.params).then(res => {
          if(!res.data.success){
            this.$message.error(res.data.msg);
            this.loading=false;
            return;
          }
          this.$notify.success({message:'导出成功,正在下载...',duration:1000,onClose:function () {
            window.location=res.data.msg;
          }});
          this.loading=false;
        });
      }
    },
    mounted() {
      this.loadParentCategory(0);
      // 默认设置时间段为今天
      /*this.dateRadio='1';
      this.setYmdByRadio();*/
      let date=new Date();
      this.dateRange=[this.getStartDate(date),this.getEndDate(date)];
      let ymd=dateFormat(new Date(),'yyyy-MM-dd');
      this.ymdBegin=this.getDateBegin(ymd);
      this.ymdEnd=this.getDateEnd(ymd);
      this.loadProduct();
      this.loadCategory();

    }
  }
</script>
<style>
  .breadcrumb-border{
    border-bottom:1px solid #efefef;
    margin-bottom:10px;
  }
  .el-breadcrumb{padding:5px 0px;}
  .el-pagination{padding: 10px 0px;}
  .el-table{margin-top:10px;}
  .el-date-editor--daterange.el-input{width:100%;}
</style>
