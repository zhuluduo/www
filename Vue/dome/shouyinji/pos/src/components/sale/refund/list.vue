<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>销售管理</el-breadcrumb-item>
          <el-breadcrumb-item>销售退货</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <!--<el-col :span="3">-->
        <!--<el-select v-model="params.payTypeCode" clearable placeholder="支付方式" size="small">-->
          <!--<el-option v-for="item in payTypeArr" :key="item.name" :label="item.name" :value="item.key"/>-->
        <!--</el-select>-->
      <!--</el-col>-->
      <!--<el-col :span="3">-->
        <!--<el-select v-model="params.payStatus" clearable placeholder="支付状态" size="small">-->
          <!--<el-option v-for="item in payStatusArr" :key="item.name" :label="item.name" :value="item.key"/>-->
        <!--</el-select>-->
      <!--</el-col>-->
      <el-col :span="3">
        <el-select clearable class="filter-item" v-model="params.updateByName" placeholder="收银员" size="small">
          <el-option v-for="item in cashiers" :key="item.username" :label="item.username" :value="item.username">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-input @keyup.enter.native="search" placeholder="退货单号或订单号" v-model="params.orderNo" size="small"/>
      </el-col>
      <el-col :span="9">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          placeholder="退货时间"
          :picker-options="pickerOptions"
          size="small">
        </el-date-picker>
        <el-button type="primary" @click="search" icon="search" :loading="loading" size="small">搜索</el-button>
      </el-col>
      <el-col :span="8" class="tool-bar">
        <el-button type="primary" @click="exportRefund" size="small" icon="caret-right" :loading="loading">导出退货记录</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table stripe border :data="list" v-loading="loading" @expand="showItems" @sort-change="sortList" :default-sort = "{prop: 'createTime', order:'descending'}" show-summary :summary-method="listSummary">
          <el-table-column type="expand">
            <template scope="props">

              <el-row align="center" class="zjjf-row">
                <el-col span="6">退货单号:{{ props.row.orderNo }}</el-col>
                <el-col span="6">退货时间:{{ props.row.createTime }}</el-col>
                <el-col span="6">收银员:{{ props.row.updateByName }}</el-col>
                <el-col span="6">商品件数:{{ props.row.quantity }}</el-col>
              </el-row>
              <el-row align="center" class="zjjf-row">
                <el-col span="6">退货金额:￥{{ props.row.orderAmount }}</el-col>
                <el-col span="6">实退金额:￥{{ props.row.actualPayAmount }}</el-col>
                <el-col span="6">扣款:￥{{ props.row.rebateAmount }}</el-col>
                <el-col span="6">订单编号:{{ props.row.porderNo }}</el-col>
              </el-row>
              <el-row align="center" class="zjjf-row">
                <el-col span="24">退款方式:{{ props.row.payTypeCode==0?'现金':props.row.payTypeCode==1?'微信':'支付宝' }}</el-col>
              </el-row>
              <el-table border stripe :data="props.row.items" v-loading="itemLoading" show-summary :summary-method="itemSummary">
                <el-table-column :label="'订单【'+props.row.orderNo+'】明细'">
                  <el-table-column type="index" width="50"/>
                  <el-table-column sortable prop="name" label="商品名称"></el-table-column>
                  <el-table-column sortable prop="brand" label="商品品牌" width="150"></el-table-column>
                  <el-table-column sortable prop="barcode" label="商品条码" width="150"></el-table-column>
                  <el-table-column sortable prop="price" label="商品单价" width="150"></el-table-column>
                  <el-table-column sortable prop="quantity" label="商品数量" width="150"></el-table-column>
                  <el-table-column sortable prop="totalPrice" label="商品总价" width="150"></el-table-column>
                  <el-table-column sortable prop="createTime" label="创建时间" width="200"></el-table-column>
                  <!--<el-table-column sortable prop="profit" label="利润" width="100"></el-table-column>-->
                  <!--<el-table-column sortable prop="cost" label="成本" width="100"></el-table-column>-->
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="orderNo" label="退货单号" width="260"></el-table-column>
          <el-table-column sortable="custom" prop="porderNo" label="订单编号" width="260"></el-table-column>
          <!--<el-table-column sortable="custom" prop="updateByName" label="收银员" width="130"></el-table-column>-->
          <el-table-column sortable="custom" prop="quantity" label="商品件数" ></el-table-column>
          <el-table-column sortable="custom" prop="orderAmount" label="退货金额" ></el-table-column>
          <el-table-column sortable="custom" prop="actualPayAmount" label="实退金额" ></el-table-column>
          <el-table-column sortable="custom" prop="rebateAmount" label="扣款" ></el-table-column>
          <el-table-column sortable="custom" prop="createTime" label="退货时间" width="180"></el-table-column>
          <!--<el-table-column sortable="custom" prop="payTypeCode" label="支付方式" width="130">-->
            <!--<template scope="scope">-->
              <!--<el-tag v-if="scope.row.payTypeCode==0" type="danger">现金</el-tag>-->
              <!--<el-tag v-if="scope.row.payTypeCode==1" type="success">微信</el-tag>-->
              <!--<el-tag v-if="scope.row.payTypeCode==2" type="primary">支付宝</el-tag>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column sortable="custom" prop="payStatus" label="支付状态" width="120">-->
            <!--<template scope="scope">-->
              <!--<el-tag v-if="scope.row.payStatus==0" type="danger">待支付</el-tag>-->
              <!--<el-tag v-if="scope.row.payStatus==1" type="success">已支付</el-tag>-->
            <!--</template>-->
          <!--</el-table-column>-->
          <!--<el-table-column sortable="custom" prop="status" label="订单状态" width="120">-->
            <!--<template scope="scope">-->
              <!--<el-tag v-if="scope.row.status==0" type="danger">待处理</el-tag>-->
              <!--<el-tag v-if="scope.row.status==1" type="success">正常</el-tag>-->
              <!--<el-tag v-if="scope.row.status==2" type="warning">挂单</el-tag>-->
            <!--</template>-->
          <!--</el-table-column>-->
         <!-- <el-table-column label="操作" width="80" align="center">
            <template scope="scope">
              <el-button :plain="true" type="warning" size="small" @click="$router.push({path: 'detail/'+scope.row.orderNo})" icon="document">详情</el-button>
            </template>
          </el-table-column>-->
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
                itemLoading:false,
                dateRange:[],
                cashiers:[], // 收银员
                list:[], // 列表数据
                payTypeArr:[ // 支付方式
                  { key: '0', name: '现  金' },
                  { key: '1', name: '微  信' },
                  { key: '2', name: '支付宝' }
                ],
                listSort:{},
                payStatusArr:[ // 支付状态
                  { key: '0', name: '待支付' },
                  { key: '1', name: '已支付' },
                ],
                params:{ // 列表查询参数
                  payStatus:null, // 支付状态
                  payTypeCode:null, // 支付方式
                  orderNo:'',// 订单编号，模糊查询
                  updateByName:'',
                  tradeType:2, // 单据类型查询，默认是退货单
                  createTimeBegin:null,
                  createTimeEnd:null,
                },
                page:{ // 分页信息
                  currentPage:1, // 当前页
                  size:15, // 每页大小
                  total:1, // 总页数
                },
                loading:false, // 是否显示加载遮罩层
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
                  /*{
                    text: '最近三个月',
                    onClick(picker) {
                      let date=new Date();
                      const start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
                      const end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
                      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                      picker.$emit('pick', [start, end]);
                    }
                  }*/]
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
              this.params.createTimeBegin=dateFormat(this.dateRange[0],'yyyy-MM-dd hh:mm:ss');
              this.params.createTimeEnd=dateFormat(this.dateRange[1],'yyyy-MM-dd hh:mm:ss');
            }else{
              this.params.createTimeBegin='';
              this.params.createTimeEnd='';
            }
            this.params.orderNo=$.trim(this.params.orderNo);
            this.loadList();
          },
            /*加载列表数据*/
            loadList() {
                let url=bus.host+'/pos/api/order/getList?page='+(this.page.currentPage-1)+'&size='+this.page.size;
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
                    content.forEach(e=>e.items=[]);
                    this.list = content;
                    this.loading = false;
                })
                .catch((err)=>{
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
                  case 7:
                  case 8:
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
            itemSummary(param) {
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
                  case 7:
                    sums[index] = '--';
                    break;
                  default:
                    const values = data.map(item => Number(item[column.property]));
                    sums[index] = values.reduce((prev, curr) => {
                      return math.accAdd(prev,curr);
                    }, 0);
                    if (index==5){
                      sums[index] += ' 件';
                    }
                    if(index!=5){
                      sums[index] += ' 元';
                    }
                }
              });
              return sums;
            },
            // 加载订单明细
            showItems(row,expanded){
              console.log(row);
              this.itemLoading=true;
              if(!expanded||row.items.length>0){
                this.itemLoading=false;
                return;
              }

              let url = bus.host+'/pos/api/order/detail?orderId='+row.id;
              this.$axios.get(url).then((res) => {
                if(!res.data.success){
                  this.$message.error(res.data.msg);
                  this.itemLoading=false;
                  return;
                }
                row.items = res.data.msg;
                this.itemLoading=false;
              });
            },
            // 导出退货记录
            exportRefund(){
              if(this.dateRange[0]!=null&&this.dateRange[0]!=undefined&&this.dateRange[1]!=null&&this.dateRange[1]!=undefined){
                this.params.createTimeBegin=dateFormat(this.dateRange[0],'yyyy-MM-dd hh:mm:ss');
                this.params.createTimeEnd=dateFormat(this.dateRange[1],'yyyy-MM-dd hh:mm:ss');
              }else{
                this.params.createTimeBegin='';
                this.params.createTimeEnd='';
              }
              let url=bus.host+'/pos/api/order/export';
              if(this.listSort.order!=null){
                url+='?sort='+this.listSort.prop+','+this.listSort.order;
              }
              this.loading = true;
              this.$axios.post(url,this.params,{}).then(res => {
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
            this.loadList();
            this.$axios.post(bus.host+'/pos/api/account/user/list?page=0&size=1000000',{username:''}).then(res => {
              if(!res.data.success){
                this.$message.error(res.data.msg);
                return;
              }
              this.cashiers=res.data.msg.content;
            });
          }
    }
</script>
<style>
  .breadcrumb-border{border-bottom:1px solid #efefef;margin-bottom:10px;}
  .el-breadcrumb{padding:5px 0px;}
  .el-pagination{padding: 10px 0px;}
  .el-table{margin-top:10px;}
  .data-table-expand {
    font-size: 0;
  }
  .data-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .data-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .zjjf-row{
    padding-left:10px;
    background-color: rgb(246, 243, 238);
    font-weight: bold;
  }
</style>
