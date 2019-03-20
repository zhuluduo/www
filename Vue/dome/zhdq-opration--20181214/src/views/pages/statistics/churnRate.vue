<template>
    <div class="online_Template"  v-loading="loading" element-loading-text="数据加载中" element-loading-spinner="el-icon-loading" element-loading-customClass="loading_Q">
        <div class="select_filter_box">
            <el-select v-model="selectList.channel" @change='selctChangeOne' class="selectList" placeholder="渠道">
                <el-option v-for="item in selectList.channelData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="selectList.region" @change='selctChangeTwo' class="selectList" placeholder="地区">
                <el-option v-for="item in selectList.regionData" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-date-picker
                class="select_filter_picker"
                v-model="selectList.DateTime"
                v-if="pageName=='churnRate'"
                @change="getList('churnRate');"
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
        <div class="echarts_template" v-if="pageName=='duration'">
            <v-echarts v-on:select-time="selectTime" :chartData='chartData' ></v-echarts>
        </div>
        <div class="table_box" :style="pageName=='churnRate'?'padding-top: 15px;':''">
            <div class="table_head_wrapper" v-if="pageName=='duration'">
                <div class="table_head_title">
                    <span>用户时长统计(小时)</span>
                </div>
            </div>
            <el-table :data="pageData()" stripe style="width: 100%" v-if="pageName=='churnRate'">
                <el-table-column label="日期" width="180" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.statis_date }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="流失率统计"  align="center">
                    <template slot-scope="scope">
                        <span>
                            {{scope.row.register_count?(scope.row.register_count+'人'):'-'}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="注册当日" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.first_count">
                            <p class="excepts"><span>{{ scope.row.first_count }}人</span></p>
                            <p class="excepts">
                                <span>
                                {{scope.row.first_count|getRate(scope.row.register_count)}}
                                </span>
                            </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="次日" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.second_count">
                            <p class="excepts"> <span>{{ scope.row.second_count }}人</span></p>
                            <p class="excepts">
                                <span>
                                    {{scope.row.second_count|getRate(scope.row.register_count)}}
                                </span>
                            </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="第7天" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.seventh_count">
                            <p class="excepts"><span>{{ scope.row.seventh_count }}人</span></p>
                            <p class="excepts">
                                <span>
                                    {{scope.row.seventh_count|getRate(scope.row.register_count)}}
                                </span>
                            </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="第14天" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.fourteenth_count">
                            <p class="excepts"><span>{{ scope.row.fourteenth_count }}人</span></p>
                            <p class="excepts">
                                <span>
                                    {{scope.row.fourteenth_count|getRate(scope.row.register_count)}}
                                </span>
                            </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="第30天" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.thirtieth_count">
                            <p class="excepts"><span>{{ scope.row.thirtieth_count }}人</span></p>
                            <p class="excepts">
                                <span>
                                    {{ scope.row.thirtieth_count|getRate(scope.row.register_count)}}
                                </span>
                            </p>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-table :data="pageData()" stripe style="width: 100%" v-else>
                <el-table-column label="日期" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.statis_date }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="平均在线时长" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.average_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="最高在线时长" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.max_time }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="最低在线时长" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.min_time }}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pages">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="page.currentPageIndex"
                :page-sizes="[5, 10, 20]"
                :page-size="page.size"
                layout="total, prev, pager, next, sizes, jumper"
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
                    channelData:[ //渠道
                        {name:'全部',id:10010}
                    ],
                    regionData:[ //地区
                        {name:'全国',id:10010}
                    ],
                    DateTime:[],
                },
                timeType:10086,
                timeTypeData:[
                    {name:'按天',id:10086},
                    {name:'按小时',id:10087},
                ],
                tableList:{ //table表单
                    tableData: [],
                    names:''
                },
                page:{ //分页
                    currentPageIndex:1, // 当前页
                    size:5, // 每页大小
                    total:0, // 总页数
                },
                chartData:{},
            }
        },
        watch:{
            '$route' (to, from) {
                this.initialValue(to.meta.title,to.path)
           }
        },
        filters:{
            getRate(count,total) {
                let toPercent = (Math.round(( count/total) * 100) / 100);
                let rate =parseInt(Number(toPercent*100).toFixed())+'%'
                return rate;
            }
        },
        created() {
            this.initialValue(this.$route.meta.title,this.$route.path);
        },
        methods:{
            // Math.round(amounts * 100) / 100;
            //初始值监听
            initialValue(name,path){
                Object.assign(this.$data, this.$options.data())  //初始化data
                this.loading = true;
                this.tableList.names = name;
                if(path == '/statistics/churnRate'){
                    this.pageName='churnRate';
                    this.getList('churnRate');
                }else{
                    this.pageName='duration';
                    this.getList('duration');
                }
            },
         
            //渠道
            selctChangeOne(){
                console.log(this.selectList.channel)
            },
            //地区
            selctChangeTwo(){
                console.log(this.selectList.region)
            },
            //返回选中时间数组
            selectTime(times){
                this.selectList.DateTime =times
                if(this.selectList.DateTime.length>0){
                    this.getList('duration');
                }
            },
            //分页
            handleSizeChange(val) {
                this.page.size=val; 
            },
            handleCurrentChange(val) {
                this.page.currentPageIndex=val;
            },
            pageData () {
                let size = this.page.size;
                let current =this.page.currentPageIndex;
                let dataList =this.tableList.tableData;
                return dataList.slice(size * (current-1), size*(current-1) + size)
            },
            async getList(key){
                let [channel,start_day = '',end_day = '',res] = ['zltBWoUzGM',this.selectList.DateTime[0],this.selectList.DateTime[1]||'',null];
                switch (key) {
                    case "churnRate":
                        res = await this.statisService.churnRateStatistics(channel,start_day,end_day);
                        break;
                    case "duration":
                        res = await this.statisService.durationStatistics(channel,start_day,end_day);
                        break;
                    default:
                        break;
                }
                if(res.code==200){
                    this.tableList.tableData=res.data;
                    this.page.total= res.data.length; 
                    if(key == 'duration'){
                        this.durationDataOpera()
                    }
                    this.loading = false; 
                    
                }
            },
            durationDataOpera(){
                let list =  this.tableList.tableData;
                let [averageList,minList,maxList,yAxisList] = [[],[],[],[],[]];
                let columns = ['average_time','max_time','min_time'];
                list.forEach(ele =>{
                    averageList.push(ele.average_time)
                    minList.push(ele.min_time)
                    maxList.push(ele.max_time)
                    yAxisList.push(ele.statis_date.substring(2))
                })
                this.chartData={
                    yAxis:yAxisList,
                    columns:columns,
                    xAxis:[
                        {
                            name:'average_time',
                            type:'line',
                            sampling:'average',
                            data:averageList,
                        },
                        {
                            name:'max_time',
                            type:'line',
                            sampling:'average',
                            data:maxList
                        },
                        {
                            name:'min_time',
                            type:'line',
                            sampling:'average',
                            data:minList,
                        }
                    ]
                }
            }
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




