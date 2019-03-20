<template>
  <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>标准化配置</el-breadcrumb-item>
        <el-breadcrumb-item>材料管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="btn-area">
        <el-button type="primary" @click="addSortFormShow=true">管理材料类别</el-button>
        <el-button type="primary" @click="$router.push({path:'/main/add-materials'})">添加自动报价材料</el-button>
        <el-button type="primary" @click="addArtificial">添加人工报价材料</el-button>
      </div>

      <el-tabs class="Eltabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="人工报价工艺" name="first">
        </el-tab-pane>
        <el-tab-pane label="自动报价工艺" name="second">
        </el-tab-pane>
      </el-tabs>
      <el-table border :data="tableData" style="width: 100%"  v-loading="loading" element-loading-text="数据加载中">
        <el-table-column prop="index" label="序号" align="center" width="80">
        </el-table-column>
        <el-table-column prop="materialName" label="材料名称"  align="left"  width='180'>
          <template slot-scope="scope">
            <div class="table-pic-text">
              <img class="table-pic" v-if="scope.row.materialPurpose !=460020"  :src="scope.row.picture"/>
              <span class="table-text" :class="scope.row.materialPurpose ==460020?'table-text-active':''">{{scope.row.materialName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column  align="center" label="工艺">
          <template slot-scope="scope" >
            <div>
                <span v-for="(TechniqueType,index) in scope.row.technique" class="pull-inline"  :key="index">{{TechniqueType.techniqueName}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="catalog" label="类别" align="center" :formatter="cataFormatter" width="80">
        </el-table-column>
        <el-table-column prop="parameter" align="center" label="材料参数" width="100" >
          <template slot-scope="scope">
          <span>{{scope.row.paramCount||0}}个</span>
        </template>
        </el-table-column>
        <el-table-column prop="info" align="center" label="简介" width='180' show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="" align="center" label="操作" width="120">
          <template slot-scope="scope">
            <span class="table-operator" @click="edit(scope.row)">编辑</span>
            <span class="table-operator" @click="deleteRow(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>

    <div class="pagination" v-if="paginationState">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changPage"
        :page-size="pagination.pageSize"
        :current-page="pagination.pageIndex"
        :page-count="pagination.pageCount">
      </el-pagination>
    </div>
    <el-dialog title="添加类别" width="500px" :visible.sync="addSortFormShow" @close="resetForm('addSortForm')">
      <div>
        <el-collapse-transition>
          <div class="form-msg" v-show="errRes">{{errRes}}</div>
        </el-collapse-transition>
        <el-form label-position="left" ref="addSortForm" :rules="rules" :model="addSortForm" label-width="85px">
          <el-form-item label="材料类别：" class="required" prop="name">
            <template slot-scope="scope">
              <div class="line-row">
                <el-input v-model="addSortForm.name"></el-input>
                <el-button type="primary" @click="addSort('addSortForm')">确定</el-button>
              </div>
            </template>
          </el-form-item>
        </el-form>
        <div class="sort-list">
          <div class="list-item">
            <div>材料类别</div>
            <div>操作</div>
          </div>
          <div class="list-item" v-for="(item,index) in sortList" :key="index">
            <div>{{item.catalogName}}</div>
            <div class="table-operator" @click="deleteCatalog(item)">删除</div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="centerDialogVisible = false">取 消</el-button> -->
        <!-- <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button> -->
      </span>
    </el-dialog>
    <el-dialog
    :title="TechnologyName"
    :visible.sync="addArtificialShow"
    width="500px" class="Artificial-align" @close="resetFormInfo('ArtificialForm')">
    <div class="ArtificialForm">
      <el-form :model="ArtificialForm" status-icon :rules="rules2" ref="ArtificialForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="材料名称：" prop="materialName">
          <el-input v-model="ArtificialForm.materialName"></el-input>
        </el-form-item>
        <el-form-item label="材料类别：" prop="catalogIdsInfo">
        <el-select v-model="ArtificialForm.catalogIdsInfo" placeholder="请选择">
          <el-option
              v-for="item in sortList"
              :key="item.id"
              :label="item.catalogName"
              :value="item.id">
          </el-option>
        </el-select>
        </el-form-item>
        <el-form-item label="工艺：" prop="techniqueIds" >
        <el-select v-model="ArtificialForm.techniqueIds" multiple placeholder="请选择">
          <el-option
              v-for="item in categoryDate"
              :key="item.id"
              :label="item.techniqueName"
              :value="item.id">
          </el-option>
        </el-select>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer ">
      <el-button @click="ArtificialSub(1,'ArtificialForm')">取 消</el-button>
      <el-button type="primary" @click="ArtificialSub(2,'ArtificialForm')"  :loading="submitForm_loading">确 定</el-button>
    </span>
  </el-dialog>

  </div>
</template>
<script>
export default {
  component: {},
  data() {
    const checkSortName = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("请输入正确的分类名称"));
      }
    };
    const category = (rule, value, callback) => {
      if (value == "") {
        if (rule.field == "catalogIdsInfo") {
          return callback(new Error("请选择材料类别"));
        }
        if (rule.field == "techniqueIds") {
          return callback(new Error("请选择工艺"));
        }
      } else {
        setTimeout(() => {
          callback();
        }, 100);
      }
    };
    return {
      errRes: "",
      ajaxData: {
        pageIndex: 1,
        pageSize: 10,
        materialPurpose:460020,
        catalogName: ""
      },
      pagination: {
        currentPageIndex: 1,
        pageCount: 0,
        pageSize: 10,
        recordCount: 0
      },
      addSortFormShow: false,
      modalWidth: "600px",
      addSortForm: {
        name: ""
      },
      sortList: [],
      tableData: [],
      activeName: 'first',
      paginationState:true,
      rules: {
        name: [
          {
            validator: checkSortName,
            trigger: "blur"
          }
        ]
      },
      TechnologyToogle: false,
      TechnologyName: "添加人工报价材料",
      TechnologyState: 0,
      addArtificialShow: false,
      categoryDate: [],
      TechnologyData: [],
      ArtificialForm: {
        materialName: "",
        catalogIdsInfo: [],
        techniqueIds: []
      },
      rules2: {
        materialName: [
          { required: true, message: "请输入材料名称", trigger: "blur" }
        ],
        catalogIdsInfo: [
          { required: true, validator: category, trigger: "change" }
        ],
        techniqueIds: [
          { required: true, validator: category, trigger: "change" }
        ]
      },
      loading:false,
      submitForm_loading:false,
    };
  },
  created() {
    this.Technology();
    this.getList();
    this.getAll();
  },
  mounted() {},
  methods: {
    edit(row) {
      var id = row.id;
      if (row.materialPurpose === 460020) {
        let Technology = [];
        for (let ins in row.technique) {
          Technology.push(row.technique[ins].techniqueId);
        }
        this.ArtificialForm = {
          id: id,
          materialName: row.materialName,
          catalogIdsInfo: row.catalog[0].catalogId,
          techniqueIds: Technology
        };
        this.TechnologyName = "编辑人工报价材料";
        this.TechnologyState = 1;
        this.addArtificialShow = true;
      } else {
        this.$router.push({
          path: "/main/edit-materials",
          query: {
            id: id
          }
        });
      }
    },
    changPage(p) {
      this.ajaxData.pageIndex = p;
      this.getList();
    },
    getAll() {
      this.$http
        .post("/operation/materialCatalog/getAll")
        .then(res => {
          if (res.data.code == 200) {
            this.sortList = res.data.data;
          }
        })
        .catch(res => {});
    },
    cataFormatter(row, column, cellValue) {
      var arr = [];
      row.catalog.map(ele => {
        arr.push(ele.catalogName);
      });
      return arr.join(",");
    },

    handleClick(tab, event) {
      if(tab.name=='first'){
        this.paginationFun();
        this.ajaxData.materialPurpose=460020;
      }else if(tab.name=='second'){
        this.paginationFun();
        this.ajaxData.materialPurpose=460010;
      }
      this.getList();
    },
    paginationFun(){
        this.paginationState=false;
        this.ajaxData.pageIndex=1;
        setTimeout(()=>{
          this.paginationState=true;
        },10)
    },

    getList() {
      this.loading=true;
      this.$http.post("/operation/material/getList", this.ajaxData).then(res => {
          if (res.data.code == 200) {
            this.pagination = res.data.pagination;
            this.tableData = res.data.data || [];
            var index =(this.pagination.currentPageIndex - 1) * this.pagination.pageSize;
            this.tableData.map((ele, i) => {
              this.$set(ele, "index", index + i + 1);
            });
            this.loading=false;
            window.scrollTo(0,0);
          }
        })
        .catch(res => {});
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.errRes = "";
    },
    resetFormInfo(item) {
      this.$refs[item].resetFields();
    },
    addSort(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var ajaxData = {
            name: this[formName].name
          };
          this.$http
            .post("/operation/materialCatalog/add", ajaxData)
            .then(res => {
              if (res.data.code == 200) {
                this.resetForm(formName);
                this.getAll();
              } else {
                this.errRes = res.data.message || "网络异常";
              }
            })
            .catch(res => {
              this.errRes = res.data.message || "网络异常";
            });
        } else {
          return false;
        }
      });
    },
    deleteCatalog(item) {
      var ajaxData = {
        id: Number(item.id)
      };
      this.$http
        .post("/operation/materialCatalog/delete", ajaxData)
        .then(res => {
          if (res.data.code == 200) {
            this.getAll();
            this.errRes = "";
          } else {
            this.errRes = res.data.message || "网络异常";
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
          this.$http.post("/operation/material/delete", ajaxData).then(res => {
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
    },
    /*添加人工报价*/
    addArtificial() {
      this.TechnologyName = "添加人工报价材料";
      this.TechnologyState = 0;
      this.ArtificialForm = {
        materialName: "",
        catalogIdsInfo: "",
        techniqueIds: []
      };
      this.addArtificialShow = true;
    },
    /*获取工艺*/
    Technology() {
      let params={
        techniquePurpose:460020
      }
      this.$http.post("/custom/technique/getList",params).then(res => {
        if (res.data.code == 200) {
          this.categoryDate = res.data.data
        }
      });
    },
    /*确定上传信息*/
    ArtificialSub(index, item) {
      let formDate = [];
      if (index == 1) {
        this.addArtificialShow = false;
      } else {
        this.$refs[item].validate(valid => {
          if (valid) {
            this.submitForm_loading=true;
            formDate.push(this.ArtificialForm.catalogIdsInfo);
            this.ArtificialForm.catalogIds = formDate;
            let url =
              this.TechnologyState == 0
                ? "/operation/material/addManualQuotationMaterial"
                : "operation/Material/editManualQuotationMaterial";
            this.$http.post(url, this.ArtificialForm).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  message: res.data.message,
                  type: "success",
                  duration: 1100
                });
                this.getList();
                this.addArtificialShow = false;
                this.submitForm_loading=false;
              } else {
                this.submitForm_loading=false;
                this.$message({
                  message: res.data.message,
                  type: "warning",
                  duration: 1100
                });
              }
            });
          } else {
            return false;
          }
        });
      }
    }
  }
};
</script>
<style  lang="less">
.Artificial-align {
  .el-dialog__header {
    text-align: center;
  }
  .el-dialog__footer {
    text-align: center;
    padding-bottom: 40px;
  }
}
</style>

<style lang="less" scoped>
.btn-area {
  padding: 10px 0px;
  text-align: right;
}
.pagination {
  margin-top: 10px;
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
    width: 60px;
    height: 30px;
  }
  .table-text {
    margin-left: 20px;
    text-align: left;
  }
  .table-text-active {
    margin-left: 80px !important;
  }
}
.pull-inline {
  display: inline-block !important;
}
.pull-inline + .pull-inline {
  &::before {
    content: ",";
    width: 5px;
    display: inline-block;
    padding-left: 2px;
  }
}
</style>
