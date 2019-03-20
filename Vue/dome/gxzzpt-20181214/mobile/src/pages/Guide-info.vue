<template>
    <div id="Guide-info">
        <div class="GuideInfoTitle">
          恭喜您，供应商XXXXX公司注册成功！请完善以下信息下次再填，<span class="linkTo" @click="$router.push({path:'/index'})">跳过</span>
        </div>

        <div class="GuideInfoConent">
          <el-form :model="GuideInfoForm" :rules="GuideInforules" ref="GuideInfoForm" class="GuideInfoForm">
            <div class="GuideInfoConentTop">
              <el-form-item prop="techniqueId">  
                  <el-input class="required"  v-if="TechnologyList.length==0"  @focus="OpenDialog(true)"  v-model="GuideInfoForm.techniqueId[0]" placeholder="工艺（企业主要涉及的工艺）">
                  </el-input>
                  <div @click="OpenDialog(true)"  v-else class="itemIner">
                    <span v-for="(item,index) in TechnologyList" :key='index'>{{item.techniqueName}}&nbsp;&nbsp;</span>
                  </div>
              </el-form-item>
              <el-form-item  prop='industryId'>
                  <el-input class="required"  @focus="OpenDialog(false)" v-if="industryList.length==0" v-model="GuideInfoForm.industryId[0]" placeholder="工艺（企业主要涉及的工艺）"></el-input>
                  <div @click="OpenDialog(false)" v-else class="itemIner">
                    <span v-for="(item,index) in industryList" :key='index'>{{item.industryName}}&nbsp;&nbsp;</span>
                  </div>
              </el-form-item>
              <el-form-item prop="address">
                <el-input class="required" v-model="GuideInfoForm.address" placeholder="签合同用的企业住所"></el-input>
              </el-form-item>
              <el-form-item prop="tel">
                <el-input class="required" v-model="GuideInfoForm.tel" placeholder="签合同用的企业联系电话"></el-input>
              </el-form-item>
              <el-form-item prop="accountName">
                <el-input  class="required" v-model="GuideInfoForm.accountName" placeholder="交易过程中汇款用到的银行开户名"></el-input>
              </el-form-item>
              <el-form-item prop="bankName">
                <el-input  class="required" v-model="GuideInfoForm.bankName" placeholder="交易过程中汇款用到的银行"></el-input>
              </el-form-item>
              <el-form-item prop="accountNo">
                <el-input class="required" v-model="GuideInfoForm.accountNo" placeholder="交易过程中汇款用到的银行账号"></el-input>
              </el-form-item>
            </div>
            <div class="GuideInfoConentBottom">
              <div class="invoiceTitle">
                支持发票（企业可开具的发票）
              </div>
              <div class="invoiceContent">
                <el-form-item prop="invoiceListId">
                  <el-checkbox-group v-model="GuideInfoForm.invoiceListId"  @change="handleCheckedInvoice">
                    <el-checkbox v-for="item in SettingListInvoice" :label="item.id" :key="item.id" >
                      {{item.invoiceTitleTypeText}}{{item.invoiceTypeText}}{{item.taxRate*100}}%
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </div>
            </div>
          </el-form>
          <div @click="submitForm('GuideInfoForm')" class="nextStep">下一步</div>
        </div>

        <DialogSlot :toggle.sync='toggle' :direction='"right"' :WH='"100%"'>
          <div class="scroll-list-wrap" ref="wrapper">
            <div class="clear scrollListTitle">
              <div v-if="isShow" class="left">请选择工艺（<span>最多20项</span>）：</div>
              <div class="left" v-else>请选择行业（<span>最多5项</span>）：</div>
              <div class="right iconfont icon-cancel cancelBtn" @click="toggle=false"> </div>
            </div>
            <div class="scrollBox" ref="scrollBox">
                <div class="list-wrapper">
                  <mt-checklist
                    v-model="GuideInfoForm.techniqueId"
                    v-if="isShow"
                    :options="TempTechnologyOptions"
                    :max='20'>
                  </mt-checklist>
                  <mt-checklist  v-else
                    v-model="GuideInfoForm.industryId"
                    :options="TempIndustryOptions"
                    :max='5'>
                  </mt-checklist>
                </div>
            </div>
            <div class="btnBox">
              <span class="cancelBtn" @click="toggle=false">取消</span>
              <span class="EnsureBtn" @click="submitToggle(isShow)">确定</span>
            </div>
          </div>
        </DialogSlot>
    </div>
