<template>
    <div id="audit-requirement">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>需求</el-breadcrumb-item>
            <el-breadcrumb-item>待审核需求</el-breadcrumb-item>
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
                        <!-- <img src="../../static/img/fahuo.png" alt=""> -->
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
                <el-table-column prop="requirementNo" label="需求编号" align="center" width='120px'>
                     <template slot-scope="scope">
                        <div>
                           <P class="modal-name" @click="$router.push({path:'/main/requirement-details',query:{'id':scope.row.id}})">{{scope.row.requirementNo}}</P>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="零件名称" align="center">
                     <template slot-scope="scope">
                        <div>
                            <!-- <p v-for="(item,index) in scope.row.itemList" :key="index"> {{item.itemName}}</p> -->
                            <p> {{scope.row.itemList[0]?scope.row.itemList[0].itemName:''}}</p>
                            <p> {{scope.row.itemList[1]?scope.row.itemList[1].itemName:''}}</p>
                            <p> {{scope.row.itemList[2]?scope.row.itemList[2].itemName:''}}</p>
                        </div>
                    </template> 
                </el-table-column>
                <el-table-column  label="所属行业" align="center" >
                    <template slot-scope="scope">
                        <span>{{scope.row.industryInfo?scope.row.industryInfo.industryName:''}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="requirementTypeText" label="主工艺" align="center" width='100px'>
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
                <el-table-column prop="" label="操作" align="center" width="142px">
                    <template slot-scope="scope">
                        <span class="table-btn modal-name" @click="approveOperation(scope.row.id)">通过</span>
                        <span class="table-btn modal-name" @click="rejectOperation(scope.row.id)">驳回</span>
                        <!-- <span class="table-btn modal-name" @click="dialogVisible = true">驳回</span> -->
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
        <el-dialog
            title="驳回需求"
            center
            :visible.sync="dialogVisible"
            width="50%">
            <div class="dialogContent">
                <div class="dialogTitle">驳回原因 :</div>
                <el-input
                type="textarea"
                :autosize="{ minRows: 3, maxRows: 4}"
                v-model="textarea">
                </el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitReject()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import '../lib/filter.js'//引入时间和日期过滤器；
export default {
    data(){
        return{
            ajaxData: {
                pageIndex: 1,
                pageSize: 5,
                keyWord: ""
            },
            pagination: {
                currentPageIndex: 1,
                pageCount: 1,
                pageSize: 5,
                recordCount: 0
            },
            tableData:[
            ],
            loading:false,
            dialogVisible: false,
            textarea:'',
            id:'',
        }
    },
    created(){
        this.getToBeAllocatedList();
        this.getToAuditIDArray();
    },
    methods:{
        //获取待分配需求列表
        getToBeAllocatedList(){
            this.loading=true;
            this.$http.post("/operation/Requirement/getWaitForAuditList",this.ajaxData).then(res => {
                if (res.data.code == 200) {
                    this.pagination = res.data.pagination;
                    this.tableData = res.data.data.length > 0 ? res.data.data : [];
                    this.loading=false;
                }
            }).catch(res => {});
        },
        //获取全部的id数据
        getToAuditIDArray(){
            this.$http.post("/operation/Requirement/getWaitForAuditList").then(res => {
                if (res.data.code == 200) {
                    //将列表id储存本地起来;
                    let auditIDArray=[];
                    res.data.data.forEach(ele=>{
                        auditIDArray.push(ele.id)
                    });
                    localStorage.setItem('auditIDArray', JSON.stringify(auditIDArray))
                }
            }).catch(res => {});
        },
        //分页
        changPage(pageindex) {
            this.ajaxData.pageIndex = pageindex;
            this.getToBeAllocatedList()
        },
        //搜索查询；
        search() {
            this.getToBeAllocatedList();
        },
        //获取审核的API;
        getAuditApi(parameter){
            this.$http.post("/operation/Requirement/auditRequirements",parameter).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.message
                    });
                }else{
                    this.$message({
                        type: "error",
                        message: res.data.message
                    });
                }
                this.getToBeAllocatedList();
            }).catch(res => {});
        },
        //审核操作；
        approveOperation(id){
            let parameter={
                'id':Number(id),
                'adopt':true,
                "auditRemark": this.textarea,
            }
            this.getAuditApi(parameter);
        },
        //驳回操作；
        rejectOperation(id){
            this.dialogVisible=true;
            this.id=id;
        },
        //提交驳回消息；
        submitReject(){
            let parameter={
                'id':this.id,
                'adopt':false,
                "auditRemark": this.textarea,
            }
            this.dialogVisible=false;
            this.getAuditApi(parameter)
        },
    }
}
</script>
<style lang="less">
#audit-requirement{
    .el-dialog__header {
      padding: 10px;
      background-color: #ebebeb;
    }
    .el-form-item__content {
      line-height: 34px;
    }
    .el-dialog__headerbtn{
        top:15px;
    }
    .el-dialog__body {
        padding: 25px 25px 30px;
    }
}
</style>


<style lang="less" scoped>
   #audit-requirement{
        .box-head {
            display: flex;
            margin: 30px 0 30px 0;
            .search-input {
            width: 300px;
            margin-right: 20px;
            }
        }
        .table{
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
        .dialogTitle{
            padding-bottom:16px;
        }
    }
</style>
