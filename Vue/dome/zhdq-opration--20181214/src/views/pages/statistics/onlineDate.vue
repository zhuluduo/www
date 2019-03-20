<template>
    <div class="online_Template"  v-loading="loading" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading" element-loading-customClass="loading_Q">
        <div class="select_filter_box">
            <el-select v-model="selectList.channel" @change='selctChangeOne' class="selectList" placeholder="渠道">
                <el-option v-for="item in selectList.channelData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="selectList.region" @change='selctChangeTwo' class="selectList" placeholder="地区">
                <el-option v-for="item in selectList.regionData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="selectList.Events" @change='selctChangeS' class="selectList" placeholder="事件" v-if="pageName=='retain'">
                <el-option v-for="item in selectList.EventsData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-date-picker
                class="select_filter_picker"
                v-model="selectList.DateTime"
                v-if="pageName=='retain'"
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
        <div class="echarts_template" v-if="pageName=='activityRate'">
            <v-echarts v-on:select-time="selectTime" :chartData='chartData' >
                <el-radio-group  v-model="radioList.radio1" size="mini" @change='radioChange(radioList.radio1)' slot='radioOne'>
                    <el-radio-button :label="radioList.radio2"> </el-radio-button>
                    <el-radio-button :label="radioList.radio3"></el-radio-button>
                </el-radio-group>
                <el-select v-model="timeType" @change='timeTypes' class="TimeType_W"  placeholder="请选择"  slot='timeType'>
                    <el-option v-for="item in timeTypeData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </v-echarts>
        </div>
        <div class="table_box" :style="pageName=='retain'?'padding-top: 15px;':''">
            <div class="table_head_wrapper" v-if="pageName=='activityRate'">
                <div class="table_head_title">
                    <span>用户活跃情况（按小时）</span>
                </div>
            </div>
            <el-table :data="tablePage()" stripe style="width: 100%" v-if="pageName=='retain'">
                <el-table-column label="日期" width="180" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.statis_date }}</span>
                    </template>
                </el-table-column>
                <el-table-column :label="selectList.Events==10010?'新增注册人数':'新增活跃人数'"  align="center">
                    <template slot-scope="scope">
                        <span v-if="selectList.Events==10010?scope.row.register_count!=null&&scope.row.register_count!=undefined:scope.row.first_count!=null&&scope.row.first_count!=undefined">
                            {{selectList.Events==10010?scope.row.register_count:scope.row.first_count}}人
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="注册当日" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.first_count!=null&&scope.row.first_count!=undefined">
                         <p class="excepts"><span>{{ scope.row.first_count }}人</span></p>
                         <p class="excepts">
                            <span>
                             {{selectList.Events==10010?exceptCount(scope.row.first_count,scope.row.register_count):100}}%
                            </span>
                        </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="次日" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.second_count!=null&&scope.row.second_count!=undefined">
                        <p class="excepts"> <span>{{ scope.row.second_count }}人</span></p>
                        <p class="excepts">
                            <span>
                             {{selectList.Events==10010?exceptCount(scope.row.second_count,scope.row.register_count):exceptCount(scope.row.second_count,scope.row.first_count)}}%
                            </span>
                        </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="第7天" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.seventh_count!=null&&scope.row.seventh_count!=undefined">
                        <p class="excepts"><span>{{ scope.row.seventh_count }}人</span></p>
                        <p class="excepts">
                            <span>
                             {{selectList.Events==10010?exceptCount(scope.row.seventh_count,scope.row.register_count):exceptCount(scope.row.seventh_count,scope.row.first_count)}}%
                            </span>
                        </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="第14天" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.fourteenth_count!=null&&scope.row.fourteenth_count!=undefined">
                        <p class="excepts"><span>{{ scope.row.fourteenth_count }}人</span></p>
                        <p class="excepts">
                            <span>
                             {{selectList.Events==10010?exceptCount(scope.row.fourteenth_count,scope.row.register_count):exceptCount(scope.row.fourteenth_count,scope.row.first_count)}}%
                            </span>
                        </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="第30天" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.thirtieth_count!=null&&scope.row.thirtieth_count!=undefined">
                            <p class="excepts"><span>{{ scope.row.thirtieth_count }}人</span></p>
                            <p class="excepts">
                               <span>
                                {{selectList.Events==10010?exceptCount(scope.row.thirtieth_count,scope.row.register_count):exceptCount(scope.row.thirtieth_count,scope.row.first_count)}}%
                               </span>
                            </p>
                        </div>
                    </template>
                </el-table-column>
            </el-table>

            <el-table :data="tablePage()" stripe style="width: 100%" v-else>
                <el-table-column label="日期" align="center">
                    <template slot-scope="scope">
                        <span v-if="timeType==101010">{{scope.row.statis_date }}</span>
                        <span v-else>{{scope.row.statis_date }}（{{scope.row.statis_hour}} h）</span>
                    </template>
                </el-table-column>
                <el-table-column label="在线总人数" align="center">
                    <template slot-scope="scope">
                        <span v-if="numberPercent == 10010">{{scope.row.total_count }}人</span>
                        <span v-else>{{scope.row.percent}}%</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pages">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="page.PageIndex"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="page.size"
                layout="total,sizes, prev, pager, next, jumper"
                :total="page.total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import echarts from '../../common/echarts';
