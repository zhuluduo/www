<template>
	<div class="areaManage">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: 'publicEarth' }">共建地球</el-breadcrumb-item>
        <el-breadcrumb-item>区域管理</el-breadcrumb-item>
        </el-breadcrumb>
    </el-col>
    <el-col :span="24" class="container pull-top">
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-input @keyup.enter.native="Search" v-model.trim="ruleForm.formSearch" clearable class="finallblock" placeholder="请输入内容" size="small"></el-input>
        <el-button type="primary" size="small" @click="Search">搜索</el-button>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <div class="pull-right">
        <el-button type="primary" size="small" @click="editTask">编辑任务</el-button>
        <el-button type="primary" size="small" @click="cleanTask">清除任务</el-button>
        <el-button type="primary" size="small" @click="editType">编辑属性</el-button>
        </div>
      </el-col>
    </el-col>
    <el-col :span="24" class="container pull-top">
      <div class="baiduMap">
        <div id="allmap"></div>
      </div>
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
import {MP} from '../../service/map.js'
export default {
  data () {
    return {
      dialog:{
         dialogVisible:false,
         name:'新建建造任务'
      },
      ruleForm:{
        formSearch:'',
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
      }
    }
  },
  methods:{
    skMap(){
      MP('WGisSYWHrFFynEUtR8sihaVluQ6ERp8R').then(BMap =>{
    //地图初始化
      var bm = new BMap.Map("allmap");
      bm.centerAndZoom(new BMap.Point(116.378688937,39.9076296510), 15);
      bm.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
    	bm.enableContinuousZoom();    //启用地图惯性拖拽，默认禁用

      var polyline=[
        [
        new BMap.Point(116.383752, 39.91334),
        new BMap.Point(116.38792, 39.920866),
        new BMap.Point(116.390867, 39.906532)
      ],
        [
        new BMap.Point(117.383752, 39.91334),
        new BMap.Point(117.38792, 39.920866),
        new BMap.Point(117.490867, 39.906532),
        new BMap.Point(117.390867, 39.906532)
      ],
        [
        new BMap.Point(116.297047,39.979542),
        new BMap.Point(116.321768,39.88748),
        new BMap.Point(116.494243,39.956539)
        ]
      ];
     for(var m = 0; m < polyline.length; m++){
        var asd=new BMap.Polyline(polyline[m]);
      bm.addOverlay(new BMap.Polyline(polyline[m]), {strokeColor:"red", strokeWeight:6, strokeOpacity:0.5});
      }
      });
    },
    //搜索
    Search(){
      console.log('搜索')
    },
    //编辑任务
    editTask(){
        this.dialog.name='编辑任务',
        this.dialog.dialogVisible=true
        console.log('编辑任务')
    },
    //清除任务
    cleanTask(){
      console.log('清除任务')
    },
    //编辑属性
    editType(){
      this.dialog.name='编辑属性',
      this.dialog.dialogVisible=true
      console.log('编辑属性')  
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
    this.skMap();
  },
}
</script>
<style>
  .areaManage .el-dialog__header{text-align: center;}
</style>
<style scoped lang='less'>
  #allmap{
    width: 100%;
    height: 500px;
  }
</style>