<template>
    <div id="register-page">
        <div class="content">
            <div class="crumb-bread">
                <span class="router-link" @click="$router.push({path:'/index'})">首页</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="curr">供应商注册</span>
            </div>
            <div class="content-box">
                <div class="form-title">
                    <div class="title">注册成为供应商</div>
                    <div class="link" @click="$router.push({path:'/register/demander'})">注册成为需求方</div>
                </div>
                <div class="form-box">
                    <el-form :model="formData" :rules="rules" ref="registerForm" prop="companyName">
                        <el-form-item label-posotion="left" label="企业法定名称：" label-width="96px" prop="companyName">
                            <el-input :maxlength="36" v-model="formData.companyName"></el-input>
                        </el-form-item>
                        <el-form-item label-posotion="left" label="企业简称：" label-width="96px" prop="companyShortName">
                            <el-input :maxlength="6" v-model="formData.companyShortName"></el-input>
                        </el-form-item>
                        <el-form-item label-posotion="left" label="联系人名称：" label-width="96px" prop="contactName">
                            <el-input :maxlength="20" v-model="formData.contactName"></el-input>
                        </el-form-item>
                        <el-form-item label-posotion="left" label="电子邮箱：" label-width="96px" prop="contactEmail">
                            <el-autocomplete :maxlength="36"
                                v-model="formData.contactEmail"
                                :fetch-suggestions="emailInputHandler"
                                :trigger-on-focus="false">
                            </el-autocomplete><label for="" class="remark">将成为您的登录账号</label>
                        </el-form-item>
                        <el-form-item label-posotion="left" label="手机号码：" label-width="96px" prop="contactPhone">
                            <el-input :maxlength="11" v-model="formData.contactPhone"></el-input>
                            <label for="" class="remark phone-remark">注册后可使用手机号登录</label>
                        </el-form-item>
                        <el-form-item class="code-form-item" label-posotion="left" label="验证码：" label-width="96px" prop="code">
                            <el-input :maxlength="4" v-model="formData.code"></el-input><span v-show="!showComputedNumber" class="btn" @click="phoneValid?getCode():empty()"
                             :class="{'disabled':phoneValid?false:true}">获取验证码</span><span v-show="showComputedNumber" class="btn">{{computedNumber}}s</span>
                        </el-form-item>
                        <el-form-item label-posotion="left" label="密码：" label-width="96px" prop="password">
                            <el-input type="password" :maxlength="20" v-model="formData.password"></el-input>
                            <label for="" class="password-remark help">6-20位</label>
                        </el-form-item>
                        <el-form-item label-posotion="left" label="确认密码：" label-width="96px" prop="checkPassword">
                            <el-input type="password" :maxlength="20" v-model="formData.checkPassword"></el-input>
                        </el-form-item>
                        <el-form-item label-posotion="left" label="国家/地区：" label-width="96px" required>
                            <el-col :span="12">
                                <div style="width:182px;padding-right:5px;">
                                    <el-form-item>
                                        <el-select @change="countryChangeHandler" v-model="formData.country">
                                            <el-option v-for="item in countryList"
                                                :key="item.id"
                                                :label="item.name"
                                                :value="item.id"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div style="width:182px;padding-left:5px;">
                                    <el-form-item class="province-form-item">
                                        <el-select v-model="formData.province" @change="provinceChangeHandler">
                                            <el-option v-for="(item,index) in areaData['86']" :label="item" :value="item" :key="index"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-form-item>
                        <el-form-item class="tech-form-item" label-posotion="left" label="主工艺：" label-width="96px" prop="techniqueNames">
                            <el-input v-model="formData.techniqueNames" v-show="false"></el-input>
                            <v-tree  v-on:get-currentKey="techniqueChangeHandler" :checked-nodes="treeModal.SelectNode"  :checked-keys="formData.techniqueList"
                             :expand-all="false" :set-width="treeModal.width" :max-length="20" :set-title='treeModal.title' :btn-name='treeModal.btnName' :switch-state='true' :switch-pose='460020'></v-tree>
                            <!-- <el-select v-model="formData.techniqueList" multiple filterable :multiple-limit="5">
                                <el-option v-for="item in techniqueList" :key="item.id" :label="item.name" :value="item.id" ></el-option>
                            </el-select> -->
                        </el-form-item>
                        <el-form-item label-posotion="left" label="企业LOGO ：" label-width="96px" prop="logoFileName">
                            <el-input v-model="formData.logoFileName" disabled></el-input>
                            <el-upload
                                :action="logoUploadUrl"
                                :on-success="onSuccessUploadLogo"
                                :before-upload="beforeUploadLogo"
                                :limit="100"
                                :show-file-list="false">
                                <span class="upload-btn">上传</span>
                            </el-upload>
                            <label for="" class="upload-remark help">建议尺寸190px*85px，支持png/jpg/jpeg图片小于120k</label>
                        </el-form-item>
                        <el-form-item label-posotion="left" label="营业执照：" label-width="96px" prop="businessLicenseFileName">
                            <el-input disabled v-model="formData.businessLicenseFileName"></el-input>
                            <el-upload
                                :action="businessUploadUrl"
                                :on-success="onSuccessUploadBusinessLicense"
                                :before-upload="beforeUploadBusinessLicense"
                                :limit="100"
                                :show-file-list="false">
                                <span class="upload-btn">上传</span>
                            </el-upload>
                            <label for="" class="upload-remark business-remark help">建议尺寸800px*800px，支持png/jpg/jpeg图片小于500k</label>
                        </el-form-item>
                        <!-- <el-form-item label-posotion="left" label="邀请码：" label-width="96px">
                            <el-input :maxlength="20" v-model="formData.invCode"></el-input>
                        </el-form-item> -->
                        <el-form-item label-posotion="left" label="企业联系电话：" label-width="96px">
                            <el-input :maxlength="20" v-model="formData.telephone"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="agreement-box">
                        <el-checkbox v-model="isAgree">我已阅读并同意<router-link :to="{path:'contract'}" target="_blank"><span class="agreement-link">《共享制造平台用户协议》</span></router-link></el-checkbox>
                    </div>
                    <div class="error-box" v-if="showErrMessage">您输入的密码不一致</div>
                    <div class="submit-box">
                        <el-button type="primary" :disabled="isAgree?false:true" class="btn" @click="submit" size="medium">立即注册</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {validateEmail ,validatPassword,EmailAuto,validateCode} from '../lib/validate.js';
