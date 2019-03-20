<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
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
        <el-table stripe border :data="list" v-loading="loading" @sort-change="sortList" :default-sort = "{prop: 'createTime', order:'descending'}" show-summary :summary-method="listSummary">
          <el-table-column type="expand">
            <template scope="props">
              <el-form label-position="left" inline class="data-table-expand">
                <el-form-item label="退货单号">
                  <span>{{ props.row.orderNo }}</span>
                </el-form-item>
                <el-form-item label="退货时间">
                  <span>{{ props.row.createTime }}</span>
                </el-form-item>
                <el-form-item label="收银员">
                  <span>{{ props.row.updateByName }}</span>
                </el-form-item>
                <el-form-item label="商品件数">
                  <span>{{ props.row.quantity }}</span>
                </el-form-item>
                <el-form-item label="退货金额">
                  <span>{{ props.row.orderAmount }}</span>
                </el-form-item>
                <el-form-item label="实退金额">
                  <span>{{ props.row.actualPayAmount }}</span>
                </el-form-item>
                <el-form-item label="扣款">
                  <span>{{ props.row.rebateAmount }}</span>
                </el-form-item>
                <!--<el-form-item label="本单成本">-->
                  <!--<span>{{ props.row.cost }}</span>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="创建时间">-->
                  <!--<span>{{ props.row.createTime }}</span>-->
                <!--</el-form-item>-->
                <el-form-item label="退款方式">
                  <span>{{ props.row.payTypeCode==0?'现金':props.row.payTypeCode==1?'微信':'支付宝' }}</span>
                </el-form-item>
                <!--<el-form-item label="支付状态">-->
                  <!--<span>{{ props.row.payStatus==0?'待支付':'已支付' }}</span>-->
                <!--</el-form-item>-->
                <!--<el-form-item label="订单状态">-->
                  <!--<span>{{ props.row.status==0?'待处理':props.row.status==1?'正常':'挂单' }}</span>-->
                <!--</el-form-item>-->
              </el-form>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="orderNo" label="退货单号" width="260"></el-table-column>
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
          <el-table-column label="操作" width="80" align="left">
            <template scope="scope">
              <el-button :plain="true" type="warning" size="small" @click="$router.push({path: 'detail/'+scope.row.orderNo})" icon="document">详情</el-button>
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
                  case 6:
                  case 7:
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
            // 导出退货记录
            exportRefund(){
              let url=bus.host+'/pos/api/order/export';
              if(this.listSort.order!=null){
                url+='?sort='+this.listSort.prop+','+this.listSort.order;
              }
              this.loading = true;
              this.$axios.post(url,this.params,{}).then(res => {
                if(!res.data.success){
                  this.$message.error(res.data.msg);
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
</style>
