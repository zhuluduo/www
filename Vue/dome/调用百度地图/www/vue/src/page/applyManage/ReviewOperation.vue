<template>
	<div class="ReviewOperation">
        <el-row :gutter="10">
        <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: 'publicEarth' }">共建地球</el-breadcrumb-item>
        <el-breadcrumb-item>评审操作</el-breadcrumb-item>
        </el-breadcrumb>
        </el-col>
        <el-col :span="24" class="container pull-top">
            <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                <el-col :span="24">
                <el-input @keyup.enter.native="Search" v-model.trim="ruleForm.formSearch" clearable class="finallblock" placeholder="请输入内容" size="small"></el-input>
                <el-button type="primary" size="small" @click="Search">搜索</el-button>
                <span class="Search-text">共搜索到 922 条数据</span>
                </el-col>
                <el-tab-pane label="待评审" name="first">
                    <el-col :span="24" class="pull-select">
                      <el-table
                        ref="multipleTable" :data="tableData3" tooltip-effect="dark" style="width: 100%"     highlight-current-row @current-change="handleCurrentChange" >
                        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                        <el-table-column prop="name" label="评审项目"></el-table-column>
                        <el-table-column prop="name" label="要求"></el-table-column>
                        <el-table-column prop="name" label="任务奖励"></el-table-column>
                        <el-table-column prop="name" label="区域"></el-table-column>
                        <el-table-column prop="name" label="提交用户"></el-table-column>
                        <el-table-column prop="name" label="提交时间"></el-table-column>
                        <el-table-column prop="address"  label="提交资料" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span @click="editTable(scope.row,scope.$index)" class="operation">查看</span>
                        </template>
                        </el-table-column>
                        <el-table-column prop="address"  label="操作" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span @click="editTable(scope.row,scope.$index)" class="operation">查看模型</span>
                        </template>
                        </el-table-column>
                        <el-table-column prop="address"  label="评审" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span @click="editTable(scope.row,scope.$index)" class="operation">查看</span>
                        </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="10"
                        layout=" prev, pager, next,sizes,jumper"
                        :total="400">
                    </el-pagination>
                    </div>
                    </el-col>
                </el-tab-pane>
                <el-tab-pane label="已评审" name="second">
                    <el-col :span="24" class="pull-select">
                      <el-table
                        ref="multipleTable" :data="tableData2" tooltip-effect="dark" style="width: 100%"     highlight-current-row @current-change="handleCurrentChange" >
                        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                        <el-table-column prop="name" label="评审项目"></el-table-column>
                        <el-table-column prop="name" label="区域"></el-table-column>
                        <el-table-column prop="name" label="提交用户"></el-table-column>
                        <el-table-column prop="name" label="提交时间"></el-table-column>
                        <el-table-column prop="name" label="评审员"></el-table-column>
                        <el-table-column prop="name" label="状态"></el-table-column>
                        <el-table-column prop="address"  label="操作" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span @click="editTable(scope.row,scope.$index)" class="operation">查看</span>
                            <span @click="deleteTable(scope.row,scope.$index)" class="operation">删除</span>
                        </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[10, 20, 30, 40]"
                        :page-size="10"
                        layout=" prev, pager, next,sizes,jumper"
                        :total="400">
                    </el-pagination>
                    </div>
                    </el-col>
                </el-tab-pane>
            </el-tabs>
        </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
  data () {
    return {
      activeName:'first',
      ruleForm:{
          formSearch:'',
      },
      tableData3:[{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-08',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-06',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-07',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        tableData2:[],
        currentPage:1,
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
      handleClick(tab, event) {
        console.log(tab);
        console.log( event)
      },
      Search(){

      },
      handleCurrentChange(val){
       console.log(val)
     },
     editTable(val,index){
         console.log(val)
         console.log(index)
     },
     deleteTable(val,index){
         this.tableData2.splice(index, 1)
     },
  },
  mounted(){

  },
}
</script>
<style scoped lang='less'>
    .Search-text{
    color: #666666;
    padding: 5px 0;
    display: block;
    font-size: 13px;
    }
    .pull-select{padding: 0!important;margin-top: 10px;}
    .operation{
    cursor: pointer;
    color: #169bd5;
    &:hover{color: #10a8ea}
    }
    .pagination{text-align: right;margin-top: 20px;}   
</style>