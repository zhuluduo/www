<!-已完成订单组件-->
<template>
  <div>
    <el-row :gutter="2">
      <el-col :span="2">
        <el-select v-model="params.takeoutType" clearable placeholder="外卖平台" size="small">
          <el-option v-for="item in takeoutTypes" :key="item.name" :label="item.name" :value="item.key"/>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-input @keyup.enter.native="search" placeholder="客户电话" v-model="params.recipientPhone" size="small"/>
      </el-col>
      <el-col :span="3">
        <el-input @keyup.enter.native="search" placeholder="客单编号" v-model="params.orderNo" size="small"/>
      </el-col>
      <el-col :span="7">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          placeholder="下单时间"
          :picker-options="pickerOptions"
          size="small">
        </el-date-picker>
        <el-button type="primary" @click="search" icon="search" :loading="loading" size="small">搜索</el-button>
      </el-col>
      <!--<el-col :span="9" class="tool-bar">
        <el-button type="primary" @click="batchCancel" size="small" icon="caret-right" :loading="loading">批量取消</el-button>
      </el-col>-->
    </el-row>
    <el-row>
      <el-col>
        <el-table stripe border :data="list" v-loading="loading" @expand="showItems" @sort-change="sortList" :default-sort = "{prop: 'createTime', order: 'descending'}" show-summary :summary-method="listSummary">
          <el-table-column type="selection" width="50"/>
          <el-table-column type="expand">
            <template scope="props">
              <!--<el-row align="center">
                <el-col span="6">外卖店铺ID：{{props.row.shopId}}</el-col>
                <el-col span="6">收货人：{{props.row.recipientName}}</el-col>
                <el-col span="6">收货人电话：{{props.row.recipientPhone}}</el-col>
                <el-col span="6">外卖店铺ID：{{props.row.shopId}}</el-col>
              </el-row>-->
              <el-table border stripe fit :data="props.row.items" v-loading="itemLoading" show-summary :summary-method="itemSummary">
                <el-table-column
                  :label="'订单明细 【订单编号：'+props.row.orderId+'】【订单状态：'+props.row.statusName+'】【外卖店铺ID：'+props.row.shopId+'】【收货人：'+props.row.recipientName+'】【收货人电话：'+props.row.recipientPhone+'】【收货人地址：'+props.row.address+'】【付款类型：'+props.row.payType+'】【红包：'+-props.row.hongbao+'】【活动费用：'+-props.row.elemePart+'】【备注：'+props.row.remarks+'】'"><!--【取餐类型：'+props.row.pickType+'】-->
                <el-table-column type="index" width="50"/>
                <!--  <el-table-column property="orderId" label="订单编号"/>-->
                  <el-table-column v-if="props.row.takeoutType==0" property="food_name" label="商品名称"/>
                  <el-table-column v-if="props.row.takeoutType==1" property="name" label="商品名称"/>
                  <el-table-column property="quantity" label="商品数量"/>
                  <el-table-column property="price" label="商品单价"/>
                  <el-table-column property="totalPrice" label="商品总价"/>
                  <el-table-column label="商品状态"  property="status">
                    <template scope="scope">
                      <el-tag v-if="scope.row.status==0||scope.row.status==null" type="warning">正常</el-tag>
                      <el-tag v-if="scope.row.status==1" type="primary" style="color:white;" color="#20a0ff">
                        已退
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="takeoutType" label="外卖平台" width="100">
            <template scope="scope">
              <el-tag v-if="scope.row.takeoutType==0" type="warning">{{scope.row.takeoutTypeName}}</el-tag>
              <el-tag v-if="scope.row.takeoutType==1" type="primary" style="color:white;" color="#20a0ff">{{scope.row.takeoutTypeName}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="orderNo" label="客单编号" width="170"/>
          <el-table-column sortable="custom" prop="shopName" label="外卖店铺名称"/>
          <el-table-column sortable="custom" prop="totalPrice" label="订单总价" width="100"/>
          <el-table-column sortable="custom" prop="shippingFee" label="配送费" width="100"/>
          <el-table-column sortable="custom" prop="createTime" label="下单时间" width="150"/>
         <!-- <el-table-column label="操作" width="200" align="center">
            <template scope="scope">
              <el-button :plain="true" type="success" icon="caret-right" size="small">呼叫配送</el-button>
              <el-button :plain="true" type="danger" icon="circle-cross" size="small">取消订单</el-button>
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
  import {bus} from '../../../../bus.js';
  import {dateFormat} from '../../../../utils/date.js';
  import math from '../../../../utils/math.js';
  export default{
    data(){
      return {
        itemLoading:false,
        dateRange:[],
        list:[], // 列表数据
        takeoutTypes:[ // 外卖平台类型
          { key: '0', name: '美团外卖' },
          { key: '1', name: '饿了么' },
          { key: '2', name: '百度外卖' }
        ],
        listSort:{},
        params:{ // 列表查询参数
          takeoutType:null, // 外卖平台类型
          recipientPhone:null,// 客户电话
          frontStatus:6, // 已完成订单
          orderNo:'',// 订单编号，模糊查询
          createTimeBegin:null,
          createTimeEnd:null
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
      /*设置数量徽标*/
      setupOrderNum(num){
        this.$emit('completeOrderNum',num);
      },
      /*加载列表数据*/
      loadList() {
        let url=bus.host+'/pos/api/takeout/order/list?page='+(this.page.currentPage-1)+'&size='+this.page.size;
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
          this.setupOrderNum(this.page.total);
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
            case 3:
            case 4:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
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
              sums[index] = '--';
              break;
            case 3:
              sums[index] = '--';
              break;

            case 5:
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
      // 批量取消
      batchCancel(){
        this.$confirm('确定对选中的订单进行接单吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '接单成功!'
          });
        }).catch(() => {

        });
      },
      // 加载订单明细
      showItems(row,expanded){
        this.itemLoading=true;
        if(!expanded||row.items.length>0){
          this.itemLoading=false;
          return;
        }
        let url = bus.host+'/pos/api/takeout/order/detail?takeoutType='+row.takeoutType+'&orderId='+row.orderId;
        this.$axios.get(url).then((res) => {
          if(!res.data.success){
            this.$message.error(res.data.msg);
            this.itemLoading=false;
            return;
          }
          row.items = res.data.msg;
          this.itemLoading=false;
        });
      }
    },
    mounted() {
      this.loadList();
    }
  }
</script>

