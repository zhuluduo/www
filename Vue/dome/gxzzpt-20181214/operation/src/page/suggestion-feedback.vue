<template>
    <div class="account-settings">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>信息收集</el-breadcrumb-item>
            <el-breadcrumb-item>建议反馈</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="box-head">
            <div class="search-input">
                <el-input v-model="ajaxData.keyWord" placeholder="反馈内容" size="small"></el-input>
            </div>
            <div class="search">
                <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
            </div>
        </div>
        <div class="table">
              <el-table :data="tableData" border style="width: 100%" header-row-class-name="co-f1">
                <el-table-column prop="index" label="序号" align="center"  width="60px">
                </el-table-column>
                <el-table-column  prop="content"  show-overflow-tooltip  label="反馈内容" align="center">
                </el-table-column>
                <el-table-column label="反馈人" align="center"  prop="contactsName" width="100px">
                </el-table-column>
                <el-table-column prop="contactsPhone" label="电话"  align="center" width="120px">
                </el-table-column>
                <el-table-column prop="contactsEmail" label="邮箱"  align="center" width="180px">
                </el-table-column>
            </el-table>
        </div>
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
        ajaxData: {
            pageIndex: 1,
            pageSize: 10,
            keyWord: ""
        },
        pagination: {
            currentPageIndex: 1,
            pageCount: 1,
            pageSize: 10,
            recordCount: 0
        },
        tableData:[
        ], 
      };
    },
    created(){
        this.getfeedbackList();
    },
    methods: {
        getfeedbackList() {
            this.$http.post("/operation/feedback/list",this.ajaxData).then(res => {
                if (res.data.code == 200) {
                    this.pagination = res.data.pagination;
                    this.tableData =res.data.data.length > 0 ? res.data.data : [];
                    var index =(this.pagination.currentPageIndex - 1) * this.pagination.pageSize;
                    this.tableData.map((ele, i) => {
                        this.$set(ele, "index", index + i + 1);
                    });
                }
            }).catch(res => {
                
            });
        },
        //分页按钮：
        changPage(pageindex) {
            this.ajaxData.pageIndex = pageindex;
            this.getfeedbackList();
        },
        search(){
            console.log(this.ajaxData);
            this.getfeedbackList(); 
        }
    }
}
</script>

<style lang="less" scoped>
@common-color: #3f8def;
.box-head {
    display: flex;
    margin: 30px 0 30px 0;
    .search-input {
        width: 300px;
        margin-right: 20px;
    }
}
</style>

