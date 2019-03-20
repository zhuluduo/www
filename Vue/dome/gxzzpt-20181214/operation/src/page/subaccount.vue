<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>设置</el-breadcrumb-item>
            <el-breadcrumb-item>子账户管理</el-breadcrumb-item>
        </el-breadcrumb>
        <v-operations>
             <div slot="right">
                 <el-button type="primary" @click="$router.push({path:'/main/add-subaccount'})">添加子账户</el-button>
             </div>
        </v-operations>
        <el-table :data="tableData"  border style="width: 100%" >
            <el-table-column label="序号"  type="index" align="center" width="100"></el-table-column>
            <el-table-column label="账号" prop="username" align="center"></el-table-column>
            <el-table-column label="姓名" prop="nickName" align="center"></el-table-column>
            <el-table-column label="电话" prop="phone" align="center"></el-table-column>
            <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
            <el-table-column label="状态" prop="isValid" align="center">
                <template slot-scope="scope">
                    <span class="tb-status-btn enable-btn" v-show="scope.row.isValid">已启用</span>
                    <span class="tb-status-btn disable-btn" v-show="!scope.row.isValid">已禁用</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="220px">
                <template slot-scope="scope">
                    <span class="tb-gray-link" @click="handleReset(scope.row)">重置密码</span>
                    <span class="tb-blue-link " @click="handleEdit(scope.row)">编辑</span>
                    <span class="tb-gray-link" @click="handleDelete(scope.row)">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="changePage" background layout="prev, pager, next" :page-count="pagination.pageCount" :current-page="pagination.currentPageIndex" :page-size="pagination.pageSize"></el-pagination>
        </div>
    </div>
</template>
<script>
import OperationBar from '../compoents/operation-bar.vue';
export default {
    components:{
        'v-operations':OperationBar
    },
    data() {
        return {
            tableData:[],
            ajaxData: {
                pageIndex: 1,
                pageSize: 5,
            },
            pagination: {
                currentPageIndex: 1,
                pageSize: 5,
                pageCount: 0
            },
        }
    },
    created() {
        this.getList();
    },
    methods:{
        changePage(p) {
            this.ajaxData.pageIndex = p;
            this.getList();
        },
        handleReset( row ) {
            this.$confirm('确认重置密码？','提示').then(() => {
                this.$http.post('/resetPassword', {userId: row.id}).then(( res ) => {
                    if ( res.data.code == 200 ) {
                        this.$message.success(res.data.message);
                    } else {
                        this.$error(res.data.message);
                    }
                })
            })
        },
        handleDelete( row ) {
            this.$confirm('确认删除该账户？','提示').then(() => {
                this.$http.post('/operation/user/deleteSubAccount',{userId: row.id}).then(( res ) => {
                    if ( res.data.code == 200 ) {
                        this.$message.success('删除成功');
                        this.getList();
                    } else {
                        this.$error(res.data.message);
                    }
                })
            })
        },
        handleEdit( row ) {
            this.$router.push({path:'/main/edit-subaccount', query:{id: row.id}});
        },
        getList() {
             this.$http.post("/operation/user/getSubAccountList", this.ajaxData).then(res => {
                if (res.data.code == 200) {
                    if ( Array.isArray( res.data.data ) ) {
                        this.tableData = res.data.data;
                    } else {
                        this.tableData = [];
                    }
                    this.pagination = res.data.pagination;
                } else {
                    this.$error(res.data.message);
                }
            });
        },
    }
}
</script>
<style lang="less" scoped>
.tb-blue-link{
    color: #3f8def;
    cursor: pointer;
    margin: 0 5px;
}
.tb-gray-link{
    cursor: pointer;
    margin: 0 5px;
}
</style>

