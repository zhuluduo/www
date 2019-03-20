<template>
  <el-row class="warp">
    <el-row class="breadcrumb-border nav_top">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>销售管理</el-breadcrumb-item>
          <el-breadcrumb-item>促销活动</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-col :span="24" class="warp-breadcrum breadcrum_bottom breadcrum_top">
      <el-row :gutter="2">
        <el-col :span="3">
          <el-select v-model="Preference" clearable placeholder="全部类别" size="small">
            <el-option v-for="item in Preference_type" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="listQuery.overdue" clearable placeholder="请选择状态" size="small">
            <el-option label="进行中" value="0"></el-option>
            <el-option label="已过期" value="1"></el-option>
            <el-option label="未开始" value="2"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input @keyup.enter.native="handleFilter" placeholder="输入活动名称" v-model="listQuery.name"
                    size="small"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleFilter" icon="search" size="small">搜索</el-button>
          <!--<Button type="primary" size="large" @click="exportData()"><Icon type="ios-download-outline"></Icon> 导出原始数据</Button>-->
        </el-col>
        <el-col :span="0" align="right">
          <el-dropdown trigger="click" @command="selectVal">
            <el-button type="primary" size="small">
              新建活动<i class="el-icon-caret-bottom el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item in Preference_type" :key="item.value" :label="item.label" :value="item.id"
                                v-model="item.value" :command="item.value">{{item.label}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
    <el-col :span="24" class="warp-breadcrum border-default breadcrum_top" >
      <el-table stripe border :data="tableData" v-loading="listLoading" style="width: 100%"  @sort-change="sortList" :default-sort = "{prop: 'createTime', order: 'descending'}" >
        <el-table-column sortable="custom" prop="name" label="促销名称" ></el-table-column>
        <el-table-column sortable="custom" prop="typeName" label="促销类别" ></el-table-column>
        <el-table-column sortable="custom" prop="startTime" label="开始日期" ></el-table-column>
        <el-table-column sortable="custom" prop="endTime"  label="截止日期" ></el-table-column>
        <!--<el-table-column label="状态" sortable>-->
        <!--<template scope="scope">-->
        <!--<el-tag  :type="scope.row.type==0?'success':'danger'">{{scope.row.type==0?'进行中':'已过期'}}</el-tag>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column  sortable="custom" prop="type"  label="状态" >
          <template  scope="scope">
            <el-tag v-if="scope.row.type==2" type="primary">未开始</el-tag>
            <el-tag v-if="scope.row.type==0" type="success">进行中</el-tag>
            <el-tag v-if="scope.row.type==1" type="danger">已过期</el-tag>
          </template>
        </el-table-column>
        <!--<el-table-column label="操作" width="200">-->
        <!--<template scope="scope">-->
        <!--<el-button size="small"   @click="onEditUser(scope.$index,scope.row)">编 辑</el-button>-->
        <!--<el-button size="small"  type="danger" @click="delPromotion(scope.$index,scope.row)">删 除</el-button>-->
        <!--</template>-->
        <!--</el-table-column>-->
        <el-table-column label="操作" width="150" align="center">
          <template scope="scope">
            <el-button
              :plain="true" type="warning" size="small"
              @click="onEditUser(scope.$index, scope.row)" icon="edit">编辑
            </el-button>
            <el-button :plain="true"
              size="small"
              type="danger"
              @click="delPromotion(scope.$index, scope.row)" icon="delete">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="listQuery.pageSize"
        layout="prev, pager, next, jumper, total"
        :total="total">
      </el-pagination>
    </el-col>
  </el-row>
</template>
<script>
  import Vue from 'vue';
  import {bus} from '../../bus.js';

  export default{
    data(){
      return {
        url: bus.host + '/pos/api/promotion/list',
        tableData: [],
        listSort:{},
        Preference_type: '',
        listQuery: {
          page: 1,
          pageSize: 15,
          productStatus: 1,
          name: null,
          overdue: null,
          typeCode: null,
        },
        Preference: null,
        Preference_val: '',
        total: 1,
        currentPage: 1,
        listLoading: false,
      }
    },

    methods: {

      // 处理点击排序
      sortList(sort){
        this.listSort=this.trimSort(sort);
        this.listTable();
      },
      trimSort(sort){
        if(sort.order!=null)
          sort.order=sort.order.replace('ending','');
        return sort;
      },

      /**
       * @param  {object} listTable  信息列表
       */
      listTable() {
        let url =this.url + "?page=" + (this.listQuery.page - 1) + "&size=" + this.listQuery.pageSize;
        this.listLoading = true;
        if(this.listSort.order!=null){
          url+='&sort='+this.listSort.prop+','+this.listSort.order;
        }
        this.$http.post(url, this.listQuery).then((response) => {
          if (response.data.success == false) {
//            this.$router.push('/erro/401');
            this.$notify.error({
              title: '错误',
              message: '亲，您现在还没用权限哦！'
            });
          }
          this.total = response.data.msg.totalElements;
          this.tableData = response.data.msg.content;
          this.listLoading = false;
        }, (response) => {
          this.$notify.error({
            title: '错误',
            message: '这是一条错误的提示消息'
          });
        });
      },
      /**
       * @param  {object} listTable  优惠分类
       */
      breaks_classify() {
        let url = bus.host + '/pos/api/digtaldictionary/detail?type=0'
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
      /**
       * @param  {object} handleFilter 搜索
       */
      handleFilter() {
        if (this.$data.Preference != null || this.$data.Preference == '') {
          if (this.$data.Preference != null) {
            this.listQuery.typeCode = this.$data.Preference;
          }
        } else {
          this.listQuery.typeCode = null;
        }
        if (this.listQuery.overdue == null || this.listQuery.overdue == '') {
          this.listQuery.overdue = null;
        }
        if (this.listQuery.name == null || this.listQuery.name == '') {
          this.listQuery.name = null
        }
        if (this.$data.Preference == "") {
          this.listQuery.typeCode = null;
        }
        this.listQuery.name=$.trim(this.listQuery.name);
        this.listTable();
      },
      selectVal(ele){
//        let bool = false;
//        let resources = JSON.parse(sessionStorage.getItem('resources'));
//        console.log(resources);
//        resources.forEach(function (e) {
//          if (e.permission == 'promotion:edit') {
//            bool = true;
//          }
//        })
//        if (bool == true) {
          let label;
          let value;
          for (let i = 0; i < this.Preference_type.length; i++) {
            if (this.Preference_type[i].value == ele) {
              label = this.Preference_type[i].label;
              value = this.Preference_type[i].value;
            }
          }
          this.$router.push({path: 'list',  query: {label: label, value: value}});
//        } else {
//          this.$message({
//            message: '亲，您暂无此权限哦！',
//            type: 'warning'
//          });
//        }
      },
      /**
       * @param  {object} onEditUser 编辑信息
       */
      onEditUser (row, index) {
//        let bool = false;
//        let resources = JSON.parse(sessionStorage.getItem('resources'));
//        console.log(resources);
//        resources.forEach(function (e) {
//          if (e.permission == 'promotion:delete') {
//            bool = true;
//          }
//        })
//        if (bool == true) {
          this.$router.push({path: 'list', query: {couponId: index.id,code:index.typeCode}});
//        } else {
//          this.$message({
//            message: '亲，您暂无此权限哦！',
//            type: 'warning'
//          });
//        }
      },
      /**
       * @param  {object} delPromotion 删除
       */
      delPromotion(row, index) {
//        let bool = false;
//        let resources = JSON.parse(sessionStorage.getItem('resources'));
//        console.log(resources);
//            bool = true;
//          }
//        resources.forEach(function (e) {
//          if (e.permission == 'promotion:detail') {
//        })
//        if (bool == true) {

        this.$confirm('此操作将删除该活动, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let couponIds = index.id;
            let url = bus.host + '/pos/api/promotion/deletePromotion?couponId=' + couponIds;
            this.$http.delete(url).then((response) => {
              if (response.data.msg == true) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                this.listTable();
              }
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
//        } else {
//          this.$message({
//            message: '亲，您暂无此权限哦！',
//            type: 'warning'
//          });
//        }
      },
      /**
       * @param  {object} handleSizeChange 分页
       */
      handleSizeChange(val) {
        this.listQuery.pagesize = val;
        this.listTable();
      },
      handleCurrentChange(val) {
        this.listQuery.page = val;
        this.listTable();
      },
    },
    mounted() {
//      let bool = false;
//      let resources = JSON.parse(sessionStorage.getItem('resources'));
//      console.log(resources);
//      resources.forEach(function (e) {
//        if (e.permission == 'promotion:detail') {
//          bool = true;
//        }
//      })
//      if (bool == true) {
      this.listTable();
      this.breaks_classify();
//      } else {
//        this.$message({
//          message: '亲，您暂无此权限哦！',
//          type: 'warning'
//        });
//      }
//    }
    }
  }
</script>
<style>
  .el-button + .el-button {
    margin-left: 0;
  }

  .dropdown {
    float: right;
    padding: 5px;
    margin: 0 93px -10px 0;
    background-color: #20a0ff;
    border-color: #20a0ff;
  }

  .dropdown .el-dropdown span {
    cursor: pointer;
    color: #fff;
    padding: 0 10px;
  }

  .breadcrum_bottom {
    border-bottom: 0px;
    padding-bottom: 0px;
  }

  .breadcrum_top {
    padding-top: 0px;
  }
</style>
