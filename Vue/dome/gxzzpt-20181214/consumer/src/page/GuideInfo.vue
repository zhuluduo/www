<template>
    <div class="GuideInfo">
        <div class="box">
            <div class="bread-crumb">
                <span class="crumb-level" @click="$router.push({path:'/index'})">首页</span> >
                <span>供应商注册</span> >
                <span class="crumb-level2">完善资料</span>
            </div>
            <div class="list">
                <div class="list-Title" v-if="isShow">
                    <p>恭喜您，{{user.companyName}}注册成功!</p>
                    <div>参与报价您需要完善以下信息, 不完善以下信息将导致您无法参与报价, 且企业不会被收入供应商库, 导致无法被搜索到。</div>
                </div>
                <div class="row">
                    <div class="row-col">
                        <div  class="title">
                            <span>{{SettingListInvoice.settingName}}</span>
                            <i>请选择企业可以开具的发票类型</i>
                        </div>
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
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  labelPosition='left' label-width="35px" class="demo-ruleForm">
                        <div class="row-col-form">
                            <div class="title">
                                <span>{{SettingPayInfo.settingName}}</span>
                                <i>订单交易过程中的货款将汇入该账号</i>
                            </div>
                            <div class="row-content">
                                <div class="YLZF">
                                    <div class="BankName">
                                        <el-form-item label="银行:" prop="BankName">
                                            <el-input v-model="ruleForm.BankName" placeholder="请输入银行" maxlength='10'></el-input>
                                            <!-- <el-select
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
                                            </el-select> -->
                                        </el-form-item>
                                    </div>
                                    <div class="YLAccount">
                                        <el-form-item label="账号:" prop="YLAccount">
                                            <el-input v-model="ruleForm.YLAccount"  placeholder="未填"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="YLName">
                                        <el-form-item label="姓名:" prop="YLName">
                                            <el-input v-model="ruleForm.YLName" placeholder="未填"></el-input>
                                        </el-form-item>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row-col-form">
                            <div class="title">
                                <span>{{SettingListContract.settingName}}</span>
                                <i>询盘过程中生成电子合同时将使用以下信息</i>
                            </div>
                            <div class="row-content">
                                <div class="contract">
                                    <div class="contractAddress">
                                        <el-form-item label="住所:" prop="contractAddress">
                                            <el-input v-model="ruleForm.contractAddress"  placeholder="未填"></el-input>
                                        </el-form-item>
                                    </div>
                                    <div class="contractPhone">
                                        <el-form-item label="电话:" prop="contractPhone">
                                            <el-input v-model="ruleForm.contractPhone" placeholder="未填"></el-input>
                                        </el-form-item>
                                    </div>
                                </div>
                            </div>
                        </div>
                         <div class="row-col-form">
                            <div class="title">
                                <span>{{SettingListCategory.settingName}}</span>
                                <i>企业主要涉及的工艺，最多选择10项</i>
                            </div>
                            <div class="row-content">
                                <div class="contract">
                                    <div class="category">
                                        <el-form-item label="工艺:" prop="categoryName">
                                           <div class="categoryContent"> {{ruleForm.categoryName}} </div>
                                        </el-form-item>
                                    </div>
                                    <div class="CommonTreeBtn">
                                        <CommonTree  v-on:get-currentKey="getCurrentKey"  :checked-keys="SelectDatas" :expand-all="false" :set-width="width" :set-title='title' :btn-name='btnName' :switch-state='true' max-length='20'></CommonTree>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </div>
            </div>
            <div class="btn-box">
               <span @click="saveSetting" class="btn">提交信息</span>
               <div class="anchorPoint">
                   <em></em>
                   <i>跳过，我要过去</i>
                   <span @click="$router.push({path:'/enquiry/list'})">查看询盘</span>
               </div>
            </div>
        </div>
    </div>
</template>

