<template>
    <div id="login-popup" v-show="showPopup">
        <div class="mask-layer"></div>
        <div class="content-box">
            <img src="../../static/img/close-icon.png" class="close-btn" @click="closePopup" alt="">
            <div class="switch-box">
                <span class="switch-left" @click="loginType=1" :class="loginType==1?'active':''">企业用户</span><span @click="loginType=0" :class="loginType==0?'active':''" class="switch-right">个人用户</span>
            </div>
            <div class="question" v-if="loginType==1" title="在平台任何页面又上角有“登录”链接，点击进入登录页面。登录页面分为个人用户和企业用户登录，企业用户输入企业名称、账号名、密码，点击“登录”完成登录。个人用户填写注册时使用的手机号、密码，“点击登录完成登录”。">如何登录？</div>
            <div class="content personal" v-show="loginType==0">
                <div class="clearfix"></div>
                <div class="title">个人用户登录</div>
                <el-form :model="personalForm" :rules="personalRules" ref="personalForm">
                    <el-form-item prop="username">
                        <el-input :maxlength="11" v-model="personalForm.username" class="phone-input" placeholder="请输入您的手机号"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input @keydown.native="personalLoginByKeydown($event)" :maxlength="20" type="password" v-model="personalForm.password" class="password-input" placeholder="请输入账号密码"></el-input>
                    </el-form-item>
                </el-form>
                <div class="remember-me"> 
                    <el-checkbox v-model="personalForm.isAgree">记住我</el-checkbox>
                </div>
                <div class="login-btn-box">
                    <span class="login-btn btn" @click="handlePersonalLogin">立即登录</span>
                    <span class="remark" @click="toRegister">还没账号，立即注册</span>
                </div>
            </div>
            <div class="content company" v-show="loginType==1">
                <div class="clearfix"></div>
                <div class="title" style="margin-bottom:28px;">企业用户登录</div>
                <el-form :model="companyForm" :rules="companyRules" ref="companyForm">
                    <el-form-item prop="companyId">
                        <el-autocomplete
                            class="inline-input company-input"
                            v-model="companyForm.companyName"
                            :fetch-suggestions="querySearch"
                            placeholder="请输入内容"
                            :trigger-on-focus="true"
                            @select="handleSelect"
                        ></el-autocomplete>
                    </el-form-item>
                        <el-form-item prop="username">
                        <el-input :maxlength="36" v-model="companyForm.username" class="account-input" placeholder="请输入登录账号"></el-input>
                    </el-form-item>
                        <el-form-item prop="password">
                        <el-input @keydown.native="companyLoginByKeydown($event)" :maxlength="20" type="password" v-model="companyForm.password" class="password-input" placeholder="请输入账号密码"></el-input>
                    </el-form-item>
                </el-form>
                <div class="login-btn-box company-login-box">
                    <span class="login-btn btn" @click="handleCompanyLogin">立即登录</span>
                    <span class="remark" @click="toRegister">还没账号，立即注册</span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {validatePhone, validatAaccount, validateCode,validateEmail ,validatPassword} from '../lib/validate.js';
