<template>
    <div>
    <div class="section-title section-title-border">
    <div class="pull-left">
        <h5><span>角色管理</span></h5>
    </div>
    <div class="pull-right">
        <el-button type="primary" size="small">添加角色</el-button>
    </div>
    </div>
    <div class="section-ng-scope">
         <el-table :data="tableRole" style="width: 100%"  empty-text="查询不到相关的记录">
      <el-table-column prop="date" label="角色编号"></el-table-column>
      <el-table-column prop="name" label="角色名称" ></el-table-column>
      <el-table-column prop="address" label="用户数"></el-table-column>
      <el-table-column prop="address" label="创建者"></el-table-column>
      <el-table-column prop="address" label="最后编辑时间"></el-table-column>
      <el-table-column prop="address" label="状态"></el-table-column>
      <el-table-column prop="address" label="删除状态"></el-table-column>
      <el-table-column  label="操作">
          <template slot-scope="scope">
              <a >编辑</a>
              <a >删除</a>
          </template>
      </el-table-column>
    </el-table>
   </div>
   </div>
</template>


<script>
    export default{
        data(){
            return{
                tableRole:[],
            }
        },
        methods:{
            //加载数据
            getTable(){

            },
        },
        mounted(){

        }
    }
</script>

<style lang="scss">

</style>

<style lang="scss"  scoped>

</style>
