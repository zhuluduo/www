<template>
  <div class="content-list">
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row :gutter="2">
      <el-col :span="17">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          placeholder="选择日期范围"
          :picker-options="pickerOptions"
          :editable="false"
          :clearable="false"
          size="small">
        </el-date-picker>
        <el-col :span="3">
          <el-select v-model="storeType" clearable placeholder="店铺类型" size="small" @change="loadStores">
            <el-option v-for="item in storeTypes" :key="item.label" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-select v-model="storeId" clearable placeholder="店铺名称" size="small">
            <el-option v-for="item in stores" :key="item.name" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-col>
        <el-button type="primary" @click="search" :loading="loading" icon="search" size="small">查询</el-button>
      </el-col>
    </el-row>
    <el-row class="summary" v-loading="loading">
      <el-col :span="6">
        <div class="grid-content">
          <el-tag type="danger" class="icon-tag-title">销售总额</el-tag>
          <span class="tag-content">￥{{orderSummary.goodsAmount}}</span>
          <!--<span class="tag-time"><el-tag type="warning">{{ymdBegin}} 至 {{ymdEnd}}</el-tag></span>-->
        </div>
      </el-col>
      <el-col :span="6" class="summary-center summary-center-left">
        <div class="grid-content">
          <el-tag type="danger" class="icon-tag-title">实收总额</el-tag>
          <span class="tag-content">￥{{orderSummary.actualReceivedAmount}}</span>
          <!--<span class="tag-time"><el-tag type="warning">{{ymdBegin}} 至 {{ymdEnd}}</el-tag></span>-->
        </div>
      </el-col>
      <el-col :span="6" class="summary-center">
        <div class="grid-content">
          <el-tag type="danger" class="icon-tag-title">订单总量</el-tag>
          <span class="tag-content" style="padding-left:10px;">{{orderSummary.orderCount}}</span>
          <span class="tag-content" style="padding-left:10px;font-size: 14px;right: 60px;">(客单价:{{pct}})</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="grid-content">
          <el-tag type="danger" class="icon-tag-title">当期总毛利</el-tag>
          <span class="tag-content">￥{{orderSummary.profit}}</span>
          <!--<span class="tag-time"><el-tag type="warning">{{ymdBegin}} 至 {{ymdEnd}}</el-tag></span>-->
        </div>
      </el-col>
    </el-row>
    <el-row class="summary-promotion-refund" v-loading="loading">
      <el-col :span="4">当期优惠总额：￥{{orderSummary.rebateAmount}}</el-col>
      <el-col :span="20">当期退货总额：￥{{refundSummary.actualPayAmount}}</el-col>
    </el-row>
    <el-row class="summary" v-loading="loading">
      <el-col :span="12">
        <div id="paymethodAmountChartPie" class="pie-chart"></div>
      </el-col>
      <el-col :span="12">
        <div id="paymethodQuantityChartPie" class="pie-chart"></div>
      </el-col>
    </el-row>
    <el-row v-loading="loading">
      <el-col align="center">
        <div>
          <el-radio-group v-model="statisticRadio" size="small" @change="switchPeriodUnit">
            <el-radio-button label="按天统计"/>
            <el-radio-button label="按周统计"/>
          </el-radio-group>
        </div>
        <div id="saleTrend" class="pie-chart"></div>
      </el-col>
    </el-row>
    <!--<el-row v-loading="loading">-->
      <!--<el-col :span="12" style="padding-right:5px;">-->
        <!--<el-table stripe :data="cashierOrderInfos" border stripe style="width: 100%" show-summary>-->
          <!--<el-table-column label="【收银员-现金】汇总" align="center">-->
            <!--<el-table-column-->
              <!--prop="telephone"-->
              <!--label="收银员">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="cashOrderAmount"-->
              <!--label="总金额">-->
            <!--</el-table-column>-->
          <!--</el-table-column>-->
        <!--</el-table>-->
      <!--</el-col>-->
      <!--<el-col :span="12" style="padding-left:5px;">-->
        <!--<el-table stripe border :data="cashierRefundInfos" stripe style="width: 100%" show-summary>-->
          <!--<el-table-column label="【收银员-退款】汇总" align="center">-->
            <!--<el-table-column-->
              <!--prop="telephone"-->
              <!--label="收银员">-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
              <!--prop="actualPayAmount"-->
              <!--label="总金额">-->
            <!--</el-table-column>-->
          <!--</el-table-column>-->
        <!--</el-table>-->
      <!--</el-col>-->
    <!--</el-row>-->
  </div>
