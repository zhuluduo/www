<template>
    <div id="register-popup" v-show="showPopup">
        <div class="mask-layer"></div>
        <div class="content-box" :style="{height: registerType==0?'524px':'604px'}">
            <img src="../../static/img/close-icon.png" class="close-btn" @click="closePopup" alt="">
            <div class="switch-box">
                <span @click="registerType=1" :class="registerType==1?'active':''" class="switch-right">企业用户</span><span class="switch-left" @click="registerType=0" :class="registerType==0?'active':''">个人用户</span>
            </div>
            <div class="question" title="企业用户是以企业为主体进行注册的用户，平台对企业提交的资料进行严格审核。企业用户可以在平台发布需求，也可以在升级为供应商后在平台接单。而个人用户目前仅可作为需求方，不可以升级为供应商。">企业用户和个人用户有什么区别？</div>
            <div class="content personal" v-show="registerType==0">
                <div class="clearfix"></div>
                <div class="title">注册成为个人用户</div>
                <el-form :model="personalForm" :rules="personalRules" ref="personalForm">
                    <el-form-item prop="username">
                        <el-input :maxlength="11" v-model="personalForm.username" class="phone-input" placeholder="请输入您的手机号"></el-input>
                        <div class="def-error-message" v-show="personalForm.showErrMessage">请输入正确的手机号</div>
                    </el-form-item>
                    <el-form-item prop="verificationCode">
                                <el-input :maxlength="4"  v-model="personalForm.verificationCode" class="code-input" placeholder="请输入您的验证码"></el-input>
                                <span class="code-link" @click="getCode" v-show="personalForm.showCodeLink">获取验证码</span><span class="count-down" v-show="!personalForm.showCodeLink">({{personalForm.computedNum}}s)</span>
                            </el-form-item>
                    <el-form-item prop="password">
                        <el-input @keydown.native="personalRegisterByKeydown($event)" :maxlength="20" type="password" v-model="personalForm.password" class="password-input" placeholder="请输入账号密码"></el-input>
                    </el-form-item>
                </el-form>
                <div class="agreement-form"> 
                    <el-checkbox v-model="personalForm.isAgree">我已阅读并同意<span class="protocol" @click="gotoContract">《共享制造平台需求方注册协议》</span></el-checkbox>
                </div>
                <div class="register-btn-box">
                    <span class="register-btn btn" :class="personalForm.isAgree?'':'btn-disabled'" @click="registerPersonal">立即注册</span>
                    <span class="remark" @click="toLogin">已有账号，马上去登录</span>
                </div>
            </div>
            <div class="content company" v-show="registerType==1">
                <div class="clearfix"></div>
                <div class="title">注册成为企业用户</div>
                <div class="step clearfix">
                    <div class="step-item" :class="(showStepOne||showStepTwo||showStepThr)?'step-active':''"><div class="inner-circle"></div></div>
                    <div class="beautiful-line" :class="(showStepTwo||showStepThr)?'line-active':''"></div>
                    <div class="step-item" :class="(showStepTwo||showStepThr)?'step-active':''"><div class="inner-circle"></div></div>
                    <div class="beautiful-line" :class="showStepThr?'line-active':''"></div>
                    <div class="step-item" :class="showStepThr?'step-active':''"><div class="inner-circle"></div></div>
                </div>
                <div class="step-name clearfix">
                    <div class="name-item">录入登录账号</div>
                    <div class="name-item" style="text-align:center">录入企业信息</div>
                    <div class="name-item" style="text-align:right">申请成为供应商</div>
                </div>
                <div v-show="showStepOne" >
                    <el-form :model="stepOneForm.data" :rules="stepOneForm.rules" ref="stepOneForm">
                        <el-form-item label="登陆账号：" label-position="left" label-width="72px" prop="username">
                            <el-input :maxlength="36" v-model="stepOneForm.data.username" placeholder="4-36位的数字、字母、符号（-_.@）"></el-input>
                        </el-form-item>
                            <el-form-item  label="密码：" label-position="left" label-width="48px" prop="password">
                            <el-input :maxlength="20" v-model="stepOneForm.data.password" type="password" placeholder="6-20位的数字、字母、符号"></el-input>
                        </el-form-item>
                            <el-form-item  label="确认密码：" label-position="left" label-width="72px" prop="checkPassword">
                            <el-input :maxlength="20" v-model="stepOneForm.data.checkPassword" type="password" placeholder="6-20位的数字、字母、符号"></el-input>
                            <div class="def-error-message" v-show="stepOneForm.showErrMessage">密码不一致</div>
                        </el-form-item>
                        <div class="agreement-form"> 
                            <el-checkbox v-model="stepOneForm.isAgree">我已阅读并同意<span class="protocol" @click="gotoContract">《共享制造平台需求方注册协议》</span></el-checkbox>
                        </div>
                    </el-form>
                    <div class="register-btn-box">
                        <span class="btn reset-btn" @click="resetStepOneForm">重置</span> <span class="register-btn btn" :class="stepOneForm.isAgree?'':'btn-disabled'" @click="handleNextOne">下一步</span>
                    </div>
                    <div class="to-login" @click="toLogin">已有账号，马上去登录</div>
                </div>
                <div v-show="showStepTwo">
                    <el-form v-show="showStepTwo" :model="stepTwoForm.data" :rules="stepTwoForm.rules" ref="stepTwoForm">
                        <el-form-item label="企业全称：" label-position="left" label-width="72px" prop="companyName">
                            <el-input :maxlength="100" v-model="stepTwoForm.data.companyName"></el-input>
                        </el-form-item>
                        <el-form-item label="企业信用代码：" label-position="left" label-width="96px" prop="businessCode">
                            <el-input :maxlength="20" v-model="stepTwoForm.data.businessCode"></el-input>
                        </el-form-item>
                            <el-form-item label="联系人：" label-position="left" label-width="60px" prop="contacts">
                            <el-input :maxlength="20" v-model="stepTwoForm.data.contacts"></el-input>
                        </el-form-item>
                            <el-form-item label="电话：" label-position="left" label-width="48px" prop="mobile">
                            <el-input :maxlength="11" v-model="stepTwoForm.data.mobile"></el-input>
                        </el-form-item>
                        <el-form-item label="邮箱：" label-position="left" label-width="48px" prop="email">
                                <el-autocomplete
                                class="inline-input"
                                v-model="stepTwoForm.data.email"
                                :fetch-suggestions="querySearch"
                                :trigger-on-focus="false"
                                ></el-autocomplete>
                        </el-form-item>
                    </el-form>
                    <div class="register-btn-box">
                        <span class="btn reset-btn" @click="prevStep">上一步</span> <span class="register-btn btn" @click="registerCompany">完成注册</span>
                    </div>
                </div>
                <div class="step-three" v-show="showStepThr">
                    <img src="../../static/img/success-img.png" alt="">
                    <div class="text">恭喜您！</div>
                    <div class="text">企业{{stepTwoForm.data.companyName}}注册成功！</div>
                    <div class="remark">供应商报价后系统将通过邮件通知您供应商报价后系统将通过邮件通知您</div>
                    <div class="btn-box">
                        <div class="btn left" @click="closePopup">提交需求</div>
                        <div class="btn right" @click="toManufacturer">我要成为供应商</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {validatePhone, validatAaccount, validateCode, validateEmail , validatPassword, EmailAuto} from '../lib/validate.js';
