<!--退款订单组件-->
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
      <el-col :span="9" class="tool-bar">
        <el-button type="primary" @click="batchReject" size="small" icon="caret-right" :loading="loading">批量拒绝
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table stripe border :data="list" v-loading="loading" @expand="showItems" @sort-change="sortList"
                  :default-sort="{prop: 'createTime', order: 'descending'}" show-summary :summary-method="listSummary"
                  @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50"/>
          <el-table-column type="expand">
            <template scope="props">
                <el-table border stripe fit :data="props.row.items" v-loading="itemLoading" show-summary
                          :summary-method="itemSummary">
                      <el-table-column
                        :label="'订单明细 【订单编号：'+props.row.orderId+'】【订单状态：'+props.row.statusName+'】【外卖店铺ID：'+props.row.shopId+'】【收货人：'+props.row.recipientName+'】【收货人电话：'+props.row.recipientPhone+'】【收货人地址：'+props.row.address+'】【付款类型：'+props.row.payType+'】【红包：'+-props.row.hongbao+'】【活动费用：'+-props.row.elemePart+'】【取消原因：'+props.row.reason+'】【备注：'+props.row.remarks+'】'">
                        <!--【取餐类型：'+props.row.pickType+'】-->
                        <el-table-column type="index" width="50"/>
                        <!-- <el-table-column property="orderId" label="订单编号"/>-->
                        <el-table-column v-if="props.row.takeoutType==0" property="food_name" label="商品名称"/>
                        <el-table-column v-if="props.row.takeoutType==1" property="name" label="商品名称"/>
                        <el-table-column property="quantity" label="商品数量"/>
                        <el-table-column v-if="props.row.refundType!=null||props.row.refundType!=undefined" property="price" label="商品单价"/>
                        <el-table-column  v-if="props.row.refundType==null||props.row.refundType==undefined||props.row.refundType==''" property="price" label="商品单价"/>
                        <el-table-column   v-if="props.row.refundType==null||props.row.refundType==undefined||props.row.refundType==''"  property="totalPrice" label="商品总价"/>
                        <el-table-column v-if="props.row.refundType!=null||props.row.refundType!=undefined"  label="商品总价">
                          <template scope="scope">
                            {{scope.row.quantity*scope.row.price}}
                          </template>
                        </el-table-column>

                        <el-table-column label="商品状态"  property="status">
                          <template scope="scope">
                            <el-tag v-if="scope.row.status==0||scope.row.status==null" type="warning">正常</el-tag>
                            <el-tag v-if="scope.row.status==1" type="primary" style="color:white;" color="#20a0ff">
                              已退
                            </el-tag>
                          </template>
                        </el-table-column>
                      </el-table-column>

                  <!--<div v-if="props.row.refundType!=null||props.row.refundType!=undefined">
                      <el-table-column
                     :label="'订单明细8888888【订单编号：'+props.row.orderId+'】【订单状态：'+props.row.statusName+'】【外卖店铺ID：'+props.row.shopId+'】【收货人：'+props.row.recipientName+'】【收货人电话：'+props.row.recipientPhone+'】【收货人地址：'+props.row.address+'】【退单类型：'+props.row.refundType+'】【退款总额：'+props.row.totalPrice+'】【退款原因：'+props.row.applyRefundReason+'】'">
                        <el-table-column type="index" width="50"/>
                        <el-table-column property="name" label="商品名称"/>
                        <el-table-column property="quantity" label="商品数量"/>
                        <el-table-column property="price" label="商品单价"/>
                          <el-table-column  label="商品总价">
                            <template scope="scope">
                              {{scope.row.quantity*scope.row.price}}
                            </template>
                          </el-table-column>
                      </el-table-column>
                  </div>-->
                </el-table>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="takeoutType" label="外卖平台" width="100">
            <template scope="scope">
              <el-tag v-if="scope.row.takeoutType==0" type="warning">{{scope.row.takeoutTypeName}}</el-tag>
              <el-tag v-if="scope.row.takeoutType==1" type="primary" style="color:white;" color="#20a0ff">
                {{scope.row.takeoutTypeName}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="orderNo" label="客单编号" width="170"/>
          <el-table-column sortable="custom" prop="shopName" label="外卖店铺名称"/>
          <el-table-column sortable="custom" prop="totalPrice" label="订单总价" width="100"/>
         <!-- <el-table-column sortable="custom" prop="shippingFee" label="配送费" width="100"/>-->
          <el-table-column sortable="custom" prop="createTime" label="下单时间" width="150"/>
          <el-table-column label="操作" width="200" align="center">
            <template scope="scope">
              <el-button :plain="true" type="success" @click="openDefunct(scope.row)" icon="circle-check" size="small">
                处理订单
              </el-button>
              <!--<el-button :plain="true" type="danger" icon="circle-cross" size="small">拒绝退款</el-button>-->
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
    <!-- eleme 退货单-->
    <el-dialog title="处理退款" :visible.sync="cancelOrderDefunct" size="tiny" @close="showpush()" class="dialog_box">
      <el-row :gutter="20">
        <div>
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">订 单 号：</label>
            <div class="dialog-cont">{{data.orderId}}</div>
          </el-col>
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">顾客名称：</label>
            <div class="dialog-cont">{{data.recipientName}}</div>
          </el-col>
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">顾客号码：</label>
            <div class="dialog-cont">{{data.recipientPhone}}</div>
          </el-col>
          <el-col :span="24" class="btoom_table">
            <el-input type="textarea" v-model="remark" placeholder="说点什么吧">
            </el-input>
          </el-col>
        </div>
        <el-col :span="24" class="tool-bar">
          <el-button type="danger" @click="showpush()" icon="close" size="small">取消</el-button>
          <el-button type="info" icon="check" @click="notarize(5)" :loading="submitForm_loading" size="small">同意退款
          </el-button>
          <el-button type="warning" icon="warning" @click="notarize(6)" :loading="submitForm_loading" size="small">
            拒绝退款
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>

</template>
<script>
  import {bus} from '../../../../bus.js';
  import {dateFormat} from '../../../../utils/date.js';
  import math from '../../../../utils/math.js';

  export default {
    data() {
      return {
        selectedItems: [],
        datas: {},// 部分退款数据
        remark: null,
        itemLoading: false,
        dateRange: [],
        data: {},
        cancelOrderDefunct: false,
        submitForm_loading: false,
        list: [], // 列表数据
        takeoutTypes: [ // 外卖平台类型
          {key: '0', name: '美团外卖'},
          {key: '1', name: '饿了么'},
          {key: '2', name: '百度外卖'}
        ],
        listSort: {},
        params: { // 列表查询参数
          takeoutType: null, // 外卖平台类型
          recipientPhone: null,// 客户电话
          frontStatus: 4, // 退款订单
          orderNo: '',// 订单编号，模糊查询
          createTimeBegin: null,
          createTimeEnd: null
        },
        page: { // 分页信息
          currentPage: 1, // 当前页
          size: 15, // 每页大小
          total: 1, // 总页数
        },
        loading: false, // 是否显示加载遮罩层
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
              let date = new Date();
              const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
              const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
              start.setTime(start.getTime());
              picker.$emit('pick', [start, end]);
            }
          },
            {
              text: '昨天',
              onClick(picker) {
                let date = new Date();
                const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
                start.setTime(start.getTime() - 24 * 60 * 60 * 1000);
                end.setTime(end.getTime() - 24 * 60 * 60 * 1000);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一周',
              onClick(picker) {
                let date = new Date();
                const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                let date = new Date();
                const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近三个月',
              onClick(picker) {
                let date = new Date();
                const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
        }
      }

    },
    methods: {
      /* 订单处理*/
      notarize(operation) {
        this.submitForm_loading = true;
        let parem = {};
        if (this.remark==null){
          if(operation==6){
            this.remark = '驳回退款申请'
          }else {
            this.remark = '同意退款'
          }
        }
        parem = {
          takeoutType: this.data.takeoutType, // 外卖平台类型
          operation: operation,// 操作类型代码
          orderId: this.data.orderId, // 订单ID
          remark: this.remark,
          extra: this.remark
        }
        this.$axios.post(bus.host + "/pos/api/takeout/order/dispose", parem).then((res) => {
          let data = res.data;
          if (!data.success) {
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
            this.submitForm_loading = false;
            return;
          }
          if (!data.msg.success) {
            this.$notify.error({
              title: '错误',
              message: data.msg.message
            });
            this.submitForm_loading = false;
            return;
          }
          this.$message({
            message: "操作成功",
            type: 'success'
          });
          this.cancelOrderDefunct = false;
          this.submitForm_loading = false;
          this.dialogLoading = false;
          if (data.msg.success=='success'){
            if (operation==5){
              //this.$emit('cancelOrder').location.reload(true);
              window.location.reload(true);
            }
          }

          this.loadList();
        }).catch((err) => {
          console.log(err);
          this.submitForm_loading = false;
        });
      },
      openDefunct(row) {
        this.data = row;
        this.cancelOrderDefunct = true;
      },
      showpush() {
        this.data = {};
        this.cancelOrderDefunct = false;
      },
      getDateBegin(ymd) {
        //console.log(ymd);
        return ymd + ' 00:00:00';
      },
      getDateEnd(ymd) {
        //console.log(ymd);
        return ymd + ' 23:59:59';
      },
      search() {
        if (this.dateRange[0] != null && this.dateRange[0] != undefined && this.dateRange[1] != null && this.dateRange[1] != undefined) {
          this.params.createTimeBegin = dateFormat(this.dateRange[0], 'yyyy-MM-dd hh:mm:ss');
          this.params.createTimeEnd = dateFormat(this.dateRange[1], 'yyyy-MM-dd hh:mm:ss');
        } else {
          this.params.createTimeBegin = '';
          this.params.createTimeEnd = '';
        }
        this.params.orderNo = $.trim(this.params.orderNo);
        this.loadList();
      },
      /*设置数量徽标*/
      setupOrderNum(num) {
        this.$emit('refundOrderNum', num);
      },
      /*加载列表数据*/
      loadList() {
        let url = bus.host + '/pos/api/takeout/order/list?page=' + (this.page.currentPage - 1) + '&size=' + this.page.size;
        if (this.listSort.order != null) {
          url += '&sort=' + this.listSort.prop + ',' + this.listSort.order;
        }
        this.loading = true;
        this.$axios.post(url, this.params, {}).then((res) => {
          let data = res.data;
          if (!data.success) {
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
          }
          let msg = data.msg;
          this.page.total = msg.totalElements;
          let content = msg.content;
          content.forEach(e => e.items = []);
          this.list = content;
          this.loading = false;
          this.setupOrderNum(this.page.total);
        }).catch((err) => {
            console.log(err);
          });
      },
      trimSort(sort) {
        if (sort.order != null)
          sort.order = sort.order.replace('ending', '');
        return sort;
      },
      // 处理点击排序
      sortList(sort) {
        this.listSort = this.trimSort(sort);
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
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          switch (index) {
            case 0:
              sums[index] = '合计';
              break;
            case 1:
            case 2:
            case 3:
            case 4:
            case 6:
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
                return math.accAdd(prev, curr);
              }, 0);
          }
        });
        return sums;
      },
      itemSummary(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          switch (index) {
            case 0:
              sums[index] = '合计';
              break;
            case 1:
              sums[index] = '--';
              break;
            case 3:
              sums[index] = '--';
              break;
            case 4 :
              const value2 = data.map(item => Number(item[columns[2].property]));
              const value3 = data.map(item => Number(item[columns[3].property]));
              let value=0;
              for (let i =0;i<value2.length;i++){
                value=value+value2[i]*value3[i]
              }
              sums[index] = value;
              break;
            case 5:
              sums[index] = '--';
              break;
            default:
              const values = data.map(item => Number(item[column.property]));
              sums[index] = values.reduce((prev, curr) => {
                return math.accAdd(prev, curr);
              }, 0);
          }
        });
        return sums;
      },
      // 批量拒绝
      batchReject() {
        if (this.selectedItems.length<1||this.selectedItems.length==undefined){
          this.$message({
            type: 'error',
            message: '请选择订单!'
          });
          return;
        }
        this.$confirm('确定拒绝选中的订单吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.selectedItems.forEach(e => {
            this.data = e;
            this.notarize(6);
          });
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '操作失败!'
          });
        });
      },
      handleSelectionChange(val) {
        this.selectedItems = val;
      },
      // 加载订单明细
      showItems(row, expanded) {
        this.itemLoading = true;
        if (!expanded || row.items.length > 0) {
          this.itemLoading = false;
          return;
        }
        if (row.takeoutType == 0) {
          let url = bus.host + '/pos/api/takeout/order/detail?takeoutType=' + row.takeoutType + '&orderId=' + row.orderId;
          this.$axios.get(url).then((res) => {
            if (!res.data.success) {
              this.$message.error(res.data.msg);
              this.itemLoading = false;
              return;
            }
            row.items = res.data.msg;
            this.itemLoading = false;
          });
        } else {
          let parem = {
            takeoutType: row.takeoutType, // 外卖平台类型
            operation: 65,// 操作类型代码
            orderId: row.orderId, // 订单ID
          }
          this.$axios.post(bus.host + "/pos/api/takeout/order/dispose", parem).then((res) => {
            let dataPost = res.data;
            if (!dataPost.success) {
              this.$notify.error({
                title: '错误',
                message: dataPost.msg
              });
              this.itemLoading = false;
              return;
            }
            if (!dataPost.msg.success) {
              this.$notify.error({
                title: '错误',
                message: dataPost.msg.error
              });
              return;
            }
            this.datas = dataPost.msg.orefundOrder;
            row.refundType = null;
            if (this.datas.refundType == 'part') {
              this.datas.refundType = "部分退款"
            } else if(this.datas.refundType =='normal') {
              this.datas.refundType = "全额退单"
            }else {
              this.datas.refundType = null
            }
            row.items = dataPost.msg.orefundOrder.goodsList;
            row.refundType = this.datas.refundType;
            if(this.datas.applyRefundReason!=null ){
              row.reason = this.datas.applyRefundReason
            }else {
              row.reason = "申请退款";
            }
            this.itemLoading = false;
            if (row.refundType == null) {
              let url = bus.host + '/pos/api/takeout/order/detail?takeoutType=' + row.takeoutType + '&orderId=' + row.orderId;
              this.$axios.get(url).then((res) => {
                if (!res.data.success) {
                  this.$message.error(res.data.msg);
                  this.itemLoading = false;
                  return;
                }
                row.items = res.data.msg;
                this.itemLoading = false;
              });
            }
            if (row.reason==undefined ||row.reason==null||row.reason==''){
              row.reason = "申请退款";
            }
          }).catch((err) => {
            console.log(err);
          });
        }
      },
      mounted() {
        this.loadList();
      }
    }
  }
</script>
<style>
  .dialog-la {
    width: 80px;
    vertical-align: middle;
    float: left;
    text-align: right;
  }

  .dialog-cont {
    margin-left: 90px;
    word-wrap: break-word;
  }

</style>
<style scoped>
  .dialog-la {
    width: 80px !important;
  }
</style>
