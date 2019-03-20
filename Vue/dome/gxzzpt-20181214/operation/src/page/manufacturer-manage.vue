<template>
  <div class="company-manage">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>供应商管理</el-breadcrumb-item>
        <el-breadcrumb-item>企业供应商管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="box-head">
        <div class="search-input">
            <el-input @keyup.enter.native="search" v-model.trim="ruleForm.formSearch" clearable placeholder="请输入搜索的企业名" size="small"></el-input>
        </div>
        <div class="search">
            <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
        </div>
    </div>
    <div class="table">
      <el-table :data="tableData" border style="width: 100%" header-row-class-name="co-f1" v-loading="loading" element-loading-text="数据加载中">
        <el-table-column prop="index" label="序号" align="center"  width="60px">
        </el-table-column>
        <el-table-column prop="" label="申请企业全称" align='left' width="360px">
            <template slot-scope="scope">
              <!-- <span v-if="scope.row.manufacturerAuditStatusStr===undefined"></span> -->
              <div :v-if="!scope.row.manufacturerAuditStatusStr" class="companyName">
                <span class="enterpriseName"  @click="$router.push({path:'/main/manufacturer-details',query: { 'companyId':scope.row.id,'status':scope.row.manufacturerAuditStatus}})">{{scope.row.companyName}}</span>
                 <span class="isChecked"  :class="{ unchecked:scope.row.manufacturerAuditStatus===190020 }">{{scope.row.manufacturerAuditStatusStr}}</span>
              </div>
            </template>
        </el-table-column>
        <!-- <el-table-column prop="" label="企业规模" align="center" width="100px">
            <template slot-scope="scope">
              <span v-if="scope.row.extendInfo===undefined"></span>
              <span v-else>{{scope.row.extendInfo.employeeScaleStr}}</span>
            </template>
        </el-table-column> -->
        <el-table-column prop="" label="注册时间" align="center" width="100px">
            <template slot-scope="scope">
              <span v-if="scope.row.createTime===undefined"></span>
              <span v-else>{{scope.row.createTime}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="" label="涉及工艺" align="center" >
              <template slot-scope="scope">
                <span v-if="scope.row.techniqueInfo===undefined"></span>
                <span v-else v-for="(item,index) in scope.row.techniqueInfo" :key="index" class="pull-inline">{{item.techniqueName}}</span>
              </template>
        </el-table-column>
        <el-table-column prop="" label="状态" align="center" width="100px">
              <template slot-scope="scope">
                <span v-if="scope.row.putaway===undefined"></span>
                <el-switch v-model="scope.row.putaway" active-color="#13ce66" inactive-color="#ff4949" @change="handleClick(scope.row)"></el-switch>
                <!-- <el-button @click="handleClick(scope.row)" class="state-toggle state-hidde" type="text" size="small" v-if="scope.row.putaway">隐藏</el-button>
                <el-button @click="handleClick(scope.row)" class="state-toggle state-show" type="text" size="small" v-else>显示</el-button> -->
              </template>
        </el-table-column>
        <el-table-column prop="" label="操作" align="center" width="140px">
            <template slot-scope="scope">
                <span  class="enterpriseName" v-if="scope.row.manufacturerAuditStatus !=190020"   @click="$router.push({path:'/main/manufacturer-details',query: { 'companyId':scope.row.id,'status':scope.row.manufacturerAuditStatus}})">
                {{scope.row.manufacturerAuditStatusStr}}
                </span>
                <span class="enterpriseName" v-if="scope.row.manufacturerAuditStatus ==190020" @click="$router.push({path:'/main/manufacturer-information',query: { 'companyId':scope.row.id}})">企业资料</span>
            </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="page.currentPage"
      :page-size="page.size"
      layout="total, prev, pager, next"
      :total="page.total">
    </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
      ajaxData: {
        pageIndex: 1,
        pageSize: 5,
        keyword: ""
      },
      tableData: [],
      loading:false,
      ruleForm:{
        formSearch:'',
      },
       // 分页信息
      page:{
        currentPage:1, // 当前页
        size:10, // 每页大小
        total:0, // 总页数
      },
      ModifyPage:{
        techniqueData:''
      }
    };
  },
  created() {
    this.createdInfo();
    this.catalogName();
  },
  methods: {
      catalogName(){
        let url="/getWords";
        this.$http.post(url).then(res=>{
            var jsonObj = res.data.data
              for(let i in jsonObj){
              if(i==105){this.ModifyPage.techniqueData=jsonObj[i].item}
              }
        })
      },

    /*搜索*/
    search(){
      this.createdInfo();
    },
    /*处理分页事件*/
    handleSizeChange(val) {
      this.page.size = val;
      this.createdInfo();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.createdInfo();
    },

    /*初始化数据*/
    createdInfo(){
      this.loading = true;
      let url='/operation/company/getManufacturerList'
      let params={
        keyword:this.ruleForm.formSearch,
        pageIndex:this.page.currentPage,
        pageSize:this.page.size
      }
      this.$http.post(url,params).then(res=>{
        let data=res.data.data.list;
        let pageTotal=res.data.data.pagination.recordCount;
        if(data.constructor !=Array){
           data=[];
           pageTotal=0
        }
        this.page.total=pageTotal;
        this.tableData=data;
        this.loading = false;
        window.scrollTo(0, 0);
        var index =(this.page.currentPage - 1) * this.page.size;
        this.tableData.map((ele, i) => {
          this.$set(ele, "index", index + i + 1);
        });
        window.scrollTo(0,0);
      })
    },
    handleClick(row) {
      let params={
        companyId:row.id,
        putaway:row.putaway
      }
      this.$http.post('/operation/company/putaway',params).then(res=>{
        if(res.data.code==200){
          this.createdInfo();
        }
      })
    }
  }
};
</script>

<style lang="less" scoped>
.pull-inline{display: inline-block!important;}
.pull-inline+.pull-inline{
    &::before{
        content:",";
        width: 5px;
        display: inline-block;
        padding-left: 2px;
    }
}
.pagination{margin-top:10px;}
.company-manage {
  margin: 0 auto;
  .box-head {
    display: flex;
    margin: 20px 0 0 0;
    .search-input {
      width: 300px;
      margin-right: 20px;
    }
  }
  .table {
    margin-top: 30px;
    .enterpriseName{
      color: #409eff;
      cursor: pointer;
        &:hover{
          color: #208bfb;
          text-decoration: underline;
        }
    }
    .isChecked {
      display: inline-block;
      background-color: #ff0000;
      color: #fff;
      text-align: center;
      border-radius: 5px;
      margin-left: 10px;
      padding: 0 5px;
      height:25px;
    }
    .unchecked {
      background-color: #339966;
    }
    .companyName{
      text-align: left;
      display: flex;
      >span{
        display: inline-block;
      }
      >span:first-child{
        flex: 0 0 70%;
      }
    }
    .table-btn {
      cursor: pointer;
    }
    .aptitudeInfo {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .unloaded {
        width: 20px;
        height: 20px;
      }
      .unUnloaded {
        width: 12px;
        height: 12px;
      }
    }
  }
}
.state-toggle{
    width: 48px;
    height: 18px;
    display: inline-block;
    line-height: 3px;
    border-radius: 5px;
}
.state-show{color: #409eff;border:1px solid #409eff;}
.state-hidde{color: red;border:1px solid red;}
</style>