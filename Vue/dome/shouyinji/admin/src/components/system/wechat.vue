<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>会员管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="4">
        <el-input @keyup.enter.native="loadList" placeholder="会员手机号或昵称" v-model="params.searchWord" size="small"/>
      </el-col>
      <el-col :span="9">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          placeholder="创建时间"
          :picker-options="pickerOptions"
          size="small">
        </el-date-picker>
        <el-button type="primary" @click="search" icon="search" :loading="loading" size="small">搜索</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="tableData" border v-loading="loading" style="width: 100%">
          <el-table-column prop="telePhone" label="会员手机号" ></el-table-column>
          <el-table-column prop="weChatName" label="用户昵称"></el-table-column>
          <el-table-column prop="createTime" label="注册时间"></el-table-column>
          <el-table-column prop="orderNumber" label="累计订单数" ></el-table-column>
          <el-table-column prop="orderAmount" label="累计订单金额"></el-table-column>
          <el-table-column prop="orderDate" label="最近一次订单时间"></el-table-column>
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
  import {bus} from '../../../src/bus.js';
  import math from '../../../src/utils/math.js';
  import {dateFormat} from '../../../src/utils/date.js';
  export default{
    data(){
      return {
        tableData:[],
        dateRange:[],
        listSort:{},
        params:{
          searchWord:'',
          startDate:'',
          endDate:''
        },
        page: { // 分页信息
          currentPage: 1, // 当前页
          size: 15, // 每页大小
          total: 1, // 总页数
        },
        loading:false,
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
      // 处理点击排序
      sortList(sort){
        this.listSort=this.trimSort(sort);
        this.loadList();
      },
      search(){
        if(this.dateRange[0]!=null&&this.dateRange[0]!=undefined&&this.dateRange[1]!=null&&this.dateRange[1]!=undefined){
          this.params.startDate=dateFormat(this.dateRange[0],'yyyy-MM-dd hh:mm:ss');
          this.params.endDate=dateFormat(this.dateRange[1],'yyyy-MM-dd hh:mm:ss');
        }else{
          this.params.startDate='';
          this.params.endDate='';
        }
        this.params.searchWord=$.trim(this.params.searchWord);
        this.loadList();
      },
      loadList(){
        this.loading = true;
        let url = bus.host +'/admin/api/wechat/user/list?page='+(this.page.currentPage-1)+'&size='+this.page.size;
        if(this.listSort.order!=null){
          url+='&sort='+this.listSort.prop+','+this.listSort.order;
        }
        this.$http.post(url,this.params).then((res)=>{
          let data = res.data;
          if(!data.success){
            this.loading = false;
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
          }
          let msg=data.msg;
          this.page.total =msg.totalElements;
          let content=msg.content;
          this.tableData = content;
          this.loading = false;
        }).catch((res)=>{

        })
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
    },
    mounted() {
      this.loadList();
    }
  }
</script>
<style>

</style>
