<template>
  <div id="received-resume">
    <div class="box">
      <v-operation>
        <div>
          <el-input
            @keydown.native="searchByKeydown($event)"
            v-model="ajaxData.keywords"
            placeholder="姓名/职位名称"
          >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="searchByClick"></i>
          </el-input>
          <div class="add-btn search-btn" @click="searchByClick">查询</div>
        </div>
      </v-operation>
      <div class="table">
        <el-table :data="tableData" style="width: 100%" header-row-class-name="co-f1">
          <el-table-column label="序号" prop="index" align="center" width="75"></el-table-column>
          <el-table-column prop="requirementNo" label="姓名" align="center">
            <template slot-scope="scope">
              <router-link  class="link-with-underline" :to="{path: '/resume/detail', query:{id:scope.row.id}}" target="_blank">
                  {{scope.row.name}}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="职位名称" prop="index" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.jobFunctionText}}</div>
            </template>
          </el-table-column>
          <el-table-column label="年龄" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.year}}</div>
            </template>
          </el-table-column>
          <el-table-column label="工作年限" align="center" width="90">
            <template slot-scope="scope">{{scope.row.workYears}}</template>
          </el-table-column>
          <el-table-column label="学历" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.latelyDegreeLevelText}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="投递时间" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.deliveryTime}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          @current-change="changePage"
          background
          layout="prev, pager, next"
          :page-count="pagination.pageCount"
          :current-page="pagination.currentPageIndex"
          :page-size="pagination.pageSize"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import operationBar from "../components/operationBar.vue";
export default {
  components: {
    "v-operation": operationBar
  },
  data() {
    return {
      tableData: [],
      ajaxData: {
        pageIndex: 1,
        pageSize: 10,
        keywords: ""
      },
      types: [],
      pagination: {
        currentPageIndex: 1,
        pageSize: 10,
        pageCount: 0
      },
      user: this.$LocalStorage.gxzzpt2_consumer()
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
      let res = await this.$http.post(
        "/custom/ResumeBasic/getReceivedResumeList",
        this.ajaxData
      );
      if (res.data.code == 200) {
        this.tableData = res.data.data.length > 0 ? res.data.data : [];
        this.pagination =
          res.data.data.length > 0 ? res.data.pagination : this.pagination;
        var index =
          (this.pagination.currentPageIndex - 1) * this.pagination.pageSize;
        this.tableData.map((ele, i) => {
          this.$set(ele, "index", index + i + 1);
        });
      } else {
        this.$error(res.data.message || "网络异常");
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
#received-resume {
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