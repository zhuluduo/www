<template>
    <div id="job-index">
        <div class="content">
            <div class="crumb-bread">
                <span class="router-link" @click="$router.push({path:'/index'})">首页</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="curr">人才招聘</span>
            </div>
            <div class="search-wrapper">
                <div class="search-input-box">
                    <el-input @keydown.native="searchByKeyboard($event)" v-model="params.keyword" placeholder="职位/公司"></el-input>
                    <el-select v-model="params.city" placeholder="地点" @change='search()'>
                        <el-option v-for="item in addressList" :key="item.value" :label="item.value" :value="item.id">{{item.value}}</el-option>
                    </el-select>
                    <el-select v-model="params.jobFunction" placeholder="职能" @change='search()'>
                        <el-option v-for="item in jobFunList" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
                    </el-select>
                    <div class="search-btn" @click="search">搜索</div>
                </div>
                <div class="type-box">
                    <div class="label">热门推荐：</div>
                    <div class="type-list">
                       <span @click="searchByType(item)" :class="{active:item.isCheck}" v-for="(item, index) in jobTypeList" :key="index">{{item.name}}</span>
                    </div>
                </div>
            </div>
            <div class="table-wrapper">
                <el-table :data="jobList">
                    <el-table-column label="职位名" prop="jobName" align="center" width="170">
                        <template slot-scope="scope">
                            <span class="tb-link" @click="toDetail(scope.row)">{{scope.row.jobName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="公司名" align="center" width="316">
                        <template slot-scope="scope">
                            <span class="tb-link" @click="toCompanyDetail(scope.row)">{{scope.row.companyInfo.companyName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="学历要求" prop="degreeLevelText" align="center" width="164"></el-table-column>
                    <el-table-column label="工作地点" prop="city" align="center" width="164"></el-table-column>
                    <el-table-column label="薪资" prop="salaryScopeText" align="center" width="198"></el-table-column>
                    <el-table-column label="发布时间" prop="createTime" align="center" width="168"></el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination @current-change="changePage" background layout="prev, pager, next" :page-count="pagination.pageCount" :current-page="pagination.currentPageIndex" :page-size="pagination.pageSize"></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            params:{
                keyword:'',
                jobFunction:'',
                city:null,
                adress:'',
                jobPosition:'',
                pageIndex:1,
                pageSize:10,
            },
            pagination: {
                currentPageIndex: 1,
                pageSize: 10,
                pageCount: 0
            },
            addressList: [
                {value:'全国', id: null},
                {value:'深圳', id: '深圳'}
            ],
            jobList:[],
            jobTypeList:[],
            jobFunList:[],
        }
    },
    created() {
        this.params.keyword = this.$route.query.keyword||'';
        this.params.jobPosition = Number(this.$route.query.jobPosition) || '';

        this.jobTypeList = this.$LocalStorage.getWords(174).map(( item ) => {
            if ( item.id == this.params.jobPosition ) {
                this.$set(item, 'isCheck', true);
                this.params.keyword = item.name;
            } else {
                this.$set(item, 'isCheck', false);
            }
            return item;
        });

        this.jobFunList = this.$LocalStorage.getWords(171);

        this.getList();
    },
    methods: {
        searchByType( type ) {
            this.jobTypeList.forEach( item => {
                item.isCheck = false;
            });
            type.isCheck = true;
            this.params.keyword = type.name;
            this.getList();
        },
        search() {
            this.getList();
        },
        searchByKeyboard(e) {
            if ( e.keyCode == 13 ) {
                this.getList();
            }
        },
         getList() {
            this.$http.post('/custom/jobInfo/list', this.params).then(( res ) => {
                if ( res.data.code == 200 && Array.isArray( res.data.data )) {
                    this.jobList = res.data.data;
                    this.pagination = res.data.pagination;
                } else {
                    this.jobList = [];
                    this.pagination = {currentPageIndex: 1,pageSize: 10,pageCount: 0};
                }
            })
        },
        changePage( p ) {
            this.params.pageIndex = p;
            this.getList();
        },
        toDetail( row ) {
            let {href} = this.$router.resolve({path:'/job/detail', query:{id: row.id}});
            window.open(href, '_blank');
        },
        toCompanyDetail( row ) {
            var {href} = this.$router.resolve({path:'/manufacturer-audits', query:{companyId:row.companyInfo.id}})
            window.open(href, '_blank');
        }
    }
}
</script>

<style lang="less">
#job-index{
    .content{
        width: 1200px;
        margin: 0 auto;
        margin-bottom: 50px;
        .search-wrapper{
            padding: 30px 30px 20px 30px;
            box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
            background-color: #ffffff;
            .search-input-box{
                display: flex;
                justify-content: flex-start;
                .el-input{
                    width: 350px;
                    margin-right: 9px;
                    height: 30px;
                }
                .el-select{
                    width: 117px;
                    margin-right: 9px;
                    height: 30px;
                    .el-input{
                        width: 117px;
                    }
                    .el-input__inner{
                        height: 30px !important;
                    }
                }
                .el-input__inner{
                    height: 30px;
                }
                .search-btn{
                    display: inline-block;
                    width: 78px;
                    height: 30px;
                    background-color: #3f8def;
                    color: #fff;
                    text-align: center;
                    line-height: 30px;
                }
            }
            .type-box{
                display: flex;
                margin-top: 18px;
                .label{
                    width: 62px;
                }
                .type-list{
                    width: 750px;
                    span{
                        display: inline-block;
                        margin-left: 10px;
                        margin-bottom: 10px;
                        padding: 2px 4px;
                        cursor: pointer;
                    }
                    .active{
                        background: #3f8def;
                        color: #ffffff;
                    }
                }
            }
        }
        .table-wrapper{
            height: 502px;
            margin-top: 10px;
            padding: 10px;
            background-color: #ffffff;
        }
    }
}
</style>
