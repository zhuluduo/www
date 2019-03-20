<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>库存管理</el-breadcrumb-item>
          <el-breadcrumb-item>出库管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row class="data-table" :gutter="2">
      <el-col :span="3">
        <el-select clearable class="filter-item" v-model="searchWord" placeholder="收银员" size="small">
          <el-option v-for="item in cashiers" :key="item.username" :label="item.username" :value="item.username">
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          placeholder="选择日期范围" :picker-options="pickerOptions2" size="small">
        </el-date-picker>
      </el-col>
      <el-col :span="4">
        <el-input @keyup.enter.native="search" placeholder="出库单号" v-model="params.checkNo" size="small"/>
      </el-col>
      <el-button type="primary" @click="search" :loading="loading" icon="search" size="small">搜索</el-button>
      <el-button type="primary" @click="$router.push('create');" size="small" class="f-fr" icon="plus">新增出库</el-button>
    </el-row>

    <el-row>
      <el-col>
        <el-table stripe border :data="list" v-loading="loading" element-loading-text="数据加载中" @sort-change="sortList"
                  :default-sort="{prop: 'createTime', order: 'descending'}" show-summary :summary-method="listSummary">
          <el-table-column sortable="custom" prop="no"  align="center" width="250" label="出库单号"/>
          <el-table-column sortable="custom" prop="operator" label="出库人" align="center"/>
          <el-table-column sortable="custom" prop="quantity" label="出库数量" align="center"/>
          <el-table-column sortable="custom" prop="createTime" label="出库时间" align="center" />
          <el-table-column sortable="custom" prop="type" label="出库单类型" align="center">
            <template scope="scope">{{scope.row.type==0?'调货':'报损'}}</template>
          </el-table-column>
          <el-table-column label="操作" width="160" align="center">
            <template scope="scope">
              <el-button :plain="true" type="warning"
                         @click="$router.push({path: '/scrap/detail/'+scope.row.id+'/'+scope.row.no+'/'+scope.row.operator+'/'+scope.row.quantity+'/'+scope.row.type})"
                         size="small" icon="document">详情
              </el-button>
              <el-button  type="danger" @click="delScrap(scope.row.id)" size="small" icon="delete">移除</el-button>
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
        dateRange: '',
        searchWord:'',
        cashiers:[],
        list: [], // 列表数据
        listSort: {},
        params: { // 列表查询参数
          searchWord: '', // 模糊搜索关键字
          checkNo:'',
          stratDate: null,
          endDate: null
        },
        page: { // 分页信息
          currentPage: 1, // 当前页
          size: 15, // 每页大小
          total: 1, // 总页数
        },
        loading: false, // 是否显示加载遮罩层
        pickerOptions2:{
          firstDayOfWeek:1,
          shortcuts: [
            {
              text: '现在时间',
              onClick(picker) {
                const start=new Date();
                const end =new Date();
                picker.$emit('pick',[start, end]);
              }
            }]
        },
        pickerOptions: {
          firstDayOfWeek:1,
          shortcuts: [{
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
      search(){
        let start=dateFormat(new Date(),'yyyy-MM-dd hh:mm');
        if (this.dateRange[0] != null && this.dateRange[0] != undefined && this.dateRange[1] != null && this.dateRange[1] != undefined) {
          if(dateFormat(this.dateRange[0],'yyyy-MM-dd hh:mm')===start&&dateFormat(this.dateRange[1],'yyyy-MM-dd hh:mm')===start){
            this.params.stratDate = dateFormat(this.dateRange[0], 'yyyy-MM-dd hh:mm:ss');
            this.params.endDate = dateFormat(this.dateRange[1], 'yyyy-MM-dd hh:mm:ss');
          }else {
            let startYmd = dateFormat(this.dateRange[0], 'yyyy-MM-dd');
            let endYmd = dateFormat(this.dateRange[1], 'yyyy-MM-dd');
            this.params.stratDate = this.getDateBegin(startYmd);
            this.params.endDate = this.getDateEnd(endYmd);
          }
        } else {
          this.params.stratDate = '';
          this.params.endDate = '';
        }
        this.params.searchWord = $.trim(this.searchWord);
        this.params.checkNo = $.trim(this.params.checkNo);
        this.loadList();
      },
      trimSort(sort){
        if (sort.order != null)
          sort.order = sort.order.replace('ending', '');
        return sort;
      },
      // 处理点击排序
      sortList(sort){
        this.listSort = this.trimSort(sort);
        this.loadList();
      },
      /*加载列表数据*/
      loadList() {
        let url = bus.host + '/pos/api/inventory/scrap/list?page=' + (this.page.currentPage - 1) + '&size=' + this.page.size;
        if (this.listSort.order != null) {
          url += '&sort=' + this.listSort.prop + ',' + this.listSort.order;
        }
        this.loading = true;
        this.$axios.post(url, this.params).then((res) => {
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
          this.page.total = msg.totalElements;
          let content = msg.content;
          this.list = content;
          this.loading = false;
        })
          .catch((err) => {
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
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          switch (index) {
            case 0:
              sums[index] = '合计';
              break;
            case 1:
            case 3:
            case 4:
            case 5:
            case 6:
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
      delScrap(id){
        this.$confirm('删除后出库商品数量将回滚至库存中, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let url = bus.host + '/pos/api/inventory/scrap/delete/';
          this.$http.get(url + id).then((res) => {
            if (res.data.success == true) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              });
              this.loadList();
            } else {
              this.$message.error(res.data.msg);
            }
            this.loadList();
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
    },
    mounted() {
      let date=new Date();
      this.dateRange=[this.getStartDate(date),this.getEndDate(date)];
      let ymd=dateFormat(new Date(),'yyyy-MM-dd');
      this.params.stratDate = this.getDateBegin(ymd);
      this.params.endDate =this.getDateEnd(ymd);
      this.loadList();
      this.$axios.post(bus.host+'/pos/api/account/user/list?page=0&size=1000000',{username:''}).then(res => {
        if(!res.data.success){
          this.$message.error(res.data.msg);
          return;
        }
        this.cashiers=res.data.msg.content;
      });
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

  /*.check-dialog .el-dialog__header{padding:0px !important;}*/
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

  .breadcrumb-border {
    border-bottom: 1px solid #efefef;
    margin-bottom: 10px;
  }

  .el-breadcrumb {
    padding: 5px 0px;
  }

  .el-pagination {
    padding: 10px 0px;
  }

  .el-table {
    margin-top: 10px;
  }

  .tool-bar {
    text-align: right;
  }

  .el-date-editor--daterange.el-input {
    width: 100%;
  }
</style>
