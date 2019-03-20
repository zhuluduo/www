<template>
  <div id="my-delivery">
    <div class="box">
      <v-operation>
        <div>
          <el-input @keydown.native="searchByKeydown($event)" v-model="ajaxData.keyword" placeholder="姓名">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="searchByClick"></i>
          </el-input>
          <div class="add-btn search-btn" @click="searchByClick"> 查询</div>
        </div>
      </v-operation>
      <div class="table">
        <el-table :data="tableData" style="width: 100%" header-row-class-name="co-f1">
          <el-table-column label="序号" prop='index' align="center" width="75">
          </el-table-column>
          <el-table-column label="职位名称" align="center">
              <template slot-scope="scope">
                <span class="link-with-underline" @click="$router.push({path:'/job/detail',query:{id:scope.row.id,flag:1}})">{{scope.row.jobName}}</span>
              </template>
          </el-table-column>
          <el-table-column label="招聘人数"  prop='hiringNumber' align="center">
          </el-table-column>
          <el-table-column label="发布时间"  prop='startTime' align="center">
          </el-table-column>
          <el-table-column label="结束时间"  prop='endTime' align="center">
          </el-table-column>
          <el-table-column label="工作地点" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.city}}</div>
            </template>
          </el-table-column>
           <el-table-column label="投递时间"  prop='createTime' align="center">
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination @current-change="changePage" background layout="prev, pager, next" :page-count="pagination.pageCount" :current-page="pagination.currentPageIndex" :page-size="pagination.pageSize">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import operationBar from '../components/operationBar.vue';
export default {
  components: {
    'v-operation': operationBar,
  },
  data() {
    return {
      tableData: [],
      ajaxData: {
        pageIndex: 1,
        pageSize: 10,
        keyword: "",
      },
      types: [],
      pagination: {
        currentPageIndex: 1,
        pageSize: 10,
        pageCount: 1
      }
    };
  },
  created() {
    this.getList();
  },
  //页面在顶部；
  mounted() {},
  filters: {},
  methods: {
    //获取数据列表信息;
    async getList() {
      let res = await this.$http.post("/custom/jobInfo/myList", this.ajaxData);
      if (res.data.code == 200) {
        this.tableData = res.data.data || [];
        this.pagination = res.data.pagination?res.data.pagination:this.pagination;
        var index = (this.pagination.currentPageIndex - 1) * this.pagination.pageSize;
        this.tableData.map((ele, i) => {
          this.$set(ele, "index", index + i + 1);
        });
      } else {
        this.$error(res.data.message || '网络异常')
      }
    },
    //搜索的操作；
    searchByKeydown() {
      if (event.keyCode == 13) {
        this.getList();
      }
    },
    searchByClick() {
      this.getList();
    },
    //分页的操作；
    changePage(p) {
      this.ajaxData.pageIndex = p;
      this.getList();
    },
  }
};

</script>
<style lang="less" scoped>
  #my-delivery {
    .box {
      margin: 0 auto;
    }

    .el-icon-search:before {
      font-size: 18px;
      color: #a4a4a4;
      cursor: pointer;
    }

    .el-input__icon {
      line-height: 26px;
    }

    .el-input {
      width: 320px;
    }

    .search-btn {
      display: inline-block;
      margin-left: 10px;
    }
  }
</style>
