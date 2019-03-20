<template>
    <div class="NeedCategory-manage">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>标准化配置</el-breadcrumb-item>
            <el-breadcrumb-item>行业分类</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="box-head">
            <div class="add-btn" @click="addBtnCategory">+ 添加行业分类</div>
        </div>
        <div class="table">
            <el-table :data="tableData" border style="width: 100%" header-row-class-name="co-f1">
                <el-table-column prop="index" label="序号" align="center"  width="100px">
                </el-table-column>
                <el-table-column prop="" label="行业名称" align="center">
                    <template slot-scope="scope">
                        <div>
                            <div>{{scope.row.industryName}}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="父类别" align="center">
                      <template slot-scope="scope" v-if="scope.row.industryCatalogInfo">
                        <div>
                            <div>{{scope.row.industryCatalogInfo.industryCatalogName}}</div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" align="center" width="242px">
                    <template slot-scope="scope">
                        <span class="table-btn"  @click="EditBtnCategory(scope.row)">编辑</span>
                        <span class="table-btn" @click="deleteCategoryBtn(scope.row.id)">删除</span>
                    </template>
                </el-table-column>
            </el-table>
        </div> 
        <el-dialog center  title="添加行业类别"  width="640px" :visible.sync="addForm.showAdd">
            <el-form  label-position="left" :model="addForm"  ref="addForm" :rules="addForm.rules" label-width="100px">
                <el-form-item label="行业名称 :" prop="categoryName">
                    <el-input v-model="addForm.categoryName"  placeholder="请选择行业名称"></el-input>
                </el-form-item>
                <el-form-item label="父类别 :" prop="categoryfatherName">
                    <el-select v-model="addForm.categoryfatherName" filterable  allow-create  placeholder="请选择父类别">
                       <el-option
                            v-for="item in addForm.industryCategory"
                            :key="item.id"
                            :label="item.industryCatalogName"
                            :value="item.industryCatalogName">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sbumitCategory">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog center  title="编辑行业类别"  width="640px" :visible.sync="EditForm.showAdd">
            <el-form  label-position="left" :model="EditForm"  ref="EditForm" :rules="EditForm.rules" label-width="100px">
                <el-form-item label="行业名称 :" prop="categoryName">
                    <el-input v-model="EditForm.categoryName" placeholder="请选择行业名称"></el-input>
                </el-form-item>
                <el-form-item label="父类别 :" prop="categoryfatherName">
                    <el-select v-model="EditForm.categoryfatherName" filterable  allow-create placeholder="请选择父类别">
                       <el-option
                            v-for="item in EditForm.industryCategory"
                            :key="item.id"
                            :label="item.industryCatalogName"
                            :value="item.industryCatalogName">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sbumitEditCategory">确 定</el-button>
            </div>
        </el-dialog>
         <div class="pagination">
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
    data() {
        return {
            tableData: [],
            ajaxData: {
                pageIndex: 1,
                pageSize: 6,
                keyword: ""
            },
            addForm: {
                showAdd: false,
                categoryName: "",
                categoryfatherName: "",
                industryCategory: [],
                rules: {
                categoryName: [
                    { required: true, message: "请选择行业名称", trigger: "blur" }
                ],
                categoryfatherName: [
                    { required: true, message: "请选择父类别", trigger: "change" }
                ]
                }
            },
            EditForm: {
                showAdd: false,
                categoryName: "",
                categoryfatherName: "",
                id: "",
                industryCategory: [],
                rules: {
                categoryName: [
                    { required: true, message: "请选择行业名称", trigger: "blur" }
                ],
                categoryfatherName: [
                    { required: true, message: "请选择父类别", trigger: "change" }
                ]
                }
            },
            pagination: {
                currentPageIndex: 1,
                pageCount: 1,
                pageSize: 6,
                recordCount: 0
            }
        };
    },
    created() {
        this.getNeedCategoryList();
    },
    methods: {
        getNeedCategoryList() {
            this.$http.post("/operation/industry/list", this.ajaxData).then(res => {
                if (res.data.code == 200) {
                    this.pagination = res.data.pagination;
                    // console.log(res.data);
                    this.tableData = res.data.data.length > 0 ? res.data.data : [];
                    var index =(this.pagination.currentPageIndex - 1) * this.pagination.pageSize;
                    this.tableData.map((ele, i) => {
                        this.$set(ele, "index", index + i + 1);
                    });
                }
            }).catch(res => {});
        },
        //添加行业分类API
        addCategory(requestParams) {
            this.$http.post("/operation/industry/add", requestParams).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.message
                    });
                    this.$refs["addForm"].resetFields(); //清除form表单数据；
                    this.addForm.showAdd = false;
                    //刷新页面；
                    this.getNeedCategoryList();
                } else {
                    this.$message({
                        type: "error",
                        message: res.data.message,
                        duration: 1000 //设置窗口关闭默认时间；
                    });
                }
            });
        },
        //编辑行业分类API
        EditCategory(requestParams) {
            this.$http.post("/operation/industry/update", requestParams).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.message
                    });
                    this.$refs["EditForm"].resetFields(); //清除form表单数据；
                    this.EditForm.showAdd = false;
                    //刷新页面；
                    this.getNeedCategoryList();
                } else {
                    this.$message({
                        type: "error",
                        message: res.data.message,
                        duration: 1000 //设置窗口关闭默认时间；
                    });
                }
            });
        },
        //获取全部列表
        getCategoryAll() {
            this.$http.post("/operation/industryCatalog/all").then(res => {
                    if (res.data.code == 200) {
                        // console.log(res.data.data);
                        this.addForm.industryCategory = res.data.data;
                    }
                }).catch(res => {});
            },
        //获取单列表
        getCategory(id) {
            this.$http.post("/operation/industry/get", { id: id }).then(res => {
                if (res.data.code == 200) {
                    this.EditForm.industryCategory = res.data.data.industryCatalogList;
                }
            }).catch(res => {});
        },
        //添加行业分类；
        sbumitCategory() {
            this.$refs["addForm"].validate(valid => {
                if (valid) {
                    let requestParams = {
                        industryCatalogName: this.addForm.categoryfatherName,
                        industryName: this.addForm.categoryName
                    };
                    // console.log(requestParams);
                    this.addCategory(requestParams);
                } else {
                    return false;
                }
            });
        },
        //更新行业分类
        sbumitEditCategory(item) {
            this.$refs["EditForm"].validate(valid => {
                if (valid) {
                    let requestParams = {
                        id: this.EditForm.id,
                        industryCatalogName: this.EditForm.categoryfatherName,
                        industryName: this.EditForm.categoryName
                    };
                    // console.log(requestParams);
                    this.EditCategory(requestParams);
                } else {
                    return false;
                }
            });
        },
        //添加按钮
        addBtnCategory() {
            this.addForm.showAdd = true;
            this.getCategoryAll();
        },
        //编辑按钮
        EditBtnCategory(item) {
            this.EditForm.showAdd = true;
            this.getCategory(item.id);
            this.EditForm.id = item.id;
            this.EditForm.categoryfatherName =
                item.industryCatalogInfo.industryCatalogName;
            this.EditForm.categoryName = item.industryName;
        },
        //删除按钮；
        deleteCategoryBtn(id) {
            this.$http.post("/operation/industry/delete", { id: id }).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.message,
                        duration: 1000 //设置窗口关闭默认时间；
                    });
                    //刷新页面；
                    this.getNeedCategoryList();
                } else {
                    this.$message({
                        type: "error",
                        message: res.data.message
                    });
                }
            });
        },
        //分页
        changPage(pageindex) {
            this.ajaxData.pageIndex = pageindex;
            this.getNeedCategoryList();
        }
    }
};
</script>

<style lang="less" scoped>
@common-color: #3f8def;
.NeedCategory-manage {
  .box-head {
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .add-btn {
      display: inline-block;
      color: #fff;
      padding: 10px 10px;
      font-size: 14px;
      background-color: @common-color;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  .table {
    .table-btn {
      cursor: pointer;
      margin: 0 10px;
    }
  }
}
</style>
