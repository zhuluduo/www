<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>销售管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{path:'/sale/order/list'}">销售订单</el-breadcrumb-item>
          <el-breadcrumb-item>订单详情</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row class="data-table" :gutter="2">
      <el-col :span="24" class="tool-bar">
        <el-tooltip class="item" effect="light" content="返回销售订单列表" placement="left" >
          <el-button :plain="true" type="warning" @click="$router.push('/sale/order/list')" size="small" icon="arrow-left">返回列表</el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row class="form-summary">
      <el-form label-position="left" inline class="info-base">
        <el-form-item label="订单编号">
          <span>{{ detail.orderNo }}</span>
        </el-form-item>
        <el-form-item label="三方交易号">
          <span>{{ detail.tradeNo }}</span>
        </el-form-item>
          <el-form-item label="商品金额">
            <span>{{ detail.goodsAmount }}</span>
          </el-form-item>
          <el-form-item label="优惠金额">
            <span>{{ detail.rebateAmount }}</span>
          </el-form-item>

        <el-form-item label="订单金额">
          <span>{{ detail.orderAmount }}</span>
        </el-form-item>

      <!--  <el-form-item label="找零金额">
          <span>{{ detail.refundAmount }}</span>
        </el-form-item>-->
        <!--<el-form-item label="本单利润">-->
          <!--<span>{{ detail.profit }}</span>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="本单成本">-->
          <!--<span>{{ detail.cost }}</span>-->
        <!--</el-form-item>-->
        <el-form-item label="创建时间">
          <span>{{ detail.createTime }}</span>
        </el-form-item>
        <el-form-item label="支付方式">
          <span>{{ detail.payTypeCode==0?'现金':detail.payTypeCode==1?'微信':'支付宝' }}</span>
        </el-form-item>
        <el-form-item label="支付状态">
          <span>{{ detail.payStatus==0?'待支付':'已支付' }}</span>
        </el-form-item>
        <el-form-item label="订单状态">
          <span>{{ detail.status==0?'待处理':detail.status==1?'正常':'挂单' }}</span>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
      <el-col>
        <el-table stripe border :data="list" v-loading="loading" show-summary :summary-method="detailSummary">
          <el-table-column sortable prop="name" label="商品名称"></el-table-column>
          <el-table-column sortable prop="brand" label="商品品牌" width="150"></el-table-column>
          <el-table-column sortable prop="barcode" label="商品条码" width="150"></el-table-column>
          <el-table-column sortable prop="price" label="商品单价" width="150"></el-table-column>
          <el-table-column sortable prop="totalPrice" label="商品总价" width="150"></el-table-column>
          <el-table-column sortable prop="quantity" label="商品数量" width="150"></el-table-column>
          <el-table-column sortable prop="createTime" label="创建时间" width="200"></el-table-column>
          <!--<el-table-column sortable prop="profit" label="利润" width="100"></el-table-column>-->
          <!--<el-table-column sortable prop="cost" label="成本" width="100"></el-table-column>-->
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
    import {bus} from '../../../bus.js';
    import math from '../../../utils/math.js';
    export default{
      data(){
            return {
                detail:{},
                list:[],// 列表数据
                loading:false, // 是否显示加载遮罩层
            }
        },
        methods: {
          loadDetail() {
                let orderNo=this.$route.params.orderNo;
                this.loading = true;
                this.$axios.get(bus.host+'/pos/api/order/getorderinfobyorderno?orderNo='+orderNo,{}).then((res) => {
                    let data = res.data;
                    if(!data.success){
                      this.$notify.error({
                        title: '错误',
                        message: data.msg
                      });
                    }
                    let msg=data.msg;
                    console.log(msg);
                    this.detail = msg;
                    this.list=msg.detailList;
                    this.loading = false;
                })
                .catch((err)=>{
                  console.log(err);
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
                  case 6:
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
            }
          },
          mounted() {
            this.loadDetail();
          }
    }
</script>
<style>
  .breadcrumb-border{border-bottom:1px solid #efefef;margin-bottom:10px;}
  .el-breadcrumb{padding:5px 0px;}
  .el-pagination{padding: 10px 0px;}
  .el-table{margin-top:10px;}

  .form-summary{
    border: 1px dashed rgb(210, 206, 200);
    padding: 10px;
    margin-top: 10px;
  }

  .info-base {
    font-size: 0;
  }
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
