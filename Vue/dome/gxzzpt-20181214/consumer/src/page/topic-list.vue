<template>
    <div id="new-technology">
        <div class="content">
            <div class="crumb-bread">
                <span class="router-link" @click="$router.push({path:'/index'})">首页</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="curr">新技术专区</span>
            </div>
            <div class="search-bar">
                <v-operation>
                    <v-tabs :tabs="tabs" @click="changeTab"></v-tabs>
                    <div slot="right" class="search-right">
                        <el-input @keydown.native="searchByKeydown($event)" v-model="params.keyword" placeholder="需求编号/产品名称">
                            <i slot="suffix" class="el-input__icon el-icon-search search-icon" @click="searchByClick"></i>
                        </el-input>
                        <span class="btn" @click="publish">发表新帖</span>
                    </div>
                </v-operation>
            </div>
            <div class="main-content">
                <div class="left">
                    <div class="tab-item" :class="{active:!params.isMe}" @click="changeMenu(false)">所有帖子</div>
                    <div class="tab-item" :class="{active:params.isMe}" @click="changeMenu(true)">我的贴子</div>
                </div>
                <div class="right">
                    <div class="top">
                        <label for="">今日发帖：{{pagination.todayCount}}</label>
                        <label for="">历史发帖：{{pagination.recordCount}}</label>
                    </div>
                    <div class="table">
                        <el-table :data="tableData">
                            <el-table-column label="主题" prop="title" align="center" width="566">
                                <template slot-scope="scope">
                                   <span class="tb-link" @click="$router.push({path:'/topic/detail',query:{id:scope.row.id}})">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="回复" align="center" width="96">
                                <template slot-scope="scope">
                                   {{scope.row.replyCount}}
                                </template>
                            </el-table-column>
                            <el-table-column label="作者" align="center" width="196">
                                <template slot-scope="scope">
                                    {{scope.row.userInfo.username}}
                                </template>
                            </el-table-column>
                            <el-table-column label="最后回复" align="center" prop="lastReplyTime" width="190"></el-table-column>
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
            params:{
                keyword:'',
                isMe:false,
                topicPlate:null,
                pageIndex:1,
                pageSize:10,
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
        this.tabs.push({name:'新技术专区',id:null,isCheck:true});
        this.$LocalStorage.getWords(162).forEach((item) => {
            this.$set(item, 'isCheck', false);
            this.tabs.push(item);
        })

        this.getList();
    },
    methods: {
        changeMenu( isMe ) {
            this.params.isMe = isMe;
            if ( isMe ) {
                if ( !this.user.isValid ) {
                    this.$login({}, this.getList);
                } else {
                    this.getList();
                }
            } else {
                this.getList();
            }
        },

        searchByClick() {
            this.getList();
        },
        searchByKeydown( e ) {
            if( e.keyCode == 13 ) {
                this.getList();
            }
        },
        changeTab( tab ) {
            this.params.topicPlate = tab.id;
            this.getList();
        },
        changePage( pageIndex ) {
            this.params.pageIndex = pageIndex;
            this.getList();
        },
        getList() {
            this.$http.post('/custom/techTopic/list', this.params).then(( res ) => {
                if ( res.data.code == 200 && Array.isArray(res.data.data) ) {
                    this.tableData = res.data.data;
                    this.pagination = res.data.pagination;
                } else {
                    this.tableData = [];
                }
            })
        },
        publish() {
            if ( !this.user.isValid ) {
                this.$login({}, ()=>{
                    setTimeout(() => {
                        this.$router.push({path:'/topic/publish'})
                    }, 500);
                });
            } else {
                this.$router.push({path:'/topic/publish'})
            }
        }
    }
}
</script>

<style lang="less">
#new-technology{
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
                .top{
                    color: #a09f9f;
                    line-height: 40px;
                    label{
                        margin-right: 25px;
                    }
                }
            }
        }
    }
}
</style>
