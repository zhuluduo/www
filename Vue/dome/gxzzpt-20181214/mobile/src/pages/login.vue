<template>
<div>
    <div id="login">
        <div class="content">
            <el-form :model="formData" :rules="rules" ref="loginForm">
                <el-form-item prop="phone">
                    <el-input class="required" placeholder="账号" v-model="formData.phone"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input class="required" placeholder="密码" type="password" :maxlength="20" v-model="formData.password"></el-input>
                </el-form-item>
            </el-form>
            <div class="login-btn"><v-btn :btnName="'登录'" @click="submit"></v-btn></div>
            <div class="to-register"><span>没有账号？</span><span class="link" @click="$router.push({path:'/register/entry'})">点击注册</span></div>
        </div>
    </div>
</div>
</template>
<script>
import btn from '../components/submitBtn'
import LoginService from '../services/LoginService.js'
import CommonService from '../services/CommonService.js'
import {validatePhone, validatPassword} from '../common/validate.js'
import { Toast } from 'mint-ui'
export default {
    components:{
        'v-btn' :btn
    },
    data() {
        return{
            formData:{
                phone:'',
                password:''
            },
            rules:{
                phone:[{ required: true, message: '请输入账号', trigger: 'change' }],
                password:[{ required: true, validator: validatPassword, trigger: 'change' }]
            },
            url:'',
            loginService: new LoginService(),
            commonService: new CommonService()
        }
    },
    methods:{
        async submit() {
            let valid = await this.$refs.loginForm.validate();
            if ( valid ) {
                let loginRes = await this.loginService.login(this.formData.phone, this.formData.password);
                if ( loginRes.code == 200 ) {
                    Toast({message: '登录成功!'});
                    if ( loginRes.data.isManufacturer ) { //为制造商
                        let quoteRes = await this.commonService.isQuote();
                        if ( quoteRes.code == 200 ) { //已完善资料
                            this.loginService.loginSuccessHandler('/index');
                        } else {
                            this.loginService.loginSuccessHandler('/Guide-info');
                        }
                    } else {
                        this.loginService.loginSuccessHandler('/index');
                    }
                } else {
                    Toast({message: loginRes.message});
                }
            }
        }
    }
}
</script>
<style lang="scss">
body{
    background-color: #f1f1f1;
}
#login{
    background: #f1f1f1;
//    margin-top: 10px;
    padding-top: 10px;
    .content{
        background: #fff;
        padding: 19px 0px 0 0px;
        .login-btn{
            margin-top: 39px;
            padding: 0 20px;
        }
        .to-register{
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            span{
                font-size: 28px;
                color: #a09f9f;
                &.link{
                    color: #3f8def;
                }
            }
        }
    }
}
</style>

