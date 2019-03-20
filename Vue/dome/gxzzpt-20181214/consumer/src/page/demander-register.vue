<template>
    <div id="register-page">
        <div class="content">
            <div class="crumb-bread">
                <span class="router-link" @click="$router.push({path:'/index'})">首页</span>
                <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
                <span class="curr">需求方注册</span>
            </div>
            <div class="content-box">
                <div class="form-title">
                    <div class="title">注册成为需求方</div>
                    <div class="link" @click="$router.push({path:'/register/provider'})">注册成为制造商</div>
                </div>
                <div class="form-box">
                    <el-form :model="formData" :rules="rules" ref="registerForm" prop="companyName">
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
                        </el-form-item>
                        <el-form-item label-posotion="left" label="确认密码：" label-width="96px" prop="checkPassword">
                            <el-input type="password" :maxlength="20" v-model="formData.checkPassword"></el-input>
                        </el-form-item>
                        <el-form-item label-posotion="left" label="电子邮箱：" label-width="96px" prop="contactEmail">
                            <el-autocomplete :maxlength="36"
                                v-model="formData.contactEmail"
                                :fetch-suggestions="emailInputHandler"
                                :trigger-on-focus="false">
                            </el-autocomplete><label for="" class="remark email-remark">注册后可使用邮箱登录</label>
                        </el-form-item>
                        <el-form-item label-posotion="left" label="姓名：" label-width="96px" prop="nickName">
                            <el-input :maxlength="20" placeholder="请填写您的姓名" v-model="formData.nickName"></el-input>
                        </el-form-item>
                        <el-form-item label-posotion="left" label="所在企业名称：" label-width="96px" prop="companyName">
                            <el-input :maxlength="36" placeholder="请填写在工商局注册的企业名称" v-model="formData.companyName"></el-input>
                        </el-form-item>
                        <el-form-item label-posotion="left" label="职位：" label-width="96px" prop="jobTitle">
                            <el-input :maxlength="6" placeholder="请填写企业的职位名称" v-model="formData.jobTitle"></el-input>
                        </el-form-item>
                    </el-form>
                    <div class="agreement-box">
                        <el-checkbox v-model="isAgree">我已阅读并同意<router-link :to="{path:'contract'}" target="_blank"><span class="agreement-link">《共享制造平台用户协议》</span></router-link></el-checkbox>
                    </div>
                    <div class="error-box" v-show="showErrMessage">您输入的密码不一致</div>
                    <div class="submit-box">
                        <el-button type="primary" :disabled="isAgree?false:true" class="btn" size="medium" @click="submit">立即注册</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {validateEmail ,validatPassword,EmailAuto,validateCode} from '../lib/validate.js';
import { mapState, mapActions } from 'vuex';
export default {
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
        return {
            isAgree: true,
            countryList:[],
            areaData:[],
            phoneValid: false,
            showComputedNumber: false,
            showErrMessage: false,
            computedNumber: 60,
            formData: {
                companyName:'',
                companyShortName:'',
                contactEmail:'',
                contactPhone:'',
                nickName:'',
                password:'',
                checkPassword:'',
                country:350000,
                province:'广东省',
                telephone: '',
                code:'',
                invCode: ''
            },
            rules: {
            //    companyName: [{required: true,message:'请输入企业法定名称',trigger:'blur'}],
                companyShortName: [{required: true,message:'请输入企业简称',trigger:'blur'}],
            //    nickName: [{required: true,message:'请输入联系人',trigger:'blur'}],
                contactPhone: [{required: true,validator: validatePhone,trigger:'blur'},{required: true,validator: validatePhone,trigger:'change'}],
                code: [{required: true,validator:validateCode,trigger:'blur'}],
                contactEmail: [{required: true,message:'请输入正确邮箱',trigger:'blur'}],
                password: [{required: true,validator:validatPassword,trigger:'blur'}],
                checkPassword:[{required: true,validator:validatPassword,trigger:'blur'}],
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
    //    this.areaData = this.$areaData;
    },
    methods: {
        ...mapActions(['setUser']),

        empty() {
        },
        emailInputHandler(inputString,cb) {
            EmailAuto(inputString,cb)
        },
        submit() {

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

        submit() {
            this.$refs.registerForm.validate(( valid ) => {
                if ( valid ) {
                    if ( this.formData.checkPassword != this.formData.password ) {
                        this.showErrMessage = true;
                    } else {
                        var params = {
                            platformRole: this.systemRole.DEMANDER,
                            companyName: this.formData.companyName,
                            companyPingyin: this.$py.mkPY(this.formData.companyName),
                            phone: this.formData.contactPhone,
                            email: this.formData.contactEmail,
                            verificationCode: this.formData.code,
                            password: this.formData.password,
                            nickName: this.formData.nickName,
                            contactsEmail: this.formData.contactEmail,
                            invCode: this.formData.invCode,
                            jobTitle: this.formData.jobTitle
                        }
                        this.$http.post('/custom/user/register', params).then(( res ) => {
                            if ( res.data.code == 200 ) {
                            //    this.$message.success('注册成功！');
                                var requestParams = {
                                    username: this.formData.contactEmail,
                                    password: this.formData.password,
                                    userType: this.userType.CLIENT
                                }
                                this.$http.post('/login', requestParams).then(( res ) => {
                                    if ( res.data.code ==200 ) {
                                        localStorage.setItem('gxzzpt2_consumer', JSON.stringify(res.data.data));
                                        this.setUser(res.data.data);
                                        this.$router.push({path:'/register/success'});
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
                .remark{
                    position: absolute;
                    top: 0;
                    right: -125px;
                    color: #3f8def;
                }
                .phone-remark{
                    right: -137px;
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
