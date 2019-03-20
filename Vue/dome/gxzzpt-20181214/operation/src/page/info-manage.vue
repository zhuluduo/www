<template>
  <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>信息发布</el-breadcrumb-item>
        <el-breadcrumb-item>信息列表</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="tb-top-operator">
        <div class="left">
          <div class="select">
            <el-select  v-model="ajaxData.moduleId" @change="getList">
              <el-option :label="item.moduleName" :value="item.id" v-for="(item,i) in catalogList" :key="i"></el-option>
            </el-select>
          </div>
          <div>
            <el-input type="text" v-model="ajaxData.keyword" placeholder="请输入标题" />
          </div>
          <div>
            <el-button type="primary" @click="getList">查询</el-button>
          </div>
        </div>
        <div class="right">
          <el-button type="primary" @click="$router.push({path:'/main/add-info'})">发布新信息</el-button>
        </div>
      </div>
      <el-table border :data="tableData" style="width: 100%">
      <el-table-column prop="index" label="序号" align="center" width="80px">
      </el-table-column>
      <el-table-column prop="title" label="标题" align="center">
      </el-table-column>
      <el-table-column prop="catalogInfo" label="分类" align="center" :formatter="cataFormatter">
      </el-table-column>
      <el-table-column prop="updateTime" align="center" label="最后更新时间">
      </el-table-column>
      <el-table-column prop="" align="center" label="操作">
        <template slot-scope="scope">
          <span class="table-operator" @click="edit(scope.row)">编辑</span>
          <span class="table-operator" @click="deleteRow(scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination" v-show="tableData.length">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changPage"
        :page-size="pagination.pageSize"
        :current-page="pagination.pageIndex"
        :page-count="pagination.pageCount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  component: {},
  data() {
    return {
      catalogList:[],
      ajaxData: {
        pageIndex: 1,
        pageSize: 10,
        moduleId: "",
        keyword:""
      },
      pagination: {
        currentPageIndex: 1,
        pageCount: 0,
        pageSize: 10,
        recordCount: 0
      },
      tableData: [],
     
    };
  },
  created() {
    this.getList();
    this.getAllCatalog();
  },
  mounted() {},
  methods: {
    getAllCatalog(){
      this.$http.post('/operation/module/all').then(res=>{
        if(res.data.code == 200){
          this.catalogList = res.data.data;
          var item = {
            id:"",
            moduleName:"全部"
          }
          this.catalogList.unshift(item);
        }
      })
    },
    cataFormatter(row,column){
      // console.log(row);
      return row.catalogInfo.catalogName;
    },
    edit(row) {
      var id = row.id;
      this.$router.push({
        path: "/main/edit-info",
        query: {
          id: id
        }
      });
    },
    changPage(p) {
      this.ajaxData.pageIndex = p;
      this.getList();
    },
    
    getList() {
      this.$http
        .post("/operation/information/list", this.ajaxData)
        .then(res => {
          if (res.data.code == 200) {
            this.pagination = res.data.pagination;
            this.tableData = res.data.data || [];
            var index =(this.pagination.currentPageIndex - 1) * this.pagination.pageSize;
            this.tableData.map((ele, i) => {
              this.$set(ele, "index", index + i + 1);
            });
          }
        })
        .catch(res => {});
    },
    deleteRow(row) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var ajaxData = {
            id: row.id
          };
          this.$http.post("/operation/information/delete", ajaxData).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.getList();
            } else {
              this.$message({
                type: "error",
                message: res.data.message || "删除失败"
              });
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="less" scoped>
.btn-area {
  padding: 10px 0px;
  text-align: right;
}
.pagination {
  padding: 10px 0px;
  text-align: right;
}
.line-row {
  display: flex;
  button {
    margin-left: 20px;
  }
}
.sort-list {
  .list-item {
    display: flex;
    padding: 10px 0px;
    border-bottom: 1px solid #ddd;
    > div {
      flex: 1;
      text-align: center;
    }
  }
}
.table-pic-text {
  display: flex;
  align-items: center;
  // justify-content: center;
  .table-pic {
    width: 100px;
    height: 100px;
  }
  .table-text {
    margin-left: 20px;
  }
}
</style>
