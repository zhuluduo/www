<template>
    <div id="product-list">
        <div class="content">
            <v-operation>
                <div class="operation-left">
                    <el-input placeholder="标题/工艺/材料" v-model="searchParams.keyword">
                        <i slot="suffix" class="el-input__icon el-icon-search search-icon" @click="search"></i>
                    </el-input>
                </div>
                <div slot="right"><el-button type="primary" @click="$router.push({path:'/usercenter/publish-case'})">发布案例</el-button></div>
            </v-operation>
            <div class="product-list clearfix">
                <div class="product-item" v-for="(item,index) in productList" @click="toDetail(item)" :key="index" :class="(index + 1) % 4==0?'no-margin-right':''">
                    <div class="mask-layer">
                        <div class="icon-box">
                            <i class="el-icon-edit-outline" @click.stop="$router.push({path:'/usercenter/edit-case', query:{id: item.id}})"></i>
                            <i class="el-icon-delete" @click.stop="deleteItem(item)"></i>
                        </div>
                    </div>
                    <div class="imgList"><img :src="item.pictureUrls[0]" alt=""></div>
                    <div class="name info">{{item.productName}}</div>
                    <div class="info">工艺：<span v-if="item.industryInfo!=undefined">{{item.industryInfo.industryName}}</span></div>
                    <div class="info">材料：{{item.material}}</div>
                    <div class="info">单价：人民币[{{item.priceScope}}]/件</div>
                </div>
            </div>
            <div class="pagination">
                <el-pagination @current-change="changePage" background layout="prev, pager, next" :page-count="pagination.pageCount" :current-page="pagination.currentPageIndex" :page-size="pagination.pageSize"></el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import Operation from "../components/operationBar.vue";
export default {
    components:{
        'v-operation': Operation
    }, 
    data() {
        return {
            searchParams: {
                pageIndex: 1,
                pageSize: 8,
                keyword:''
            },
            productList:[],
            pagination: {
                currentPageIndex: 1,
                pageSize: 8,
                pageCount: 0
            },
        }
    },
    created() {
        this.getList();
    },
    methods: {
        search() {
            this.getList();
        },

        deleteItem( item ) {
            this.$confirm('您确定要删除该案例？', '提示', {type: 'warning'}).then(() => {
                this.$http.post('/custom/manufacturer/productCase/delete', {id: item.id}).then(( res ) => {
                    if ( res.data.code == 200 ) {
                        this.$success('删除成功！');
                        this.getList();
                    } else {
                        this.$error('删除失败');
                    }
                })
            })
        },

        toDetail( item ) {
            let { href } = this.$router.resolve({path:'/product-detail', query:{productId:item.id}});
            window.open(href, '_blank');
        },

        changePage( pageIndex ) {
            this.searchParams.pageIndex = pageIndex;
            this.getList();
        },
        getList() {
            this.$http.post('/custom/manufacturer/productCase/list',this.searchParams).then(( res ) => {
                if ( res.data.code == 200 ) {
                    this.productList = res.data.data;
                    this.pagination = res.data.pagination;
                    window.scrollTo(0,0);
                }
            })
        }
    }
}
</script>

<style lang="less">
#product-list{
    div{
        box-sizing: border-box;
    }
    .clearfix{
        zoom: 1;
        &::after{
            display: block;
            visibility: hidden;
            clear: both;
            height: 0;
            content: '.';
        }
    }
    .content{
        width: 1050px;
        margin: 0 auto;
        .operation-bar{
           height: 43px; 
           border-bottom: 1px solid #e2e2e2;
           .right{
             button{height: 30px;line-height: 0px;}
           }
        }
        .operation-left{
            width:308px;
        }
        .product-list{
            margin-top: 20px;
            .product-item{
                position: relative;
                width: 232px;
                height: 266px;
                border: 1px solid #e2e2e2;
                float: left;
                margin-bottom: 21px;
                margin-right: 40px;
                cursor: pointer;
                &:hover{
                    .mask-layer{
                        display: block;
                    }
                }
                .mask-layer{
                    display: none;
                    position: absolute;
                    top: 0;
                    left: 0;
                    z-index: 10;
                    width: 100%;
                    height: 150px;
                    background: rgba(0,0,0,.4);
                    .icon-box{
                        width: 138px;
                        margin: auto;
                        margin-top:47px;
                        .el-icon-edit-outline, .el-icon-delete{
                            font-size: 20px;
                            color: #fff;
                            font-weight: 700;
                            border: 2px solid #fff;
                            padding: 11px;
                            border-radius: 50%;
                            margin: 0 10px;
                            &:hover{
                                opacity: 0.7;
                            }
                        }
                        .el-icon-edit-outline{
                            background: #3f8def;
                            border: 2px solid #3f8def;
                        }
                    }
                }
                .imgList{
                    max-width:230px;
                    height:150px;
                    line-height: 148px;
                    margin: auto;
                    text-align: center;
                }
                img{
                    display: inline-block;
                    max-width: 230px;
                    max-height: 116px;
                    vertical-align: middle;
                }
                .info {
                    height: 14px;
                    line-height: 14px;
                    color: #a09f9f;
                    margin-bottom: 10px;
                    text-indent: 10px;
                }
                .name {
                    color: #777777;
                    margin-top: 9px;
                    margin-bottom: 17px;
                    font-size: 15px;
                } 
            }
           .no-margin-right{margin-right: 0!important;}
        }
    }
}
</style>
