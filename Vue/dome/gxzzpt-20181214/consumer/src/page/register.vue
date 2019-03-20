<template>
  <div class="register-page">
      <div class="content">
          <div class="logo" @click="$router.push({path: '/index'});">欢迎注册</div>
          <div class="form-box">
              <div class="left">
                  <img src="../../static/img/500740040.png" alt="">
              </div>
              <div class="right">
                  <div class="switch-box">
                      <span @click="registerType=1" class="switch-left" :class="registerType==1?'active switch-left-act':''">公司用户</span><span @click="registerType=0" :class="registerType==0?'active switch-right-act':''" class="switch-right">个人用户</span>
                  </div>
                  <div class="question" title="企业用户是以企业为主体进行注册的用户，平台对企业提交的资料进行严格审核。企业用户可以在平台发布需求，也可以在升级为供应商后在平台接单。而个人用户目前仅可作为需求方，不可以升级为供应商。">企业用户和个人用户有什么区别？</div>
                  <div class="clear"></div>
                    <div class="personal" v-show="registerType==0">
                        <div class="form-title">注册成为个人用户</div>
                        <el-form :model="personalForm.data" :rules="personalForm.rules" ref="personalForm">
                            <el-form-item prop="username">
                                <el-input :maxlength="11" v-model="personalForm.data.username" class="phone-input" placeholder="请输入您的手机号"></el-input>
                                <div class="def-error-message" v-show="personalForm.showErrMessage1">请输入正确的手机号</div>
                            </el-form-item>
                             <el-form-item prop="verificationCode">
                                <el-input :maxlength="4"  v-model="personalForm.data.verificationCode" class="code-input" placeholder="请输入您的验证码"></el-input>
                                <span class="code-link" @click="getCode" v-show="personalForm.showCodeLink">获取验证码</span><span class="count-down" v-show="!personalForm.showCodeLink">({{personalForm.computedNum}}s)</span>
                            </el-form-item>
                             <el-form-item prop="password">
                                <el-input :maxlength="20" type="password" v-model="personalForm.data.password" class="password-input" placeholder="请输入账号密码"></el-input>
                            </el-form-item>
                        </el-form>
                        <div class="form-item agreement-form">
                            <el-checkbox v-model="personalForm.isAgree">我已阅读并同意<router-link :to="{path:'contract'}" target="_blank"><span class="agreement-link">《共享制造平台用户协议》</span></router-link></el-checkbox>
                        </div>
                        <div class="form-item register-form">
                            <span class="register-btn btn" :class="personalForm.isAgree?'':'btn-disabled'" @click="registerPersonal">立即注册</span>
                            <span class="to-login" @click="$router.push({path: '/login'})">已有账号，马上去登录</span>
                        </div>
                    </div>
                    <div class="company" v-show="registerType==1">
                        <div class="form-title">注册成为企业用户</div>
                        <el-form v-show="showStepOne" :model="stepOneForm.data" :rules="stepOneForm.rules" ref="stepOneForm">
                           <!--  <el-form-item label="企业全称：" label-position="left" label-width="85px" prop="companyName">
                                <el-input v-model="stepOneForm.data.companyName"></el-input>
                            </el-form-item> -->
                             <el-form-item label="登陆账号：" label-position="left" label-width="85px" prop="username">
                                <el-input :maxlength="36" v-model="stepOneForm.data.username" placeholder="4-36位的数字、字母、符号（-_.@）"></el-input>
                            </el-form-item>
                             <el-form-item  label="密码：" label-position="left" label-width="56px" prop="password">
                                <el-input :maxlength="20" v-model="stepOneForm.data.password" type="password" placeholder="6-20位的数字、字母、符号"></el-input>
                            </el-form-item>
                             <el-form-item  label="确认密码：" label-position="left" label-width="85px" prop="checkPassword">
                                <el-input :maxlength="20" v-model="stepOneForm.data.checkPassword" type="password" placeholder="6-20位的数字、字母、符号"></el-input>
                                <div class="def-error-message" v-show="stepOneForm.showErrMessage">密码不一致</div>
                            </el-form-item>
                            <div class="form-item agreement-form">
                            <el-checkbox v-model="stepOneForm.isAgree">我已阅读并同意<router-link :to="{path:'contract'}" target="_blank"><span class="agreement-link">《共享制造平台用户协议》</span></router-link></el-checkbox>
                            </div>
                            <div class="form-item register-form">
                                <span class="btn reset-btn" @click="resetStepOneForm">重置</span> <span class="register-btn btn" :class="stepOneForm.isAgree?'':'btn-disabled'" @click="handleNextOne">下一步</span>
                            </div>
                            <div class="to-login" @click="$router.push({path: '/login'})">已有账号，马上去登录</div>
                        </el-form>

                        <el-form v-show="showStepTwo" :model="stepTwoForm.data" :rules="stepTwoForm.rules" ref="stepTwoForm">
                            <el-form-item label="企业全称：" label-position="left" label-width="85px" prop="companyName">
                                <el-input :maxlength="100" v-model="stepTwoForm.data.companyName"></el-input>
                            </el-form-item>
                            <el-form-item label="企业注册号：" label-position="left" label-width="100px" prop="businessCode">
                                <el-input :maxlength="20" v-model="stepTwoForm.data.businessCode"></el-input>
                            </el-form-item>
                           <!--  <el-form-item label="所属行业：" prop="industryId" label-width="85px" label-position="left">
                                <el-select v-model="stepTwoForm.data.industryId">
                                    <el-option-group v-for="group in industryList" :label="group.industryCatalogName" :key="group.id">
                                        <el-option :label="item.industryName" :key="item.id" v-for="item in group.industryList" :value="item.id"></el-option>
                                    </el-option-group>
                                </el-select>
                            </el-form-item> -->
                            <!--   <el-form-item label="所在行业：" label-position="left" label-width="85px" prop="industryId">
                                 <el-select v-model="stepTwoForm.data.industryId">
                                     <el-option
                                        v-for="item in industryList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id"></el-option>
                                </el-select>
                            </el-form-item> -->
                             <el-form-item label="联系人：" label-position="left" label-width="68px" prop="contacts">
                                <el-input :maxlength="20" v-model="stepTwoForm.data.contacts"></el-input>
                            </el-form-item>
                             <el-form-item label="电话：" label-position="left" label-width="54px" prop="mobile">
                                <el-input :maxlength="11" v-model="stepTwoForm.data.mobile"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱：" label-position="left" label-width="54px" prop="email">
                                <!-- <el-input :maxlength="100" v-model="stepTwoForm.data.email"></el-input> -->
                                  <el-autocomplete
                                    class="inline-input"
                                    v-model="stepTwoForm.data.email"
                                    :fetch-suggestions="querySearch"
                                    placeholder="请输入邮箱"
                                    :trigger-on-focus="false"
                                    ></el-autocomplete>
                            </el-form-item>
                            <div class="form-item register-form">
                                <span class="btn reset-btn" @click="resetStepTwoForm">重置</span> <span class="register-btn btn" @click="registerCompany">完成注册</span>
                            </div>
                        </el-form>
                    </div>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import { validateCode, validatAaccount, validateEmail ,validatPassword,EmailAuto} from '../lib/validate.js';
