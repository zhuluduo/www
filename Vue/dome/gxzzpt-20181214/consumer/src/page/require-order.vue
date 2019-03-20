<template>
<div class="require-order">
  <div class="box">
    <v-operation>
      <v-tabs :tabs="types" @click="changeTab"></v-tabs>
      <div slot="right">
        <el-input  @keydown="goSearch" v-model="ajaxData.keyword" placeholder="订单编号">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>
      </div>
    </v-operation>
    <div class="table">
      <div class="table-header">
        <div style="width:331px">商品明细</div>
        <div style="width:128px">单价</div>
        <div style="width:106px">商品操作</div>
        <div style="width:162px">订单金额</div>
        <div style="width:96px">联系人</div>
        <div style="width:184px">操作</div>
      </div>
      <table v-for="(item,index) in tableData" :key="index" class="table-item">
        <thead>
          <tr>
            <td colspan="6">
              <div class="table-item-header">
                  <div>{{item.createTime}}</div>
                  <div>订单号：{{item.orderNumber}}</div>
                  <div><span class="order-type">{{item.orderType==110010?'人工报价':'自动报价'}}<span v-if="item.status==112025">（有改价）</span></span></div>
                  <!-- <div class="tip-txt">您的订单被标注为审核不通过，您可以重新下单或联系客服</div> -->
                  <div class="tb-header-right">
                    <!-- <img src="../../static/img/shr.png" alt="">
                    <span>联系客服</span> -->
                    <span>承接供应商：</span>
                    <span>{{item.dispatchCompany?item.dispatchCompany.dispatchCompanyName:''}}</span>
                  </div>
              </div>
            </td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(ele,i) in item.items" :key="i">
            <td width="331px" align="center">
              <div v-if="item.orderType==110010" class="goods rgbj">
                <div class="left-item">
                  <img v-if="ele.fileInfo" :src="ele.fileInfo?ele.fileInfo.thumbnailUrl:''" alt="">
                  <div v-else class="no-upload-img">未上传</div>
                </div>
                <div class="right-item">
                    <div>需求编号:{{ele.requirementNumber}}</div>
                    <div>产品名称:{{ele.itemName}}</div>
                    <div>{{ele.techniqueName}}</div>
                </div>
              </div>
              <div v-else class="goods zdbj">
                <div class="left-item">
                    <img v-if="ele.fileInfo" :src="ele.fileInfo?ele.fileInfo.thumbnailUrl:''" alt="">
                    <div v-else class="no-upload-img">未上传</div>
                </div>
                <div class="right-item">
                  <div>服务：{{ele.productParams.serviceName}}</div>
                  <div>材质：{{ele.productParams.material.name}}</div>
                  <div>文件单位：{{ele.productParams.fileUnit}}</div>
                  <div v-for="(el,index) in ele.productParams.steps" :key='index'>{{el.stepName}}：{{el.techniqueName}}</div>
                </div>
              </div>
            </td>
            <td width="108px" align="center">
              <div>&yen;{{ele.itemPrice.toFixed(2)}}<span class="gray-txt">*{{ele.quantity}}</span></div>
            </td>
            <td width="126px" align="center" :class="item.items.length >=2?'gray-border':''">
              <div class="refund-btn" v-if="ele.canRefund&&(item.settlementType!=430020)" @click="refund(ele)">退款</div>
              <div class="gray-txt" v-if="ele.refundInfo">
                <div>{{ele.refundInfo.refundStatusStr}}</div>
                <div class="refund-btn" v-if="ele.refundInfo.refundStatus==112060" @click="closeRefund(ele)">关闭退款</div>
                <div v-if="ele.refundInfo.refundStatus==112062">将退款：&yen;{{ele.refundInfo.refundAmount}}</div>
                <div class="refund-btn" v-if="ele.refundInfo.refundStatus==112062" @click="alert({refundId:ele.refundInfo.id},'确认退款金额','/custom/order/confirmRefund')">退款金额</div>
              </div>
            </td>
            <td width="152px" align="center" :rowspan="item.items.length" v-if="i==0">
              <div class="price-info">
                <div>￥{{item.totalPrice}}</div>
                <div v-if="item.settlementType==430010">
                  全款现付
                </div>
                <div v-if="item.settlementType==430020">
                  <span>{{item.settlementTypeStr}} :</span>
                  <span>{{item.settlementPeriodStr}}</span>
                </div>
                <div>
                  {{item.expressModeStr}}
                  <span v-if="!(item.expressMode==111040||item.expressMode==111010)">：{{item.expressPayTypeStr}}</span>
                </div>
                <div v-if="item.orderType!=110010">含运费:￥{{item.expressPrice}}</div>
                <div v-if="item.orderType!=110010">税费:￥{{item.tax}}</div>
              </div>
            </td>
            <td width="106px" align="center" :rowspan="item.items.length" v-if="i==0">
              <el-tooltip placement="right">
                <div slot="content">
                  <div class="user-info">
                    <div>姓名：{{item.contactName}}</div>
                    <div>手机：{{item.contactPhone}}</div>
                    <div>邮箱：{{item.contactEmail}}</div>
                  </div>
                </div>
              <div class="v-align">
                <img src="../../static/img/lxr.png" alt="">
                <span>{{item.contactName||"--"}}</span>
              </div>
              </el-tooltip>
            </td>
            <td width="184px" align="center" :rowspan="item.items.length" v-if="i==0">
              <div class="gray-txt">
                <!-- 判断月结的方式 不接单不显示状态 -->
                <div class="orderStatusStr" v-if="(item.settlementType==430020)">
                  <span v-if="item.takeOrderStatus==380010">待接单</span>
                  <span v-else>{{item.statusStr}}</span>
                </div>
                <div class="orderStatusStr" v-if="(item.settlementType==430010)">
                  {{item.statusStr}}
                </div>
              </div>
              <div class="operator-area">
                <div class="operator-top">
                  <div v-if="(item.status==112010 || item.status==112025)&&(!item.isOfflinePayment)" @click="pay(item)">支付</div>
                  <div v-if="item.status==112040" @click="showExpressModal(item)">确认收货</div>
                  <div v-if="item.isOfflinePayment&&(item.status==112010||item.status==112025)"   @click="ensureCollection(item)">确定支付</div>
                  <div v-if="item.status==112050&&!item.hasCommentManu" @click="GoEvaluate(item)">去评价</div>
                </div>
                <div class="operator-bottom">
                  <span class="cancel-btn" v-if="(item.status==112010||item.status==112015||item.status==112025)&&(item.settlementType==430010)" @click="alert({id:item.id},'确认取消订单','/custom/order/close')">取消订单</span>
                  <span class="cancel-btn" v-if="(item.takeOrderStatus==380010)&&(item.settlementType==430020)" @click="alert({id:item.id},'确认取消订单','/custom/order/close')">取消订单</span>
                  <span class="" @click="routePage(item)">订单详情</span>
                  <router-link v-if="item.status!=112020" :to="{path:'/contract/detail',query:{contractId:item.contract?item.contract.id:''}}" target="_blank"><span class="">合同详情</span></router-link>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!tableData" class="Undata">暂无数据</div>
      <div class="pagination">
        <el-pagination @current-change="changePage" background layout="prev, pager, next" :page-count="pagination.pageCount" :current-page="pagination.currentPageIndex" :page-size="pagination.pageSize"></el-pagination>
      </div>
    </div>
    <el-dialog
      title="提交支付凭证"
      :visible.sync="payDialog.dialogVisible"
      width="600px"
      class="address-dlg-form">
      <div class="from-box">
        <el-form :model="PayForm" :rules="PayForm.rules" ref="PayForm" label-width="65px" class="demo-ruleForm">
          <el-form-item label="支付凭证:" prop="urlName">
            <div class="uploadImg">
              <span class="uploadImgName">{{PayForm.urlName}}</span>
              <el-upload
              class="upload-demo"
              action="http://dw.tatfookcloud.com/upload"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :limit="1"
              :on-exceed="handleExceed"
              :on-remove="handleRemove"
              :file-list="PayForm.logoUrl"
              list-type="picture">
              <el-button size="small" type="primary"
              list-type="picture">上传</el-button>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="payDialog.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="SubmitUploadImg('PayForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="收货" width="640px" :visible.sync="showExpress">
      <!-- <el-collapse-transition>
        <div class="form-msg" v-show="errRes">{{errRes}}</div>
      </el-collapse-transition> -->
      <div class="deliverTab">
        <span @click="selectTab(false)"  v-bind:class="{ activeColor: !activeIndex }">历史收货</span>
        <span @click="selectTab(true)"  v-bind:class="{ activeColor: activeIndex}">本次收货</span>
      </div>
      <div id='deliverOrder' v-if='activeIndex'>
        <div v-if="receiptInfo">
          <div class="deliverHeader">
              <div class="title">
                <p>{{receiptInfo?receiptInfo.dispatchCompany.dispatchCompanyName:''}}</p>
                <p>送货单</p>
              </div>
          </div>
          <div class="deliverBody">
            <div class="info">
              <div>
                <span>客户名称: {{receiptInfo.user?receiptInfo.user.companyName:''}}</span>
                <span class="fl-right"> 订单编号: {{receiptInfo.orderNumber}}</span>
              </div>
              <div>送货地址：
                {{receiptInfo.addressInfo?receiptInfo.addressInfo.province:''}}
                {{receiptInfo.addressInfo?receiptInfo.addressInfo.city:''}}
                {{receiptInfo.addressInfo?receiptInfo.addressInfo.address:''}}
              </div>
            </div>
            <div class="content" >
                <div>
                  <table align="center">
                    <thead>
                      <tr>
                        <td width='100'>零件编号</td>
                        <td width='100'>零件名称</td>
                        <td width='70'>下单数量</td>
                        <td width='70'>交货数量</td>
                        <td width='90'>发货日期</td>
                        <td width='146'>配送</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item,index) in receiptInfo.deliveryList" :key="index">
                        <td colspan="4">
                          <em v-for="(ele,index) in item.deliveryItems" :key="index">
                            <span style="width:102px">{{ele.requirementNumber?ele.requirementNumber:'-'}}</span>
                            <span style="width:102px">{{ele.item_name}}</span>
                            <span style="width:72px">{{ele.quantity}}</span>
                            <span style="width:72px">{{ele.deliveryQuantity}}</span>
                          </em>
                        </td>
                        <td>{{item.deliveryTime}}</td>
                        <td>
                          <div v-if="(receiptInfo.expressMode ==111020)||(receiptInfo.expressMode ==111030) ">
                            <i>{{item.expressNumber}}</i>
                            <i>{{item.expressCompanyName}}</i>
                          </div>
                          <i v-else>
                            {{receiptInfo.expressModeStr}}
                          </i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
            </div>
          </div>
        </div>
        <div v-else class="errorContent">
          本次收货数据不存在
        </div>
      </div>
      <div id='deliverOrder' v-if='!activeIndex' >
        <div v-if="receiptHistoryInfo">
          <div class="deliverHeader">
              <div class="title">
                <p>{{receiptHistoryInfo.dispatchCompany?receiptHistoryInfo.dispatchCompany.dispatchCompanyName:''}}</p>
                <p>送货单</p>
              </div>
          </div>
          <div class="deliverBody">
            <div class="info">
              <div>
                <span>客户名称: {{receiptHistoryInfo.user?receiptHistoryInfo.user.companyName:''}}</span>
                <span class="fl-right"> 订单编号: {{receiptHistoryInfo.orderNumber}}</span>
              </div>
              <div>送货地址：
                {{receiptHistoryInfo.addressInfo?receiptHistoryInfo.addressInfo.province:''}}
                {{receiptHistoryInfo.addressInfo?receiptHistoryInfo.addressInfo.city:''}}
                {{receiptHistoryInfo.addressInfo?receiptHistoryInfo.addressInfo.address:''}}
              </div>
            </div>
            <div class="content" >
                <div>
                  <table align="center">
                    <thead>
                      <tr>
                        <td width='100'>零件编号</td>
                        <td width='100'>零件名称</td>
                        <td width='70'>下单数量</td>
                        <td width='70'>交货数量</td>
                        <td width='90'>发货日期</td>
                        <td width='146'>配送</td>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item,index) in receiptHistoryInfo.deliveryList" :key="index">
                        <td colspan="4">
                          <em v-for="(ele,index) in item.deliveryItems" :key="index">
                            <span style="width:102px">{{ele.requirementNumber?ele.requirementNumber:'-'}}</span>
                            <span style="width:102px">{{ele.item_name}}</span>
                            <span style="width:72px">{{ele.quantity}}</span>
                            <span style="width:72px">{{ele.deliveryQuantity}}</span>
                          </em>
                        </td>
                        <td>{{item.deliveryTime}}</td>
                        <td>
                          <div v-if="(receiptHistoryInfo.expressMode ==111020)||(receiptHistoryInfo.expressMode ==111030) ">
                            <i>{{item.expressNumber}}</i>
                            <i>{{item.expressCompanyName}}</i>
                          </div>
                          <i v-else>
                            {{receiptHistoryInfo.expressModeStr}}
                          </i>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="countInfo">
                    <span>已交货次数：{{receiptHistoryInfo.deliveryList.length}}次</span>
                    <span>下单总量：{{totalAmount}}件</span>
                    <span>已发货：{{totalDeliverAmount}}件</span>
                  </div>
                </div>
            </div>
          </div>
        </div>
        <div v-else class="errorContent">
          本次收货数据不存在
        </div>
      </div>
      <div v-if="activeIndex&&receiptInfo" class="deliverOperBtn">
        <el-button @click="showExpress = false">取 消</el-button>
        <el-button type="primary" @click="receiptOrder" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>
