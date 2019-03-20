<template>
    <div id="my-quotation-detail">
        <div class="content">
            <div class="crumb-bread">
                <span class="router-link" @click="$router.push({path:'/index'})">询盘</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="router-link" @click="$router.push({path:'/usercenter/my-require'})">我的询盘</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="curr">报价详情</span>
            </div>
            <div class="fl-right">
                <el-button type="primary" v-if="data.offerStatus == 210020 && data.acceptStatus==450020" @click="showOrderDlg()">去下单</el-button>
                <el-button type="danger"  v-if="data.offerStatus == 210020 && data.acceptStatus==450010" @click="accept()">接受报价</el-button>
                <el-button @click="printBtn('Print-Content-detail')">打印报价详情单</el-button>
            </div>
            <div id="Print-Content-detail">
                <div id="Print-Content">
                    <div class="require-number clearfix">
                        <div class="fl-left">
                            <div class="number">需求编号：{{data.requirementPriceNo}}</div>
                            <div class="state">{{data.offerStatusText}}</div>
                            <!-- <div class="modify-btn btn" @click="submit" v-if="data.acceptStatus==450010&&data.requirement.requirementStatus==107020&&data.offerStatus==210020">修改报价</div> -->
                        </div>
                    </div>
                    <!-- <div>
                        <div>需求方：<span>{{user.companyName}}</span> </div>
                        <div>供应商全称：深圳市永兴五金制品厂</div>
                    </div> -->
                    <div class="content-item">
                        <div class="content-item-box part-info-box">
                            <table v-if="data.requirementInfo&&data.requirementInfo.priceTemplate==490010">
                                <thead>
                                    <tr>
                                        <td width="142px">零件编号</td>
                                        <td width="148px">零件名称</td>
                                        <td width="132px">数量</td>
                                        <td width="170px">最小接单量</td>
                                        <td width="206px">报价阶梯</td>
                                        <td width="256px">报价</td>
                                        <td width="146px"></td>
                                    </tr>
                                </thead>
                                <tbody v-for="(item,index) in data.requirementPriceItemList" :key="'tbody' + index" v-if="item.requirementItemInfo&&item.requirementItemInfo.isLadderPrice">
                                    <tr>
                                        <td>{{item.requirementItemInfo.itemNo||'-'}}</td>
                                        <td>{{item.requirementItemInfo.itemName}}</td>
                                        <td>{{item.requirementItemInfo.estimateCount}}</td>
                                        <td>{{item.minCount}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[0].from}}-{{item.priceInfo&&item.priceInfo[0].to}}</td>
                                        <td class="td-with-bt-border"><span v-if="item.priceInfo">{{item.priceInfo&&item.priceInfo[0].price}} /件</span><span v-else>不报价</span></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[1].from}}-{{item.priceInfo&&item.priceInfo[1].to}}</td>
                                        <td class="td-with-bt-border"><span v-if="item.priceInfo">{{item.priceInfo&&item.priceInfo[1].price}} /件</span><span v-else>不报价</span></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td class="td-with-bt-border">>{{item.priceInfo&&item.priceInfo[2].from}}</td>
                                        <td class="td-with-bt-border"><span v-if="item.priceInfo">{{item.priceInfo&&item.priceInfo[2].price}} /件</span><span v-else>不报价</span></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                                <tbody v-else :key="'tbody' + index" :ref="'requirementItem'+index">
                                    <tr>
                                        <td>{{item.requirementItemInfo.itemNo||'-'}}</td>
                                        <td>{{item.requirementItemInfo.itemName}}</td>
                                        <td>{{item.requirementItemInfo.estimateCount}}</td>
                                        <td>{{item.minCount}}</td>
                                        <td class="td-with-bt-border">-</td>
                                        <td class="td-with-bt-border"><span v-if="item.priceInfo">{{item.priceInfo&&item.priceInfo.price}} /件</span><span v-else>不报价</span></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>

                            <table v-else>
                                <thead>
                                    <tr>
                                        <td width="114px" :rowspan="2">零件编号</td>
                                        <td width="100px" :rowspan="2">零件名称</td>
                                        <td width="66px" :rowspan="2">数量</td>
                                        <td width="134px" :rowspan="2">图号</td>
                                        <td width="85px" :rowspan="2">材料</td>
                                        <td width="80px" class="td-with-rg-border" :rowspan="2">报价阶梯</td>
                                        <td width="160px" class="td-with-bt-border" style="height:28px;" :colspan="3">材料费</td>
                                        <td width="160px" class="td-with-bt-border td-with-lf-border" style="height:28px;" :colspan="3">加工费</td>
                                        <td width="87px" class="td-with-lf-border" :rowspan="2">综合管理费</td>
                                        <td width="87px" :rowspan="2">总单价</td>
                                        <td width="93px" :rowspan="2"></td>
                                    </tr>
                                    <tr>
                                        <td width="54px">材料重量(kg)</td>
                                        <td width="54px">材料单价(元/kg)</td>
                                        <td width="54px">加工时间(秒)</td>
                                        <td width="54px" class="td-with-lf-border">加工单价(元/h)</td>
                                        <td width="54px">加工费(元)</td>
                                        <td width="54px">所占单价总比重</td>
                                    </tr>
                                </thead>
                                <tbody v-for="item in data.requirementPriceItemList" v-if="item.requirementItemInfo.isLadderPrice">
                                    <tr>
                                        <td>{{item.requirementItemInfo.itemNo||'-'}}</td>
                                        <td>{{item.requirementItemInfo.itemName}}</td>
                                        <td>{{item.requirementItemInfo.estimateCount}}</td>
                                        <td>-</td>
                                        <td>{{item.material}}</td>
                                        <td class="td-with-rg-border">{{item.priceInfo&&item.priceInfo[0].from}}-{{item.priceInfo&&item.priceInfo[0].to}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[0].materialPrice.weight}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[0].materialPrice.singlePrice}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[0].materialPrice.processingTime}}</td>
                                        <td class="td-with-bt-border td-with-lf-border">{{item.priceInfo&&item.priceInfo[0].processPrice.singlePrice}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[0].processPrice.price}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[0].processPrice.rate}}</td>
                                        <td class="td-with-bt-border td-with-lf-border">{{item.priceInfo&&item.priceInfo[0].managementPrice}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[0].price}}</td>
                                        <td class="td-with-bt-border"></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td class="td-with-rg-border">{{item.priceInfo&&item.priceInfo[1].from}}-{{item.priceInfo&&item.priceInfo[1].to}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[1].materialPrice.weight}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[1].materialPrice.singlePrice}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[1].materialPrice.processingTime}}</td>
                                        <td class="td-with-bt-border td-with-lf-border">{{item.priceInfo&&item.priceInfo[1].processPrice.singlePrice}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[1].processPrice.price}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[1].processPrice.rate}}</td>
                                        <td class="td-with-bt-border td-with-lf-border">{{item.priceInfo&&item.priceInfo[1].managementPrice}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[1].price}}</td>
                                        <td class="td-with-bt-border"></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td class="td-with-rg-border">{{item.priceInfo&&item.priceInfo[2].from}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[2].materialPrice.weight}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[2].materialPrice.singlePrice}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[2].materialPrice.processingTime}}</td>
                                        <td class="td-with-bt-border td-with-lf-border">{{item.priceInfo&&item.priceInfo[2].processPrice.singlePrice}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[2].processPrice.price}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[2].processPrice.rate}}</td>
                                        <td class="td-with-bt-border td-with-lf-border">{{item.priceInfo&&item.priceInfo[2].managementPrice}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo[2].price}}</td>
                                        <td class="td-with-bt-border"></td>
                                    </tr>
                                </tbody>
                                <tbody v-else :key="'tbody' + index">
                                    <tr>
                                        <td>{{item.requirementItemInfo.itemNo||'-'}}</td>
                                        <td>{{item.itemName}}</td>
                                        <td>{{item.estimateCount}}</td>
                                        <td>-</td>
                                        <td>{{item.material}}</td>
                                        <td class="td-with-rg-border">-</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo.materialPrice.weight}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo.materialPrice.singlePrice}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo.materialPrice.processingTime}}</td>
                                        <td class="td-with-bt-border td-with-lf-border">{{item.priceInfo&&item.priceInfo.processPrice.singlePrice}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo.processPrice.price}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo.processPrice.rate}}</td>
                                        <td class="td-with-bt-border td-with-lf-border">{{item.priceInfo&&item.priceInfo.managementPrice}}</td>
                                        <td class="td-with-bt-border">{{item.priceInfo&&item.priceInfo.price}}</td>
                                        <td class="td-with-bt-border"></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div class="other-info">
                                <div class="row-info">
                                    <div class="info-item">交付日：2018-09-17</div>
                                    <div class="info-item">结算方式：{{data.settlementTypeText}}{{data.settlementPeriodText||''}}</div>
                                    <div class="info-item">价格有效期：{{data.offerInvalidTime}}</div>
                                    <div class="info-item">配送方式：{{data.expressModeText}}</div>
                                </div>
                                <div class="row-info">
                                    <div class="info-item" v-if="data.invoiceTemplateInfo">{{data.invoiceTemplateInfo.invoiceTitleTypeText}} {{data.invoiceTemplateInfo.invoiceTypeText}} {{data.invoiceTemplateInfo.taxRate*100}}%</div>
                                </div>
                            </div>
                            <div class="beautiful-line" style="margin:0 30px 0 15px;"></div>
                            <div class="other-info">
                                <div class="row-info contact-info" v-if="data.requirementInfo">
                                    <div class="info-item">对接人：</div>
                                    <div class="info-item">{{data.requirementInfo.contactName||''}}</div>
                                    <div class="info-item">{{data.requirementInfo.contactPhone||''}}</div>
                                    <div class="info-item">{{data.requirementInfo.contactEmail||''}}</div>
                                    <div class="info-item" v-if="data.otherFiles">附件：<a class="file-item ellipsis" :title="item.fileName" :key="item.id" :href="item.fileUrl" v-for="item in data.otherFiles">{{item.fileName}}</a></div>
                                </div>
                                <div class="row-info clearfix remark-info">
                                    <div class="label">报价说明：</div>
                                    <div class="text">{{data.remark || '无'}}</div>
                                </div>
                                <div class="help">注：报价含运费、含税、含包装费、价格有效期线下商定</div>
                            </div>
                        </div>
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
    </div>
