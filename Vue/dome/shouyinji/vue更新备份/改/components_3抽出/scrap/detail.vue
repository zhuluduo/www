<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>出库管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/scrap/list' }">出库列表</el-breadcrumb-item>
          <el-breadcrumb-item>出库明细</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row class="data-table" :gutter="2">
      <el-col :span="7">出库单号：{{this.$route.params.no}}</el-col>
      <el-col :span="4">出库人：{{this.$route.params.user}}</el-col>
      <el-col :span="3">出库数量：{{this.$route.params.quantity}}</el-col>
      <el-col :span="2" class="tool-bar f-fr">
        <el-tooltip class="item" effect="light" content="返回出库管理列表" placement="left" >
          <el-button :plain="true" type="warning" @click="$router.push('/scrap/list')" size="small" icon="arrow-left">返回列表</el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="24"  v-loading="loading">
        <el-table stripe border :data="list" border show-summary :summary-method="detailSummary">
          <el-table-column  prop="base.name" label="商品名称" align="center" width="375"></el-table-column>
          <el-table-column  prop="base.barcode" label="商品条码" width="180" align="center"></el-table-column>
          <el-table-column  prop="base.spec" label="规格" width="100" align="center"></el-table-column>
          <el-table-column  prop="base.pkg" label="单位" width="120" align="center"></el-table-column>
          <el-table-column  prop="base.secondCategory.name" label="分类" width="120" align="center"></el-table-column>
          <el-table-column  prop="purchasePrice" sortable  label="采购价" width="120" align="center">
            <template scope="scope">
              <span class="inventory_color">{{scope.row.product.purchasePrice}}</span>
            </template>
          </el-table-column>
          <el-table-column  prop="quantity" sortable  label="出库数量" width="120" align="center">
            <template scope="scope">
              <span class="inventory_color">{{scope.row.quantity}}</span>
            </template>
          </el-table-column>
          <el-table-column  prop="reason" label="出库原因" align="center" ></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {bus} from '../../bus.js';
  import math from '../../utils/math.js';
  export default{
    data(){
      return {
        detail:{},
        list:[],
        loading:false
      }
    },
    methods: {
      loadDetail(){
        let id=this.$route.params.id;
        let url = bus.host+'/pos/api/inventory/scrap/detail/'+id
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
          this.list = msg;
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