</template>
<script>
import {validatePhone,validatNumber} from '../common/validate.js'
import CompanyService from '../services/CompanyService.js'
import LoginService from '../services/LoginService.js'
import DialogSlot from '../components/DialogSlot.vue'
export default {
  data() {
    return {
      CompanyService:new CompanyService(),
      LoginService: new LoginService,
      SettingListInvoice:[],
      TempTechnologyOptions:[],
      TempIndustryOptions:[],
      TechnologyOptions:[],
      IndustryOptions:[],
      toggle:false,
      isShow:false,
      TechnologyList:[],
      industryList:[],
      GuideInfoForm: {
        industryId:[],
        techniqueId:[],
        address:'',
        tel:'',
        accountName:'',
        bankName:'',
        accountNo:'',
        invoiceListId: [],
      },
      GuideInforules: {
        address: [
          { required: true, message: '请输入住所'},
        ],
        accountName: [
          { required: true, message: '请输入开户名'},
        ],
        bankName: [
          { required: true, message: '请输入银行名'},
        ],
        tel: [
          { required: true, validator: validatePhone }
        ],
        accountNo: [
          { required: true, validator: validatNumber }
        ],
        techniqueId: [
          {required: true, message: '请选择工艺'}
        ],
        industryId:[
          { required: true, message: '请选择行业'}
        ],
        invoiceListId:[
           { type: 'array', required: true, message: '请选择发票选项', trigger: 'change'}
        ],

      }
    }
  },
  created() {
    this.clientHeight = document.body.clientHeight;
    let companyInfo =JSON.parse(localStorage.getItem('companyInfo'));
    if(companyInfo){
      this.GuideInfoForm=companyInfo.GuideInfoForm;
      this.SettingListInvoice=companyInfo.SettingListInvoice;
      this.industryList=companyInfo.industryList;
      this.TechnologyList=companyInfo.TechnologyList;
    }else{
      this.getCompanyList();
    }
    if ( this.$route.query.code ) {
      this.loginService.loginByWechat(this.$route.query.code );
    }
  },
  components:{
    DialogSlot
  },
  mounted() {
    this.getTechNameList();
    this.getIndustryList();
  },
  methods: {
    //获取公司信息；
    async getCompanyList(){
      let res = await this.CompanyService.getCompanyList();
      let resData=res.data.length>0?res.data:[];
      resData.forEach(ele=>{
        if(ele.settingType==220010){
          let settingList= ele.settingList.length>0?ele.settingList:[];
          this.SettingListInvoice=settingList;
          settingList.forEach(ele=>{
            if(ele.value){
              this.GuideInfoForm.invoiceListId.push(ele.id)
            }
          })
        }
        if(ele.settingType==220030){
          let settingList= ele.settingList;
          this.GuideInfoForm.accountName=settingList.accountName;
          this.GuideInfoForm.accountNo=settingList.accountNo;
          this.GuideInfoForm.bankName=settingList.bankName;
        }
        if(ele.settingType==220040){
          let settingList= ele.settingList;
          this.GuideInfoForm.address=settingList.address;
          this.GuideInfoForm.tel=settingList.tel;
        }
        if(ele.settingType==220050){
          this.TechnologyList=ele.settingList.length>0?ele.settingList:[];
          this.TechnologyList.forEach(ele=>{
            this.GuideInfoForm.techniqueId.push(ele.techniqueId)
          })
        }
        if(ele.settingType==220070){
          this.industryList=ele.settingList.industryInfo.length>0?ele.settingList.industryInfo:[];
          if(this.industryList.length>0){
            this.industryList.forEach(ele=>{
              this.GuideInfoForm.industryId.push(ele.id)
            })
          }
        }
      })
    },
    //获取行业名;
    async getIndustryList(){
      let res = await this.CompanyService.getTechnologyList();
      this.industryOptions=res.data;
      this.TempIndustryOptions=[];
      res.data.forEach(ele => {
        let obj={};
        obj.label=ele.industryName;
        obj.value=ele.id;
        this.TempIndustryOptions.push(obj)
      });
    },
    //获取工艺名
    async getTechNameList(){
      let params ={techniquePurpose:'460020'}
      let res = await this.CompanyService.getTechNameList(params);
      this.TechnologyOptions=res.data;
      this.TempTechnologyOptions=[];
      res.data.forEach(ele => {
        let obj={};
        obj.label=ele.techniqueName;
        obj.value=ele.id;
        this.TempTechnologyOptions.push(obj)
      });
    },
    //划入框逻辑
    OpenDialog(flag){
      this.toggle=true;
      this.isShow=flag
    },
    //提交划入框逻辑；
    submitToggle(flag){
      //局部验证；
      this.$refs.GuideInfoForm.validateField('techniqueId',function(valid) {
      })
      this.$refs.GuideInfoForm.validateField('industryId',function(valid) {
      })
      if(flag){
        this.TechnologyList=[];
        this.TechnologyOptions.forEach((ele)=>{
          this.GuideInfoForm.techniqueId.forEach(item=>{
            if(item==ele.id){
              this.TechnologyList.push(ele)
            }
          }) 
        });
      }else{
        this.industryList=[];
        this.industryOptions.forEach((ele)=>{
          this.GuideInfoForm.industryId.forEach(item=>{
            if(item==ele.id){
              this.industryList.push(ele)
            }
          })
        })
      }
      this.toggle=false;
    },
    //checkbox点击事件
    handleCheckedInvoice(value){
      this.SettingListInvoice.forEach(item=>{
          if(value.indexOf(item.id) == -1){
              item.value=false;
          }else{
              item.value=true;
          }
      })
    },
    //下一步保存数据到本地；
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let obj={};
          obj.GuideInfoForm=this.GuideInfoForm;
          obj.TechnologyList=this.TechnologyList;
          obj.industryList=this.industryList;
          obj.SettingListInvoice=this.SettingListInvoice;
          localStorage.setItem('companyInfo',JSON.stringify(obj));
          this.$router.push({path:'/Guide-upload'})
        } else {
          window.scrollTo(0, 0);
          return false;
        }
      });
    },
  }
}
</script>

