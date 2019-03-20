<template>
    <div id="launch-after-sale">
        <div class="content">
            <div class="content-item">
                <div class="title">订单信息</div>
                <div class="content-box">
                    <div class="text-item">订单编号：{{data.orderNumber}}</div>
                    <div class="text-item">订单总额：￥{{data.totalPrice}}</div>
                    <div class="text-item">接单供应商：{{data.dispatchCompany.dispatchCompanyName}}</div>
                </div>
            </div>
            <div class="content-item">
                <div class="title">联系方式</div>
                <div class="content-box">
                    <div class="row-info">
                        <div class="btn">用户联系方式</div>
                        <div class="text">姓名：{{data.contactName}}</div>
                        <div class="text">电话：{{data.contactPhone}}</div>
                        <div class="text">邮箱：{{data.contactEmail}}</div>
                    </div>
                    <div class="row-info">
                        <div class="btn">供应商联系方式</div>
                        <div class="text">姓名：{{data.dispatchCompany.contactName}}</div>
                        <div class="text">电话：{{data.dispatchCompany.contactPhone}}</div>
                        <div class="text">邮箱：{{data.dispatchCompany.contactEmail}}</div>
                    </div>
                </div>
            </div>
            <div class="content-item">
                <div class="title">申请售后</div>
                <div class="content-box form-box">
                    <el-form :model="formData" :rules="rules" ref="form">
                        <el-form-item label="原因：" label-position="left" label-width="57px" prop="reasonType">
                            <el-select v-model="formData.reasonType">
                                <el-option :value="item.id" :label="item.name" :key="item.id" v-for="item in reasonList"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="说明：" label-position="left" label-width="57px" prop="demandSideRemark">
                            <el-input type="textarea" :rows="5" v-model="formData.demandSideRemark"></el-input>
                        </el-form-item>
                        <el-form-item label="凭证：">
                            <el-button type="primary" @click="showUploadDlg">上传</el-button>
                            <input @change="uploadImg" type="file" ref="fileInput" hidden>
                            <label for="" class="upload-remark">最多5张，支持png,jpg,jpeg,单张图片小于1M</label>
                            <div class="img-list" v-if="formData.pictureUrls.length>0">
                                <div class="img-item" v-for="(file,index) in formData.pictureUrls">
                                    <i class="img-colse-icon" @click="deleteFile(index)"></i>
                                    <img :src="file" alt="">
                                </div>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="submit-btn-box">
                <div class="btn cancel" @click="$router.go(-1)">返回</div>
                <div class="btn submit" @click="submit">提交申请</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    components: {
    },
    data() {
        return{
            data:'',
            reasonList: [],
            formData:{
                pictureUrls:[],
                orderId: null,
                reasonType:'',
                demandSideRemark:''
            },
            rules:{
                reasonType:[{required: true,message:'请选择原因',trigger:'change'}],
            }
        }
    },
    created() {
        this.formData.orderId = Number(this.$route.query.id);
        this.getDataDetail();
        this.getReasonList();
    },
    methods: {

        getReasonList() {
            var wordsString = localStorage.getItem('words');
            if ( wordsString ) {
                var words = JSON.parse(wordsString);
                this.reasonList = words[146].item;
            }
        },

        getDataDetail() {
            this.$http.post('custom/order/getForAfterService', {id: this.formData.orderId}).then(( res ) => {
                if ( res.data.code == 200 ) {
                    this.data = res.data.data;
                } else {
                    this.$error(res.data.message);
                }
            })
        },
        showUploadDlg() {
            this.$refs.fileInput.click();
        },
        uploadImg( e ) {
            var file = e.target.files[0];
            if ( this.formData.pictureUrls.length >=5 ) {
                this.$error('最多只能上传五张');
            } else {
                if (!/\.(png|PNG|JPG|jpg|jpeg|JPEG)$/.test(file.name)) {
                    this.$error('png/JPG格式的图片');
                } else if( file.size > 1*1024*1024 ){
                    this.$error('图片大小不能超过1M');
                } else {
                    var data = new FormData();
                    data.append('file', file);
                    this.$upload.post('http://dw.tatfookcloud.com/upload', data).then(( res ) => {
                        if ( res.data.code == 200 ) {
                            console.log(res.data);
                            this.formData.pictureUrls.push(res.data.data.img_url);
                        } else {
                            this.$error(res.data.message);
                        }
                    })
                }
            }

            this.$refs.fileInput.value = '';
        },
        deleteFile( index ) {
            this.formData.pictureUrls.splice( index, 1 );
        },
        submit() {
            this.$refs.form.validate(( valid ) => {
                if ( valid ) {
                    this.$http.post('custom/afterServiceRecord/apply', this.formData).then(( res ) => {
                        if ( res.data.code == 200 ) {
                            this.$success('操作成功');
                            this.$router.push({path:'/usercenter/aftersale-record'});
                        } else {
                            this.$error(res.data.message);
                        }
                    })
                } else {
                    return false;
                }
            })
        },

    }
}
</script>
<style lang="less">
#launch-after-sale{
    div{
        box-sizing: border-box;
    }
    .content{
        width: 1005px;
        margin: auto;
        padding: 30px 20px;
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
                .text-item{
                    display: inline-block;
                    height: 14px;
                }
                .text-item + .text-item{
                    margin-left: 55px;
                }
                .row-info{
                    & + .row-info{
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
            }
            .form-box{
                .el-select,.el-textarea{
                    width: 488px;
                }
                .el-form-item:not(:last-child){
                    margin-bottom: 20px;
                }
                .el-form-item:last-child{
                    margin-bottom: 0;
                }
                .upload-remark{
                    font-size: 12px;
                    color: #9e9e9e;
                    margin-left: 5px;
                }
                 .el-form-item{
                   position: relative;
                }
                .el-form-item.is-required .el-form-item__label:before {
                    position: absolute;
                    left: -8px;
                }
                .img-list{
                    height: 80px;
                    padding-left: 55px;
                    margin-top: 6px;
                    .img-item{
                        display: inline-block;
                        position: relative;
                        width: 80px;
                        height: 80px;
                        background: #e2e2e2;
                        img{
                            width: 80px;
                            height: 80px;
                        }
                        .img-colse-icon{
                            position: absolute;
                            right: -6px;
                            top: -4px;
                            width: 14px;
                            height: 14px;
                            border-radius: 50%;
                            background-image: url(../../static/img/close-red-icon.png);
                            background-repeat: no-repeat;
                            background-color: #fff;
                            cursor: pointer;
                        }
                        & + .img-item{
                            margin-left: 23px;
                        }

                    }

                }
            }
        }
        .submit-btn-box{
            width: 320px;
            height: 42px;
            margin: auto;
            margin-top: 58px;
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
