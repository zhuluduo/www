<template>
    <div id="require-detail">
        <div class="content">
            <div class="crumb-bread">
                <span class="router-link" @click="$router.push({path:'/index'})">首页</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="router-link" @click="$router.push({path:'/enquiry/list'})">我的报价</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="curr">询盘详情</span>
            </div>
            <div class="require-number clearfix">
                <div class="number">需求编号：{{data.requirementNo}}</div>
                <div class="state" v-if="data.enquiryType!=enquiryType.PUBLIC">{{data.requirementPrice?data.requirementPrice.offerStatusText:''}}</div>
                <div class="state" v-else>{{data.requirementStatusText}}</div>
                <div class="modify-btn btn" v-if="isShowBtn&&data.requirementStatus!=107030" @click="toQuotation()">去报价</div>
            </div>
            <div class="content-item">
                <div class="title">需求信息</div>
                <div class="content-item-box">
                    <div class="row-info">
                        <div class="info-item ellipsis">创建时间：{{data.createTime}}</div>
                        <div class="info-item ellipsis">主工艺：{{data.techniqueInfo?data.techniqueInfo.techniqueName:'无'}}</div>
                        <div class="info-item ellipsis">报价截止日期：{{data.offerDeadlineTime}}</div>
                        <div class="info-item ellipsis">所属行业：{{data.industryInfo?data.industryInfo.industryName:'无'}}</div>
                        <div class="info-item ellipsis">送货地区：{{data.deliveryProvince + data.deliveryCity}}</div>
                    </div>
                    <div class="row-info">
                        <div class="info-item ellipsis">结算方式：{{data.settlementTypeText}}{{data.settlementPeriodText}}</div>
                        <div class="info-item ellipsis">询价方式：{{data.enquiryTypeText}}</div>
                        <div class="info-item ellipsis">当前已有报价人次：{{data.haveOfferCount}}次</div>
                        <!-- <div class="info-item ellipsis">交货期：30天</div> -->
                    </div>
                    <div class="multi-row-info">
                        <div style="width:62px">分派说明：</div>
                        <div>{{data.dispatchExplain||'无'}}</div>
                    </div>
                    <div class="beautiful-line"></div>
                    <div class="multi-row-info">
                        <div style="width:67px">需求备注：</div>
                        <div>{{data.description||'无'}}</div>
                    </div>
                    <div class="beautiful-line"></div>
                    <div class="info-item contact-info">
                        联系人信息：
                        <label for="" v-if="user.isValid && user.isManufacturer">
                            <span class="contact-item">{{data.contactName}}</span>
                            <span class="contact-item">{{data.contactPhone}}</span>
                            <span class="contact-item">{{data.contactEmail}}</span>
                        </label>
                        <label for="" v-else>成为供应商可查看联系人信息</label>
                    </div>
                </div>
            </div>
            <div class="content-item">
                <div class="title">零件信息</div>
                <div class="content-item-box part-info-box">
                    <table>
                        <thead>
                            <tr>
                                <td width="120px">缩略图</td>
                                <td width="190px">零件名称</td>
                                <td width="170px">材料</td>
                                <td width="160px">
                                    <div>一级阶梯报价量</div>
                                </td>
                                <td width="160px">
                                    <div>二级阶梯报价量</div>
                                </td>
                                <td width="160px">
                                    <div>三级阶梯报价量</div>
                                </td>
                                <td width="110px">需求数量</td>
                                <td width="130px">发货方式</td>
                            </tr>
                         </thead>
                         <tbody v-for="(partItem,index) in data.requirementItemList" :key="'partItem' + index">
                            <tr class="tr1">
                                <td>
                                    <img v-if="partItem.firstModelFileInfo" :src="partItem.firstModelFileInfo.thumbnailUrl" alt="">
                                    <div v-else class="no-upload-img">未上传</div>
                                </td>
                                <td>{{partItem.itemName}}</td>
                                <td>{{partItem.material||'-'}}</td>
                                <td><div v-if="partItem.ladderPriceInfo">{{partItem.ladderPriceInfo[0].from}}-{{partItem.ladderPriceInfo[0].to}}</div></td>
                                <td><div v-if="partItem.ladderPriceInfo">{{partItem.ladderPriceInfo[1].from}}-{{partItem.ladderPriceInfo[1].to}}</div></td>
                                <td><div v-if="partItem.ladderPriceInfo">{{partItem.ladderPriceInfo[2].from}}</div></td>
                                <td>{{partItem.estimateCount}}</td>
                                <td>{{partItem.deliveryTypeText}}</td>
                            </tr>
                            <tr class="tr2">
                                <td colspan="7">
                                    <div class="td-wrapper">
                                        <div class="file-row">
                                            <div class="file-type ellipsis" v-if="partItem.modelFileList">3D模型：
                                                <a target="_blank" :href="model.fileUrl" v-for="model in partItem.modelFileList" :key="model.fileUrl">{{model.fileName}}</a>
                                            </div>
                                            <div class="file-type ellipsis" v-if="partItem.planeGraphFileInfo">2D图纸：<a target="_blank" :href="partItem.planeGraphFileInfo.fileUrl">{{partItem.planeGraphFileInfo.fileName}}</a></div>
                                            <div class="file-type other-file ellipsis" v-if="partItem.otherFileList">其他文件：
                                                <a class="file-item ellipsis" target="_blank" :href="file.fileUrl" v-for="file in partItem.otherFileList" :key="file.fileUrl">{{file.fileName}}</a>
                                            </div>
                                        </div>
                                        <div class="multi-row-info-item">
                                            <label style="width:40px;" for="">说明：</label>
                                            <div>{{partItem.description||'无'}}</div>
                                        </div>
                                        <div class="analysic-box" v-if="data.enquiryType==230010">
                                            <div>平台分析:</div>
                                            <div class="content-box">
                                                <div class="report">分析报告：
                                                    <a target="_blank" v-if="partItem.analysisFileInfo" :href="partItem.analysisFileInfo.fileUrl">{{partItem.analysisFileInfo.fileName}}</a>
                                                    <span v-else>无</span>
                                                </div>
                                                <div class="multi-row clearfix">
                                                    <div>说明：</div>
                                                    <div style="width:1038px;">{{partItem.analysisRemark?partItem.analysisRemark:'无'}}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                         </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
    components:{
    },
    data() {
        return {
            data: '',
            requireId:'',
            quotationId: '',
            isManufacturer: false,
            enquiryType: {
                PUBLIC:230030
            }
        }
    },
    computed: {
        isShowBtn: function() {
            if ( this.isManufacturer ) {
                if ( 'requirementPrice' in this.data ) {
                    if ( this.data.requirementPrice.offerStatus == 210010 ) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            } else {
                return false;
            }
        },
        ...mapState({
            user: state => state.user,
        }),
    },
    created() {
        this.requireId = Number(this.$route.query.requireId);
        this.quotationId =  Number(this.$route.query.quotationId);
        this.getData();
    },
    methods: {
        getData() {
            this.$http.post('/custom/requirement/getEnquiry', {id: this.requireId}).then(( res ) => {
                if ( res.data.code == 200 ) {
                this.data = res.data.data;
                this.isManufacturer = res.data.isManufacturer || false;
                } else {
                this.$error(res.data.message);
                }
            })
        },
        quotate() {
            this.$http.post('/custom/manufacturer/requirement/bind', {id: this.requireId}).then(( res ) => {
                if ( res.data.code == 200 ) {
                    this.$router.push({path:'/quotation', query:{quotationId: res.data.data}});
                }
            })
        },
        toQuotation() {
            if ( this.user.manufacturerAuditStatus ==190010 ) {
                this.$error('平台正在审核您的企业信息，审核通过后您可以参与报价。');
            } else {
                this.$http.post('/custom/manufacturer/requirement/isQuote').then(( res ) => {
                    if ( res.data.code == 200 ) {
                        if ( this.data.enquiryType == this.enquiryType.PUBLIC ) {
                            this.quotate();
                        } else {
                            this.$router.push({path:'/quotation', query:{quotationId: this.quotationId}});
                        }
                    } else {
                        this.$error(res.data.message);
                        setTimeout(() => {
                            this.$router.push({path:'/GuideInfo',query:{isShow:false}});
                        }, 700);
                        
                    }
                })
            }
        }
    }
}
</script>
<style lang="less">
#require-detail{
    .content{
        width: 1200px;
        // padding: 0 15px;
        margin: 0 auto;
        margin-bottom: 50px;
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
        .require-number{
            margin-top: 15px;
            margin-bottom: 10px;
            .number{
                float: left;
                width: 205px;
                font-size: 16px;
                font-weight: 700;
            }
            .state{
                float: left;
                width: 56px;
                height: 23px;
                background-color: #e5f1ff;
                border: solid 1px #3f8def;
                color: #3f8def;
                line-height: 23px;
                text-align: center;
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
            margin-bottom: 15px;
            .title{
                font-size: 14px;
                margin-bottom: 5px;
            }
            .content-item-box{
                padding: 16px 16px;
                background: #fff;
                box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
                .row-info{
                    height: 12px;
                    margin-bottom: 14px;
                    .info-item{
                        display: inline-block;
                        width: 220px;
                        height: 12px;
                        line-height: 12px;
                    }
                }
                .beautiful-line{
                    border-bottom: 1px dashed #e2e2e2;
                    margin-bottom: 14px;
                }
                .multi-row-info{
                    display: flex;
                    line-height: 12px;
                    margin-bottom: 14px;
                }
                .contact-info{
                    .contact-item{
                        margin-right: 30px;
                    }
                }
                table{
                    border: 1px solid #e2e2e2;
                    thead td{
                        text-align: center;
                        background: #ebebeb;
                        height: 34px;
                        vertical-align: middle;
                        border-bottom: 1px solid #e2e2e2;
                    }
                    tbody{
                        border-bottom: 1px solid #e2e2e2;
                        tr{
                            td{
                                background: #fff;
                            }
                        }
                        .tr1{
                            td{
                               text-align: center;
                               vertical-align: middle;
                               padding: 10px 8px;
                            //   border-bottom: 1px dashed #e2e2e2;
                               img{
                                   display: block;
                                   width: 38px;
                                   height: 37px;
                                   background: #f1f1f1;
                                   margin: 0 auto;
                               } 
                               .no-upload-img{
                                    display: block;
                                    width: 38px;
                                    height: 37px;
                                    margin: auto;
                                    background: #e7e7e7;
                                    text-align: center;
                                    line-height: 37px;
                                    font-size: 12px;
                                    color: #878787;
                                }
                            }
                        }
                        .tr2{
                            td{
                                padding: 0px 18px 13px 18px;
                                .td-wrapper{
                                    border-top: 1px dashed #e2e2e2;
                                    padding-top: 12px;
                                }
                                .file-row{
                                    margin-bottom: 10px;
                                    .file-type{
                                        display: inline-block;
                                        max-width: 150px;
                                        line-height: 12px;
                                    }
                                    .file-type + .file-type {
                                        margin-left: 20px;
                                    }
                                    .other-file{
                                        min-width: 730px;
                                         line-height: 12px;
                                         overflow: hidden;
                                        .file-item{
                                            display: inline-block;
                                            max-width: 50px;
                                            line-height: 12px;
                                        }
                                        .file-item + .file-item{
                                            margin-left: 20px;
                                        }
                                    }
                                    a{
                                        color: #3f8def;
                                        text-decoration: underline;
                                    }
                                }
                                .multi-row-info-item{
                                    display: flex;
                                    line-height: 22px;
                                }
                                .analysic-box{
                                    margin-top: 9px;
                                    .content-box{
                                        padding: 10px;
                                        margin-top: 2px;
                                        background: #f8f8f8;
                                        .report{
                                            font-size: 12px;
                                            line-height: 12px;
                                            margin-bottom: 9px;
                                        }
                                        .multi-row{
                                            div{
                                                float: left;
                                                line-height: 22px;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .part-info-box{
                 padding: 0;
            }
        }
    }
}
</style>