</template>
<script>
  import {bus} from '../bus.js';
  import echarts from 'echarts';
  import {dateFormat} from '../utils/date.js';
  import math from '../utils/math.js'
  export default{
    data(){
      return {
        statisticRadio:'按天统计',
        periodUnit:0,
        dateRadio: '1',
        dateRange: '',
        storeTypes: [],
        storeType: '',
        storeId: '',
        searchWord: '',
        stores: [],
        ymdBegin: null,
        ymdEnd: null,
        listQuery: {
          pageSize: 15,
          page: 1,
          stratDate: '',
          endDate: '',
          checkNo: '',

        },
        paymethodAmountChartPie: null,
        paymethodQuantityChartPie: null,
        saleTrendChart: null,
        loading: false,
        cashierOrderInfos: [],
        cashierRefundInfos: [],
        orderSummary: 0,
        refundSummary: 0,
        pct: 0, // 客单价
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              let date = new Date();
              const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
              const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
              start.setTime(start.getTime());
              picker.$emit('pick', [start, end]);
            }
          },
            {
              text: '昨天',
              onClick(picker) {
                let date = new Date();
                const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
                start.setTime(start.getTime() - 24 * 60 * 60 * 1000);
                end.setTime(end.getTime() - 24 * 60 * 60 * 1000);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一周',
              onClick(picker) {
                let date = new Date();
                const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                let date = new Date();
                const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近三个月',
              onClick(picker) {
                let date = new Date();
                const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
        },

        cashierSummary: []
      }
    },
    methods: {
      getDateBegin(ymd){
        //console.log(ymd);
        return ymd + ' 00:00:00';
      },
      getDateEnd(ymd){
        //console.log(ymd);
        return ymd + ' 23:59:59';
      },
      getStartDate(date){
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
      },
      getEndDate(date){
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
      },
      search(){
        if (this.dateRange != undefined && this.dateRange[0] != null && this.dateRange[0] != undefined && this.dateRange[1] != null && this.dateRange[1] != undefined) {
          this.ymdBegin = dateFormat(this.dateRange[0], 'yyyy-MM-dd hh:mm:ss');
          this.ymdEnd = dateFormat(this.dateRange[1], 'yyyy-MM-dd hh:mm:ss');
        } else {
          this.ymdBegin = '';
          this.ymdEnd = '';
        }
        this.loadData();
      },

      loadData(){
        let params = {
          ymdBegin: this.ymdBegin,
          ymdEnd: this.ymdEnd,
          storeId: this.storeId,
          searchWord: this.searchWord,
          periodUnit:this.periodUnit,
          storeType:this.storeType
        };
        this.loading = true;
        this.$axios.post(bus.host + '/admin/api/statistics/order', params).then((res) => {
          let data = res.data;
          if (!data.success) {
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
          }
          let msg = data.msg;
          this.orderSummary = msg.orderSummary;
          this.refundSummary = msg.refundSummary;
          this.pct = msg.pct;
          this.cashierOrderInfos = msg.cashierOrderInfos;
          this.cashierRefundInfos = msg.cashierRefundInfos;
          this.refreshStatisticCharts(msg);
          this.loading = false;
        });
      },
      // 刷新统计视图
      refreshStatisticCharts(data){
        this.paymethodAmountChartPie.setOption({
          legend: {
            data: ['现金支付: ￥' + data.orderSummary.cashOrderAmount, '微信支付: ￥' + data.orderSummary.wxOrderAmount, '支付宝支付: ￥' + data.orderSummary.alipayOrderAmount]
          },
          series: [{
            data: [
              {value: data.orderSummary.cashOrderAmount, name: '现金支付: ￥' + data.orderSummary.cashOrderAmount},
              {value: data.orderSummary.wxOrderAmount, name: '微信支付: ￥' + data.orderSummary.wxOrderAmount},
              {value: data.orderSummary.alipayOrderAmount, name: '支付宝支付: ￥' + data.orderSummary.alipayOrderAmount}
            ]
          }
          ]
        });

        this.paymethodQuantityChartPie.setOption({
          legend: {
            data: ['现金支付: ' + data.orderSummary.cashOrderCount, '微信支付: ' + data.orderSummary.wxOrderCount, '支付宝支付: ' + data.orderSummary.alipayOrderCount]
          },
          series: [{
            data: [
              {value: data.orderSummary.cashOrderCount, name: '现金支付: ' + data.orderSummary.cashOrderCount},
              {value: data.orderSummary.wxOrderCount, name: '微信支付: ' + data.orderSummary.wxOrderCount},
              {value: data.orderSummary.alipayOrderCount, name: '支付宝支付: ' + data.orderSummary.alipayOrderCount}
            ]
          }
          ]
        });


        this.saleTrendChart.setOption({
          title: {
            text: '销售趋势图(【' + data.orderSummary.xdata[0] + '】至【' + data.orderSummary.xdata[data.orderSummary.xdata.length - 1] + '】)'
          },
          xAxis: {
            data: data.orderSummary.xdata
          },
          series: [
            {
              data: data.orderSummary.ydata
            }
          ]
        });
      },
      loadStoreTypes(){
        let url = bus.host + '/admin/api/digtaldictionary/detail?type=2'
        this.$http.get(url, {}).then((response) => {
          if (response.data.success == false) {
          } else {
            this.storeTypes = response.data.msg;
          }
        }, (response) => {
          this.$notify.error({
            title: '错误',
            message: '这是一条错误的提示消息'
          });
        });
      },
      loadStores(){
          this.storeId=null;
        let params = {storeType: this.storeType};
        let url = bus.host + '/admin/api/store/list';
        this.loading = true;
        this.$axios.post(url, params).then((res) => {
          let data = res.data;
          if (data.success == false) {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
            this.loading = false;
            return false;
          }
          let msg = data.msg;
          let content = msg.content;
          this.stores = content;
          this.loading = false;
        })
          .catch((err) => {
          });
      },
      // 切换统计周期单位
      switchPeriodUnit(label){
        console.log(label);
        if(label==='按天统计'){
          this.periodUnit=0;
        }
        if(label==='按周统计'){
          this.periodUnit=1;
        }
        this.search();
      }
    },
    mounted() {
      this.loadStoreTypes();
      this.paymethodAmountChartPie = echarts.init(document.getElementById('paymethodAmountChartPie'));
      this.paymethodAmountChartPie.setOption({
        title: {
          text: '【支付方式-销售总额】占比',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} 占比({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['现金支付', '微信支付', '支付宝支付']
        },
        /*color:['#d0618e', '#00c800','#049ae3'],*/
        series: [
          {
            name: '销售总额',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
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

      this.paymethodQuantityChartPie = echarts.init(document.getElementById('paymethodQuantityChartPie'));
      this.paymethodQuantityChartPie.setOption({
        title: {
          text: '【支付方式-订单总量】占比',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} 占比({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['现金支付', '微信支付', '支付宝支付']
        },
        /*color:['#d0618e', '#00c800','#049ae3'],*/
        series: [
          {
            name: '订单总量',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
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


      this.saleTrendChart = echarts.init(document.getElementById('saleTrend'));
      this.saleTrendChart.setOption({
        title: {
          text: '近30天销售趋势图'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: true,
          feature: {
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            saveAsImage: {}
          }
        },
        xAxis: {
          name: '日 期',
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          name: '实收总额',
          type: 'value',
          axisLabel: {
            formatter: '￥ {value}'
          }
        },
        series: [
          {
            name: '实收总额',
            type: 'line',
            markLine: {
              data: [
                {type: 'average', name: '平均值'}
              ]
            },
          }
        ]
      });

      // 默认设置时间段为今天
      /*this.dateRadio='1';
       this.setYmdByRadio();*/
      let date = new Date();
      this.dateRange = [this.getStartDate(date), this.getEndDate(date)];
      let ymd = dateFormat(new Date(), 'yyyy-MM-dd');
      this.ymdBegin = this.getDateBegin(ymd);
      this.ymdEnd = this.getDateEnd(ymd);
      this.loadData();
    }
  }
</script>
<style>
  .breadcrumb-border {
    border-bottom: 1px solid #efefef;
    margin-bottom: 10px;
  }

  .el-breadcrumb {
    padding: 5px 0px;
  }

  .el-pagination {
    padding: 10px 0px;
  }

  .el-table {
    margin-top: 10px;
  }

  .transition-box .el-form-item {
    margin-bottom: 15px;
  }

  .box-charts {
    margin-top: 10px;
    height: 100%;
  }

  .pie-chart {
    height: 400px;
    padding: 30px;
  }

  .summary .grid-content {
    position: relative;
    height: 100px;
  }

  .summary {
    margin-top: 10px;
    border-top: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
  }

  .summary .summary-center {
    border-left: 1px solid #e9e9e9;
    border-right: 1px solid #e9e9e9;
  }

  .summary .summary-center.summary-center-left {
    border-right: 0;
  }

  .iconfont.icon-tag {
    color: #ff7751;
    font-size: 50px;
  }

  .summary .grid-content .tag-time {
    font-size: 14px;
    position: absolute;
    top: 10px;
    right: 0;
    color: orange;
  }

  .grid-content .icon-tag {
    position: absolute;
    top: 6px;
    left: 10px;
  }

  .grid-content .icon-tag-title {
    color: #ffffff;
    background-color: #ff7751;
    position: absolute;
    top: 13px;
    left: 24px;
    font-size: 14px;
  }

  .grid-content .tag-content {
    position: absolute;
    bottom: 0;
    font-size: 40px;
  }

  .el-date-editor--daterange.el-input {
    width: 100%;
  }

  .summary-promotion-refund {
    border-bottom: 1px solid #e9e9e9;
    padding: 20px 10px;
    font-size: 14px;
    color: #ff7651;
  }
</style>