import { mapState, mapActions } from 'vuex';
import CommonTree from './Tree-common';
export default {
    components:{
        'v-tree': CommonTree
    },
    data() {
        var validatePhone = (rule, value, callback) => {
            let req = /^((((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})|(0\d{2,3}-\d{7,8}))$/
            if (!req.test(value)) {
                this.phoneValid = false;
                callback(new Error("请输入正确的手机号"));
            } else {
                this.phoneValid = true;
                callback();
            }
        };
     /*    var validateTechnique = (rule, value, callback) => {
            console.log(1,value);
            if ( !value ) {
                 console.log(2,value);
                callback(new Error("请选择工艺"));
            } else {
                callback();
            }
        }; */
        return {
            treeModal: {
                SelectDatas:[67],
                SelectNode:[],
                width:'30%',
                title:'选择工艺',
                btnName:''
            },
            logoUploadUrl:'http://dw.tatfookcloud.com/upload',
            businessUploadUrl: this.$baseURL + '/uploadingFile',
            isAgree: true,
            countryList:[],
            areaData:[],
            techniqueList:[],
            phoneValid: false,
            showComputedNumber: false,
            computedNumber: 60,
            showErrMessage: false,
            formData: {
                companyName:'',
                companyShortName:'',
                contactEmail:'',
                contactPhone:'',
                contactName:'',
                password:'',
                checkPassword:'',
                country:350000,
                province:'北京',
                telephone: '',
                code:'',
                logoFileName:'',
                logoFileUrl:'',
                businessLicenseFileName:'',
                businessLicenseFileId:'',
                techniqueList:[],
                invCode:'',
                techniqueNames:''
            },
            rules: {
                companyName: [{required: true,message:'请输入企业法定名称',trigger:'blur'}],
                companyShortName: [{required: true,message:'请输入企业简称',trigger:'blur'}],
                contactName: [{required: true,message:'请输入联系人',trigger:'blur'}],
                contactPhone: [{required: true,validator: validatePhone,trigger:'blur'},{required: true,validator: validatePhone,trigger:'change'}],
                code: [{required: true,validator:validateCode,trigger:'blur'}],
                contactEmail: [{required: true,validator:validateEmail,trigger:'change'}],
                password: [{required: true,validator:validatPassword,trigger:'blur'}],
                checkPassword:[{required: true,validator:validatPassword,trigger:'blur'}],
            //    logoFileName:[{required: true,message:'请上传企业LOGO',trigger:'blur'},{required: true,message:'请上传企业LOGO',trigger:'change'}],
                businessLicenseFileName:[{required: true,message:'请上传营业执照',trigger:'blur'},{required: true,message:'请上传营业执照',trigger:'change'}],
            //    techniqueList:[{required: true,validator:validateTechnique,trigger:'blur'},{required: true,validator:validateTechnique,trigger:'change'}],
                techniqueNames:[{required: true,message:'请选择工艺',trigger:'change'}],
            },
            systemRole:{
                OPERATION:500010,
                DEMANDER:500020,
                PROVIDER:500030
            },
            userType: {
                OPERATION:101010,
                CLIENT:101020
            }
        }
    },
    created() {
        this.formData.invCode = this.$route.query.invCode||'';
        this.countryList = this.$LocalStorage.getWords(142);
        this.techniqueList = this.$LocalStorage.getWords(105);
        this.areaData = this.$areaData;
    },
    methods: {
        ...mapActions(['setUser']),

        empty() {

        },

        techniqueChangeHandler(takeDate, keyDate) {
            this.formData.techniqueList = keyDate;
            var nameList = [];
            takeDate.map(( item ) => {
                nameList.push(item.techniqueName);
            })
            this.treeModal.btnName = (nameList.toString());
            this.formData.techniqueNames = nameList.toString();
        },

        emailInputHandler(inputString,cb) {
            EmailAuto(inputString,cb)
        },
        countryChangeHandler( value ) {
            if ( value == 350000 ) {
                this.areaData = this.$areaData;
            } else {
                this.areaData = [];
            }
        },
        provinceChangeHandler( value ) {
        },

        checkUserExist() {

        },

        getCode() {
            this.$http.post('/checkUserExist', {username:this.formData.contactPhone}).then(( res ) => {
                if ( res.data.code == 200 ) {
                    if ( res.data.data.isExist ) {
                        this.$error('该手机号已被注册');
                    } else {
                        this.$http.post( '/sendSmsCode', {phone: this.formData.contactPhone} ).then(( res ) => {
                            if ( res.data.code == 200 ) {
                                this.showComputedNumber = true;
                                this.timer = setInterval(() => {
                                    this.computedNumber--;
                                    if( this.computedNumber == 0 ) {
                                        clearInterval(this.timer);
                                        this.showComputedNumber = false;
                                        this.computedNumber = 60;
                                    }
                                }, 1000);
                            } else {
                                this.$error( res.data.message );
                            }
                        });
                    }
                }
            })
        },
        onSuccessUploadLogo( res, file, fileList ) {
            if ( res.code == 200 ) {
                this.formData.logoFileName = file.name;
                this.formData.logoFileUrl = res.data.img_url;
            } else {
                this.$error(res.message);
            }
        },
        beforeUploadLogo( file ) {
            if (!/\.(png|PNG|jpg|JPG|jpeg|JPEG)$/.test(file.name)) {
                this.$error("只支持上传png/jpg/jpeg格式的图片");
                return false;
            }
            if ((file.size / 1024) > 120 ) {
                this.$error('文件大小不能超过120K');
                return false;
            }
        },
        onSuccessUploadBusinessLicense( res, file, fileList ) {
            if ( res.code == 200 ) {
                this.formData.businessLicenseFileName = file.name;
                this.formData.businessLicenseFileId = res.attachFile.id;
            } else {
                this.$error(res.message);
            }
        },
        beforeUploadBusinessLicense( file ) {
            if (!/\.(png|PNG|jpg|JPG|jpeg|JPEG)$/.test(file.name)) {
                this.$error("只支持上传png/jpg/jpeg格式的图片");
                return false;
            }
            if ( ( file.size / 1024 ) > 500) {
                this.$error('文件大小不能超过500K');
                return false;
            }
        },
        submit() {
            this.$refs.registerForm.validate(( valid ) => {
                if ( valid ) {
                    if ( this.formData.checkPassword != this.formData.password ) {
                        this.showErrMessage = true;
                    } else {
                        var params = {
                            platformRole: this.systemRole.PROVIDER,
                            companyName: this.formData.companyName,
                            companyPingyin: this.$py.mkPY(this.formData.companyName),
                            companyShortName: this.formData.companyShortName,
                            phone: this.formData.contactPhone,
                            email: this.formData.contactEmail,
                            verificationCode: this.formData.code,
                            password: this.formData.password,
                            businessFileId: this.formData.businessLicenseFileId,
                            country: this.formData.country,
                            province: this.formData.province,
                            contactsTel: this.formData.telephone,
                            logoUrl: this.formData.logoFileUrl,
                            techniqueList: this.formData.techniqueList,
                            contactsName: this.formData.contactName,
                            contactsEmail: this.formData.contactEmail,
                            invCode: this.formData.invCode
                        }
                        this.$http.post('/custom/user/register', params).then(( res ) => {
                            if ( res.data.code == 200 ) {
                        //        this.$message.success('注册成功！');
                                var requestParams = {
                                    username: this.formData.contactEmail,
                                    password: this.formData.password,
                                    userType: this.userType.CLIENT
                                }
                                this.$http.post('/login', requestParams).then(( res ) => {
                                    if ( res.data.code ==200 ) {
                                        localStorage.setItem('gxzzpt2_consumer', JSON.stringify(res.data.data));
                                        this.setUser(res.data.data);
                                        this.$router.push({path:'/GuideInfo'});
                                    } else {
                                        this.$message({type:'error',message:res.data.message,duration:1000});
                                    }
                                })
                            } else {
                                this.$error(res.data.message);
                            }
                        })
                    }
                } else {
                    return false;
                }
            })
        },
    }
}
</script>

<style lang="less">
#register-page{
    .content{
        width: 1200px;
        margin: 0 auto;
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
        .content-box{
            background: #fff;
            margin-bottom: 35px;
            .form-title{
                position: relative;
                height: 60px;
                border-bottom: 1px solid #e2e2e2;
                .title{
                    font-size: 20px;
                    text-align: center;
                    line-height: 60px;
                }
                .link{
                    position: absolute;
                    top: 22px;
                    right: 16px;
                    font-size: 12px;
                    color: #3f8def;
                    width: 101px;
                    cursor: pointer;
                    text-indent: 17px;
                    background: #fff url(../../static/img/goto-icon.png) no-repeat center left;
                }
            }
            .form-box{
                padding: 21px 0 45px;
                width: 460px;
                margin: 0 auto;
                .tech-form-item{
                    .Tree-common{
                        min-height: 26px;
                    }
                    .btn{
                        width: 100%;
                        min-height: 26px;
                        border: #d0d0d0 1px solid;
                        border-radius: 0;
                        background: #fff;
                        text-align: left;
                        padding: 0;
                        padding: 2px 10px;
                        span{
                            color: #777;
                            white-space: normal;
                            line-height: 14px;
                        }
                    }
                }
                .remark{
                    position: absolute;
                    top: 0;
                    right: -112px;
                    color: #3f8def;
                }
                .phone-remark{
                    right: -137px;
                }
                .upload-remark{
                    position: absolute;
                    top: 0;
                    right: -310px;
                }
                .business-remark{
                    right: -316px;
                }
                .password-remark{
                    position: absolute;
                    top: 0;
                    right: -43px;
                }
                .el-upload{
                    display: block;
                }
                .upload-btn{
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 65px;
                    height: 26px;
                    line-height: 26px;
                    text-align: center;
                    color: #3f8def;
                    cursor: pointer;
                    background: #d2e6ff;
                }
                .code-form-item{
                    .el-input{
                        width: 270px;
                    }
                    .btn{
                        display: inline-block;
                        width: 80px;
                        height: 26px;
                        color: #fff;
                        background-color: #3f8def;
                        text-align: center;
                        line-height: 26px;
                        margin-left: 12px;
                        cursor: pointer;
                    }
                }
                .agreement-box{
                    .agreement-link:hover{
                        color: #3f8def;
                        text-decoration: underline;
                    }
                }
                .error-box{
                    text-align: center;
                    color: #f34747;
                    margin-top: 20px;
                }
                .submit-box{
                    margin-top: 35px;
                    .btn{
                        display: block;
                        width: 360px;
                        margin: auto;
                        border-radius: 4px;
                        span{
                            font-size: 14px;
                        }
                    }
                }
            }
        }
    }
}
</style>