import dataFile from '../../../lib/dataToggles.js';
import {dateFormat} from '../../../lib/date.js';
import StatisService from '../../../services/StatisService.js'
    export default {
        components: {
       'v-echarts':echarts,
        },
        data(){
            return {
                loading:false,
                statisService: new StatisService,
                pageName:'',
                radioList:{
                    radio1:'活跃人数',
                    radio2:'活跃人数',
                    radio3:'活跃百分比',
                },
                pickerOptions: {
                    shortcuts: dataFile.pickerDetails()
                },
                selectList:{  //筛选
                    channel:10010,
                    region:10010,
                    Events:10010,
                    channelData:[ //渠道
                        {name:'全部',id:10010}
                    ],
                    regionData:[ //地区
                        {name:'全国',id:10010}
                    ],
                    EventsData:[ //时间筛选
                        {name:'新增用户留存',id:10010},
                        {name:'活跃用户留存',id:10011}
                    ],
                    DateTime:[],
                },
                timeType:101010,
                timeTypeData:[
                    {name:'按天',id:101010},
                    {name:'按小时',id:101020},
                ],
                tableData: [], //table表单 
                echartsTime:[],
                numberPercent:10010,
                chartData:{
                    xAxis:[],
                    yAxis:[],
                    columns:[],
                    yNmae:'总人数',
                    yformatter:'人'

                },
                page:{ //分页
                    PageIndex:1, // 当前页
                    size:10, // 每页大小
                    total:0, // 总页数
                },
            }
        },

        watch:{
           '$route' (to, from) {
               this.initialValue(to.meta.title,to.path)
           }
        },

        methods:{
            // Math.round(amounts * 100) / 100;
            //初始值监听
            initialValue(name,path){
                Object.assign(this.$data, this.$options.data())  //初始化data
                if(path == '/statistics/retain'){
                    this.pageName='retain';
                    this.Retain();
                }else{
                    this.pageName='activityRate';
                    this.ActivityRate();
                }
            },

            //返回选中时间数组
            selectTime(times){
                this.echartsTime = times;
                this.ActivityRate();
            },

            //渠道
            selctChangeOne(){
                console.log(this.selectList.channel)
            },
            
            //地区
            selctChangeTwo(){
                console.log(this.selectList.region)
            },

            //事件
            selctChangeS(){
                console.log(this.selectList.Events)  
            },

            //时间筛选
            timeTypes(){
                this.ActivityRate(); 
            },

            //留存时间选择
            pickerBtn(){
                if(this.selectList.DateTime!=null){
                    this.Retain();
                }
            },

            //百分比计算
            exceptCount(num1,num2){
                var toPercent = (Math.round(( num1/num2) * 100) / 100)
                return parseInt(Number(toPercent*100).toFixed())
            },

            //留存统计
            async Retain(){
                let parmes={
                      channel: "",
                      start_day:this.selectList.DateTime[0] || '',
                      end_day:this.selectList.DateTime[1] || ''
                }
                this.loading = true;
                let res = await this.statisService.retainedStatistics(parmes);
                if(res.code == 200){
                    this.tableData=res.data;
                    this.page.total = res.data.length;
                    this.tablePage();
                    this.loading = false;
                }
            },

            //活跃率
            async ActivityRate(){
                let parmes = {
                    statis_type: this.timeType,
                    channel: " ",
                    start_day: this.echartsTime[0] || '',
                    end_day: this.echartsTime[1] || ''
                }
                this.loading = true;
                let res = await this.statisService.activityLevel(parmes);
                if(res.code == 200){
                    this.tableData = res.data;
                    this.page.total = res.data.length;
                    this.tablePage();
                    this.activityRateData([{name:'活跃人数',fieldName:'active_count'}])
                    this.loading = false;
                }
            },

            //tab切换
            radioChange(item){
                if(item == this.radioList.radio2){
                    this.numberPercent = 10010;
                    this.activityRateData([{name:'活跃人数',fieldName:'active_count'}]);
                }else{
                    this.numberPercent = 10020;
                    this.activityRateData([{name:'活跃百分比',fieldName:'percent'}])
                }
            },

            activityRateData(tableDatas){
                let chartDatas = [];
                let columnsName = [];
                for(let i=0;i<tableDatas.length;i++){
                    let chartjson = {
                        name:tableDatas[i].name,
                        type:'line',
                        sampling:'average',
                        data:this.activityRateFilter(this.tableData,tableDatas[i].fieldName)
                    };
                    chartDatas.push(chartjson);
                    columnsName.push(tableDatas[i].name)
                }

                this.chartData={
                    xAxis:chartDatas,
                    yAxis:this.activityRateFilter(this.tableData,this.timeType == 101010?'statis_date':'statis_hour'),
                    columns:columnsName,
                    yNmae:this.numberPercent == 10010?'总人数':'百分比',
                    yformatter:this.numberPercent == 10010?'人':'%',
                }
            },

            activityRateFilter(data,name){
                let filterData = [];
                    for(let i=0;i<data.length;i++){
                        for(let x in data[i]){
                            if(x == name){
                                let da =x=='statis_hour'?data[i].statis_date.split("-")[1]+'-'+data[i].statis_date.split("-")[2]+'('+data[i][x]+'h)':data[i][x];
                                filterData.push(da)  
                            }
                        }
                    }
                return filterData;
            },

            //分页
            handleSizeChange(val) {
                this.page.size = val;
                this.tablePage();
            },
            handleCurrentChange(val) {
                this.page.PageIndex = val;
                this.tablePage();
            },
            tablePage(){
                return this.tableData.slice((this.page.PageIndex-1)*this.page.size,this.page.PageIndex*this.page.size)
            }
        },
        mounted() {
            this.initialValue(this.$route.meta.title,this.$route.path);
       },
    }
