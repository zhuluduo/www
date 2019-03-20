<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>库存管理</el-breadcrumb-item>
          <el-breadcrumb-item>报损单</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row class="data-table" :gutter="2">
      <el-col :span="24">
          <el-date-picker
            v-model="dateRange_time"
            type="datetimerange"
            :picker-options="pickerOptions"
            placeholder="选择日期范围" size="small">
          </el-date-picker>
        <el-button type="primary" @click="handleFilter" icon="search" size="small">搜索</el-button>
        <el-button type="primary" @click="add_check"  size="small" class="f-fr">新增报损</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="24"  v-loading="loading">
        <el-table :data="list" show-summary :summary-method="listSummary" >
          <el-table-column  prop="no" label="报损单号"></el-table-column>
          <el-table-column  prop="updateTime" label="报损时间" ></el-table-column>
          <el-table-column  prop="quantity" label="损失商品总数" ></el-table-column>
          <el-table-column label="操作" width="120" >
            <template scope="scope">
              <el-button :plain="true" type="danger" @click="details(scope.row,scope.$index)" size="small">详情</el-button>
              <el-button :plain="true" type="danger" @click="listrmove(scope.row,scope.$index)" size="small">删除</el-button>
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
      </el-col>
    </el-row>
  </div>
</template>



<script>
  import {bus} from '../../bus.js';
  import math from '../../utils/math.js';
  import {dateFormat} from '../../utils/date.js';
  export default {
    data() {
      return {
        dateRange_time:'',//日期
        list: [],
        listQuery:{  //分页日期搜索
          stratDate:'',
          endDate:'',
          pageSize:15,
          page:1,
        },
        /*分页*/
        currentPage1:1,
        total:1,
        loading: false,
        pickerOptions: {  //日期格式化
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime());
              picker.$emit('pick', [start, end]);
            }
          },
            {
              text: '昨天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime()-24*60*60*1000);
                end.setTime(end.getTime()-24*60*60*1000);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
        }
      }
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
      /*日期格式化*/
      handleFilter(){
        if(this.dateRange_time[0]!=null&&this.dateRange_time[0]!=undefined&&this.dateRange_time[1]!=null&&this.dateRange_time[1]!=undefined){
          let startYmd=dateFormat(this.dateRange_time[0],'yyyy-MM-dd hh:mm:ss');
          let endYmd=dateFormat(this.dateRange_time[1],'yyyy-MM-dd hh:mm:ss');
          this.listQuery.stratDate=startYmd;
          this.listQuery.endDate=endYmd;
        }else{
          this.listQuery.stratDate='';
          this.listQuery.endDate='';
        }
        this.listTable();
      },
      /*数据加载与查询*/
      listTable(){
        let pg = "?page=" + (this.listQuery.page - 1) + "&size=" + this.listQuery.pageSize;
        let url=bus.host+'/pos/api/inventory/scrap/list'+pg;
        this.loading = true;
        this.$axios.post(url,this.listQuery,{}).then((res) => {
          let data = res.data;
          this.list = data.msg.content;
          this.total=data.msg.totalElements
          this.loading = false;
          if(data.success == false ){
            this.$message({
              message: data.msg,
              type: 'warning'
            });
            this.loading = false;
            return false;
          }
        }).catch((err)=>{
        });
      },
      /*统计商品总和*/
      listSummary(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          switch (index){
            case 0:
              sums[index] = '合计';
              break;
            case 1:
            case 3:
              sums[index] = '----';
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
      /*新增报损*/
      add_check(){
        this.$router.push({path: 'create'});
      },
      /*详情*/
      details(row,index){
        this.$router.push({path: 'detail', query: {couponid: row.id}});
      },
      /*删除报损*/
      listrmove(row,index){
        let id=row.id;
        let url=bus.host+'/pos/api/inventory/scrap/del?id=';
        this.$http.post(url+id).then((res)=>{
          if(res.data.success==true){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
          }else {
            this.$message.error( res.data.msg);
          }
          this.listTable();
        })
      },
    },
    mounted() {
      this.listTable();
    }
  }
</script>
<style>
  .breadcrumb-border{border-bottom:1px solid #efefef;margin-bottom:10px;}

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
  .f-fl{float:left;}
  .f-fr{float:right;}
  .f-fwb{font-weight:bold;}
  .f-tac{text-align:center;}
  .f-db{display:block;}
  .f-ib{display:inline-block;*display:inline;*zoom:1;}
</style>
<style scoped lang="scss">
  .check-dialog-siz{font-size: 20px;color: #000;}
  .breadcrumb-border{border-bottom:1px solid #efefef;margin-bottom:10px;}
  .el-breadcrumb{padding:5px 0px;}
  .el-pagination{padding: 10px 0px;}
  .el-table{margin-top:10px;}
  .tool-bar{text-align: right;}
  .el-date-editor--daterange.el-input{width:100%;}
</style>
