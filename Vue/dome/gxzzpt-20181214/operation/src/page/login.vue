<template>
<div class="login">

  <div class="login-box" >
    <!-- <div class="title"></div> -->
    <img class="logo" src="../../static/img/logo.png" alt="">
    <div class="title">共享制造平台-运营端</div>
    <div class="login-form">
      <el-form :model="loginForm" :rules="rules" ref="loginForm">
        <el-form-item prop="username">
          <el-input placeholder="请输入邮箱或手机号码" v-model="loginForm.username"></el-input>
        </el-form-item>
        <div  @keydown.enter="enterLogin('loginForm')">
          <el-form-item  prop="password" >
            <el-input type="password"   placeholder="请输入登录密码" v-model="loginForm.password"></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <!-- <a href="#" class="forget-psd">忘记密码？</a> -->
    <!-- <div class="remember-psd">
      <el-checkbox v-model="remember">记住密码</el-checkbox>
    </div> -->
    <div class="btn-area">
      <div class="login-btn" @click="submitForm('loginForm')">登录</div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  data() {
    var checkName = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("请输入账号"));
      }
    };
    var checkPsd = (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        callback(new Error("请输入密码"));
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
        userType:101010,
      },
      rules: {
        username: [{ validator: checkName, trigger: "blur" }],
        password: [{ validator: checkPsd, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName){
      this.$refs[formName].validate((valid)=>{
        if(valid){
          this.$http.post('/login',this[formName]).then(res=>{
            if(res.data.code == 200){
              window.localStorage.setItem('operation_user',JSON.stringify(res.data.data));
              this.$router.push('/main/index')
            }else{
              this.$message({
                type:"error",
                message:res.data.message||"网络异常"
              })
            }
          })
        }else{
          return false;
        }
      })
    },
    enterLogin(e){
      this.submitForm('loginForm')
    },
  },
  created() {}
};
</script>

<style lang="less" scoped>
.login {
  position: absolute;
  top: 0;
  bottom: 0;
  background: url("../../static/img/login_bg.jpg");
  width: 100%;
  height: 100%;
  font-size: 14px;
}
.login-box {
  position: absolute;
  width: 300px;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  // .title {
  //   width: 300px;
  //   height: 100px;
  //   background-image: url("../../static/img/logo_login.png");
  //   background-color: #258fd7;
  //   background-position: center;
  //   background-repeat: no-repeat;
  //   margin: 0 auto;
  // }
  .title{
    height: 40px;
    line-height: 40px;
    text-align: center;
    font-size: 30px;
    color: #ddd;
  }
  .logo {
    margin: auto;
    display: block;
    margin-top: 30px;
    width: 304px;
    margin-bottom: 20px;
  }
  .login-form {
    width: 100%;
    margin: auto;
    margin-top: 30px;
  }
  .forget-psd {
    color: #fff;
    &:hover {
      text-decoration: underline;
      color: #258fd7;
    }
  }
  .btn-area {
    text-align: center;
    padding: 30px;
    .login-btn {
      font-size: 16px;
      display: inline-block;
      padding: 5px 20px;
      background: #258fd7;
      color: #fff;
      cursor: pointer;
    }
  }
  .remember-psd {
    color: #fff;
  }
}
</style>
