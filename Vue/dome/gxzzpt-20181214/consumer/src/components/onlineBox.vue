
<template>
    <div class="onlineBox">
        <div class="onlineChat">
            <div class="qqChat" @mousemove="showQQ"   @mouseout="closeQQ">
                <div>
                    <a v-show="isShowQQ" target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=3425512265&site=qq&menu=yes">
                        <img border="0" src="../../static/img/qqhover.png" alt="点击这里可联系我" title="点击这里可联系我"/>
                    </a>
                </div>   
            </div>
            <div class="wChat" @mousemove="showEWM" @mouseout="closeEWM">
                <div></div>
                <img v-show="isShowEWM" src="../../static/img/EWMlog.jpg" alt="" srcset="">
            </div>
            <div class="feedback" @click="centerDialogVisible = true" >反馈</div>
            <div class="backtop">
                <a href="javascript:scrollTo(0,0)"></a>
            </div>
        </div>
        <div>  
            <el-dialog  title="意见反馈" :visible.sync="centerDialogVisible"  width="30%" >
                <el-form :model="ruleForm"  label-position="left" :rules="rules" ref="ruleForm" label-width="60px" class="demo-ruleForm">
                    <el-form-item label="建议 : " prop="desc">
                        <el-input type="textarea" placeholder="请输入你的宝贵建议" maxlength='200' :autosize="{ minRows: 3, maxRows: 5}" v-model="ruleForm.desc"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名 : ">
                        <el-input v-model="ruleForm.name" placeholder="请输入姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="电话 : ">
                        <el-input v-model="ruleForm.Phone" placeholder="请输入电话"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱 : ">
                        <!-- <el-input v-model="ruleForm.Email"></el-input> -->
                        <el-autocomplete
                        class="inline-input"
                        v-model="ruleForm.Email"
                        :fetch-suggestions="querySearch"
                        placeholder="请输入邮箱"
                        :trigger-on-focus="false"
                        ></el-autocomplete>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button type="info" @click="resetForm('ruleForm')">取消</el-button>
                    <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                </span>
            </el-dialog>
        </div>    
    </div>
</template>

<script>
import { validatePhone ,validateEmail,EmailAuto} from '../lib/validate.js'
export default {
    data(){
        return{
            centerDialogVisible: false,
            isShowEWM:false,
            isShowQQ:false,
            ruleForm: {
                name: '',
                Email:'',
                desc: '',
                Phone:'',
            },
            rules: {
                desc: [
                    { required: true, message: '请输入你的宝贵意见'},
                ],
            }
        }
    },
    created() {
        //获取本地用户的数据；
        var user = this.$LocalStorage.gxzzpt2_consumer();
        this.ruleForm.name=user.nickName?user.nickName:'';
        this.ruleForm.Email=user.email?user.email:'';
        this.ruleForm.Phone=user.phone?user.phone:'';
    },
    methods:{
        //提交
        submitForm(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let requestParams = {
                        contactsName: this.ruleForm.name?this.ruleForm.name:null,
                        contactsPhone: this.ruleForm.Phone?this.ruleForm.Phone:null,
                        contactsEmail: this.ruleForm.Email?this.ruleForm.Email:null,
                        content: this.ruleForm.desc
                    };
                    this.addFeedback(requestParams);
                } else {
                    return false;
                }
            });
        },
        //重置
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.centerDialogVisible=false;
        },
        //反馈请求api
        addFeedback(requestParams) {
            this.$http.post("/custom/Feedback/addFeedback", requestParams).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.message
                    });
                    this.$refs["ruleForm"].resetFields(); //清除form表单数据；
                    this.centerDialogVisible = false;
                    //刷新页面；
                } else {
                    this.$message({
                        type: "error",
                        message: res.data.message
                    });
                }
            });
        },
        showEWM(){
            this.isShowEWM=true;
        },
        closeEWM(){
            this.isShowEWM=false;
        },
        showQQ(){
            this.isShowQQ=true;
        },
        closeQQ(){
            this.isShowQQ=false;
        },
        //邮箱自动补全的方法；
        querySearch(inputString,cb) {
            EmailAuto(inputString,cb)
        },
    }
}
</script>

<style lang="less" scoped>
    .onlineChat{
        position: fixed;
        right: 0;
        bottom: 220px;
        z-index: 999;
        >div{
            width: 58px;
            height: 58px;
            background-color: rgba(171, 171, 171, 0.26);
            margin-bottom: 7px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        }
        .wChat{
            position: relative;
            >div{
                background:url(../../static/img/wChat.png) no-repeat center center;
                width: 36px;
                height: 29px;
            }
            >img{
                position: absolute;
                width: 258px;
                height: 258px;
                top: -70px;
                left: -260px;
            }
        }
        .wChat:hover{
            >div{
                background:url(../../static/img/wChatHover.png) no-repeat center center;
            }
        }
        .qqChat{
            >div{
                background:url(../../static/img/qq.png) no-repeat center center;
                width: 32px;
                height: 35px;
            }
        }
        .qqChat:hover{
            >div{
                background:url(../../static/img/qqhover.png) no-repeat center center;
            }
        }
        .feedback{
            font-size: 16px;
            color: #fff;
            text-align: center;
            line-height: 58px;
        }
        .feedback:hover{
            color: #3f8def;
        }
        .backtop{
            >a{
            display: block;
            background:url(../../static/img/backTop.png) no-repeat center center;
            width: 23px;
            height: 12px;
            }
        }
        
    }
    .submitBtnBox{
        margin-top: 110px;
        display: flex;
        justify-content: center;
        .submitBtn{
        display: inline-block;
        width: 204px;
        height: 42px;
        line-height: 42px;
        color: #fff;
        text-align: center;
        border-radius: 4px;
        background-color: #3f8def;
        }
    }
</style>
