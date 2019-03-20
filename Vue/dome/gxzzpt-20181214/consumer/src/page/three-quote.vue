<template>
    <div id="three-quote">
        <div class="content">
            <div class="crumb-bread">
                <span class="router-link" @click="$router.push({path:'/index'})">首页</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="router-link" @click="$router.push({path:'/deputy-index'})">3D打印</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span> 
                <span class="curr">人工报价</span>
            </div>
            <div class="form-wrapper">
                <div class="form-content-item" ref="baseFormItem">
                    <div class="item-title">询价信息</div>
                    <div class="form-box">
                        <el-form :rules="rules" :model="formData" ref="threeForm" label-position="left">
                            <el-form-item>
                                <el-col :span="11">
                                    <el-form-item class="tech-form-item" label="主工艺：" label-position="left" label-width="95px" prop="techniqueNames" required>
                                        <el-input v-model="formData.techniqueNames" v-show="false"></el-input>
                                        <v-tree  v-on:get-currentKey="techniqueChangeHandler" :max-length="1" :checked-nodes="treeModal.SelectNode" :techniqueType="techniqueType.THREE_PRINT" :removeEmpty="true"
                                         :checked-keys="treeModal.SelectDatas" :expand-all="false" :set-width="treeModal.width" :set-title='treeModal.title' :btn-name='treeModal.btnName' :switch-state='true'></v-tree>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <div style="visibility:hidden">1</div>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="报价截止：" prop="offerDeadlineTime" label-position="left" label-width="95px">
                                        <el-date-picker v-model="formData.offerDeadlineTime"
                                            type="datetime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            :picker-options="pickerOptions"
                                            :default-value="defaultOfferDeadlineTime"
                                            placeholder="选择日期">
                                        </el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            <el-form-item>
                                <el-col :span="11">
                                    <el-form-item label="联系人：" label-position="left" label-width="95px" prop="contactName">
                                       <el-input :maxlength="36" v-model="formData.contactName"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <div style="visibility:hidden">1</div>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="联系电话：" label-position="left" label-width="95px" prop="contactPhone">
                                        <el-input :maxlength="11"  v-model="formData.contactPhone"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            <el-form-item>
                                <el-col :span="11">
                                    <el-form-item label="零件名称：" label-position="left" label-width="95px" prop="itemName">
                                        <el-input :maxlength="30" v-model="formData.itemName"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <div style="visibility:hidden">1</div>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="邮箱：" label-position="left" label-width="95px" prop="contactEmail">
                                       <!-- <el-input :maxlength="50"  v-model="baseForm.data.contactEmail"></el-input> -->
                                       <el-autocomplete 
                                            v-model="formData.contactEmail"
                                            :fetch-suggestions="emailInputHandler"
                                            placeholder="请输入邮箱"
                                            :trigger-on-focus="true"
                                        ></el-autocomplete>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            <el-form-item>
                                <el-col :span="11">
                                    <el-form-item label="3D模型：" label-position="left" label-width="95px" prop="modelFileNames">
                                        <el-input disabled v-model="formData.modelFileNames"></el-input>
                                        <!-- <span class="upload-btn 3d-upload-btn" @click="showModelDlg(partForm)">上传</span> -->
                                        <el-upload
                                            :action="uploadUrl"
                                            :with-credentials="true"
                                            :limit="100"
                                            :on-success="onSuccessUploadModel"
                                            :before-upload="beforeUploadModelFile"
                                            :show-file-list="false">
                                            <span class="upload-btn 3d-upload-btn">上传</span>
                                        </el-upload>
                                      <!--   <span class="upload-remark">小于25M，支持STP、IGS格式</span> -->
                                        <div class="upload-img-list"  v-show="formData.modelFiles.length>0">
                                            <div class="upload-img-item"  v-for="(mf, index) in formData.modelFiles" :key="'modelImg'+index">
                                                <img v-if="mf.thumbnailUrl" :src="$baseURL + '/' + mf.thumbnailUrl" alt="">
                                                <img v-else src="../../static/img/empty.png" alt="">
                                                <i class="img-colse-icon" @click="deleteModelFile(index)"></i>
                                                <p>{{mf.orignFileName}}</p>
                                            </div>
                                        </div>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <div style="visibility:hidden">1</div>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item label="数量：" label-position="left" label-width="95px" prop="estimateCount">
                                        <el-input :maxlength="9" v-model="formData.estimateCount"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            <el-form-item>
                                <el-col :span="11">
                                    <el-form-item label="送货地区：" label-position="left" label-width="95px" prop="addressList" required>
                                        <div class="select-area">
                                            <area-select type="text" v-model="formData.addressList" :level="1" :data="$areaData" ></area-select>
                                        </div>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    <div style="visibility:hidden">1</div>
                                </el-col>
                                <el-col :span="11">
                                    <el-form-item class="other-file-form-item" label="其他文件：" label-position="left" label-width="95px">
                                        <el-button size="mini" type="primary" @click="showUploadDlg()">{{formData.otherFiles.length>0?'查看':'上传'}}</el-button>
                                        <span class="other-upload-remark">小于25M</span>
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="说明：" label-position="left" label-width="95px">
                                <el-input :maxlength="200" type="textarea" v-model="formData.description" :rows="2"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>

                <div class="footer-btn">
                    <div class="submit clearfix">
                        <!-- <div class="btn save-btn" @click="submit(true)">保存为草稿</div> -->
                        <div class="btn submit-btn" @click="submit(false)">提交需求</div>
                    </div>
                </div>

            </div>
        </div>
        <el-dialog title="上传" width="524px" :visible.sync="uploadDlg.visible">
            <div class="upload-dlg">
                <div class="add-btn" @click="showOtherFileDlg">选择文件</div>
                <input type="file" hidden ref="otherFileInput" multiple @change="uploadOhterFile">
                <div class="file-list" v-if="formData.otherFiles">
                    <div class="file-item" v-for="(file,index) in formData.otherFiles" :key="`other${index}`">{{file.fileName}} <i class="remove-icon" @click="deleteOtherFileItem(index)"></i></div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary"
                @click="closeUploadDlg" >确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import CommonTree from './Tree-common';
