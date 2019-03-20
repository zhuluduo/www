<template>
    <div id="contract-detail-print">
        <div id="contract-detail">
            <div class="content">
                <div class="top">
                    <div class="status blur" v-if="contractStatus==470030"><span>已签订</span></div>
                    <div class="status" v-if="contractStatus==470020"><span>待确认</span></div>
                    <div class="status" v-if="contractStatus==470010"><span>待签订</span></div>
                    <div class="btn" @click="printBtn('contract-detail-print')">打印</div>
                </div>
                <div v-html="contractContent" class="contractContent">

                </div>
                <!-- <div id="contract-content">
                    <div style="font-size:24px;text-align:center;color:#2e2e2e;margin-top:21px;">采购订单</div>
                    <div style="font-size:16px;color: #2e2e2e;margin-top:20px;text-align:right;margin-top:32px;margin-bottom:8px;">采购订单编号：9999999999999</div>
                    <div style="display:flex;color:#757575;line-height:25px;border-bottom:1px solid #e2e2e2;padding-bottom:15px;">
                        <div style="width:50%;flex:1">
                            <div>供应商名称：（以下简称乙方）</div>
                            <div>供应商地址：</div>
                            <div>联系电话：</div>
                        </div>
                        <div style="width:50%;flex:1">
                            <div>供应商名称：（以下简称乙方）</div>
                            <div>供应商地址：</div>
                            <div>联系电话：</div>
                        </div>
                    </div>
                    <div style="display:flex;color:#757575;line-height:25px;padding:15px 0 20px 0;">
                        <div style="flex:3">
                            <div>采购单号：</div>
                            <div>采购日期：</div>
                        </div>
                        <div style="flex:3">
                            <div>付款条件：</div>
                            <div>价格条件：</div>
                        </div>
                        <div style="flex:2">
                            <div>税种：</div>
                            <div>币种：</div>
                        </div>
                    </div>
                    <table style="width:1200px;text-align:center;border-collapse:collapse;border:1px solid #000;table-layout: fixed;">
                        <tr style="color:#757575">
                            <th style="border:1px solid #000;height:30px;vertical-align: middle;">项次</th>
                            <th style="border:1px solid #000;height:30px;vertical-align: middle;">品牌（MPN）</th>
                            <th style="border:1px solid #000;height:30px;vertical-align: middle;">规格</th>
                            <th style="border:1px solid #000;height:30px;vertical-align: middle;">数量</th>
                            <th style="border:1px solid #000;height:30px;vertical-align: middle;">含税单价</th>
                            <th style="border:1px solid #000;height:30px;vertical-align: middle;">含税总价</th>
                            <th style="border:1px solid #000;height:30px;vertical-align: middle;">备注</th>
                        </tr>
                        <tr style="color:#757575">
                            <td style="border:1px solid #000;height:30px;vertical-align: middle;"></td>
                            <td style="border:1px solid #000;height:30px;vertical-align: middle;"></td>
                            <td style="border:1px solid #000;height:30px;vertical-align: middle;"></td>
                            <td style="border:1px solid #000;height:30px;vertical-align: middle;"></td>
                            <td style="border:1px solid #000;height:30px;vertical-align: middle;"></td>
                            <td style="border:1px solid #000;height:30px;vertical-align: middle;"></td>
                            <td style="border:1px solid #000;height:30px;vertical-align: middle;">傻吊林楷深</td>
                        </tr>
                        <tr style="color:#757575">
                            <td style="border:1px solid #000;height:30px;vertical-align: middle;"></td>
                            <td style="border:1px solid #000;height:30px;vertical-align: middle;"></td>
                            <td style="border:1px solid #000;height:30px;vertical-align: middle;"></td>
                            <td style="border:1px solid #000;height:30px;vertical-align: middle;"></td>
                            <td style="border:1px solid #000;height:30px;vertical-align: middle;"></td>
                            <td style="border:1px solid #000;height:30px;vertical-align: middle;"></td>
                            <td style="border:1px solid #000;height:30px;vertical-align: middle;">傻吊林楷深</td>
                        </tr>
                    </table>
                    <div style="color:#757575;line-height:25px;text-align:right;">税前金额合计：10000.00</div>
                    <div style="color:#757575;line-height:25px;text-align:right;">税后金额合计：10000.00</div>
                    <div style="color:#757575;margin-top:80px;">
                        <div>备注：</div>
                        <div>1.交货方式：乙方负责运输到指定地点，包装运输费用及保险费由乙方承担；</div>
                        <div>2.交期：乙方必须遵守本订购单之交货期，如无法达成，应书面回传及电话通知确认后调整交货期；</div>
                        <div>3.乙方应对每批产品在外包装及送货单上标明订单号及品名；</div>
                        <div>4.验收标准：乙方提供的产品以甲方上传的图纸为验收标准,乙方每次供货时应附上出货检验报告等；</div>
                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>
<script>
import {print} from '../lib/GeneralTools.js';
export default {
    data() {
        return {
            contractId: '',
            contractStatus: '',
            contractContent: ''
        }
    },
    created() {
        this.contractId = Number(this.$route.query.contractId);
        this.getData();
    },
    methods: {
        getData() {
            this.$http.post('/custom/order/getContract',{contractId: this.contractId}).then(( res ) => {
                if ( res.data.code == 200 ) {
                    this.contractStatus = res.data.data.contractStatus;
                    this.contractContent = res.data.data.contractContent;
                } else {
                    this.$error(res.data.message);
                }
            })
        },
        printBtn(name){
            print(name)
        },
    }
}
</script>

<style lang="less" media="print">
@page
    {
        size: auto;   /* auto is the initial value */
        margin: 0 10mm 0 10mm;
        /* margin: 0 10mm 0 10mm;  this affects the margin in the printer settings 最关键的还是这个 */
    }
#contract-detail{
    width: 100%;
    .content{
        width: 1200px;
        margin: auto;
        .top{
            margin-top: 35px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .status{
                color: #f03a0d;
                font-size: 16px;
            }
            .blur{
                color: #3f8def;
            }
            .btn{
                width: 100px;
                height: 36px;
                box-sizing: border-box;
                text-align: center;
                line-height: 36px;
                border-radius: 4px;
                color: #fff;
                background: #3f8def;
                cursor: pointer;
            }
        }
    }
    //打印的样式；
    table{width: 1060px !important;}
}

//页面显示覆盖打印样式；
#contract-detail-print,#contract-detail{
    table{width: 1200px !important;}
}
</style>
