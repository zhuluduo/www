<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>库存管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/inventory/warning/list' }">库存预警</el-breadcrumb-item>
          <el-breadcrumb-item>外部采购</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
   <!-- <el-row>
      <el-col  :span="30">
        <el-button type="primary" @click="$router.push('detaillist')" size="small" >已处理商品</el-button>
      </el-col>
    </el-row>-->
    <el-row :gutter="2">
      <el-col :span="24" class="tool-bar">
        <el-button :plain="true" type="warning" @click="$router.push('list')" size="small" icon="arrow-left">返回上层</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table stripe border :data="list" v-loading="loading" element-loading-text="数据加载中"
                  @selection-change="handleSelectionChange">
          <el-table-column type="index" width="50"/>
          <el-table-column prop="productName" label="商品名称"/>
          <el-table-column prop="barcode" label="商品条码" width="200"/>
          <el-table-column  prop="safetyStockNum" label="安全库存" width="100"/>
          <el-table-column  prop="inventory" label="当前库存" width="100"/>
          <el-table-column prop="sellingPkg" label="库存单位" width="100"/>
          <el-table-column prop="purchaseNum" label="建议采购量" width="170">
            <template scope="scope">
              {{scope.row.safetyStockNum*2-scope.row.inventory}}
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="sellingPkg" label="采购单位" width="170"/>
          <el-table-column sortable="custom" prop="purchasePrice" label="采购价(￥/元)" width="170"/>
          <el-table-column  label="货源" width="170">
            <template scope="scope">
              <el-tag type="success">外部采购</el-tag>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage1"
          :page-size="listQuery.pageSize"
          layout="prev, pager, next, jumper, total"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {bus} from '../../../bus.js';
  import {dateFormat} from '../../../utils/date.js';
  import math from '../../../utils/math.js';

  export default {
    data() {
      return {
        dialogFormVisible: false,
        dateRange: null,
        totalprices: null, //价格和
        quantity1: null,  // 采购数量和
        list: [], // 列表数据
        orderProduct: [],
        loading: false, // 是否显示加载遮罩层
        listQuery: {
          pageSize: 15,
          page: 1,
          stratDate: '',
          endDate: '',
          checkNo: '',
          searchWord:''
        },
        total: 1,
        /*分页*/
        currentPage1: 1,
      }

    },

    methods: {
      handleInput(e){
        if (!/^\d+$/.test(e)) {
          this.$message({message: '商品采购数量不合法！', type: 'warning'});
        }
      },
      /*分页*/
      handleSizeChange(val) {
        this.listQuery.pagesize = val;
        this.loadList();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.loadList();
      },


      /*选中列*/
      handleSelectionChange(selection) {
        this.orderProduct = selection;
      },
      /*加载列表数据*/
      loadList() {

        let url = bus.host + '/pos/api/warn/prod/list/'+"2";
         url = url+"?page=" + (this.listQuery.page - 1) + "&size=" + this.listQuery.pageSize;
        this.loading = true;
        this.$axios.post(url, {}).then((res) => {
          let data = res.data;
          if (!data.success) {
            this.$message({
              message: data.msg,
              type: 'warning'
            });

            this.loading = false;
            return false;
          }
          let msg = data.msg;
          let content = msg.content;
          this.total = res.data.msg.totalElements;
          content.forEach(e => e.statusStr = e.status === 0 ? '未确认' : '已确认');
          this.list = content;
          this.loading = false;
        }).catch((err) => {
        });
        this.loading = false;
      },
    },
    mounted() {
      this.loadList();
    }
  }
</script>
<style>

  .breadcrumb-border {
    border-bottom: 1px solid #efefef;
    margin-bottom: 10px;
  }
  .dia-warning{
    font-size: 20px;
    text-align: center;
    font-weight: bold;
  }
</style>