import {store} from './../vuex/store.js';
import { mapState, mapActions } from 'vuex';
export default {
    store:store,
    data() {
        const validateCompany = (rule, value, callback) => {
            if (!value) {
                callback(new Error("请选择企业"));
            } else {
                callback();
            }
        };
        return {
            showPopup: true,
            loginType: 1,//登录类型 0个人 1公司,
            callbackfun: null,
            companyList:[],
            personalForm: {
                isAgree: false,
                username: '',
                password: ''
            },
            personalRules: {
                username:[
                    {validator: validatePhone, trigger: 'blur'}
                ],
                password:[
                    { validator: validatPassword, trigger: 'blur' },
                ],
            },
            companyForm: {
                companyId: '',
                companyName: '',
                username: '',
                password: '',
            },
            companyRules:{
                companyName:[
                    { required: true, message: '请输入企业名称', trigger: 'change' },
                ],
                companyId:[{required: true,validator: validateCompany,trigger:'blur'}, {required: true,validator: validateCompany,trigger:'change'}],
                username:[
                     {validator: validatAaccount,trigger: 'blur'}
                    // { required: true, message: '请输入账户名称', trigger: 'change' },
                ],
                password:[
                    { validator: validatPassword, trigger: 'blur' },
                ],
              }
        }

    },
    created() {
        
    },
    methods: {
        ...mapActions(['setUser']),

        closePopup() {
            this.showPopup = false;
            this.$el.parentNode.removeChild(this.$el);
        },

        /* --------个人登陆---------------- */

        personalLoginByKeydown( event ) {
            if (event.keyCode == 13 ) {
                this.handlePersonalLogin();
            }
        },
        handlePersonalLogin() {
          this.$refs.personalForm.validate(( valid ) => {
                if ( valid ) {
                    var requestParams = {
                        username: this.personalForm.username,
                        password: this.personalForm.password,
                        userType: 101020,
                        companyType:160010
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
                        } else {
                            this.$message({type:'error',message:res.data.message,duration:1000});
                        }
                    })
                } else {
                    return false;
                }
            })
        },

        toRegister() {
            this.closePopup();
            this.$register({}, this.callbackfun);
        },

        /* ---------公司登陆--------------- */
        companyLoginByKeydown( event ) {
            if (event.keyCode == 13 ) {
                this.handleCompanyLogin();
            }
        },
        handleCompanyLogin() {
            this.$refs['companyForm'].validate(( valid ) => {
                if ( valid ) {
                    var requestParams = {
                        username: this.companyForm.username,
                        password: this.companyForm.password,
                        userType: 101020,
                        companyType: 160020,
                        companyId: this.companyForm.companyId
                    };
                    this.$http.post('/login', requestParams).then(( res ) => {
                        if ( res.data.code ==200 ) {
                            this.$success('登录成功');
                            localStorage.setItem('gxzzpt2_consumer', JSON.stringify(res.data.data));
                            this.setUser(res.data.data);
                            if ( typeof this.callbackfun === 'function' ) {
                                this.callbackfun();
                            }
                            this.closePopup();

                        } else {
                            this.$message({type:'error',message:res.data.message,duration:1000});
                        }
                    })
                }
            })
      },
        querySearch(queryString, cb) {
          if ( !queryString ) {
              this.companyForm.companyId = '';
          }
          this.$http.post('/searchCompany',{keyword: queryString}).then(( res ) => {
              if ( res.data.code == 200 ) {
                  if ( 'data' in res.data ) {
                      this.companyList = res.data.data;
                      this.companyList.map(( company ) => {
                          this.$set(company, 'value', company.companyName);
                      })
                  } else {
                      this.companyLis = [];
                  }
                  var companyList = this.companyList;
                  var results = queryString ? companyList.filter(this.createFilter(queryString)) : companyList;
                  // 调用 callback 返回建议列表的数据
                  cb(results);
              } else {
                  this.companyList = [];
                  var companyList = this.companyList;
                  var results = queryString ? companyList.filter(this.createFilter(queryString)) : companyList;
                  // 调用 callback 返回建议列表的数据
                  cb(results);
              }
          })
      },
      handleSelect( item ) {
          this.companyForm.companyId = item.id;
      },
      createFilter(queryString) {
          return (company) => {
              return ((company.value.indexOf(queryString) >= 0)||(company.pingyin.indexOf(queryString) >= 0));
          };
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
        height: 418px;
        margin: auto;
        z-index: 1003;
        width: 540px;
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
            width: 112px;
            height: 20px;
            text-indent: 25px;
            margin-top: 21px;
            color: #ffae3b;
            text-decoration: underline;
            cursor: pointer;
            background: #fff url(../../static/img/yellow-question-icon.png) no-repeat left center;
        }
        .content{
            padding: 67px 55px 55px 55px;
            .title{
                height: 24px;
                line-height: 24px;
                font-size: 24px;
                margin-bottom: 37px;
                color: #333333;
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
            .el-form-item.is-success .el-input__inner{
                border-bottom: 1px solid #777778 !important;
            }
            .el-form-item {
                position: relative;
                margin-bottom: 24px;
            }
            .el-form-item__error {
            //    top: 75%;
                left: 32px;
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
            .account-input {
                &:before {
                    .background-base-style;
                    background-image: url(../../static/img/account-icon.png);
                }
            }
            .company-input {
                &:before {
                    .background-base-style;
                    background-image: url(../../static/img/company-icon.png);
                }
            }
            .login-btn-box{
                margin-top: 47px;
                .btn{
                    display: inline-block;
                    width: 155px;
                    height: 42px;
                    border-radius: 21px;
                    text-align: center;
                    line-height: 42px;
                    font-size: 20px;
                    color: #fff;
                    cursor: pointer;
                }
                .login-btn{
                    background: #3f8def;
                }
                .remark{
                    margin-left: 30px;
                    color: #999999;
                    text-decoration: underline;
                    cursor: pointer;
                }
            }
            .company-login-box{
                margin-top: 35px;
            }
        }
    }
}
</style>
