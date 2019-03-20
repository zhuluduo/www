<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }"> 首 页 </el-breadcrumb-item>
          <el-breadcrumb-item>库存管理</el-breadcrumb-item>
          <el-breadcrumb-item>库存盘点</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <!--<el-row class="data-table" :gutter="2">-->
      <!--<el-col :span="24">-->
        <!--<el-date-picker-->
          <!--v-model="Stocktaking_time"-->
          <!--type="daterange"-->
          <!--placeholder="选择日期范围" size="small">-->
        <!--</el-date-picker>-->
        <!--<el-button type="primary" @click="handleFilter" icon="search" size="small">搜索</el-button>-->
        <!--<el-button type="primary" @click="add_check"  size="small" class="f-fr" icon="plus">新增盘点</el-button>-->
      <!--</el-col>-->
    <!--</el-row>-->

    <el-row class="data-table" :gutter="2">
      <el-col :span="4">
        <el-date-picker
          v-model="Stocktaking_time"
          type="daterange"
          placeholder="选择日期范围" size="small">
        </el-date-picker>
      </el-col>
        <el-button type="primary" @click="handleFilter" icon="search" size="small"> 搜  索 </el-button>
        <el-button type="primary" @click="add_check"  size="small" class="f-fr" icon="plus">新增盘点</el-button>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="24"  v-loading="loading">
        <el-table stripe border :data="list"    >
          <el-table-column  prop="checkNo" label="盘点批号" align="center" ></el-table-column>
          <el-table-column   label="盘点开始时间" align="center" sortable>
            <template scope="scope" >
              <span v-if="scope.row.startTime==null">--- ---</span>
              <span v-else>{{scope.row.startTime}}</span>
            </template>
          </el-table-column>
          <el-table-column   label="盘点结束时间" align="center" sortable>
            <template scope="scope">
              <span v-if="scope.row.endTime==null">--- ---</span>
              <span v-else>{{scope.row.endTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="checkStatus"    label="状    态" align="center" sortable >
            <template scope="scope" >
              <el-tag v-if="scope.row.checkStatus==1" type="danger">已&nbsp完&nbsp成&nbsp</el-tag>
              <el-tag v-if="scope.row.checkStatus==0" type="success">正在进行</el-tag>
            </template>
          </el-table-column>
          <el-table-column  label="缺失商品总数" align="center"  sortable>
            <template scope="scope" >
            <span>{{scope.row.quantity}}件</span>
            </template>
          </el-table-column>
          <el-table-column label="操  作" width="160" align="center">
            <template scope="scope">
              <el-button v-if="scope.row.checkStatus==1" :plain="true" type="warning" @click="details(scope.row,scope.$index)" size="small" icon="document">详 情</el-button>
              <el-button v-if="scope.row.checkStatus==0" :plain="true" type="warning" @click="details(scope.row,scope.$index)" size="small" icon="circle-check">盘 点</el-button>
              <el-button :plain="true" type="danger" @click="listremov(scope.row,scope.$index)" size="small" icon="delete">删 除</el-button>
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
        <el-dialog :visible.sync="dialogTableVisible" :show-close="true"  @close="show()" size="tiny" class="check-dialog">
          <el-row :gutter="30" class="f-tac">
<!--
            <svg id="svgcode"></svg>
-->
            <el-col :span="24"  class="check-dialog-siz">盘点批号：<span class="f-fwb">{{Inventorynumber.checkNo}}</span></el-col>
            <el-col :span="24"><div class="check-dialog-img"><img :src=Inventorynumber.searchWord alt=""><span>（扫码，用手机盘点）</span></div></el-col>
            <el-col :span="24"><el-button type="primary"   @click="start_check">开始盘点</el-button></el-col>
          </el-row>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {bus} from '../../../bus.js';
  import math from '../../../utils/math.js';
//  import JsBarcode from '../../../utils/JsBarcode.js';
  import {dateFormat} from '../../../utils/date.js';
  export default {
    data() {
      return {
        url: bus.host + '/pos/api/check/list',
        list: [],
        dateRange:'',
        Stocktaking_time:'',
        listQuery:{
          pageSize:15,
          page:1,
          stratDate:'',
          endDate:'',
        },
        /*扫码盘点*/
        Inventorynumber:'',
        Inventory_code:0,
        /*分页*/
        currentPage1:1,
        total:1,
        loading: false,
        dialogTableVisible:false,
        pickerOptions: {
          shortcuts: [{
            text: '今 天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime());
              picker.$emit('pick', [start, end]);
            }
          },
            {
              text: '昨 天',
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
      getDateBegin(ymd){
        //console.log(ymd);
        return ymd+' 00:00:00';
      },
      getDateEnd(ymd){
        //console.log(ymd);
        return ymd+' 23:59:59';
      },

      /*分页*/
      handleSizeChange(val) {
        this.listQuery.pagesize = val;
        this.listTable();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.listTable();
      },




      /*数据加载与查询*/
      listTable(){
        let pg = "?page=" + (this.listQuery.page - 1) + "&size=" + this.listQuery.pageSize;
        this.loading=true;
        this.$http.post(this.url+pg,this.listQuery,{}).then((res)=>{
          let ListTab=res.data.msg.content
          this.list=ListTab;
          this.total = res.data.msg.totalElements;
          this.loading=false;
        },(res)=>{
          this.$message.error(' 错 误 ');
        })
      },
      handleFilter(){
        if(this.Stocktaking_time[0] !=null&&this.Stocktaking_time[0] !=undefined&&this.Stocktaking_time[1] !=null&&this.Stocktaking_time[1] !=undefined){
          let startTime = dateFormat(this.Stocktaking_time[0], 'yyyy-MM-dd ');
          let endTime = dateFormat(this.Stocktaking_time[1], 'yyyy-MM-dd ');
          this.listQuery.stratDate=this.getDateBegin(startTime);
          this.listQuery.endDate=this.getDateEnd(endTime);
        }else {
          this.listQuery.stratDate='';
          this.listQuery.endDate='';
        }
        this.listTable();
      },
      /*新增盘点*/
      add_check(){
        let  url=bus.host + '/pos/api/check/create';
        this.$http.get(url).then((res)=>{
          this.Inventorynumber=res.data.msg;
//          $("#svgcode").JsBarcode(res.data.msg.checkNo);
        },(res)=>{
          this.$message.error('盘点批号生成失败');
        })
        this.dialogTableVisible=true;
        this.listTable();

      },

      /*跳转详情*/
      details(row,index){
        this.$router.push({path: 'create', query: {coupheckNo: row.checkNo,Status:row.checkStatus,Id:row.id}});
      },
      /*删除*/
      listremov(row,index){
          if(row.checkStatus==1){
            this.$message.error("盘点已完成，不能删除");
            return false;
          }

        this.$confirm('删除后盘点数据将会丢失, 是否继续?', ' 提 示 ', {
          confirmButtonText: ' 确 定 ',
          cancelButtonText: ' 取 消 ',
          type: 'warning'
        }).then(() => {
        let id=row.id;
        let  url=bus.host + '/pos/api/check/delete';
        this.$http.delete(url+'?id='+id).then((res)=>{
          if(res.data.success==true){
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.listTable();
          }else if(res.data.success==false){
            this.$message.error(res.data.msg);
          }
        })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      /*开始盘点*/
      start_check(){
        this.$router.push({path: 'create', query: {coupheckNo: this.Inventorynumber.checkNo,Inventory:this.Inventory_code,Id:this.Inventorynumber.id}});
      },
      show(){
      }
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
  .f-fl{float:left;}
  .f-fr{float:right;}
  .f-fwb{font-weight:bold;}
  .f-tac{text-align:center;}
  .f-db{display:block;}
  .f-ib{display:inline-block;*display:inline;*zoom:1;}
</style>
<style scoped lang="scss">
  .check-dialog-siz{font-size: 20px;color: #000;}
  .check-dialog-img{
    margin: 10px auto;
          img{
            width: 180px;
            height: 150px;
            margin:10px  auto 2px;
            display: block;
          }
    span{
      display: block;
    }
  }
</style>
