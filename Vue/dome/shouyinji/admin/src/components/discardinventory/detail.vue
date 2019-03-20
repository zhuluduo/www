<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>库存管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/discardinventory/list' }">出库记录</el-breadcrumb-item>
          <el-breadcrumb-item>出库详情</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row class="data-table" :gutter="2">
      <el-col :span="4">出库时间：{{ this.parment.createTime }}</el-col>
      <!--<el-col :span="3">出库人：{{this.$route.params.operator}}</el-col>-->
      <el-col :span="3" class="tool-bar f-fr" >
        <el-tooltip class="item" effect="light" content="返回出库单列表" placement="left" >
          <el-button :plain="true" type="warning" @click="$router.push('/discardinventory/list')" size="small">返回列表</el-button>
        </el-tooltip>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="24"  v-loading="loading">
        <el-table :data="list" show-summary :summary-method="listSummary">
          <el-table-column  prop="base.name" label="商品名称"></el-table-column>
          <el-table-column  prop="base.barcode" label="商品条码" width="250"></el-table-column>
          <el-table-column  prop="base.spec" label="规格" width="200"></el-table-column>
          <el-table-column  prop="base.pkg" label="单位" width="120"></el-table-column>
          <el-table-column  prop="base.secondCategory.name" label="分类" width="120"></el-table-column>
          <el-table-column  prop="purchasePrice"   label="采购价" width="120">
            <template scope="scope">
                  <span class="inventory_color">{{scope.row.purchasePrice}}</span>
            </template>
          </el-table-column>
          <el-table-column  prop="quantity"  label="出库数量" width="120">
            <template scope="scope">
              <span class="inventory_color">{{scope.row.quantity}}</span>
            </template>
          </el-table-column>
          <el-table-column  prop="reason" label="出库原因" width="300"></el-table-column>
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
        list:[],
        loading:false,
        parment:{
          createTime:'',
          operator:'',
        }
      }
    },
    methods: {
      loadDetail(){
        if(this.$route.query.couponid){
           let url=bus.host + '/admin/api/inventory/scrap/sel?id='
           let id=this.$route.query.couponid;
          if (id == null) {
            return false;
          }
          this.loading=true;
          this.$http.post(url + id).then((response) => {
          let upcaead = response.data.msg.content;
          this.parment.createTime=upcaead[0].createTime
          this.list=upcaead
          this.loading=false;
          }, (response) => {
            this.$notify.error({
              title: '错误',
              message: '数据加载中'
            });
          });
        }else {
          this.$notify.error({
            title: '错误',
            message: ''
          });
        }
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
              sums[index] = '----';
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
<style scoped lang="scss">
    .inventory_color{color: red;}
</style>
