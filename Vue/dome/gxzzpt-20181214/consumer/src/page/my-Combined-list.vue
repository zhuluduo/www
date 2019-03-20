<template>
    <div id="my-Combined-list">
        <div class="box">
            <div class="operation-bar">
                <div class="left">
                    <v-tabs :tabs="types" @click="changeTab"></v-tabs>
                </div>
                <div class="SearchBox right">
                    <div class="TechSearch">
                        <el-select v-model="operationData.TechType"  @change='TechTypeOper' placeholder="-全部工艺-">
                            <el-option
                            v-for="item in operationData.TechnologyOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="TimeSearch">
                        <el-select v-model="operationData.TimeValue"  @change='TimeOper' placeholder="请选择">
                            <el-option
                            v-for="item in operationData.TimeOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="Search">
                        <el-input @keydown.native="searchByKeydown($event)" v-model="operationData.SearchKeyword" placeholder="料件编号/品名/供应商名称">
                            <i slot="suffix" class="el-input__icon el-icon-search" @click="searchByClick"></i>
                        </el-input>
                    </div>
                </div>
            </div>
            <div class="operation-tip">
                <el-button v-if="operationData.isShow" type="primary" @click="getForComparison()">生成核价单</el-button>
                <el-button v-if="operationData.isShow" plain  @click="TurnValid(false)">报价失效</el-button>
                <el-button v-if="!operationData.isShow" plain @click="TurnValid(true)">报价有效</el-button>
            </div>
            <div class="table">
                <el-table :data="tableData"  style="width: 100%" header-row-class-name="co-f1" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="123" align="center" >
                    </el-table-column>
                    <el-table-column label="需求编号" align="center" width="147">
                        <template slot-scope="scope">
                            <!-- <router-link :to="{path:'/my-enquiry-detail', query:{requireId:scope.row.id}}" target="_blank"> -->
                                <div class="tb-link">{{scope.row.requirementItemInfo.itemNo||'-'}}</div>
                            <!-- </router-link> -->
                        </template>
                    </el-table-column>
                    <el-table-column prop="requirementNo" label="零件名称" width="134" align="center">
                        <template slot-scope="scope">
                            <div> {{scope.row.requirementItemInfo?scope.row.requirementItemInfo.itemName:'-'}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="报价供应商" prop="requirementTypeText" align="center" width="272">
                        <template slot-scope="scope">
                            {{scope.row.companyName||'-'}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="requirementTypeText" label="数量" align="center" width="116">
                        <template slot-scope="scope">
                             <div> {{scope.row.requirementItemInfo?scope.row.requirementItemInfo.estimateCount:'-'}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="报价" align="center" width="114">
                        <template slot-scope="scope">
                            <div> {{scope.row.priceInfo?scope.row.priceInfo.price:'-'}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createTime" label="有效时间" align="center" width="142">
                        <template slot-scope="scope">
                            <div>{{scope.row.updateTime}}</div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="changePage"
                :page-count="pagination.pageCount"
                :current-page="pagination.currentPageIndex"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pagination.pageSize"
                layout="sizes, prev, pager, next, jumper"
                :total="pagination.recordCount">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import '../lib/filter.js'//引入时间和日期过滤器；
import tabs from '../components/tabs.vue';
import operationBar from '../components/operationBar.vue';
export default {
  components: {
    'v-tabs':tabs,
    'v-operation': operationBar,
  },
  data() {
    return {
        tableData: [],
        ajaxData: {
            pageIndex: 1,
            pageSize: 10,
            keywords: [],
            techniqueId: null,
            timeRange :"",
            flag:true,
        },
        types: [
            { name: "有效", id: 112010, isCheck: true },
            { name: "失效", id: 112020, isCheck: false },
        ],
        pagination: {
            currentPageIndex: 1,
            pageSize: 10,
            pageCount: 0
        },
        operationData:{
            TechnologyOptions: [],//工艺数据
            TechType:'',//工艺类型
            SearchKeyWords:'',//搜索的关键字处理
            TimeOptions:[
                {name:'全部',id:null},
                {name:'1天内',id:1},
                {name:'2天内',id:2},
                {name:'3天内',id:3},
                {name:'4天内',id:4},
                {name:'5天内',id:5},
                {name:'6天内',id:6},
                {name:'7天内',id:7},
            ],//时间选项
            TimeValue: '',
            isShow:true,
        },
        SelectionList: []
    };
  },
  created() {
    this.getList();
    let words=this.$LocalStorage.getWords('105');
    words.unshift({name:'-全部工艺-',id:null})
    this.operationData.TechnologyOptions= words
  },
  filters: {

  },
  methods: {
    async getList(){
        let res=await this.$http.post("/custom/requirementPriceItem/getList", this.ajaxData);
        if(res.data.code==200){
            this.tableData = res.data.data;
            this.pagination = res.data.pagination;
            window.scrollTo(0,0);
        }else{
            this.$error('数据请求错误')
        }
    },
    handleSelectionChange(val) {
        this.SelectionList = val;
    },

    //工艺操作；
    TechTypeOper(val){
        this.ajaxData.techniqueId=val;
        this.getList();
    },
    //时间戳处理；
     timestampToTime(timestamp) {
        let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y, M, D, h,m,s;
        Y = date.getFullYear() + '-';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        D = date.getDate();
        h = date.getHours() + ':';
        m = date.getMinutes() + ':';
        s = date.getSeconds();
        return Y+M+D;
    },
    //时间操作；
    TimeOper(val){
        if(val){
            let timestamp =new Date().getTime()-val*24*60*60*1000;
            let oldData =this.timestampToTime(timestamp);
            this.ajaxData.timeRange = oldData;
        }else{
            this.ajaxData.timeRange = "";
        }
        this.getList();
    },
    //切换tab栏
    changeTab(item) {
        if(item.id==112010){
            this.ajaxData.flag=true;
            this.operationData.isShow=true;
        }else{
            this.ajaxData.flag=false;
            this.operationData.isShow=false;
        }
      this.getList();
    },
    //搜索
    searchByKeydown() {
        if (event.keyCode == 13 ) {
            this.searchByClick();
        }
    },
    searchByClick() {
        this.ajaxData.keywords=this.operationData.SearchKeyword.split(/[\，,]/);
        this.getList();
    },
    //有效无效操作；
    async TurnValid(flag){
        let IdsArray = this.getSelectedArray();
        let paraData ={};
        paraData.ids = IdsArray;;
        paraData.flag = flag; 
        let res=await this.$http.post("custom/requirementPriceItem/setFlag",paraData);
        this.$ResultTips(res)
        if(res.data.code == 200){
            this.types.forEach(ele =>{
                ele.isCheck =!ele.isCheck;
            })
            this.ajaxData.flag=flag;
            this.operationData.isShow=flag;
            this.getList();
        }
    },
    //分页操作
    changePage(val) {
        this.ajaxData.pageIndex = val;
        this.getList();
    },
    handleSizeChange(val) {
        this.ajaxData.pageSize=val;
        this.getList();
    },
    //获取被选中的Ids数组；
    getSelectedArray(){
        let SelectionIds=[];
        this.SelectionList.forEach(ele => {
            SelectionIds.push(ele.id)
        });
        return SelectionIds
    },
    //生成核价单；
    async getForComparison(){
        let IdsArray = this.getSelectedArray();
        if(IdsArray.length!=0){
            let paraData={priceItemIds:IdsArray};
            let res=await this.$http.post("/custom/comparison/add",paraData);
            if(res.data.code==200){ 
                let { href } = this.$router.resolve({path:'/Combined-Info',query:{id:res.data.data}});
                window.open(href, '_blank');
            }else{
                this.$error(res.data.message)
            }
        }else{
            this.$warning('请选择核价的商品')
        }
    }
  }
};
</script>

<style lang="less" scoped>
.box{
  margin: 0 auto;
}
.tb-link:hover{
  color: #3f8def;
}

.operation-bar{
    display: flex;
    height: 54px;
    align-items: center;
    justify-content: space-between;
    .left{
        flex: 2;
    }
    .right,{
        flex: 3;
        display: flex;
        justify-content: flex-end;
    }
    .SearchBox{
        display: flex;
        .el-icon-search:before{
            font-size: 18px;
            color: #a4a4a4;
            cursor: pointer;
        }
        .el-input__icon{
            line-height: 26px;
        }
        .el-input{
            width: 308px;
        }
        .TechSearch{
            width: 120px;
            margin-right: 10px;
        }
        .TimeSearch{
            width: 98px;
            margin-right: 10px;
        }
    }
}
.operation-tip{
    display: flex;
    justify-content: flex-end;
}
.table{
    padding-top:14px;
}
</style>
<style lang="less">
    #my-Combined-list{
        .el-button{
            height: 26px;
            line-height: 26px;
            padding:0 20px;
        }
    }
</style>

