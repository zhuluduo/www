<template>
    <div id="login-popup" v-show="showPopup">
        <div class="mask-layer"></div>
        <div class="content-box">
            <i class="el-icon-close" @click="closePopup"></i>
            <div class="title">登录</div>
            <div class="form-box">
                <el-form :model="form" :rules="rules" ref="loginForm">
                    <el-form-item class="account-form-item" prop="username">
                        <el-autocomplete placeholder="请输入登录邮箱或手机号"
                            v-model="form.username"
                            :fetch-suggestions="emailInputHandler"
                            :trigger-on-focus="true"
                        ></el-autocomplete>
                        <!-- <el-input v-model="form.username" ></el-input> -->
                    </el-form-item>
                    <el-form-item class="password-form-item" prop="password">
                        <input type="password" name="pw" style="display: none"/>
                        <el-input @keydown.native="loginByKeydown" type="password" v-model="form.password" placeholder="请输入密码"></el-input>
                        <!-- <el-input @keydown.native="loginByKeydown" type="text" onfocus="this.type='password'" v-model="form.password" placeholder="请输入密码"></el-input> -->
                    </el-form-item>
                </el-form>
                <div class="link" @click='gotoRetrive'>忘记密码？ 点击找回</div>
                <el-button type="primary" size="medium" @click="handlePersonalLogin">登录</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import {validatePhone,validateEmail ,validatPassword, EmailAuto} from '../../lib/validate.js';
import {store} from './../../vuex/store.js';
import { mapState, mapActions } from 'vuex';
import router from './../../router/routes';
export default {
    store:store,
    router,
    data() {
        const validateAccount = (rule, value, callback) => {
            if (!value) {
                    callback(new Error("请输入账号"));
            } else {
                callback();
            }
        };
        return {
            showPopup: true,
            callbackfun: null,
            form: {
                username: '',
                password: '',
            },
            rules:{
                username:[
                    { validator: validateAccount,trigger: 'blur' },
                    { validator: validateAccount,trigger: 'change' }
                ],
                password:[
                    { validator: validatPassword, trigger: 'blur' },
                ],
            },
            userType: {
                OPERATION:101010,
                CLIENT:101020
            },
            toIndexRouterArray:['/register/entry','/register/provider','/register/demander']
        }

    },
    created() {
        
    },
    methods: {
        ...mapActions(['setUser']),

        emailInputHandler( inputString, cb ) {
            EmailAuto(inputString,cb)
        },
        gotoRetrive(){
            this.$router.push({path:'/RetrievePassword'});
            this.closePopup();
        },
        closePopup() {
            this.showPopup = false;
            this.$el.parentNode.removeChild(this.$el);
        },

        /* --------个人登陆---------------- */

        loginByKeydown( event ) {
            if (event.keyCode == 13 ) {
                this.handlePersonalLogin();
            }
        },

        handlePersonalLogin() {
          this.$refs.loginForm.validate(( valid ) => {
                if ( valid ) {
                    var requestParams = {
                        username: this.form.username.trim(),
                        password: this.form.password.trim(),
                        userType: this.userType.CLIENT
                    }
                    this.$http.post('/login', requestParams).then(( res ) => {
                        if ( res.data.code ==200 ) {
                            this.$success('登录成功');
                            localStorage.setItem('gxzzpt2_consumer', JSON.stringify(res.data.data));
                            this.setUser(res.data.data);
                            if ( typeof this.callbackfun === 'function' ) {
                                this.callbackfun();
                            }
                            this.closePopup();
                            if (this.toIndexRouterArray.indexOf(this.$route.path) >= 0 ) {
                                setTimeout(() => {
                                    this.$router.push({path:'/index'});
                                }, 600);
                            }
                        } else {
                            this.$message({type:'error',message:res.data.message,duration:1000});
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
#login-popup{
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
        top: 0;
        bottom: 0;
        height: 274px;
        margin: auto;
        z-index: 1003;
        width: 416px;
        box-sizing: border-box;
        background: #fff;
        .el-icon-close{
            float: right;
            font-size: 18px;
            font-weight: 700;
            color: #c3c3c3;
            margin: 10px 10px 0 0;
            cursor: pointer;
        }
        .title{
            height: 20px;
            font-size: 20px;
            line-height: 20px;
            text-align: center;
            margin: 23px 0 18px 0;
        }
        .form-box{
            padding: 0 30px;
            .el-input__inner{
                height: 36px;
            }
            .account-form-item{
                margin-bottom: 18px;
            }
            .password-form-item{
                margin-bottom: 10px;
            }
            .link{
                text-align: right;
                color: #3f8def;
                text-decoration: underline;
                cursor: pointer;
            }
            .el-button{
                display: block;
                width: 100%;
                margin-top: 24px;
                span{
                    font-size: 16px;
                }
            }
        }
    }
}
</style>
