<template>
        <div class="login-2018">
            <div class="login-topbar">
                <el-col :span="24" class="login-topbar-logo">
                   <span>街坊店宝 - 权限系统</span>
                </el-col>
            </div>
            <div class="login-body">
                 <el-col :sm="24" :md="14"  class="login-body-box">
                     <el-col  :md="10"  class="login-body-img-box">
                            <img src="../assets/images/login_img.png" alt="">
                     </el-col>
                     <el-col :sm="24" :md="8" class="login-module">
                         <div class="login-wrap">
                             <div class="hd"><span>登陆系统</span></div>
                            <el-form id="login-form" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                            <el-form-item  prop="username">
                                <el-input type="text" @keyup.enter.native="submitForm('ruleForm')" placeholder="登陆账号" v-model="ruleForm.username" ></el-input>
                            </el-form-item>
                            <el-form-item  prop="password">
                                <el-input type="password" @keyup.enter.native="submitForm('ruleForm')" placeholder="登陆密码" v-model="ruleForm.password"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('ruleForm')" class="suBtn">提交</el-button>
                            </el-form-item>
                            </el-form>
                         </div>
                     </el-col>
                 </el-col> 
            </div>
        </div>
</template>

<script>
    export default{
        data(){
            return{
            ruleForm: {
            username:'',   
            password:'',
            },
                rules: {
                username: [
                    { required: true, message: '请输入账号', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                }
            }
        },
        methods:{
              submitForm(formName) {
                  var _this = this;
                this.$refs[formName].validate((valid) => {
                if (valid) {
                       let url="/api/zjjf-auth/auth/authority/authLoginIn";
                       this.$ajaxs( {
                        method: 'post',
                        url: url,
                        data:{
                            userName :this.ruleForm.username,
                            password :this.ruleForm.password
                        },
                        headers: {'X-Requested-With': 'XMLHttpRequest'},
                        }).then(function (response) {
                            if(response.status==200){
                                _this.homeList(response);
                            }
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                        } else {
                            return false;
                        }
                        });
                    },
                    homeList(val){
                        let url="/api/zjjf-auth/"+val.data.url
                    this.$ajaxs(url).then((res)=>{
                        sessionStorage.setItem('currentUser',JSON.stringify(res.data.message));
                        this.$router.push({path: '/adminAuth'});
                    }).catch(function (error) {
                        console.log(error);
                    });
                    }
                 },
                mounted(){
                }
    }
</script>

<style lang="scss"  scoped>
    [class*=el-col-]{
        float:inherit;
    }
    .login-2018{
    background-image: url(../assets/images/login-bg.jpg);
    background-size: cover;
        .login-topbar{
            width: 100%;
            height:40px;
            position: relative;
            background-color: #1F2325;
            .login-topbar-logo{
                height: 40px;
                line-height: 40px;
                text-align: left;
                padding-left: 40px;
                box-sizing: border-box;
                span{color: #fff;position: relative;
                    &::before{
                        content: '';
                        position: absolute;
                        background-image: url(http://www.izjjf.cn/scms/resources/purchase/images/top-logo.png);
                        background-repeat: no-repeat;
                        background-size: cover;
                        width: 20px;
                        height: 20px;
                        top: 0;
                        left: -25px;
                    }
                }
            }
        }
        .login-body{
            padding: 55px 0 35px;
            text-align: center;
            .login-body-box{
                    margin:0 auto;
                   min-height:450px;
                   .login-body-img-box{
                       float: left;
                       img{
                           width: 100%;
                           height: 100%;
                           display:block;
                       }
                   }
                   .login-module{
                       float: right;
                       box-sizing: border-box;
                       padding: 2% 2.6%;
                           background: rgba(255,255,255,.2);
                           box-shadow: 0 0 5px 1px rgba(0,0,0,.1);
                       .login-wrap{
                           width: 100%;
                           min-height: 250px;
                           .hd{
                            margin: 0 0 35px;
                            font-size: 24px;
                            text-align: left;
                            position: relative;
                            box-sizing: border-box;
                           }
                           .suBtn{
                               width: 100%;
                           }
                       }
                   }
            }
        }
    }

  @media only screen and (max-width: 1600px){
      .login-body-box{width: 70%;}
  }
  @media only screen and (max-width: 1366px){
      .login-body-box{width: 80%;}
  }
   @media only screen and (max-width: 750px){
        .login-body-box{width: 95%;}
        .login-body-img-box{display: none;}
        .login-wrap {
            .hd{
                text-align: center!important;
                &::before{
                    content:'';
                    position: absolute;
                    top: 18px;
                    left: 5%;
                    width: 90%;
                    border: 1px #EBECEC solid;
                    z-index: 22;    
                }
                span{
                    position: relative;
                    background: rgba(255, 255, 255, 0.2);
                    z-index: 33;
                }
            }
        }
    }
</style>