</template>
<script>
import {print} from '../lib/GeneralTools.js';
export default {
    components:{
    },
    data() {
        return {
            data: '',
            offerId: '',
            user:'',
            orderDlg: {
                visible: false,
                tableData:[],
                amount:0,
                companyName: ''
            },
        }
    },
    created() {
        this.user=this.$LocalStorage.gxzzpt2_consumer();
        this.offerId = Number(this.$route.query.offerId);
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
            return amount.toFixed(2);
        }
    },
    methods: {
        //获取数据
        async getData() {
            let res = await this.$http.post('/custom/requirementPrice/get',{id:this.offerId});
            this.$ResultTips(res);
            if ( res.data.code == 200 ) {
                this.data = res.data.data;
            }
        },
        //打印
        printBtn(name){
            print(name)
        },
        //接受订单
        async accept() {
            let res = await this.$http.post('/custom/requirementPrice/acceptPrice', {id: this.offerId})
            this.$ResultTips(res);
            if(res.data.code==200){this.getData()}
        },
        inputNum(item) {
            if ( Number(item.num) < item.minCount ) {
            //    this.$error('供应商要求最小接单数量为'  + item.minCount );
            //    item.num = item.minCount;
            }
        },
        //显示去下单弹出框
        showOrderDlg() {
            this.orderDlg.tableData = [];
            this.orderDlg.companyName = this.data.companyInfo.companyName;
            this.data.requirementPriceItemList.map(( item )=>{
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
        //提交去下单；
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
    }
}
</script>

<style lang="less" media="print">
#Print-Content{
    width:1060px;
    .td-with-bt-border{
        border-bottom: 1px solid #d0d0d0;
    }
    .td-with-lf-border{
        border-left: 1px solid #d0d0d0;
    }
    .td-with-rg-border{
        border-right: 1px solid #d0d0d0;
    }
    .require-number{
        margin-top: 5px;
        height: 30px;
        line-height: 30px;
        .number{
            display: inline-block;
            width: 205px;
            font-size: 16px;
            font-weight: 700;
        }
        .state{
            display: inline-block;
            width: 56px;
            height: 23px;
            background-color: #e5f1ff;
            border: solid 1px #3f8def;
            color: #3f8def;
            line-height: 23px;
            text-align: center;
        }
        .btn{
            display: inline-block;
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
        margin-top: 24px;
        .title{
            margin-bottom: 10px;
            font-weight: 700;
        }
        .beautiful-line{
            border-bottom: 1px solid #e2e2e2;
        }
        .content-item-box{
        //    padding: 22px 25px;
            background: #fff;
            table{
                thead td{
                    text-align: center;
                    background: #fff;
                    height: 34px;
                    vertical-align: middle;
                    border-bottom: 1px solid #e2e2e2;
                }
                tbody{
                    border-bottom: 1px solid #e2e2e2;
                    tr{
                        td{
                            background: #fff;
                            height: 37px;
                            text-align: center;
                            vertical-align: middle;
                            .input-item{
                                width: 96px;
                                height: 26px;
                                border: 1px solid #d0d0d0;
                                box-sizing: border-box;
                                text-align: center;
                            }
                            .wd-32{
                                width: 32px;
                            }
                            .wd-68{
                                width: 68px;
                            }
                            .red-border{
                                border: 1px solid #f56c6c;
                            }
                        }
                    }
                }
                tbody:last-child{
                    tr:last-child td{
                        height: 47px;
                        padding-bottom: 10px;
                    }
                    tr:last-child .td-with-bt-border{
                        border-bottom: none;
                    }
                }
            }
            .other-info{
                padding: 17px 20px 17px 15px;
                .row-info{
                    .info-item{
                        display: inline-block;
                        height: 12px;
                        line-height: 12px;
                        .file-item{
                            display: inline-block;
                            max-width: 100px;
                            color: #3f8def;
                            text-decoration: underline;
                        }
                        .file-item + .file-item{
                            margin-left: 15px;
                        }
                    }
                    .info-item + .info-item{
                        margin-left: 80px;
                    }
                }
                .row-info + .row-info{
                    margin-top: 15px;
                }
                .contact-info{
                    .info-item + .info-item{
                        margin-left: 20px;
                    }
                }
                .remark-info{
                    line-height: 22px;
                    margin-bottom: 10px;
                    margin-top: 10px !important;
                    .label{
                        width: 72px;
                        float: left;
                    }
                    .text{
                        float: left;
                        width: 1050px;
                    }
                }
            }
        }
    }
}
#my-quotation-detail .content{
    width:1200px;
    padding: 0 15px;
    margin: 0 auto;
    .crumb-bread{
        height: 48px;
        line-height: 48px;
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
    #Print-Content{
        width:1170px;
    }
    .fl-right{
        .el-button{
            margin-top: 5px;
            height: 30px;
            line-height: 26px;
            padding: 0 20px;
            margin-left: 10px;
        }
    }
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
        justify-content: space-around;
    //    margin-top: 30px;
        padding: 20px 120px 10px 120px;
        .form-btn{
            width: 90px;
            height: 40px;
            border-radius: 4px;
            box-sizing: border-box;
            color: #fff;
            line-height: 40px;
            text-align: center;
            cursor: pointer;
            background: #e2e2e2;
        }
        .form-next-btn{
            color: #fff;
            background: #3f8def;
        }
    }
    .el-input__inner{
        text-align: center;
    }
}
</style>
