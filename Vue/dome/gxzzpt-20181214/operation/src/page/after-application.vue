<template>
    <div id="after-application">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>售后</el-breadcrumb-item>
            <el-breadcrumb-item>售后申请</el-breadcrumb-item>
        </el-breadcrumb>
        <v-operation>
            <div slot="right" class="operation-right"><el-input v-model="params.keyword" placeholder="订单编号/接单供应商"> <el-button slot="append" icon="el-icon-search" @click="search"></el-button></el-input></div>
        </v-operation>
        <el-table :data="tableData"  border style="width: 100%" >
            <el-table-column label="订单编号" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.order.orderNumber}}</div>
                </template>
            </el-table-column>
            <el-table-column label="申请原因" prop="reasonTypeStr" align="center"></el-table-column>
            <el-table-column label="申请人" prop="nickName" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.user.username}}</div>
                </template>
            </el-table-column>
            <el-table-column label="电话" prop="phone" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.user.phone}}</div>
                </template>
            </el-table-column>
            <el-table-column label="邮箱" prop="email" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.user.email}}</div>
                </template>
            </el-table-column>
            <el-table-column label="接单供应商" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.dispatchCompany.companyName}}</div>
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="dealResultStr" align="center" width='140'></el-table-column>
            <el-table-column label="操作" align="center" width="180px">
                <template slot-scope="scope">
                    <span class="tb-blue-link" @click="$router.push({path:'/main/after-detail', query:{id: scope.row.id}})">申请详情</span>
                    <span v-if="scope.row.dealResult==400010" class="tb-blue-link" @click="$router.push({path:'/main/after-handler', query:{id: scope.row.id}})">去处理</span>
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
        'v-operation':OperationBar
    },
    data() {
        return {
            tableData:[],
            params: {
                pageSize: 5,
                pageIndex: 1,
                keyword: ''
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
    methods: {
        search() {
            this.getList();
        },
        getList() {
            this.$http.post('/operation/afterServiceRecord/getList', this.params).then(( res ) => {
                if ( res.data.code == 200 ) {
                    if ( Array.isArray( res.data.data ) ) {
                        this.tableData = res.data.data;
                    } else {
                        this.tableData = [];
                    }
                    this.pagination = res.data.pagination;
                }
            })
        },
        changePage( pageIndex ) {
            this.params.pageIndex = pageIndex;
            this.getList();
        },
    }
}
</script>
<style lang="less">
#after-application{
    .operation-right{
        width: 350px;
    }
    .tb-blue-link{
        color: #3f8def;
        cursor: pointer;
        margin: 0 10px;
    }
}
</style>
