<template>
  <div class="content-list">
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>统计分析</el-breadcrumb-item>
          <el-breadcrumb-item>ABC类品</el-breadcrumb-item>
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
      <el-col :span="18">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          placeholder="选择日期范围"
          size="small"
          :editable="false"
          :clearable="false"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-button type="primary" @click="search" :loading="loading" icon="search" size="small">查询</el-button>
      </el-col>
      <!--<el-col :span="4" class="tool-bar">
        <el-button type="primary" @click="exportStatistics" size="small" icon="caret-right" :loading="loading">导出统计信息</el-button>
      </el-col>-->
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table v-loading="productALoading" element-loading-text="拼命加载中..." stripe :data="productAList" border @sort-change="sortAList" show-summary :summary-method="productSummary">
          <el-table-column label="A类品（50%）">
            <el-table-column sortable="custom" prop="name" label="商品名称" class-name="saleShop">
              <template scope="scope">
                {{scope.row.name}}
                <el-tag type="danger" v-show="scope.row.newHints !=null">{{scope.row.newHints}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column sortable="custom" prop="barcode" label="商品条码"/>
            <el-table-column sortable="custom" prop="firstCategoryName" label="一级分类" width="100"/>
            <el-table-column sortable="custom" prop="secondCategoryName" label="二级分类" width="110"/>
            <!--<el-table-column sortable="custom" prop="sellingPrice" label="商品售价" width="100"/>-->
            <el-table-column sortable="custom" prop="saleNum" label="销售数量" width="100"/>
            <el-table-column sortable="custom" prop="saleAmount" label="销售金额" width="100"/>
            <!--<el-table-column sortable="custom" prop="purchasePrice" label="销售成本" width="100"/>
            <el-table-column sortable="custom" prop="profit" label="毛利" width="80"/>-->
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="changeProductASize"
          @current-change="changeProductAPage"
          :current-page.sync="productAPage.currentPage"
          :page-size="productAPage.size"
          layout="prev, pager, next, jumper, total"
          :total="productAPage.total">
        </el-pagination>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table v-loading="productBLoading"  element-loading-text="拼命加载中..." stripe :data="productBList" border @sort-change="sortBList" show-summary :summary-method="productSummary">
          <el-table-column label="B类品（40%）">
            <el-table-column sortable="custom" prop="name" label="商品名称" class-name="saleShop">
              <template scope="scope">
                {{scope.row.name}}
                <el-tag type="danger" v-show="scope.row.newHints !=null">{{scope.row.newHints}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column sortable="custom" prop="barcode" label="商品条码"/>
            <el-table-column sortable="custom" prop="firstCategoryName" label="一级分类" width="100"/>
            <el-table-column sortable="custom" prop="secondCategoryName" label="二级分类" width="110"/>
            <!--<el-table-column sortable="custom" prop="sellingPrice" label="商品售价" width="100"/>-->
            <el-table-column sortable="custom" prop="saleNum" label="销售数量" width="100"/>
            <el-table-column sortable="custom" prop="saleAmount" label="销售金额" width="100"/>
            <!--<el-table-column sortable="custom" prop="purchasePrice" label="销售成本" width="100"/>
            <el-table-column sortable="custom" prop="profit" label="毛利" width="80"/>-->
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="changeProductBSize"
          @current-change="changeProductBPage"
          :current-page.sync="productBPage.currentPage"
          :page-size="productBPage.size"
          layout="prev, pager, next, jumper, total"
          :total="productBPage.total">
        </el-pagination>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table v-loading="productCLoading"  element-loading-text="拼命加载中..." stripe :data="productCList" border @sort-change="sortCList" show-summary :summary-method="productSummary">
          <el-table-column label="C类品（10%）">
            <el-table-column sortable="custom" prop="name" label="商品名称" class-name="saleShop">
              <template scope="scope">
                {{scope.row.name}}
                <el-tag type="danger" v-show="scope.row.newHints !=null">{{scope.row.newHints}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column sortable="custom" prop="barcode" label="商品条码"/>
            <el-table-column sortable="custom" prop="firstCategoryName" label="一级分类" width="100"/>
            <el-table-column sortable="custom" prop="secondCategoryName" label="二级分类" width="110"/>
            <!--<el-table-column sortable="custom" prop="sellingPrice" label="商品售价" width="100"/>-->
            <el-table-column sortable="custom" prop="saleNum" label="销售数量" width="100"/>
            <el-table-column sortable="custom" prop="saleAmount" label="销售金额" width="100"/>
            <!--<el-table-column sortable="custom" prop="purchasePrice" label="销售成本" width="100"/>
            <el-table-column sortable="custom" prop="profit" label="毛利" width="80"/>-->
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="changeProductCSize"
          @current-change="changeProductCPage"
          :current-page.sync="productCPage.currentPage"
          :page-size="productCPage.size"
          layout="prev, pager, next, jumper, total"
          :total="productCPage.total">
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
        productALoading:false,
        productAList:[],
        listSortA:{},
        productAPage:{ // 分页信息
          currentPage:1, // 当前页
          size:15, // 每页大小
          total:1, // 总页数
        },
        productBLoading:false,
        productBList:[],
        listSortB:{},
        productBPage:{ // 分页信息
          currentPage:1, // 当前页
          size:15, // 每页大小
          total:1, // 总页数
        },
        productCLoading:false,
        productCList:[],
        listSortC:{},
        productCPage:{ // 分页信息
          currentPage:1, // 当前页
          size:15, // 每页大小
          total:1, // 总页数
        },

        newHints:'',
        loading:false,
        categories:[], // 商品分类
        parentChildCategoryMap:[], // 父分类与子分类列表的映射
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

        dateRadio:'1',
        dateRange:'',
        ymdBegin:null,
        ymdEnd:null,
        pickerOptions: {
          firstDayOfWeek:1,
          shortcuts: [{
            text: '现在时间',
            onClick(picker) {
              const start=new Date();
              const end =new Date();
              picker.$emit('pick',[start, end]);
            }
          },{
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
      sortAList(sort){
        this.listSortA=this.trimSort(sort);
        this.loadProductA();
      },
      sortBList(sort){
        this.listSortB=this.trimSort(sort);
        this.loadProductB();
      },
      sortCList(sort){
        this.listSortC=this.trimSort(sort);
        this.loadProductC();
      },
      /*处理单品分页事件*/
      changeProductASize(val) {
        this.productAPage.size = val;
        this.loadProductA();
      },
      changeProductAPage(val) {
        this.productAPage.currentPage = val;
        this.loadProductA();
      },
      changeProductBSize(val) {
        this.productBPage.size = val;
        this.loadProductB();
      },
      changeProductBPage(val) {
        this.productBPage.currentPage = val;
        this.loadProductB();
      },
      changeProductCSize(val) {
        this.productCPage.size = val;
        this.loadProductC();
      },
      changeProductCPage(val) {
        this.productCPage.currentPage = val;
        this.loadProductC();
      },
      search(){
        if(this.dateRange!=undefined&&this.dateRange[0]!=null&&this.dateRange[0]!=undefined&&this.dateRange[1]!=null&&this.dateRange[1]!=undefined){
          this.ymdBegin=dateFormat(this.dateRange[0],'yyyy-MM-dd hh:mm:ss');
          this.ymdEnd=dateFormat(this.dateRange[1],'yyyy-MM-dd hh:mm:ss');
        }else{
          this.ymdBegin='';
          this.ymdEnd='';
        }
        this.loading=true;
        this.productALoading=true;
        this.productBLoading=true;
        this.productCLoading=true;
        this.loadProduct(['A','B','C'],{currentPage:1,size:15,total:1},{},pages=>{
          if(pages.a==null){
            pages.a={totalElements:0,content:[]};
          }
          this.productAPage.total =pages.a.totalElements;
          this.productAList=pages.a.content;
          this.productALoading=false;
          if(pages.b==null){
            pages.b={totalElements:0,content:[]};
          }
          this.productBPage.total =pages.b.totalElements;
          this.productBList=pages.b.content;
          this.productBLoading=false;
          if(pages.c==null){
            pages.c={totalElements:0,content:[]};
          }
          this.productCPage.total =pages.c.totalElements;
          this.productCList=pages.c.content;
          this.productCLoading=false;
          this.loading=false;
        });
      },
      loadProductA(){
        this.productALoading=true;
        this.loadProduct(['A'],this.productAPage,this.listSortA,pages=>{
          if(pages.a==null){
            pages.a={totalElements:0,content:[]};
          }
          this.productAPage.total =pages.a.totalElements;
          this.productAList=pages.a.content;
          this.productALoading=false;
        });
      },
      loadProductB(){
        this.productBLoading=true;
        this.loadProduct(['B'],this.productBPage,this.listSortB,pages=>{
          if(pages.b==null){
            pages.b={totalElements:0,content:[]};
          }
          this.productBPage.total =pages.b.totalElements;
          this.productBList=pages.b.content;
          this.productBLoading=false;
        });
      },
      loadProductC(){
        this.productCLoading=true;
        this.loadProduct(['C'],this.productCPage,this.listSortC,pages=>{
          if(pages.c==null){
            pages.c={totalElements:0,content:[]};
          }
          this.productCPage.total =pages.c.totalElements;
          this.productCList=pages.c.content;
          this.productCLoading=false;
        });
      },
      loadProduct(types,page,listSort,callback){
        //this.loading=true;
        this.params.ymdBegin=this.ymdBegin;
        this.params.ymdEnd=this.ymdEnd;
        this.params.types=types;
        let url=bus.host+'/pos/api/statistics/abc?page='+(page.currentPage-1);
        if(listSort.order!=null){
            url+='&sort='+listSort.prop+','+listSort.order;
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
          callback(msg);
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

      // 导出销售记录
      exportStatistics(){
        if(this.dateRange!=undefined&&this.dateRange[0]!=null&&this.dateRange[0]!=undefined&&this.dateRange[1]!=null&&this.dateRange[1]!=undefined){
          this.ymdBegin=dateFormat(this.dateRange[0],'yyyy-MM-dd hh:mm:ss');
          this.ymdEnd=dateFormat(this.dateRange[1],'yyyy-MM-dd hh:mm:ss');
        }else{
          this.ymdBegin='';
          this.ymdEnd='';
        }

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
      this.dateRadio='1';

      let date=new Date();
      var lw = new Date(date - 1000 * 60 * 60 * 24 * 30);//最后一个数字30可改，30天的意思
      var lastY = lw.getFullYear();
      var lastM = lw.getMonth();
      var lastD = lw.getDate();
      let startDate=new Date(lastY, (lastM<10 ? "0" + lastM : lastM), (lastD<10 ? "0"+ lastD : lastD), 0, 0, 0);
      this.dateRange=[startDate,this.getEndDate(date)];
      this.ymdBegin=this.getDateBegin(dateFormat(startDate,'yyyy-MM-dd'));
      let ymd=dateFormat(new Date(),'yyyy-MM-dd');
      this.ymdEnd=this.getDateEnd(ymd);
      this.search();
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
