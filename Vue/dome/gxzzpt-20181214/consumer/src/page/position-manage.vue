<template>
  <div id="position-manage">
    <div class="box">
      <v-operation>
        <div>
          <el-input
            @keydown.native="searchByKeydown($event)"
            v-model="ajaxData.keyword"
            placeholder="需求编号/产品名称"
          >
            <i slot="suffix" class="el-input__icon el-icon-search" @click="searchByClick"></i>
          </el-input>
          <div class="add-btn search-btn" @click="searchByClick">查询</div>
        </div>
        <div slot="right">
          <div class="add-btn" @click="$router.push({path:'/usercenter/position-issue'})">发布职位</div>
        </div>
      </v-operation>
      <div class="table">
        <el-table :data="tableData" style="width: 100%" header-row-class-name="co-f1">
          <el-table-column label="序号" prop="index" align="center" width="75"></el-table-column>
          <el-table-column label="职位名称" align="center" width="120">
            <template slot-scope="scope">
              <span
                class="link-with-underline"
                @click="$router.push({path:'/job/detail',query:{id:scope.row.id,flag:1}})"
              >{{scope.row.jobName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="收到简历总数" prop="resumeCount" align="center" width="100"></el-table-column>
          <el-table-column label="发布时间" align="center" prop="startTime" width="120"></el-table-column>
          <el-table-column label="结束时间" align="center" prop="endTime" width="120"></el-table-column>
          <el-table-column label="工作地点" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.province}}{{scope.row.city}}{{scope.row.region}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="状态" align="center" width="68px">
            <template slot-scope="scope">
              <span class="style1">{{scope.row.isPublish?'发布中':'暂停中'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop label="操作" align="center" width="200">
            <template slot-scope="scope">
              <span
                class="link-with-underline"
                @click="$router.push({path:'/usercenter/position-issue',query:{id:scope.row.id}})"
              >修改职位</span>
              <span
                class="link-with-underline style2"
                @click="isPublish(scope.row)"
              >{{scope.row.isPublish?'暂停':'再发布'}}</span>
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
import "../lib/filter.js"; //引入时间和日期过滤器；
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
        keyword: ""
      },
      types: [],
      pagination: {
        currentPageIndex: 1,
        pageSize: 10,
        pageCount: 0
      }
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  filters: {},
  methods: {
    //获取数据列表信息;
    async getList() {
      let res = await this.$http.post(
        "/custom/manufacturer/jobInfo/list",
        this.ajaxData
      );
      if (res.data.code == 200) {
        this.tableData = res.data.data || [];
        this.pagination = res.data.pagination;
        var index =(this.pagination.currentPageIndex - 1) * this.pagination.pageSize;
        this.tableData.map((ele, i) => {
          this.$set(ele, "index", index + i + 1);
        });
        window.scrollTo(0, 0);
      } else {
        this.$error(res.data.message || "网络异常");
      }
    },
    //是否发布；
    async isPublish(data) {
      let parmaData = { id: data.id, isPublish: !data.isPublish };
      let res = await this.$http.post(
        "/custom/manufacturer/jobInfo/update",
        parmaData
      );
      if (res.data.code == 200) {
        this.getList();
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
    }
  }
};
</script>
<style lang="less" scoped>
#position-manage {
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
    margin-left: 10px;
  }
  .style2 {
    margin-left: 24px;
    display: inline-block;
    width: 50px;
    text-align: center;
  }
}
</style>
