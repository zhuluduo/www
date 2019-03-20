<template>
    <div id="apply-after-sales">
        <div class="content">
            <v-operation>
                <div>订单完成后，交易商品出现问题且无法与供应商达成一致时，您可以发起售后申请，平台客服将介入与供应商协商处理</div>
            </v-operation>
            <div class="table table-header-bg-gray">
                <el-table :data="tableData">
                    <el-table-column label="订单编号" prop="orderNumber" align="center" width="202"></el-table-column>
                    <el-table-column label="商品" align="center" width="228">
                        <template slot-scope="scope">
                            <div v-for="item in scope.row.items">{{item.itemName}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单金额" prop="totalPrice" align="center" width="156"></el-table-column>
                    <el-table-column label="接单供应商" align="center">
                        <template slot-scope="scope">
                            <div>{{scope.row.dispatchCompany?scope.row.dispatchCompany.dispatchCompanyName:'-'}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" prop="orderTypeText" align="center" width="169">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="$router.push({path:'/usercenter/launch-aftersale', query:{id: scope.row.id}})">发起售后</el-button>
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
export default {
    components: {
        'v-operation': operationBar,
    },
    data() {
        return {
            tableData: [],
            params: {
                pageSize: 5,
                pageIndex: 1
            },
            pagination: {
                currentPageIndex: 1,
                pageSize: 5,
                pageCount: 0
            },
        }
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            this.$http.post('/custom/order/getAfterServiceOrderList', this.params).then(( res ) => {
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
            this.getData();
        },

    }
}
</script>
<style lang="less">
#apply-after-sales{
    .content{
        margin:0 auto;
        .operation-bar .left{
            flex: 6;
            color: #787878;
        }
    }
}
</style>