<style lang="scss" scoped>
$mainColor:#3f8def;
#Guide-info{
  position: relative;
  width: 100%;
  .GuideInfoTitle{
    line-height: 35px;
    padding:17px 20px 12px ;
    font-size: 26px;
  }
  .GuideInfoConent{
    .GuideInfoConentTop{
      padding-top: 20px;
      .placeholderText{
        color: #a09f9f;
      }
      .itemIner{
        display: flex;
        flex-wrap:wrap; 
        align-items: center;
        min-height: 88px;
        font-size: 28px;
        border: solid 1px #d0d0d0;
        padding: 0px 0 0 28px;
        >span{
          line-height: 36px;
        }
      }
      .itemIner::before{
        position: absolute;
        content: '*';
        font-size: 16px;
        color: #f56c6c;
        margin-left:-16px; 
      }
    }
    .GuideInfoConentBottom{
      .invoiceTitle{
        height: 88px;
        line-height: 88px;
        background-color: #f1f1f1;
        padding:0 28px;
        position: relative;
      }
      .invoiceTitle::before{
        content: '*';
        color: #f56c6c;
        position: absolute;
        left: 20px;
        font-size: 12px;
        top: 0px;
      }

    }
    .nextStep{
      margin: 40px 20px 0;
      height: 88px;
      background-color: #3f8def;
      border-radius: 10px;
      line-height: 88px;
      font-size: 30px;
      text-align: center;
	    color: #ffffff;
    }
  }
  .scroll-list-wrap {
    position: relative;
    height: 100%;
    padding:0 23px 160px;
    .scrollListTitle{
      >div{
        height: 88px;
        padding: 28px 0;
        font-size: 32px;
      }
      .left{
        >span{
          color: #a09f9f;
        }
      }
      .cancelBtn{
        text-align: right;
        width: 100px;
      }
    }
    .btnBox{
      position: fixed;
      display: flex;
      bottom: 0;
      justify-content: space-around;
      padding: 26px 0 71px;
      width: 100%;
      background-color: #fff;
      span{
        height: 60px;
        width: 240px;
        text-align: center;
        line-height: 60px;
        border-radius: 6px;
      }
      .EnsureBtn{
        background-color: $mainColor;
        color: #fff;
      
      }
      .cancelBtn{
        background-color: #fff;
        border: solid 2px #dfdfdf;
      }
    }
  }
}
.fz26 {font-size: 26px;}
.fz24 {font-size: 24px;}
// .required2 {
//   position: relative;
//   top: 0px;
//   left: 0px;
// }
// .itemIner1{
//   position: relative;
//   top: 0px;
//   left: 0px;
//   z-index: 22;
// }
</style>

<style lang="scss">
.list-wrapper{
  .mint-checklist{
    display: flex;
    flex-wrap: wrap;
    .mint-checklist-title{
      display: none;
    }
    .mint-cell-wrapper,.mint-cell:last-child{
      background-image:none;
    }
    .mint-checklist-label{
      padding:10px 0;
      display: flex;
      align-items: center;
      font-size: 26px;
      .mint-checkbox-label{
        line-height: 26px;
        color:#6b6b6b;
      }
      .mint-checkbox-core{
        width:34px;
        height: 34px;
      }
      .mint-checkbox-core::after {
        top: 10%;
        left: 38%;
        width: 8px;
        height: 18px;
      }
    }
    .mint-cell{
      flex: 0 0 50%;
    }
  }
  .mint-checklist-label{
  } 
}
</style>