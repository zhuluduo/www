<template>
  <div class="quotation-detail">
      <div class="content">
          <div class="require-number">
              <span class="num">需求编号：{{data.requirementNo}}</span>
              <span class="state">{{data.requirementStatusText}}</span>
          </div>
          <div class="content-item">
              <div class="conent-item-title">需求联系人</div>
              <div class="content-item-info contact-info">
                  <span>联系人：{{data.contactName}}</span>
                  <span>联系电话：{{data.contactPhone}}</span>
                  <span>邮箱：{{data.contactEmail}}</span>
              </div>
          </div>
          <div class="content-item">
              <div class="conent-item-title">报价</div>
               <div class="content-item-info quotation-info">
                <!--  <p class="summary-info">您要求平台帮忙询价希望得到{{data.requirementPriceList?data.requirementPriceList.length:0}}家报价</p>
                 <p class="summary-info">平台为您挑选了{{data.requirementPriceList?data.requirementPriceList.length:0}}家供应商，
                     其中{{data.haveOfferCount}}家已报价、{{data.refuseOfferCount}}家不报价、{{data.noOfferCount}}家未报价，平台为您筛选出{{data.haveOfferCount}}家性价比最佳的报价。</p> -->
                 <div>
                     <table class="quotation-table">
                         <thead>
                            <tr>
                                <td align="center" valign="middle" width="130px">供应商</td>
                                <td width="140px">报价时间</td>
                                <td width="188px">业务接口人</td>
                                <td width="308px">报价</td>
                                <td width="">其他</td>
                            </tr>
                         </thead>
                         <tbody v-for="(requirement,index) in data.requirementPriceList" :key="index">
                            <tr>
                                <td class="td-company">
                                    <div v-if="requirement.companyInfo">{{requirement.companyInfo.companyName}}</div>
                                    <div class="td-state">{{requirement.offerStatusText}}</div>
                                    <div v-if="requirement.offerStatus==210020 && from == 0" style="margin-top: 35px;">
                                        <span class="td-btn" @click="showDlg(requirement)">去下单</span>
                                    </div>
                                </td>
                                 <td v-if="requirement.offerStatus==210020">
                                    <div class="td-date">{{requirement.createTime}}</div>
                                    <div>{{requirement.offerInvalidTime}}<span class="td-gray-text">前失效</span></div>
                                </td>
                                 <td class="td-contact" v-if="requirement.offerStatus==210020">
                                    <div>{{data.contactName}}</div>
                                    <div>{{data.contactPhone}}</div>
                                    <div>{{data.contactEmail}}</div>
                                </td>
                                 <td class="td-quotation" v-if="requirement.offerStatus==210020">
                                    <div class="price-list" v-if="requirement.ladderPriceInfo">
                                        <p><span>￥{{requirement.ladderPriceInfo[0].price}}/件</span><span class="ml-26">{{requirement.ladderPriceInfo[0].from}}至{{requirement.ladderPriceInfo[0].to}}件</span></p>
                                        <p><span>￥{{requirement.ladderPriceInfo[1].price}}/件</span><span class="ml-26">{{requirement.ladderPriceInfo[1].from}}至{{requirement.ladderPriceInfo[1].to}}件</span></p>
                                        <p><span>￥{{requirement.ladderPriceInfo[2].price}}/件</span><span class="ml-26">大于等于{{requirement.ladderPriceInfo[2].from}}件</span></p>
                                    </div>
                                    <div>
                                        <p v-if="requirement.singlePrice">单价：{{requirement.singlePrice}}</p>
                                        <p>最小接单量：{{requirement.minCount}}</p>
                                        <p v-if="requirement.fsrReportFileIdInfo">可行性评估报告：<a target="_blank" class="td-link" :href="requirement.fsrReportFileIdInfo.fileUrl">{{requirement.fsrReportFileIdInfo.fileName}}</a></p>
                                        <p v-if="requirement.offerDetailFileInfo">报价详情：<a target="_blank" class="td-link" :href="requirement.offerDetailFileInfo.fileUrl">{{requirement.offerDetailFileInfo.fileName}}</a></p>
                                    </div>
                                </td>
                                 <td class="td-other" v-if="requirement.offerStatus==210020">
                                    <div>报价含税</div>
                                    <div>报价含运费</div>
                                    <div>报价含包装费</div>
                                    <div>{{requirement.expressModeText}}</div>
                                    <div>{{requirement.invoiceTemplateInfo.invoiceTypeText}}</div>
                                </td>
                                 <td v-if="requirement.offerStatus!==210020" colspan="4"></td>
                            </tr>
                            <tr v-if="requirement.offerStatus==210020">
                                <td class="td-explain" colspan="5"><div>报价说明：{{requirement.remark}}</div></td>
                            </tr>
                         </tbody>
                     </table>
                 </div>
              </div>
          </div>
      </div>
    <el-dialog title="去下单" width="600px" :visible.sync="offerDlg.visible">
        <div class="offer-dlg-form">
            <el-collapse-transition>
            <!-- <div class="form-msg" v-show="errRes">{{errRes}}</div> -->
            </el-collapse-transition>
            <el-form  ref="offerForm" :model="offerDlg.formData" :rules="offerDlg.rules">
                <el-form-item label="选择供应商：" label-position="left" label-width="114px">
                    <div>{{offerDlg.formData.company}}</div>
                </el-form-item>
                <el-form-item label="下单商品数量：" prop="num" label-position="left" label-width="114px">
                    <el-input @change="handleNumChange" v-model="offerDlg.formData.num"></el-input>
                    <span>￥{{offerDlg.formData.price}}/件</span>
                </el-form-item>
            </el-form>
            <div class="amount">预计订单总额￥:{{offerDlg.formData.total}}</div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closeOfferDlg">取 消</el-button>
            <el-button type="primary"
                :class="offerDlg.formData.num>=currentRequirement.minCount?'':'disabled'"
             @click="submitForm" :disabled="offerDlg.formData.num>=currentRequirement.minCount?false:true">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
    data() {
        return {
            from: 0,
            requireId: '',
            tableList:[{name:'soso'},{name:'soso'},{name:'soso'}],
            data: '',
            currentRequirement: '',
            offerDlg: {
                visible: false,
                formData: {
                    num: 0,
                    company:'',
                    price: 0,
                    total: 0
                },
                rules:{
                     num:[{required: true,message:'请填写下单商品数量',trigger:'blur'}],
                }
            }
        }
    },
    created() {
        this.requireId = Number( this.$route.query.requireId );
        this.from = Number( this.$route.query.from )
        this.getData();
    },
    methods: {
        showDlg( requirement ) {
            this.offerDlg.formData.company = requirement.companyInfo.companyName;
            this.offerDlg.formData.num = requirement.minCount;
            this.currentRequirement = requirement;
            if ( 'ladderPriceInfo' in requirement ) {
                if ( this.offerDlg.formData.num >= 1 && this.offerDlg.formData.num <= requirement.ladderPriceInfo[0].to ) {
                    this.offerDlg.formData.price = requirement.ladderPriceInfo[0].price;
                } else if ( this.offerDlg.formData.num >= requirement.ladderPriceInfo[1].from && this.offerDlg.formData.num <= requirement.ladderPriceInfo[1].to  ) {
                    this.offerDlg.formData.price = requirement.ladderPriceInfo[1].price;
                } else {
                    this.offerDlg.formData.price = requirement.ladderPriceInfo[2].price;
                }
            } else {
                this.offerDlg.formData.price = requirement.singlePrice;
            }
            this.offerDlg.formData.total = (Number(this.offerDlg.formData.price)*Number(this.offerDlg.formData.num)).toFixed(2);
            this.offerDlg.visible = true;
        },
        handleNumChange( value ) {

            if ( /^[0-9]+$/.test(value) ) {
                this.offerDlg.formData.num = value;
            } else {
                this.offerDlg.formData.num = this.currentRequirement.minCount;
            }
            
            if ( 'ladderPriceInfo' in this.currentRequirement ) {
                if ( this.offerDlg.formData.num >= 1 && this.offerDlg.formData.num <= this.currentRequirement.ladderPriceInfo[0].to ) {
                    this.offerDlg.formData.price = this.currentRequirement.ladderPriceInfo[0].price;
                } else if ( this.offerDlg.formData.num >= this.currentRequirement.ladderPriceInfo[1].from && this.offerDlg.formData.num <= this.currentRequirement.ladderPriceInfo[1].to  ) {
                    this.offerDlg.formData.price = this.currentRequirement.ladderPriceInfo[1].price;
                } else {
                    this.offerDlg.formData.price = this.currentRequirement.ladderPriceInfo[2].price;
                }
            } else {
                this.offerDlg.formData.price = this.currentRequirement.singlePrice;
            }
            this.offerDlg.formData.total = (Number(this.offerDlg.formData.price)*Number(this.offerDlg.formData.num)).toFixed(2);
        },
        closeOfferDlg() {
            this.offerDlg.visible = false;
        },
        submitForm() {
            this.$refs.offerForm.validate((valid) => {
                if ( valid ) {
                    this.$router.push({path:'/generate-order',query:{id: this.currentRequirement.id,count: this.offerDlg.formData.num}});
                } else {
                    return false;
                }
            })
        },
        getData() {
            this.$http.post('/custom/manufacturer/requirement/getPrices', {id: this.requireId}).then(( res ) => {
                if ( res.data.code == 200 ) {
                    this.data = res.data.data;
                } else {
                    this.$error(res.data.message);
                }
            })
        }
    }
}
</script>
<style lang="less" scoped>
.quotation-detail{
    .content{
        width: 1005px;
        padding: 0 15px;
        margin: 0 auto;
        box-sizing: border-box;
        .require-number{
            display: flex;
            align-items: center;
            height: 65px;
            border-bottom: 1px solid #e2e2e2;
            box-sizing: border-box;
            margin-bottom: 25px;
            .state{
                margin-left: 30px;
                color: #efab3f;
            }
        }
        .content-item{
            margin-bottom: 30px;
            .conent-item-title{
                margin-bottom: 10px;
                font-weight: 700;
            }
            .content-item-info{
                padding: 25px;
                background: #f5f5f5;
            }
            .contact-info{
                display: flex;
                justify-content: space-between;
            }
            .quotation-info{
                .summary-info{
                    color: #9c9c9c;
                    margin-bottom: 5px;
                }
                .quotation-table{
                    border: 1px solid #e2e2e2;
                    tbody{
                        border-top: 1px solid #e2e2e2;
                    }
                    td{
                        vertical-align:middle;  
                    }
                    thead td{
                        text-align: center;
                        background: #e2e2e2;
                        padding: 9px;
                    }
                    tbody td {
                        text-align: left;
                        background: #fff;
                        padding: 20px;
                    }
                    .td-company{
                        text-align: center;
                    }
                    .td-contact{
                        div{
                            margin-bottom: 10px;
                        }
                    }
                    .td-quotation{
                        .price-list{
                            border-bottom: 1px dashed #f1f1f1;
                            margin-bottom: 12px;
                        }
                        p{
                            margin-bottom: 12px;
                            .ml-26{
                                margin-left: 26px;
                            }
                        }
                    }
                    .td-other{
                        div{
                            margin-bottom: 22px;
                        }
                    }
                    .td-date{
                        padding: 0 22px;
                    }
                    .td-gray-text{
                        color: #9c9c9c;
                        margin-top: 15px;
                    }
                    .td-state{
                        color: #efab3f;
                        margin: 25px 0 0 0;
                    }
                    .td-btn{
                        display: block;
                        width: 62px;
                        height: 28px;
                        border-radius: 4px;
                        text-align: center;
                        line-height: 28px;
                        color: #fff;
                        background: #3f8def;
                        margin: 0 auto;
                        cursor: pointer;
                    }
                    .td-link{
                        text-decoration: underline;
                        color: #3f8def;
                    }
                    .td-explain{
                        text-align: left;
                        padding-top: 0;
                        padding-bottom: 25px;
                        height: 40px;
                        div{
                            border-top: 1px dashed #f1f1f1;
                            padding-top: 25px;
                        }
                    }
                }
            }
        }
    }
    .offer-dlg-form{
        padding-bottom: 20px;
        .el-input{
            width: 350px;
            margin-right: 20px;
        }
        .amount{
            text-align: center;
        }
    }
}
.disabled{
    opacity: .4;
}
</style>

