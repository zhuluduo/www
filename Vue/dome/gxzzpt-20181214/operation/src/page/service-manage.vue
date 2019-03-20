<template>
  <div class="service-page">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>服务</el-breadcrumb-item>
      <el-breadcrumb-item>服务管理</el-breadcrumb-item>
    </el-breadcrumb>
    <v-operations>
      <div slot="right"><el-button type="primary" @click="openDlg">管理服务类别</el-button><el-button type="primary" @click="$router.push({path:'/main/add-service'})">添加服务</el-button></div>
    </v-operations>
    <el-table :data="tableData" border  style="width: 100%">
      <el-table-column type="index" label="序号"  width="80">
      </el-table-column>
      <el-table-column prop="serviceName" label="服务名称">
      </el-table-column>
      <el-table-column prop="techniqueInfo" label="服务类别">
        <template slot-scope="scope">
          {{scope.row.serviceCatalog.serviceCatalogName}}
        </template>
      </el-table-column>
      <el-table-column prop="techniqueInfo" label="工艺">
        <template slot-scope="scope">
          <div class="teachniqueInfo">
            <span v-for="(item,index) in scope.row.serviceProcedureList" :key="index">{{item.stepName}}</span>
          </div> 
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <span class="tb-operation-link" @click="$router.push({path:'/main/edit-service',query:{id:scope.row.id}})">编辑</span>
          <span class="tb-operation-link" @click="deleteService(scope.row)">删除</span>
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

    <el-dialog
      title="添加类别"
      :visible.sync="serviceTypeDlg.visible"
      :before-close="handleClose"
      width="500px">
      <div>
        <div class="error-bar" v-show="serviceTypeDlg.errVisible">{{serviceTypeDlg.errorMsg}}</div>
        <el-form label-position="left" ref="serviceTypeForm" :rules="serviceTypeDlg.rules" :model="serviceTypeDlg.form" label-width="85px">
          <el-form-item label="服务类别：" class="required" prop="name">
            <template slot-scope="scope">
              <div class="def-form-item">
                <el-input v-model="serviceTypeDlg.form.name"></el-input>
                <div class="right-operation">
                  <el-button type="primary" @click="submitServiceType">确 定</el-button>
                </div>
              </div>
            </template>
          </el-form-item>
        </el-form>
        <el-table
          :data="serviceTypeDlg.tableData"
          stripe
          style="width: 100%">
          <el-table-column
            prop="serviceCatalogName"
            label="服务类别">
          </el-table-column>
          <el-table-column
            label="操作"
            width="100">
            <template slot-scope="scope">
              <span class="tb-operation-link" @click="deleteServiceType(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import OperationBar from "../compoents/operation-bar.vue";
export default {
  components: {
    "v-operations": OperationBar
  },
  data() {
    return {
      serviceTypeDlg: {
        visible: false,
        errVisible: false,
        errorMsg: "",
        form: {
          name: ""
        },
        rules: {
          name: [{ required: true, message: "请输入服务类别", trigger: "blur" }]
        },
        tableData: []
      },
      tableData: [],
      pagination: {},
      requestParams: {
        pageSize: 10,
        pageIndex: 1
      }
    };
  },
  watch: {},
  created() {
    this.getList(this.requestParams);
  },
  mounted() {},
  methods: {
    handleClose(done) {
      this.$refs["serviceTypeForm"].resetFields();
      this.serviceTypeDlg.errVisible = false;
      done();
    },
    openDlg() {
      this.getServiceTypeList();
    },

    changPage(pageIndex) {
      this.requestParams.pageIndex = pageIndex;
      this.getList(this.requestParams);
    },

    getList(params) {
      this.$http.post("/operation/service/list", params).then(res => {
        if (res.data.code == 200) {
          if ("data" in res.data) {
            this.tableData = res.data.data;
          } else {
            this.tableData = [];
          }
          this.pagination = res.data.pagination;
        }
      });
    },
    deleteService(row) {
      this.$http.post("/operation/service/delete", { id: row.id }).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: res.data.message
          });
          this.getList(this.requestParams);
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    submitServiceType() {
      this.$refs["serviceTypeForm"].validate(valid => {
        if (valid) {
          this.addServiceType({
            serviceCatalogName: this.serviceTypeDlg.form.name
          });
        } else {
          return false;
        }
      });
    },
    addServiceType(params) {
      this.$http.post("/operation/serviceCatalog/add", params).then(res => {
        if (res.data.code == 200) {
          this.getServiceTypeList();
        } else {
          this.serviceTypeDlg.errVisible = true;
          this.serviceTypeDlg.errorMsg = res.data.message;
        }
      });
    },
    deleteServiceType(row) {
      this.$http
        .post("/operation/serviceCatalog/delete", { id: row.id })
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: res.data.message
            });
            this.getServiceTypeList();
          } else {
            this.$message({
              type: "error",
              message: res.data.message
            });
          }
        });
    },
    getServiceTypeList() {
      this.$http.post("/operation/serviceCatalog/all").then(res => {
        if (res.data.code == 200) {
          this.serviceTypeDlg.visible = true;
          if ("data" in res.data) {
            this.serviceTypeDlg.tableData = res.data.data;
          } else {
            this.serviceTypeDlg.tableData = [];
          }
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.service-page {
  .def-form-item {
    display: flex;
    .right-operation {
      height: 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 10px;
    }
  }
}
.tb-operation-link {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
  margin: 0 10px;
}
.teachniqueInfo{
  >span{
    margin-right: 10px;
    display: inline-block;
  }
}
</style>
