<!--异常订单组件-->
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
        <el-button type="primary" @click="batchCancel" size="small" icon="caret-right" :loading="loading">批量取消</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table stripe border :data="list" v-loading="loading"
                  @expand="showItems" @sort-change="sortList"
                  @selection-change="handleSelectionChange"
                  :default-sort = "{prop: 'createTime', order: 'descending'}" show-summary :summary-method="listSummary">
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
                 <!-- <el-table-column property="orderId" label="订单编号"/>-->
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
          <el-table-column label="操作"  align="center">
            <template scope="scope">
              <el-button :plain="true" type="danger" @click="currentRow = scope.row;showCancelDialog=true;" icon="circle-cross" size="small">取消订单</el-button>
              <el-button type="info" size="small" @click="currentRow = scope.row;disposeOrder(13)" :loading="submitForm_loading">商家自配送</el-button>
              <el-button type="warning" size="small" @click="currentRow = scope.row;disposeOrder(14)" :loading="submitForm_loading">不再配送</el-button>
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
    <el-dialog title="取消订单" v-loading="dialogLoading" :visible.sync="showCancelDialog" size="tiny" @close="showCancelDialog=false" class="dialog_box">
      <el-form ref="form" :model="cancelParam" label-width="80px">
        <el-form-item label="原 因：">
          <el-radio-group v-model="cancelParam.businessCode" class="radio_label">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" v-if="currentRow.takeoutType==0"  v-for="item in meituanCancelReason" :key="item.code">
              <el-radio  :label="item.code">{{item.name}}</el-radio>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" v-if="currentRow.takeoutType==1" v-for="item in elemeCancelReason" :key="item.code">
              <el-radio  :label="item.code">{{item.name}}</el-radio>
            </el-col>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备 注：">
          <el-input type="textarea" v-model="cancelParam.extra" placeholder="说点什么吧......"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCancelDialog=false" size="small" icon="close">取消</el-button>
        <el-button type="primary" icon="check" size="small" @click="disposeOrder(1)" :loading="submitForm_loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {bus} from '../../../../bus.js';
  import {dateFormat} from '../../../../utils/date.js';
  import math from '../../../../utils/math.js';
  export default{
    data(){
      return {
        selectedItems: [],
        currentRow:{},
        submitForm_loading:false,
        itemLoading:false,
        dialogLoading: false ,
        showCancelDialog: false,
        meituanCancelReason:[
          {code:'2016',name:'配送员丢餐、少餐、餐洒'},
          {code:'2014',name:'配送员取餐慢'},
          {code:'2015',name:'配送员送餐慢'},
          {code:'2012',name:'联系不上用户'},
          {code:'2010',name:'地址无法配送'},
          {code:'2009',name:'商品已售完'},
          {code:'2008',name:'店铺太忙'},
          {code:'2013',name:'重复订单'},
          {code:'2006',name:'用户要求取消'},
          {code:'2011',name:'店铺已打烊'},
          {code:'2007',name:'其他原因'}
        ],
        elemeCancelReason:[
          {code:'others',name:'其它原因'},
          {code:'fakeOrder',name:'用户信息错误'},
          {code:'contactUserFailed',name:'联系不上用户'},
          {code:'foodSoldOut',name:'商品已经售完'},
          {code:'restaurantClosed',name:'商家已经打烊'},
          {code:'distanceTooFar',name:'超出配送范围'},
          {code:'restaurantTooBusy',name:'商家现在太忙'},
          {code:'forceRejectOrder',name:'用户要求取消'},
          {code:'deliveryFault',name:'暂时无法配送'},
          {code:'notSatisfiedDeliveryRequirement',name:'不满足起送要求'}
        ],
        cancelParam:{
          businessCode:'',
          extra:''
        },
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
          frontStatus:2, // 异常订单
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

      cancelOrder(row) {

        this.currentRow = row;
        this.showCancelDialog=true;
        console.log(this.showCancelDialog)
      },
      /**
       * 处理订单
       * @param operation
       */
      disposeOrder(operation){
        this.dialogLoading=true;
         this.submitForm_loading = true;
        // 设置通用参数
        let params = {
          takeoutType: this.currentRow.takeoutType, // 外卖平台类型
          orderId: this.currentRow.orderId, // 订单ID
          operation: operation,// 操作类型代码
        };
        // 根据操作类型设置额外参数
        switch (operation){
          case 0:
            break;
          case 1:
            // 取消订单
            params.businessCode=this.cancelParam.businessCode; // 美团取消订单代码
            params.extra=this.cancelParam.extra;
            break;
          case 13:
            params.orderId=this.currentRow.orderId;// 催单id
          case 14:
            params.orderId=this.currentRow.orderId; // 催单ID
        }
        this.$axios.post(bus.host + "/pos/api/takeout/order/dispose", params).then((res) => {
          let data = res.data;
          if (!data.success) {
            this.$message({
              type:'error',
              message: data.msg
            });
            this.dialogLoading=false;
            this.submitForm_loading = false;
            return ;
          }
          switch (operation){
            case 1: // 取消订单
            case 13: // 自配送
            case 14: // 不在配送
              this.$message({
                message: data.msg.message,
                type: data.msg.success?'success':'error'
              });
              if (operation==1&&data.msg.success=='success'){
                this.showCancelDialog=false;
              }
              break;
          }
          this.dialogLoading=false;
          if(data.msg.success=='success'){
            if (operation==1||operation==14){
             // this.$emit('cancelOrder').location.reload(true);
              window.location.reload(true);
            }else if (operation==13||operation==14){
              //this.$emit('deliveringOrder').location.reload(true);
              window.location.reload(true);
            }
          }
          this.submitForm_loading = false;
          this.loadList();
        }).catch((err) => {
          console.log(err);
          this.submitForm_loading = false;
        });
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
        this.$emit('exceptionOrderNum',num);
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
        console.log(this.selectedItems.length)
        if (this.selectedItems.length<1||this.selectedItems.length==undefined){
          this.$message({
            type: 'error',
            message: '请选择订单!'
          });
          return;
        }
        this.$confirm('确定对选中的订单进行取消吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.selectedItems.forEach(e => {
            let param = {takeoutType: e.takeoutType, orderId: e.orderId};
            this.currentRow = e;
            if (param.takeoutType==0){
              this.cancelParam.businessCode='2007';
            }else {
              this.cancelParam.businessCode='others';
            }
            this.cancelParam.extra = "店铺取消";
            this.disposeOrder(1);
          });
        }).catch(() => {

        });
      },
      handleSelectionChange(val) {
        this.selectedItems = val;
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

