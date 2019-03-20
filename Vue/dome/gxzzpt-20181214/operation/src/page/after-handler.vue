<template>
    <div id="after-handler">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>售后</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/main/after-application'}">售后申请</el-breadcrumb-item>
            <el-breadcrumb-item>处理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content" v-if="data.order">
            <div class="top">
                <div class="text-item">售后编号：{{data.asNo}}</div>
                <div class="state text-item">{{data.dealResultStr}}</div>
            </div>
            <div class="content-item">
                <div class="title">申请售后</div>
                <div class="content-box">
                    <div class="row-info">
                        <div class="text">订单编号：{{data.order.orderNumber}}</div>
                        <div class="text">订单总额：￥{{data.order.totalPrice}}</div>
                        <div class="text">接单供应商：{{data.order.dispatchCompany.dispatchCompanyName}}</div>
                    </div>
                    <div class="row-info">原因：{{data.reasonTypeStr}}</div>
                    <div class="row-info">说明：{{data.demandSideRemark}}</div>
                    <div class="row-info img-row">
                        <div class="label">凭证：</div>
                        <div class="img-list">
                            <div class="img-item" v-for="picUrl in data.pictureUrls">
                                <img :src="picUrl" alt="">
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
            <div class="content-item" >
                <div class="title">联系方式</div>
                <div class="content-box">
                    <div class="row-info-2">
                        <div class="btn">用户联系方式</div>
                        <div class="text">姓名：{{data.order.contactName}}</div>
                        <div class="text">电话：{{data.order.contactPhone}}</div>
                        <div class="text">邮箱：{{data.order.contactEmail}}</div>
                    </div>
                    <div class="row-info-2">
                        <div class="btn">供应商联系方式</div>
                        <div class="text">姓名：{{data.order.dispatchCompany.contactName}}</div>
                        <div class="text">电话：{{data.order.dispatchCompany.contactPhone}}</div>
                        <div class="text">邮箱：{{data.order.dispatchCompany.contactEmail}}</div>
                    </div>
                </div>
            </div>
            <div class="content-item">
                <div class="title">申请售后</div>
                <div class="content-box form-box">
                    <el-form :model="formData" :rules="rules" ref="form">
                        <el-form-item label="处理结果：" label-position="left" label-width="93px" prop="dealResult">
                            <el-radio-group v-model="formData.dealResult">
                                <el-radio :label="400020">驳回申请</el-radio>
                                <el-radio :disabled="!data.order.isOfflinePayment" :label="400030">为用户退款</el-radio>
                                <el-radio :label="400040">供应商已配合处理</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="formData.dealResult==400030" label="退款金额：" label-position="left" label-width="93px" prop="refundAmount">
                            <el-input v-model="formData.refundAmount"></el-input>
                        </el-form-item>
                        <el-form-item label="说明：" label-position="left" label-width="93px" prop="operationRemark">
                            <el-input v-model="formData.operationRemark" type="textarea" :rows="5"></el-input>
                        </el-form-item>
                        <el-form-item label="通知方式：" label-position="left" label-width="93px" prop="messageNotifyTypes">
                             <el-checkbox-group v-model="formData.messageNotifyTypes">
                                <el-checkbox :label="360010">站内</el-checkbox>
                                <el-checkbox :label="360020">短信</el-checkbox>
                                <el-checkbox :label="360030">邮件</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="submit-btn-box" v-if="data.dealResult==400010">
                <div class="btn cancel" @click="$router.go(-1)">返回</div>
                <div class="btn submit" @click="submit">提交</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            radio:'',
            checkList:[],
            data:'',
            id: '',
            formData: {
                id:'',
                dealResult:400020,
                refundAmount:null,
                operationRemark:'',
                messageNotifyTypes:[]
            },
            rules:{
                operationRemark:[{required: true,message:'请输入说明信息',trigger:'blur'}],
                dealResult:[{required: true,message:'请选择处理结果',trigger:'change'}],
                messageNotifyTypes:[{required: true,message:'请选择通知方式',trigger:'change'}],
            }
        }
    },
    created() {
         this.formData.id = Number(this.$route.query.id);
        this.getData();
    },
    methods: {
        getData() {
            this.$http.post('/operation/afterServiceRecord/get',{id: this.formData.id}).then(( res ) => {
                if ( res.data.code == 200 ) {
                   this.data = res.data.data;
                   this.formData.dealResult = this.data.dealResult || '';
                   this.formData.operationRemark = this.data.operationRemark || '';
                }
            })
        },
        submit() {
            this.$refs.form.validate(( valid ) => {
                if ( valid ) {
                    this.$http.post('/operation/afterServiceRecord/deal', this.formData).then(( res ) => {
                        if ( res.data.code == 200 ) {
                            this.$success('操作成功');
                            this.$router.push({path: '/main/after-application'});
                        } else {
                            this.$error('操作失败');
                        }
                    });
                } else {
                    return false;
                }
            })
        }
    }
}
</script>

<style lang="less">
#after-handler{
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
        width: 100%;
        margin: auto;
        .top{
            padding: 22px 0;
            border-bottom: 1px solid #e2e2e2;
            margin-bottom: 30px;
            .text-item{
                display: inline;
                line-height: 20px;
            }
            .state{
                color: #3f8def;
                margin-left: 30px;
            }
        }
        .content-item{
            .title{
                height: 14px;
                line-height: 14px;
                color: #333;
                font-weight: 600;
                margin-bottom: 14px;
            }
            .content-box{
                padding: 22px 28px;
                background: #f5f5f5;
                line-height: 14px;
                margin-bottom: 32px;
                .row-info{
                    line-height: 14px;
                    height: 14px;
                    &:not(:last-child){
                        margin-bottom: 26px;
                    }
                    .text{
                        display: inline-block;
                        height: 14px;
                        & + .text{
                            margin-left: 57px;
                        }
                    }
                }
                .row-info-2{
                    & + .row-info-2{
                        margin-top: 20px;
                    }
                    .text{
                        display: inline-block;
                        line-height: 28px;
                        & + .text{
                            margin-left: 62px;
                        }
                    }
                    .btn{
                        display: inline-block;
                        line-height: 28px;
                        width: 110px;
                        height: 28px;
                        border: 1px solid #3f8def;
                        color: #3f8def;
                        background: #daeaff;
                        text-align: center;
                        margin-right: 30px;
                    }
                }
                .img-row{
                    .label{
                        float: left;
                    }
                    .img-list{
                        float: left;
                        .img-item{
                            display: inline-block;
                            width: 80px;
                            height: 80px;
                            background: #fff;
                            & + .img-item{
                                margin-left: 12px;
                            }
                            img{
                                width: 80px;
                                height: 80px;
                            }
                        }
                    }
                }
                .el-textarea,.el-input{
                    width: 550px;
                }
            }
        }
        .submit-btn-box{
            width: 320px;
            height: 42px;
            margin: auto;
            margin-top: 58px;
            margin-bottom: 100px;
            .btn{
                width: 106px;
                height: 42px;
                border-radius: 4px;
                line-height: 42px;
                text-align: center;
                color: #fff;
                font-size: 16px;
                cursor: pointer;
            }
            .cancel{
                float: left;
                background: #d0d0d0;
            }
            .submit{
                float: right;
                background: #3f8def;
            }
        }
    }
}
</style>
