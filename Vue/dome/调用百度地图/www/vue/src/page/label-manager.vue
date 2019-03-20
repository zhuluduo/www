<template>
  <div class="main-right">
    <v-crumb :crumbTexts="crumbTexts"></v-crumb>
    <div class="content-wrapper">
      <div class="main-content">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="线型图" name="first">
            <div class="chart-box">
              <div class="line" :style="{width: '900px', height: '500px'}" id="line-chart"></div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="柱状图" name="second">
            <div class="chart-box">
              <div class="line" :style="{width: '900px', height: '500px'}" id="bar-chart"></div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="饼状图" name="third">
            <div class="chart-box">
              <div class="line" :style="{width: '900px', height: '500px'}" id="pie-chart"></div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
  import Crumb from '../components/crumb.vue'
  export default {
    components: {
      'v-crumb': Crumb
    },
    data() {
      return {
        crumbTexts:['LINKS','SB'],
        activeName: 'second'
      }
    },
    mounted() {
      this.drawLine();
      this.drawBar();
      this.drawPie();
    },
    methods: {
      drawLine(){
        let myChart = this.$echarts.init(document.getElementById('line-chart'))
        myChart.setOption({
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line'
          }]
        });
      },
      drawBar() {
        let chart = this.$echarts.init(document.getElementById('bar-chart'));
        chart.setOption({
          title : {
            text: '某地区蒸发量和降水量',
            subtext: '纯属虚构'
          },
          tooltip : {
            trigger: 'axis'
          },
          legend: {
            data:['蒸发量','降水量']
          },
          toolbox: {
            show : true,
            feature : {
              dataView : {show: true, readOnly: false},
              magicType : {show: true, type: ['line', 'bar']},
              restore : {show: true},
              saveAsImage : {show: true}
            }
          },
          calculable : true,
          xAxis : [
            {
              type : 'category',
              data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
            }
          ],
          yAxis : [
            {
              type : 'value'
            }
          ],
          series : [
            {
              name:'蒸发量',
              type:'bar',
              data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
              markPoint : {
                data : [
                  {type : 'max', name: '最大值'},
                  {type : 'min', name: '最小值'}
                ]
              },
              markLine : {
                data : [
                  {type : 'average', name: '平均值'}
                ]
              }
            },
            {
              name:'降水量',
              type:'bar',
              data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
              markPoint : {
                data : [
                  {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183},
                  {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
                ]
              },
              markLine : {
                data : [
                  {type : 'average', name : '平均值'}
                ]
              }
            }
          ]
        });
      },
      drawPie() {
        let myChart = this.$echarts.init(document.getElementById('pie-chart'))
        myChart.setOption({
          title : {
            text: '某站点用户访问来源',
            subtext: '纯属虚构',
            x:'center'
          },
          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
          },
          series : [
            {
              name: '访问来源',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:[
                {value:335, name:'直接访问'},
                {value:310, name:'邮件营销'},
                {value:234, name:'联盟广告'},
                {value:135, name:'视频广告'},
                {value:1548, name:'搜索引擎'}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
      }
    },
  }
</script>
<style lang="less">
.chart-box{
  padding: 20px 50px;
}
</style>
