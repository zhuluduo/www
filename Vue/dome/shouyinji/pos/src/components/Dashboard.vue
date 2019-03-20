<template>
  <div class="content-list" id="contCliewidth">
    <el-card class="box-card" v-loading="trendLoading" element-loading-text="拼命加载中..." :body-style="{ padding: '0px' }" style="margin-bottom: 10px;">
      <div slot="header" class="clearfix">
        <el-row>
          <el-col :span="5" style="font-weight: bold;padding-top:4px;">销售趋势图</el-col>
          <el-col :span="19" align="right">
            <el-radio-group v-model="periodUnit" size="small" @change="switchPeriodUnit" >
              <el-radio-button label="0">按天</el-radio-button>
              <el-radio-button label="1">按周</el-radio-button>
            </el-radio-group>
            <el-date-picker
              v-model="trendDateRange"
              type="datetimerange"
              placeholder="选择日期范围"
              :picker-options="pickerOptions"
              :editable="false"
              :clearable="false"
              size="small">
            </el-date-picker>
            <el-button type="primary" @click="trendSearch" :loading="trendLoading" icon="search" size="small">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <div id="saleTrend" class="pie-chart"></div>
    </el-card>
    <el-card class="box-card" v-loading="ratioLoading" element-loading-text="拼命加载中..." style="margin-bottom: 10px;">
      <div slot="header" class="clearfix">
        <el-row>
          <el-col :span="5" style="font-weight: bold;">比率工具</el-col>
          <el-col :span="19" align="right">
            <div class="block-N">
              <el-radio-group v-model="radioGroup" size='small' @change="radioGroups">
                <el-radio-button label="1">周比</el-radio-button>
                <el-radio-button label="2">月比</el-radio-button>
              </el-radio-group>
            </div>
            <div v-if="radioGroup==1" class="block-N">
              <el-date-picker
                v-model="trendComparison.timeWeek"
                type="week"
                :picker-options="weekPickerOptions"
                format="yyyy 第 WW 周"
                size="small"
                placeholder="请选择上周">
              </el-date-picker>
              <el-date-picker
                v-model="trendComparison.timeWeekTwo"
                type="week"
                :picker-options="weekPickerOptions"
                format="yyyy 第 WW 周"
                size="small"
                placeholder="请选择本周">
              </el-date-picker>
            </div>
            <div v-if="radioGroup==2" class="block-N">
              <el-date-picker
                v-model="trendComparison.tiemMonth"
                type="month"
                size="small"
                format="yyyy 年 MM 月"
                placeholder="请选择上月">
              </el-date-picker>
              <el-date-picker
                v-model="trendComparison.tiemMonthTwo"
                type="month"
                size="small"
                format="yyyy 年 MM 月"
                placeholder="请选择本月">
              </el-date-picker>
            </div>
              <div class="block-N">
                <el-tooltip :disabled="trendComparison.disabled" :content="trendComparison.content" placement="top" effect="light">
                  <el-button type="primary" size="small" icon="search" @click="searchComparison(radioGroup)">查询</el-button>
                </el-tooltip>
              </div>
          </el-col>
        </el-row>
      </div>
      <!--<el-row>
        <el-col :span="24" class="trendComparison">
          <el-col :xs="24" :sm="24" :md="12" :lg="13">
            <span class="Total">{{trendComparison.TotalName}}</span>
            <div class="TotaTxt">{{trendComparison.TotalName1}}<span>{{trendComparison.pre_mount}}</span></div>
            <div class="TotaTxt">{{trendComparison.TotalName2}}<span>{{trendComparison.last_mount}}</span></div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="10">
            <span class="Total Total1">{{trendComparison.RingRatio}}</span>
            <div class="RingRatio">{{trendComparison.rate*100}}%</div>
          </el-col>
        </el-col>
      </el-row>-->

      <el-row v-if="radioGroup==1">
        <el-col :span="12" align="right">
          <el-row>
            <el-col>本周总额(￥{{trendComparison.last_mount}}) <span style="font-size: 30px;">-</span> 上周总额(￥{{trendComparison.pre_mount}})&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</el-col>
          </el-row>
          <el-row>
            <el-col style="font-size: 30px;">------------------------------------&emsp;x&emsp;100%</el-col>
          </el-row>
          <el-row>
            <el-col>本周总额(￥{{trendComparison.last_mount}})&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</el-col>
          </el-row>
        </el-col>
        <el-col :span="2" style="font-size: 30px;padding-top:36px">&emsp;&emsp;=</el-col>
        <el-col :span="10" align="left" style="padding-top:32px;">增长率 <span style="font-size: 30px;">({{trendComparison.rate}}%)</span></el-col>
      </el-row>

      <el-row v-if="radioGroup==2">
        <el-col :span="12" align="right">
          <el-row>
            <el-col>本月总额(￥{{trendComparison.last_mount}}) <span style="font-size: 30px;">-</span> 上月总额(￥{{trendComparison.pre_mount}})&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</el-col>
          </el-row>
          <el-row>
            <el-col style="font-size: 30px;">------------------------------------&emsp;x&emsp;100%</el-col>
          </el-row>
          <el-row>
            <el-col>本月总额(￥{{trendComparison.last_mount}})&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;</el-col>
          </el-row>
        </el-col>
        <el-col :span="2" style="font-size: 30px;padding-top:36px">&emsp;&emsp;=</el-col>
        <el-col :span="10" align="left" style="padding-top:32px;">增长率 <span style="font-size: 30px;">({{trendComparison.rate}}%)</span></el-col>
      </el-row>
    </el-card>


    <el-card class="box-card" v-loading="loading"  element-loading-text="拼命加载中..." :body-style="{ padding: '10px' }" style="margin-bottom: 10px;">
      <div slot="header" class="clearfix">
        <el-row>
          <el-col :span="5" style="font-weight: bold;padding-top:4px;">销售指标</el-col>
          <el-col :span="19" align="right">
            <el-date-picker
              v-model="dateRange"
              type="datetimerange"
              placeholder="选择日期范围"
              :picker-options="pickerOptions"
              :editable="false"
              :clearable="false"
              size="small">
            </el-date-picker>
            <el-button type="primary" @click="search" :loading="loading" icon="search" size="small">查询</el-button>
          </el-col>
        </el-row>
      </div>
      <el-row class="summary">
        <el-col :xs="12" :sm="12" :md="12" :lg="6" class="border_right border_bottom surBorder">
          <div class="grid-content">
            <el-tag type="danger" class="icon-tag-title">销售总额</el-tag>
            <span class="tag-content">￥{{orderSummary.goodsAmount}}</span>
            <!--<span class="tag-time"><el-tag type="warning">{{ymdBegin}} 至 {{ymdEnd}}</el-tag></span>-->
            <div class="footer_field">
              <div class="field___1DB5N">
                <span>连带率</span>
                <span>{{metaWrap.jointRate}}</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="6" class="summary-center summary-center-left border_none border_bottom surBorder">
          <div class="grid-content">
            <el-tag type="danger" class="icon-tag-title">实收总额</el-tag>
            <span class="tag-content">￥{{orderSummary.actualReceivedAmount}}</span>
            <!--<span class="tag-time"><el-tag type="warning">{{ymdBegin}} 至 {{ymdEnd}}</el-tag></span>-->
            <div class="footer_field">
              <div class="field___1DB5N">
                <span>坪效</span>
                <span>{{metaWrap.levelGround}}</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="6" class="summary-center border_none border_right surBorder">
          <div class="grid-content">
            <el-tag type="danger" class="icon-tag-title">订单总量</el-tag>
            <span class="tag-content" style="padding-left:10px;">{{orderSummary.orderCount}}</span>
            <span class=" maxTag" style="padding-left:10px;font-size: 14px;right: 60px;">(客单价:{{pct}})</span>
            <div class="footer_field">
              <div class="field___1DB5N">
                <span>动销率</span>
                <span>{{metaWrap.DynamicPin}}%</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="6" class="surBorder">
          <div class="grid-content">
            <el-tag type="danger" class="icon-tag-title">当期总毛利</el-tag>
            <span class="tag-content">￥{{orderSummary.profit}}</span>
            <!--<span class="tag-time"><el-tag type="warning">{{ymdBegin}} 至 {{ymdEnd}}</el-tag></span>-->
            <div class="footer_field">
              <div class="field___1DB5N">
                <span>毛利率</span>
                <span v-if="orderSummary.profit==0||orderSummary.actualReceivedAmount==0">0%</span>
                <span v-else>{{metaWrap.grossInterest}}%</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row class="summary-promotion-refund">
        <el-col :xs="12" :sm="12" :md="12" :lg="4">当期优惠总额：￥{{orderSummary.rebateAmount}}</el-col>
        <el-col :xs="12" :sm="12" :md="12" :lg="20">当期退货总额：￥{{refundSummary.actualPayAmount}}</el-col>
      </el-row>
      <el-row class="summary tabeach">
        <div class="echarFirst">
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <div id="paymethodAmountChartPie" class="pie-chart"></div>
          </el-col>
          <el-col :xs="24" :sm="24" :md="12" :lg="12">
            <div id="paymethodQuantityChartPie" class="pie-chart"></div>
          </el-col>
        </div>
      </el-row>

      <el-row>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" style="padding-right:5px;">
          <el-table stripe :data="cashierOrderInfos" border stripe style="width: 100%" show-summary>
            <el-table-column label="【收银员-现金】汇总" align="center">
              <el-table-column
                prop="telephone"
                label="收银员">
              </el-table-column>
              <el-table-column
                prop="cashOrderAmount"
                label="总金额">
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-col>
        <el-col :xs="24" :sm="24" :md="12" :lg="12" style="padding-left:5px;">
          <el-table stripe border :data="cashierRefundInfos" stripe style="width: 100%" show-summary>
            <el-table-column label="【收银员-退款】汇总" align="center">
              <el-table-column
                prop="telephone"
                label="收银员">
              </el-table-column>
              <el-table-column
                prop="actualPayAmount"
                label="总金额">
              </el-table-column>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-card>
        <el-card class="box-card" v-loading="eachLoading" element-loading-text="拼命加载中..." :body-style="{ padding: '0px' }" style="margin-bottom: 10px;">
          <div slot="header" class="clearfix">
            <el-row>
              <el-col :span="5" style="font-weight: bold;padding-top:4px;">品类销售额占比</el-col>
              <el-col :span="19" align="right">
                <el-date-picker
                  v-model="eachSecond"
                  type="datetimerange"
                  placeholder="选择日期范围"
                  :picker-options="pickerOptions"
                  :editable="false"
                  :clearable="false"
                  size="small">
                </el-date-picker>
                <el-button type="primary" @click="SearchEach"  icon="search" size="small">查询</el-button>
              </el-col>
            </el-row>
          </div>
          <el-row>
            <el-col :span="9">
              <el-table stripe border :data="categoryInfo" stripe style="width: 100%" show-summary :default-sort = "{prop: 'amount', order: 'descending'}">
                <el-table-column sortable
                                 prop="categoryName"
                                 label="分类名称">
                </el-table-column>
                <el-table-column sortable
                                 prop="amount"
                                 label="总金额">
                </el-table-column>
                <el-table-column sortable
                                 prop="percent"
                                 label="占比">
                  <template scope="scope">
                    <span v-if="scope.row.percent<=0">0%</span>
                    <span v-else>{{scope.row.percent}}%</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
            <el-col :span="15">
              <div id="turnoverChart" class="turnover-chart"></div>
            </el-col>
          </el-row>
        </el-card>
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
        ratioLoading:false,
        categoryInfo:[],
        statisticRadio:'按天统计',
        periodUnit:0,
        dateRadio:'1',
        dateRange:'',
        ymdBegin:null,
        ymdEnd:null,
        paymethodAmountChartPie:null,
        paymethodQuantityChartPie:null,
        saleTrendChart:null,
        turnoverChart:null,
        turnoverJian:null,
        loading:false,
        eachLoading:false,

        trendDateRange:'', // 趋势图时间选择
        trendLoading:false, // 趋势图加载遮罩
        eachSecond:'',//营业额时间选择
        trendYmdBegin:null,
        trendYmdEnd:null,

        cashierOrderInfos:[],
        cashierRefundInfos:[],
        orderSummary:0,
        refundSummary:0,
        activeName: 'first',
        pct:0, // 客单价
        titSetup:'0',
        eLegend:{
          left: 'left',
          top: 0,
          orient: 'vertical',
          gridRight:'4%',
        },
        metaWrap:{
          jointRate:'',
          grossInterest:'',
          DynamicPin:'',
          levelGround:'',
        },
        Turnover:{
          index:'',
          trendYmdBegin:'',
          trendYmdEnd:'',
          turnoverAll:0,//营业总额
          goodsCategoryName:[],//商品类别
          goodsCategory:[],
          radius:['35%', '50%'],
          minRadius:'30%',
          orient:'vertical',
          X:'20px',
          top:'20%',
        },
        radioGroup:'1',
        trendComparison:{
            timeWeek:'',
            timeWeekTwo:'',
            tiemMonth:'',
            tiemMonthTwo:'',
            TotalName:'周总额',
            TotalName1:'上周总额',
            TotalName2:'本周总额',
            RingRatio:'增长率',
            pre_mount:'0',
            last_mount:"0",
            rate:'0',
            disabled:true,
            content:""
        },
        weekPickerOptions:{
          firstDayOfWeek:1
        },
        pickerOptions: {
          firstDayOfWeek:1,
          shortcuts: [
            {
              text: '现在时间',
              onClick(picker) {
                const start=new Date();
                const end =new Date();
                picker.$emit('pick',[start, end]);
              }
            },{
            text: '今天',
            onClick(picker) {
              let date=new Date();
              const start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
              const end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
              start.setTime(start.getTime());
              picker.$emit('pick', [start, end]);
            }
          },
            {
              text: '昨天',
              onClick(picker) {
                let date=new Date();
                const start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
                const end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
                start.setTime(start.getTime()-24*60*60*1000);
                end.setTime(end.getTime()-24*60*60*1000);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一周',
              onClick(picker) {
                let date=new Date();
                const start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
                const end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                let date=new Date();
                const start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
                const end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近三个月',
              onClick(picker) {
                let date=new Date();
                const start = new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
                const end = new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
        },

        cashierSummary: []
      }
    },
    methods:{
      getDateBegin(ymd){
        //console.log(ymd);
        return ymd+' 00:00:00';
      },
      getDateEnd(ymd){
        //console.log(ymd);
        return ymd+' 23:59:59';
      },
      getStartDate(date){
        return new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
      },
      getEndDate(date){
        return new Date(date.getFullYear(),date.getMonth(),date.getDate(),23,59,59);
      },
      loadData(){
        let params = {ymdBegin:this.ymdBegin,ymdEnd:this.ymdEnd,periodUnit:this.periodUnit};
        this.loading=true;
        this.$axios.post(bus.host+'/pos/api/statistics/order',params).then((res)=>{
          let data = res.data;
          if(!data.success){
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
          }
          let msg=data.msg;
          this.orderSummary=msg.orderSummary;
          this.refundSummary=msg.refundSummary;
          this.pct=msg.pct;
          this.cashierOrderInfos=msg.cashierOrderInfos;
          this.cashierRefundInfos=msg.cashierRefundInfos;
          this.metaWrap.grossInterest=(this.orderSummary.profitRate*100).toFixed(2);
          this.metaWrap.levelGround=this.orderSummary.levelGroundEffect;
          this.metaWrap.jointRate=this.orderSummary.jointRate;
          this.metaWrap.DynamicPin=(this.orderSummary.dynamicPinRate*100).toFixed(2);
          this.refreshStatisticCharts(msg);

          this.loading=false;
        });
      },
      search(){
        if(this.dateRange!=undefined&&this.dateRange[0]!=null&&this.dateRange[0]!=undefined&&this.dateRange[1]!=null&&this.dateRange[1]!=undefined){
          this.ymdBegin=dateFormat(this.dateRange[0],'yyyy-MM-dd hh:mm:ss');
          this.ymdEnd=dateFormat(this.dateRange[1],'yyyy-MM-dd hh:mm:ss');

        }else{
          this.ymdBegin='';
          this.ymdEnd='';
        }
        this.loadData();
      },
      loadTrendData(){
        let params = {ymdBegin:this.trendYmdBegin,ymdEnd:this.trendYmdEnd,periodUnit:this.periodUnit};
        console.log('------>')
        console.log(params)
        this.trendLoading=true;
        this.$axios.post(bus.host+'/pos/api/statistics/trend',params).then((res)=>{
          let data = res.data;
          if(!data.success){
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
          }

          this.refreshTrendCharts(data.msg);

          this.trendLoading=false;
        });
      },
      trendSearch(){
        if(this.trendDateRange!=undefined&&this.trendDateRange[0]!=null&&this.trendDateRange[0]!=undefined&&this.trendDateRange[1]!=null&&this.trendDateRange[1]!=undefined){
          this.trendYmdBegin=dateFormat(this.trendDateRange[0],'yyyy-MM-dd hh:mm:ss');
          this.trendYmdEnd=dateFormat(this.trendDateRange[1],'yyyy-MM-dd hh:mm:ss');

        }else{
          this.trendYmdBegin='';
          this.trendYmdEnd='';
        }
        this.loadTrendData();
      },
      //环比同比数据对比
      radioGroups(){
        this.trendComparison={
          timeWeek:'',
            timeWeekTwo:'',
            tiemMonth:'',
            tiemMonthTwo:'',
            pre_mount:'0',
            last_mount:"0",
            rate:'0',
            disabled:true,
            content:""
        };
        if(this.radioGroup==1){
          this.trendComparison.TotalName="周总额"
          this.trendComparison.TotalName1="上周总额"
          this.trendComparison.TotalName2="本周总额"
          this.trendComparison.RingRatio="增长率"
        }
        if(this.radioGroup==2){
          this.trendComparison.TotalName="月总额"
          this.trendComparison.TotalName1="上月总额"
          this.trendComparison.TotalName2="本月总额"
          this.trendComparison.RingRatio="增长率"
        }
        if(this.radioGroup==3){
          this.trendComparison.TotalName="同比总额"
          this.trendComparison.TotalName1="同比总额"
          this.trendComparison.TotalName2="同比总额"
          this.trendComparison.RingRatio="同比"
        }
      },
      searchComparison(obj){
            let timeWeek=this.trendComparison.timeWeek;
            let timeWeekTwo=this.trendComparison.timeWeekTwo;
            let tiemMonth=this.trendComparison.tiemMonth;
            let tiemMonthTwo=this.trendComparison.tiemMonthTwo;

            let params={
              last_ymdBegin:'',
              pre_ymdBegin:'',
              type:''
                 }
              if(obj==1){
                if(timeWeek==''||timeWeekTwo==''){
                  this.trendComparison.disabled=false;
                  this.trendComparison.content='日期不能为空'
                  return;
                }else {
                  this.trendComparison.disabled=true;
                  params.pre_ymdBegin=dateFormat(new Date(timeWeek.getTime() - 24*60*60*1000),'yyyy-MM-dd hh:mm:ss');
                  params.last_ymdBegin=dateFormat(new Date(timeWeekTwo.getTime() - 24*60*60*1000),'yyyy-MM-dd hh:mm:ss');
                  params.type=obj;
                }
              }
              if(obj==2){
                if(tiemMonth==''||tiemMonthTwo==''){
                  this.trendComparison.disabled=false;
                  this.trendComparison.content='日期不能为空'
                  return;
                }else {
                  this.trendComparison.disabled=true;
                  params.pre_ymdBegin=dateFormat(tiemMonth,'yyyy-MM-dd hh:mm:ss');
                  params.last_ymdBegin=dateFormat(tiemMonthTwo,'yyyy-MM-dd hh:mm:ss');
                  params.type=obj;
                }
              }
             if(params.last_ymdBegin<params.pre_ymdBegin){
              this.trendComparison.disabled=false;
              this.trendComparison.content='结束时间不能小于开始时间'
            }else {
              this.ratioLoading=true;
              this.trendComparison.disabled=true;
              this.$axios.post(bus.host+'/pos/api/statistics/trend_comparison',params).then((res)=>{
                this.trendComparison.last_mount=res.data.msg.last_mount;
                this.trendComparison.pre_mount=res.data.msg.pre_mount;
                let percent=res.data.msg.rate*100;
                this.trendComparison.rate=percent.toFixed(2);
                this.ratioLoading=false;
              }).catch(err=>{this.ratioLoading=false})
            }
      },
      //营业额查询
      handleClick(tab, event) {
        if(tab.name=="second"){
          this.SearchEach();
        }
      },
      SearchEach(){
        this.eachLoading=true;
        if(this.eachSecond!=undefined&&this.eachSecond[0]!=null&&this.eachSecond[0]!=undefined&&this.eachSecond[1]!=null&&this.eachSecond[1]!=undefined){
          this.Turnover.trendYmdBegin=dateFormat(this.eachSecond[0],'yyyy-MM-dd hh:mm:ss');
          this.Turnover.trendYmdEnd=dateFormat(this.eachSecond[1],'yyyy-MM-dd hh:mm:ss');
        }else {
          this.Turnover.trendYmdBegin='';
          this.Turnover.trendYmdEnd='';
        }
        let params={
          searchWord:'',
          firstCategoryId:'',
          secondCategoryId:'',
          ymdBegin:this.Turnover.trendYmdBegin,ymdEnd:this.Turnover.trendYmdEnd};
        let list;
        let index;
        let turnoverAll;
        let turnoverArrey=[];
        let idValueMap = [];
        //获取营业额总数
        let url = bus.host + '/pos/api/statistics/category?page=0&size=10000';
        this.$axios.post(url,params).then((res)=>{
          let data=res.data;
            for(index in data.msg.content){
              turnoverArrey.push(data.msg.content[index].amount)
              turnoverAll=turnoverArrey.reduce(this.getSum);
            }
            //相同品类数据合并
            list=data.msg.content;
            list.forEach(function(data){
              for(var i=0;i<idValueMap.length;i++){
                if(idValueMap[i].name === data.firstCategoryName){
                  idValueMap[i].amountList.push(data.amount);
                  return;
                }
              }
              idValueMap.push({
                name:data.firstCategoryName,
                amountList:[data.amount]
              });
            });
            //相同品类金额合并
            let goodsCategory=[]
            for(index in idValueMap){
              idValueMap[index].amountList=idValueMap[index].amountList.reduce(this.getSum);
              this.Turnover.goodsCategoryName.push(idValueMap[index].name);
              goodsCategory.push({
                name:idValueMap[index].name,
                value:(Math.round(idValueMap[index].amountList*100)/100),
                percent:(((Math.round(idValueMap[index].amountList*100)/100)/(Math.round(turnoverAll*100)/100))*100).toFixed(2)
              });
            }
            this.Turnover.goodsCategory=goodsCategory;
            this.Turnover.turnoverAll=(Math.round(turnoverAll*100)/100);
            this.turnoverCharts(this.Turnover);
            if(data.msg.content.length==0){
              this.Turnover.turnoverAll=0;
              this.turnoverCharts(this.Turnover);
            }
          this.categoryInfo=[];
          this.Turnover.goodsCategory.forEach(e=>{
            this.categoryInfo.push({categoryName:e.name,amount:e.value,percent:e.percent});
          });
            this.eachLoading=false;

        })
      },
      //获取营业总额
      getSum(total, num) {
        return total + num;
      },
      //营业额比例
      turnoverCharts(data){
        this.turnoverChart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: data.orient,
            x: data.X,
            top:data.top,
            data:data.goodsCategoryName,
          },
          series: [
            {
              name:'折扣分析',
              type:'pie',
              selectedMode: 'single',
              radius: [0, '20%'],

              label: {
                normal: {
                  position: 'inner'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data:[
                {value: data.turnoverAll, name: '营业总额'}
              ]
            },
            {
              name:'品类占比',
              type:'pie',
              radius: ['35%', '25%'],
              label: {
                normal: {
                  formatter: ' {b|{b}：}{c}  {per|{d}%}  ',
                  backgroundColor: '#eee',
                  borderColor: '#aaa',
                  borderWidth: 1,
                  borderRadius: 4,
                  // shadowBlur:3,
                  // shadowOffsetX: 2,
                  // shadowOffsetY: 2,
                  // shadowColor: '#999',
                  // padding: [0, 7],
                  rich: {
                    a: {
                      color: '#999',
                      lineHeight: 22,
                      align: 'center'
                    },
                    // abg: {
                    //     backgroundColor: '#333',
                    //     width: '100%',
                    //     align: 'right',
                    //     height: 22,
                    //     borderRadius: [4, 4, 0, 0]
                    // },
                    hr: {
                      borderColor: '#aaa',
                      width: '100%',
                      borderWidth: 0.5,
                      height: 0
                    },
                    b: {
                      fontSize: 16,
                      lineHeight: 33
                    },
                    per: {
                      color: '#eee',
                      backgroundColor: '#334455',
                      padding: [2, 4],
                      borderRadius: 2
                    }
                  }
                }
              },
              data:data.goodsCategory,
            }
          ]
        });
      },
      // 刷新统计视图
      refreshStatisticCharts(data){
        this.paymethodAmountChartPie.setOption({
          legend: {
              left: this.eLegend.left,
              top: this.eLegend.top,
              orient: this.eLegend.orient,
            data: ['现金支付: ￥' + data.orderSummary.cashOrderAmount, '微信支付: ￥' + data.orderSummary.wxOrderAmount, '支付宝支付: ￥' + data.orderSummary.alipayOrderAmount]
          },
          series: [{
            data: [
              {value: data.orderSummary.cashOrderAmount, name: '现金支付: ￥' + data.orderSummary.cashOrderAmount},
              {value: data.orderSummary.wxOrderAmount, name: '微信支付: ￥' + data.orderSummary.wxOrderAmount},
              {value: data.orderSummary.alipayOrderAmount, name: '支付宝支付: ￥' + data.orderSummary.alipayOrderAmount}
            ]
          },
          ],

        });

        this.paymethodQuantityChartPie.setOption({
          legend: {
            left: this.eLegend.left,
            top: this.eLegend.top,
            orient: this.eLegend.orient,
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
      },

      // 刷新趋势图
      refreshTrendCharts(data){
        //let tongbi=[],zengzhangbi=[];
        /*data.ydata.forEach(now=>{
          let last = now*0.4;
          tongbi.push(last);
          let lv=((now-last)/now)*100;
          zengzhangbi.push(lv);
        });
*/



        this.saleTrendChart.setOption({
          /*title: {
            text: '销售趋势图'
          },*/
          xAxis: {
            data: data.xdata
          },
          series: [
            {
              data: data.ydata
            },
            /*{
              data: tongbi
            },
            {
              data: zengzhangbi
            }*/
          ]
        });
      },

      // 切换统计周期单位
      switchPeriodUnit(){
        this.trendSearch();
      },

      //web端图标显示
      clieW(){
        let that=this;
        let res=navigator.userAgent.match(/(iPhone|ipad|Android|ios)/i)
        let H=0;
        let S=0;
        if(res){
          function resize(fals) {
          var evt = "onorientationchange" in window ? "orientationchange" : "resize";
          window.addEventListener(evt,resize,false);
            if(window.orientation == 0 || window.orientation == 180) {
              that.eLegend.left='center'
              that.eLegend.top ='7%'
              that.eLegend.orient='vertical'
              that.titSetup='0'
              that.eLegend.gridRight='4%'
              S=1
              if(H==1){
                location.reload();
                H=0
              }
              if(res[0]=='iPad'){
                that.eLegend.top ='10%'
                that.eLegend.orient='horizontal'
                that.titSetup='25px'
                that.eLegend.gridRight='12%'
                S=1
                if(H==1){
                  location.reload();
                  H=0
                }
              }
            }else if(window.orientation==90||window.orientation==-90){
              that.eLegend.left='center'
              that.eLegend.top ='10%'
              that.eLegend.orient='horizontal'
              that.titSetup='25px'
              that.eLegend.gridRight='12%'
              that.Turnover.radius=['30%','35%']
              that.Turnover.minRadius='20%'
              that.Turnover.orient='horizontal',
              that.Turnover.top='90%',
              that.Turnover.X='center',
              H=1
              if(S==1){
                location.reload();
                S=0
              }
            }
          }
          resize(true);
        }else {
          that.eLegend.left='left'
          that.eLegend.top ='0'
          that.eLegend.orient='vertical'
          that.titSetup='0'
          that.eLegend.gridRight='4%'
        }
      }

    },
    mounted() {
      this.clieW()
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
      this.turnoverChart = echarts.init(document.getElementById('turnoverChart'));

      this.saleTrendChart = echarts.init(document.getElementById('saleTrend'));
      this.saleTrendChart.setOption({
        /*title: {
          text: '销售趋势图',
        },*/
        legend: {
          data:['当前实收总额','同比实收总额','同比率']
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: this.eLegend.gridRight,
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: true,
          y:this.titSetup,
          feature: {
            dataView: {readOnly: false},
            magicType: {type: ['line', 'bar']},
            saveAsImage: {}
          }
        },
        xAxis: {
          name:'日 期',
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          name:'实收总额',
          type: 'value',
          axisLabel: {
            formatter: '￥ {value}'
          }
        },
        series: [
          {
            name:'实收总额',
            type:'line',
            markLine: {
              data: [
                {type: 'average', name: '平均值'}
              ]
            },
          },
          /*{
            name:'同比实收总额',
            type:'line',
            markLine: {
              data: [
                {type: 'average', name: '平均值'}
              ]
            },
          },
          {
            name:'同比率',
            type:'line',
          }*/
        ]
      });

      // 默认设置时间段为今天
      /*this.dateRadio='1';
       this.setYmdByRadio();*/
      let date=new Date();
      this.dateRange=[this.getStartDate(date),this.getEndDate(date)];
      this.eachSecond=[this.getStartDate(date),this.getEndDate(date)];
      var lw = new Date(date - 1000 * 60 * 60 * 24 * 30);//最后一个数字30可改，30天的意思
      var lastY = lw.getFullYear();
      var lastM = lw.getMonth();
      var lastD = lw.getDate();
      let startDate=new Date(lastY, (lastM<10 ? "0" + lastM : lastM), (lastD<10 ? "0"+ lastD : lastD), 0, 0, 0);

      this.trendDateRange=[startDate,this.getEndDate(date)];
      let ymd=dateFormat(new Date(),'yyyy-MM-dd');
      this.ymdBegin=this.getDateBegin(ymd);
      this.ymdEnd=this.getDateEnd(ymd);
      this.trendYmdBegin=this.getDateBegin(ymd);
      this.trendYmdEnd=this.getDateEnd(ymd);
      this.loadData();
      this.trendSearch();
      this.SearchEach();

    }
  }
</script>
<style>
  @media only screen and (max-width: 750px){
    .date-picker .el-date-editor--datetimerange.el-input{width: 100%;margin-bottom: 5px;}
  }
  .breadcrumb-border{
    border-bottom:1px solid #efefef;
    margin-bottom:10px;
  }
  .el-breadcrumb{padding:5px 0px;}
  .el-pagination{padding: 10px 0px;}
  .el-table{margin-top:10px;}
  .transition-box .el-form-item{
    margin-bottom: 15px;
  }
  .box-charts{
    margin-top:10px;
    height:100%;
  }
  .pie-chart{
    height:250px;
  }
  .turnover-chart{
    height: 500px;
  }
  .summary .grid-content{
    position:relative;
    height:130px;
  }
  .summary{
    margin-top:10px;
    border-top: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;
  }
  .summary .summary-center{
    border-left: 1px solid #e9e9e9;
    border-right: 1px solid #e9e9e9;
  }
  .summary .summary-center.summary-center-left{
    border-right:0;
  }
  .iconfont.icon-tag{
    color: #ff7751;
    font-size: 50px;
  }

  .summary .grid-content .tag-time{
    font-size: 14px;
    position:absolute;
    top:10px;
    right:0;
    color:orange;
  }
  .grid-content .icon-tag{
    position:absolute;
    top:6px;
    left:10px;
  }
  .grid-content .icon-tag-title{
    color: #ffffff;
    background-color: #ff7751;
    position:absolute;
    top:13px;
    left:5%;
    font-size: 14px;
  }
  .grid-content .tag-content{
    position: absolute;
    top:45px;
    left: 5%;
    font-size:40px;
  }
  .grid-content .maxTag{
    position: absolute;
    right: 5%!important;
    top: 58px;
    font-size:40px;
  }
  .el-date-editor--daterange.el-input{width:100%;}
  .summary-promotion-refund{
    /*border-bottom: 1px solid #e9e9e9;*/
    padding:20px 10px;
    font-size: 14px;
    color: #ff7651;
  }
  .tagsorder{
    font-size: 14px;
    background-color: #ff7751;
    color: #fff;
    float: right;
    margin-top: 5px;
  }
  .tabeach .el-tabs__content{overflow: visible;}
  .echarTime{
    position: absolute;
    top: -52px;
    right: 20px;
    width: auto;
  }
  .el-card__header{
    padding:8px;
    background-color: rgb(246, 243, 238);
  }
</style>
<style scoped lang="scss">
  $border_line:1px solid #e9e9e9;
  .footer_field{
    position: absolute;
    top: 105px;
    left: 5%;
    width: 90%;
    box-sizing: border-box;
    &:before{
      content: '';
      border-top: 1px solid #e8e8e8;
      width: 100%;
      height: 1px;
      position: absolute;
    }
    .field___1DB5N{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0;
      span{
        font-size: 14px;
        line-height: 40px;
        &:last-child{
          margin-left: 8px;
          color: rgba(0,0,0,.85);
        }
      }
    }
  }
  .block-N{display: inline-block!important;}
  .radioGroup{margin-top: 8px;}
  .trendComparison{margin-top: 25px;}
  .timeData{width: 95px;}
  .Total{
    display: block;
    border-bottom: 1px solid #e2e2e2;
    padding-bottom: 3px;
    font-size: 14px;
    text-align: center;
  }
  .Total1{
    margin-left: 40px;
  }
  .TotaTxt{
    text-align: center;
    font-size: 14px;
    line-height: 25px;
    margin-top: 5px;
    span{
      font-size: 16px;
      padding-left: 8px;
    }
  }
  .RingRatio{
    text-align: center;
    padding-left: 40px;
    line-height: 62px;
    font-size: 17px;
  }
  @media (max-width: 1366px){
    .radioGroup{margin-top: 10px;}

  }
  @media screen and (max-width: 900px) {
    .media_narrow{
      position: absolute;
      top: -37px;
      right: 0;
      background: none;
      color: #ff7751;
      border: 0;
    }
    .border_none{
      border:none;
    }
    .border_right{border-right:$border_line;}
    .border_bottom{border-bottom: $border_line}
  }
  @media (max-width: 768px){
    .maxTag{right: 8px!important;bottom: -12px;}
    .grid-content .icon-tag-title{left: 10px;}
    .el-col-xs-12{width: 100%;}
    .summary {
      border-top:none;
      border-bottom: none;
      .border_bottom{border: none;}
      .border_right{border:none;}
      .surBorder{border:1px solid #e9e9e9;margin-bottom: 5px}
    }
    .turnover-chart{width:568px;}
    .echarTime{position: initial;}
  }

</style>
