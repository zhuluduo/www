<template>
    <div id="account-settings">
      <div class="box">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="账号资料" name="first">
              <el-form :model="ruleFormUserInfo" style="width:368px;"  :rules="ruleFormUserInfo.rules" ref="ruleFormUserInfo" label-width="75px" label-position="left" class="demo-ruleForm">
                <el-form-item label="账号 :">
                  <p>{{ruleFormUserInfo.userName}}</p>
                </el-form-item>
                  <el-form-item label="上传图片 :">
                    <az-upload @imgUrl="getimgUrl" :img='ruleFormUserInfo.imgUrl'></az-upload>
                  </el-form-item>
                  <el-form-item label="公司 : " prop="companyName">
                    <el-input v-model="ruleFormUserInfo.companyName" :disabled="ruleFormUserInfo.companyType==160020"></el-input>
                  </el-form-item>
                  <el-form-item label="职位 : " prop="jobTitle">
                    <el-input v-model="ruleFormUserInfo.jobTitle" ></el-input>
                  </el-form-item>
                  <el-form-item label="姓名 : " prop="name">
                    <el-input v-model="ruleFormUserInfo.nickName"></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱 : " prop="email">
                    <!-- <el-input v-model="ruleFormUserInfo.email"></el-input> -->
                    <!-- <el-autocomplete
                    class="inline-input"
                    v-model="ruleFormUserInfo.email"
                    :fetch-suggestions="querySearch"
                    placeholder="请输入邮箱" 
                    disabled
                    :trigger-on-focus="false"
                    ></el-autocomplete> -->
                    <p>{{ruleFormUserInfo.email}}</p>
                  </el-form-item>
                <el-form-item label="手机号码 : " v-if="ruleFormUserInfo.phone">
                  <span>{{ruleFormUserInfo.phone}}</span>
                  <span  @click="formPhonePassword.isShow = true" class="modal-name changePhone">修改</span>
                </el-form-item>
              </el-form>
              <div class="submitBtnBox">
                <span class="submitBtn"  @click="submitUserInfo('ruleFormUserInfo')">确定</span>
              </div>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="second">
              <el-form :model="formChangePassword.data" style="width:397px;"  ref="formChangePassword" label-position="left" :rules="formChangePassword.rules" label-width="90px" class="demo-ruleForm">
                <el-form-item label="手机号码 : ">
                  <p v-if="ruleFormUserInfo.phone">{{ruleFormUserInfo.phone}}</p>
                  <p v-else class="modal-name" @click="formBindingPhone.isShow = true">绑定手机</p>
                </el-form-item>
                <el-form-item label="手机验证码 : " prop="code">
                  <div class="sendCode">
                    <el-input :disabled="!ruleFormUserInfo.phone"  v-model="formChangePassword.data.code"></el-input>
                    <span class="sendCodeBtn btnSend" v-show="formChangePassword.phoneCode.show" type="primary"  @click="SendPhonecode('formChangePassword')">发送验证码</span>
                    <span class="gray btnSend" v-show="formChangePassword.phoneCode.show&&!ruleFormUserInfo.phone" type="primary" @click="SendPhonecode('formChangePassword')">发送验证码</span>
                    <span class="btnCountdown btnSend" v-show="!formChangePassword.phoneCode.show" type="primary">{{formChangePassword.phoneCode.count}}s</span>
                  </div>
                </el-form-item>
                <el-form-item label="新密码 : "  prop="Password">
                  <el-input type="password"  :disabled="!ruleFormUserInfo.phone"  v-model="formChangePassword.data.Password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码 : " prop="ensurePassword">
                  <el-input type="password"  :disabled="!ruleFormUserInfo.phone" v-model="formChangePassword.data.ensurePassword"></el-input>
                </el-form-item>
              </el-form>
              <div class="submitBtnBox">
                <span  v-if="ruleFormUserInfo.phone" class="submitBtn" @click="changePassword('formChangePassword')">确定</span>
                <span  v-else class="submitBtn gray">确定</span>
              </div>
            </el-tab-pane>
             <el-tab-pane label="提示消息" name="third">
              <div class="third-content">
                <div class="row-content message">
                  <div class="table">
                    <div class="thead"> 
                      <ul>
                        <li class="out">
                          <b>提醒方式</b>
                          <canvas width="242" height="36" id="myCanvas"></canvas>
                          <em>提醒类型</em>
                        </li>
                        <li>
                          <el-checkbox v-model="checkBoxAll.webNotify"  disabled @change="changeCheckbox('webNotify')"></el-checkbox>
                          <span>站内消息</span>
                        </li>
                        <li>
                          <el-checkbox v-model="checkBoxAll.emailNotify" @change="changeCheckbox('emailNotify')"></el-checkbox>
                           <span>邮件提醒</span>
                        </li>
                        <li>
                          <el-checkbox v-model="checkBoxAll.smsNotify" @change="changeCheckbox('smsNotify')"></el-checkbox>
                          <span>短信提醒</span>
                        </li>
                      </ul>
                    </div>
                    <div class="tbody">
                      <ul v-for="(item,index) in settingsList" :key="index">
                        <li class="messageTypeName">{{item.messageTypeName}}</li>
                        <li><el-checkbox v-model="item.webNotify" disabled @change="changeCheckboxOne('webNotify')"></el-checkbox></li>
                        <li><el-checkbox v-model="item.emailNotify" @change="changeCheckboxOne('emailNotify')"></el-checkbox></li>
                        <li><el-checkbox v-model="item.smsNotify" @change="changeCheckboxOne('smsNotify')"></el-checkbox></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="submitBtnBox">
                  <span class="submitBtn" @click="onSubmit">保存</span>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
      </div>
      <el-dialog title="绑定手机"  :visible.sync="formBindingPhone.isShow" width="540px">
        <el-form :model="formBindingPhone.data"  ref="formBindingPhone"  :rules="formBindingPhone.rules" label-position="left" label-width="80px">
          <el-form-item label="手机号 : "  prop="phone">
            <el-input v-model="formBindingPhone.data.phone"></el-input>
          </el-form-item>
          <el-form-item label="验证码 : " prop="code">
            <div class="sendCode">
              <el-input v-model="formBindingPhone.data.code"></el-input>
              <span  class="sendCodeBtn btnSend" v-show="formBindingPhone.phoneCode.show" type="primary"  @click="SendPhonecode('formBindingPhone')">发送验证码</span>
              <span  class="btnCountdown btnSend" v-show="!formBindingPhone.phoneCode.show" type="primary">{{formBindingPhone.phoneCode.count}}s</span>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" >
          <span class="submitCancel" @click="cancelBindingPhone('formBindingPhone')">取消</span>
          <span class="submitEnsure" @click="ChangeBindingPhone('formBindingPhone')">提交</span>
        </div>
      </el-dialog>
      <el-dialog title="修改手机号"  :visible.sync="formPhonePassword.isShow" width="540px" >
        <el-form :model="formPhonePassword.data" ref="formPhonePassword" :rules="formPhonePassword.rules"  label-position="left" label-width="80px">
          <el-form-item label="旧手机号 :" >
           <p>{{ruleFormUserInfo.phone}}</p>
          </el-form-item>
          <el-form-item label="验证码 :"  prop='code'>
           <div class="sendCode">
              <el-input v-model="formPhonePassword.data.code"></el-input>
              <span class="sendCodeBtn btnSend" v-show="formPhonePassword.phoneCode.show"  @click="SendPhonecode('formPhonePassword')">发送验证码</span>
              <span class="btnCountdown btnSend"  v-show="!formPhonePassword.phoneCode.show">{{formPhonePassword.phoneCode.count}}s</span>
            </div>
          </el-form-item>
          <el-form-item label="新手机号 : " prop='phone'>
            <el-input v-model="formPhonePassword.data.phone"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <span class="submitCancel" @click="cancelBindingPhone('formPhonePassword')">取消</span>
          <span class="submitEnsure"  @click="ChangeBindingPhone('formPhonePassword')">提交</span>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import upload from '../components/upload.vue';
