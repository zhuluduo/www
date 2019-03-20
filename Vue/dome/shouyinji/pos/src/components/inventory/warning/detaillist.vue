<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>库存管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/inventory/warning/list' }">库存预警</el-breadcrumb-item>
          <el-breadcrumb-item>预警订单</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="4">
        <el-input @keyup.enter.native="search" placeholder="商品名称或商品编码" v-model="searchWord" size="small"/>
      </el-col>
      <el-col :span="9">
        <!--<el-date-picker
          v-model="dateRange"
          type="datetimerange"
          placeholder="下单时间"
          :picker-options="pickerOptions"
          size="small">
        </el-date-picker>-->
        <el-button type="primary" @click="search" icon="search" :loading="loading" size="small">搜索</el-button>
      </el-col>
      <el-col :span="11" class="tool-bar">
        <el-button :plain="true" type="warning" @click="$router.push('list')" size="small" icon="arrow-left">返回上层</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table stripe border :data="list" v-loading="loading" element-loading-text="数据加载中" @sort-change="sortList" :default-sort="{prop: 'startTime', order: 'descending'}"
                  >
          <el-table-column  prop="orderId" label="店宝订单号" width="200"/>
          <el-table-column prop="productName" label="商品名称"/>
          <el-table-column prop="barcode" label="商品条码" width="200"/>
          <el-table-column sortable="custom" prop="inventory" label="当前库存" width="100"/>
          <el-table-column sortable="custom" prop="sellingPkg" label="库存单位" width="100"/>
          <el-table-column sortable="custom"  prop="purchaseNum" label="采购量" width="170"/>
          <el-table-column sortable="custom" prop="purchasePkg" label="采购单位" width="170"/>
          <el-table-column sortable="custom" prop="purchasePrice" label="采购价(￥/元)" width="170"/>
          <el-table-column prop="createTime" label="下单时间" width="170"/>
          <el-table-column  label="状态" width="170">
            <template scope="scope">
              <el-tag type="success">已下单</el-tag>
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
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {bus} from '../../../bus.js';
  import {dateFormat} from '../../../utils/date.js';
  import math from '../../../utils/math.js';
  export default{
    data(){
      return {
        dateRange:[],
        searchWord:'',// 模糊查询参数
        list:[], // 列表数据

        listSort:{},
        params:{ // 列表查询参数
          searchWord:null,
          startTime:null,
          endTime:null,
          orderFrom:null
        },
        page:{ // 分页信息
          currentPage:1, // 当前页
          size:15, // 每页大小
          total:1, // 总页数
        },
        loading:false, // 是否显示加载遮罩层
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
            },
            {
              text: '最近一周',
              onClick(picker) {
                let date=new Date();
                const start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
                const end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                let date=new Date();
                const start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
                const end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近三个月',
              onClick(picker) {
                let date=new Date();
                const start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
                const end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
        }
      }

    },
    methods: {
      getDateBegin(ymd){
        //console.log(ymd);
        return ymd+' 00:00:00';
      },
      getDateEnd(ymd){
        //console.log(ymd);
        return ymd+' 23:59:59';
      },
      search(){
        if(this.dateRange[0]!=null&&this.dateRange[0]!=undefined&&this.dateRange[1]!=null&&this.dateRange[1]!=undefined){
          this.params.startTime=dateFormat(this.dateRange[0],'yyyy-MM-dd hh:mm:ss');
          this.params.endTime=dateFormat(this.dateRange[1],'yyyy-MM-dd hh:mm:ss');
        }else{
          this.params.startTime='';
          this.params.endTime='';
        }
        this.params.searchWord=this.searchWord;
        this.loadList();
      },
      /*加载列表数据*/
      loadList() {
        let url=bus.host+'/pos/api/warn/order/list?page='+(this.page.currentPage-1)+'&size='+this.page.size;
        if(this.listSort.order!=null){
          url+='&sort='+this.listSort.prop+','+this.listSort.order;
        }
        this.loading = true;
        this.$axios.post(url,this.params,{}).then((res) => {
          let data = res.data;
          if(!data.success){
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
          }
          let msg=data.msg;
          this.page.total =msg.totalElements;
          let content=msg.content;
          this.list = content;
          this.loading = false;
        })
          .catch((err)=>{
            console.log(err);
          });
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
      // 处理点击排序

      trimSort(sort){
        if (sort.order != null)
          sort.order = sort.order.replace('ending', '');
        return sort;
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
            case 6:
            case 7:
            case 8:
            case 9:
            case 11:
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
    },
    mounted() {
      this.loadList();
    }
  }
</script>
<style>
  .breadcrumb-border{border-bottom:1px solid #efefef;margin-bottom:10px;}
  .data-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
</style>
