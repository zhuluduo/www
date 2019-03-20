<template>
    <div id="quotation-list">
        <div class="content">
            <div class="require-number clearfix">
                <div class="number">需求编号：{{data.requirementNo}}</div>
                <div class="state blue" v-if="data.requirementStatus==107020">{{data.requirementStatusText}}</div>
                <div class="state" v-if="data.requirementStatus==107030">{{data.requirementStatusText}}</div>
            </div>
            <div class="content-item">
                <div class="title">零件信息</div>
                <div class="content-item-box">
                    <table>
                        <thead>
                            <tr>
                                <td width="120px">报价编号</td>
                                <td width="145px">供应商</td>
                                <td width="104px">零件名</td>
                                <td width="104px">数量</td>
                                <td width="120px">
                                    <div>第一阶梯报价</div>
                                </td>
                                <td width="120px">
                                   <div>第二阶梯报价</div>
                                </td>
                                <td width="120px">
                                    <div>第三阶梯报价</div>
                                </td>
                                <td width="106px">有效期</td>
                                <td width="106px">操作</td>
                            </tr>
                         </thead>
                         <tbody v-for="requirement in data.requirementPriceList">
                            <tr class="tr1">
                                <td>
                                    <router-link :to="{path:'/quote/detail/my',query:{offerId: requirement.id}}" target="_blank"><span v-if="requirement.offerStatus!==210010" class="tb-link">{{requirement.requirementPriceNo}}</span></router-link>
                                    <span v-if="requirement.offerStatus==210010">{{requirement.requirementPriceNo}}</span>
                                </td>
                                <td><span class="tb-link" @click="toManufacturerDetail(requirement)">{{requirement.companyInfo.companyName}}</span></td>
                                <td colspan="5">
                                    <div class="td-row" v-for="item in requirement.requirementPriceItemList">
                                        <div class="td-part-name ellipsis">{{item.requirementItemInfo.itemName}}</div>
                                        <div class="td-number">{{item.requirementItemInfo.estimateCount}}</div>
                                        <div v-if="item.priceInfo&&Array.isArray(item.priceInfo)" class="td-ladder-box">
                                            <div class="number-range">{{item.priceInfo[0].from}}-{{item.priceInfo[0].to}}</div>
                                            <div class="price">￥{{requirement.offerStatus==210010?'-':item.priceInfo[0].price}}</div>
                                        </div>
                                        <div v-if="item.priceInfo&&Array.isArray(item.priceInfo)" class="td-ladder-box">
                                            <div class="number-range">{{item.priceInfo[1].from}}-{{item.priceInfo[1].to}}</div>
                                            <div class="price">￥{{requirement.offerStatus==210010?'-':item.priceInfo[1].price}}</div>
                                        </div>
                                        <div v-if="item.priceInfo&&Array.isArray(item.priceInfo)" class="td-ladder-box">
                                            <div class="number-range">>{{item.priceInfo[2].from}}</div>
                                            <div class="price">￥{{requirement.offerStatus==210010?'-':item.priceInfo[2].price}}</div>
                                        </div>
                                        <div class="td-singlePrice" v-if="!Array.isArray(item.priceInfo)"><span v-if="item.priceInfo">￥{{item.priceInfo.price}}(单价)</span><span v-else>-</span></div>
                                    </div>
                                </td>
                                <td>{{requirement.offerInvalidTime}}</td>
                                <td>
                                    <span class="btn" v-if="requirement.offerStatus == 210020 && requirement.acceptStatus==450010 " @click="accept( requirement )">接受报价</span>
                                    <span class="btn" v-if="requirement.offerStatus == 210020 && requirement.acceptStatus==450020 && requirement.orderFlag" @click="showOrderDlg( requirement )">去下单</span></td>
                                </td>
                            </tr>
                         </tbody>
                    </table>
                </div>
            </div>
        </div>
        <el-dialog title="去下单" width="650px" :visible.sync="orderDlg.visible">
            <div class="place-order-dlg">
                <div class="company-info">选择供应商：<span>{{orderDlg.companyName}}</span></div>
                <table>
                    <thead>
                        <tr>
                            <td width="50px"></td>
                            <td width="170px">零件名称</td>
                            <td width="130px">下单数量</td>
                            <td width="120px">单价</td>
                            <td width="120px">小计</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in orderDlg.tableData">
                            <td><el-checkbox v-model="item.isSelect"></el-checkbox></td>
                            <td>{{item.itemName}}</td>
                            <td class="td-number"><el-input :maxlength="9" v-model="item.num" @change="inputNum(item)"></el-input></td>
                            <td>{{item | priceFilter}}</td>
                            <td>{{item | totalFilter}}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="total-amount">预计订单总金额：￥{{orderDlg.tableData|amountFilter}}</div>
                <div class="form-btn-box">
                    <div class="form-btn" @click="orderDlg.visible=false">取消</div>
                    <div class="form-btn form-next-btn" @click="submit">去下单</div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    components:{
    },
    data() {
        return {
            data: '',
            requireId:'',
            orderDlg: {
                visible: false,
                tableData:[],
                amount:0,
                companyName: ''
            },
        }
    },
    created() {
        this.requireId = Number(this.$route.query.requireId);
        this.getData();
    },
    filters: {
        priceFilter: function( item ){
            if ( item.isLadder ) {
                 if ( item.num >= item.priceInfo[0].from && item.num <= item.priceInfo[0].to ) {
                    item.singlePrice = item.priceInfo[0].price;
                    return item.priceInfo[0].price.toFixed(2);
                } else if ( item.num >= item.priceInfo[1].from && item.num  <= item.priceInfo[1].to ) {
                    item.singlePrice = item.priceInfo[1].price;
                    return item.priceInfo[1].price.toFixed(2);
                } else if ( item.num >= item.priceInfo[2].from ) {
                    item.singlePrice = item.priceInfo[2].price;
                    return item.priceInfo[2].price.toFixed(2);
                } else {
                    item.singlePrice = item.priceInfo[2].price;
                    return item.priceInfo[0].price.toFixed(2);
                }
            } else {
                return item.singlePrice.toFixed(2);
            }
           
        },
        totalFilter: function( item ) {
            return (Number(item.num)*item.singlePrice).toFixed(2);
        },
        amountFilter: function( tableData ) {
            let amount = 0;
            tableData.map(( item ) => {
                if ( item.isSelect ) {
                    amount += Number((Number(item.num)*item.singlePrice).toFixed(2));
                }
            })
        //    this.orderDlg.amount = amount;
            return amount.toFixed(2);
        }
    },
    computed: {
       
    },
    methods:{
        accept( requirement ) {
            this.$http.post('/custom/requirementPrice/acceptPrice', {id: requirement.id}).then(( res ) => {
                if ( res.data.code == 200 ) {
                    this.$success('操作成功');
                    this.getData();
                } else {
                    this.$error('操作失败');
                }
            })
        },
        inputNum(item) {
            if ( Number(item.num) < item.minCount ) {
            //    this.$error('供应商要求最小接单数量为'  + item.minCount );
            //    item.num = item.minCount;
            }
        },
        showOrderDlg( requirement ) {
            this.orderDlg.tableData = [];
            this.orderDlg.companyName = requirement.companyInfo.companyName;
            requirement.requirementPriceItemList.map(( item )=>{

                if ( !item.isAbandon ) {
                    var tableItem = {
                        itemName: item.requirementItemInfo.itemName,
                        isSelect: false,
                        singlePrice: 0,
                        num: item.minCount,
                        total: 0,
                        minCount: item.minCount,
                        priceInfo: [],
                        id: item.id,
                        isLadder: false,
                    };
                    if ( 'priceInfo' in item && Array.isArray(item.priceInfo)) {
                        tableItem.priceInfo = item.priceInfo;
                        tableItem.isLadder = true;
                    } else {
                        tableItem.singlePrice = item.priceInfo.price;
                    }
                    this.orderDlg.tableData.push( tableItem );
                }
                
            })
            this.orderDlg.visible = true;
        },

        getData() {
            this.$http.post('/custom/requirement/getPrices', {id: this.requireId}).then(( res ) => {
                if ( res.data.code == 200 ) {
                    this.data = res.data.data;
                } else {
                    this.$error(res.data.message);
                }
            })
        },

        //
        submit() {
            var params = [];
            let enableSubmit = true;
            let currItem = null;
            this.orderDlg.tableData.map(( item ) => {
                if ( item.isSelect ) {
                    if ( Number(item.num) < item.minCount ) {
                        enableSubmit = false;
                        currItem = item;
                    }
                    let paramItem = { requirementPriceItemId: item.id, quantity: Number(item.num) };
                    params.push( paramItem );
                }
            })
            if ( params.length > 0 ) {
                if ( enableSubmit ) {
                    this.$router.push({name:'/generate-order',params:{requirementList:params}});
                } else {
                    this.$error('供应商要求' + currItem.itemName + '零件最小接单数量为'  + currItem.minCount);
                }
            } else {
                this.$message({message:'请选择零件',duration:500, type:'error'});
            }
        },

        toManufacturerDetail( requirement ) {
            let { href } = this.$router.resolve({path: '/manufacturer-audits',query:{companyId: requirement.companyInfo.id}});
            window.open(href, '_blank');
        }
    }
}
</script>
<style lang="less">
#quotation-list{
    .el-input__inner{
        text-align: center;
    }
    .ellipsis{
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    div{
        box-sizing: border-box;
    }
    .content{
        width: 1045px;
        margin: 0 auto;
        .require-number{
            margin-top: 15px;
            margin-bottom: 15px;
            .number{
                float: left;
                width: 170px;
                font-size: 12px;
                line-height: 23px;
            }
            .state{
                float: left;
                width: 56px;
                height: 23px;
                background-color: #ececec;
                line-height: 23px;
                text-align: center;
            }
            .blue{
                background-color: #e5f1ff;
                border: solid 1px #3f8def;
                color: #3f8def;
            }
            .btn{
                float: right;
                width: 70px;
                height: 30px;
                background-color: #3f8def;
                border-radius: 4px;
                color: #fff;
                line-height: 30px;
                text-align: center;
                cursor: pointer;
            }
        }
        .content-item{
            margin-bottom: 32px;
            .title{
                margin-bottom: 10px;
                font-weight: 700;
            }
            .content-item-box{
                table{
                    border: 1px solid #e2e2e2;
                    thead td{
                        text-align: center;
                        background: #ebebeb;
                        height: 34px;
                        vertical-align: middle;
                        border-bottom: 1px solid #e2e2e2;
                        .fs12{
                            font-size: 12px;
                        }
                    }
                    tbody{
                        border-bottom: 1px solid #e2e2e2;
                        tr{
                            td{
                                background: #fff;
                                padding: 0 5px;
                            }
                        }
                        .tr1{
                            td{
                               text-align: center;
                               vertical-align: middle;
                            }
                            .btn{
                                display: inline-block;
                                width: 72px;
                                height: 26px;
                                background-color: #3f8def;
                                border-radius: 4px;
                                color: #fff;
                                line-height: 26px;
                                text-align: center;
                                cursor: pointer;
                            }
                            .tb-link{
                                color: #3f8def;
                                text-decoration: underline;
                            }
                            .td-row{
                                display: flex;
                                height: 48px;
                                border-right: 1px solid #e2e2e2;
                                .td-part-name{
                                    width: 101px;
                                    height: 48px;
                                    line-height: 48px;
                                    border-left: 1px solid #e2e2e2;
                                }
                                .td-number{
                                    width: 101px;
                                    height: 48px;
                                    line-height: 48px;
                                    border-right: 1px solid #e2e2e2;
                                }
                                .td-singlePrice{
                                    width: 300px;
                                    height: 48px;
                                    line-height: 48px;
                                }
                                .td-ladder-box{
                                    position: relative;
                                    width: 100px;
                                    height: 48px;
                                    .number-range{
                                        font-size: 12px;
                                        color: #b1b1b1;
                                    //    margin-bottom: 6px;
                                        margin-top: 10px;
                                    }
                                }
                            }
                            .td-row + .td-row{
                                 border-top:1px solid #e2e2e2;
                            }
                        }
                    }
                }
            }
        }
    }
    .el-dialog__body{
        padding: 20px 28px;
    }
    .place-order-dlg{
        .company-info{
            margin-bottom: 10px;
            span{
                color: #3f8def;
            }
        }
        .total-amount{
            text-align: right;
            font-weight: bold;
            line-height: 35px;
        }
        table {
            thead, tbody{
                td {
                    text-align: center;
                    padding: 10px 0;
                    border-top: 1px solid #e2e2e2;
                    border-bottom: 1px solid #e2e2e2;
                }
                .td-number{
                    padding: 10px 10px;
                }
            }
            
        }
        .form-btn-box{
            display: flex;
            justify-content: flex-end;
            margin-top: 30px;
            .form-btn{
                width: 86px;
                height: 30px;
                border-radius: 4px;
                box-sizing: border-box;
                color: #fff;
                line-height: 30px;
                text-align: center;
                cursor: pointer;
                background: #e2e2e2;
            }
            .form-next-btn{
                margin-left: 32px;
                color: #fff;
                background: #3f8def;
            }
        }
    }
}
</style>
