<template>
  <div id="resume-list">
    <div class="content">
      <div class="crumb-bread">
        <span class="router-link" @click="$router.push({path:'/index'})">首页</span>
        <span class="right-arrow">
          <i class="el-icon-arrow-right"></i>
        </span>
        <span class="curr">人才招聘</span>
      </div>
      <div class="search-wrapper">
        <div class="search-input-box">
          <el-input
            @keydown.native="searchByKeyboard($event)"
            v-model="params.keywords"
            placeholder="意向职能/姓名"
          ></el-input>
          <div class="search-btn" @click="search">搜索</div>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="dataList">
          <el-table-column label="姓名" prop="name" align="center" width="170">
            <template slot-scope="scope">
                <!-- <span class="tb-link" @click="toDetail(scope.row.id)">{{scope.row.name}}</span> -->
                <router-link   class="tb-link"  :to="{path: '/resume/detail', query:{id:scope.row.id}}" target="_blank">
                  {{scope.row.name}}
                </router-link>
            </template>
          </el-table-column>
          <el-table-column label="意向职能" align="center" width="316">
            <template slot-scope="scope">{{scope.row.jobFunctionText}}</template>
          </el-table-column>
          <el-table-column label="最高学历/学位" prop="degreeLevelText" align="center" width="164"></el-table-column>
          <el-table-column label="工作年限" prop="workYears" align="center" width="164"></el-table-column>
          <el-table-column label="薪资" prop="expectSalaryText" align="center" width="198"></el-table-column>
          <el-table-column label="更新时间" prop="updateTime" align="center" width="168"></el-table-column>
        </el-table>
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
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      params: {
        keywords: "",
        pageIndex: 1,
        pageSize: 10
      },
      dataList: [],
      pagination: {
        currentPageIndex: 1,
        pageSize: 10,
        pageCount: 0
      }
    };
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  created() {
    this.getList();
  },
  methods: {
    search() {
      this.getList();
    },
    searchByKeyboard(e) {
      if (e.keyCode == 13) {
        this.getList();
      }
    },
    getList() {
      this.$http.post("/custom/ResumeBasic/getList", this.params).then(res => {
        if (res.data.code == 200 && Array.isArray(res.data.data)) {
          this.dataList = res.data.data;
          this.pagination = res.data.pagination;
        } else {
          this.dataList = [];
          this.pagination = { currentPageIndex: 1, pageSize: 10, pageCount: 0 };
        }
      });
    },
    changePage(p) {
      this.params.pageIndex = p;
      this.getList();
    },
  }
};
</script>

<style lang="less">
#resume-list {
  .content {
    width: 1200px;
    margin: 0 auto;
    margin-bottom: 50px;
    .search-wrapper {
      padding: 30px;
      box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
      background-color: #ffffff;
    }
    .search-input-box {
      display: flex;
      justify-content: flex-start;
      .el-input {
        width: 350px;
        margin-right: 9px;
        height: 30px;
      }
      .el-input__inner {
        height: 30px;
      }
      .search-btn {
        display: inline-block;
        width: 78px;
        height: 30px;
        background-color: #3f8def;
        color: #fff;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
      }
    }
    .table-wrapper {
      height: 502px;
      margin-top: 10px;
      padding: 10px;
      background-color: #ffffff;
    }
  }
}
</style>
