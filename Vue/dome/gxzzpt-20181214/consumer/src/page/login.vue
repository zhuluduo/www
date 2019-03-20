<template>
  <div class="register-page">
      <div class="content">
          <div class="logo" @click="toIndex">欢迎登录</div>
          <div class="form-box">
              <div class="left">
                  <img src="../../static/img/500740040.png"  alt="">
              </div>
              <div class="right">
                  <div class="switch-box">
                      <span @click="registerType=1" class="switch-left" :class="registerType==1?'active switch-left-act':''">公司用户</span><span @click="registerType=0" :class="registerType==0?'active switch-right-act':''" class="switch-right">个人用户</span>
                  </div>
                  <div class="question" v-if="registerType==1" title="在平台任何页面又上角有“登录”链接，点击进入登录页面。登录页面分为个人用户和企业用户登录，企业用户输入企业名称、账号名、密码，点击“登录”完成登录。个人用户填写注册时使用的手机号、密码，“点击登录完成登录”。">如何登录？</div>
                  <div class="clear"></div>
                    <div class="personal" v-show="registerType==0">
                        <div class="form-title">个人用户登录</div>
                        <el-form :model="personalForm.data" :rules="personalForm.rules" ref="personalForm">
                            <el-form-item prop="username">
                                <el-input :maxlength="11" v-model="personalForm.data.username" class="phone-input" placeholder="请输入您的手机号"></el-input>
                            </el-form-item>
                             <el-form-item prop="password">
                                <el-input @keydown.native="loginByKeydown1($event)" :maxlength="20" type="password" v-model="personalForm.data.password" class="password-input" placeholder="请输入账号密码"></el-input>
                            </el-form-item>
                        </el-form>
                        <div class="form-item agreement-form"> 
                            <el-checkbox v-model="personalForm.isAgree">记住我</el-checkbox>
                        </div>
                        <div class="form-item register-form">
                            <span class="register-btn btn" @click="handlePersonalLogin">立即登录</span>
                            <span class="to-login" @click="$router.push({path: '/register'})">还没账号，立即注册</span>
                        </div>
                    </div>
                    <div class="personal" v-show="registerType==1">
                        <div class="form-title">企业用户登陆</div>
                        
                        <el-form class="login-form" :model="companyForm.data" :rules="companyForm.rules" ref="companyForm">
                            <el-form-item prop="companyId">
                                <el-autocomplete
                                    class="inline-input company-input"
                                    v-model="companyForm.data.companyName"
                                    :fetch-suggestions="querySearch"
                                    placeholder="请输入内容"
                                    :trigger-on-focus="true"
                                    @select="handleSelect"
                                ></el-autocomplete>
                            </el-form-item>
                             <el-form-item prop="username">
                                <el-input :maxlength="36" v-model="companyForm.data.username" class="account-input" placeholder="请输入登录账号"></el-input>
                            </el-form-item>
                             <el-form-item prop="password">
                                <el-input @keydown.native="loginByKeydown2($event)" :maxlength="20" type="password" v-model="companyForm.data.password" class="password-input" placeholder="请输入账号密码"></el-input>
                            </el-form-item>
                        </el-form>
                        <div class="form-item register-form">
                            <span class="register-btn btn" @click="handleCompanyLogin">立即登录</span>
                            <span class="to-login" @click="$router.push({path: '/register'})">还没账号，立即注册</span>
                        </div>

                    </div>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import {validatePhone, validateCode,validateEmail ,validatPassword} from '../lib/validate.js';
