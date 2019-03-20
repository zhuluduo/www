<template>
  <div id="settings">
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="box">
        <div class="list">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="demo-ruleForm">
                <div class="row">
                    <p class="title">收货设置：</p>
                    <div class="row-content user">
                        <div>
                            自动确认收货：
                            <span>
                                发货
                            </span>
                            <span>
                                <el-form-item prop="data1" class="el-form-number">
                                    <el-input-number v-model="ruleForm.data1" size="small" :min="1" :max="999"></el-input-number>
                                </el-form-item>
                            </span>
                            <span>
                                天后
                            </span>
                        </div>
                        <div>
                            自动确认收货：
                            <span>
                                发货
                            </span>
                            <span>
                                <el-form-item prop="data2" class="el-form-number">
                                    <el-input-number v-model="ruleForm.data2" size="small" :min="1" :max="999"></el-input-number>
                                </el-form-item>
                            </span>
                            <span>
                                天后
                            </span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <p class="title">提醒设置：</p>
                    <div class="row-content message"> 
                        <ul class="table">
                            <div class="thead">
                                <li class="theadOne out">
                                    <b>子账号</b>
                                    <canvas width="128" height="80" id="myCanvas"></canvas>
                                    <em>消息提醒</em>
                                </li>
                                <li v-for="(words,index) in messageData" :key="index" class="tbody">{{words.name}}</li>
                            </div>
                            <div class="tbody" v-for="(user,index) in settingsList" :key="index">
                                <li class="userInfo">
                                    <p>{{user.userName}}</p>
                                    <el-checkbox :indeterminate="user.isIndeterminate" v-model="user.checkAll" @change="handleCheckAllChange(user)"></el-checkbox>
                                </li>
                                <el-checkbox-group v-model="user.messageTypes"  @change="handleCheckedCitiesChange(user)">
                                    <el-checkbox v-for="words in messageData" :label="words.id" :key="words.id" ></el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </ul>
                    </div>
                </div>
            </el-form>
            <div class="submitBtn">
                <el-button type="primary" @click="onSubmit('ruleForm')">确定</el-button>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            settingsList:[],
            messageData:[],
            messageLlist:[],
            ruleForm: {
                name1: '',
                name2:'',
                },
            rules: {
                data1: [
                    { required: true, message: '请输入数字'}
                ],
                data2: [
                    { required: true, message: '请输入数字'}
                ],
            }
        }
    },
    created(){
        this.getSettingsData();
    },
    mounted() {
        this.line();
    },
    methods:{
        getSettingsData(){
            this.$http.post("/operation/message/getSetting").then(res => {
                if (res.data.code == 200) {
                    this.messageData=res.data.data.messageTypeEnum;
                    this.messageData.forEach(ele=>{
                        ele.id=Number(ele.id)
                        this.messageLlist.push(ele.id)
                    })
                    this.settingsList=res.data.data.settings;
                    this.settingsList.forEach(item=>{
                        this.$set(item,'checkAll',false)
                        this.$set(item,'isIndeterminate',true)
                        if(!item.messageTypes){
                           this.$set(item,'messageTypes',[])
                        }
                     })
                } else {
                    this.$error(res.data.message);
                }
            });
        },
        //全选；
        handleCheckAllChange(user){
            user.messageTypes = user.checkAll ? this.messageLlist : [];
            user.isIndeterminate = false;
        },
        //单选框；
        handleCheckedCitiesChange(user) {
            let checkedCount = user.messageTypes.length;
            user.checkAll = checkedCount === this.messageLlist.length;
            user.isIndeterminate = checkedCount > 0 && checkedCount < this.messageData.length;
        },
        //保存数据的API
        saveSettingApi(requestParams){
             this.$http.post("/operation/message/saveSetting",requestParams).then(res => {
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
        onSubmit(formName){
            let messageArr=[];
            this.settingsList.forEach(ele=>{
                let messageObj={};
                messageObj.userName=ele.userName;
                messageObj.userId=ele.userId;
                messageObj.messageTypes=ele.messageTypes;
                messageArr.push(messageObj)
            })
            let requestParams = {
                settings:messageArr,
            };
            this.saveSettingApi(requestParams)
        },
        line(){
            var c=document.getElementById("myCanvas");
            var ctx=c.getContext("2d");
            ctx.moveTo(0,0);
            ctx.lineTo(128,80);
            ctx.strokeStyle="#e2e2e2";
            ctx.stroke();
        }
    }
};
</script>

<style lang="less">
#settings{
    @common-color: #3f8def;
    .box {
      padding: 0px 20px 0px 20px;
    }
    .title{
        font-size: 14px;
        font-weight: 700;
        margin-bottom: 15px;
        padding:0px 
    }
    .list {
      .row {
        margin: 12px 0 24px 0;
        .row-content {
          background: #f5f5f5;
        }
        .user {
            padding: 0px 24px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            >div{
                flex: 0 0 33%;
                display: flex;
                align-items: center;
                span{
                    margin: 0 10px;
                }
                .el-input-number__decrease ,.el-input-number__increase{
                    display: none;
                }
                .el-input__inner , .el-input,.el-input-number,.el-form-number{
                    width: 60px ;
                    padding: 0 ;
                    margin:5px 0px;
                }
            }
        }
        .message{
            padding: 24px 24px; 
            border-collapse:collapse;
            li{
                border: 1px solid #e2e2e2;
                width:64px;
                height:36px;
                line-height: 36px;
                margin-top:-1px; 
                margin-right:-1px; 
            }
            .table{
                display: flex;
                .thead{
                    .theadOne{
                        height: 80px;
                        
                    }
                    >li{
                        text-align: center;
                        width: 128px;
                    }
                }
                .tbody{
                    .userInfo{  
                      height: 80px; 
                      p{
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        line-height: normal;
                        padding:0 5px;
                        height:48px;
                      }
                    }
                }

            }
            .out {
                position: relative; 
                height: 36px;
                b {
                    font-style: normal;
                    font-weight: normal;
                    display: block;
                    top: 5px;
                    right: 12px;
                    position: absolute;
                }
                em {
                    font-style: normal;
                    display: block;
                    position: absolute;
                    top: 30px;
                    left: 12px;
                }
            }
        }
      }
    }
    .el-checkbox{
        display: block;
        border: 1px solid #e2e2e2;
        width:64px;
        height:36px;
        line-height: 36px;
        margin-top:-1px; 
        margin-right:-1px;
        text-align: center;
    }
    .el-checkbox+.el-checkbox{
        margin-left: 0px;

    }
    .userInfo{
        .el-checkbox{
            border: 0;
            
        }  
    }
    .el-checkbox__label{
        display: none;
    }
    .submitBtn{
        display: flex;
        justify-content: center;
    }
}

</style>