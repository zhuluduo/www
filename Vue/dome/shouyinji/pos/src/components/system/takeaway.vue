<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>系统设置</el-breadcrumb-item>
          <el-breadcrumb-item>外卖平台设置</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row :gutter="2">
        <el-col :space="24">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="name" label="平台名称" ></el-table-column>
            <el-table-column prop="date" label="状态" ></el-table-column>
            <el-table-column prop="address" label="关联账号"></el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button size="small" @click="Unbundling">取消关联</el-button>
                <el-button type="primary" size="small" @click="takeawayopen_dialog">关联</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
    </el-row>
    <el-dialog
      title="关联百度外卖" :visible.sync="dialogVisible" :close-on-click-modal="false" size="tiny" class="outter-Tit">
      <div class="outter-container">
        <div class=" username-form">
          <div class="input-wrapper">
            <label class="input-la"> 账号：</label>
            <div class="input-cont">
              <el-input v-model="outter.user_name" placeholder="请输入账号" size="small" class="form-inline"></el-input>
            </div>
          </div>
          <div class="input-wrapper">
            <label class="input-la"> 密码：</label>
            <div class="input-cont">
              <el-input v-model="outter.txtUserPwd" placeholder="请输入密码" size="small" class="form-inline"></el-input>
            </div>
          </div>
        </div>
        <div class="input_btn">
          <el-button  icon="close"  @click="dialogVisible = false" size="small">取消</el-button>
          <el-button type="primary" icon="check"  @click="takeawayopen" size="small">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Vue from 'vue';
  import {bus} from '../../bus.js'
    export default{
      data(){
            return {
              tableData:[{
                name: '百度外卖',
                date: '未绑定',
                address: '11111111',
              },
                {
                  name: '饿了么',
                  date: '已绑定',
                  address: '222222222',
                }],
              outter:{
                user_name:'',
                txtUserPwd:''
              },
              dialogVisible:false
            }

        },
        methods: {
            /*绑定外卖平台*/
          takeawayopen_dialog(){
            console.log("已绑定")
            this.dialogVisible=true
          },
          /*解除关联外卖平台*/
          Unbundling(){
            this.$confirm('是否取消关联?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.$message({
                type: 'success',
                message: '取消成功!'
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '放弃成功'
              });
            });

            console.log("已解绑")
          },
          takeawayopen(){
            if(this.outter.user_name!=''&&this.outter.user_name!=null&&this.outter.user_name!=undefined){
              this.$message({
                message: '恭喜你，这是一条成功消息',
                type: 'success'
              });
            }else {
              this.$message({
                message: '不能为空',
                type: 'warning'
              });
            }
          }
          },
          mounted() {

          }
    }
</script>
<style rel="stylesheet/scss" lang="scss">

</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  *{
    font-weight: normal;
    font-style: normal;
  }
  .form-inline, .form-inline .form-control {
    display: inline-block;
    width: auto;
    vertical-align: middle;
  }
   .outter-container{
     margin: 0 auto;
     max-width: 310px;
     .username-form{
       padding: 10px 0 20px 0;
       box-sizing: border-box;
       .input-wrapper{
         padding: 0 25px;
         margin-bottom: 10px;
         .input-la{
           width: 45px;
           vertical-align: middle;
           float: left;
         }
         .input-cont{
           margin-left: 45px;
           word-wrap: break-word;
         }
       }
     }
     .input_btn{text-align: center}
   }
</style>
