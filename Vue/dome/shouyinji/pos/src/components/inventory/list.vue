<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>库存管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品入库</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="3">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          :picker-options="pickerOptions"
          placeholder="选择日期范围" size="small">
        </el-date-picker>
      </el-col>
      <el-col :span="4">
        <el-input @keyup.enter.native="search" placeholder="入库单号" v-model="params.searchWord" size="small"/>
      </el-col>
      <el-col :span="4">
        <el-input @keyup.enter.native="search" placeholder="商品名称/条码" v-model="params.productSearchWord" size="small"/>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" @click="search" :loading="loading" icon="search" size="small">搜索</el-button>
      </el-col>
      <el-col :span="11" class="tool-bar">
        <el-button type="primary" @click="$router.push('create');" icon="plus" size="small">新增入库</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table stripe border :data="list" v-loading="loading"  element-loading-text="数据加载中" @sort-change="sortList" :default-sort = "{prop: 'createTime', order: 'descending'}" show-summary :summary-method="listSummary">

          <el-table-column type="expand">
            <template scope="props">
              <!--<el-row align="center" class="zjjf-row">
                <el-col span="6">入库单号:{{ props.row.no }}</el-col>
                <el-col span="6">入库人:{{ props.row.operator }}</el-col>
                <el-col span="6">入库数量:{{ props.row.quantity }}</el-col>
                <el-col span="6">入库金额:{{ props.row.amount }}</el-col>
              </el-row>
              <el-row align="center" class="zjjf-row">
                <el-col span="24">入库状态:
                  <el-tag v-if="props.row.status==0" type="danger">未确认</el-tag>
                  <el-tag v-if="props.row.status==1" type="success">已确认</el-tag>
                </el-col>
                <el-col span="24">结算状态:
                  <el-tag v-if="props.row.payStatus==0" type="danger">未结清</el-tag>
                  <el-tag v-if="props.row.payStatus==1" type="success">已结清</el-tag>
                </el-col>
              </el-row>-->
              <el-table border stripe :data="props.row.stockInItems" v-loading="itemLoading" show-summary :summary-method="itemSummary">
                <el-table-column :label="'【'+props.row.no+'】入库明细'">
                  <el-table-column type="index" width="50"/>
                  <el-table-column sortable prop="base.name" label="商品名称"/>
                  <el-table-column sortable prop="base.brand" label="商品品牌" width="150"/>
                  <el-table-column sortable prop="base.barcode" label="商品条码" width="150"/>
                  <el-table-column sortable prop="productionDate" label="生产时间" width="150"/>
                  <el-table-column sortable prop="base.expirationDays" label="保质期" width="150"/>
                  <el-table-column sortable prop="pkg" label="单位" width="150"/>
                  <el-table-column sortable prop="purchasePrice" label="采购价" width="200"/>
                  <el-table-column sortable prop="quantity" label="入库数量" width="200"/>
                  <el-table-column sortable prop="amount" label="金额小计" width="200"/>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>

          <el-table-column sortable="custom" prop="no" label="入库单号"/>
          <el-table-column sortable="custom" prop="operator" label="入库人" width="120"/>
          <el-table-column sortable="custom" prop="quantity" label="入库数量" width="100"/>
          <el-table-column sortable="custom" prop="amount" label="入库金额" width="100"/>
          <el-table-column sortable="custom" prop="createTime" label="入库时间" width="170"/>
          <el-table-column sortable="custom" prop="status" label="入库状态" width="100">
            <template scope="scope">
              <el-tag v-if="scope.row.status==0" type="danger">未确认</el-tag>
              <el-tag v-if="scope.row.status==1" type="success">已确认</el-tag>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="payStatus" label="结算状态" width="100">
            <template scope="scope">
              <el-tag v-if="scope.row.payStatus==0" type="danger">未结清</el-tag>
              <el-tag v-if="scope.row.payStatus==1" type="success">已结清</el-tag>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" show-overflow-tooltip prop="remark" label="备注" width="120"/>
          <el-table-column label="操作" width="260" align="center">
            <template scope="scope">
              <el-button v-if="scope.row.status===0" :plain="true" type="warning" size="small" icon="edit"
                         @click="$router.push({path: '/inventory/edit/'+scope.row.id})">编辑</el-button>
            <!--  <el-button :plain="true" :type="scope.row.payStatus===0?'danger':'success'" size="small" icon="delete" :icon="scope.row.payStatus==0?'close':'check'" @click="changePayStatus(scope.row)">{{scope.row.payStatus==0?'未结算':'已结算'}}</el-button>-->
              <el-button :plain="true" :type="scope.row.payStatus===0?'success':'danger'" size="small" icon="update"  @click="changePayStatus(scope.row)">编辑结算状态</el-button>
              <el-button v-if="scope.row.status===0" :plain="true" type="danger" size="small" icon="delete"
                         @click="deleteStockIn(scope.row.id,scope.row.no)">删除</el-button>
              <!--<el-button v-if="scope.row.status===1" :plain="true" type="success" size="small"
                         @click="$router.push({path: '/inventory/detail/'+scope.row.id})" icon="document" >详情</el-button>-->
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
    import {bus} from '../../bus.js';
    import {dateFormat} from '../../utils/date.js';
    import math from '../../utils/math.js';
    export default{
      data(){
            return {
                itemLoading:false,
                dateRange:'',
                list:[], // 列表数据
                listSort:{},
                params:{ // 列表查询参数
                  searchWord:'', // 模糊搜索关键字
                  createTimeBegin:null,
                  createTimeEnd:null,
                  productSearchWord:null,
                },
                page:{ // 分页信息
                  currentPage:1, // 当前页
                  size:15, // 每页大小
                  total:1, // 总页数
                },
                loading:false, // 是否显示加载遮罩层
                pickerOptions: {
                  firstDayOfWeek:1,
                  shortcuts: [
                    {
                      text: '现在时间',
                      onClick(picker) {
                        const start=new Date();
                        const end =new Date();
                        const index =1;
                        picker.$emit('pick',[start, end]);
                      }
                    },{
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
            getDateBegin(ymd){
              //console.log(ymd);
              return ymd+' 00:00:00';
            },
            getDateEnd(ymd){
              //console.log(ymd);
              return ymd+' 23:59:59';
            },
          getStartDate(date){
            return new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
          },
          getEndDate(date){
            return new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
          },
            search(){
              let start=dateFormat(new Date(),'yyyy-MM-dd hh:mm');
              if(this.dateRange[0]!=null&&this.dateRange[0]!=undefined&&this.dateRange[1]!=null&&this.dateRange[1]!=undefined){
                if(dateFormat(this.dateRange[0],'yyyy-MM-dd hh:mm')===start&&dateFormat(this.dateRange[1],'yyyy-MM-dd hh:mm')===start){
                  this.params.createTimeBegin=dateFormat(this.dateRange[0],'yyyy-MM-dd hh:mm:ss');
                  this.params.createTimeEnd=dateFormat(this.dateRange[1],'yyyy-MM-dd hh:mm:ss');
                }else {
                  let startYmd=dateFormat(this.dateRange[0],'yyyy-MM-dd');
                  let endYmd=dateFormat(this.dateRange[1],'yyyy-MM-dd');
                  this.params.createTimeBegin=this.getDateBegin(startYmd);
                  this.params.createTimeEnd=this.getDateEnd(endYmd);
                }
              }else{
                this.params.createTimeBegin='';
                this.params.createTimeEnd='';
              }
              this.params.searchWord=$.trim(this.params.searchWord);
              this.params.productSearchWord=$.trim(this.params.productSearchWord);
              this.loadList();
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
            /*加载列表数据*/
            loadList() {
                let url=bus.host+'/pos/api/inventory/stockin/list?page='+(this.page.currentPage-1)+'&size='+this.page.size;
                if(this.listSort.order!=null){
                  url+='&sort='+this.listSort.prop+','+this.listSort.order;
                }
                this.loading = true;
                this.$axios.post(url,this.params).then((res) => {
                  let data = res.data;
                  if(!data.success){
                    this.$message({
                      message: data.msg,
                      type: 'warning'
                    });
                    this.loading = false;
                    return false;
                  }
                  let msg=data.msg;
                  this.page.total =msg.totalElements;
                  let content=msg.content;
                  content.forEach(e=>{
                    e.statusStr=e.status===0?'未确认':'已确认';
                    e.payStatusBool=e.payStatus==1?true:false;
                  });
                  this.list = content;
                  this.loading = false;
                })
                .catch((err)=>{
                });
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
                  case 5:
                  case 6:
                  case 7:
                  case 8:
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
                  case 5:
                  case 6:
                  case 7:
                    sums[index] = '--';
                    break;
                  default:
                    const values = data.map(item => Number(item[column.property]));
                    sums[index] = values.reduce((prev, curr) => {
                      return math.accAdd(prev,curr);
                    }, 0);
                    if (index==8){
                      sums[index] += ' 件';
                    }
                    if(index==9){
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

              let url = bus.host+'/pos/api/inventory/stockin/detail/'+row.id;
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
            // 编辑入库单
            edit(stockInId){
              console.log(stockInId);
            },
            changePayStatus(row){
              let proceed=true;
              if(row.status==0){
                this.$confirm('入库单【'+row.no+'】还未确认入库，是否要继续更改其结算状态？','警告！',{
                  confirmButtonText: '继续',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(_=>this.doChangePayStatus(row)).catch(_=>{})
              }
              if(row.status==1){
                this.doChangePayStatus(row);
              }
            },
            doChangePayStatus(row){
              let statusStr=row.payStatus==0?'已结算':'未结算';
              let tips='确定更改结算状态为“'+statusStr+'”吗？'
              this.$confirm(tips,'入库单【'+row.no+'】')
                .then(_=>{
                  this.$axios.post(bus.host+'/pos/api/inventory/stockin/updatepaystatus',{id:row.id,payStatus:row.payStatus==0?1:0}).then((res) => {
                    let data = res.data;
                    if(!data.success){
                      this.$message({
                        message: data.msg,
                        type: 'warning'
                      });
                      this.loading = false;
                      return false;
                    }
                    let self = this;
                    this.$message({
                      message: data.msg,
                      type: 'success',
                      duration:500,
                      onClose:function(){
                        self.loadList();
                      }
                    });
                    this.loading = false;
                  })
                    .catch((err)=>{
                    });
                })
                .catch(_ => {});
            },
            deleteStockIn(stockInId,stockNo){
              this.$confirm('确认删除单号为['+stockNo+']的入库单吗？')
                .then(_=>{
                  this.$axios.delete(bus.host+'/pos/api/inventory/stockin/delete/'+stockInId).then((res) => {
                    let data = res.data;
                    if(!data.success){
                      this.$message({
                        message: data.msg,
                        type: 'warning'
                      });
                      this.loading = false;
                      return false;
                    }
                    let self = this;
                    this.$message({
                      message: data.msg,
                      type: 'success',
                      duration:500,
                      onClose:function(){
                        self.loadList();
                      }
                    });
                    this.loading = false;
                  })
                    .catch((err)=>{
                    });
                })
                .catch(_ => {});
            },
          deleteStockIns(){
            this.$message.error('商品已入库，不能删除');
          },
          },
          mounted() {
            let date=new Date();
            this.dateRange=[this.getStartDate(date),this.getEndDate(date)];
            this.loadList();
          }
    }
</script>
<style>
  .f-fr{float:right;}
  .f-fwb{font-weight:bold;}
  .breadcrumb-border{border-bottom:1px solid #efefef;margin-bottom:10px;}
  .el-breadcrumb{padding:5px 0px;}
  .el-pagination{padding: 10px 0px;}
  .el-table{margin-top:10px;}
  .tool-bar{text-align: right;}
  .el-date-editor--daterange.el-input{width:100%;}
  .zjjf-row{
    padding-left:10px;
    background-color: rgb(246, 243, 238);
    font-weight: bold;
  }
</style>