<script>
import tabs from '../components/tabs.vue';
import operationBar from '../components/operationBar.vue';
import { validatNumber} from '../lib/validate.js';
export default {
  data() {
    return {
      tableData: [],
      ajaxData: {
        pageIndex: 1,
        pageSize: 5,
        keyword: "",
        status: 0
      },
      types: [
        { name: "全部", id: 0, isCheck: true },
        { name: "待支付", id: 112010, isCheck: false },
        { name: "待发货", id: 112030, isCheck: false },
        { name: "待收货", id: 112040, isCheck: false },
        { name: "交易完成", id: 112050, isCheck: false }
      ],
      pagination: {
        currentPageIndex: 1,
        pageSize: 5,
        pageCount: 0
      },
      payDialog:{
        dialogVisible:false,
      },
      PayForm:{
        id:'',
        urlName:'',
        paymentCertUrl:'',
        rules: {
          urlName: [
            { required: true, message: "请上传图片", trigger: "blur" },
          ]
        }
      },
      showExpress:false,
      activeIndex: true,
      receiptInfo:null,
      receiptHistoryInfo:null,
    };
  },
  components: {
    'v-tabs':tabs,
    'v-operation': operationBar,
  },
  computed: {
    //计算总的价格;
    totalDeliverAmount: function() {
      let totalAmount = 0
      if (this.receiptHistoryInfo.deliveryList) {
       this.receiptHistoryInfo.deliveryList.forEach(el => {
          el.deliveryItems.forEach(item =>{
            totalAmount += item.deliveryQuantity
          })
        });
        return totalAmount
      } else {
        return "";
      }
    },
    totalAmount: function() {
      let totalAmount = 0
      if (this.receiptHistoryInfo.deliveryList) {
        this.receiptHistoryInfo.deliveryList[0].deliveryItems.forEach(ele =>{
           totalAmount = ele.quantity;
        })
        return totalAmount
      } else {
        return "";
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    refund(row) {
      this.$prompt("请输入退款原因", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[\S\s]{1,}$/,
        inputErrorMessage: "请输入退款原因"
      }).then(({ value }) => {
          this.sure(
            { itemId: row.id,refundReason:value},
            "/custom/order/applyForRefund"
          );
        }).catch(() => {});
    },
    closeRefund(row) {
      this.alert(
        { refundId: row.refundInfo.id },
        "确定关闭退款",
        "/custom/order/closeRefund"
      );
    },
    pay(row) {
      var data = {
        orderNumbers: [row.orderNumber]
      };
      this.$http.post("/custom/payment/getTradeNumber", data).then(res => {
        if (res.data.code == 200) {
          this.$router.push({
            path: "/pay",
            query: { id: res.data.data, price: row.totalPrice, orderid: row.id }
          });
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    alert(data, msg, url, item) {
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.sure(data,url,item);
      }).catch(() => {});
    },
    sure(data,url,item) {
      this.$http.post(url,data).then(res => {
        if (res.data.code == 200) {
          //如果待收货并且不是月结（即已付款）跳转到订单完成提醒;
          if(item){
            if(item.status==112040&&item.settlementType==430010){
              this.$router.push({ path: "/completed-order", query: { orderId:item.id, companyId: item.dispatchCompany.dispatchCompanyId,userId:item.user.companyId,type:1}})
            }
          }else{
            this.pageIndex = 1;
            this.getList();
            this.$message({
              type: "success",
              message: res.data.message
            });
          }
          // }
        } else {
          this.$message({
            type: "error",
            message: res.data.message || "网络异常"
          });
        }
      });
    },
    //去评价；
    goToEvaluate(item){
       this.$router.push({
            path: "/usercenter/evaluate",
            query: { orderId:item.id, companyId: item.dispatchCompany.dispatchCompanyId, type:1}
        });
    },
    /*跳转新页面订单详情*/
    routePage(item){
        let routeData = this.$router.resolve({path:'/order-detail',query:{id:item.id,type:1}});
        window.open(routeData.href, '_blank');
    },
    changePage(p) {
      this.ajaxData.pageIndex = p;
      this.getList();
    },
    search() {
      this.getList();
    },
    getList() {
      this.$http.post("/custom/order/getList", this.ajaxData).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data;
          this.pagination = res.data.pagination;
          window.scrollTo(0,0)
        }
      });
    },
    goSearch(e) {
      if (e.which == 13) {
        this.search();
      }
    },
    search() {
      this.getList();
    },
    changeTab(item) {
      this.ajaxData.status = item.id;
      this.getList();
    },
    //确定支付
    ensureCollection(item){
      this.payDialog.dialogVisible=true;
      this.PayForm.id=item.id;
    },
    ensureCollectionAPI(data){
       this.$http.post('/custom/order/confirmForPay',data).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: res.data.message
          });
        } else {
          this.$message({
            type: "error",
            message: res.data.message || "网络异常"
          })
        }
      });
    },
    //去评价
    GoEvaluate(val){
      if(val.dispatchCompany.dispatchCompanyId !=val.user.companyId){
        this.$router.push({path: '/usercenter/evaluate',query: { type:1,orderId:val.id, companyId: val.dispatchCompany.dispatchCompanyId, parentUrl:'/usercenter/require-order'}})
      }else{
          this.$message({
            type: "warning",
            message:'请勿自评价'
          })
      }
    },
    handleAvatarSuccess(response, file, fileList){
      this.PayForm.paymentCertUrl='',
      this.PayForm.urlName=file.name;
      this.PayForm.paymentCertUrl=response.data.img_url;
    },
    beforeAvatarUpload(){
    },
    handleRemove(){
      this.PayForm.urlName=null;
      this.PayForm.paymentCertUrl=null;
    },
    handleExceed(){
    },
    SubmitUploadImg(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          let requestParams = {
            "id":Number(this.PayForm.id),
            "paymentCertUrl":this.PayForm.paymentCertUrl,
          }
          this.payDialog.dialogVisible = false;
          this.ensureCollectionAPI(requestParams);
          //刷新页面;
          this.getList();
        } else {
          return false;
        }
      })
    },
    showExpressModal(row){
      this.showExpress = true;
      let ParamsData = {id:row.id}
      this.getForReceiptInfo(ParamsData);
      this.getDeliveryHistoryInfo(ParamsData);
    },
    getForReceiptInfo(Data){
      this.$http.post("/custom/order/getForReceipt",Data).then(res => {
        if (res.data.code == 200) {
          this.receiptInfo = res.data.data;
        } else {
          this.$message.error(res.data.message||"网络异常");
        }
      });
    },
    getDeliveryHistoryInfo(Data){
      this.$http.post("/custom/order/getDeliveryHistory",Data).then(res => {
        if (res.data.code == 200) {
          this.receiptHistoryInfo = res.data.data;
        } else {
          this.$message.error(res.data.message||"网络异常");
        }
      });
    },
    receiptOrder(){
      this.$http.post("/custom/order/receipt",{id:this.receiptInfo.id}).then(res => {
        if (res.data.code == 200) {
            this.$message.success(res.data.message);
            this.showExpress =false;
        } else {
          this.$message.error(res.data.message||"网络异常");
        }
      })
    },
    selectTab(flag){
      this.activeIndex = flag;
    },
  }
};
</script>

