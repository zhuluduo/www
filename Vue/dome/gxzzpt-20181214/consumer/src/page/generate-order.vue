<template>
  <div class="generate-order">
    <div class="breadcrumb">
        <el-breadcrumb separator=">">
            <el-breadcrumb-item>
              <span @click="$router.push({path:'/index'})" class="cursor">首页</span>
            </el-breadcrumb-item>
            <el-breadcrumb-item>
              <i>生成需求订单</i>
            </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="content">
      <div class="form-box">
        <div class="form-item address-form">
          <div class="form-title">选择收货地址<span class="link" @click="addressDlg.visible=true">新增收货地址</span></div>
          <div class="form-content">
            <el-form ref="addressForm" :model="addressForm.data" :rules="addressForm.rules" class="addressForm">
              <el-form-item prop="address">
                <el-radio-group v-model="addressForm.data.address">
                  <div :class="{'hidden-address-list':addressForm.hidden}" class="address-item" v-for="item in addressForm.addressList" :key="item.id">
                    <el-radio :label="item.id">{{item.province + item.city + item.region +item.address}}  ({{item.contactName}}收)  {{item.contactPhone}}
                      <span v-show="item.isDefault" class="def-address-tag">默认地址</span>
                    </el-radio>
                  </div>
                </el-radio-group>
              </el-form-item>
              <div class="more-address" v-show="addressForm.hidden" @click="addressForm.hidden=false">更多地址</div>
            </el-form>
          </div>
        </div>
        <div class="form-item" v-if="0">
          <div class="form-title required">联系方式</div>
          <div class="form-content">
            <el-form :inline="true" :model="contactForm.data" ref="contactForm" :rules="contactForm.rules">
              <el-form-item label="电话：" prop="phone">
                <el-input disabled v-model="contactForm.data.phone"></el-input>
              </el-form-item>
              <el-form-item label="邮箱：" prop="email">
                <el-input disabled v-model="contactForm.data.email"></el-input>
              </el-form-item>
            </el-form>
            <div class="form-desc">在确认过程中可能需要与您沟通图纸细节问题，请留下您的联系方式方便我们与您沟通.</div>
          </div>
        </div>
        <div class="form-item delivery-form">
          <div class="form-title"> 配送方式</div>
          <div class="form-content">
            <v-checkBtn  :active="item.isSelected" v-for="(item,index) in deliveryForm.expressTypes" :key="index">
             {{item.name}}
            </v-checkBtn>
          </div>
        </div>
        <div class="form-item invoice-form">
          <el-form :model="invoiceForm.formData" ref="invoiceForm"  :rules="invoiceForm.rules" labelPosition='left' label-width="80px" class="invoiceForm">     
              <div class="form-title">发票信息</div>
              <div class="form-content resource-form">
                <el-form-item label="开票方式 :" prop="resource">
                  <el-radio-group v-model="invoiceForm.formData.resource">
                    <el-radio label="150010">纸质发票</el-radio>
                    <el-radio label="150020">电子发票</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="发票类型:" label-width="90px" v-if="invoiceForm.TypeData">
                  <el-radio v-model="invoiceForm.TypeData.invoiceTitleTypeText" :label="invoiceForm.TypeData.invoiceTitleTypeText">{{invoiceForm.TypeData.invoiceTitleTypeText}}  {{invoiceForm.TypeData.invoiceTypeText}} {{invoiceForm.TypeData.taxRate*100}}%</el-radio>
                </el-form-item>
                <div v-if="invoiceForm.TypeData.invoiceType==118020">
                  <el-form-item label="企业名称：" prop="invoiceCompanyName" >
                    <el-input v-model="invoiceForm.formData.invoiceCompanyName"></el-input>
                  </el-form-item>
                  <el-form-item label="纳税号：" prop="taxNo" >
                    <el-input v-model="invoiceForm.formData.taxNo"></el-input>
                  </el-form-item>
                </div> 
              </div>
              <div class="form-title contract">结算方式</div>
              <div class="form-content ">
                <div class="payType">
                  <div v-if="requirementDetail.settlementType==430010">
                    {{requirementDetail.settlementTypeText}}
                  </div>
                  <div v-if="requirementDetail.settlementType==430020">
                    <span>{{requirementDetail.settlementTypeText}}</span>
                    <span>{{requirementDetail.settlementPeriodText}}</span>
                  </div>
                </div>
              </div>
              <div class="form-title contract">
                <span>合同</span>
                <span class="contractDetail">将根据订单内容自动生成商务合同</span>
                <router-link :to="{path:'/contract'}" target="_blank"><span class="modal-name contractDetail">查看合同范本</span></router-link>
              </div>
              <div class="form-content contract-form">
                <el-form-item label="公司抬头:"  prop="contract" label-width="65px">
                  <el-input v-model="invoiceForm.formData.contract"></el-input>
                </el-form-item>
                <el-form-item label="地址:"  prop='address' label-width="45px">
                  <el-input v-model="invoiceForm.formData.address"></el-input>
                </el-form-item>
                <el-form-item label="电话:"  prop='phoneNo' label-width="45px">
                  <el-input v-model="invoiceForm.formData.phoneNo"></el-input>
                </el-form-item>
              </div>
          </el-form>
        </div>
        <div class="form-item goods-form">
          <div class="form-title">商品信息</div>
          <div class="form-table">
            <ul class="table-header">
              <li class="requirement-col tb-col">商品</li>
              <li class="technology-col tb-col">工艺</li>
              <li class="cycle-col tb-col">交货</li>
              <li class="quote-col tb-col">单价</li>
              <li class="quote-col tb-col">数量</li>
              <li class="quote-col tb-col">小计</li>
            </ul>
            <ul class="requirement-table-tr" v-for="(item,index) in requirementDetail.requirementPriceItemList" :key='index'>
              <li class="requirement-col tb-col">
                <div class="goods-info">
                  <div class="left">
                    <div class="imgsmallbox">
                      <img v-if="item.requirementItemInfo.firstModelFileInfo" :src="item.requirementItemInfo.firstModelFileInfo?item.requirementItemInfo.firstModelFileInfo.thumbnailUrl:''" alt="">
                      <div v-else class="no-upload-img">未上传</div>
                    </div>
                    <!-- <div class="imgsmallbox" @click="showProductBigPic">
                      <img :src="item.requirementItemInfo.firstModelFileInfo?item.requirementItemInfo.firstModelFileInfo.thumbnailUrl:''" alt="">
                    </div> -->
                    <!-- <div id="overlay" class="overlay" v-if="isProductShow"  @click="overlay"></div> 
                    <div class="imgbigbox" v-if="isProductShow">
                      <img :src="item.requirementItemInfo.firstModelFileInfo?item.requirementItemInfo.firstModelFileInfo.thumbnailUrl:''" alt="">
                    </div> -->
                    <p>{{item.requirementItemInfo.firstModelFileInfo?item.requirementItemInfo.firstModelFileInfo.fileName:""}}</p>
                  </div>
                  <div class="right">
                    <div>
                      <p>产品名称：{{item.requirementItemInfo?item.requirementItemInfo.itemName:""}}</p>
                      <p>需求编号：{{requirementDetail.requirementInfo?requirementDetail.requirementInfo.requirementNo:""}}</p>
                    </div>
                  </div>
                </div>
              </li>
              <li class="technology-col tb-col">
                <div>
                  <p>{{requirementDetail.requirementInfo.techniqueInfo?requirementDetail.requirementInfo.techniqueInfo.techniqueName:"-"}}</p>
                  <p>{{item.material||'-'}}</p>
                </div>
              </li>
              <li class="cycle-col tb-col">
                 <el-input-number v-model="item.deliveryTime" :precision="0"  :step="1" size="small" :min="1" :max='1000'>
                 </el-input-number>
                <span>{{item.deliveryTimeUnitText}}</span>
              </li>
              <li class="quote-col tb-col">{{item.singlePrice}}元</li>
              <li class="quote-col tb-col">
                <div class="input-num">
                  <el-input-number @change="changePrice(item.quantity,item.id)" :precision="0"  :step="1" v-model="item.quantity" size="small" :min="item.minCount"></el-input-number>
                </div>
              </li> 
              <li class="quote-col tb-col">{{item.singlePrice*item.quantity}}元</li>
            </ul>
          </div>
        </div>
        <div class="form-item  BuyMessage">
          <div class="form-message">
            <div class="BuyMessage-title">留言:</div>
            <div class="left"><el-input v-model="remark" type="textarea"></el-input></div>
            <div class="center">总商品数量：{{totalCount}}</div>
            <div class="right">
              <div><p class="label">合计（含运费）：</p><p class="value">￥{{totalAmount}}</p></div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-footer">
        <div class="total-amount">应付总额（含运费）：<span>￥{{totalAmount}}</span></div>
        <div class="address"><span>寄送至：{{(selectedAddress.province+selectedAddress.city+selectedAddress.region+selectedAddress.address)||"暂无"}}</span><span>收货人：{{selectedAddress.contactName||"暂无"}}</span></div>
      </div>
      <div class="btn-footer">
        <p class="explain-footer">发票：在订单交易成功后为您开具</p>
        <!-- <div class="btn go-to-cart-btn">
            返回购物车
        </div> -->
        <div class="btn submit-btn" @click="submitOrder">提交订单</div>
      </div>
    </div>
    <el-dialog title="添加收货地址" width="640px"  class="address-dlg-form" :visible.sync="addressDlg.visible">
      <div>
        <el-collapse-transition>
          <!-- <div class="form-msg" v-show="errRes">{{errRes}}</div> -->
        </el-collapse-transition>
        <el-form label-position="left" ref="addressDlgForm" :model="addressDlg.formData" :rules="addressDlg.rules" label-width="85px">
          <el-form-item label="收货人：" class="required" prop="name">
            <el-input v-model="addressDlg.formData.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：" class="required" prop="phone">
            <el-input v-model="addressDlg.formData.phone"></el-input>
          </el-form-item>
          <el-form-item label="所在地区：" class="required" prop="selectList">
            <template>
              <div class="select-area">
                <area-select type="text" v-model="addressDlg.formData.selectList" :level="2" :data="$areaData" @change="addressTrigger"></area-select>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="详细地址：" class="required" prop="detail">
            <el-input v-model="addressDlg.formData.detail" type="textarea"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeAddressDlg">取 消</el-button>
        <el-button type="primary" @click="submitDlgForm" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import checkBtn from "../components/checkButton.vue";
