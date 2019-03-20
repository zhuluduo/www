<template>
    <div id="recruitment-index">
        <div class="content">
            <div class="crumb-bread">
                <span class="router-link" @click="$router.push({path:'/index'})">首页</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="curr">人才招聘</span>
            </div>
            <div class="search-wrapper">
                <div class="search-box">
                    <div class="search-input-box">
                        <el-select v-model="params.city" placeholder="请选择" class="pre-select"  @change='changeAddress()'>
                            <el-option v-for="item in addressList" :key="item.value" :label="item.value" :value="item.id">{{item.value}}</el-option>
                        </el-select>
                        <el-input placeholder="请输入内容" @keydown.native="searchByKeyboard($event)" v-model="params.keyword" class="input-with-select">
                        </el-input>
                        <span class="search-btn" @click="search">搜索</span>
                    </div>
                    <div class="type-box">
                        <div class="label">热门推荐：</div>
                        <div class="type-list">
                            <span @click="searchByType(item)" :class="{active:item.isCheck}" v-for="(item, index) in jobTypeList" :key="index">{{item.name}}</span>
                        </div>
                    </div>
                </div>
                <div class="entry-box apply-entry" v-if="(user.isValid && !user.isManufacturer)||!user.isValid">
                    <v-title :fontSize="14" title="求职入口"></v-title>
                    <img :src="user.portrait?user.portrait:require('../../static/img/icon-user.png')" alt="">
                    <div class="hello">Hi，你好</div>
                    <div class="btn-box">
                        <span class="btn login-btn" @click="user.isValid?refresh():login()">{{user.isValid?'刷新':'登录'}}</span>
                        <span class="btn register-btn" @click="user.isValid?edit():register()">{{user.isValid?'编辑':'注册'}}</span>
                    </div>
                </div>
                <div class="entry-box recruitment-entry" v-if="(user.isValid && user.isManufacturer)||!user.isValid">
                    <v-title :fontSize="14" title="招聘入口"></v-title>
                    <div class="btn-box">
                        <span class="btn search-btn" @click="toResumePage">简历搜索</span>
                        <span class="btn publish-btn" @click="toPublishResumePage">发布职位</span>
                    </div>
                </div>
            </div>
            <div class="data-list-wrapper">
                <div class="left">
                    <v-title title="招聘职位" withMore="true" @click="$router.push({path:'/job/index'})"></v-title>
                    <div class="list-box">
                        <el-table :data="jobList">
                            <el-table-column label="职位名称" prop="jobName" align="center" width="140">
                                <template slot-scope="scope">
                                    <span class="tb-link" @click="toJobDetail(scope.row)">{{scope.row.jobName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="公司名" prop="" align="center" width="220">
                                <template slot-scope="scope">
                                    <span class="tb-link" @click="toCompanyDetail(scope.row)">{{scope.row.companyInfo.companyName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="工作地点" prop="city" align="center" width="120"></el-table-column>
                            <el-table-column label="薪资" prop="salaryScopeText" align="center" width="144"></el-table-column>
                            <el-table-column label="发布时间" prop="createTime" align="center" width="126"></el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="right">
                    <v-title title="招聘企业" withMore="true" @click="$router.push({path:'/job/index'})"></v-title>
                    <div class="list-box">
                        <table>
                            <tr v-for="(item,index) in companyList" :key="'company' + index">
                                <td width="240px"><span class="td-company tb-link" @click="$router.push({path:'/job/index'})">{{item.companyName}}</span></td>
                                <td width="130px">正在招聘职位<span style="color:#3f8def;">{{item.companyJobInfoCount}}</span>个</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import title from './../components/title.vue';
import { mapState, mapActions } from 'vuex';
console.log(title);
export default {
    components: {
        'v-title':title,
    },
    data() {
        return {
            params:{
                keyword:'',
                jobPosition:null,
                pageIndex:1,
                pageSize:10,
                city:null
            },
            jobList:[],
            addressList: [
                {value:'全国', id: null},
                {value:'深圳', id: '深圳'}
            ],
            jobTypeList:[],
            companyList:[],
            pagination: {
                currentPageIndex: 1,
                pageSize: 10,
                pageCount: 0
            },
        }
    },
    computed: {
         ...mapState({
            user: state => state.user,
        }),
    },
    created() {
        this.jobTypeList = this.$LocalStorage.getWords(174).map(( item ) => {
            this.$set(item, 'isCheck', false);
            return item;
        });
        this.getList();
        this.getCompanyList();

        // this.ajaxRequest({
        //     method:'POST',
        //     url:'http://localhost:6020/custom/jobInfo/list',
        //     data:{
        //         keyword:'',
        //         jobPosition:null,
        //         pageIndex:1,
        //         pageSize:10
        //     },
        //     success: function( res ) {
        //         console.log(res);
        //     }
        // })
    },
    methods: {
        ajaxRequest( options ) {
            var xhr;
            if ( window.ActiveXObject ) {
                xhr = new ActiveXObject('Microsoft.XMLHTTP');
            } else {
                xhr = new XMLHttpRequest();
            }

            options = options || {};
            options.method.toUpperCase() || 'POST';
            options.url = options.url || '';
            options.async = options.async || true;
            options.success = options.success || function() {};
            options.data || null;

            var params = [];
            for(var key in options.data) {
                params.push(key + '=' + options.data[key]);
            }
            var paramsData = params.join('&');
            if ( options.method.toUpperCase() === 'POST' ) {
                xhr.open(options.method, options.url, options.async);
                xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
                xhr.send(paramsData);
            } else {
                xhr.open(options.method, options.url + '?' + paramsData, options.async);
                xhr.send(null);
            }
            xhr.onreadystatechange = function() {
                options.success(xhr.responseText);
            }
        },
        searchByType( type ) {
            this.jobTypeList.forEach( item => {
                item.isCheck = false;
            });
            type.isCheck = true;
            this.params.jobPosition = type.id;
        },
        changeAddress( ) {
        //    this.getList();
        },
        search() {
            this.$router.push({path:'/job/index', query:{keyword:this.params.keyword,jobPosition:this.params.jobPosition}});
        },
        searchByKeyboard( e ) {

        },
        toResumePage() {
            if ( this.user.isValid ) {
                this.$router.push({path:'/resume/list'});
            } else {
                this.$login({}, ()=>{
                    setTimeout(() => {
                        this.$router.push({path:'/resume/list'});
                    }, 500);
                });
            }
        },
        toPublishResumePage() {
            if ( this.user.isValid ) {
                this.$router.push({path:'/usercenter/position-issue'});
            } else {
                this.$login({}, ()=>{
                    if ( this.user.isValid && this.user.isManufacturer ) {
                        setTimeout(() => {
                            this.$router.push({path:'/usercenter/position-issue'});
                        }, 500);
                    }
                });
            }
        },
        getList() {
            this.$http.post('/custom/jobInfo/list', this.params).then(( res ) => {
                if ( res.data.code == 200 && Array.isArray( res.data.data )) {
                    this.jobList = res.data.data;
                    this.pagination = res.data.pagination;
                }
            })
        },
        getCompanyList() {
            this.$http.post('/custom/jobInfo/listGroupByCompany', {pageIndex:1, pageSize: 6}).then(( res ) => {
                if ( res.data.code == 200 && Array.isArray( res.data.data ) ) {
                    this.companyList = res.data.data;
                }
            })
        },
        refresh() {
            this.$http.post('/custom/ResumeBasic/updateResume').then(( res ) => {
                if ( res.data.code == 200 ) {
                    this.$success('刷新成功');
                } else {
                    this.$error(res.data.message);
                }
            })
        },
        login() {
            this.$login({});
        },
        edit() {
            this.$router.push({path:'/usercenter/my-resume'});
        },
        register() {
            this.$router.push({path:'/register/entry'});
        },
        toJobDetail( row ) {
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
#recruitment-index{
    .content{
        width: 1200px;
        margin: 0 auto;
        margin-bottom: 50px;
    }
    .search-wrapper{
        display: flex;
        justify-content: space-between;
        .search-box{
        //    width: 770px;
            flex: 1;
            height: 168px;
            background-color: #ffffff;
            padding: 40px 30px;
            box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
            .search-input-box{
                display: flex;
                .el-select, .el-select .el-input__inner, .el-input{
                    height: 30px !important;
                }
                .el-select{
                    width: 100px;
                    .el-input__inner{
                        border-right: 0;
                    }
                }
                .el-select .el-input.is-focus .el-input__inner,.el-select .el-input__inner:focus{
                    border-color: #d0d0d0;
                }
                .input-with-select{
                    border-left: 0;
                }
                .search-btn{
                    display: inline-block;
                    width: 78px;
                    height: 30px;
                    background-color: #3f8def;
                    line-height: 30px;
                    text-align: center;
                    color: #ffffff;
                }
            }
            .type-box{
                display: flex;
                margin-top: 18px;
                .label{
                    width: 62px;
                }
                .type-list{
                    flex: 1;
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
        .entry-box{
            width: 204px;
            height: 168px;
            background-color: #ffffff;
            box-shadow: 0px 2px 9px 0px rgba(180, 180, 180, 0.3);
            border-radius: 4px;
            padding: 9px 19px;
            margin-left: 10px;
        }
        .apply-entry{
            img{
                display: block;
                width: 46px;
                height: 46px;
                border-radius: 50%;
                border: 1px solid #e2e2e2;
                margin: 13px auto 11px;
            }
            .hello{
                font-size: 14px;
                text-align: center;
            }
            .btn-box{
                display: flex;
                justify-content: center;
                .btn{
                    display: block;
                    width: 66px;
                    height: 26px;
                    border-radius: 12px;
                    border: 1px solid #3f8def;
                    font-size: 14px;
                    line-height: 26px;
                    text-align: center;
                    margin: 12px;
                    cursor: pointer;
                }
                .login-btn{
                    background-color: #ffffff;
                    color: #3f8def;
                }
                .register-btn{
                    background-color: #3f8def;
                    color: #ffffff;
                }
            }
        }
        .recruitment-entry{
            .btn-box{
                margin-top: 35px;
                .btn{
                    display: block;
                    width: 96px;
                    height: 30px;
                    border-radius: 4px;
                    border: solid 1px #3f8def;
                    font-size: 14px;
                    text-align: center;
                    line-height: 30px;
                    margin: 0 auto 23px;
                    cursor: pointer;
                }
                .search-btn{
                    background-color: #ffffff;
                    color: #3f8def;
                }
                .publish-btn{
                    background-color: #3f8def;
                    color: #ffffff;
                }
            }
        }
    }
    .data-list-wrapper{
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        .left{
            width: 770px;
            .list-box{
                background-color: #ffffff;
                box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
                padding: 10px;
                margin-top: 13px;
                height: 468px;
            }
        }
        .right{
            width: 418px;
            .list-box{
                background-color: #ffffff;
                box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
                margin-top: 13px;
                padding: 10px 16px;
                height: 468px;
                table{
                    td{
                        padding: 10px 15px;
                        .td-company{
                            position: relative;
                           padding-left: 10px;
                            &::before{
                                position: absolute;
                                content: "";
                                width: 4px;
                                height: 4px;
                                border-radius: 50%;
                                background: #919191;
                                left: 0px;
                                top: 50%;
                                margin-top: -2px;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>