import { mapState, mapActions } from "vuex";
export default {
  data() {
       const validateCompany = (rule, value, callback) => {
            if (!value) {
                callback(new Error("请选择企业"));
            } else {
                callback();
            }
        };
      return {
          registerType: 1,
          timer: null,
          companyList:[{company_id:1, value:'aaaa', company_name:'aaaa'},{company_id:2, value: 'bbbb', company_name:'bbbb'}],
          personalForm: {
              isAgree: false,
              showCodeLink: true,
              computedNum: 60,
              data: {
                  username: '',
                  password: '',
              },
              rules:{
                  username:[
                      {validator: validatePhone,trigger: "blur"}
                  ],
                  password:[
                      { validator: validatPassword, trigger: 'blur' },
                  ],
              }
          },
          companyForm: {
              isAgree: false,
              showCodeLink: true,
              computedNum: 60,
              data: {
                  companyId: '',
                  companyName: '',
                  username: '',
                  password: '',
              },
              rules:{
                  companyName:[
                        { required: true, message: '请输入企业名称', trigger: 'change' },
                  ],
                  companyId:[{required: true,validator: validateCompany,trigger:'blur'},{required: true,validator: validateCompany,trigger:'change'}],
                  username:[
                      /* {validator: validatAaccount,trigger: "blur"} */
                      { required: true, message: '请输入账户名称', trigger: 'change' },
                  ],
                  password:[
                     { validator: validatPassword, trigger: 'blur' },
                  ],
              }
          },
      }
  },
  computed: {
    ...mapState({
      user: state => state.user
    })
  },
  created() {
      
  },
  methods: {
      inputChange( val ) {
          console.log( val );
      },
      loginByKeydown1( e ) {
          if ( e.keyCode == 13 ) {
              this.handlePersonalLogin();
          }
      },

      loginByKeydown2( e ) {
          if ( e.keyCode == 13 ) {
              this.handleCompanyLogin();
          }
      },

      ...mapActions(['setUser']),

      toIndex() {
          this.$router.push({path: '/index'});
      },

      querySearch(queryString, cb) {
          if ( !queryString ) {
              this.companyForm.data.companyId = '';
          }
          this.$http.post('/searchCompany',{keyword: queryString}).then(( res ) => {
              if ( res.data.code == 200 ) {
                  if ( 'data' in res.data ) {
                      this.companyList = res.data.data;
                      this.companyList.map(( company ) => {
                          this.$set(company, 'value', company.companyName);
                    //      this.$set(company, 'pinyin', 'ai');
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
          this.companyForm.data.companyId = item.id;
      },
      createFilter(queryString) {
          return (company) => {
              return ((company.value.indexOf(queryString) >= 0)||(company.pingyin.indexOf(queryString) >= 0));
          };
      },
      handlePersonalLogin() {
          this.$refs.personalForm.validate(( valid ) => {
              if ( valid ) {
                  var requestParams = {
                      username: this.personalForm.data.username,
                      password: this.personalForm.data.password,
                      userType: 101020,
                      companyType:160010
                  }
                  this.$http.post('/login', requestParams).then(( res ) => {
                      if ( res.data.code ==200 ) {
                        this.$message.success('登录成功');
                        localStorage.setItem('gxzzpt2_consumer', JSON.stringify(res.data.data));
                        this.setUser(res.data.data);
                        this.$router.push({path: '/index'});
                      } else {
                        //  this.$error(res.data.message,100);
                        this.$message({type:'error',message:res.data.message,duration:1000});
                      }
                  })
              } else {
                  return false;
              }
          })
      },
      handleCompanyLogin() {
          this.$refs['companyForm'].validate(( valid ) => {
              if ( valid ) {
                  var requestParams = {
                      username: this.companyForm.data.username,
                      password: this.companyForm.data.password,
                      userType: 101020,
                      companyType: 160020,
                      companyId: this.companyForm.data.companyId
                  };
                  this.$http.post('/login', requestParams).then(( res ) => {
                      if ( res.data.code ==200 ) {
                          this.$message.success('登录成功');
                           localStorage.setItem('gxzzpt2_consumer', JSON.stringify(res.data.data));
                          this.setUser(res.data.data);
                          this.$router.push({path: '/index'});
                      } else {
                         this.$message({type:'error',message:res.data.message,duration:1000});
                      }
                  })
              }
          })
      }
  },
}
</script>
<style lang="less" scoped>
.clear{
    clear: both;
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
           .left{
               width: 50%;
               height: 100%;
               display: table-cell;
               vertical-align: middle;
           }
           .right{
               width: 50%;
               height: 100%;
               background-color: #fff;
               display: table-cell;
               vertical-align: middle;
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
                       background: #f1f1f1;
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
                       background: #3f8def;
                       color: #fff;
                   }
               }
               .question{
                    float: left;
                    width: 112px;
                    height: 20px;
                    text-indent: 25px;
                    margin-top: 31px;
                    margin-left: 40px;
                    color: #ffae3b;
                    text-decoration: underline;
                    cursor: pointer;
                    background: #fff url(../../static/img/yellow-question-icon.png) no-repeat left center;
                }
               .form-title{
                   font-size: 34px;
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
                     color: #333;
                }
                .to-login{
                    margin-left: 30px;
                    color: #999999;
                    text-decoration: underline;
                    cursor: pointer;
                }
                .personal{
                    padding: 0 75px;
                   .form-title{
                        margin: 140px 0 45px 0;
                   }
                    .agreement-form{
                       margin-top: 45px;
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
                        margin: 80px 0 0 0;
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
               }
             
               .register-form{
                   margin-top: 60px;
               }
           }
       }
   } 
}
</style>
