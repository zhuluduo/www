<template>
	<div class="wrapper">
		<div class="search-bar">
			<el-select v-model="queryParams.channel" placeholder="渠道">
				<el-option label="全部" value="0">全部</el-option>
				<el-option label="男" value="1">男</el-option>
				<el-option label="女" value="2">女</el-option>
			</el-select>
			<el-select v-model="queryParams.address" placeholder="地址">
				<el-option label="全部" value="0">全部</el-option>
				<el-option label="启用" value="1">启用</el-option>
				<el-option label="禁用" value="2">禁用</el-option>
			</el-select>
		</div>
		<div class="table-wrapper">
			<div class="table-box">
				<el-table :data="dailyData">
					<el-table-column align="center" prop="name" label="日数据"></el-table-column>
					<el-table-column align="center" prop="dowload" label="下载量"></el-table-column>
					<el-table-column align="center" prop="register" label="新注册用户数"></el-table-column>
					<el-table-column align="center" prop="active" label="新增活跃用户"></el-table-column>
				</el-table>
			</div>
			<div class="table-box">
				<el-table :data="weekData">
					<el-table-column align="center" prop="name" label="周数据"></el-table-column>
					<el-table-column align="center" prop="dowload" label="下载量"></el-table-column>
					<el-table-column align="center" prop="register" label="新注册用户数"></el-table-column>
					<el-table-column align="center" prop="active" label="新增活跃用户"></el-table-column>
				</el-table>
			</div>
			<div class="table-box">
				<el-table :data="monthData">
					<el-table-column align="center" prop="name" label="月数据"></el-table-column>
					<el-table-column align="center" prop="dowload" label="下载量"></el-table-column>
					<el-table-column align="center" prop="register" label="新注册用户数"></el-table-column>
					<el-table-column align="center" prop="active" label="新增活跃用户"></el-table-column>
				</el-table>
			</div>
		</div>
		<div class="echart-wrapper">
			<v-echarts v-on:select-time="selectTime" :chartData='chartData' >
            </v-echarts>

            <div class="echart-table">
            	<el-table :data="dailyList">
					<el-table-column align="center" prop="statis_date" label="日期"></el-table-column>
					<el-table-column align="center" prop="download_count" label="下载量"></el-table-column>
					<el-table-column align="center" prop="register_count" label="新注册用户数"></el-table-column>
					<el-table-column align="center" prop="active_count" label="新增活跃用户"></el-table-column>
				</el-table>
            </div>
		</div>
	</div>
</template>
<script>
import echarts from '../../common/echarts.vue'
import StatisService from '../../../services/StatisService.js'
export default {
	components: {
		'v-echarts':echarts,
	},
	data() {
		return {
			statisService: new StatisService,
			queryParams: {
				address: '',
				channel: '',
				startDay:'',
				endDay:''
			},
			chartData:{},
			dailyList:[],
        	dailyData:[
        		{name:'今日', dowload:0, register:0, active: 0},
        		{name:'昨日', dowload:0, register:0, active: 0},
        	],
        	weekData:[
        		{name:'本周', dowload:0, register:0, active: 0},
        		{name:'上周', dowload:0, register:0, active: 0},
        	],
        	monthData:[
        		{name:'本月', dowload:0, register:0, active: 0},
        		{name:'上月', dowload:0, register:0, active: 0},
        	],
		}
	},
	created() {
		this.getSummaryData();
		this.getDailyData();
	},
	methods: {

		async getSummaryData() {
			let res = await this.statisService.getFlowSummaryInfo(null);
			this.dailyData[0].dowload = res.data.down_info.today;
			this.dailyData[1].dowload = res.data.down_info.yesterday;
			this.dailyData[0].register = res.data.register_info.today;
			this.dailyData[1].register = res.data.register_info.yesterday;
			this.dailyData[0].active = res.data.active_info.today;
			this.dailyData[1].active = res.data.active_info.yesterday;

			this.weekData[0].dowload = res.data.down_info.this_week;
			this.weekData[1].dowload = res.data.down_info.last_week;
			this.weekData[0].register = res.data.register_info.this_week;
			this.weekData[1].register = res.data.register_info.last_week;
			this.weekData[0].active = res.data.active_info.this_week;
			this.weekData[1].active = res.data.active_info.last_week;

			this.weekData[0].dowload = res.data.down_info.this_month;
			this.weekData[1].dowload = res.data.down_info.last_month;
			this.weekData[0].register = res.data.register_info.this_month;
			this.weekData[1].register = res.data.register_info.last_month;
			this.weekData[0].active = res.data.active_info.this_month;
			this.weekData[1].active = res.data.active_info.last_month;
		},

		async getDailyData() {
			let res = await this.statisService.getFlowDailyInfo(null, this.queryParams.startDay, this.queryParams.endDay);
			let activeList = [],
				registerList = [],
				downloadList = [],
				yAxis = [];
			if ( Array.isArray(res.data) ) {
				this.dailyList = res.data;

				res.data.forEach( (item) => {
					activeList.push(item.active_count);
					registerList.push(item.register_count);
					downloadList.push(item.download_count);
					yAxis.push(item.statis_date);
				});
			}
			this.chartData = {
                xAxis:[{
                    name:'下载量',
                    type:'line',
                    data:activeList
                },
                {
                    name:'新增注册用户',
                    type:'line',
                    data:registerList
                },
                {
                    name:'新增活跃用户',
                    type:'line',
                    data:downloadList
                }],
                yAxis:yAxis,
                columns:['下载量','新增注册用户','新增活跃用户'],
                quicKtime:true
        	}
		},

		selectTime( args ) {
			this.queryParams.startDay = args[0];
			this.queryParams.endDay = args[1];
			this.getDailyData();
		}
	}
}
</script>
<style scoped>
.search-bar{display: flex;background-color: #fff;padding: 15px}
.el-select + .el-select{margin-left: 15px;}
.el-input{width: 350px;margin-left: 15px;}
.table-wrapper{display: flex; margin-top: 20px;background-color: #fff;padding: 15px}	
.table-box{flex:1;}
.table-box + .table-box{margin-left: 15px;}
.echart-wrapper{margin-top: 20px;background-color: #fff;padding: 15px;}
.echart-table{padding: 25px 0}
</style>