<script>
    //表单引入；
    import { validatNumber , validatePhone} from '../lib/validate.js'
    import operationBar from '../components/operationBar.vue';
    import addBtn from '../components/addButton.vue';
    import CommonTree from './Tree-common'
    export default {
        components: {
            'v-button':addBtn,
            'v-operation': operationBar,
            CommonTree
        },
        data() {
            return {
                SettingListInvoice:[],
                SettingListContract:[],
                SettingPayInfo:[],
                checkedDelivery:[],
                checkedInvoice:[],
                SettingListCategory:[],
                options: [],
                user:{},
                isShow:true,
                ruleForm: {
                    BankName:'',
                    YLAccount:'',
                    YLName:'',
                    contractPhone:'',
                    contractAddress:'',
                    categoryName:'',
                },
                rules: {
                    YLName: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                    ],
                    YLAccount: [
                        { required: true, validator: validatNumber, trigger: 'blur' },
                    ],
                    BankName: [
                        { required: true, message:'请输入选择的银行', trigger: 'change' },
                    ],
                    contractAddress: [
                        { required: true, message:'请输入地址', trigger: 'blur' },
                    ],
                    contractPhone: [
                        { required: true, validator: validatePhone, trigger: 'blur' },
                    ],
                    categoryName: [
                        { required: true, message: '请选择工艺' },
                    ],
                },
                SelectDatas:[],
                width:'30%',
                title:'添加工艺',
                btnName:'添加工艺'
            }
        },
        // beforeRouteEnter (to, from, next) {
        // // 这里还无法访问到组件实例，this === undefined
        //     next( vm => {
        //         if(from.path=='/enquiry-detail'){
        //            vm.isShow=false
        //         }
        //         // 通过 `vm` 访问组件实例
        //     })
        // },
        created(){
            this.isShow=this.$route.query.isShow||true;
            this.getSettingList();
            // this.getWords();
            this.user =JSON.parse(localStorage.getItem('gxzzpt2_consumer'));
        },
        methods:{
            getSettingList(){
                this.$http.post("custom/company/getUpdateTemplate").then(res => {
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
                            if(ele.settingType==220030){
                                this.SettingPayInfo=ele;
                                this.ruleForm.BankName=ele.settingList.bankName;
                                this.ruleForm.YLAccount=ele.settingList.accountNo;
                                this.ruleForm.YLName=ele.settingList.accountName;
                            }
                            if(ele.settingType==220040){
                                this.SettingListContract=ele;
                                this.ruleForm.contractAddress=ele.settingList.address;
                                this.ruleForm.contractPhone=ele.settingList.tel;
                            }
                            if(ele.settingType==220050){
                                this.SettingListCategory=ele;
                                if(ele.settingList.length==0){
                                    this.btnName=='添加工艺';
                                }else{
                                    this.btnName=='修改工艺';
                                }
                                this.SettingListCategory.settingList.forEach(ele=>{
                                    this.SelectDatas.push(ele.techniqueId);
                                    this.ruleForm.categoryName += ele.techniqueName+', ';
                                })
                                //字符串拼接
                                let categoryName = this.ruleForm.categoryName;
                                this.ruleForm.categoryName=categoryName.slice(0,categoryName.length-2)

                            }
                        });
                    }
                }).catch(res => {});
            },
            saveSettingAPI(Arr){
                this.$http.post("/custom/company/updateMoreInfo",{"settings":Arr}).then(res => {
                    if (res.data.code == 200) {
                        this.$message({
                            type: "success",
                            message: res.data.message
                        })
                        setTimeout(()=>{
                            if(this.isShow){
                                this.$router.push({path:'/usercenter/company-information'});
                            }else{
                            this.$router.push({path:'/enquiry/list'});
                            }
                        },1000)
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
                        this.SettingPayInfo.settingList.accountNo=this.ruleForm.YLAccount;
                        this.SettingPayInfo.settingList.accountName=this.ruleForm.YLName;
                        this.SettingPayInfo.settingList.bankName=this.ruleForm.BankName;
                        this.SettingListContract.settingList.address=this.ruleForm.contractAddress;
                        this.SettingListContract.settingList.tel=this.ruleForm.contractPhone;
                        this.SettingListCategory.settingList=this.SelectDatas;
                        Arr.push(this.SettingListInvoice)
                        Arr.push(this.SettingListContract)
                        Arr.push(this.SettingPayInfo)
                        Arr.push(this.SettingListCategory)
                        this.saveSettingAPI(Arr)
                    } else {
                        return false;
                    }
                });
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
                let words=JSON.parse(window.localStorage.getItem('words'))
                this.options = words["149"].item;
            },
            getCurrentKey(takeDate,keyDate){
                this.ruleForm.categoryName='';
                takeDate.forEach(ele=>{
                    this.ruleForm.categoryName += ele.techniqueName+', ';
                })
                //字符串拼接
                let categoryName = this.ruleForm.categoryName;
                this.ruleForm.categoryName=categoryName.slice(0,categoryName.length-2)
                this.SelectDatas=keyDate;
            },
            // getWords() {
            //     let words=JSON.parse(window.localStorage.getItem('words'))
            //     this.options = words["149"].item;
            // },
        }
    }
