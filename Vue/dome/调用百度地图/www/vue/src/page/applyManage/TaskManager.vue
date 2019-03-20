<template>
	<div class="TaskManager">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: 'publicEarth' }">共建地球</el-breadcrumb-item>
        <el-breadcrumb-item>任务管理</el-breadcrumb-item>
        </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="container pull-top">
        <el-col :span="24">
        <el-input @keyup.enter.native="Search" v-model.trim="ruleForm.formSearch" clearable class="finallblock" placeholder="请输入内容" size="small"></el-input>
        <el-button type="primary" size="small" @click="Search">搜索</el-button>
        </el-col>
        <el-col :span="24">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="pull-select">
            <el-select v-model="ruleForm.stateSelect" placeholder="状态筛选" size="small">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
                <el-select v-model="ruleForm.gradeSelect" placeholder="等级要求筛选" size="small">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" class="pull-select">
                <div class="pull-right">
                <el-button type="primary" size="small" @click="NewTask">编辑任务</el-button>
                <el-button type="primary" size="small" @click="cleanTask">清除任务</el-button>
                </div>
            </el-col>
        </el-col>
        <el-col :span="24">
        <el-table
            ref="multipleTable" :data="tableData3" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="name" label="任务名称"></el-table-column>
            <el-table-column prop="name" label="任务要求"></el-table-column>
            <el-table-column prop="name" label="任务限时"></el-table-column>
            <el-table-column prop="name" label="任务奖励"></el-table-column>
            <el-table-column prop="name" label="任务开始时间"></el-table-column>
            <el-table-column prop="name" label="状态"></el-table-column>
            <el-table-column prop="name" label="创建用户"></el-table-column>
            <el-table-column label="日期" width="120">
            <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column prop="address"  label="操作" show-overflow-tooltip>
            <template slot-scope="scope">
                <span @click="editTable(scope.row,scope.$index)" class="operation">编辑</span>
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
    </el-col>
    </el-row>
    <el-dialog :title="dialog.name" :visible.sync="dialog.dialogVisible" width="30%" @close='handleClose'>
    <span>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
        <el-form-item label="任务名称:" prop="name">
          <el-input v-model="ruleForm.name"  size="small"></el-input>
        </el-form-item>
        <el-form-item label="等级要求:" prop="region">
          <el-select v-model="ruleForm.region" placeholder="请选择等级" size="small">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格:" prop="Price">
          <el-input v-model="ruleForm.Price" size="small" ></el-input>
        </el-form-item>
         <el-form-item label="任务开始时间:" required>
          <el-form-item prop="date">
            <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date" style="width: 100%;" size="small"></el-date-picker>
          </el-form-item>
        </el-form-item>
        <el-form-item label="任务时间(分钟):" prop="TaskTime">
          <el-input v-model="ruleForm.TaskTime" size="small" ></el-input>
        </el-form-item>
        <el-form-item label="经验奖励:" prop="reward1">
          <el-input v-model="ruleForm.reward1" size="small"></el-input>
        </el-form-item>
        <el-form-item label="金币奖励:" prop="reward2">
          <el-input v-model="ruleForm.reward2" size="small" ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')" size="small">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </span>
    </el-dialog>  
    </div>
</template>

<script>
export default {
  data () {
    return {
       dialog:{
         dialogVisible:false,
         name:'编辑任务'
      },
      ruleForm:{
        formSearch:'',
        stateSelect:'',
        gradeSelect:'',
        name:'',
        region:'',
        Price:'',
        data:'',
        TaskTime:'',
        reward1:'',
        reward2:'',
      },
       rules:{
        name:[
           { required: true, message: '请输入活动名称', trigger: 'blur' }
           ],
        region:[
           { required: true, message: '请选择等级', trigger: 'change' }
          ],
        Price:[
          { required: true, message: '请输入价格', trigger: 'blur' }
          ],
        date:[
            {type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          ], 
        TaskTime:[
          { required: true, message: '请输入任务时间', trigger: 'blur' }
          ],
        reward1:[
          { required: true, message: '请输入经验奖励', trigger: 'blur' }
          ],
        reward2:[
          { required: true, message: '请输入金币奖励', trigger: 'blur' }
          ],   
      },
      options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
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
    //搜索
    Search(){
        
    },
    //新建任务
    NewTask(){
     this.dialog.dialogVisible=true
     console.log('新建任务')
    },
    //删除任务
    cleanTask(){
        console.log('删除任务')
    },
    refreshData(){
        // let url='http://jsonplaceholder.typicode.com/posts'
        // this.$http.GET(url).then(res=>{
        //     console.log(res)
        // })
    },
    handleSelectionChange(val){
       console.log(val)
    },
    //表格编辑
    editTable(val,index){
        this.dialog.dialogVisible=true
        console.log(val)
        console.log(index)
    },
    submitForm(formName){
    this.$refs[formName].validate((valid) => {
        if (valid) {
        alert('submit!');
        } else {
        console.log('error submit!!');
        return false;
        }
    });
    },
    resetForm(formName){
      this.$refs[formName].resetFields();
    },
    //关闭dialong
    handleClose(){
      this.dialog.dialogVisible=false
      console.log('关闭s')
    }
  },
  mounted(){
    //   this.refreshData();
  },
}
</script>
<style scoped lang='less'>
    .pull-select{padding: 0!important;margin-top: 10px;}
    .operation{
        cursor: pointer;
        color: #169bd5;
        &:hover{color: #10a8ea}
        }
    .pagination{text-align: right;margin-top: 20px;}   
</style>