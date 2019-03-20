<template>
    <div id="aftersale-detail">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>售后</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/main/after-application'}">售后申请</el-breadcrumb-item>
            <el-breadcrumb-item>处理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content">
            <div class="top">
                <div class="text-item">售后编号：{{data.asNo}}</div>
                <div class="state text-item">{{data.dealResultStr}}</div>
            </div>
            <div class="content-item">
                <div class="title">申请售后</div>
                <div class="content-box">
                    <div class="row-info">
                        <div class="text">订单编号：{{data.order?data.order.orderNumber:''}}</div>
                        <div class="text">订单总额：￥{{data.order?data.order.totalPrice:''}}</div>
                        <div class="text">接单供应商：{{data.order?data.order.dispatchCompany.dispatchCompanyName:''}}</div>
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
            <div class="content-item">
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
                <div class="content-box">
                    <div class="row-info">处理结果：{{data.dealResultStr}}</div>
                    <div class="row-info" v-if="data.dealResult==400030">退款金额：<span style="color:#3f8def;">￥400.00</span></div>
                    <div class="row-info">说明：{{data.operationRemark}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            id: null,
            data: ''
        }
    },
    created() {
        this.id = Number(this.$route.query.id);
        this.getData();
    },
    methods: {
        getData() {
            this.$http.post('/operation/afterServiceRecord/get',{id: this.id}).then(( res ) => {
                if ( res.data.code == 200 ) {
                   this.data = res.data.data;
                }
            })
        },
    }
}
</script>

<style lang="less">
#aftersale-detail{
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
        width: 100%;
    //    padding: 0 15px;
        margin: 0 auto;
        .top{
            padding: 22px 0;
            margin-bottom: 30px;
            border-bottom: 1px solid #e2e2e2;
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
            }
        }
    }
}
</style>