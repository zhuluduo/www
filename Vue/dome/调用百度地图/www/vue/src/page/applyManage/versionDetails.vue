<template>
	<div class="versionDetails">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: 'publicEarth' }">共建地球</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: 'versionManage' }">版本管理</el-breadcrumb-item>
        <el-breadcrumb-item >版本详情</el-breadcrumb-item>
        </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="container pull-top">
        <el-input @keyup.enter.native="Search" v-model.trim="ruleForm.formSearch" clearable class="finallblock" placeholder="请输入内容" size="small"></el-input>
        <el-button type="primary" size="small" @click="Search">搜索</el-button>
    </el-col>
    <el-col :span="24" class="container pull-top">
       <el-table
        ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"  >
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="name" label="描述"></el-table-column>
        <el-table-column prop="name" label="类型"></el-table-column>
        <el-table-column prop="name" label="大小"></el-table-column>
        <el-table-column prop="name" label="上传时间"></el-table-column>
        <el-table-column prop="name" label="上传人"></el-table-column>
        <el-table-column prop="address"  label="操作" show-overflow-tooltip>
        <template slot-scope="scope">
            <span @click="editTable(scope.row,scope.$index)" class="operation">查看</span>
            <span @click="deleteTable(scope.row,scope.$index)" class="operation">删除</span>
            <span @click="Edition(scope.row,scope.$index)" class="operation">使用当前版本</span>
        </template>
        </el-table-column>
    </el-table>
    <div class="pagination">
    <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout=" prev, pager, next,sizes,jumper"
        :total="400">
    </el-pagination>
    </div>
    </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      page:{
        currentPage:1,
      },
      ruleForm:{
        formSearch:'',
      },
      tableData:[],
    }
  },
  methods:{
      //分页
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
    //搜索
    Search(){

    },
    //查看
    editTable(val,index){

    },
    //删除
    deleteTable(val,index){

    },
    //版本使用状况
    Edition(val,index){

    },
  },
  mounted(){

  },
}
</script>
<style scoped lang='less'>
.pagination{text-align: right;margin-top: 20px;}   
</style>