import {validatePhone,validatPassword,validatePhoneCode,validateEmail,EmailAuto} from '../lib/validate.js';
import { mapState, mapActions } from 'vuex';
export default {
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.formChangePassword.data.Password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        activeName: 'first',
        ruleFormUserInfo: {
           userName:'',
           nickName: '',
           companyName:'',
           Position:'',
           email:'',
           phone:'',
           imgUrl:'',
           companyType:'',
           rules: {
              // username: [
              //   { required: true, message: "请输入姓名", trigger: "blur" }
              // ],
              // phone: [
              //   { required: true, validator: validatePhone, trigger: "blur" }
              // ],
              email: [{ required: true, validator: validateEmail }]
            }
          },
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
            Password:[{required: true, validator: validatPassword, trigger: 'blur' }],
            ensurePassword:[{ required: true, validator: validatePass2, trigger: 'blur' }],
            code:[{required: true, validator: validatePhoneCode, trigger: "blur"}]
          }
        },
        formBindingPhone: {
          isShow: false,
          phoneCode:{
            count:'',
            show: true,
            timer: null,
          },
          data:{
            phone: '',
            code:'',
          },
          rules: {
            phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
            code:[{required: true, validator: validatePhoneCode, trigger: "blur"}]
          }
        },
        formPhonePassword: {
          isShow:false,
          phoneCode:{
            count:'',
            show: true,
            timer: null,
          },
          data:{
            code: '',
            phone:'',
          },
          rules: {
            phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
            code:[{required: true, validator: validatePhoneCode, trigger: "blur"}]
          }
        },
        formLabelWidth: '120px',
        settingsList:[],
        checkBoxAll:{
          webNotify:true,
          emailNotify:false,
          smsNotify:false,
        },
      };
    },
    components:{
      "az-uplood":upload
    },
    created(){
      var user = JSON.parse(window.localStorage.getItem("gxzzpt2_consumer"));
      this.ruleFormUserInfo.userName=user.username?user.username:'';
      this.ruleFormUserInfo.phone=user.phone?user.phone:'';
      this.ruleFormUserInfo.companyName=user.companyName?user.companyName:'';
      this.ruleFormUserInfo.companyType=user.companyType?user.companyType:'';
      this.ruleFormUserInfo.jobTitle=user.jobTitle?user.jobTitle:'';
      this.ruleFormUserInfo.nickName=user.nickName?user.nickName:'';
      this.ruleFormUserInfo.email=user.email?user.email:'';
      this.ruleFormUserInfo.imgUrl=user.portrait?user.portrait:'';
      this.getSettingsData();
    },
    mounted() {
      this.line();
    },
    methods: {
      ...mapActions(['setUser']),
      handleClick(tab, event) {
        // console.log(tab, event);
      },
      submitUserInfo(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let requestParams = {
              "phone": this[formName].phone?this[formName].phone:'',
              "email": this[formName].email?this[formName].email:'',
              "companyName":this[formName].companyName?this[formName].companyName:'',
              "jobTitle":this[formName].jobTitle?this[formName].jobTitle:'',
              "nickName":this[formName].nickName?this[formName].nickName:'',
              "portrait": this[formName].imgUrl?this[formName].imgUrl:'',
            };
            this.$http.post("/modifyUserInfo",requestParams).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message:res.data.message
                });
                var user = JSON.parse(window.localStorage.getItem("gxzzpt2_consumer"));
                user.phone=this[formName].phone?this[formName].phone:'';
                user.email=this[formName].email?this[formName].email:'',
                user.nickName=this[formName].nickName?this[formName].nickName:'';
                user.jobTitle=this[formName].jobTitle?this[formName].jobTitle:'',
                user.companyName=this[formName].companyName?this[formName].companyName:'';
                user.portrait=this[formName].imgUrl?this[formName].imgUrl:'';
                this.setUser(user)
                localStorage.setItem("gxzzpt2_consumer", JSON.stringify(user));
              } else {
                this.$message({
                  type: "error",
                  message: res.data.message
                });
              }
            });
          } else {
            return false;
          }
        })
      },
      //子传父获取imgUrl
      getimgUrl(img){
        this.ruleFormUserInfo.imgUrl=img.imgUrl
      },
      //发送验证码
      SendPhonecode(formName){
        let phone = this.formBindingPhone.data.phone?this.formBindingPhone.data.phone:this.ruleFormUserInfo.phone;
        //发送短信60秒计时
        if(phone){
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
          this.$http.post("/sendSmsCode",{"phone":phone}).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message:"发送成功查收"
              });
            } else {
              this.$message({
                type: "error",
                message: res.data.message
              });
            }
          });
        }else{
          this.$message({
            type: "warning",
            message:"请输入手机号码"
          });
        }
      },
      //修改密码；
      changePassword(formName){
        this.$refs[formName].validate(valid => {
          if (valid) {
            let requestParams = {
              password:this[formName].data.Password,
              code:this[formName].data.code,
            };
            this.$http.post("/changePassword",requestParams).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message:res.data.message
                }); 
                this.$refs[formName].resetFields();   
              } else {
                this.$message({
                  type: "error",
                  message: res.data.message
                });
              }
            });
          } else {
            return false;
          }
        })
      },
      //修改手机号or绑定手机号
      ChangeBindingPhone(formName){
         this.$refs[formName].validate(valid => {
          if (valid) {
            let requestParams = {
              oldPhone:this.ruleFormUserInfo.phone,
              phone: this[formName].data.phone,
              code:this[formName].data.code,
            };
            this.$http.post("/bindOrModifyPhone",requestParams).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message:res.data.message
                });
                var user = JSON.parse(window.localStorage.getItem("gxzzpt2_consumer"));
                user.phone=this[formName].data.phone;
                localStorage.setItem("gxzzpt2_consumer", JSON.stringify(user));
                this.ruleFormUserInfo.phone=this[formName].data.phone;
                this[formName].data={};
                this[formName].phoneCode.show=true;
                this[formName].isShow = false;
              } else {
                this.$message({
                  type: "error",
                  message: res.data.message
                });
              }
            });
          } else {
            return false;
          }
        })
      },
      //取消修改手机或绑定手机
      cancelBindingPhone(formName){
        this.$refs[formName].resetFields();
        this[formName].isShow = false;
      },
      //邮箱自动补全的方法；
      querySearch(inputString,cb) {
          EmailAuto(inputString,cb)
      },
      //Canvas划线；
      line(){
        var c=document.getElementById("myCanvas");
        var ctx=c.getContext("2d");
        ctx.moveTo(0,0);
        ctx.lineTo(242,36);
        ctx.strokeStyle="#e3e3e3";
        ctx.stroke();
      },
      //获取消息的Data；
      getSettingsData(){
        this.$http.post("/custom/message/myGetSetting").then(res => {
            if (res.data.code == 200) {
                this.settingsList=res.data.data||[];
                this.getcheckAllbox()
            } else {
                this.$error(res.data.message);
            }
        });
      },
      //全选操作；
      changeCheckbox(type){
        this.settingsList.map((ele)=>{
            ele[type]=this.checkBoxAll[type]
        })
      },
      //判断单选与全选联动；
      getCheckList(type){
        let flag = true;
        this.settingsList.map((ele)=>{
            if(!ele[type]){
              flag=false;
            }
        })
        this.checkBoxAll[type]=flag;
      },
      //开始判断checkALL按钮的是否中;
      getcheckAllbox(){
        this.getCheckList('webNotify')
        this.getCheckList('emailNotify')
        this.getCheckList('smsNotify')          
      },
      //单选;
      changeCheckboxOne(type){
        this.getCheckList(type)
      },
      //保存数据的API
      saveSettingApi(requestParams){
          this.$http.post("/custom/message/mySaveSetting",requestParams).then(res => {
            if (res.data.code == 200) {
                  this.$message({
                    type:"success",
                    message:res.data.message,
                })
            } else {
                this.$error(res.data.message);
            }
        });
      },
      //提交提示消息；
      onSubmit(formName){
        let requestParams = {
            settings: this.settingsList,
        };
        this.saveSettingApi(requestParams)
      },
    }
}
</script>

