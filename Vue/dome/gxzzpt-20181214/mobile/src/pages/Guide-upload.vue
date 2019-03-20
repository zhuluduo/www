<template>
    <div id="uploadComInfo">
        <div class="uploadBox">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="demo-ruleForm">
                <el-form-item > 
                    <div class="uploadImgTitle require">企业营业执照:</div> 
                    <div class="uploadImgConent">
                        <My-upload 
                            @on-success="LicenseSuccess"
                            @on-remove="LicenseRemoved"  
                            @before-upload="beforeAvatarUpload"
                            :setImgArr='LicenseImg' 
                            >
                        </My-upload>
                    </div>
                </el-form-item>
                <el-form-item> 
                    <div class="uploadImgTitle require">银行开户证明:</div> 
                    <div class="uploadImgConent">
                        <My-upload 
                            @on-success="BankAccountSuccess"
                            @on-remove="BankAccountRemoved"  
                            @before-upload="beforeAvatarUpload"
                            :setImgArr='BankAccountImg'>
                        </My-upload>
                    </div>
                </el-form-item>
                <el-form-item> 
                    <div class="uploadImgTitle">企业LOGO:</div>
                    <div class="uploadImgConent">
                        <My-upload 
                            @on-success="LogoSuccess"
                            @on-remove="LogoRemoved" 
                            @before-upload="beforeAvatarUpload"
                            :setImgArr='LogoImg'>
                        </My-upload>
                    </div> 
                </el-form-item>
            </el-form>
        </div>
        <div class="operaBtn">
            <span class="goToPreSTEP" @click="$router.push({path:'/Guide-info'})">上一步</span>
            <span class="submitBtn" @click="submitFrom('ruleForm')">提交</span>
        </div>
    </div>
