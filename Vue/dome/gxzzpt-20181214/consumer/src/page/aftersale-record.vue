<template>
    <div id="aftersale-record">
        <div class="content">
            <v-operation>
                <v-tabs :tabs="tabs" @click="search"></v-tabs>
            </v-operation>
            <div class="table table-header-bg-gray">
                <el-table :data="tableData">
                    <el-table-column label="售后编号" prop="asNo" align="center" width="126"></el-table-column>
                    <el-table-column label="订单编号" align="center" width="148">
                        <template slot-scope="scope">
                            <div v-if="scope.row.order">{{scope.row.order.orderNumber}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="申请原因" prop="reasonTypeStr" align="center" width="90"></el-table-column>
                    <el-table-column label="接单供应商" align="center" width="228">
                        <template slot-scope="scope">
                            <div v-if="scope.row.dispatchCompany">{{scope.row.dispatchCompany.companyName}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="申请时间" prop="createTime" align="center" width="102"></el-table-column>
                    <el-table-column label="处理结果" prop="dealResultStr" align="center" width="142"></el-table-column>
                    <el-table-column label="状态" prop="orderTypeText" align="center" width="89">
                        <template slot-scope="scope">
                            <span class="tb-link" v-if="scope.row.dealResult==400010">等待处理</span>
                            <span class="tb-link" v-if="scope.row.dealResult!=400010">已处理</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="80">
                        <template slot-scope="scope">
                            <span class="tb-link" @click="$router.push({path:'/usercenter/aftersale-detail', query:{id:scope.row.id}})">详情</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination @current-change="changePage" background layout="prev, pager, next" :page-count="pagination.pageCount" :current-page="pagination.currentPageIndex" :page-size="pagination.pageSize"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import operationBar from '../components/operationBar.vue';
import Tabs from '../components/tabs.vue';
export default {
    components: {
        'v-operation': operationBar,
        'v-tabs': Tabs
    },
    data() {
        return {
            tableData: [1],
            tabs:[
                {name: '全部', statusList:[400010, 400020, 400030, 400040]},
                {name: '待处理', statusList:[400010]},
                {name: '已处理', statusList:[400020, 400030, 400040]}
            ],
            params:{
                pageSize: 5,
                pageIndex: 1,
                dealResults:[400010, 400020, 400030, 400040]
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
        search( tab ) {
            this.params.dealResults = tab.statusList;
            this.getList();
        },
        getList() {
            this.$http.post('/custom/afterServiceRecord/getList',this.params).then(( res ) => {
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
#aftersale-record{
    .content{
        margin: auto;
    }
}
</style>

