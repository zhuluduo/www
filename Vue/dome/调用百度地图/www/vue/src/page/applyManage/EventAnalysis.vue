<template>
	<div class="EventAnalysis">
     <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: 'publicEarth' }">共建地球</el-breadcrumb-item>
        <el-breadcrumb-item>事件分析</el-breadcrumb-item>
        </el-breadcrumb>
     </el-col>

     </el-row>
    </div>
</template>

<script>
export default {
  data () {
    return {
      
    }
  },
  methods:{

  },
  mounted(){

  },
}
</script>