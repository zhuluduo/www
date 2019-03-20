<template>
  <div class="generate-order">
    <div class="step-box">
      <v-orderStep :active="StepActive"></v-orderStep>
    </div>
    <div class="order-title">填写并核对订单信息</div>
    <div class="content">
      <div class="form-box">
        <div class="form-item address-form">
          <div class="form-title">选择收货地址<span class="link" @click="addressDlg.visible=true">新增收货地址</span></div>
          <div class="form-content">
            <el-form ref="addressForm" :model="addressForm.data" :rules="addressForm.rules" class="addressForm">
              <el-form-item prop="address">
                <el-radio-group v-model="addressForm.data.address">
                  <div :class="{'hidden-address-list':addressForm.hidden}" class="address-item" v-for="item in addressForm.addressList" :key="item.id">
                    <el-radio @change="changeAddress(item)"  :label="item.id">{{item.province + item.city + item.region +item.address}}  ({{item.contactName}}收)  {{item.contactPhone}}
                      <span v-show="item.isDefault" class="def-address-tag">默认地址</span>
                    </el-radio>
                  </div>
                </el-radio-group>
              </el-form-item>
              <div class="more-address" v-show="addressForm.hidden" @click="addressForm.hidden=false">更多地址</div>
            </el-form>
          </div>
        </div>
        <div class="form-item contact-from">
          <div class="form-title required">联系方式</div>
          <div class="form-content">
            <el-form :inline="true" :model="contactForm.data" ref="contactForm" :rules="contactForm.rules">
              <el-form-item label="姓名 :" prop="name" class="name">
                <el-input  v-model="contactForm.data.name" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="电话：" prop="phone" class="phone">
                <el-input  v-model="contactForm.data.phone" placeholder="请输入电话"></el-input>
              </el-form-item>
              <el-form-item label="邮箱：" prop="email" class="email">
                <el-autocomplete
                class="inline-input"
                v-model="contactForm.data.email"
                :fetch-suggestions="querySearch"
                placeholder="请输入邮箱"
                :trigger-on-focus="false"
                ></el-autocomplete>
              </el-form-item>
            </el-form>
            <div class="form-desc">在确认过程中可能需要与您沟通图纸细节问题，请留下您的联系方式方便我们与您沟通.</div>
          </div>
        </div>
        <div class="form-item contract-from"> 
            <div class="form-title required">
                <span class="contract-title">合同</span>
                <span class="contractDetail">将根据订单内容自动生成商务合同</span>
                <router-link :to="{path:'/contract'}" target="_blank"><span class="modal-name contractDetail">查看合同范本</span></router-link>
            </div>
            <div class="form-content">
              <el-form :inline="true" :model="contractForm.data" ref="contractForm" :rules="contractForm.rules">
                <el-form-item label="公司抬头: " prop="CompanyName" class="CompanyName">
                  <el-input  v-model="contractForm.data.CompanyName" placeholder="请输入公司抬头"></el-input>
                </el-form-item>
                <el-form-item label="地址 :" prop="Address" class="Address">
                  <el-input  v-model="contractForm.data.Address" placeholder="请输入地址"></el-input>
                </el-form-item>
                <el-form-item label="电话：" prop="Phone" class="Phone">
                  <el-input  v-model="contractForm.data.Phone" placeholder="请输入电话"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        <div class="form-item goods-form">
          <div class="form-title">商品清单</div>
          <ul class="table-header">
            <li>商品</li>
            <li>明细</li>
            <li>单价</li>
            <li>数量</li>
            <li>金额</li>
          </ul>
          <table class="table-item" v-for="(item,index) in carList" :key="index">
            <thead>
              <tr>
                <td colspan="5">{{item.serviceName}}</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ele,i) in item.cartItems" :key="i">
                <td width="20%" align="center">
                  <div class="thumbnai"><img :src="ele.file.thumbnailUrl" alt=""></div>
                </td>
                <td width="20%" align="left">
                  <div class="table-item-row">
                    <div>服务：{{ele.productParams.serviceName}}</div>
                    <div>材质：{{ele.productParams.material.name}}</div>
                    <div>文件单位：{{ele.productParams.fileUnit}}</div>
                    <div v-for="el in ele.productParams.steps">
                        <div>{{el.stepName}}：{{el.techniqueName}}</div>
                        <div v-for="elem in el.techniqueParams">{{elem.key}}：{{elem.value}}</div>
                        <div v-if="el.material">
                          <div v-for="elem in el.material.materialParams">{{elem.key}}：{{elem.value}}</div>
                        </div>
                      </div>
                    </div>
                </td>
                <td width="20%" align="center">&yen;{{ele.price | money}}</td>
                <td width="20%" align="center">{{ele.quantity}}</td>
                <td width="20%" align="center">&yen;{{(ele.quantity*ele.price) | money}}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5">
                  <div class="extra-info">
                    <div class="">
                      <p class="normal-txt">上传附件</p>
                      <p class="gray-txt">请以压缩包格式上传加工必要的说明文档（如2D图）</p>
                      <div class="extra-row">
                        <div class="blue-btn" @click="showUpload(index)">上传</div><div v-show="item.file.fileName" class="file-name">{{item.file.fileName}}<i @click="deleteFile(index)" class="el-icon-circle-close-outline delete-icon"></i></div>
                      </div>
                      <input type="file" :ref="'file'+index" @change="uploadFile($event,index)">
                    </div>
                    <div>
                      <p class="normal-txt">选择快递</p>
                      <div class="select-express">
                        <el-select v-model="item.expressType" placeholder="请选择">
                          <el-option
                            v-for="exp in expressList"
                            :key="exp.id"
                            :label="exp.name"
                            :value="exp.id">
                          </el-option>
                        </el-select>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="5">
                  <div class="invoice-form">
                    <div class="normal-txt">发票信息</div>
                    <el-form :model="invoiceForm.formData" ref="invoiceForm"  :rules="invoiceForm.rules" labelPosition='left' class="invoiceForm">     
                      <el-form-item label="开票方式 :" prop="resource" label-width="90px">
                        <el-radio-group v-model="invoiceForm.formData.resource">
                          <el-radio label="150010">纸质发票</el-radio>
                          <el-radio label="150020">电子发票</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="发票类型:" label-width="90px" v-if="invoiceForm.TypeData">
                        <el-radio v-model="invoiceForm.TypeData.invoiceTitleTypeText" :label="invoiceForm.TypeData.invoiceTitleTypeText">{{invoiceForm.TypeData.invoiceTitleTypeText}}  {{invoiceForm.TypeData.invoiceTypeText}} {{invoiceForm.TypeData.taxRate*100}}%</el-radio>
                      </el-form-item>
                      <div v-if="invoiceForm.TypeData.invoiceType==118020">
                        <el-form-item label="企业名称：" prop="invoiceCompanyName" label-width="125px">
                          <el-input v-model="invoiceForm.formData.invoiceCompanyName"></el-input>
                        </el-form-item>
                        <el-form-item label="纳税人识别号：" prop="taxNo" label-width="125px">
                          <el-input v-model="invoiceForm.formData.taxNo"></el-input>
                        </el-form-item>
                      </div> 
                    </el-form>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="5">
                  <p class="normal-txt">给卖家留言</p>
                  <div class="price-info">
                    <div class="left">
                      <el-input type="textarea" class="dash" resize="none" v-model="item.remark"></el-input>
                    </div>  
                    <div class="right">
                      <div class="right-col">
                        <div>总商品数量：<span class="left-value">{{item|totalFilter}}</span></div>
                      </div>
                      <div class="right-col">
                        <div>运费：<span class="right-value">&yen;{{expressPrice}}</span></div>
                        <div>税点：<span class="right-value">{{item.taxRate*100}}%</span></div>
                        <div>合计：<span class="right-value">&yen;{{item|rowTotalAmount}}</span></div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <div class="form-footer">
        <div class="total-amount">应付总额（含运费）：<span>￥{{payAmount}}</span></div>
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
    <el-dialog center title="添加收货地址" width="640px" :visible.sync="addressDlg.visible">
      <div class="address-dlg-form">
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
          <el-form-item label="所在地区：" class="required">
            <template>
              <div class="select-area">
                <area-select type="text" v-model="selectList" :level="2"  :data="$areaData"></area-select>
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
import orderStep from "../components/orderStep.vue";
import checkBtn from "../components/checkButton.vue";
import { mapActions } from 'vuex';
import {validatePhone, validatAaccount, validateEmail , EmailAuto} from '../lib/validate.js';
import '../lib/filter.js'//格式化金额（保留两位小数）过滤器
export default {
  components: {
    "v-orderStep": orderStep,
    "v-checkBtn": checkBtn
  },
  data() {
    return {
      expressPrice: 0,
      requirementIds: "",
      carList: [],
      selectList: [],
      StepActive: {
        stepOne: false,
        stepTwo: false,
        stepThr: true,
        stepFou: false
      },
      expressList: [],
      addressDlg: {
        visible: false,
        formData: {
          name: "",
          phone: "",
          detail: "",
          province: "",
          city: "",
          region: ""
        },
        rules: {
          phone: [
            { required: true, validator: validatePhone, trigger: "blur" }
          ],
          name: [{ required: true, message: "请输入收货人", trigger: "blur" }],
          detail: [
            { required: true, message: "请输入详细地址", trigger: "blur" }
          ]
        }
      },
      addressForm: {
        data: {
          address: ""
        },
        hidden: true,
        addressList: []
      },
      contactForm: {
        rules: {
          phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
          email: [{ required: true, validator: validateEmail}],
          name: [{ required: true, message: "请输入地址", trigger: "blur"}],
        },
        data: {
          phone: "",
          email: "",
          name:'',
        }
      },
      contractForm: {
        rules: {
          CompanyName: [{  required: true, message: "请输入公司抬头", trigger: "blur" }],
          Address: [{  required: true, message: "请输入地址", trigger: "blur" }],
          Phone: [{ required: true,validator: validatePhone, trigger: "blur" }]
        },
        data: {
          CompanyName: "",
          Phone: "",
          Address: "",
        }
      },
      uploadForm: {
        fileList: []
      },
      deliveryForm: {
        expressTypes: [],
        selected: {}
      },
      invoiceForm: {
        rules: {
          invoiceCompanyName: [
            { required: true, message: '企业名称', trigger: 'blur' },
          ],
          resource: [
            { required: true, message: '请选择发票方式', trigger: 'change' }
          ],
          taxNo:[
            { required: true, message: '纳税人识别号', trigger: 'blur' }
          ],
        },
        formData: {
          invoiceCompanyName : '',
          resource: '',
          taxNo:'',
        },
        TypeData:{
        },
       
      },
    };
  },
  filters: {
    rowTotalAmount(row) {
      var total = 0;
      row.cartItems.map(ele => {
        total += ele.price * ele.quantity;
      });
      return (total * (1 + row.taxRate)).toFixed(2);
    },
    totalFilter(row) {
      var total = 0;
      row.cartItems.map(ele => {
        total += ele.quantity;
      });
      return total;
    }
  },
  computed: {
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
    totalAmount: function() {

    },
    //应付总金额
    payAmount: function() {
      var sumArr = [];
      this.carList.map(ele => {
        var arr = [];
        ele.cartItems.map(el => {
          arr.push(el.price * el.quantity);
        });
        var sum = this.sum(arr) * (1 + ele.taxRate);
        sumArr.push(sum);
      });
      return this.sum(sumArr).toFixed(2);
    }
  },
  created() {
    this.getWords();
    this.getAddressList({ pageSize: 10, pageIndex: 1 });
    this.requirementIds = this.$route.query.ids.split(",");
    this.getRequirementDetail({ ids: this.requirementIds });
    this.getCompanyInfo();

  },
  methods: {
    ...mapActions(["setBuyCount"]),
    sum(arr) {
      var total = 0;
      arr.map(ele => {
        total += ele;
      });
      return total;
    },
    deleteFile(index) {
      var str = "file" + index;
      this.carList[index].file = {};
      this.$refs[str][0].value = "";
    },
    uploadFile(e, index) {
      var file = e.target.files[0];
      var data = new FormData();
      data.append("file", file);
      this.$upload.post("/uploadingFile", data).then(res => {
        if (res.data.code == 200) {
          this.carList[index].file = res.data.attachFile;
        }
      });
    },
    showUpload(i) {
      var str = "file" + i;
      this.$refs[str][0].click();
    },
    getWords() {
      var wordsStr = localStorage.getItem("words");
      var words = JSON.parse(wordsStr);
      var item = words[110].item;
    },
    selectExpress(item) {
      this.deliveryForm.expressTypes.map((el, index) => {
        if (item.id == el.id) {
          el.isSelected = true;
          this.deliveryForm.selected = item;
        } else {
          el.isSelected = false;
        }
      });
    },
    closeAddressDlg() {
      this.addressDlg.visible = false;
      this.$refs["addressDlgForm"].resetFields();
    },
    getAddressList(params) {
      this.$http.post("/custom/address/getList", params).then(res => {
        if (res.data.code == 200) {
          if (Array.isArray(res.data.data)) {
            this.addressForm.addressList = res.data.data;
            this.addressForm.addressList.map(item => {
              if (item.isDefault && !this.addressForm.data.address) {
                this.addressForm.data.address = item.id;
              }
              if (item.isDefault) {
                this.contactForm.data.phone = item.contactPhone;
                this.contactForm.data.name  = item.contactName;
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
    changeAddress(item){
      this.contactForm.data.phone = item.contactPhone;
      this.contactForm.data.name  = item.contactName;
    },
    getCompanyInfo(){
      this.$http.post("custom/company/getContractInfo").then(res => {
        if (res.data.code == 200) {
          this.contractForm.data.CompanyName = res.data.data.companyName;
          this.contractForm.data.Phone = res.data.data.tel;
          this.contractForm.data.Address = res.data.data.address;
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    SaveTotalcount(){
        //被选中的移出;
        const localGoods = JSON.parse(localStorage.getItem("goods"));
        for (const keys in localGoods){
          this.requirementIds.forEach(item =>{
            if(item == keys){
              delete localGoods[keys]
            }
          })
        }

        //重新计算购物车的数量；
        let Totalcount = 0;
        for (const keys in localGoods){
          Totalcount += localGoods[keys]
        }
        this.setBuyCount(Totalcount);
        localStorage.setItem('goods',JSON.stringify(localGoods))
    },
    getRequirementDetail(params) {
      let words = JSON.parse(localStorage.getItem("words")); 
      this.expressList = words[110].item;
      let item = words[110].item;
      this.$http.post("/custom/cart/getItemsServiceGroup", params).then(res => {
        if (res.data.code == 200) {
          let resData = res.data.data[0];
          this.carList = res.data.data;
          this.invoiceForm.TypeData=resData.invoiceTemplate?resData.invoiceTemplate:'';
          //发票信息；
          if(resData.lastInvoiceManagement){
            this.invoiceForm.formData.taxNo=resData.lastInvoiceManagement.taxNo||'';
            this.invoiceForm.formData.invoiceCompanyName=resData.lastInvoiceManagement.invoiceTitle||'';
          }
          this.carList.map(ele => {
            this.$set(ele, "expressType", item[0].id);
            this.$set(ele, "remark", "");
            this.$set(ele, "file", {});
          });
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    generateOrder(params) {
      this.$http.post("/custom/order/add", params).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "提交订单成功"
          });
          this.getTradeNumber({ orderNumbers: res.data.data });
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
              orderNumber: params.orderNumbers,
              price: this.payAmount
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
    submitOrder() {
      //邮箱和发票验证；
      if(!this.contactForm.data.email){
          window.scrollTo(0, 320);
          this.$refs.contactForm.validateField('email');
          return false;
      }
      if(!this.invoiceForm.formData.resource){
          let windowHeight = document.body.clientHeight;
          window.scrollTo(0, windowHeight-1300);
          this.$refs.invoiceForm[0].validateField('resource');
          return false;
      }
      this.$refs["contractForm"].validate(valid => {
        if (valid) {
          var requestParams = {
            addressId: this.addressForm.data.address,
            contactPhone: this.contactForm.data.phone,
            contactEmail: this.contactForm.data.email,
            contactName: this.contactForm.data.name,
            companyName:this.contractForm.data.CompanyName,
            address:this.contractForm.data.Address,
            tel:this.contractForm.data.Phone,
            products: []
          };
          this.carList.map(ele => {
            var item = {
              serviceId: ele.serviceId,
              attachFileId: Number(ele.file.id),
              remark: ele.remark,
              expressMode: ele.expressType,
              invoiceCompanyName : this.invoiceForm.formData.invoiceCompanyName, 
              taxNo : this.invoiceForm.formData.taxNo?this.invoiceForm.formData.taxNo:'',
              invoiceMode : Number(this.invoiceForm.formData.resource), 
              itemIds: []
            };
            ele.cartItems.map(el => {
              item.itemIds.push(el.id);
            });
            requestParams.products.push(item);
          });
          this.generateOrder(requestParams);
          this.SaveTotalcount();//提交后，修改购物车的数量；
        } else {
          // window.scrollTo(0, 320);
          return false;
        }
      });
    },
    submitDlgForm() {
      this.$refs["addressDlgForm"].validate(valid => {
        if (valid) {
          var requestParams = {
            province: this.selectList[0],
            city: this.selectList[1],
            region: this.selectList[2],
            address: this.addressDlg.formData.detail,
            contactName: this.addressDlg.formData.name,
            contactPhone: this.addressDlg.formData.phone,
            contactEmail: this.addressDlg.formData.email
          };
          this.addAddress(requestParams);
        } else {
          return false;
        }
      });
    },
    //邮箱自动补全的方法；
    querySearch(inputString,cb) {
        EmailAuto(inputString,cb)
    },
  }
};
</script>


<style lang="less" rel="stylesheet/less" type="text/less" scoped>
.generate-order {
    width: 1200px;
    margin: 0 auto;
    .order-title {
      font-size: 14px;
      color: #777;
      line-height: 50px;
    }
    .link {
        margin-left: 10px;
        color: #3f8def;
        text-decoration: underline;
        white-space: nowrap;
        cursor: pointer;
    }
    .content{
      background-color: #fff;
      .form-box {
        padding: 0 18px;
        .form-title {
          font-size: 14px;
          color: #777;
          font-weight: 700;
        }
        .form-item {
          position: relative;
          padding-bottom: 30px;
          &:not(:last-child) {
            border-bottom: 1px solid #e2e2e2;
          }
          .form-title {
            position: relative;
            height: 50px;
            line-height: 50px
          }
          .form-content {
            padding-left: 15px;
          }
          .form-desc {
            color: #aeacac;
            padding-top: 12px;
          }
          .margin-30 {
            display: inline-block;
            width: 30px;
          }
        }
        .address-form {
          .address-item {
            margin-bottom: 12px;
          }
          .hidden-address-list:nth-child(n + 3) {
            display: none;
          }
          .more-address {
            color: #888;
            background: #fff url(../../static/img/down-arrow.png) no-repeat 5.5% center;
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
        .contract-from{
          span{
            margin-left: 30px;
          }
          .contract-title{
            font-size: 14px;
            color: #777;
            font-weight: 700;
            margin: 0;
          }
      
        }
        .goods-form {
          .goods-col {
            width: 288px;
          }
          .detail-col {
            width: 174px;
          }
          .price-col {
            width: 320px;
          }
          .quantity-col {
            width: 144px;
          }
          .amount-col {
            width: 236px;
          }
          .requirement-col {
            width: 360px;
          }
          .contact-col {
            width: 200px;
            p {
              line-height: 24px;
              width: 200px;
              text-align: left;
            }
            .name {
              margin-top: 15px;
            }
          }
          .cycle-col {
            width: 300px;
          }
          .quote-col {
            width: 300px;
          }
          .tb-col {
            text-align: center;
          }
          .table-header {
            display: flex;
            li {
              flex: 1;
              text-align: center;
              border-bottom: 2px solid #9fc6f7;
              height: 38px;
              line-height: 38px;
            }
          }
          .requirement-table-tr {
            display: flex;
            margin-top: 26px;
            //    margin-bottom: 50px;
            li {
              height: 100px;
              background: #f0f6fe;
              line-height: 100px;
            }
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
            margin-left: 50px;
            p {
              display: inline-block;
              line-height: 26px;
            }
            .label {
              width: 170px;
              text-align: right;
            }
            .value {
              text-align: right;
              width: 112px;
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
.select-area {
  margin-top: 5px;
}
.table-item {
  width: 100%;
  box-sizing: border-box;
  & + table {
    margin-top: 32px;
  }
  thead {
    td {
      padding: 10px 0px;
      font-size: 14px;
      font-weight: bold;
     
    }
  }
  tbody {
    background: #f3f3f3;
    tr {
      & + tr {
        border-top: 1px solid #e2e2e2;
      }
    }
    td {
      padding: 18px 0px;
      vertical-align: middle;
    }
  }
  tfoot {
    background: #f3f3f3;
    tr {
      border-top: 1px solid #e2e2e2;
    }
    td {
      padding: 22px 17px 19px;
    }
    .normal-txt {
      font-size: 16px;
      color: #333;
    }
    .gray-txt {
      font-size: 14px;
      color: #aeacac;
      margin-top: 14px;
    }
    .blue-btn {
      width: 60px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      color: #3f8def;
      border: 1px solid #3f8def;
      border-radius: 4px;
      cursor: pointer;
    }
  }
}
.table-item-row {
  div + div {
    margin-top: 13px;
  }
}
.dash {
  width: 498px;
  height: 122px;
}
.price-info {
  margin-top: 14px;
  display: flex;
  justify-content: space-between;
  .right {
    display: flex;
    .right-col {
      & + .right-col {
        margin-left: 20px;
      }
      > div + div {
        margin-top: 24px;
      }
    }
    .left-value {
      width: 100px;
      display: inline-block;
      text-align: left;
    }
    .right-value {
      width: 100px;
      display: inline-block;
      text-align: right;
    }
  }
}
.extra-info {
  display: flex;
  > div {
    flex: 1;
  }
}
.select-express {
  display: flex;
  align-items: center;
  margin-top: 14px;
  > span {
    margin-left: 10px;
  }
}
.thumbnai {
  width: 100px;
  height: 100px;
  border: 1px solid #e2e2e2;
  > img {
    width: 100%;
    height: 100%;
  }
}
input[type="file"] {
  display: none;
}
.extra-row {
  margin-top: 14px;

  display: flex;
  align-items: center;
  .file-name {
    margin-left: 20px;
  }
  .delete-icon {
    margin-left: 20px;
    cursor: pointer;
  }
}
.modal-name {
    color: #3f8def;
    text-decoration: underline;
    white-space: nowrap;
    cursor: pointer;
}
</style>

<style lang="less">
  .generate-order {
    .contact-from,.contract-from{
        .el-input{
          width: 300px;
        }
    }
  }
</style>
