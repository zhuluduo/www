<template>
    <div class="echarts_box">
            <div class="echarts_box_filter">
                <div class="filter1">
                    <slot name="radioOne"></slot>
                </div>
                <div class="filter2">
                   <div class="TimeType">
                        <slot name="timeType"></slot>
                   </div>
                   <div class="echarts_filter_data">
                        <el-date-picker
                        class="echarts_filter_picker"
                        v-model="echartsList.DateTime"
                        @change="pickerBtn"
                        type="daterange"
                        align="right"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy - MM - dd"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                        >
                        </el-date-picker>
                   </div>
                </div>
            </div>
            <div class="echarts_count">
                 <div :id="IDs" class="line-chart"></div>
            </div>
    </div>
</template>

<script>
/*
* @property { xAxis :  {Array} x轴数组 }
* @property { yAxis : {Array} y轴数组 }
* @property { columns : {Array} legend值 }
* @property { yNmae : y轴name值}
* @property { yformatter : y轴formatter值}
* @property { select-time : 返回选中时间}
*/
// 引入提示框和图例组件
let echarts = require('echarts/lib/echarts');
let uuid = require('uuid');
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
require('echarts/lib/component/title')
require('echarts/lib/component/tooltip')
require("echarts/lib/component/toolbox")
require('echarts/lib/component/legend')
import {dateFormat} from '../../lib/date.js';
import timeSet from '../../lib/DateUtils.js'
import dataFile from '../../lib/dataToggles.js'
export default {
    props: ['chartData'],
    data(){
        return {
        pickerOptions: {
          shortcuts: dataFile.pickerDetails([{text: '今日'},{text: '昨日'},{text: '本月'}])
        },
        echartsList:{ //统计图
            DateTime:[],
            timeList:[
                {name:'今日',id:18121},
                {name:'昨日',id:18122},
                {name:'本周',id:18123},
                {name:'本月',id:18124}
            ],
            timeListID:18121
        },
        lineChart:null,
        dateArray:[],
        IDs:String(uuid.v1().split("-")[0]),
        hackReset: true,
        quicKtime:this.chartData.quicKtime!=undefined?this.chartData.quicKtime:true,
        }
    },
    watch:{
        '$route' (to, from) {
            this.lineCharts();
        },
        chartData(val){
            this.lineCharts();
        }
    },
    methods:{
        lineCharts(){
            let chartBox = document.getElementsByClassName('echarts_count')[0]
            let myChart = document.getElementById(this.IDs)
            let w = chartBox.clientWidth||chartBox.offsetWidth; 
            myChart.style.width = w + 'px';

            this.lineChart = echarts.init(document.getElementById(this.IDs));
            // this.lineChart.showLoading({
            //     text: '数据加载中',
            //     color: '#c23531',
            //     textColor: '#000',
            //     maskColor: 'rgba(255, 255, 255, 0.8)'
            // });
            // setTimeout(()=>{
            //     this.lineChart.hideLoading();
            // },2000)
            this.lineChart.setOption({
                // title: {
                //     text: '折线图堆叠'
                // },
                
                tooltip: {
                    trigger: 'axis',
                    confine: true,
                    axisPointer: { //鼠标移入
                        type: 'cross',
                    },
                },
                legend: {
                    data:this.chartData.columns!=undefined?this.chartData.columns:[],
                    y: 'bottom',
                    orient: 'horizontal' 
                },
                grid: {
                    left: '2%',
                    right: '3%',
                    top: '9%',
                    bottom: '7%',
                    containLabel: true
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataZoom: {
                            yAxisIndex: 'none'
                        },
                        dataView: {
                            readOnly: false,
                            optionToContent: function(opt) {   //自定义 dataView 展现函数，用以取代默认的 textarea 
                                var axisData = opt.xAxis[0].data;
                                var series = opt.series;
                                var table = '<table class="tabletextarea" style="width:100%;text-align:center">'
                                table += '<thead> <tr>'
                                table += '<th>'+ '日期' + '</th>'

                                for (var j = 0, l = series.length; j < l; j++) {
                                    table += '<th>'+ series[j].name + '</th>'
                                }
                                table += '</tr></thead>'
                                table += '<tbody>'
                                
                                for (var i = 0, l = axisData.length; i < l; i++) {
                                    table += '<tr>'
                                          + '<td>' + axisData[i] + '</td>'   
                                        for (let k = 0, l = series.length; k < l; k++) {
                                            table += '<td>'+ series[k].data[i] + '</td>'
                                        }
                                      table += '</tr>'
                                }
                                table += '</tbody>';
                                table += '</table>';
                                return table;
                            },
                            contentToOption:function(container, option){},  //支持数据编辑后的刷新自定义函数
                            backgroundColor:'#efefef',  //定义背景颜色
                            buttonColor:'#409eff'  //按钮颜色
                        },
                        magicType: {type: ['line', 'bar']},//图表显示格式
                        restore: {}, //刷新数据
                        saveAsImage: {} ,
                    }
                },
                xAxis: {
                    type: 'category',
                    name: '日期',
                    splitLine: {show: false},// 是否显示x轴竖线
                    boundaryGap: false, //x轴数值是否居中
                    data:this.chartData.yAxis
                },
                yAxis: {
                    type: 'value',
                    name: this.chartData.yNmae!=undefined?this.chartData.yNmae : '总人数',
                    splitLine: {show: true},//是否显示横线
                    axisLabel:{ 
                    formatter: this.chartData.yformatter!=undefined?'{value} '+this.chartData.yformatter :'{value} 人'
                    // formatter:  function (value, index) { //显示万级单位转化
                    //     return value/10000
                    // }
                    },
                },
                series: this.chartData.xAxis
            })
        },
         
        pickerBtn(){
            if(this.echartsList.DateTime!=null){
                this.dateArray = this.echartsList.DateTime;
                this.$emit('select-time', this.dateArray );
            }
        },
        refreshTrendCharts(){

        }
    },
    mounted() {
        this.lineCharts();
    },
}
</script>

<style lang="scss" scoped>
    .echarts_box{
        border-top: 1px solid #e8e8e8;
        // border-bottom: 1px solid #e8e8e8;
        padding-top: 15px;
        .echarts_box_filter{
            display: -webkit-flex; /* Safari */
            display: flex;
            justify-content: space-between;
            .echarts_filter_time{
                display: inline-block;
                margin-right: 24px;
                span{
                    cursor: pointer;
                    color: rgba(0,0,0,.65);
                    margin-left: 24px;
                }
                span.active{
                    color: #1890ff;
                }
            }
            .echarts_filter_data{
                display: inline-block;
            }
        }
        .echarts_count{
            width: 100%;
            height: 520px;
            margin-top: 15px;
            .line-chart{
                width: 1200px;
                height: 500px;
            }
        }
        .TimeType{
            display: inline-block;
        }
    }
</style>
<style lang="scss">
.tabletextarea{
    tbody>tr{line-height: 25px;}
     tbody>tr:hover{
         cursor: pointer;
         background:#c0c0c0;
     }
}
</style>


