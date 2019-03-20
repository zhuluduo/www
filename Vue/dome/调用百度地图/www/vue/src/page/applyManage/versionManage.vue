<template>
	<div class="versionManage">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: 'publicEarth' }">共建地球</el-breadcrumb-item>
        <el-breadcrumb-item>版本管理</el-breadcrumb-item>
        </el-breadcrumb>
    </el-col>
      <el-col :span="24" class="container pull-top">
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <el-input @keyup.enter.native="Search" v-model.trim="ruleForm.formSearch" clearable class="finallblock" placeholder="请输入内容" size="small"></el-input>
        <el-button type="primary" size="small" @click="Search">搜索</el-button>
      </el-col>
      <el-col :xs="24" :sm="24" :md="12" :lg="12">
        <div class="pull-right">
        <el-button type="primary" size="small" @click="$router.push('versionDetails')">查看历史版本</el-button>
        </div>
      </el-col>
    </el-col>
    <el-col :span="24" class="container pull-top">
      <div class="baiduMap">
        <div id="allmap"></div>
      </div>
    </el-col>
    </el-row>
  </div>
</template>

<script>
import {MP} from '../../service/map.js'
export default {
  data () {
    return {
      ruleForm:{
        formSearch:''
      }
    }
  },
  methods:{
    //搜索
    Search(){
      console.log('搜索')
    },
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
  },
  mounted(){
    this.skMap();
  },
}
</script>
<style scoped lang='less'>
    #allmap{
    width: 100%;
    height: 500px;
  }
</style>