<style lang="less">
#account-settings{
  @common-color: #3f8def;
  .box {
    margin: 0 auto;
    padding:12px 0 0; 
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
      background-color: #d0d0d0;
      cursor: not-allowed;
    }
    .sendCodeBtn{
      background-color: #409EFF;
      color: #fff;
      cursor: pointer;
    }
  }
  .submitBtnBox{
    margin-top: 110px;
    display: flex;
    justify-content: center;
    .submitBtn{
      display: inline-block;
      width: 204px;
      height: 38px;
      line-height: 38px;
      font-size: 14px;
      color: #fff;
      text-align: center;
      border-radius: 4px;
      background-color: #3f8def;
      cursor: pointer;
    }
    .gray{
      background-color: #d0d0d0;
      cursor: not-allowed;
    }
  }
  .submitCancel{
    display: inline-block;
    width: 86px;
    height: 30px;
    background-color: #d0d0d0;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    line-height: 30px;
    color: #ffffff;
  }
  .submitEnsure{
    display: inline-block;
    width: 86px;
    height: 30px;
    background-color: #3f8def;
    border-radius: 4px;
    cursor: pointer;
    text-align: center;
    line-height: 30px;
    color: #ffffff;
    margin-left: 34px;
  }
  .modal-name {
    color: #3f8def;
    text-decoration: underline;
    white-space: nowrap;
    cursor: pointer;
  }
  .changePhone{
    margin-left: 20px;
  }
  .el-dialog__title{
    font-size: 16px;
  }
  .dialog-footer{
    padding-top: 7px;
  }
  .message {
    padding: 10px 0 0 0;
    display: flex;
    justify-content: flex-start;
    li{
      border:  1px solid #e3e3e3;
      margin-top: -1px;
      margin-right: -1px;
      height: 36px;
      width: 240px;
    }
    .table{
      .thead,.tbody{
        ul{
          display: flex;
          justify-content: center;
          li{
            display: flex;
            align-items: center;
            .el-checkbox{
              flex: 0 0 50%; 
              display: flex;
              justify-content: center;
            }
          }
          .messageTypeName{
            justify-content: center;
          }
        }
      }
    }
    .out {
      position: relative; 
      b {
        font-style: normal;
        font-weight: normal;
        display: block;
        top: 5px;
        right: 30px;
        position: absolute;
      }
      em {
        font-style: normal;
        display: block;
        position: absolute;
        top: 12px;
        left: 40px;
      }
    }
  }
  .el-tabs__item{
    font-size: 12px;
    color: #777;
    height: 36px;
    line-height: 36px;
  }
}
</style>

