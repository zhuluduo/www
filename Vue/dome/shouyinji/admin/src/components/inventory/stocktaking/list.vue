<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>库存管理</el-breadcrumb-item>
          <el-breadcrumb-item>盘点记录</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row class="data-table" :gutter="2">
      <el-col :span="3">
        <el-select v-model="storeType" clearable placeholder="店铺类型" size="small" @change="handleChange">
          <el-option v-for="item in Preference_type" :key="item.label" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="storeName" clearable placeholder="店铺名称" size="small">
          <el-option v-for="item in stote" :key="item.name" :label="item.name"
                     :value="item.name"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-date-picker
          v-model="Stocktaking_time"
          type="daterange"
          placeholder="选择日期范围" size="small">
        </el-date-picker>
      </el-col>
      <el-col :span="3">
      </el-col>
      <el-button type="primary" @click="handleFilter" icon="search" size="small"> 搜  索 </el-button>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="24" v-loading="loading">
        <el-table stripe border :data="list" v-loading="loading" element-loading-text="数据加载中" @sort-change="sortList"
                  :default-sort="{prop: 'startTime', order: 'descending'}">
          <el-table-column prop="checkNo" label="盘点批号" align="center"/>
          <el-table-column prop="store.name" label="店铺名称"/>
          <el-table-column label="盘点开始时间" align="center" prop="startTime" sortable="custom">
            <template scope="scope" prop="startTime">
              <span v-if="scope.row.startTime==null">--- ---</span>
              <span v-else>{{scope.row.startTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="盘点结束时间" align="center" prop="endTime" sortable="custom">
            <template scope="scope" prop="endTime">
              <span v-if="scope.row.endTime==null">--- ---</span>
              <span v-else>{{scope.row.endTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="checkStatus" label="状    态" align="center" sortable="custom" width="100">
            <template scope="scope" prop="checkStatus">
              <el-tag v-if="scope.row.checkStatus==1" type="danger">已&nbsp完&nbsp成&nbsp</el-tag>
              <el-tag v-if="scope.row.checkStatus==0" type="success">正在进行</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="缺失商品总数" align="center" sortable="custom">
            <template scope="scope" prop="quantity">
              <span>{{scope.row.quantity}}件</span>
            </template>
          </el-table-column>
          <el-table-column prop="movableQuantity" label="中途变动数量"  >
            <template  scope="scope"  prop="movableQuantity">
              <span v-if="scope.row.movableQuantity != null" >{{scope.row.movableQuantity}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操  作" width="180" align="center">
            <template scope="scope">
              <el-button :plain="true" type="warning"
                         @click="details(scope.row,scope.$index)" size="small" icon="document">详 情

              </el-button>
              <el-button :plain="true" type="primary"
                         @click="export_check(scope.row,scope.$index)" size="small" icon="caret-right">导 出

              </el-button>
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
  import math from '../../../utils/math.js';
  //  import JsBarcode from '../../../utils/JsBarcode.js';
  import {dateFormat} from '../../../utils/date.js';
  export default {
    data() {
      return {
        url: bus.host + '/admin/api/check/list',
        list: [],
        boot: true,
        dateRange: '',
        Preference_type: '',
        listSort: {},
        storeType: '',
        storeName: '',
        stote: '',
        checkNumbering: '',
        Stocktaking_time: '',
        listQuery: {
          pageSize: 15,
          page: 1,
          stratDate: '',
          endDate: '',
          storeType: '',
          storeId: ''
        },
        /*扫码盘点*/
        Inventorynumber: '',
        Inventory_code: 0,

        params: { // 列表查询参数
          checkStatus: ''
        },
        parentChildCategoryMap: [], // 映射
        /*分页*/
        currentPage1: 1,
        total: 1,
        loading: false,
        dialogTableVisible: false,
        pickerOptions: {
          shortcuts: [{
            text: '今 天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime());
              picker.$emit('pick', [start, end]);
            }
          },
            {
              text: '昨 天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 24 * 60 * 60 * 1000);
                end.setTime(end.getTime() - 24 * 60 * 60 * 1000);
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
        return ymd + ' 00:00:00';
      },
      getDateEnd(ymd){
        //console.log(ymd);
        return ymd + ' 23:59:59';
      },
      handleChange(){
        this.stote = null;
        console.log("df "+this.storeType)
        if (this.storeType == null || $.trim(this.storeType) =='' || this.storeType == undefined) {
          this.stote = null;
          this.storeName=null;
          this.listQuery.storeId= null;
          return false;
        }
        this.selStote()
      },
      selStote(){
        let url = bus.host + "/admin/api/store/list?page=" + (this.listQuery.page - 1) + "&size=" + 100000;
        let params = {storeType: this.storeType};
        this.$axios.post(url, params).then((res) => {
          let data = res.data;
          if (data.success == false) {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
            this.loading = false;
            return false;
          }
          let msg = data.msg;
          let content = msg.content;
          this.stote = content;
        })
          .catch((err) => {
          });
      },
      /*分页*/
      handleSizeChange(val) {
        this.listQuery.pagesize = val;
        this.listTable();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.listTable();
      },

      // 处理点击排序
      sortList(sort){
        this.listSort = this.trimSort(sort);
        this.listTable();
      },
      trimSort(sort){
        if (sort.order != null)
          sort.order = sort.order.replace('ending', '');
        return sort;
      },

      /*数据加载与查询*/
      listTable(){
        let pg = "?page=" + (this.listQuery.page - 1) + "&size=" + this.listQuery.pageSize;
        this.loading = true;
        if (this.listSort.order != null) {
          pg += '&sort=' + this.listSort.prop + ',' + this.listSort.order;
        }
        if (this.storeName != null) {
          this.listQuery.storeId = this.storeName;
        }
        if (this.storeType != null) {
          this.listQuery.storeType = this.storeType
        }
        this.$http.post(this.url + pg, this.listQuery, {}).then((res) => {
          let ListTab = res.data.msg.content
          this.list = ListTab;
          this.total = res.data.msg.totalElements;
          this.loading = false;
        }, (res) => {
          this.$message.error(' 错 误 ');
        })
      },
      handleFilter(){
        if (this.Stocktaking_time[0] != null && this.Stocktaking_time[0] != undefined && this.Stocktaking_time[1] != null && this.Stocktaking_time[1] != undefined) {
          let startTime = dateFormat(this.Stocktaking_time[0], 'yyyy-MM-dd ');
          let endTime = dateFormat(this.Stocktaking_time[1], 'yyyy-MM-dd ');
          this.listQuery.stratDate = this.getDateBegin(startTime);
          this.listQuery.endDate = this.getDateEnd(endTime);
        } else {
          this.listQuery.stratDate = '';
          this.listQuery.endDate = '';
        }
        this.listQuery.checkNo = this.checkNumbering;
        this.listTable();
      },
      /*导出盘点*/
      export_check(row){
        let url = bus.host + '/admin/api/check/exceldetail'
        this.listQuery.checkNo = row.checkNo;
        this.listQuery.id = row.id;
        this.loading = true;
        this.$http.post(url, this.listQuery, {}).then((res) => {
          if (res.data.success == false) {
            this.$message.error('导出失败！');
            this.loading = false;
            return false;
          } else {
            this.loading = false;
            this.$notify.success({
              message: '导出成功,正在下载...', duration: 1000, onClose: function () {
                window.location = res.data.msg;
              }
            });
          }
        }, (res) => {
          this.$message.error('错误');
        })
      },

      /*跳转详情*/
      details(row, index){
        this.$router.push({
          path: 'create',
          query: {
            coupheckNo: row.checkNo,
            Status: row.checkStatus,
            Id: row.id,
            img: "http://www.izjjf.cn/" + row.imgUrl
          }
        });
      },
      /*删除*/
      listremov(row, index){
        if (row.checkStatus == 1) {
          this.$message.error("盘点已完成，不能删除");
          return false;
        }

        this.$confirm('删除后盘点数据将会丢失, 是否继续?', ' 提 示 ', {
          confirmButtonText: ' 确 定 ',
          cancelButtonText: ' 取 消 ',
          type: 'warning'
        }).then(() => {
          let id = row.id;
          let url = bus.host + '/admin/api/check/delete';
          this.$http.delete(url + '?id=' + id).then((res) => {
            if (res.data.success == true) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.listTable();
            } else if (res.data.success == false) {
              this.$message.error(res.data.msg);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      breaks_classify() {
        let url = bus.host + '/admin/api/digtaldictionary/detail?type=2'
        this.$http.get(url, {}).then((response) => {
          if (response.data.success == false) {
          } else {
            this.Preference_type = response.data.msg;
          }
        }, (response) => {
          this.$notify.error({
            title: '错误',
            message: '这是一条错误的提示消息'
          });
        });
      },
    },
    mounted() {
      this.breaks_classify();
      this.listTable();
    }
  }
</script>
<style>
  .breadcrumb-border {
    border-bottom: 1px solid #efefef;
    margin-bottom: 10px;
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

  .f-fl {
    float: left;
  }

  .f-fr {
    float: right;
  }

  .f-fwb {
    font-weight: bold;
  }

  .f-tac {
    text-align: center;
  }

  .f-db {
    display: block;
  }

  .f-ib {
    display: inline-block;
    *display: inline;
    *zoom: 1;
  }
</style>
<style scoped lang="scss">
  .check-dialog-siz {
    font-size: 20px;
    color: #000;
  }

  .check-dialog-img {
    margin: 10px auto;
    img {
      width: 180px;
      height: 150px;
      margin: 10px auto 2px;
      display: block;
    }
    span {
      display: block;
    }
  }

  .img_inv {
    position: relative;
    vertical-align: middle;
  }

  .img_inv img {
    width: 250px;
    height: 250px;
    vertical-align: inherit;
    position: relative;
    z-index: 999;
    transition: transform 1s;
    -moz-transition: transform 1s;
    -webkit-transition: transform 1s;
    -o-transition: transform 1s;
  }

  .img_inv img:hover {
    transform: scale(1.7, 1.7);
    cursor: pointer
  }
</style>
