<template>
<div>
    <div id="demander-register">
        <div class="content">
            <el-form :model="formData" :rules="rules" ref="registerForm">
                <el-form-item prop="phone">
                    <el-input class="required" v-model="formData.phone" placeholder="手机号"></el-input>
                    <span v-show="!showComputedNumber&&phoneValid" class="code-link" @click="getCode">获取验证码</span>
                    <span v-show="showComputedNumber&&phoneValid" class="code-link">{{computedNumber}}s</span>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input class="required" v-model="formData.code" placeholder="手机验证码"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input class="required" :type="inputType" v-model="formData.password" placeholder="密码"></el-input>
                    <i class="eyes-icon" :class="{'open-eyes-icon':inputType=='text'}" @click="changeType"></i>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input class="required" v-model="formData.email" placeholder="电子邮箱地址"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="formData.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="formData.companyName" placeholder="所在企业名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="formData.jobName" placeholder="职位名称"></el-input>
                </el-form-item>
            </el-form>
            <!-- <v-form ref="form">
                <v-input ref="phoneInput" :required="true" :name="'contactPhone'" :rules="'required|contactPhone'" v-model="formData.phone" :placeholder="'手机号'">
                    <span v-show="!showComputedNumber" class="code-link" @click="getCode">获取验证码</span>
                    <span v-show="showComputedNumber" class="code-link">{{computedNumber}}s</span>
                </v-input>
                <v-input :required="true" :name="'code'" :rules="'required|code'" v-model="formData.code" :placeholder="'手机验证码'"></v-input>
                <v-input :required="true" :name="'password'" :rules="'required|password'" :type="'password'" v-model="formData.password" :placeholder="'密码'">
                </v-input>
                <v-input :required="true" :name="'email'" :rules="'required|email'" v-model="formData.email" :placeholder="'电子邮箱地址'"></v-input>
                <v-input :required="false" :name="'name'" v-model="formData.name" :placeholder="'姓名'"></v-input>
                <v-input :required="false" :name="'companyName'" v-model="formData.companyName" :placeholder="'所在企业名称'"></v-input>
                <v-input :required="false" :name="'jobName'" v-model="formData.jobName" :placeholder="'职位名称'"></v-input>
            </v-form> -->
            <div class="register-btn"><v-btn :btnName="'注册'" @click="submit"></v-btn></div>
            <div class="to-login"><span>已有账号，</span><span class="link" @click="$router.push({path:'/login'})">点击登录</span></div>
        </div>
    </div>
</div>
</template>
<script>
import btn from '../components/submitBtn'
import {getWords} from '../common/common'
import CommonService from '../services/CommonService.js'
import RegisterService from '../services/RegisterService.js'
import LoginService from '../services/LoginService.js'
import py from '../../static/js/cn2py.min.js'
import { Toast } from 'mint-ui'
import { validatPassword, validateEmail, validateCode} from '../common/validate.js'
export default {
    components:{
        'v-btn' :btn
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
        return{
            phoneValid:false,
            inputType:'password',
            commonService: new CommonService(),
            registerService: new RegisterService(),
            loginService: new LoginService(),
            showComputedNumber: false,
            computedNumber: 60,
            formData:{
               companyName:'',
               jobName:'',
               name:'',
               phone:'',
               password:'',
               code:'',
               email:'',
           },
           rules:{
               phone:[{ required: true, validator: validatePhone, trigger: 'change' }],
               password:[{ required: true, validator: validatPassword, trigger: 'change' }],
               code:[{ required: true, validator: validateCode, trigger: 'change' }],
               email:[{ required: true, validator: validateEmail, trigger: 'change' }],
           },
           systemRole:{
                OPERATION:500010,
                DEMANDER:500020,
                PROVIDER:500030
            },
            userType: {
                OPERATION:101010,
                CLIENT:101020
            },
           countryList:[
               
           ],
           addressPicker: null,
           countryPicker:null
        }
    },
    created() {
    },
    mounted() {
    },
    methods:{
        changeType() {
            if ( this.inputType=='text') {
                this.inputType = 'password';
            } else {
                this.inputType='text';
            }
        },
        async submit() {
            let valid = await this.$refs.registerForm.validate();
            if ( valid ) {
                var params = {
                        platformRole: this.systemRole.DEMANDER,
                        companyName: this.formData.companyName,
                        companyPingyin: py.mkPY(this.formData.companyName),
                        jobTitle:this.formData.jobName,
                        phone:this.formData.phone,
                        email:this.formData.email,
                        verificationCode:this.formData.code,
                        password:this.formData.password,
                        nickName: this.formData.name,
                        contactsEmail: this.formData.email,
                    }
                    let registerRes = await this.registerService.register( params );
                    if ( registerRes.code == 200 ) {
                        let loginRes = await this.loginService.login(this.formData.phone, this.formData.password);
                        if ( loginRes.code == 200 ) {
                            Toast({message: '注册并登录成功!'});
                            this.loginService.loginSuccessHandler('/index');
                        }
                    } else {
                        Toast({message: registerRes.message});
                    }
            }
        },
        getCode() {
             this.$refs.registerForm.validateField('phone', (valid) => {
                if ( !valid ) {
                    this.commonService.checkUserExist({username: this.formData.phone}).then((res) => {
                        if ( res.code == 200 ) {
                            if ( !res.data.isExist ) {
                                this.commonService.getCode({phone: this.formData.phone}).then(( respoone ) => {
                                    if ( respoone.code == 200 ) {
                                        this.showComputedNumber = true;
                                            this.timer = setInterval(() => {
                                                this.computedNumber--;
                                                if( this.computedNumber == 0 ) {
                                                    clearInterval(this.timer);
                                                    this.showComputedNumber = false;
                                                    this.computedNumber = 60;
                                                }
                                            }, 1000);
                                    }
                                })
                            } else {
                                Toast({message: '该手机号已注册'});
                            }
                        } 
                    });
                }
            }) 
        }
    }
}
</script>

<style lang="scss">
#demander-register{
    background: #f1f1f1;
    padding-top: 10px;
    .content{
        background: #fff;
        padding: 19px 0px 0 0px;
        .register-btn{
            margin-top: 30px;
            padding: 0 20px;
        }
        .code-link{
            position: absolute;
            top: 6px;
            right: 38px;
            color: #3f8def;
        }
        .to-login{
            display: flex;
            justify-content: flex-end;
            padding-right: 20px;
            height: 114px;
            span{
                font-size: 28px;
                color: #a09f9f;
                margin-top: 35px;
                &.link{
                    color: #3f8def;
                }
            }
        }
        .eyes-icon{
            display: block;
            position: absolute;
            top: 24px;
            right: 38px;
            width: 40px;
            height: 40px;
            background: #fff url(../../static/img/close-eyes-icon.png) no-repeat center center;
            background-size: 40px 40px;
        }
        .open-eyes-icon{
            background-image: url(../../static/img/open-eyes-icon.png);
        }
    }
    .mint-popup-bottom{
        width: 100%;
    }
    .popup-content{
        width: 100%;
        height: 100%;
        background: #fff;
    }
    
}
</style>