</template>
<script>
import MyUpload from '../components/upload.vue';
import CompanyService from '../services/CompanyService.js';
import { Toast } from 'mint-ui';
export default {
    data() {
        return {
            CompanyService:new CompanyService(),
            LicenseImg:[],
            BankAccountImg:[],
            LogoImg:[],
            LicenseData:{},
            BankAccountData:{},
            LogoData:{},
            ruleForm: {
              
            },
            rules:{
              
            },
            paramsData:[],
        };
    },
    created() {
        this.getCompanyList();
    },
    components:{
        MyUpload
    },
    methods: {
        async getCompanyList(){
            let res = await this.CompanyService.getCompanyList();
            let resData=res.data.length>0?res.data:[];
            this.paramsData=resData;
            resData.forEach(ele=>{
                if(ele.settingType==220010){
                    let settingList= ele.settingList.length>0?ele.settingList:[];
                    settingList.forEach(ele=>{
                    
                    })
                }
                if(ele.settingType==220060){
                    let settingList= ele.settingList.length>0?ele.settingList:[];
                    settingList.forEach(item=>{
                        if(item.certType==320030){
                            this.LicenseData.id=item.id;
                            this.LicenseData.certType=item.certType;
                            this.LicenseData.fileId=item.fileId;
                            this.LicenseImg.push({'url':item.fileUrl})
                        }
                        if(item.certType==320040){
                            this.BankAccountData.id=item.id;
                            this.BankAccountData.certType=item.certType;
                            this.BankAccountData.fileId=item.fileId;
                            this.BankAccountImg.push({'url':item.fileUrl})
                        }
                        if(item.certType==329990){
                            this.LogoData.id=item.id;
                            this.LogoData.certType=item.certType;
                            this.LogoData.fileId=item.fileId;
                            this.LogoImg.push({'url':item.fileUrl})
                        }
                    })
                }
            })
        },
        //图片上传成功的操作；
        LicenseSuccess(data){
            this.LicenseData={};
            this.LicenseData.fileId=data[0].id;
            this.LicenseData.certType="320030";
        },
        LogoSuccess(data){
            this.LogoData={};
            this.LogoData.fileId=data[0].id;
            this.LogoData.certType="329990";
        },
        BankAccountSuccess(data){
            this.BankAccountData={};
            this.BankAccountData.fileId=data[0].id;
            this.BankAccountData.certType="320040";
        },
        LicenseRemoved(){
            this.LicenseData={};
        },  
        //图片移出的操作； 
        BankAccountRemoved(){
            this.BankAccountData={};
        },   
        LogoRemoved(){
            this.LogoData={};
        }, 
        //图片上传前的回调函数；  
        beforeAvatarUpload(file) {
            let ValidFingleFile =function(res){
              let flag = true;
              //文件类型及大小验证；
              if(!/\.(jpg|png|JGP|PNG)$/.test(file.name)) {
                Toast({message: '上传头像图片只能是 jpg/png/JGP/PNG 格式!'});
                flag = false
                return false;
              }
              if (file.size / 1024 / 1024 > 0.2) {
                Toast({message: '上传头像尺寸不能超过0.2M'});
                flag = false;
                return false;
              }
              return flag;
            }
            let result = ValidFingleFile(file);
            this.$bus.$emit('beforeUploadFile', result)
        },
        handleApiData(){
            //获取上一级储存本地数据；
            let  localityData = JSON.parse(localStorage.getItem('companyInfo'));
            let  FromData = localityData.GuideInfoForm;
            this.paramsData.forEach(ele=>{
                if(ele.settingType==220010){
                    ele.settingList=localityData.SettingListInvoice;
                }
                if(ele.settingType==220030){
                    ele.settingList.accountName = FromData.accountName;
                    ele.settingList.accountNo = FromData.bankAccount;
                    ele.settingList.bankName = FromData.bankName; 
                }
                if(ele.settingType==220040){
                    ele.settingList.address =FromData.address;
                    ele.settingList.tel =FromData.tel;
                }
                if(ele.settingType==220050){
                    ele.settingList = FromData.techniqueId;
                }
                if(ele.settingType==220060){
                    ele.settingList = [];
                    if(this.LicenseData.certType){
                        ele.settingList.push(this.LicenseData);
                    }
                    if(this.BankAccountData.certType){
                        ele.settingList.push(this.BankAccountData);
                    }
                    if(this.LogoData.certType){
                        ele.settingList.push(this.LogoData);
                    }
                }
                if(ele.settingType==220070){
                    ele.settingList = FromData.industryId
                }
            })
            let Data={"settings": this.paramsData}
            return Data;
        },
        //提交；
        submitFrom(formName){
            let params = this.handleApiData();
            let uploadRequireFlag = this.LicenseData.fileId&&this.BankAccountData.fileId;
            if(uploadRequireFlag){
                this.SaveCompanyApi(params)
            }else{
                Toast({message: '请上传图片'});
            }
        },
        //调用保存完善公司信息的接口;
        async SaveCompanyApi(params){
            let res = await this.CompanyService.SaveCompanyData(params);
            if(res.code==200){
                Toast({message: '提交成功!'});
                setTimeout(()=>{
                    localStorage.removeItem("companyInfo")//清除本地储存的数据；
                    this.$router.push({path:'/Guide-complete'})
                },1000)
            }else{
                Toast({message: '提交失败,请检查提交内容!'});
            }
        },
    }
};
</script>
<style lang="scss" scoped>
    $mainColor:#3f8def;
    #uploadComInfo{
        height:100%;
        .uploadBox{
            background-color: #fff;
            margin-top:20px;
            padding-bottom: 10px;
            .uploadImgTitle{
                font-size: 26px;
                padding-bottom: 16px;
            }
            .uploadImgConent{
                padding-left: 20px;
            }
            .require::before{
                content: '*';
                color: #f56c6c;
                padding-right:10px;
                line-height: 26px;
            }
        }
        .operaBtn{
            margin-top: 42px;
            display: flex;
            justify-content: center;
            >span{
                background-color: $mainColor;
                height: 60px;
                width: 240px;
                color: #fff;
                text-align: center;
                line-height: 60px;
                border-radius: 6px;
            }
            .goToPreSTEP{
                background-color: #f1f1f1;
                color: $mainColor;
                border:1px solid $mainColor;
                margin-right: 26px;
            }
        }
    }
</style>



