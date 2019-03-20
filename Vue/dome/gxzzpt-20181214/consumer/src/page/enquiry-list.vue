<template>
    <div id="enquiry-list">
        <div class="content">
            <div class="crumb-bread">
                <span class="router-link" @click="$router.push({path:'/index'})">首页</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="curr">最新询盘</span>
            </div>
            <div class="content-box">
                <table class="enquiry-table">
                    <thead>
                        <tr>
                            <td width="146px">询盘编号</td>
                            <td width="162px">缩略图</td>
                            <td width="152px">工艺</td>
                            <td width="152px">材料</td>
                            <td width="124px">零件#</td>
                            <td width="178px">最大报价量</td>
                            <td width="147px">报价截至日期</td>
                            <td width="137px">操作</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in tableData">
                            <td><span class="tb-link" @click="goDetail(item)"> {{item.requirementNo}}</span></td>
                            <td>
                                <img v-if="item.requirementItemList[0].firstModelFileInfo" class="tb-pic" :src="item.requirementItemList[0].firstModelFileInfo?item.requirementItemList[0].firstModelFileInfo.thumbnailUrl:''" alt="">
                                <div v-else class="no-upload-img">未上传</div>
                            </td>
                            <td>{{item.techniqueInfo?item.techniqueInfo.techniqueName:'-'}}</td>
                            <td>{{item.requirementItemList[0].materialInfo?item.requirementItemList[0].materialInfo.materialName:'-'}}</td>
                            <td>{{item.requirementItemList[0].estimateCount}}</td>
                            <td>{{item.requirementItemList|estimateCountFilter}}</td>
                            <td>{{item.offerDeadlineTime}}</td>
                            <td>
                                <span v-if="(user.isValid && user.isManufacturer && ( !('requirementPrice' in item) ||  (item.requirementPrice && item.requirementPrice.offerStatus==210010)))||!user.isValid" class="tb-btn" @click="JumpRout(item)">报价</span>
                                <span v-if="user.isValid && user.isManufacturer && (item.requirementPrice && item.requirementPrice.offerStatus!==210010)">我{{item.requirementPrice.offerStatusText}}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="pagination">
                    <el-pagination @current-change="changePage" background layout="prev, pager, next" :page-count="pagination.pageCount" :current-page="pagination.currentPageIndex" :page-size="pagination.pageSize"></el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
             searchParams: {
                pageIndex: 1,
                pageSize: 10,
            },
            pagination: {
                currentPageIndex: 1,
                pageSize: 10,
                pageCount: 0
            },
            tableData:[]
        }
    },
    created() {
        this.getList();
    },
    filters:{
        estimateCountFilter( requirementList ) {
            var num = 0;
            requirementList.map((item) => {
                num += item.estimateCount;
            })
            return num;
            },
    },
    computed: {
        ...mapState({
            user: state => state.user,
        }),
    },
    methods: {
         changePage( pageIndex ) {
            this.searchParams.pageIndex = pageIndex;
            this.getList();
        },
        getList() {
            this.$http.post('/custom/requirement/getLastestEnquiry', this.searchParams).then(( res ) => {
                if ( res.data.code == 200 ) {
                    this.tableData = res.data.data;
                    this.pagination = res.data.pagination;
                    window.scrollTo(0,0);
                } else {
                    this.$error( res.data.message );
                }
            })
        },
        goDetail(row) {
            this.JumpRout(row)
            // this.$router.push({
            //     path: '/enquiry/detail',query: {requireId: row.id}
            // });
        },

        JumpRout(item){
            let url=''
            if(item.techniqueInfo!=undefined){
                if(item.techniqueInfo.techniqueType==530010){
                url='/enquiry/detailInfo'    
                }else{
                url='/enquiry/detail'
                }
            }else{
                url='/enquiry/detail'
            }
            this.$router.push({path:url, query:{requireId: item.id}})
        }
    }
}
</script>

<style lang="less">
.pull-cursor{cursor: pointer;}
#enquiry-list{
    div{
        box-sizing: border-box;
    }
    .content{
        width: 1200px;
        margin: 0 auto;
        .crumb-bread{
            height: 35px;
            line-height: 35px;
            .router-link{
                cursor: pointer;
                &:hover{
                    color: #3f8def;
                    text-decoration: underline;
                }
            }
            .right-arrow{
                margin: 0 5px;
            }
            .curr{
                color: #3f8def;
            }
        }
        .content-box{
            background: #fff;
            min-height: 700px;
            margin-bottom: 50px;
            padding:0 15px;
            padding-bottom: 5px;
            box-shadow: 0px 2px 9px 0px  rgba(0, 0, 0, 0.06);
        }
        .enquiry-table{
            thead{
                td{
                    text-align: center;
                    height: 44px;
                    vertical-align: middle;
                    border-bottom: 2px solid #abcdf8;
                    color: #929292;
                }
            }
            tbody{
               /*  tr:nth-child(even){
                    background: #f8f8f8;
                } */
                td{
                    height: 86px;
                    text-align: center;
                    vertical-align: middle;
                    border-bottom: 1px solid #e2e2e2;
                    .tb-link{
                        color: #3f8def;
                    }
                    .tb-pic{
                        display: block;
                        width: 60px;
                        height: 60px;
                        background: #f1f1f1;
                        margin: 0 auto;
                    }
                    .no-upload-img{
                        display: block;
                        width: 60px;
                        height: 60px;
                        margin: auto;
                        background: #e7e7e7;
                        text-align: center;
                        line-height: 60px;
                        font-size: 12px;
                        color: #878787;
                    } 
                    .tb-btn{
                        display: inline-block;
                        width: 54px;
                        height: 26px;
                        border-radius: 4px;
                        font-size: 12px;
                        color: #fff;
                        line-height: 26px;
                        background: #3f8def;
                        text-align: center;
                        cursor: pointer;
                    }
                }
                
            }
        }
    }
}
</style>
