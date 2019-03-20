<template>
    <div class="company-settings">
        <div class="box">     
            <div class="list">
                <div class="row">
                    <div class="row-col">
                        <p class="title">{{SettingListInvoice.settingName}}</p>
                        <div class="row-content settingList InvoiceList">
                            <el-checkbox-group v-model="checkedInvoice" @change="handleCheckedInvoice">
                                <el-checkbox v-for="item in SettingListInvoice.settingList" :label="item.id" :key="item.id">
                                    {{item.invoiceTitleTypeText}}{{item.invoiceTypeText}}{{item.taxRate*100}}%
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="row-col">
                        <p class="title">{{SettingListDelivery.settingName}}</p>
                        <div class="row-content settingList">
                            <el-checkbox-group v-model="checkedDelivery" @change="handleCheckedDelivery">
                                <el-checkbox v-for="item in SettingListDelivery.settingList" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="row-col">
                        <p class="title">收款账号</p>
                        <div class="row-content  Collection">
                            <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  labelPosition='left' label-width="60px" class="demo-ruleForm">
                                <div class="ZFB">
                                    <div class="iconbox">
                                        <img src="../../static/img/ZFBZFicon.png" alt="">
                                        <span>支付宝</span>  
                                    </div>
                                    <div class="account">
                                        <el-form-item label="账号:">
                                            <el-input v-model="ruleForm.ZFBAccount" placeholder="未填"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="account">
                                        <el-form-item label="姓名:">
                                            <el-input v-model="ruleForm.ZFBName" placeholder="未填"></el-input>
                                        </el-form-item>
                                    </div>
                                </div>
                                <div class="WXZF">
                                    <div class="iconbox">
                                        <img src="../../static/img/WXZFicon.png" alt="">
                                        <span>微信</span>  
                                    </div>
                                    <div class="account">
                                        <el-form-item label="账号:">
                                            <el-input v-model="ruleForm.WXAccount" placeholder="未填"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="account">
                                        <el-form-item label="姓名:">
                                            <el-input v-model="ruleForm.WXName" placeholder="未填"></el-input>
                                        </el-form-item>
                                    </div>
                                </div>
                                <div class="YLZF">
                                    <div class="iconbox">
                                        <img src="../../static/img/YLZFicon.png" alt="">
                                        <span>银行支付</span>  
                                    </div>
                                    <div>
                                        <div class="account selectBank">
                                            <el-form-item label="银行:" prop="BankName">
                                                <el-select
                                                    v-model="ruleForm.BankName"
                                                    filterable
                                                    allow-create
                                                    remote
                                                    reserve-keyword
                                                    default-first-option
                                                    placeholder="请选择银行"
                                                    >
                                                    <el-option
                                                    v-for="item in options"
                                                    :key="item.id"
                                                    :label="item.name"
                                                    :value="item.name">
                                                    </el-option>
                                                </el-select>
                                             </el-form-item>
                                        </div>
                                        <div class="account">
                                            <el-form-item label="账号:" prop="YLAccount">
                                                <el-input v-model="ruleForm.YLAccount"  placeholder="未填"></el-input>
                                            </el-form-item>
                                        </div>
                                    </div>
                                    <div class="account">
                                        <el-form-item label="姓名:" prop="YLName">
                                            <el-input v-model="ruleForm.YLName" placeholder="未填"></el-input>
                                        </el-form-item>
                                    </div>
                                </div>
                            </el-form>    
                        </div>
                    </div>
                </div>
            </div>
            <div class="btn-box">
               <button @click="saveSetting" class="btn">保存</button>
            </div>
        </div>
    </div>
</template>

