<template>
    <div id="new-technology">
        <div class="content">
            <div class="crumb-bread">
                <span class="router-link" @click="$router.push({path:'/index'})">首页</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="curr">设备交易</span>
            </div>
            <div class="search-bar">
                <v-operation>
                    <v-tabs :tabs="tabs" @click="changeTab"></v-tabs>
                    <div slot="right" class="search-right">
                        <!-- <el-input @keydown.native="searchByKeydown($event)" v-model="params.keyword" placeholder="需求编号/产品名称">
                            <i slot="suffix" class="el-input__icon el-icon-search search-icon" @click="searchByClick"></i>
                        </el-input> -->
                        <span class="btn" @click="publish">发布二手设备</span>
                    </div>
                </v-operation>
            </div>
            <div class="main-content">
                <div class="left">
                    <div class="tab-item" :class="{active:searchAll}" @click="search(true)">所有交易</div>
                    <div class="tab-item" :class="{active:!searchAll}" @click="search(false)">我发布的</div>
                </div>
                <div class="right">
                    <!-- <div class="top">
                        <label for="">今日发帖：5</label>
                        <label for="">历史发帖：{{pagination.recordCount}}</label>
                    </div> -->
                    <div class="table">
                        <el-table :data="tableData">
                            <el-table-column label="" align="center" width="130">
                                <template slot-scope="scope">
                                    <div class="td-img-template">
                                        <img :src="scope.row.coverPicturl" alt="" class="tb-img">
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="设备交易标题" align="center" prop="title" width="336">
                                <template slot-scope="scope">
                                    <span class="tb-link" @click="toDetail(scope.row)">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="价格" align="center" prop="priceInfo" width="96"></el-table-column>
                            <el-table-column label="发布人" align="center" prop="username" width="196"></el-table-column>
                            <el-table-column label="发布时间" align="center" prop="createTime" width="190"></el-table-column>
                            <el-table-column label="" align="center" width="100">
                                <template slot-scope="scope">
                                    <i class="el-icon-delete" v-if="user.id == scope.row.userId" @click="deleteItem(scope.row)"></i>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="pagination">
                        <el-pagination @current-change="changePage" background layout="prev, pager, next" :page-count="pagination.pageCount" :current-page="pagination.currentPageIndex" :page-size="pagination.pageSize"></el-pagination>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import tabs from '../components/tabs.vue';
import operationBar from '../components/operationBar.vue';
import { mapState } from 'vuex';
export default {
    components: {
        'v-tabs':tabs,
        'v-operation': operationBar,
    },
    data() {
        return {
            tabs:[],
            searchAll:true,
            params:{
                userId:null,
                equipTags:[],
                pageIndex:1,
                pageSize:5
            },
            pagination: {
                currentPageIndex: 1,
                pageSize: 10,
                pageCount: 0
            },
            tableData:[]
        }
    },
    computed: {
        ...mapState({
            user: state => state.user,
        }),
    },
    created() {
        this.tabs.push({name:'设备标签',id:null,isCheck:true});
        this.$LocalStorage.getWords(161).forEach((item) => {
            this.$set(item, 'isCheck', false);
            this.tabs.push(item);
        })
        this.getList();
    },
    methods: {

        search( searchAll ) {
            this.searchAll = searchAll;
            if ( ! searchAll ) {
                if ( !this.user.isValid ) {
                    this.$login({}, this.getList);
                } else {
                    this.getList();
                }
            } else {
                this.getList();
            }
        },
        getList() {
            if ( !this.searchAll ) {
                this.params.userId = this.user.id;
            } else {
                this.params.userId = null;
            }
            this.$http.post('/custom/EquipSale/getList', this.params).then(( res ) => {
                if ( res.data.code == 200 && Array.isArray(res.data.data) ) {
                    this.tableData = res.data.data;
                    this.pagination = res.data.pagination;
                } else {
                    this.tableData = [];
                }
            })
        },
        changeTab( tab ) {
            if ( tab.id === null ) {
                this.params.equipTags = [];
            } else {
                this.params.equipTags = [tab.id];
            }
            this.getList();
        },
        changePage( pageIndex ) {
            this.params.pageIndex = pageIndex;
            this.getList();
        },
        toDetail(row) {
            if ( !this.user.isValid ) {
                this.$login({}, ()=>{
                    setTimeout(() => {
                        this.$router.push({path:'/enquipment/detail', query:{id: row.id}});
                    }, 500);
                });
            } else {
                this.$router.push({path:'/enquipment/detail', query:{id: row.id}});
            }
        },
        publish() {
             if ( !this.user.isValid ) {
                this.$login({}, ()=>{
                    setTimeout(() => {
                        this.$router.push({path:'/enquipment/publish'});
                    }, 500);
                });
            } else {
                this.$router.push({path:'/enquipment/publish'});
            }
        },
        deleteItem( row ) {
            this.$confirm('确定删除该条记录？','提示').then(() => {
                this.$http.post('/custom/EquipSale/remove',{id: row.id}).then(( res ) => {
                    if ( res.data.code == 200 ) {
                        this.$success('删除成功');
                        this.getList();
                    } else {
                        this.$error(res.data.messaeg);
                    }
                })
            })
        }
    }
}
</script>

<style lang="less">
#new-technology{
    .td-img-template{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 0;
        height: 118px;
    }
    .tb-img{
        display: block;
        max-width: 118px;
        max-height: 94px;
    }
    .el-icon-delete{
        cursor: pointer;
        color: #3f8def;
    }
    .content{
        width: 1200px;
        margin: 0 auto;
        margin-bottom: 50px;
        .crumb-bread{
            height: 35px;
            line-height: 35px;
            .router-link{
                cursor: pointer;
                &:hover{
                    color: #3f8def;
                    text-decoration: underline;
                }
            }
            .right-arrow{
                margin: 0 5px;
            }
            .curr{
                color: #3f8def;
            }
        }
        .search-bar{
            background: #fff;
            padding: 0 15px;
            .el-icon-search:before{
                font-size: 18px;
                color: #a4a4a4;
                cursor: pointer;
            }
            .el-input__icon{
                line-height: 26px;
            }
            .el-input{
                width: 214px;
                margin-right: 35px;
            }
            .search-right{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .btn{
                    display: inline-block;
                    width: 98px;
                    height: 32px;
                    border-radius: 4px;
                    font-size: 14px;
                    color: #fff;
                    line-height: 32px;
                    text-align: center;
                    background: #3f8def;
                    cursor: pointer;
                }
            }
        }
        .main-content{
            display: flex;
            margin-top: 14px;
            .left{
                width: 97px;
                height: 824px;
                padding: 0 10px;
                background: #c4dcfa;
                .tab-item{
                    height: 54px;
                    border-bottom: 1px solid #d7d7d7;
                    font-size: 14px;
                    text-align: center;
                    line-height: 54px;
                    color: #a09f9f;
                    cursor: pointer;
                }
                .active{
                    color: #3f8def;
                    border-bottom: 1px solid #3f8def;
                }
            }
            .right{
                flex: 1;
                padding: 8px 28px;
                background: #fff;
                .table{
                    margin-top: 25px;
                }
            }
        }
    }
}
</style>
