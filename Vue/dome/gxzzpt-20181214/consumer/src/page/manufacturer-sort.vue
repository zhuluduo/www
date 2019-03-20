<template>
    <div class="sort-main">
         <div class="bread-crumb"><span class="pull-cursor" @click="$router.push({path:'/index'})">首页</span> > <span> 供应商排名</span></div>
         <div class="sort-nav pull-shadow">
             <span v-for="(item,index) in sortNav" :key="index" @click="changeBox(item.index)" :class="activeIndex==item.index?'active':''">{{item.name}}</span>
         </div>
         <div class="sort-box"  v-loading="loading" element-loading-text="数据加载中">
             <p class="No-data pull-shadow" v-if="NoData==false"><img src="../../static/img/no-data.png" alt=""> 暂无数据</p>
             <manufacturerList :tableData='tableData' :sort='true'></manufacturerList>
         </div>
         <div class="pagination">
            <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page.currentPage"
            :page-size="page.size"
            layout="total, prev, pager, next"
            :total="page.total">
        </el-pagination>
        </div>
    </div>
</template>
<script>
import manufacturerList from './manufacturer-list.vue'
export default {
    components: {
     manufacturerList
    },
    data(){
        return{
            loading:false,
            keyword: '',
            page:{
                currentPageIndex:1, // 当前页
                size:15, // 每页大小
                total:0, // 总页数
            },
            sortNav:[
               {name:'全部工艺',index:''},
               {name:'3D打印',index:530010},
               {name:'机械加工',index:530020}
            ],
            activeIndex:'',
            techniqueTypeList:'',
            NoData:true,
            tableData:[],
        }
    },
    watch: {
        $route: function( route ) {
            this.keyword = route.query.searchKey || '';
            this.createds();
        },
    },
    methods:{
        createds(){
        let url="/getManufacturerList";
        let params={
            keyword: this.keyword,
            pageIndex: this.page.currentPageIndex,
            pageSize:this.page.size,
            techniqueType:this.techniqueTypeList,
            industryIds:[],
        }
        this.loading=true;
        this.$http.post(url,params).then((res)=>{
            if(res.data.code ==200){
                let data=res.data.data.list;
                let pageTotal=res.data.data.pagination.recordCount;
            if(data!=undefined){
            if(data.constructor !=Array){
                data=[];
                pageTotal=0
                this.NoData=false
            }else{
                this.NoData=true
            }
                this.page.total=pageTotal;
            for(let i=0;i<data.length;i++){
                if(data[i].coopInfo===undefined){
                    data[i].coopInfo={}
                    data[i].coopInfo.industryInfo=[]
                }
                if(data[i].extendInfo===undefined){
                    data[i].extendInfo.employeeScaleStr='';
                    data[i].extendInfo.factoryAcreageStr='';
                    data[i].extendInfo.yearlyOutput='';
                }
            }
                this.tableData=data;
                window.scrollTo(0,0);
            }
            }else{
                this.tableData=[];
                this.NoData=false
            }
                this.loading=false;
        }) 
        },
        changeBox(index){
            this.activeIndex=index;
            this.techniqueTypeList=index!=''?index:'';
            this.createds()
        },
        /*处理分页事件*/
        handleSizeChange(val) {
            this.page.size = val;
            this.createds();
        },
        handleCurrentChange(val) {
            this.page.currentPageIndex = val;
            this.createds();
        },
    },
    mounted() {
        this.keyword = this.$route.query.searchKey || '';
        this.createds();
    },
}
</script>
<style lang="less">
    .starability-basic{
      span{
        .el-rate__icon{
            font-size: 13px!important;
            margin-right: 3px!important;
        }
      }
    }
</style>

<style lang="less" scoped>
    .sort-main{
        width: 1200px;
        min-height: 500px;
        margin: auto;
        margin-top: 15px;
        box-sizing: border-box;
        font-size: 12px!important;
        .bread-crumb{
            margin-bottom:10px;
            span+span{
            color: #3f8def;;
            }
        }
        .sort-nav{
            width: 100%;
            height:60px;
            background: #fff;
            margin-bottom: 10px;
            padding: 15px 20px;
            box-sizing: border-box;
            span{display: inline-block;height:26px;line-height: 26px;text-align:center;color: #777777;font-size: 12px;padding:0 10px;cursor: pointer;}
            .active{background-color: #3f8def;color: #fff;}
        }
        .pagination{
            margin-top: 10px;
            margin-bottom: 55px;
            button{
            width: 530px!important;
            height: 45px!important;
            font-size: 18px!important;
            }
        }
       .No-data{
            text-align: center;
            height: 100px;
            line-height: 100px;
            font-size: 17px;
            background: #fff;
            img{
                width: 25px;
                height: 25px;
                vertical-align: middle;
                margin-right: 4px;
            }
        }
        .pull-shadow{
            box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
            -webkit-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
            -moz-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
        }
    }
</style>


