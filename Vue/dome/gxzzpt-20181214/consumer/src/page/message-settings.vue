<template>
  <div id="message-settings">
    <div class="box">
        <v-operation>
            <div slot="right"  class="add-btn" @click="onSubmit()">保存</div>
        </v-operation>
        <div class="list">
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
                            <el-checkbox  :indeterminate="user.isIndeterminate" v-model="user.checkAll" @change="handleCheckAllChange(user)"></el-checkbox>
                        </li>
                        <el-checkbox-group v-model="user.messageTypes"  @change="handleCheckedCitiesChange(user)">
                            <el-checkbox v-for="words in messageData" :label="words.id" :key="words.id" ></el-checkbox>
                        </el-checkbox-group>
                    </div>
                </ul>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import operationBar from '../components/operationBar.vue';
export default {
    components: {
        'v-operation': operationBar,
    },
    data(){
        return{
            settingsList:[],
            messageData:[],
            messageLlist:[],
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
            this.$http.post("/custom/message/getSetting").then(res => {
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
             this.$http.post("/custom/message/saveSetting",requestParams).then(res => {
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
    #message-settings{
        .el-checkbox{
            display: block;
            border: 1px solid #e2e2e2;
            width:100px;
            height:37px;
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
    }
</style>

<style lang="less" scoped>
#message-settings{
    @common-color: #3f8def;
    .box {
        margin: 0 auto;
    }
    .operation-bar{
        height:43px;
        .right{
          button{height: 30px;line-height: 7px;}
        }
    }
    .list {     
        margin: 12px 0 24px 0;
        .message{
            border-collapse:collapse;
            li{
                border: 1px solid #e2e2e2;
                width:100px;
                height:37px;
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
                        width:128px;
                    }
                }
                .tbody{
                    .userInfo{
                        height: 80px; 
                        >p{
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            line-height: normal;
                            padding:0 5px;
                            height:48px;
                            word-break:break-all;
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

</style>