<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>库存管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/inventory/list' }">商品入库</el-breadcrumb-item>
          <el-breadcrumb-item>入库明细</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row class="data-table" :gutter="2" style="font-size: 15px;">
      <el-col :xs="12" :sm="10" :md="8" :lg="5">入库单号：{{detail.no}}</el-col>
      <el-col :xs="12" :sm="10" :md="4" :lg="3">入库人：{{detail.operator}}</el-col>
      <el-col :xs="12" :sm="6" :md="3" :lg="3">入库数量：{{detail.quantity}}</el-col>
      <el-col :xs="12" :sm="6" :md="3" :lg="3">入库金额：{{detail.amount}}</el-col>
      <el-col :xs="12" :sm="6" :md="3" :lg="3">状态：
        <el-tag v-if="detail.status===0" type="danger">未确认</el-tag>
        <el-tag v-if="detail.status===1" type="success">已确认</el-tag>
      </el-col>
      <el-col :span="2">
        <el-select  clearable class="filter-item"   v-model="payStatus" placeholder="请选择结算状态" size="small">
          <el-option v-for="item in options" :key="item.key" :label="item.name" :value="item.key">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="5" class="tool-bar f-fr">
        <el-tooltip class="item" effect="light" content="返回商品入库列表" placement="left" >
          <el-button :plain="true" type="warning" @click="$router.push('/inventory/list')" size="small" icon="arrow-left">返回列表</el-button>
        </el-tooltip>
        <el-button type="danger" size="small"
                   @click="editPayStatus(detail.id)">保存结算状态</el-button>
        <el-button v-if="detail.status===0" type="danger" size="small"
                   @click="confirm(detail.id,detail.no)">确认入库</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="24"  v-loading="loading">
        <el-table stripe border :data="detail.stockInItems" border show-summary :summary-method="detailSummary">
          <el-table-column sortable prop="base.name" label="商品名称"width="250"></el-table-column>
          <el-table-column sortable prop="base.barcode" label="商品条码" ></el-table-column>
          <el-table-column sortable prop="productionDate" label="生产日期" width="150"></el-table-column>
          <el-table-column sortable prop="base.expirationDays" label="保质期" width="120"></el-table-column>
          <el-table-column sortable prop="base.pkg" label="单位" width="120"></el-table-column>
          <el-table-column sortable prop="purchasePrice" label="采购价格" width="120"></el-table-column>
          <el-table-column sortable prop="quantity" label="入库数量" width="120"></el-table-column>
          <el-table-column sortable prop="amount" label="金额小计" width="120"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!--<el-row class="data-table" :gutter="2" style="margin-top:10px;">-->
      <!--<el-col :span="5">入库单号：{{detail.no}}</el-col>-->
      <!--<el-col :span="4">入库人：{{detail.operator}}</el-col>-->
      <!--<el-col :span="3">入库数量：{{detail.quantity}}</el-col>-->
      <!--<el-col :span="3">入库金额：{{detail.amount}}</el-col>-->
      <!--<el-col :span="2">状态：-->
        <!--<el-tag v-if="detail.status===0" type="danger">未确认</el-tag>-->
        <!--<el-tag v-if="detail.status===1" type="success">已确认</el-tag>-->
      <!--</el-col>-->
      <!--<el-col :span="2" class="tool-bar f-fr">-->
        <!--<el-tooltip class="item" effect="light" content="返回商品入库列表" placement="left" >-->
          <!--<el-button :plain="true" type="warning" @click="$router.push('/inventory/list')" size="small" icon="arrow-left">返回列表</el-button>-->
        <!--</el-tooltip>-->
      <!--</el-col>-->
    <!--</el-row>-->
  </div>
</template>
<script>
  import {bus} from '../../bus.js';
  import math from '../../utils/math.js';
  export default{
    data(){
      return {
        payStatus:'',
        options:[ // 结算类型
          { key:1, name: '已结清' },
          { key:0, name: '未结清' }
        ],
        detail:{},
        loading:false
      }
    },
    methods: {
      loadDetail(){
        //url  请求的地址
        this.$http.get(url).then((res)=>{
          //数据请求成功调用res
        }).catch((error)=>{
          //数据请求失败error
        })
        let id=this.$route.params.id;
        let url = bus.host+'/pos/api/inventory/stockin/detail/'+id
        this.loading=true;
        this.$axios.get(url).then((res) => {
          let data = res.data;
          if(!data.success){
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
          }
          let msg=data.msg;
          this.detail = msg;
          this.payStatus= this.detail.payStatus;
          this.loading=false;
        }, (response) => {
          this.$notify.error({
            title: '错误',
            message: '这是一条错误的提示消息'
          });
          this.loading=false;
        });
      },
      detailSummary(param) {
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
      editPayStatus(id){
          if (this.payStatus == null ){
            this.$message({message: '请选择结算状态！', type: 'error'});
            return;
          }
        let url = bus.host+'/pos/api/inventory/stockin/updatepaystatus/'+id+"&"+this.payStatus;
        this.$axios.get(url,{}).then((res) => {
          if(!res.data.success) throw res;
          this.$notify.info({
            title: '提示',
            message: res.data.msg
          });
        }).catch(err=>{
          this.$notify.error({
            title: '错误！',
            message: err.data.msg
          });
        });
      }
    },
    mounted() {
      this.loadDetail();
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
</style>
