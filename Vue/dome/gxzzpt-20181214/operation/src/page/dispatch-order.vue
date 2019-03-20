<template>
    <div class="requirement-details">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>需求</el-breadcrumb-item>
            <el-breadcrumb-item>待分配需求</el-breadcrumb-item>
            <el-breadcrumb-item>分派</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="box">
            <div class="list">
                <div class="listTitle">需求编号：{{tableData.requirementNo}}</div>
                <div class="row">
                    <div class="row-col">
                        <p class="title">分派:</p>
                        <div class="row-content ">
                            <div class="dispatch">
                                <el-form  label-width="85px"  ref="ruleForm" labelPosition='left' :rules="rules" :model="formLabelAlign">
                                    <el-form-item label="分派到: " prop="name">
                                        <el-input  v-model="formLabelAlign.name" @focus="dialogVisible"></el-input>
                                    </el-form-item>
                                    <el-form-item label="分派说明: " prop="type">
                                        <el-input v-model="formLabelAlign.type" type="textarea" ></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" plain  @click="submitForm('ruleForm')">保存</el-button>
                                        <el-button type="primary" plain @click="submitFormSave('ruleForm')">保存并分派供应商</el-button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="分派" :visible.sync="dialogTableVisible" width='880px'>
            <div class="search-box">
                <div>
                    <span class="search-text">标签:</span>
                    <div class="search-tag">
                        {{tableData.requirementTypeText}}
                    </div>
                </div>
                <div>
                    <span class="search-text">供应商：</span>
                    <div class="search-input">
                        <el-input placeholder="请输入搜索的企业名" v-model="ajaxData.keyword" size="small"></el-input>
                    </div>
                    <div class="search">
                        <el-button type="primary" @click="searchCompany" icon="el-icon-search" size="small" >搜索</el-button>
                    </div>
                </div>
            </div>
            <div class="manufacturerInfo">
                <span class="manufactureName">已选供应商：</span>
                <span v-for="(item,index) in selectedCompanyArray" :key="index">
                    {{item.companyName}}
                    <i @click="cancelSelected(index,item.id)" class="el-icon-circle-close-outline" ></i>
                </span>
            </div>
            <div>
                <el-table :data="gridData" border style="width:100%">
                    <el-table-column label="企业名称" width='180px'>
                        <template slot-scope="scope">
                            <div >{{scope.row.companyName}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="地区" align='left' width='140px'>
                        <template slot-scope="scope">
                            <!-- <div>{{scope.row.province}}{{scope.row.city}}{{scope.row.region}}{{scope.row.address}}</div> -->
                            <div>{{scope.row.province}}{{scope.row.city}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop='techniqueInfoDesc' label="工艺">

                    </el-table-column>
                    <el-table-column prop="offerCount"  label="历史报价" width='80px'></el-table-column>
                    <el-table-column label="综合评价" width='80px'>
                        <template slot-scope="scope">
                            <div >{{scope.row.commentScore.manufacSideScore?scope.row.commentScore.manufacSideScore:'暂无'}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作" width='80px'>
                        <template slot-scope="scope">
                            <el-button plain size="small"  @click="selected(scope.row.companyName,scope.row.id)">选择</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination 
                @current-change="changPage"
                :current-page="pagination.pageIndex"
                :page-size="pagination.pageSize"
                layout="total, prev, pager, next" 
                :total="pagination.recordCount">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sbumitDispatch">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            options: [],
            formLabelAlign: {
                name: '',
                type: ''
            },
            rules: {
                name: [
                    { required: true, message: '请选择公司'},
                ],
                type: [
                    { required: true, message: '请输入分派说明',trigger: 'blur'}
                ],
            },
            //设置选择当前时间后的时间;
            pickerOptions:{
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7
                }
            },
            tempDispatchCompanyIds:[],//临时储存Id
            value:[],
            ajaxData: {
                pageIndex: 1,
                pageSize: 5,
                isManufacturer: true,
                manufacturerAuditStatus: 190020,
                keyword: "",
                putaway:true,
                tags:[],
                techniqueIds:[],
            },
            pagination: {
                currentPageIndex: 1,
                pageCount: 1,
                pageSize: 5,
                recordCount: 0
            },
            tableData :[],
            dialogTableVisible: false,
            gridData: [], 
            selectedCompany:{}, 
            selectedCompanyArray:[], 
        }
    },
    created(){
        this.getRequirementDetails();
        // this.getSaveCompanyList()
    },
    methods: {
        //获取联系人信息；
        getRequirementDetails(){
            let detailsId = Number(this.$route.query.id) 
            this.$http.post("/operation/requirement/getRequirementDetails",{"id":detailsId}).then(res => {
                if (res.data.code == 200) {
                    this.tableData =res.data.data;
                    this.formLabelAlign.type=this.tableData.dispatchExplain;
                    this.selectedCompanyArray=this.tableData.companys.length>0?this.tableData.companys:[];
                    this.ajaxData.techniqueIds.push(res.data.data.techniqueId)
                    this.sbumitDispatch();
                }
            }).catch(res => {});
        },
        //获取公司列表；
        getCompanyList(){
            this.$http.post("/operation/company/getManufacturerList",this.ajaxData).then(res => {
                if (res.data.code == 200) {
                    this.pagination = res.data.data.pagination;
                    this.gridData=res.data.data.list.length ? res.data.data.list:[];
                    //拼接工艺;
                    this.gridData.map(ele=>{
                        let techniqueInfoDesc='';
                        ele.techniqueInfo.forEach(item=>{
                            techniqueInfoDesc += item.techniqueName+', ';
                        })
                        techniqueInfoDesc=techniqueInfoDesc.slice(0,techniqueInfoDesc.length-2)
                        this.$set(ele,'techniqueInfoDesc',techniqueInfoDesc);
                    })  
                }
            }).catch(res => {});
        },
        //搜索公司;
        searchCompany(){
            // this.options=[];
            // this.ajaxData.tags.forEach(ele=>{
            //     this.options.push({value:ele,label:ele})
            // })
            this.getCompanyList()
        },
        //分派需求信息API；
        saveAssignment(requestParams){
            this.$http.post("/operation/requirement/assignment",requestParams).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.message
                    });
                    setTimeout(()=>{
                        this.$router.push({path:'/main/distributing-requirement'})
                    },1000)
                }else {
                    this.$error(res.data.message);
                }
            }).catch(res => {

            });
        },
        //保存需求分派信息API；
        savePreservationAssignment(requestParams){
            this.$http.post("/operation/requirement/preservationAssignment",requestParams).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.message
                    });
                }else {
                    this.$error(res.data.message);
                }
            }).catch(res => {});
        },
        //input输入框@focu事件；
        dialogVisible(){
            this.dialogTableVisible=true;
            this.getCompanyList();
        },
        //提交选择公司选择;
        sbumitDispatch(){
            this.formLabelAlign.name='';
            this.selectedCompanyArray.forEach(ele=>{
                this.formLabelAlign.name += ele.companyName + ",";
            })
            this.formLabelAlign.name=this.formLabelAlign.name.slice(0, this.formLabelAlign.name.length-1)
            this.dialogTableVisible=false;
        },
        //选择公司按钮;
        selected(companyName,id){
            this.selectedCompany={},
            this.selectedCompany["id"]=id;
            this.selectedCompany["companyName"]=companyName;
            if(this.selectedCompanyArray.length!=0){
                let flag =false;
                this.selectedCompanyArray.forEach(ele => {
                    if(ele.id == id){
                       flag =true;
                    }
                });
                if(!flag){
                    this.selectedCompanyArray.push(this.selectedCompany);
                }
            }else{
                this.selectedCompanyArray.push(this.selectedCompany);
            }
        },
        //删除选择公司;
        cancelSelected(index,id){
            this.selectedCompanyArray.splice(index,1)
        },
        //分页
        changPage(pageindex) {
            this.ajaxData.pageIndex = pageindex;
            this.getCompanyList()
        },
        //保存需求分派信息
        submitForm(name){
             this.$refs[name].validate(valid => {
                if (valid) {
                    let detailsId = this.$route.query.id;
                    let companysArray=[];
                    this.selectedCompanyArray.forEach(ele =>{
                        companysArray.push(ele.id)
                    })
                    let requestParams = {
                        "id": Number(detailsId),
                        "tags":  this.ajaxData.tags.length>0 ? this.ajaxData.tags:null,
                        "dispatchExplain": this.formLabelAlign.type,
                        "companys": companysArray
                    };
                    this.savePreservationAssignment(requestParams);
                } else {
                    return false;
                }
            });
        },
        //分派需求信息
        submitFormSave(name){
             this.$refs[name].validate(valid => {
                if (valid) {
                    let Id = this.$route.query.id;
                    let companysArray=[];
                    this.selectedCompanyArray.forEach(ele =>{
                        companysArray.push(ele.id)
                    })
                    let requestParams = {
                        "id": Number(Id),
                        "tags": this.ajaxData.tags.length>0 ? this.ajaxData.tags>0:null,
                        // "offerDeadlineTime":this.formLabelAlign.datatime,
                        "dispatchExplain": this.formLabelAlign.type,
                        "companys": companysArray
                    };
                    // console.log(requestParams);
                    this.saveAssignment(requestParams);   
                } else {
                    return false;
                }
            });
        }
    }
}
</script>