<style lang="less">
  .require-order{
    .uploadImg{
      .upload-demo{
        .el-upload-list__item-name{display:none;}
        ul{
          .el-upload-list__item{
            width: 400px;
            height:400px;
            border: solid 1px #e2e2e2;
            position: relative;
            overflow: inherit;
            padding: 0;
            border-radius: 0;
            .el-upload-list__item-status-label,.el-icon-close-tip{display:none!important;}
            .el-upload-list__item-thumbnail{
                vertical-align: middle;
                display: inline-block;
                width: 400px;
                height: 400px;
                float: left;
                position: relative;
                z-index: 1;
                margin: 1px;
                z-index: -1;
            }
            .el-icon-close{
                display:block!important;
                width: 14px;
                height: 14px;
                background-color: #f84b4b;
                border-radius: 50%;
                top: -7px;
                right: -5px;
                &::before{
                  font-size: 13px !important;
                  color: #fff;
                  padding-left: 1px;
                }
              }
            }
        }
      }
    }
    .uploadImg{
      position: relative;
      .uploadImgName{
          display: inline-block;
          width: 400px;
          height: 26px;
          line-height: 26px;
          padding-left: 10px;
          box-sizing: border-box;
          float: left;
          background-color: #ffffff;
          border: solid 1px #e2e2e2;
      }
      .upload-demo{
        line-height: 26px;
        button{
          width: 54px;
          height: 26px;
          color: #3f8def;
          border: none;
          line-height: 0!important;
          border-radius: 0!important;
          line-height: 2!important;
          padding: 0!important;
        }
      }
    }
    .el-icon-search:before{
      font-size: 18px;
      color: #a4a4a4;
      cursor: pointer;
    }
    .el-input__icon{
      line-height: 26px;
    }
    .el-input{
      width: 308px;
    }
    .address-dlg-form{
      .el-button{
        height: 30px;
        padding: 0px;
        line-height: 30px;
        width: 86px;
      }
    }
    .deliverTab{
      span{
        display: inline-block;
        width: 70px;
        text-align: center;
        line-height:26px;
        border: solid 1px #dedede;
        margin-right: 10px;
        cursor: pointer;
        border-radius: 2px;
      }
      .activeColor{
        background-color: #3f8def;
        color: #fff;
      }
    }
    .deliverHeader{
      padding: 20px 0 10px;
      border-bottom: 1px solid #e2e2e2; 
      .title{
        text-align: center;
      }
      p+p{
        margin-top: 6px;
      }
      .printDeliver{
        margin-top: -24px;
        width: 74px;
        height: 24px;
        color: #ffffff;
        line-height: 24px;
        text-align: center;
        background-color: #3f8def;
        border-radius: 4px;
        cursor: pointer;
      }
    }
    .deliverBody{
      .info{
        line-height: 24px;
        margin-top:12px; 
      }
      .content{
        padding: 16px 0;
        .countInfo{
          margin-top:16px; 
          display: flex;
          justify-content: space-between;
        }
        table{
          td{
            text-align: center;
            vertical-align: middle;
            font-size: 12px;
            border: 1px solid #efefef;
          }
          thead{
            td{
              line-height: 24px;
            }
          }
          tbody{
            em{
              display: flex;
              >span{
                line-height: 48px;
                display: inline-block;
                margin: -1px;
                border: 1px solid #efefef;
              }
            }
            i{
              display: block;
              text-align: center;
              line-height: 24px;
            }
          }
        }
      }
    }
    .deliverOperBtn{
      display: flex;
      justify-content: center;
      padding-bottom:18px; 
      .el-button+.el-button {
          margin-left: 34px;
      }
      .el-button {
        padding: 0;
        width: 86px;
        height: 30px;
      }
    }
    .errorContent{
      line-height:240px;
      color: red;
      text-align: center;
    }
  }
