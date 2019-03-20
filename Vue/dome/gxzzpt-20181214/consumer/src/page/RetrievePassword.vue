<template>
    <div id="RetrievePassword">
        <div class="bread-crumb">
            <span class="crumb-level" @click="$router.push({path:'/index'})">首页</span> >
            <span class="crumb-level2">找回密码</span>
        </div> 
        <div class="box">
            <div class="Title">找回密码</div>
            <div class="content">
                <el-form :model="formChangePassword.data"  status-icon :rules="formChangePassword.rules" ref="formChangePassword" label-width="100px" class="demo-ruleForm">
                    <div class="stepOne">
                        <div class="stepTitle">第一步 验证身份</div>
                        <div class="stepInfo">
                            <el-form-item  prop="phone">
                                <el-input v-model="formChangePassword.data.phone" placeholder="请输入正确的手机号"></el-input>
                            </el-form-item>
                            <el-form-item prop="code">
                                <div class="sendCode">
                                    <el-input v-model="formChangePassword.data.code" placeholder="请输入正确验证码"></el-input>
                                    <span class="sendCodeBtn btnSend"  v-show="formChangePassword.phoneCode.show&&(formChangePassword.data.phone.length==11)"  @click="SendPhonecode('formChangePassword')">发送验证码</span>
                                    <span class="gray btnSend"  v-show="formChangePassword.phoneCode.show&&(formChangePassword.data.phone.length!=11)"  @click="alertInfo()">发送验证码</span>
                                    <span class="btnCountdown btnSend"  v-show="!formChangePassword.phoneCode.show">{{formChangePassword.phoneCode.count}}s</span>
                                </div>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="stepTwo">
                        <div class="stepTitle">第二步 修改密码</div>
                        <div class="stepInfo">
                            <el-form-item  prop="Password">
                                <el-input   type="password" v-model="formChangePassword.data.Password" placeholder="请输入6-20位的新密码"></el-input>
                            </el-form-item>
                            <el-form-item prop="ensurePassword">
                                <el-input   type="password" v-model="formChangePassword.data.ensurePassword" placeholder="请再输入一遍您的新密码"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <span class="submitBtn"  @click="submitForm('formChangePassword')">修改密码</span>
                </el-form>
            </div>
        </div>    
    </div>
</template>
<script>
import {validatePhone,validatPassword,validatePhoneCode,validateEmail,EmailAuto} from '../lib/validate.js';
export default {
    data() {
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再输入一遍您的新密码'));
            } else if (value !== this.formChangePassword.data.Password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
      return {
        formChangePassword: {
          isShow: false,
          phoneCode:{
            count:'',
            show: true,
            timer: null,
          },
          data:{
            phone: '',
            code:'',
            Password:'',
            ensurePassword:'',
          },
          rules: {
            phone:[{required: true, validator: validatePhone, trigger: 'blur' }],
            Password:[{required: true, validator: validatPassword, trigger: 'blur' }],
            ensurePassword:[{ required: true, validator: validatePass2, trigger: 'blur' }],
            code:[{required: true, validator: validatePhoneCode, trigger: "blur"}]
          }
        },
      };
    },
    created() {
       
    },
    methods: {
        alertInfo(){
            this.$message({
                message: '请输入有效的电话号码',
                type: 'warning',
                duration:1500,
            });
        },
        //手机倒计时；
        phoneCount(formName){
            //发送短信60秒计时
            const TIME_COUNT = 60;
            if (!this[formName].phoneCode.timer) {
                this[formName].phoneCode.count = TIME_COUNT;
                this[formName].phoneCode.show = false;
                this[formName].phoneCode.timer = setInterval(() => {
                    if (this[formName].phoneCode.count > 0 && this[formName].phoneCode.count <= TIME_COUNT) {
                        this[formName].phoneCode.count--;
                    } else {
                        this[formName].phoneCode.show = true;
                        clearInterval(this[formName].phoneCode.timer);
                        this[formName].phoneCode.timer = null;
                    }
                }, 1000)
            }
        },
        //检查手机号是否存在
        checkUserExist(formName){
            let phone = this.formChangePassword.data.phone;
            let params ={"username":phone}
            this.$http.post('/checkUserExist',params).then(res=>{
                if(res.data.data.isExist){
                    this.ensureSendCode(phone,formName)
                }else{
                    this.$message({
                        type: "error",
                        message:'你输入的手机号未注册，请点击注册'
                    });
                }
            })
        },
        //发送请求；
        ensureSendCode(phone,formName){
            this.$http.post("/sendSmsCode",{"phone":phone}).then(res => {
                if (res.data.code == 200) {
                    this.phoneCount(formName)
                    this.$message({
                        type: "success",
                        message:"发送成功查收"
                    });
                } else {
                   this.$error(res.data.message)
                }
            });
        },
        SendPhonecode(formName){
            this.checkUserExist(formName)
           
        },
        submitForm(formName) {
           this.$refs[formName].validate(valid => {
                if (valid) {
                    let requestParams = {
                        password:this[formName].data.Password,
                        code:this[formName].data.code,
                        phone:this[formName].data.phone,
                        userType:101020,
                    };
                    this.$http.post("/findPassword",requestParams).then(res => {
                        if (res.data.code == 200) {
                            this.$success(res.data.message); 
                            this.$refs[formName].resetFields(); 
                            this.$router.push({path:'/index'}) 
                            setTimeout(()=>{
                                this.$login({});
                            },1000) 
                        } else {
                            this.$error(res.data.message);
                        }
                    });
                } else {return false;}
            })
        },
    }
  }
</script>
<style lang="less">
.el-form-item__content{
    margin: 0px !important;
}
.sendCode{
    .el-input{
        width: 254px;
    }
}
</style>

<style lang="less" scoped>
#RetrievePassword{
    width: 1200px; 
    margin: 36px auto 51px;
    @common-color: #3f8def;
    background-color: #fff;
    position: relative;
    height: 100%;
    .bread-crumb{
        position: absolute;
        z-index: 99;
        top: -24px;
        width: 250px;
        .crumb-level:hover{
            text-decoration:underline;
            cursor: pointer;
        }
        .crumb-level2{
            color: #3f8def;
        }
    }
    .box{
        .Title{
            text-align: center;
            line-height: 62px;
            font-size: 20px;
            color: #777777;
            border-bottom: 1px solid #e2e2e2;
        }
        .content{
            width: 360px;
            padding: 25px 0px 65px;
            margin: 0 auto;
            .stepOne,.stepTwo{
                .stepTitle{
                    margin-bottom: 12px;
                    font-size: 14px;
                    color: #777777;
                }
            }
            .stepTwo{
                padding-top:9px;
            }
            .submitBtn{
                margin-top:17px;
                display: inline-block;
                width: 360px;
                cursor: pointer;
                line-height:38px;
                text-align:center;
                background-color: #3f8def;
                border-radius: 4px;
                color: #ffffff;
                font-size: 14px;
            }
        }
    }
    .sendCode{
        .btnCountdown{
            background-color: #e7e7e7;
            cursor: not-allowed;
        }
        .btnSend{
            position: absolute;
            top: 0px;
            right:0;
            display: inline-block;
            width: 93px;
            height: 26px;
            text-align: center;
            line-height: 26px;
        }
        .gray{
            background-color: #409EFF;
            color: #fff;
            cursor: not-allowed;
        }
        .sendCodeBtn{
            background-color: #409EFF;
            color: #fff;
            cursor: pointer;
        }
    }
}

</style>
