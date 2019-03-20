<template>
    <div class="offered-requirement">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>需求</el-breadcrumb-item>
            <el-breadcrumb-item>报价结束需求</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="box-head">
            <div class="search-input">
                <el-input  v-model="ajaxData.keyWord" placeholder="需求编号" size="small"></el-input>
            </div>
            <div class="search">
                <el-button type="primary" icon="el-icon-search" size="small" @click="search" >搜索</el-button>
            </div>
        </div> 
        <div class="table">
              <el-table :data="tableData" border style="width: 100%" header-row-class-name="co-f1" v-loading="loading" element-loading-text="数据加载中">
                  <el-table-column label="缩略图" align="center"  width="100px">
                    <template slot-scope="scope">
                        <img :src="scope.row.itemList[0].firstModelFileInfo?scope.row.itemList[0].firstModelFileInfo.thumbnailUrl:''" alt="">
                    </template> 
                </el-table-column>
                <el-table-column label="提交时间" align="center" width="120px">
                    <template slot-scope="scope">
                        <div>
                           <P>{{scope.row.createTime|dayFilter}}</P>
                           <P>{{scope.row.createTime|timeFilter}}</P>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="requirementNo" label="需求编号" align="center" width="120px">
                </el-table-column>
                <el-table-column label="零件名称" align="center">
                     <template slot-scope="scope">
                        <div>
                            <p> {{scope.row.itemList[0]?scope.row.itemList[0].itemName:''}}</p>
                            <p> {{scope.row.itemList[1]?scope.row.itemList[1].itemName:''}}</p>
                            <p> {{scope.row.itemList[2]?scope.row.itemList[2].itemName:''}}</p>
                        </div>
                    </template> 
                </el-table-column>
                <el-table-column  label="所属行业" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.industryInfo?scope.row.industryInfo.industryName:''}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="requirementTypeText" label="主工艺" align="center"  width="100px">
                </el-table-column>
                <el-table-column prop="itemSum" label="零件" align="center"  width="60px">
                </el-table-column>
                <el-table-column label="有效期" align="center"  width="100px">
                     <template slot-scope="scope">
                        <div>
                            <span>{{scope.row.offerDeadlineTime|dayFilter}}</span>
                        </div>
                    </template> 
                </el-table-column>
                <el-table-column label="分派" align="center" width="60px">
                    <template slot-scope="scope">
                        <div v-if="scope.row.countPrice" class="dispatch-box" >
                            <span  @click="$router.push({path:'/main/requirement-details',query:{'id':scope.row.id,'select':'second'}})"><i>{{scope.row.countPrice.YBJ}}</i>家</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" align="center" width="120px">
                    <template slot-scope="scope">
                        <span class="table-btn modal-name" @click="$router.push({path:'/main/requirement-details',query:{'id':scope.row.id,'from': '/main/offered-requirement'}})">需求详情</span>
                    </template>
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
import '../lib/filter.js'//引入过滤器
export default {
   data(){
      return{
        ajaxData: {
            pageIndex: 1,
            pageSize: 6,
            keyWord: ""
        },
        pagination: {
            currentPageIndex: 1,
            pageCount: 1,
            pageSize: 6,
            recordCount: 0
        },
        tableData:[
        ],
        loading:false,
      }
    },
    created(){
        this.getAlreadyQuotedList();
    },
    methods:{
        //获取已报价列表
        getAlreadyQuotedList(){
            this.loading=true;
            this.$http.post("/operation/requirement/getAlreadyQuotedList",this.ajaxData).then(res => {
                if (res.data.code == 200) {
                    this.pagination = res.data.pagination;
                    this.tableData =res.data.data.length > 0 ? res.data.data : [];
                    this.loading=false;
                }
            }).catch(res => {});
        },
        //分页
        changPage(pageindex) {
            this.ajaxData.pageIndex = pageindex;
            this.getAlreadyQuotedList();
        },
        //搜索查询；
        search() {
            this.getAlreadyQuotedList();
        },
    }
}
</script>

<style lang="less" scoped>
    .offered-requirement{
        .box-head {
            display: flex;
            margin: 30px 0 30px 0;
            .search-input {
            width: 300px;
            margin-right: 20px;
            }
        }
        .table{
            .contacts{
                .companyName{
                    margin:0 20px 0 50px;
                    display: inline-block;
                    width: 200px;
                    text-align: center;
                }
            }
            .dispatch-box{
                cursor: pointer;
                i{
                    // color: red;
                    font-style:normal;
                }
            }
            .table-btn {
                // margin: 0 10px;
            }
            img{
                width: 80px;
                height: 30px;
                background-color: #e2e2e2;
                display: block;
            }
        }
        .modal-name{
            color: #3f8def;
            text-decoration: underline;
            white-space: nowrap;
            cursor: pointer;
        }
    }
</style>