<script>
    //表单引入；
    import { validatNumber} from '../lib/validate.js'   
    import operationBar from '../components/operationBar.vue';
    import addBtn from '../components/addButton.vue';
    export default {
        components: {
            'v-button':addBtn,
            'v-operation': operationBar
        },
         data() {
            return {
                SettingListInvoice:[],
                SettingListDelivery:[],
                settingPayInfo:[],
                checkedDelivery:[],
                checkedInvoice:[],
                options: [  
                    {
                    value: '交通银行',
                    label: '交通银行'
                    },
                    {
                    value: '建设银行',
                    label: '建设银行'
                    }, 
                ],
                ruleForm: {
                    ZFBAccount:'',
                    ZFBName:'',
                    WXAccount:'',
                    WXName:'',
                    BankName:'',
                    YLAccount:'',
                    YLName:'',
                },
                rules: {
                    ZFBName: [
                        { required: true,  message: '请输入姓名',trigger: 'blur' },
                    ],
                    WXName: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                    ],
                    YLName: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                    ],
                    ZFBAccount: [
                        { required: true,  message: '请输入支付宝账号', trigger: 'blur' },
                    ],
                    WXAccount: [
                        { required: true,  message: '请输入微信账号', trigger: 'blur' },
                    ],
                    YLAccount: [
                        { required: true, validator: validatNumber, trigger: 'blur' },
                    ],
                    BankName: [
                        { required: true, message: '请输入选择的银行', trigger: 'change' },
                    ],
                }
            }
        },
        created(){
            this.getSettingList();
            this.getWords();
        },
        methods:{
            getSettingList(){
                this.$http.post("/custom/manufacturer/company/getSetting").then(res => {
                    if (res.data.code == 200) {
                        res.data.data.forEach(ele => {
                            if(ele.settingType==220010){
                                this.SettingListInvoice=ele;
                                this.SettingListInvoice.settingList.forEach(item=>{
                                    if(item.value==true){
                                        this.checkedInvoice.push(item.id)
                                    }
                                })
                            }
                            if(ele.settingType==220020){
                                this.SettingListDelivery=ele;
                                this.SettingListDelivery.settingList.forEach(item=>{
                                    if(item.value==true){
                                        this.checkedDelivery.push(item.id)
                                    }
                                })
                            }
                            if(ele.settingType==220030){
                                this.SettingPayInfo=ele;
                                this.SettingPayInfo.settingList.forEach(item=>{
                                    if(item.accountType==114020){
                                        this.ruleForm.WXAccount=item.accountNo;
                                        this.ruleForm.WXName=item.accountName;
                                    }
                                    if(item.accountType==114010){
                                        this.ruleForm.ZFBAccount=item.accountNo;
                                        this.ruleForm.ZFBName=item.accountName;
                                    }
                                    if(item.accountType==114030){
                                        this.ruleForm.BankName=item.bankName;
                                        this.ruleForm.YLAccount=item.accountNo;
                                        this.ruleForm.YLName=item.accountName;
                                    }
                                })
                            }
                        });
                    }
                }).catch(res => {});  
            },
            saveSettingAPI(Arr){
                this.$http.post("/custom/manufacturer/company/saveSetting",{"settings":Arr}).then(res => {
                    if (res.data.code == 200) {
                        this.$message({
                            type: "success",
                            message: res.data.message
                        })
                    }else {
                        this.$message({
                            type: "error",
                            message: res.data.message
                        });
                    }
                })
            },
            saveSetting(){
                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {
                        const Arr=[];
                        this.SettingPayInfo.settingList.forEach(item=>{
                            if(item.accountType==114020){
                                item.accountNo = this.ruleForm.WXAccount;
                                item.accountName = this.ruleForm.WXName;
                            }
                            if(item.accountType==114010){
                                item.accountNo=this.ruleForm.ZFBAccount;
                                item.accountName=this.ruleForm.ZFBName;
                            }
                            if(item.accountType==114030){
                                item.accountNo=this.ruleForm.YLAccount;
                                item.accountName=this.ruleForm.YLName;
                                item.bankName=this.ruleForm.BankName;
                            }
                        })
                        Arr.push(this.SettingListInvoice)
                        Arr.push(this.SettingListDelivery)
                        Arr.push(this.SettingPayInfo)
                        this.saveSettingAPI(Arr)
                    } else {
                        return false;
                    }
                });
            },
            handleCheckedDelivery(value){
                this.SettingListDelivery.settingList.forEach(item=>{
                    // console.log(item);
                    if(value.indexOf(item.id) == -1){
                        item.value=false;
                    }else{
                        item.value=true;
                    }
                })
            },
            handleCheckedInvoice(value){
                this.SettingListInvoice.settingList.forEach(item=>{
                    if(value.indexOf(item.id) == -1){
                        item.value=false;
                    }else{
                        item.value=true;
                    }
                })
            },
            getWords() {
                this.$http.post("/getWords").then(res => {
                    if (res.data.code == 200) {
                        this.options = res.data.data["149"].item;
                    }
                }).catch(res => {});
            },
        }
    }
</script>


<style lang="less">
    .company-settings{
        @common-color: #3f8def;
        .box {
            padding: 0px 20px 0px 20px;
        }
        .box-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 22px 0px 0px 0px;
            > div {
                height: 30px;
                line-height: 30px;
            }
        }
        .list {
            .row {
                margin-top: 32px;
                display: flex;
                .row-col {
                    flex: 1;
                    & + .row-col {
                        margin-left: 66px;
                    }
                }
                .row-content {
                background: #f5f5f5;
                padding: 20px 24px;
                }
                .settingList{
                    display: flex;
                    justify-content: flex-start;       
                }
                .Collection{
                    .ZFB,.WXZF,.YLZF{
                        display: flex; 
                    }
                    .YLZF{
                        align-items: flex-end;
                        .iconbox{
                            align-self: flex-start;
                        }
                    }
                    .account{
                        margin-right: 59px;
                        width: 290px;
                    }
                    .selectBank{
                        .el-input__inner{
                            width: 230px;
                        }
                    }
                    .iconbox{
                        height: 40px;
                        width: 132px;
                        display: flex;
                        align-items: center;
                        img{
                            display: block;
                            width: 28px;
                            height: 28px;
                            margin-right: 11px;
                        }
                        span{
                            display: block;
                            color: #7d7d7d;
                        }
                    }
                }
            }
        }
        .title{
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 15px;
        }
        .btn-box{
            display: flex;
            justify-content: center;
            align-content: center;
            .btn{
                height: 40px;
                padding: 0 40px;
                margin-top: 40px;
                font-size: 16px;
                line-height: 40px;
                border-radius: 4px;
                border: 0;
                background: #e6e6e6;
                color: #fff;
                cursor: pointer;
                background: #3f8def;
            }
    
        }
        .InvoiceList{
            .el-checkbox-group{
                display: flex;
                flex-wrap: wrap;
                .el-checkbox{
                    flex: 0 0 25%;
                    margin: 5px 0;
                }
            }
        }
    }
</style>
