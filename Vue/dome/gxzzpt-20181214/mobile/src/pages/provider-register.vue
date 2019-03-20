<template>
<div>
    <div id="provider-register">
        <div class="content">
            <el-form :model="formData" :rules="rules" ref="registerForm">
                <el-form-item prop="companyName">
                    <el-input class="required" v-model="formData.companyName" placeholder="企业法定名称"></el-input>
                </el-form-item>
                <el-form-item prop="companyShortName">
                    <el-input class="required" v-model="formData.companyShortName" placeholder="企业简称"></el-input>
                </el-form-item>
                <el-form-item prop="contactName">
                    <el-input class="required" v-model="formData.contactName" placeholder="联系人名称"></el-input>
                </el-form-item>
                <el-form-item prop="phone">
                    <el-input class="required" v-model="formData.phone" placeholder="手机号"></el-input>
                    <span v-show="!showComputedNumber&&phoneValid" class="code-link" @click="getCode">获取验证码</span>
                    <span v-show="showComputedNumber&&phoneValid" class="code-link">{{computedNumber}}s</span>
                </el-form-item>
                <el-form-item prop="code">
                    <el-input class="required" v-model="formData.code" placeholder="手机验证码"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input class="required" v-model="formData.email" placeholder="电子邮箱地址"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input class="required" type="password" v-model="formData.password" placeholder="密码"></el-input>
                    <i class="eyes-icon" :class="{'open-eyes-icon':inputType=='text'}" @click="changeType"></i>
                </el-form-item>
                <el-form-item prop="country">
                    <el-input :readonly="'readonly'" @click.native="showCountryPicker" class="required" v-model="formData.country" placeholder="国家"></el-input>
                </el-form-item>
                <el-form-item prop="area" v-if="formData.countryId==350000">
                    <el-input :readonly="'readonly'" @click.native="showAreaPicker" class="required" v-model="formData.area" placeholder="省/市/区"></el-input>
                </el-form-item>
            </el-form>
            <div class="register-btn"><v-btn :btnName="'注册'" @click="submit"></v-btn></div>
            <div class="to-login"><span>已有账号，</span><span class="link" @click="$router.push({path:'/login'})">点击登录</span></div>
        </div>
        <vue-pickers
            :show="countryPicker.show"
            :columns="countryPicker.columns"
            :selectData="countryPicker.data"
            @cancel="closeCountryPicker"
            @confirm="countryPickerConfirmHandler"></vue-pickers>
        <vue-pickers
            :show="areaPicker.show"
            :link="areaPicker.link"
            :columns="areaPicker.columns"
            :selectData="areaPicker.data"
            @cancel="closeAreaPicker"
            @confirm="areaPickerConfirmHandler">
        </vue-pickers>
    </div>
</div>
</template>
<script>
import btn from '../components/submitBtn'
import {getWords} from '../common/common'
import { provinceList, cityList, areaList } from '../data/area'
import CommonService from '../services/CommonService.js'
import RegisterService from '../services/RegisterService.js'
import LoginService from '../services/LoginService.js'
import py from '../../static/js/cn2py.min.js'
import { Toast } from 'mint-ui'
import vuePickers from 'vue-pickers'
import { validatPassword, validateEmail, validateCode} from '../common/validate.js'
export default {
    components:{
        'v-btn' :btn,
        vuePickers
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
            areaPicker:{
                show:false,
                link:true,
                columns:3,
                data:{
                    data1:provinceList,
                    data2:cityList,
                    data3:areaList
                }
            },
            countryPicker:{
                show:false,
                link:true,
                columns:1,
                data:{
                    data1:[],
                }
            },
            commonService: new CommonService(),
            registerService: new RegisterService(),
            loginService: new LoginService(),
            showComputedNumber: false,
            computedNumber: 60,
            formData:{
               companyName:'',
               companyShortName:'',
               contactName:'',
               phone:'',
               password:'',
               code:'',
               email:'',
               country:'中国',
               countryId:350000,
               area:'',
               areaList:[]
           },
           rules:{
               companyName:[{ required: true, message: '请输入企业名称', trigger: 'change' }],
               companyShortName:[{ required: true, message: '请输入企业简称', trigger: 'change' }],
               contactName:[{ required: true, message: '请输入联系人', trigger: 'change' }],
               phone:[{ required: true, validator: validatePhone, trigger: 'change' }],
               password:[{ required: true, validator: validatPassword, trigger: 'change' }],
               code:[{ required: true, validator: validateCode, trigger: 'change' }],
               email:[{ required: true, validator: validateEmail, trigger: 'change' }],
               country:[{ required: true, message: '请选择国家', trigger: 'change' }],
               area:[{ required: true, message: '请选择省/市/区', trigger: 'change' }],
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
        }
    },
    created() {
        this.countryPicker.data.data1 = this.countryListHandler();
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
        showCountryPicker() {
            this.countryPicker.show = true;
            this.areaPicker.show = false;
        },
        closeCountryPicker() {
            this.countryPicker.show = false;
        },
        countryPickerConfirmHandler(val) {
            this.formData.country = val.select1.text;
            this.formData.countryId = val.select1.value;
            this.countryPicker.show = false;
        },
        closeAreaPicker() {
            this.areaPicker.show = false;
        },
        showAreaPicker() {
            this.areaPicker.show = true;
            this.countryPicker.show = false;
        },
        areaPickerConfirmHandler(val) {
            this.formData.area = `${val.select1.text}/${val.select2.text}/${val.select3.text}`;
            this.formData.areaList = [val.select1.text,val.select2.text,val.select3.text];
            this.areaPicker.show = false;
        },
        async submit() {
            let valid = await this.$refs.registerForm.validate();
            if ( valid ) {
                var params = {
                        platformRole: this.systemRole.PROVIDER,
                        companyName: this.formData.companyName,
                        companyPingyin: py.mkPY(this.formData.companyName),
                        companyShortName:this.formData.companyName,
                        phone:this.formData.phone,
                        email:this.formData.email,
                        verificationCode:this.formData.code,
                        password:this.formData.password,
                        country:this.formData.countryId,
                        province: this.formData.areaList[0],
                        city:this.formData.areaList[1],
                        region: this.formData.areaList[2],
                    }
                    let registerRes = await this.registerService.register( params );
                    if ( registerRes.code == 200 ) {
                        let loginRes = await this.loginService.login(this.formData.phone, this.formData.password);
                        if ( loginRes.code == 200 ) {
                            Toast({message: '注册并登录成功!'});
                            this.loginService.loginSuccessHandler('/Guide-info');
                        }
                    } else {
                        Toast({message: registerRes.message});
                    }
            } 
        },
        countryListHandler() {
            let list = getWords(142);
            list.map(( item ) => {
                this.$set(item,'text',item.name);
                this.$set(item,'value',item.id);
            })
            return list;
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
#provider-register{
    background: #f1f1f1;
    padding-top: 10px;
    .content{
        background: #fff;
        padding: 19px 0 0 0;
        .register-btn{
            padding: 0 20px;
            margin-top: 30px;
        }
        .code-link{
            position: absolute;
            top: 6px;
            right: 38px;
            color: #3f8def;
            font-size: 28px;
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