</script>


<style lang="less">
    .GuideInfo{
        // font-size: 12px;
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
            left: 0px;
            width: 250px;
            .crumb-level:hover{
                text-decoration:underline;
                cursor: pointer;
            }
            .crumb-level2{
                color: #3f8def;
            }
        }
        .box {
            padding:0 42px;
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
            padding-top:24px;
            .list-Title{
                font-weight: bold;
                p{
                    font-size: 16px;
                    padding-bottom: 35px;
                    color: #3f8def;

                }
                div{
                    font-size: 14px;
                    padding-bottom: 28px;
                }
            }
            .row {
                display: flex;
                .row-col {
                    flex: 1;
                    padding-bottom: 20px;
                }
                .row-col-form{
                     flex: 1;
                     padding-bottom:7px;
                }
                .settingList{
                    display: flex;
                    justify-content: flex-start;
                }
                .YLZF,.contract{
                    display: flex;
                }
                .BankName,.YLAccount{
                    width: 213px;
                }
                .category{
                    width:  453px;
                    .categoryContent{
                        padding: 0 10px;
                        white-space:pre-wrap;
                        min-height: 26px;
                        border: 1px solid #d0d0d0;
                        cursor: not-allowed;
                    }
                }
                .BankName{
                    margin-right:27px;
                }
                .contractAddress{
                    width: 453px;
                }
                .contractPhone,.YLName{
                    width: 252px;
                    margin-left: 27px;
                }

            }
        }
        .title{
            margin-bottom:8px;
            span{
                font-weight: 700;
                color: #777777;
                margin-right: 15px;
            }
            i{
                font-style: normal;
                color: #a09f9f;
            }

        }
        .btn-box{
            width: 722px;
            padding: 30px 0 155px;
            margin-left: 44px;
            display: flex;
            align-content: center;
            .btn{
                width: 218px;
                height: 38px;
                background-color: #3f8def;
                border-radius: 4px;
                font-size: 14px;
                line-height: 38px;
                color: #fff;
                text-align: center;
                cursor: pointer;
            }
            .anchorPoint{
                margin-left: 40px;
                height: 38px;
                display: flex;
                align-items: center;
                cursor: pointer;
                span{
                    color: #3f8def;
                    text-decoration:underline;
                    margin-left:4px;
                }
                em{
                    width: 17px;
                    height: 12px;
                    margin-right: 5px;
                    background-image: url('../../static/img/nextStep.png');
                }
            }

        }
        .InvoiceList{
            width: 722px;
            .el-checkbox-group{
                display: flex;
                flex-wrap: wrap;
                .el-checkbox{
                    flex: 0 0 25%;
                    margin: 5px 0;
                }
            }
        }
        .el-checkbox__label,.el-form-item__label,.el-input {
            font-size: 12px;
        }
        .CommonTreeBtn{
            margin-left: 10px;
            .el-button--primary{
                padding: 6px 20px;
            }
            .el-button{
                width: 120px;
                padding: 6px 20px;

            }
        }
        .el-form-item__label{
            padding: 0 6px 0 0;
        }
    }
</style>