import {store} from './../vuex/store.js';
import { mapState, mapActions } from 'vuex';
import router from './../router/routes';
export default {
    store:store,
    router:router,
    data() {
        const validateCompany = (rule, value, callback) => {
            if (!value) {
                callback(new Error("请选择企业"));
            } else {
                callback();
            }
        };
        const validatePhone2 = (rule, value, callback) => {
            this.personalForm.showErrMessage = false;
            var req = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
            if (!req.test(value)) {
                callback(new Error("请输入正确的手机号"));
            } else {
                callback();
            }
        };
        return {
            showPopup: true,
            registerType: 1,//登录类型 0个人 1公司,
            callbackfun: null,
            timer: null,
            companyList:[],
            personalForm: {
                isAgree: false,
                username: '',
                password: '',
                verificationCode: '',
                showCodeLink: true,
                computedNum: 60,
                showErrMessage: false,
            },
            personalRules: {
                username:[
                    {validator: validatePhone2, trigger: 'blur'}
                ],
                password:[
                    { validator: validatPassword, trigger: 'blur' },
                ],
                verificationCode:[
                    {validator: validateCode,trigger: "blur"}
                ]
            },
            showStepOne: true,
            showStepTwo: false,
            showStepThr: false,
            stepOneForm: {
                isAgree:false,
                showErrMessage:false,
                data: { 
                    username:'',
                    password: '',
                    checkPassword: '',
                }, 
                rules:{
                   password:[
                      { required: true, validator: validatPassword, trigger: 'blur' },
                   ],
                   checkPassword:[
                      { required: true, validator: validatPassword, trigger: 'blur' },
                   ],
                   username: [
                       {required:true, validator:validatAaccount, trigger: 'blur'}
                   ]
               }
           },
           stepTwoForm: {
                data: {
                    companyName: '',
                    companyShortName:'',
                    companyCatalog: '',
                    businessCode: '',
                    mobile: '',
                    email: '',
                    contacts: '',
                },
                rules:{
                    companyName:[
                            { required: true, message: '请输入企业名称', trigger: 'blur' },
                    ],
                    companyCatalog: [
                        { required: true, message: '请选择企业类型', trigger: 'blur' },
                    ],
                    businessCode: [
                        { required: true, message: '请输入企业注册号', trigger: 'blur' },
                    ],
                    mobile:[
                        { required: true, validator: validatePhone, trigger: 'blur' },
                    ],
                    email: [
                        { required: true, validator: validateEmail, trigger: 'change'}
                    ],
                    contacts: [
                        { required: true, message: '请输入联系人', trigger: 'blur' },
                    ]
                }
            },
        }

    },
    created() {
    },
    methods: {
        ...mapActions(['setUser']),

        gotoContract() {
            this.$router.push({path: '/contract'});
            this.closePopup();
        },

        closePopup() {
            this.showPopup = false;
            this.$el.parentNode.removeChild(this.$el);
        },

        /* --------个人注册---------------- */
        getCode() {
            var req = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
                if ( req.test( this.personalForm.username ) ) {
                    this.$http.post( '/sendSmsCode', {phone: this.personalForm.username} ).then(( res ) => {
                        this.personalForm.showCodeLink = false;
                        this.timer = setInterval(() => {
                            this.personalForm.computedNum--;
                            if( this.personalForm.computedNum == 0 ) {
                                clearInterval(this.timer);
                                this.personalForm.showCodeLink = true;
                                this.personalForm.computedNum = 60;
                            }
                        }, 1000);
                    })
                } else {
                    this.personalForm.showErrMessage = true;
                }
        } ,

        registerPersonal() {
            if ( this.personalForm.isAgree ) {
                this.$refs['personalForm'].validate(( valid ) => {
                    if ( valid ) {
                        var requestParams = {
                            username: this.personalForm.username,
                            password: this.personalForm.password,
                            verificationCode: this.personalForm.verificationCode,
                            companyType: 160010,
                        }
                        this.$http.post('/custom/user/register', requestParams).then(( res ) => {
                            if ( res.data.code == 200 ) {
                                this.$message.success('注册成功！');
                                var loginParams = {
                                    username: requestParams.username,
                                    password: requestParams.password,
                                    userType: 101020,
                                    companyType:requestParams.companyType
                                }
                                this.login( loginParams, 0 );
                            } else {
                                this.$error(res.data.message);
                            }
                        })
                    } else {
                        return false;
                    }
                })
            }
        }, 

        personalRegisterByKeydown( event ) {
            if (event.keyCode == 13 ) {
                this.registerPersonal();
            }
        },

        resetStepOneForm() {
            this.$refs['stepOneForm'].resetFields();
            this.$refs['stepTwoForm'].resetFields();
        },
       
        handleNextOne() {
            if ( this.stepOneForm.isAgree ) {
                this.$refs['stepOneForm'].validate(( valid ) => {
                    if ( valid ) {
                        if ( this.stepOneForm.data.password == this.stepOneForm.data.checkPassword ) {
                            this.showStepOne = false;
                            this.showStepTwo = true;
                        } else {
                        //    this.$error('输入密码不一致');
                            this.stepOneForm.showErrMessage = true;
                        }
                    } else {
                        return false;
                    }
                })
            }
        },

        toLogin() {
            this.closePopup();
            this.$login({}, this.callbackfun);
        },
     
        /* ---------公司登陆--------------- */

        prevStep() {
            this.showStepOne = true;
            this.showStepTwo = false;
        },

        toManufacturer() {
            this.closePopup();
            this.$router.push({path:'/usercenter/be-manufacturer'});
        },

         resetStepTwoForm() {
            this.$refs['stepTwoForm'].resetFields();
        },

        login( params, type ) {
            this.$http.post('/login', params ).then(( res ) => {
                if ( res.data.code == 200 ) {
                    localStorage.setItem('gxzzpt2_consumer', JSON.stringify(res.data.data));
                    this.setUser(res.data.data);
                    if ( typeof this.callbackfun === 'function' ) {
                        this.callbackfun();
                    }
                    if ( type == 0 ) {
                        this.closePopup();
                    } 
                }
            })
        },

        registerCompany() {
            this.$refs['stepTwoForm'].validate(( valid ) => {
                if ( valid ) {
                    var requestParams = {
                        username: this.stepOneForm.data.username,
                        password: this.stepOneForm.data.password,
                        companyType: 160020,
                        companyName: this.stepTwoForm.data.companyName,
                    //    companyCatalog: this.stepTwoForm.data.companyCatalog,
                    //    industryId: this.stepTwoForm.data.industryId,
                        businessCode: this.stepTwoForm.data.businessCode,
                        mobile: this.stepTwoForm.data.mobile,
                        email: this.stepTwoForm.data.email,
                        contacts: this.stepTwoForm.data.contacts,
                        companyPingyin: this.$py.mkPY(this.stepTwoForm.data.companyName),
                    }
                    // console.log(requestParams);
                      this.$http.post('/custom/user/register', requestParams).then(( res ) => {
                        if ( res.data.code == 200 ) {
                            this.$message.success('注册成功！');
                        //    this.closePopup();
                            var loginParams = {
                                username: requestParams.username,
                                password: requestParams.password,
                                userType: 101020,
                                companyType:requestParams.companyType,
                                companyId: res.data.data.companyId
                            }
                            this.showStepTwo = false;
                            this.showStepThr = true;
                            this.login( loginParams, 1 );
                        } else {
                            this.$error(res.data.message);
                        }
                    }) 
                } else {
                    return false;
                }
            })
        },
        //邮箱自动补全的方法；
        querySearch(inputString,cb) {
            EmailAuto(inputString,cb)
        }
       
    }
}
</script>
<style lang="less">
#register-popup{
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
    .mask-layer {
        position: fixed;
        width: 100%;
        height: 100%;
        top: 0;
        z-index: 1002;
        background: rgba(0, 0, 0, 0.3);
    }
    .content-box{
        position: fixed;
        left: 0;
        right: 0;
        top: 200px;
        margin: auto;
        z-index: 1003;
        width: 544px;
        max-height: 730px;
        box-sizing: border-box;
        background: #fff;
        .close-btn{
            position: absolute;
            top: -43px;
            right: 13px;
            cursor: pointer;
        }
        .switch-box{
            position: absolute;
            top: -54px;
            left: 0;
            z-index: 1004;
            width: 290px;
            span{
                display: inline-block;
                width: 145px;
                height: 54px;
                border-radius: 8px 8px 0px 0px;
                text-align: center;
                line-height: 54px;
                font-size: 16px;
                background: #969698;
                color: #e9e9e9;
                cursor: pointer;
            }
            .switch-left{
                position: relative;
            }
            .switch-right{
                position: relative;
            }
        
            .active{
                background: #fff;
                color: #3f8def;
            }
        }
        .question{
            float: right;
            width: 250px;
            height: 20px;
            text-indent: 25px;
            margin-top: 21px;
            color: #ffae3b;
            text-decoration: underline;
            cursor: pointer;
            background: #fff url(../../static/img/yellow-question-icon.png) no-repeat left center;
        }
        .content{
            padding: 67px 55px 70px 55px;
            .title{
                height: 24px;
                line-height: 24px;
                font-size: 24px;
                margin-bottom: 29px;
            }
            .step{
                padding: 0 20px;
                .step-item{
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #fff;
                    float: left;
                    padding: 5px;
                    .inner-circle{
                         width: 8px;
                        height: 8px;
                        border-radius: 50%;
                        background: #dedede;
                    }
                }
                .step-active{
                    background-color: #c1d5ec;
                    .inner-circle{
                        background: #3f8def;
                    }
                }
                .beautiful-line{
                    width: 160px;
                    border-bottom: 1px solid #dedede;
                    margin: 8px 4px;
                    float: left;
                }
                .line-active{
                    border-color: #3f8def;
                }
            }
            .step-name{
                margin-top: 8px;
                margin-bottom: 35px;
                .name-item{
                    width: 144px;
                    float: left;
                    font-size: 12px;
                    color: #b2b2b2;
                }
                .active{
                    color:#3f8def;
                }
            }
            .el-input__inner {
                height: 28px !important;
                border: none;
                border-bottom: 1px solid #777778 !important;
                border-radius: 0 !important;
                padding: 0 !important;
                width: 400px;
                margin-left: 31px;
            }
            .el-form-item__label{
                font-size: 12px;
            }
            .el-form-item.is-success .el-input__inner{
                border-bottom: 1px solid #777778 !important;
            }
            .el-form-item {
                position: relative;
                margin-bottom: 22px;
            }
            .el-form-item__error {
            //    top: 75%;
                left: 32px;
            }
            .code-link{
                position: absolute;
                top: 0;
                right: 30px;
                color: #3f8def;
                cursor: pointer;
            }
            .count-down{
                position: absolute;
                top: 0;
                right: 30px;
                color: #3f8def;
            }
            .def-error-message{
                position: absolute;
                top: 32px;
                left: 32px;
                color: #f56c6c;
                font-size: 12px;
            }
            .protocol:hover{
                color: #3f8def;
                text-decoration: underline;
            }
            .btn-disabled{
                opacity: 0.3;
                cursor: not-allowed !important;
            }
            .background-base-style {
                content: "";
                width: 22px;
                height: 22px;
                position: absolute;
                top: 13px;
                left: -1px;
            }
            .phone-input {
                &:before {
                    .background-base-style;
                    background-image: url(../../static/img/phone-icon.png);
                }
            }
            .password-input {
                &:before {
                    .background-base-style;
                    background-image: url(../../static/img/password-icon.png);
                }
            }
            .code-input {
                &:before {
                    .background-base-style;
                    background-image: url(../../static/img/code-icon.png);
                }
            }
            .register-btn-box{
                margin-top: 45px;
                .btn{
                    display: inline-block;
                    width: 135px;
                    height: 42px;
                    border-radius: 21px;
                    text-align: center;
                    line-height: 42px;
                    font-size: 16px;
                    color: #fff;
                    cursor: pointer;
                }
                .register-btn{
                    background: #3f8def;
                }
                .reset-btn{
                     background: #e6e6e6;
                     color: #828282;
                }
                .remark{
                    margin-left: 30px;
                    color: #999999;
                    text-decoration: underline;
                    cursor: pointer;
                }
            }
        }
        .personal{
            .agreement-form{
                margin-top: 45px;
            }
        }
        .company{
            .el-form-item__error {
                left: 0px;
            }
            .agreement-form{
                margin-top: 35px;
            }
            .el-form-item {
                position: relative;
                margin-bottom: 10px;
            }
            .el-form-item.is-required .el-form-item__label:before {
                position: absolute;
                left: -8px;
            }
            .el-input__inner{
                width: 100%;
                margin-left: 0;
            }
            .register-btn-box{
                display: flex;
                justify-content: space-between;
                .btn{
                    width: 164px;
                }
            }
            .to-login{
                margin-top: 40px;
                text-align: center;
                color: #999999;
                text-decoration: underline;
                cursor: pointer;
            }
            .step-three{
                img{
                    display: block;
                    width: 80px;
                    height: 80px;
                    margin: 0 auto;
                    margin-bottom: 20px;
                }
                .text{
                    font-size: 16px;
                    color: #3f8def;
                    text-align: center;
                    margin-bottom: 5px;
                }
                .remark{
                    text-align: center;
                    padding: 32px 0 40px 0;
                    font-size: 12px;
                    color: #a4a4a4;
                    border-bottom: 1px dashed #b9b9b9;
                }
                .btn-box{
                    padding: 0 30px;
                    margin-top: 50px;
                    .btn{
                        width: 150px;
                        height: 42px;
                        border: 1px solid #3f8def;
                        text-align: center;
                        line-height: 42px;
                        border-radius: 4px;
                        color: #3f8def;
                        background: #fff;
                        cursor: pointer;
                    }
                    .left{
                        float: left;
                    }
                    .right{
                        float: right;
                        background: #3f8def;
                        color: #fff;
                    }
                }
            }
        }
    }
}
</style>
