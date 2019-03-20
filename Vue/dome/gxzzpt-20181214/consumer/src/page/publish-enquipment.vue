<template>
    <div id="publish-post">
        <div class="content">
            <div class="crumb-bread">
                <span class="router-link" @click="$router.push({path:'/index'})">首页</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="router-link" @click="$router.push({path:'/technology'})">新技术专区</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="curr">发布设备交易信息</span>
            </div>
            <div class="main-content">
                <div class="title">发布设备交易信息</div>
                <div class="form">
                    <el-form label-position="left" :rules="rules" :model="formData" ref="enquipmentForm" label-width="75px">
                        <el-form-item label="设备标题" prop="title">
                            <el-input v-model="formData.title"></el-input>
                        </el-form-item>
                        <el-form-item label="设备标签" prop="equip_tags">
                            <el-select v-model="formData.equip_tags" multiple >
                                <el-option :value="item.id" :label="item.name" :key="'tag-' + index" v-for="(item, index) in tagList"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="价格" prop="priceInfo">
                            <el-input v-model="formData.priceInfo"></el-input>
                        </el-form-item>
                        <el-form-item label="联系方式" prop="contactInfo">
                            <el-input v-model="formData.contactInfo"></el-input>
                        </el-form-item>
                        <el-form-item label="设备主图" prop="coverPicturl">
                            <div class="upload-form-item-template">
                                <el-input disabled v-model="formData.coverPicturl"></el-input>
                                <el-upload
                                    :action="uploadUrl"
                                    :with-credentials="false"
                                    :limit="100"
                                    :on-success="onSuccessUpload"
                                    :before-upload="beforeUpload"
                                    :show-file-list="false">
                                    <span class="upload-btn">上传</span>
                                </el-upload>
                            </div>
                        </el-form-item>
                        <el-form-item label="设备描述" prop="content">
                            <quill-editor ref="myTextEditor" v-model="formData.content"></quill-editor>   
                        </el-form-item>
                    </el-form>
                </div>
                <div class="btn-box">
                    <el-button type="primary" size="medium" @click="publish">发布</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { validatNumber} from '../lib/validate.js';
export default {
    data() {
        return {
            uploadUrl:'http://dw.tatfookcloud.com/upload',
            tagList:[],
            formData: {
                title:'',
                equip_tags:[],
                content:'',
                coverPicturl:'',
                contactInfo:'',
                priceInfo:''
            },
            rules:{
                title:[{required:true, message:'请输入标题', trigger:'blur'}],
                equip_tags:[{required:true, message:'请选择标签', trigger:'change'}],
                coverPicturl:[{required:true, message:'请上传主图', trigger:'change'}],
                contactInfo:[{required:true, message:'请输入联系方式', trigger:'blur'}],
                content:[{required:true, message:'请输入描述内容', trigger:'blur'}],
                priceInfo:[{required:true, validator:validatNumber, trigger:'blur'}],
            }
        }
    },
    created() {
        this.tagList = this.$LocalStorage.getWords(161);
    },
    methods: {
        onSuccessUpload(res, file, fileList) {
            if( res.code == 200 ) {
                this.formData.coverPicturl = res.data.img_url;
            }
        },
        beforeUpload( file ) {
            if (!/\.(png|PNG|jpg|JPG|jpeg|JPEG)$/.test(file.name)) {
                this.$error("只支持上传jpg/png/jpeg格式图片");
                return false;
            }
            if (file.size / 1024 / 2024 > 5) {
                this.$error('文件大小不能超过5M');
                return false;
            }
        },
        publish() {
            this.$refs.enquipmentForm.validate((valid) => {
                if ( valid ) {
                    this.formData.priceInfo = Number(this.formData.priceInfo);
                    this.$http.post('/custom/EquipSale/add', this.formData).then(( res ) => {
                        if ( res.data.code == 200 ) {
                            this.$success('发布成功');
                            setTimeout(() => {
                                this.$router.push({path:'/enquipment/list'});
                            }, 500);
                        } else {
                            this.$error( res.data.message );
                        }
                    })
                } else {
                    return false;
                }
            })
        }
    }
}
</script>

<style lang="less">
#publish-post{
    .content{
        width: 1200px;
        margin: 0 auto;
        margin-bottom: 50px;
    }
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
    .main-content{
        background: #fff;
        height: 900px;
        padding: 20px 28px;
        .title{
            position: relative;
            font-size: 20px;
            color: #3f8def;
            font-weight: 700;
            text-indent: 5px;
            &::before{
                content: '';
                position: absolute;
                top: 5px;
                left: -5px;
                height: 18px;
                border-left: 4px solid #3f8def;
            }
        }
        .form{
            width: 1000px;
            height: 740px;
            margin: 20px auto;
            .quill-editor{
                height: 460px;
            }
            .upload-form-item-template{
                position: relative;
                .el-upload{
                    display: block;
                }
                .upload-btn{
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 80px;
                    height: 26px;
                    border: 1px solid #d2e6ff;
                    text-align: center;
                    line-height: 26px;
                    cursor: pointer;
                    color: #3f8def;
                    background: #d2e6ff;
                }
            }
        }
        .btn-box{
            display: flex;
            justify-content: flex-end;
            padding-right: 70px;
        }
    }
}
</style>

