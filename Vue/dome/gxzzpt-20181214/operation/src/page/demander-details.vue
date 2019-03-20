<template>
  <div>
    <el-breadcrumb separator="/">
        <el-breadcrumb-item>需求方管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/main/demander-manage'}">企业需求方管理</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="box">
        <div class="list">
            <div class="row ">
                <div class="row-col">
                    <p class="title">联系人信息：</p>
                    <div class="row-content user">
                        <p>联系人：{{extendInfo.contacts}}</p>
                        <p>联系电话：{{adminInfo.phone}}</p>
                        <p>邮箱：{{adminInfo.email}}</p>
                        <p>登录帐号：{{adminInfo.username}}</p>
                        <p>密码:<b @click="passwordReset" class="passwordReset">重置</b></p>
                        <p></p>
                    </div>
                </div>
            </div>
            <div class="row ">
                <div class="row-col">
                    <p class="title">企业信息：</p>
                    <div class="row-content Info">
                        <div class="conpanydetailInfo">
                            <p>企业全称：{{tableData.companyName}}</p>
                            <p>企业简称：{{tableData.shortName}}</p>
                            <p>企业分类：{{tableData.companyTypeStr}}</p>
                            <p>法人代表：{{extendInfo.legalPerson}}</p>
                            <p>法人代表身份证：{{extendInfo.legalPersonNo}}</p>
                            <p>营业执照编号：{{extendInfo.businessCode}}</p>
                        </div> 
                        <p>营业执照照片：</p>
                        <div>
                            <img :src="extendInfo.businessUrl" alt="">
                        </div>
                        <div class="tempbtn">
                            <el-button plain  @click="returnBack">返回</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- <div class="row ">
                <div class="row-col">
                    <p class="title">审核:</p>
                    <div class="row-content audit">
                        <div>
                            <span>审核结果:</span>
                            <el-radio v-model="radio1" label='190020'>通过</el-radio>
                            <el-radio v-model="radio1" label='190030'>不通过</el-radio>
                        </div>
                        <div class="textBox">
                            <span>说明：</span>
                            <el-input
                            type="textarea"
                            :rows="2"
                            placeholder="请输入内容"
                            v-model="textarea">
                            </el-input>
                        </div>
                        <div>
                            <span>通知方式:</span>
                            <el-radio v-model="radio2" label="3">通过邮件发送审核结果</el-radio>
                        </div>
                        <div class="btn">
                            <el-button plain style="margin-right:100px;width:120px" @click="returnBack">返回</el-button>
                            <el-button plain style="width:120px" @click="submit">提交</el-button>
                        </div>
                    </div>
                </div>
            </div> -->
        </div>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            radio1:'',
            radio2:'3',
            textarea:'',
            tableData:[],
            extendInfo:[],
            adminInfo:[],
        }
    },
    created(){
        this.getCompanyDetail();
    },
    methods:{
        getCompanyDetail(){
           let objquery=Number(this.$route.query.companyId);
            this.$http.post("/operation/company/getCompanyDetail",{"companyId":objquery}).then(res => {
                if (res.data.code == 200) {
                  this.tableData=res.data.data;
                  this.extendInfo=res.data.data.extendInfo;
                  this.adminInfo=res.data.data.adminInfo
                //   console.log(this.tableData);
                  this.radio1 =String(this.tableData.enterpriseAuditStatus);
                }
            }).catch(res => {});  
        },
        returnBack(){
            this.$router.push({path:'/main/demander-manage'})
        },
        //密码重置
        passwordReset(){
            this.$confirm('是否确定重置密码?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let Params = {
                    userId:this.adminInfo.userId,
                    };
                this.$http.post("/resetPassword",Params).then(res => {
                    if (res.data.code == 200) {
                        this.$message({
                            type: 'success',
                            message: '重置成功!'
                        });
                    }
                }).catch(res => {
                    this.$message({
                        type: 'eerror',
                        message: '重置失败!'
                    })
                });  
                // console.log(requestParams);    
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消重置'
                });          
            });
        },
        //提交按钮;
        submit(){
            let data={
                "companyId":Number(this.$route.query.companyId),
                "isPassed": this.radio1==190020,
	            "remark": this.textarea
            }
            this.$http.post("/operation/company/auditEnterprise",data).then(res => {
                if (res.data.code == 200) {
                    this.$message({
                        type: "success",
                        message: res.data.message
                    });
                }
            }).catch(res => {
                this.$message({
                    type: "error",
                        message: res.data.message
                    });
            }); 
        }
    }


};
</script>

<style lang="less" scoped>
@common-color: #3f8def;
.box {
  padding: 0px 20px 0px 20px;
}
p{
    padding: 12px 0;
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
    display: flex;
    .row-col {
      flex: 1;
      & + .row-col {
        margin-left: 66px;
      }
    }
    .row-content {
      background: #f5f5f5;
      padding: 0px 24px;
    }
    .user {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        p{
            flex: 0 0 33%;
            .passwordReset{
                font-weight: normal;
                margin-left: 30px;
                cursor: pointer;
                text-decoration: underline;
            }
        }
    }
    .Info{
        // height: 400px;
        .conpanydetailInfo{
            width: 100%;
            p{
                display: inline-block;
                width: 33%
            }
        }
        >div{
            img{
                width: 400px;
                height: 200px;
            }
        }
        .tempbtn{
            padding: 15px 0;
            display: flex;
            justify-content: flex-end;
        }
    }
    .audit{
        // height: 200px;
        margin-bottom:100px;
        >div{
            padding: 20px 0;
            span{
               margin-right: 10px; 
            }
        } 
        .textBox{
            width: 500px;
            display: flex;
            align-items: center;
            span{
                width: 60px;
                text-align: center;
            }
        }
        .btn{
            display: flex;
            justify-content: center;
        }
    }
  }
}

</style>