</script>

<style lang="scss" scoped>
.pages{
    margin-top: 15px;
    text-align: right;
    margin-right: 20px;
}
.excepts{
    span{display:inline-block;}
}
.excepts+.excepts{
    span{border-top:1px solid #000;color: #919191;}
}
</style>

<style lang="scss">
    .online_Template{
        font-size: 14px;
        background-color: #fff;
        padding: 10px 0;
        padding-bottom: 50px;
        .select_filter_box,.echarts_template,.table_box{padding:0 15px;}
        .select_filter_box{
            margin-bottom: 15px;
        }
        .TimeType_W{width: 120px;}
        .selectList{
            width:150px;
        }
        .table_box{
                border-top: 7px solid #f0f0f0;
            .el-table__header th, .el-table__header tr {
                background-color: #ccc;
                color: black;
            }
            .table_head_wrapper{
                height: 55px;
                line-height: 50px;
                display: -webkit-flex; /* Safari */
                display: flex;
                justify-content: space-between;
                .table_head_title{
                   span{
                    font-size: 16px;
                    color: rgba(0,0,0,.85);
                    font-weight: 500;
                   }
                }
            }
        }
    }
    .imgList{
        p{float: left;}
        img{
            width: 100px;
            height: 100px;
        }
    }
    div[element-loading-customClass="loading_Q"]{
                .el-loading-spinner i{
            font-size: 25px;
        }
    }
</style>