import { mapState, mapActions } from 'vuex';
export default {
  data() {
      const validatePhone = (rule, value, callback) => {
        this.personalForm.showErrMessage1 = false;
        var req = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
        if (!req.test(value)) {
            callback(new Error("请输入正确的手机号"));
        } else {
            callback();
        }
      };
      return {
          registerType: 1,
          timer: null,
          industryList:[],
          personalForm: {
              showErrMessage1: false,
              isAgree: false,
              showCodeLink: true,
              computedNum: 60,
              data: {
                  username: '',
                  password: '',
                  verificationCode: ''
              },
              rules:{
                  username:[
                      {validator: validatePhone,trigger: "blur"}
                  ],
                  password:[
                      { validator: validatPassword, trigger: 'blur' },
                  ],
                  verificationCode:[
                       {validator: validateCode,trigger: "blur"}
                  ]
              }
          },
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
                  industryId:''
              },
              rules:{
                   companyName:[
                        { required: true, message: '请输入企业名称', trigger: 'blur' },
                   ],
                  companyCatalog: [
                      { required: true, message: '请选择企业类型', trigger: 'blur' },
                  ],
                /*   industryId: [
                      { required: true, message: '请选择所在行业', trigger: 'change' },
                  ], */
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
          showStepOne: true,
          showStepTwo: false,
      }
  },
  computed: {
      showStepThr: function() {
          return (!this.showStepOne && ! this.showStepTwo) ? true : false;
      }
  },
  created() {
   //   this.getWords();
      this.getIndustryList();
  },
  methods: {
/*     getWords(){
        var wordsStr = localStorage.getItem("words");
        var words = JSON.parse(wordsStr);
        this.companyTypeList = words[124].item;
    }, */

    ...mapActions(['setUser']),

      getIndustryList() {
          this.$http.post('/custom/industryCatalog/all').then((res) => {
              if ( res.data.code == 200 ) {
                  this.industryList = res.data.data;
              }
          })
      },
      getCode() {
            var req = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
            if ( req.test( this.personalForm.data.username ) ) {
                this.$http.post( '/sendSmsCode', {phone: this.personalForm.data.username} ).then(( res ) => {
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
                this.personalForm.showErrMessage1 = true;
            }
       } ,
        resetStepOneForm() {
            this.$refs['stepOneForm'].resetFields();
        },
        resetStepTwoForm() {
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
        openFileDlg() {
            this.$refs.businessFile.click();
        },
        hanleBusinessFileChange( e ) {
            var file = e.target.files[0];
            var data = new FormData();
            data.append('file', file);
             this.$upload.post('http://dw.tatfookcloud.com/upload', data).then(res => {
                if ( res.data.code == 200 ) {
                    this.stepTwoForm.data.businessUrl = res.data.data.img_url;
                }
            });
        },
        handleNextTwo() {
            this.$refs['stepTwoForm'].validate(( valid ) => {
                if ( valid ) {
                    this.showStepOne = false;
                    this.showStepTwo = false;
                } else {
                    return false;
                }
            })
        },
        handlePrevThr() {
            this.showStepOne = false;
            this.showStepTwo = true;
        },
        handlePrevTwo() {
             this.showStepOne = true;
            this.showStepTwo = false;
        },

        login( params, type ) {
            this.$http.post('/login', params ).then(( res ) => {
                if ( res.data.code == 200 ) {
                    localStorage.setItem('gxzzpt2_consumer', JSON.stringify(res.data.data));
                    this.setUser(res.data.data);
                    if ( type == 0 ) {
                        this.$router.push({path:'/usercenter/account-settings'});
                    } else {
                        this.$router.push({path:'/register/success', query:{companyName:res.data.data.companyName,username:res.data.data.username}});
                    }
                }
            })
        },

        registerPersonal() {
            if ( this.personalForm.isAgree ) {
                this.$refs['personalForm'].validate(( valid ) => {
                    if ( valid ) {
                        var requestParams = {
                            username: this.personalForm.data.username,
                            password: this.personalForm.data.password,
                            verificationCode: this.personalForm.data.verificationCode,
                            companyType: 160010,
                        }
                        this.$http.post('/custom/user/register', requestParams).then(( res ) => {
                            if ( res.data.code == 200 ) {
                                this.$message.success('注册成功！');
                                /* this.$refs['personalForm'].resetFields();
                                 setTimeout(() => {
                                    this.$router.push({path:'/login'});
                                }, 1000); */
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
                            /* this.$refs['stepOneForm'].resetFields();
                            this.$refs['stepTwoForm'].resetFields();
                            setTimeout(() => {
                                this.$router.push({path:'/login'});
                            }, 1000); */
                            var loginParams = {
                                username: requestParams.username,
                                password: requestParams.password,
                                userType: 101020,
                                companyType:requestParams.companyType,
                                companyId: res.data.data.companyId
                            }
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
   },
}
</script>
<style lang="less" scoped>
.clear{
    clear: both;
}
.btn-disabled{
    opacity: 0.3;
    cursor: not-allowed !important;
}
.def-error-message{
    position: absolute;
    top: 32px;
    left: 32px;
    color: #f56c6c;
    font-size: 12px;
}
.register-page{
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    min-height: 923px;
    background: url(../../static/img/bg.png);
   .content{
       width: 1200px;
       height: 890px;
       margin: 0 auto;
       .logo{
           height: 60px;
           font-size: 30px;
           color: #3f8def;
           line-height: 60px;
           text-indent: 230px;
           background-image: url(../../static/img/logo.png);
           background-size: 205px 38px;
           background-repeat: no-repeat;
           background-position: 0 6px;
           margin-top: 34px;
           cursor: pointer;
       }
       .form-box{
           height: 822px;
           display: flex;
           box-shadow: 2px 2px 18px rgba(0,0,0,.14);
           .left{
               width: 50%;
               height: 100%;
           }
           .right{
               width: 50%;
               height: 100%;
               background-color: #fff;
               .switch-box{
                   width: 270px;
                   float: right;
                   margin-top: 20px;
                   span{
                       display: inline-block;
                       width: 125px;
                       height: 38px;
                       text-align: center;
                       line-height: 38px;
                       font-size: 14px;
                       background: #e6e6e6;
                       cursor: pointer;
                   }
                   .switch-left{
                       position: relative;
                       border-top-left-radius: 20px;
                       border-bottom-left-radius: 20px;
                   }
                    .switch-left-act{
                       &::after{
                            content: '';
                            position: absolute;
                            left: 0;
                            z-index: 100;
                            width: 125px;
                            height: 38px;
                             border-top-left-radius: 20px;
                            border-bottom-left-radius: 20px;
                            box-sizing: border-box;
                             box-shadow: 2px 0 5px rgba(0,0,0,.27);
                       }
                   }
                   .switch-right{
                       position: relative;
                       border-top-right-radius: 20px;
                       border-bottom-right-radius: 20px;
                   }
                    .switch-right-act{
                        position: relative;
                       &::after{
                            content: '';
                            position: absolute;
                            left: 0;
                            z-index: 100;
                            width: 125px;
                            height: 38px;
                             border-top-right-radius: 20px;
                            border-bottom-right-radius: 20px;
                            box-sizing: border-box;
                            box-shadow: -2px 0 5px rgba(0,0,0,.27);
                       }
                   }
                   .active{
                       background: #4591f0;
                       color: #fff;
                   }
               }
               .form-title{
                   font-size: 34px;
               }
                .question{
                    float: left;
                    width: 250px;
                    height: 20px;
                    text-indent: 25px;
                    margin-top: 31px;
                    margin-left: 40px;
                    color: #ffae3b;
                    text-decoration: underline;
                    cursor: pointer;
                    background: #fff url(../../static/img/yellow-question-icon.png) no-repeat left center;
                }
                .btn{
                    display: inline-block;
                    width: 195px;
                    height: 48px;
                    border-radius: 25px;
                    text-align: center;
                    line-height: 48px;
                    font-size: 20px;
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
                .to-login{
                    margin-left: 30px;
                    color: #999999;
                    text-decoration: underline;
                    cursor: pointer;
                }
                .agreement-link:hover{
                    color: #3f8def;
                    text-decoration: underline;
                }
                .personal{
                    padding: 0 60px;
                   .form-title{
                        margin: 92px 0 45px 0;
                   }
                    .agreement-form{
                       margin-top: 35px;
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
               }
               .company{
                   padding: 0 75px;
                   .form-title{
                        margin: 90px 0 34px 0;
                   }
                   .step{
                       display: flex;
                       align-items: center;
                       margin: 56px 0 54px 0;
                       .step-item{
                           width: 10px;
                           height: 10px;
                           border-radius: 50%;
                           background: #dbdbdb;
                       }
                       .beautiful-line{
                           width: 190px;
                           border-bottom: 2px solid #dbdbdb;
                           margin: 0 10px;
                       }
                       .stepActive{
                           background: #3f8def;
                           border-color: #3f8def;
                       }
                   }
                   .agreement-form{
                       margin-top: 45px;
                   }
                   .to-login{
                       text-align: center;
                       margin: 30px 0;
                   }
                    .register-form{
                        display: flex;
                        justify-content: space-between;
                        margin-top: 70px;
                    }
                    .input-link{
                        position: absolute;
                        top: 0;
                        height: 32px;
                        width: 50px;
                        right: -1px;
                        color: #3f8def;
                        text-align: center;
                        cursor: pointer;
                        background: #fff;
                   }
               }

               .register-form{
                   margin-top: 75px;
               }
           }
       }
   }
}
</style>