//电话，验证引入；
import { validatePhone, validateEmail ,validatNumber,checkNormal} from "../lib/validate.js";
export default {
  components: {
    "v-checkBtn": checkBtn
  },
  data() {
    return {
      count:"",
      requirementIds: "",
      requirementDetail: {},
      selectList: [],
      remark: "",
      isManufacturer:'',
      isProductShow:false,
      addressDlg: {
        visible: false,
        formData: {
          name: "",
          phone: "",
          detail: "",
          province: "",
          city: "",
          region: "",
          selectList:[],
        },
        rules: {
          phone: [
            { required: true, validator: validatePhone, trigger: "change" }
          ],
          name: [{ required: true, message: "请输入收货人", trigger: "blur" }],
          detail: [
            { required: true, message: "请输入详细地址", trigger: "blur" }
          ],
          selectList: [
             { required: true,  message: "请您填写省市区" }
          ]
        }
      },
      addressForm: {
        data: {
          address: ""
        },
        rules: {
          // address:[{validator:validatePhone,trigger:'blur'}],
          // email:[{validator: validateEmail,trigger:'blur'}],
        },
        hidden: true,
        addressList: []
      },
      contactForm: {
        rules: {
          // phone: [{ validator: validatePhone, trigger: "blur" }],
          // email: [{ validator: validateEmail, trigger: "blur" }]
        },
        data: {
          phone: "",
          email: "",
          name: ""
        }
      },
      invoiceForm: {
        formData: {
          invoiceCompanyName : '',
          resource: '',
          taxNo:'',
          contract:'',
          phoneNo:'',
          address:'',
        },
        TypeData:{
        },
        rules: {
          invoiceCompanyName: [
            { required: true, message: '企业名称', trigger: 'blur' },
          ],
          resource: [
            { required: true, message: '请选择发票方式', trigger: 'change' }
          ],
          taxNo:[
            { required: true, validator: validatNumber, trigger: 'blur' }
          ],
          contract: [ 
            { required: true, message: '请输入公司抬头', trigger: 'blur' }
          ],
          phoneNo: [ 
            { required: true, validator: validatePhone, trigger: "change" }
          ],
          address: [ 
            { required: true, message: '请输入地址', trigger: 'blur' }
          ]
        }
      },
      deliveryForm: {
        expressTypes: [],
        selected: {}
      },
      companyContractInfo:[],
    };
  },
  computed: {
    deliveryPeriod:function(){
      if(this.requirementDetail.requirement){
        return this.requirementDetail.requirement.deliveryDeadlineTime+this.requirementDetail.requirement.deliveryTimeTnit
      }
      return "";
    },
    //被选中的地址
    selectedAddress: function() {
      var addressObj = {};
      this.addressForm.addressList.map(item => {
        if (item.id == this.addressForm.data.address) {
          addressObj = item;
        }
      });
      return addressObj;
    },
    //计算总的价格;
    totalAmount: function() {
      let totalAmount = 0
      if (this.requirementDetail.requirementPriceItemList) {
        this.requirementDetail.requirementPriceItemList.forEach(el => {
            totalAmount +=el.singlePrice*el.quantity
        });
        return (
           totalAmount
        ).toFixed(2);
      } else {
        return "";
      }
    },
    //计算总的个数;
    totalCount:function(){
      let totalCount = 0
      if (this.requirementDetail.requirementPriceItemList) {
        this.requirementDetail.requirementPriceItemList.forEach(el => {
            totalCount +=el.quantity
        });
        return (
           totalCount
        );
      } else {
        return "";
      }
    }
  },
  created() {
    let user=JSON.parse(localStorage.getItem('gxzzpt2_consumer'));
    this.isManufacturer=user.isManufacturer;
    if(this.$route.params.requirementList){
      this.getRequirementDetail({ "array": this.$route.params.requirementList});
      localStorage.setItem("array",JSON.stringify(this.$route.params.requirementList))
    }else{
      let params=JSON.parse(localStorage.getItem('array'));
      this.getRequirementDetail({ "array": params});
    }
  },
  methods: {
    //获取商品价格的API；
    changePrice(num,id) {
      var data = {
        "id": id,
        "quantity": num
      };
      this.$http.post("/custom/requirementPriceItem/getPrice", data).then(res => {
        if (res.data.code == 200) {
          this.requirementDetail.requirementPriceItemList.forEach(el => {
            if(el.id==id){
              el.singlePrice=res.data.data;
            }
          });
        }
      });
    },
    //获取发票的方式;
    getSupportExpressMode() {
      var words = JSON.parse(window.localStorage.getItem('words'));
      var arr = words[110].item;
      if(arr.length){
        arr.map((item, index) => {
          if (item.id == this.requirementDetail.expressMode) {
            var obj = {
              id: item.id,
              isSelected: true,
              name: item.name
            };
            this.deliveryForm.expressTypes.push(obj);
            this.deliveryForm.selected = obj;
          } else {
            // this.deliveryForm.expressTypes.push({
            //   id: item.id,
            //   isSelected: false,
            //   name: item.name
            // });
          }
        });
      }
    },
    closeAddressDlg() {
      this.addressDlg.visible = false;
      this.$refs["addressDlgForm"].resetFields();
    },
    //获取地址列表;
    getAddressList(params) {
      this.$http.post("/custom/address/getList", params).then(res => {
        if (res.data.code == 200) {
          if (Array.isArray(res.data.data)) {
            this.addressForm.addressList = res.data.data;
            this.addressForm.addressList.map(item => {
              if (item.isDefault) {
                this.addressForm.data.address = item.id;
              }
            });
          } else {
            this.addressForm.addressList = [];
          }
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    addAddress(requestParams) {
      this.$http.post("/custom/address/add", requestParams).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: res.data.message
          });
          this.addressForm.data.address = Number(res.data.id);
          this.getAddressList({ pageSize: 10, pageIndex: 1 });
          this.closeAddressDlg();
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    //获取订单详情列表；
    getRequirementDetail(params) {
      this.$http.post("/custom/requirementPrice/getToBeOrdered", params).then(res => {
        if (res.data.code == 200) {
          this.requirementDetail = res.data.data;
          this.invoiceForm.TypeData=res.data.data.invoiceTemplateInfo?res.data.data.invoiceTemplateInfo:'';
          this.companyContractInfo=res.data.data.companyContractInfo||[];
          
          //发票信息；
          if(res.data.data.lastInvoiceManagement){
            this.invoiceForm.formData.taxNo=res.data.data.lastInvoiceManagement.taxNo||'';
            this.invoiceForm.formData.invoiceCompanyName=res.data.data.lastInvoiceManagement.invoiceTitle||'';
          }
          
          //获取合同信息；
          this.invoiceForm.formData.contract=this.companyContractInfo.companyName||'';
          this.invoiceForm.formData.address=this.companyContractInfo.address||'';
          this.invoiceForm.formData.phoneNo=this.companyContractInfo.tel||''
          this.getAddressList({ pageSize: 10, pageIndex: 1 });
          this.getSupportExpressMode();
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    //提交订单API
    generateOrder(params) {
      let settlementType=this.requirementDetail.settlementType; 
      this.$http.post("/custom/order/addRequirementOrder", params).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "提交订单成功"
          });
          //判断是否为为月结;
          if(settlementType==430010){
            this.getTradeNumber({ orderNumbers: res.data.data });
          }else if(settlementType==430020){
            setTimeout(()=>{
              this.$router.push({ path: "/pay-success",query:{'settlementType':430020,'orderNumber': res.data.data[0]}});
            },1000)
          }
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    getTradeNumber(params) {
      this.$http.post("/custom/payment/getTradeNumber", params).then(res => {
        if (res.data.code == 200) {
          this.$router.push({
            path: "/pay",
            query: {
              id: res.data.data,
              orderNumber: params.orderNumbers[0],
              price: this.totalAmount
            }
          });
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    //提交订单
    submitOrder() {
        if(this.addressForm.data.address){
          this.$refs["invoiceForm"].validate(valid => {
            if (valid) {
                let productsArr=[];
                this.requirementDetail.requirementPriceItemList.forEach(ele=>{
                  let obj={}
                  obj.requirementPriceItemId=ele.id;
                  obj.quantity=ele.quantity;
                  obj.deliveryTime=ele.deliveryTime;
                  obj.deliveryTimeUnit=ele.deliveryTimeUnit;
                  productsArr.push(obj)
                })
                let requestParams = {
                  addressId:this.addressForm.data.address,
                  expressMode:this.deliveryForm.selected.id?this.deliveryForm.selected.id:111010,
                  remark: this.remark,
                  requirementPriceId:this.requirementDetail.id,
                  invoiceCompanyName : this.invoiceForm.formData.invoiceCompanyName?this.invoiceForm.formData.invoiceCompanyName:'', 
                  taxNo : this.invoiceForm.formData.taxNo?this.invoiceForm.formData.taxNo:'',
                  invoiceMode : Number(this.invoiceForm.formData.resource), 
                  products : productsArr,
                  companyName:this.invoiceForm.formData.contract?this.invoiceForm.formData.contract:'',
                  address:this.invoiceForm.formData.address?this.invoiceForm.formData.address:'',
                  tel:this.invoiceForm.formData.phoneNo?this.invoiceForm.formData.phoneNo:'',
                };
                this.generateOrder(requestParams);
            } else {
              window.scrollTo(0, 320);
              return false;
            }
          });
        }else{
          this.$message({
            type: "warning",
            message: "请填写收货地址"
          });
          window.scrollTo(0, 0);
          return false;
        } 
    },
    //地址验证；
    addressTrigger(){
      if(this.addressDlg.formData.selectList.length!=0){
        this.submitDlgForm();
      }
    },
    submitDlgForm() {
      this.$refs["addressDlgForm"].validate(valid => {
        if (valid) {
          var requestParams = {
            province: this.addressDlg.formData.selectList[0],
            city: this.addressDlg.formData.selectList[1],
            region: this.addressDlg.formData.selectList[2],
            address: this.addressDlg.formData.detail,
            contactName: this.addressDlg.formData.name,
            contactPhone: this.addressDlg.formData.phone,
            contactEmail: this.addressDlg.formData.email
          }
          this.addAddress(requestParams);
        } else {
          return false;
        }
      });
    },
    /*显示大图片*/
    // showProductBigPic(){
    //     this.isProductShow=!this.isProductShow;
    // },
    // //遮罩层；
    // overlay(){
    //   this.isProductShow=false;
    // },
  }
};
</script>

<style lang="less">
//修改了element的样式；
.generate-order {
  .invoice-form{
    .resource-form{
      .el-input{
        width: 375px;
      }
    }
    .contract-form{
      display: flex;
      .el-input{
        width: 300px;
      }
      .el-form-item{
        margin-right: 36px;
      }
    }
  }
  .el-input-number--small .el-input__inner {
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 0;
    height: 26px;
  }
  .el-textarea__inner {
    height: 66px;
    border-radius: 0;
  }
  .el-input-number--small {
    line-height: 26px;
  }
  .el-button--mini,.el-button--small {
    font-size: 14px !important;
    border-radius: 4px;
  }
  .el-input-number__decrease{
    height:24px !important;
  }
  .el-input-number__increase{
    height:24px  !important;
  }
  .cycle-col{
    .el-input-number__increase,.el-input-number__decrease{
      display: none;
    }
    .el-input-number{
      width: 60px;
    }
  }
  .address-dlg-form{
    .el-button{
      height: 30px;
      padding: 0px;
      line-height: 30px;
      width: 86px;
    }
  }
}
</style>

<style lang="less" rel="stylesheet/less" type="text/less" scoped>
.generate-order {
  width: 1200px;
  margin: 0 auto;
  @common-color: #3f8def;
  .breadcrumb {
    height: 36px;
    display: flex;
    align-items: center;
    span{
      display: inline-block;
    }
    i{
      color: @common-color;
    }
  }
  .cursor{
    cursor: pointer;
  }
  .content {
    background-color: #fff;
    .order-title {
      font-size: 20px;
      color: #333;
      line-height: 48px;
    }
    .link {
      color: #3f8def;
      margin-left: 10px;
      text-decoration: underline;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
    }
    .form-box {
      padding: 0 18px;
      .form-title {
        height: 18px;
        line-height: 18px;
        font-size: 14px;
        color: #777;
        font-weight: bold;
      }
      .form-item {
        position: relative;
        padding-bottom: 16px;
        border-bottom: 1px solid #e2e2e2;
        .form-title {
          position: relative;
          height: 50px;
          line-height: 50px;
        }
        .form-content {
          padding-left: 12px;
        }
        .form-desc {
          color: #aeacac;
          padding-top: 25px;
        }
        .required:before {
          content: "*";
          position: absolute;
          left: -8px;
          color: red;
        }
        .margin-30 {
          display: inline-block;
          width: 30px;
        }
      }
      .address-form {
        .address-item {
          margin-bottom: 16px;
        }
        .address-item:last-child{
          margin-bottom: 6px;
        }
        .hidden-address-list:nth-child(n + 3) {
          display: none;
        }
        .more-address {
          color: #888;
          background: #fff url(../../static/img/down-arrow.png) no-repeat 5.5%
            center;
          cursor: pointer;
        }
        .def-address-tag {
          color: #fff;
          background-color: #aeacac;
          margin-left: 14px;
          padding: 1px 4px;
        }
        .add-address-btn {
          position: absolute;
          top: 14px;
          right: 0px;
          width: 118px;
          height: 36px;
          border: 2px solid #3f8def;
          text-align: center;
          line-height: 35px;
          font-size: 14px;
          color: #3f8def;
          cursor: pointer;
        }
      }
      .invoice-form{
        padding-bottom: 0px;
        .contract{
          border-top: 1px solid #e2e2e2;
          .contractDetail{
            font-size: 14px;
            font-weight: normal;
            display: inline-block;
            margin-left:30px;
          }
        }
        .payType{
          padding-bottom:22px;
          span{
            display: inline-block;
            margin-right:10px;
          }
        }
      }
      .goods-form {
        .requirement-col {
          width: 360px;
        }
        .technology-col ,.right{
          p {
              line-height: 32px;
            }
        }
        .tb-col {
          display: flex;
          align-items: center;
          justify-content: center;
          & + li {
            flex: 1;
          }
          .goods-info {
            display: flex;
            width: 100%;
            .left {
              width:100px;
              .imgsmallbox{
                  display:flex;
                  margin-left:10px;
                  cursor: pointer;
                  width: 80px;
                  height: 80px;
                  img{
                    display:block;
                    background-color: #e2e2e2;
                    width: 100%;
                    height: 100%;
                  }
                  .no-upload-img{
                    display: block;
                    width: 80px;
                    height: 80px;
                    margin: auto;
                    background: #e7e7e7;
                    text-align: center;
                    line-height: 100px;
                    font-size: 18px;
                    color: #878787;
                  }
              }
              #overlay{  
                cursor: pointer;
                position: fixed;  
                width: 100%;
                height: 100%;
                top: 0px;  
                left: 0px;  
                z-index: 10000;  
                display:block;  
                background-color: #777;  
                opacity: 0.5;  
                -moz-opacity: 0.5;  
              }
              .imgbigbox{
                >img{
                    background-color: #e2e2e2;
                    border: 1px solid #fff;
                    width: 700px;
                    height: 400px;
                    z-index: 10001;
                    position: absolute;
                    top: 0;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    margin: auto;
                }
              }
              p {
                text-align: center;
                font-size: 12px;
              }
            }
            .right {
              flex: 1;
              display: flex;
              align-items: center;
              margin-left: 10px;
            }
          }
        }
        .table-header {
          display: flex;
          li {
            border-bottom: 2px solid #9fc6f7;
            height: 38px;
            line-height: 38px;
          }
        }
        .requirement-table-tr {
          padding:0 15px; 
          display: flex;
          border-bottom: 1px solid #e2e2e2;
          li {
            padding: 10px 0px;
          }
        }
      }
      .BuyMessage , .goods-form{
        background-color: #f9f9f9;
        border-bottom:0px;
      }
      .BuyMessage{
        padding-left:18px;
        border-bottom: 1px solid #e2e2e2;
        .BuyMessage-title{
          margin-right:6px;
        }
      }
      .form-message {
        display: flex;
        .left {
          width: 548px;
        }
        .center {
          margin-left: 170px;
          line-height: 26px;
          flex: 1;
        }
        .right {
          p {
            display: inline-block;
            line-height: 26px;
          }
          .label {
            width: 120px;
            text-align: right;
          }
          .value {
            padding-right: 7px;
            text-align: right;
            width: 150px;
          }
        }
      }
    }
    .explain-footer{
      padding-top: 13px;
    }
    .form-footer {
      height: 100px;
      margin: 10px 18px 0 18px;
      box-sizing: border-box;
      border: solid 1px #ffb6b6;
      padding:26px 19px;
      .total-amount {
        text-align: right;
        span {
          font-size: 20px;
          color: #f84b4b;
        }
      }
      .address {
        margin-top:16px;
        text-align: right;
        color: #9e9e9e;
        span {
          margin-left: 28px;
        }
      }
    }
    .btn-footer {
      height: 117px;
      margin-bottom: 78px;
      padding:0 18px;
      .btn {
        display: inline-block;
        height: 42px;
        cursor: pointer;
        line-height: 42px;
        text-align: center;
      }
      .go-to-cart-btn {
        color: #9e9e9e;
      }
      .submit-btn {
        float: right;
        width: 136px;
        font-size: 16px;
        color: #fff;
        background: #f84b4b;
        margin-left: 28px;
      }
    }
  }
}
</style>
