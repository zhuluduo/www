<template>
  <div class="demander-manage">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>需求方管理</el-breadcrumb-item>
        <el-breadcrumb-item>个人方需求管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="box-head">
        <div class="search-input">
            <el-input @keyup.enter.native="search" v-model="ajaxData.keyword" placeholder="请输入搜索的个人信息" size="small"></el-input>
        </div>
        <div class="search">
            <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
        </div>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%" v-loading="loading" element-loading-text="数据加载中" header-row-class-name="co-f1">
        <el-table-column prop="index" label="序号" align="center"  width="80px">
        </el-table-column>
        <el-table-column prop="" label="账号" align="center" >
            <template slot-scope="scope">
              <div>{{scope.row.username}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="姓名" align="center">
        </el-table-column>
        <el-table-column prop="phone" label="电话" align="center">

        </el-table-column>
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="createTime" label="注册时间" align="center" width="160px"></el-table-column>
        <!-- <el-table-column prop="" label="操作" align="center" width="100px">
            <template slot-scope="scope">
                <span class="table-btn"  @click="$router.push({path:'/main/demander-details',query: { 'companyId':scope.row.id }})">详情</span>
            </template>
        </el-table-column> -->
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
    data(){
        return{
            input:'',
            loading:false,
            ajaxData: {
                pageIndex: 1,
                pageSize: 10,
                keyword: ""
            },
            tableData:[
            ],
            pagination:{
                currentPageIndex: 1,
                pageCount: 1,
                pageSize: 10,
                recordCount: 0
            },
        }
    },
    created(){
        this.getEnterpriseList()
    },
    methods:{
        search(){
            this.getEnterpriseList()   
        },
        getEnterpriseList(){
          this.loading = true;
            this.$http.post("/operation/company/getPersonalList", this.ajaxData).then(res => {
                if (res.data.code == 200) {
                    this.pagination=res.data.data.pagination;
                    this.tableData = res.data.data.list.length>0?res.data.data.list:[];
                    var index =(this.pagination.currentPageIndex - 1) * this.pagination.pageSize;
                    this.tableData.map((ele, i) => {
                        this.$set(ele, "index", index + i + 1);   
                    });
                    this.loading = false;
                    window.scrollTo(0,0);
                }
            }).catch(res => {});  
        },
        changPage(pageindex){
            this.ajaxData.pageIndex = pageindex;
            this.getEnterpriseList();
        },
    }
}
</script>

<style lang="less" scoped>
    .demander-manage{
        margin: 0 auto;
        .box-head{
            display: flex;
            margin: 20px 0 0 0;
            .search-input{
                width: 300px;
                margin-right: 20px;
            }
        }
        .table{
            margin-top: 30px;
            .isChecked{
                display: inline-block;
                background-color: #ff0000;
                width: 60px;
                text-align: center;
                border-radius: 5px; 
                margin-left: 5px;
            }
            .unchecked{
                background-color: #339966;
            }

            .table-btn{
                cursor: pointer;
            }
        }
        .pagination{
            margin-top:10px;
        }
    }
</style>


