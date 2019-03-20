<template>
	<div id="myBtn">
    <div id="allmap"></div>
  </div>
  <!-- <div id="demo">222</div> -->
</template>

<script>
import {MP} from '../service/map.js'
export default {
  name: 'dome',
  data () {
    return {
      
    }
  },
  methods:{
    mybtn(){
      //获取当前可视区域的宽/高document.body.clientWidth  / document.body.clientHeight;
      //元素距离文档顶端和左边的距离 offsetTop /offsetLeft
      document.getElementById("myBtn").addEventListener("click", function(e){
        var rect =  document.getElementById("btn2").getBoundingClientRect();
      console.log(6666)
      console.log(rect)
      });
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
    // this.mybtn();
    this.skMap();
    console.log(99999999)
  }
}
</script>
<style>
#myBtn{
  width:100%;
  height:100%;
}
  #btn2{
    width: 200px;
    height: 300px;
    border: 1px solid red
  }
  #btn3{
    width: 100px;
    height: 100px;
    margin-top: 20px;
    border: 1px solid forestgreen
  }
  #allmap{
    width: 100%;
    height: 500px;
  }
</style>