import { validatNumber, validatePhone, validateEmail ,EmailAuto} from '../lib/validate.js';
import { mapState } from 'vuex';
export default {
    components:{
        'v-tree': CommonTree
    },
    data() {
        return {
            pickerOptions:{
                disabledDate: function(date) {
                    var now = new Date();
                    now.setDate(now.getDate()-1);
                    if (date.getTime() < now.getTime()) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            techniqueType:{
                THREE_PRINT:530010
            },
            uploadUrl: this.$baseURL + '/custom/attachFile/upload3DFileForCNC',
            defaultOfferDeadlineTime:'',
            formData:{
                techniqueNames:'',
                techniqueId:'',
                offerDeadlineTime:'',
                contactName:'',
                contactPhone:'',
                contactEmail:'',
                itemName:'',
                estimateCount:'',
                modelFileNames:'',
                modelFiles:[],
                otherFiles:[],
                description:'',
                addressList:['广东省','深圳市'],
            },
            rules:{
                techniqueNames: [{required: true,message:'请选择主工艺',trigger:'change'}],
                contactName:[{required: true,message:'请输入联系人',trigger:'blur'}],
                contactPhone:[{required: true,validator:validatePhone,trigger:'blur'}],
                contactEmail:[{required: true,validator: validateEmail,trigger:'change'}],
                offerDeadlineTime:[{required: true,message:'请填写报价时限',trigger:'change'}],
                estimateCount:[{required: true,validator: validatNumber,trigger:'change'}],
                itemName:[{required: true,message:'请输入零件名称',trigger:'change'}],
                modelFileNames:[{required: true,message: '请上传3D模型文件',trigger:'change'}]
            },
            uploadDlg:{
                visible: false,
            },
            treeModal: {
                SelectDatas:[],
                SelectNode:[],
                width:'35%',
                title:'工艺选择',
                btnName:''
            },
        }
    },
     computed: {
        ...mapState({
            user: state => state.user,
        }),
    },
    created() {
        this.formData.contactName = this.user.nickName || '';
        this.formData.contactEmail = this.user.email || '';
        this.formData.contactPhone = this.user.phone || '';

        let timestamp = new Date().getTime();//当前的时间戳
        timestamp = timestamp + 2 * 60 * 60 * 1000;
        this.defaultOfferDeadlineTime = new Date(timestamp);
        this.formData.offerDeadlineTime = this.$dateFormat(new Date(timestamp));
    },
    methods: {

        techniqueChangeHandler(takeDate, keyDate) {
            this.treeModal.SelectDatas = keyDate;
            if ( takeDate.length > 0 ) {
                this.formData.techniqueId = keyDate[0];
                this.treeModal.btnName = takeDate[0].techniqueName;
                this.formData.techniqueNames = takeDate[0].techniqueName;
            } else {
                this.formData.techniqueNames = '';
                this.formData.techniqueId = '';
                this.treeModal.btnName = '';
            }
        //    this.getCompanys( '' );
        },
        //邮箱自动补全；
        emailInputHandler( inputString, cb ) {
            EmailAuto(inputString,cb)
        },

        //上传模型文件前
        beforeUploadModelFile( file ) {
            if ( this.formData.modelFiles.length >= 1 ) {
                this.$error('只能上传1个模型');
                return false;
            }
            if ( file.size > 25*1024*1024 ) {
                this.$error('文件大小不能超过25M');
                return false;
            }
        },

        onSuccessUploadModel( res, file, fileList ) {
            if ( res.code == 200 ) {
                this.formData.modelFiles.push(res.attachFile);
                var nameArray = [];
                this.formData.modelFiles.map(( item ) => {
                    nameArray.push( item.orignFileName );
                })
                this.formData.modelFileNames = nameArray.toString();
            } else {
                this.$error(res.message);
            }
        },

        deleteModelFile( index ) {
           this.formData.modelFiles.splice(index,1);
           var nameArray = [];
           this.formData.modelFiles.map(( item ) => {
                nameArray.push( item.orignFileName );
            })
            this.formData.modelFileNames = nameArray.toString();
        },

        showUploadDlg() {
            this.uploadDlg.visible = true;
        },

        closeUploadDlg() {
            this.uploadDlg.visible = false;
        },

        showOtherFileDlg() {
            this.$refs.otherFileInput.click();
        },

        uploadOhterFile( e ) {
            
            if ( (this.formData.otherFiles.length + e.target.files.length) > 10 ) {
                this.$error('只能上传10个文件');
            } else {
                let isValid = true;
                for( var i = 0; i < e.target.files.length; i++ ) {
                    var file = e.target.files[i];
                    if ( file.size > 25*1024*1024 ){
                        isValid = false;
                        this.$error(file.name + '文件大小超过25M');
                        break;
                    }
                    if (/\.(zip|ZIP|rar|RAR|7z|7Z|tar|TAR|iso|ISO|jar|JAR|gz|GZ)$/.test(file.name)) {
                        isValid = false;
                        this.$error('不支持上传zip/rar/7z/tar等压缩格式');
                        break;
                    }
                }

                if( isValid ) {
                    for( var j = 0; j < e.target.files.length; j++) {
                        var fileItem = e.target.files[j];
                        var data = new FormData();
                        data.append('file', fileItem);
                        this.$upload.post('/uploadingFile', data).then(( res ) => {
                            if ( res.data.code == 200 ) {
                                this.formData.otherFiles.push(res.data.attachFile);
                            } else {
                                this.$error(res.data.message);
                            }
                        })
                    }
                }
            }
            this.$refs.otherFileInput.value = '';
        },
        //删除文件
        deleteOtherFileItem( index ) {
            this.formData.otherFiles.splice(index,1);
        },

        submit( isDraft ) {
            this.$refs.threeForm.validate( (valid) => {
                if ( valid ) {
                    var params = {
                        offerDeadlineTime: this.formData.offerDeadlineTime,
                        contactName: this.formData.contactName,
                        contactPhone: this.formData.contactPhone,
                        contactEmail: this.formData.contactEmail,
                        itemName: this.formData.itemName,
                        estimateCount: Number(this.formData.estimateCount),
                        modelFileIds:[],
                        otherFileIds:[],
                        techniqueId: this.formData.techniqueId,
                        description:this.formData.description,
                        enquiryType:230010,//平台询价
                        deliveryProvince: this.formData.addressList[0],
                        deliveryCity: this.formData.addressList[1],
                    };
                    this.formData.modelFiles.map(( item ) => {
                        params.modelFileIds.push( item.fileId );
                    })
                    this.formData.otherFiles.map(( item ) => {
                        params.otherFileIds.push( item.id );
                    })
                    console.log( params );
                    this.$http.post('/custom/Requirement/artificialQuotation3D',params).then((res) => {
                    if ( res.data.code == 200 ) {
                        this.$success('操作成功');
                        this.$router.push({path:'/quote/success'});
                    } else if ( res.data.code == 400 ) {
                        this.$login({});
                    } else {
                        this.$error(res.data.message);
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
#three-quote{
    .content{
        width: 1200px;
        margin: 0 auto;
        .area-select.medium{
            width: 210px;
        }
        .area-select.medium + .area-select.medium{
            margin-left: 10px;
        }
        .area-select{
            height: 26px;
            .area-selected-trigger{
                line-height: 26px;
                font-size: 12px;
            }
        }
        .select-area .area-select-wrap{
            justify-content: flex-start;
        }
        .form-wrapper{
            margin-top: 15px;
            .form-content-item{
                margin-bottom: 22px;
                .delete-form-content{
                    float: right;
                    margin-right: 20px;
                    cursor: pointer;
                    &:hover{
                        color: #f56c6c;
                    }
                }
                .item-title{
                    height: 14px;
                    line-height: 14px;
                    color: #777;
                    margin-bottom: 9px;
                    font-size: 14px;
                }
                .form-box{
                    padding: 15px 19px 1px 19px;
                    box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
                    background: #fff;
                    .el-select{
                        width: 431px;
                    }
                    .el-input,.el-textarea{
                        width: 431px;
                    }
                    .el-date-editor.el-input, .el-date-editor.el-input__inner{
                        width: 431px;
                    }
                    .tech-form-item{
                        .Tree-common{
                            height: 26px;
                        }
                        .btn{
                            width: 431px;
                            height: 26px;
                            border: #d0d0d0 1px solid;
                            border-radius: 0;
                            background: #fff;
                            text-align: left;
                            padding: 0;
                            text-indent: 10px;
                            span{
                                color: #777;
                            }
                        }
                    }
                    .el-upload{
                        display: block;
                    } 
                    .upload-btn{
                        position: absolute;
                        top: 1px;
                        right: 7px;
                        width: 65px;
                        height: 26px;
                        box-sizing: border-box;
                    //    border: 1px solid #3f8def;
                        line-height: 26px;
                        text-align: center;
                        color: #3f8def;
                        cursor: pointer;
                        background: #d2e6ff;
                    }
                    .upload-img-list{
                        margin-top: 15px;
                        .upload-img-item{
                            display: inline-block;
                            position: relative;
                            width: 80px;
                            height: 105px;
                            img{
                                display: block;
                                width: 80px;
                                height: 80px;
                                background: #f1f1f1;
                            }
                            .no-img{
                                display: block;
                                width: 80px;
                                height: 80px;
                                background: #e7e7e7;
                                text-align: center;
                                line-height: 80px;
                                font-size: 16px;
                                color: #878787;
                            }
                            p{
                            margin-top: 5px;
                            line-height: 20px;
                            text-align: center;
                            color: #9e9e9e;
                            white-space: nowrap;
                            }
                            .img-colse-icon{
                                position: absolute;
                                right: -7px;
                                top: -6px;
                                width: 14px;
                                height: 14px;
                            //      border: 1px solid #666;
                                border-radius: 50%;
                                background-image: url(../../static/img/close-red-icon.png);
                                background-repeat: no-repeat;
                                cursor: pointer;
                            }
                        }
                        .upload-img-item + .upload-img-item{
                            margin-left: 15px;
                        }
                    }
                    .other-upload-remark{
                        position: absolute;
                        top:0px;
                        left: 80px;
                        width: 200px;
                        font-size: 12px;
                        color: #9e9e9e;
                    }
                }
            }
        }
        .footer-btn{
            .add{
                position: relative;
                height: 37px;
                .add-btn{
                    float: left;
                }
                .remark-info{
                    width: 250px;
                    height: 37px;
                    line-height: 37px;
                    float: left;
                    margin: 0 10px;
                    color: #9e9e9e;
                }
            }
            .submit{
                margin: 90px 0px 50px 0;
                padding: 0 300px;
                .btn{
                    width: 173px;
                    height: 38px;
                    line-height: 38px;
                    font-size: 14px;
                    text-align: center;
                    border-radius: 4px;
                    cursor: pointer;
                    border: 1px solid #3f8def;
                }
               /*  .save-btn{
                    background: #f5f5f5;
                    color: #3f8def;
                    float: left;
                } */
                .submit-btn{
                    background: #3f8def;
                    color: #fff;
                //    float: right;
                    margin: 0 auto;
                }
            }
        }
    }
    .upload-dlg{
        .add-btn{
            width: 122px;
            height: 32px;
            text-align: center;
            line-height: 32px;
            font-size: 14px;
            color: #3f8def;
            border: 1px solid #3f8def;
            text-indent: 20px;
            background: rgba(63, 141, 239, 0.1) url(../../static/img/add-icon.png) no-repeat 17px center;
            cursor: pointer;
        }
        .file-list{
            margin-top: 22px;
            .file-item{
                position: relative;
                height: 15px;
                margin-bottom: 24px;
                line-height: 15px;
            //    background: #fff url(../../static/img/red-x-icon.png) no-repeat scroll right;
                .remove-icon{
                    display: block;
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 15px;
                    height: 15px;
                    background: #fff url(../../static/img/red-x-icon.png) no-repeat scroll center;
                    cursor: pointer;
                }
            }
        }
    }
}
</style>