<style lang="less" scoped>
    @common-color: #20a0ff; 
    .box {
        padding: 0px 20px;
    }
    p{
        padding: 12px 0;
    }
    .listTitle{
        padding: 15px 0 0 0;
    }
    .title{
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 15px;
        padding:0px 
    }
    .list {
        .row {
            margin: 12px 0 24px 0;
            display: flex;
            .row-col {
                flex: 1;
                & + .row-col {
                    margin-left: 66px;  
                }
            }
            .row-content {
                background: #f5f5f5;
                padding:20px;
            }
            .dispatch{
                width: 800px;
            }
        }
    }
    .btn {
        display: inline-block;
        // background-color: @common-color;
        color: #333333;
        border: 1px solid  @common-color;
        width: 120px;
        height: 36px;
        margin:0 20px;
        cursor: pointer;
        border-radius:6px;
        text-align: center;
        line-height: 36px; 
    }
    .search-box {
        display: flex;
        align-content: center;
        margin: 0 0 10px 0;
        >div{
          display: flex;  
        }
        .search-text{
            display: inline-block;
            width: 60px;
            text-align: left;
            line-height: 32px;
        }
        .search-tag{
            margin-right: 20px;
            width: 260px;
            padding-left:10px; 
            border: 1px solid #dcdfe6;
            border-radius: 5px;
            line-height: 34px;
        }
        .search-input {
            width: 300px;
            margin-right: 10px;
        }
    }
    .manufacturerInfo{
        line-height: 50px;
        span{
            display: inline-block;
            position: relative;
            margin: 0 15px;
            i{
                position: absolute;
                font-style:normal;
                top: 10px;
                right:-20px;
                font-size: 16px;
                cursor: pointer;
            }
        }
        .manufactureName{
            margin: 0;
        }
    }
</style>