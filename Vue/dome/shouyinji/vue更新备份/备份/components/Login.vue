<template>
  <el-row v-loading="loading" :element-loading-text="loadingText">
    <el-col :span="24" class="header" v-bind:style="marginBottom">
      欢迎来到转角街坊
      <span style="float:right;">客服热线：400-664-3833</span>
    </el-col>
    <el-col :span="24">
      <div class="login-box">
        <el-form ref="AccountFrom" :model="user" :rules="rules" class="login-form">
          <el-form-item prop="username">
            <el-input type="text" @keyup.enter.native="login" v-model="user.username" auto-complete="off" placeholder="账号" class="acc_icon icon_attribute"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" @keyup.enter.native="login" v-model="user.password" auto-complete="off" placeholder="密码" class="paw_icon icon_attribute"/>
          </el-form-item>
          <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
          <el-form-item style="width:100%;">
            <el-button @click.native.prevent="login" :loading="loading" class="submit_btn">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
    <el-col :span="24" class="footer">
      <div v-if="appLink!=''" style="margin-bottom: 20px"><a v-bind:href="appLink"><i class="iconfont icon-jfun-download"/>下载收银APP</a></div>
      <div><a href="http://www.izjjf.cn/">深圳市转角街坊网络科技有限公司</a>  |  粤ICP备14043041号-2 | 系统版本V{{sysVersion}}</div>
    </el-col>
  </el-row>
</template>

<script>
    import {bus} from '../bus.js';
    export default {
        data() {
            return {
              sysVersion:bus.sysVersion,
              appLink:'',
              loading: false,
              loadingText:'正在登录...',
              user: {
                  username: '',
                  password: '',
              },
              rules: {
                  username: [
                      {required: true, message: '请输入账号', trigger: 'blur'},
                  ],
                  password: [
                      {required: true, message: '请输入密码', trigger: 'blur'},
                  ]
              },
              checked: true,
              marginBottom:{}
            };
        },
        methods: {
            login(){
              this.loading = true;
              this.$axios.post(bus.host + '/pos/login?_='+new Date().getTime(), this.user, {

                transformRequest: [function (data) {
                  let ret = '';
                  for (let it in data)
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
                  return ret
                }],
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
              }).then(res=>{
                let data = res.data;
                if (!data.success) throw res;
                data.msg.appLink=this.appLink;
                sessionStorage.setItem('currentUser',JSON.stringify(data.msg));
                this.loadingText='登录成功！';
                this.$router.push({path: '/'});
              }).catch(err=>{
                this.loading=false;
                this.$notify({
                  message: err.data.msg,
                  type: 'error'
                });
              });
            },
            adjust(){
              let height=`${document.documentElement.clientHeight}`;
              let bottom=`${(height-471)/2}px`;
              this.marginBottom={'margin-bottom':bottom};
            }
        },
        mounted() {
          this.$axios.get(bus.host + '/pos/openapi/app/latest').then(res=>this.appLink=res.data.msg.url);
          this.adjust();
          window.onresize = ()=>this.adjust();
        }
    }
</script>
<style >
  .icon_attribute input{text-indent: 20px}

</style>
<style lang="scss" scoped>
  .login-box{
    position: relative;
    width:791px;
    height: 441px;
    background: url('../assets/images/bg-login.png');
    margin:0 auto;
  }
  .login-form{
    position: absolute;
    width: 270px;
    height: 220px;
    top: 150px;
    right: 65px;
    .acc_icon:before,.paw_icon:before{
      font-family:"iconfont" !important;
      font-size:16px!important;
      color: #646464;
      font-style:normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;

      position: absolute;
      top: 0;
      left: 10px;
      font-size: 20px;
    }
    .acc_icon:before{
      content:"\e64e";
    }
    .paw_icon:before{
      content:"\e64f";
    }
    .submit_btn{
      width: 100%;
      border: none;
      height: 56px;
      color: #fff;
      margin-top:20px;
      background-image: url(../assets/images/btn-login.png);
      background-repeat: no-repeat;
      background-size: cover;
    }
  }
  .header{
    background: #f4f5f9;
    border-bottom: 1px solid #e7e7e9;
    font-size: 12px;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    padding: 0 15px;
    color: #666
  }

  .footer{
    text-align: center;
    padding: 15px;
    font-size: 14px;
    position:fixed;
    bottom: 0;
  }
  .footer,.footer a{
    color: #bcbcbc;
  }

</style>