</style>

<style lang="less" scoped>
  @common-color: #3f8def;
  .table {
    .table-header {
      display: flex;
      color: #333;
      > div {
        padding-bottom: 12px;
        text-align: center;
      }
      border-bottom: 3px solid #abcdf8;
    }
    .table-item {
      margin-top: 15px;
      width: 100%;
      border: 1px solid #eee;
      td {
        vertical-align: middle;
      }
      .table-item-header {
        display: flex;
        font-size: 14px;
        position: relative;
        > div + div {
          margin-left: 22px;
        }
        .tb-header-right {
          position: absolute;
          right: 28px;
          display: flex;
          align-items: center;
          > img {
            margin-right: 8px;
          }
        }
      }
      thead {
        tr {
          height: 38px;
          background: #f1f1f1;
          color: #919191;
          td {
            padding-left: 15px;
          }
        }
      }
      tbody {
        tr {
          td {
            padding: 12px 0px;
            border-top: 1px solid #eee;
          }
        }
      }
    }
  }
  .user-info {
    text-align: left;
    > div {
      line-height: 23px;
    }
  }
  .price-info {
    text-align: center;
    width: 100px;
    margin: auto;
    // padding-left:20px;
    box-sizing: border-box;
    color: #333;
    font-size: 14px;
    > div {
      line-height: 23px;
      & + div {
        color: #8e8e8e;
        font-size: 12px;
      }
    }
  }
  .order-type {
    color: #757575;
    font-weight: 600;
    // font-size: 14px;
  }
  .orderStatusStr{
    height: 48px;
    line-height: 48px;
  }
  .operator-area {
    .operator-top {
      display: flex;
      justify-content: space-around;
      div {
        // margin: 18px 0;
        width: 76px;
        height: 30px;
        line-height: 28px;
        box-sizing: border-box;
        border: 1px solid @common-color;
        border-radius: 5px;
        text-align: center;
        color: @common-color;
        cursor: pointer;
      }
    }
    .operator-bottom {
      height: 48px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap-reverse;
      align-items:center;
      span {
        display: block;
        line-height: 24px;
        flex: 0 0 50%;
        cursor: pointer;
        text-decoration: underline;
      }
      .cancel-btn {
        color: #b1b1b1;
      }
    }
  }
  .search-icon {
    cursor: pointer;
  }
  .v-align {
    display: flex;
    align-items: center;
    justify-content: center;
    >span{
      margin-left:3px;
    }
  }
  .refund-btn {
    display: inline-block;
    padding:0 10px;
    height: 26px;
    text-align: center;
    line-height: 26px;
    color: #919191;
    border: 1px solid #919191;
    border-radius: 4px;
    cursor: pointer;
    &:hover{
      background-color:@common-color;
      color:#fff;
      border: 1px solid @common-color;
    }
  }
  .refund-txt {
    color: #919191;
  }
  .gray-border {
    border-right: 1px solid #eee;
  }
  .gray-txt {
    color: #8e8e8e;
  }
  .goods {
    display: flex;
    align-items: center;
    padding-left: 20px;
    .left-item {
      width: 100px;
      height: 100px;
      text-align: center;
      // line-height: 100px;
      display: flex;
      align-items: center;
      img{
        width: 100px;
        height:100px;
      }
      .no-upload-img{
        display: block;
        width: 100px;
        height: 100px;
        margin: auto;
        background: #e7e7e7;
        text-align: center;
        line-height: 100px;
        font-size: 16px;
        color: #878787;
      }
    }
    .right-item {
      flex: 1;
      margin-left: 20px;
      > div {
        text-align: left;
        + div {
          margin-top: 12px;
        }
      }
    }
  }
  .tip-txt {
    background: #f58d8d;
    color: #fff;
    padding: 0 5px;
  }
  .Undata{
    line-height: 60px;
    text-align: center;
    border-bottom:1px solid #eee;
  }
</style>


