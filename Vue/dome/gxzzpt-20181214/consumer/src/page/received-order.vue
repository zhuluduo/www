<template>
<div class="received-order">
  <orderCommonPart :orderDlg='orderDlg' :refuseDialog='refuseDialog' @Success='isSuccess'></orderCommonPart>
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
                    <img src="../../static/img/shr.png" alt="">
                    <span>{{item.user?item.user.username:''}}</span>
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
              <div v-else="item.orderType==110010" class="goods zdbj">
                <div class="left-item">
                  <img v-if="ele.fileInfo" :src="ele.fileInfo?ele.fileInfo.thumbnailUrl:''" alt="">
                  <div v-else class="no-upload-img">未上传</div>
                  <!-- {{ele.itemName}} -->
                </div>
                <div class="right-item">
                  <div>文件单位：{{ele.productParams.fileUnit}}</div>
                  <div v-for="el in ele.productParams.steps">{{el.stepName}}：{{el.techniqueName}}</div>
                </div>
              </div>
            </td>
            <td width="108px" align="center">
              <div>&yen;{{ele.itemPrice.toFixed(2)}}<span class="gray-txt">*{{ele.quantity}}</span></div>
            </td>
            <td width="126px" align="center" :class="item.items.length >=2?'gray-border':''">
                 <!--  <div class="refund-btn" v-if="ele.canRefund&&(item.settlementType!=430020)">退款</div> -->
                <div class="gray-txt" v-if="ele.refundInfo">
                  <div>{{ele.refundInfo.refundStatusStr}}</div>
                  <div class="refund-btn" v-if="item.isOfflinePayment&&(ele.refundInfo.refundStatus==112065)"  @click="$router.push({path:'refund-order',query:{'id':ele.refundInfo.id}})">去退款</div>
                  <div class="refund-btn" v-if="ele.refundInfo.refundStatus==112060"  @click="$router.push({path:'refund-order',query:{'id':ele.refundInfo.id}})">同意</div>
                  <div class="refund-btn" v-if="ele.refundInfo.refundStatus==112060"  @click="alert({'refundId':ele.refundInfo.id},'确认拒绝退款','/custom/manufacturer/order/rejectRefund')">拒绝</div>
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
                <!-- <div v-if="item.orderType!=110010">含运费:￥{{item.expressPrice}}</div>
                <div v-if="item.orderType!=110010">税费:￥{{item.tax}}</div> -->
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
                  <div v-if="(item.status==112010)&&(item.settlementType==430010)&&(item.takeOrderStatus==380010)" @click="showOrderDlg(item)">修改金额</div>
                  <div @click="ensureAcceptOrder(item)" v-if="(item.status==112030)&&(item.takeOrderStatus==380010)">接单</div>
                  <div @click="refuseAcceptOrder(item)" v-if="(item.status==112030)&&(item.takeOrderStatus==380010)">拒绝</div>
                  <div @click="showExpressModal(item)" v-if="(item.takeOrderStatus==380020)&&(item.status==112030||item.status==112040)">发货</div>
                  <div @click="ensureCollection(item)" v-if="item.status==112015&&item.isOfflinePayment">确定收款</div>
                  <div v-if="item.status==112050&&item.hasCommentManu==true&&item.hasCommentDemand==false" @click="$router.push({path: '/usercenter/evaluate',query: { type:2,orderId:item.id, companyId: item.user.companyId, parentUrl:'/usercenter/received-order'}})">去评价</div>
                </div>
                <div class="operator-bottom">
                  <!-- <span class="cancel-btn" v-if="(item.status==112010||item.status==112020)&&(item.settlementType==430010)" @click="alert({id:item.id},'确认取消订单','/custom/order/close')">取消订单</span> -->
                  <!-- <span class="cancel-btn" v-if="(item.takeOrderStatus!=380010)&&(item.settlementType==430020)" @click="alert({id:item.id},'确认取消订单','/custom/order/close')">取消订单</span> -->
                  <!-- <span class="cancel-btn" v-if="item.status==112010||item.status==112020" @click="cancel(item)">申请交易纠纷</span> -->
                  <span class="" @click="$router.push({path:'/order-detail',query:{id:item.id,type:2}})">订单详情</span>
                  <router-link  v-if="item.status!=112020" :to="{path:'/contract/detail',query:{contractId:item.contract?item.contract.id:''}}" target="_blank"><span class="">合同详情</span></router-link>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!tableData" class="Undata">
        暂无数据
      </div>
      <div class="pagination">
        <el-pagination @current-change="changePage" background layout="prev, pager, next" :page-count="pagination.pageCount" :current-page="pagination.currentPageIndex" :page-size="pagination.pageSize"></el-pagination>
      </div>
    </div>
  </div>
  <el-dialog @close="resetForm('expressForm')" title="发货" width="640px" :visible.sync="showExpress">
      <!-- <el-collapse-transition>
        <div class="form-msg" v-show="errRes">{{errRes}}</div>
      </el-collapse-transition> -->
      <div class="deliverTab">
        <span @click="selectTab(false)"  v-bind:class="{ activeColor: !activeIndex }">历史发货</span>
        <span @click="selectTab(true)"  v-bind:class="{ activeColor: activeIndex}">本次发货</span>
      </div>
      <div id='deliverOrder'>
        <div class="deliverHeader">
            <div class="title">
              <p>{{deliveryInfo.dispatchCompany?deliveryInfo.dispatchCompany.dispatchCompanyName:''}}</p>
              <p>送货单</p>
            </div>
        </div>
        <div class="deliverBody">
          <div class="info">
            <div>
              <span>客户名称: {{deliveryInfo.user?deliveryInfo.user.companyName:''}}</span>
              <span class="fl-right"> 订单编号: {{deliveryInfo.orderNumber}}</span>
            </div>
            <div v-if='activeIndex'>送货日期: {{nowTime | dataFilter}}</div>
            <div>
              送货地址：
              {{deliveryInfo.addressInfo?deliveryInfo.addressInfo.province:''}}
              {{deliveryInfo.addressInfo?deliveryInfo.addressInfo.city:''}}
              {{deliveryInfo.addressInfo?deliveryInfo.addressInfo.address:''}}
            </div>
          </div>
          <div class="content">
              <div v-if='activeIndex'>
                <el-table  ref="multipleTable" :data="deliveryInfo.items" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="55" align="center">
                  </el-table-column>
                  <el-table-column label="零件编号" width="110" align="center">
                    <template slot-scope="scope">{{ scope.row.requirementNumber?scope.row.requirementNumber:'-'}}</template>
                  </el-table-column>
                  <el-table-column prop="itemName" label="零件姓名" width="120"  align="center">
                  </el-table-column>
                  <el-table-column prop="quantity" label="下单数量" width="100"  align="center">
                  </el-table-column>
                  <el-table-column prop="deliveryQuantitySum" label="交货数量" width="100"  align="center">
                  </el-table-column>
                  <el-table-column label="本次交货数量"  align="center">
                      <template slot-scope="scope">
                        <el-input-number :disabled="scope.row.deliveryType ==560010" v-model="scope.row.deliveryQuantity" :min="0" :max="(scope.row.quantity-scope.row.deliveryQuantitySum)" label="交货数量"></el-input-number>
                      </template>
                  </el-table-column>
                </el-table>
              </div>
              <div v-if='!activeIndex'>
                <div>
                  <table align="center">
                    <thead>
                      <tr>
                        <td width='100'>零件编号</td>
                        <td width='100'>零件名称</td>
                        <td width='70'>下单数量</td>
                        <td width='70'>交货数量</td>
                        <td width='90'>发货日期</td>
                        <td width='152'>配送</td>
                      </tr>
                    </thead>
                    <tbody v-if="deliveryHistoryInfo">
                      <tr v-for="(item,index) in deliveryHistoryInfo.deliveryList" :key="index">
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
                          <div v-if="(deliveryHistoryInfo.expressMode ==111020)||(deliveryHistoryInfo.expressMode ==111030) ">
                            <i>{{item.expressNumber}}</i>
                            <i>{{item.expressCompanyName}}</i>
                          </div>
                          <i v-else>
                            {{deliveryHistoryInfo.expressModeStr}}
                          </i>
                        </td>
                      </tr>
                    </tbody>
                    <tbody v-else>
                      <tr><td colspan="6"  class="errorContent">暂无数据</td></tr>
                    </tbody>
                  </table>
                  <div class="countInfo">
                    <span>已交货次数：{{deliveryHistoryInfo?deliveryHistoryInfo.deliveryList.length:0}}次</span>
                    <span>下单总量：{{totalAmount}}件</span>
                    <span>已发货：{{totalDeliverAmount}}件</span>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div class="deliverfooter" v-if="activeIndex">
          <div>
            <el-form label-position="left" ref="expressForm" :rules="rules" :model="expressForm" label-width="95px">
              <el-form-item label="快递方式：">
                <div>
                  {{deliveryInfo.expressModeStr}}
                </div>
              </el-form-item>
              <el-form-item label="快递公司："  prop="expressCompanyId">
                <div class="form-select">
                    <el-select filterable :disabled="(deliveryInfo.expressMode==111040||deliveryInfo.expressMode==111010)" v-model="expressForm.expressCompanyId" placeholder="请选择">
                      <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                </div>
              </el-form-item>
              <el-form-item label="快递单号："  prop="expressNumber">
                <el-input  :disabled="(deliveryInfo.expressMode==111040||deliveryInfo.expressMode==111010)" v-model="expressForm.expressNumber"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div v-if="activeIndex" class="deliverOperBtn">
        <el-button @click="resetForm('expressForm')">取 消</el-button>
        <el-button :disabled='deliveryflag' type="primary" @click="express" >确 定</el-button>
      </div>
  </el-dialog>
  <!-- <el-dialog title="修改价格" width="650px" :visible.sync="orderDlg.visible">
      <div class="place-order-dlg">
          <div class="company-info">选择供应商：<span>{{orderDlg.dispatchCompany}}</span></div>
          <table>
              <thead>
                  <tr>
                      <td width="190px">零件名称</td>
                      <td width="140px">数量</td>
                      <td width="130px">单价</td>
                      <td width="130px">小计</td>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="(ele,index) in orderDlg.tableData" :key="index">
                      <td>{{ele.itemName}}</td>
                      <td>{{ele.quantity}}</td>
                      <td class="td-number"><el-input-number size="small" :min="0" :precision="2" v-model="ele.itemPrice"></el-input-number></td>
                      <td>￥{{(ele.quantity*ele.itemPrice).toFixed(2)}}</td>
                  </tr>
              </tbody>
          </table>
          <div class="total-amount">订单总额:￥{{totalAmount}}</div>
          <div class="form-btn-box">
              <div class="form-btn form-next-btn" @click="submitChangePrice">确定</div>
              <div class="form-btn" @click="orderDlg.visible=false">取消</div>
          </div>
      </div>
  </el-dialog> -->
  <el-dialog title="确认收款" class="address-dlg-form" :visible.sync="payDialog.dialogVisible" width="600px">
    <div class="from-box">
      <div class="fromTitle" >
        <p>支付凭证：</p>
      </div>
      <img :src="payDialog.paymentCertUrl" alt="">
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="payDialog.dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="SubmitUploadImg">确 定</el-button>
    </span>
  </el-dialog>
  <!-- <el-dialog
    title="拒绝接单"
    :visible.sync="refuseDialog.Visible"
    width="600px">
    <div>
      <el-form label-position="left" :model="refuseDialog.refuseRuleForm" :rules="refuseDialog.rules" ref="refuseRuleForm" label-width="60px" class="demo-ruleForm">
        <el-form-item label="原因:" prop="rejectOrderReason">
          <el-select v-model="refuseDialog.refuseRuleForm.rejectOrderReason" placeholder="请选择拒绝原因">
            <el-option
              v-for="item in refuseDialog.options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="说明:" prop="rejectOrderRemark">
          <el-input type="textarea" v-model="refuseDialog.refuseRuleForm.rejectOrderRemark" maxlength='200' :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入拒绝说明"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="refuseDialog.Visible = false">取 消</el-button>
      <el-button type="primary" @click="refuseSubmitForm('refuseRuleForm')">确 定</el-button>
    </span>
  </el-dialog> -->
</div>
</template>
<script>
import orderCommonPart from '../components/subcomponents/orderCommon.vue';
import { validatNumber} from '../lib/validate.js';
import orderCommon from '../components/orderService/orderCommon.js';
import tabs from '../components/tabs.vue';
import '../lib/filter.js'//格式化金额（保留两位小数）过滤器
import operationBar from '../components/operationBar.vue';
export default {
  data() {
    return {
      orderService:new orderCommon(),
      options: [],
      tableData: [],
      errRes: "",
      expressForm: {
        id: "",
        expressCompanyId:null,
        expressNumber: null,
        deliverItems:[],
      },
      editForm: {
        id: "",
        amount: ""
      },
      showExpress: false,
      rules: {
        expressCompanyId: [{required: true, message: '请选择快递公司', trigger: 'change'}],
        expressNumber: [{ required: true, validator: validatNumber, trigger: "blur" }]
      },
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
      orderDlg: {
        visible: false,
        tableData:[],
        dispatchCompany:'',
        id:'',
      },
      payDialog:{
        dialogVisible:false,
        paymentCertUrl:''
      },
      refuseDialog:{
        Visible:false,
        orderId:'',
        refuseRuleForm:{
          rejectOrderReason:'',
          rejectOrderRemark :'',
        },
        options: [],
        rules: {
          rejectOrderReason: [
            { required: true, message: "请选择拒绝原因", trigger: "change" },
          ],
          rejectOrderRemark: [
             { required: true, message: "请输入拒绝说明", trigger: "blur" }
          ]
        }
      },
      deliveryInfo:{},
      deliveryflag:true,
      deliveryHistoryInfo:null,
      multipleSelection: [],
      activeIndex: true,
      nowTime:String(new Date())
    };
  },
  components:{
    orderCommonPart,
    'v-tabs':tabs,
    'v-operation': operationBar,
  },
  created() {
    this.getList();
  },
  computed: {
    //计算总的价格;
    totalDeliverAmount: function() {
      let totalAmount = 0
      if (this.deliveryHistoryInfo) {
       this.deliveryHistoryInfo.deliveryList.forEach(el => {
          el.deliveryItems.forEach(item =>{
            totalAmount += item.deliveryQuantity
          })
        });
        return totalAmount
      } else {
        return "0";
      }
    },
    totalAmount: function() {
      let totalAmount = 0
      if (this.deliveryHistoryInfo) {
        this.deliveryHistoryInfo.deliveryList[0].deliveryItems.forEach(ele =>{
           totalAmount = ele.quantity;
        })
        return totalAmount
      } else {
        return "0";
      }
    },
  },
  
  methods: {
    //返回数据的封装的方法;
    //接单的操作；
    async ensureAcceptOrder(item){
        var res = await this.orderService.ensureAcceptOrder(item)
        if(res.code == 200) {
          this.getList();
        }
        this.$showResultTips(res)
    },

    /*---------------返回修改成功的状态---------------------*/
    isSuccess(){
      this.getList();
    },

    /*---------------显示修改价格的操作----------------------------*/
    showOrderDlg(item){
      this.orderDlg.visible=true;
      this.orderDlg.tableData=item.items;
      this.orderDlg.dispatchCompany=item.dispatchCompany.dispatchCompanyName;
      this.orderDlg.id=item.id;
    },

   /*---------------拒绝接单弹框------------------------------*/
    refuseAcceptOrder(item){
      this.refuseDialog.Visible=true;
      this.getWords();
      this.refuseDialog.oderId=item.id;
    },

    showExpressModal(row) {
      this.showExpress = true;
      this.expressForm.id = row.id;
      let ParamsData = {id:row.id}
      this.getExpressCompanyList();
      this.getForDeliveryInfo(ParamsData);
      this.getDeliveryHistoryInfo(ParamsData);
    },
    getForDeliveryInfo(Data){
      this.$http.post("/custom/manufacturer/order/getForDelivery",Data).then(res => {
        if (res.data.code == 200) {
          this.deliveryInfo = res.data.data;
          this.deliveryInfo.items.forEach(ele => {
            //一次发货，同时发货数量和已发货的数量不相等；
            if(ele.deliveryType == 560010 && (ele.deliveryQuantitySum < ele.quantity )){
              this.$set(ele,'deliveryQuantity',ele.quantity)
            }else{
               this.$set(ele,'deliveryQuantity',0)
            }
          });
        } else {
          this.$message.error(res.data.message||"网络异常");
        }
      });
    },
    getDeliveryHistoryInfo(Data){
      this.$http.post("/custom/manufacturer/order/getDeliveryHistory",Data).then(res => {
        if (res.data.code == 200) {
          this.deliveryHistoryInfo = res.data.data;
        } else {
          this.$message.error(res.data.message||"网络异常");
        }
      });
    },
    resetForm(formName){
      this.$refs[formName].resetFields();
      this.showExpress = false;
    }, 

    //发送订单Api
    deliverOrderApi(){
      this.$http.post("/custom/manufacturer/order/deliver", this.expressForm).then(res => {
        if (res.data.code == 200) {
          this.resetForm("expressForm");
          this.showExpress = false;
          this.getList();
          this.$success('发货成功')
          setTimeout(()=>{
            let routeData = this.$router.resolve({name:"deliverOrder-Print"});
            window.open(routeData.href, '_blank');
          },2000)
        } else {
          this.$warning(res.data.message || "网络异常")
        }
      });
    },
    //发送
    express() {
      let isCheck=this.deliveryInfo.expressMode==111040||this.deliveryInfo.expressMode==111010;
      let [flag,i,deliverArray]= [false,0,[]];
      for (i; i < this.multipleSelection.length; i++) {
          if(this.multipleSelection[i].deliveryQuantity == 0){
            this.$warning('输入框数量不能为0')
            return false;
          }
          let deliverItems = {};
          deliverItems.orderItemId  = this.multipleSelection[i].id;
          deliverItems.deliveryQuantity = Number(this.multipleSelection[i].deliveryQuantity) ;
          deliverArray.push(deliverItems);
      }
      this.expressForm.deliverItems = deliverArray;
      this.expressForm.expressNumber =this.expressForm.expressNumber?Number(this.expressForm.expressNumber):null;
      this.deliveryInfo.expressForm =this.expressForm;
      localStorage.setItem('deliveryData',JSON.stringify(this.deliveryInfo));
      if(isCheck){
        this.deliverOrderApi()
      }else{
        this.$refs["expressForm"].validate(valid => {
          if (valid){
            this.deliverOrderApi()
          } else {
            return false;
          }
        });
      }
    },
    refund(row) {
      this.alert(
        { itemId: row.id },
        "确定申请退款",
        "/custom/manufacturer/order/applyForRefund"
      );
    },
    closeRefund(row) {
      this.alert(
        { itemId: row.id },
        "确定关闭退款",
        "/custom/manufacturer/refund/closeRefund"
      );
    },
    getWords() {
      this.$http.post("/getWords").then(res => {
          if (res.data.code == 200) {
            //获取拒绝接单的原因;
            this.refuseDialog.options=res.data.data["148"].item;
          }
        }).catch(res => {});
    },
    //获取公司列表
    getExpressCompanyList(){
       this.$http.post("/getExpressCompanyList").then(res => {
          if (res.data.code == 200) {
            this.options = res.data.data;
          }
        });
    },
    alert(data, msg, url) {
      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
          this.sure(data, url);
      }).catch(() => {});
    },
    sure(data, url) {
      this.$http.post(url, data).then(res => {
        if (res.data.code == 200) {
          this.pageIndex = 1;
          this.getList();
          this.$message({
            type: "success",
            message: res.data.message
          });
        } else {
          this.$message({
            type: "error",
            message: res.data.message || "网络异常"
          });
        }
      });
    },
    changePage(p) {
      this.ajaxData.pageIndex = p;
      this.getList();
    },
    search() {
      this.getList();
    },
    getList() {
      // this.tableData=data.data;
      this.$http.post("/custom/manufacturer/order/getList", this.ajaxData).then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.data;
            this.pagination = res.data.pagination;
            window.scrollTo(0,0);
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
    handleSelectionChange(val) {
        this.multipleSelection = val;
        this.deliveryflag = false;
        if (val.length>0) {
          val.forEach(ele => {
            if(ele.deliveryQuantitySum >= ele.quantity ){ this.deliveryflag = true }
          });
        }else{
          this.deliveryflag = true; 
        }
    },
    selectTab(flag){
      this.activeIndex = flag;
    },
    // submitChangePrice(item){
    //   let goodsArry=[];
    //   this.orderDlg.tableData.forEach(ele =>{
    //     let obj={
    //       'itemId':Number(ele.id),
    //       'price':Number(ele.itemPrice),
    //       'quantity':Number(ele.quantity),
    //     }
    //     goodsArry.push(obj)
    //   })
    //   let ParamsData={
    //     "id":Number(this.orderDlg.id),
    //     "items":goodsArry
    //   }
    //   this.$http.post("/custom/manufacturer/order/changeAmount",ParamsData).then(res => {
    //       if (res.data.code == 200) {
    //         this.$message({
    //           type: "success",
    //           message: res.data.message
    //         });
    //         this.getList();
    //         this.orderDlg.visible=false
    //       }else{
    //         this.$message({
    //           type: "error",
    //           message: res.data.message|| "网络异常"
    //         });
    //       }
    //   });
    // },
    //确定接单;
    // async ensureAcceptOrder(item){
    //   let id =Number(item.id)
    //   var result = await this.$http.post("/custom/manufacturer/order/accept",{"id":id}).then(res => {
    //       if (res.data.code == 200) {
    //         this.$message({
    //           type: "success",
    //           message: res.data.message
    //         });
    //         this.getList();
    //       }else{
    //         this.$message({
    //           type: "error",
    //           message: res.data.message|| "网络异常"
    //         });
    //       }
    //   });
    // },
    //确定接单;
    //  ensureAcceptOrder(item){
    //    let id =Number(item.id)
    //    this.$http.post("/custom/manufacturer/order/accept",{"id":id}).then(res => {
    //       if (res.data.code == 200) {
    //         this.$message({
    //           type: "success",
    //           message: res.data.message
    //         });
    //         this.getList();
    //       }else{
    //         this.$message({
    //           type: "error",
    //           message: res.data.message|| "网络异常"
    //         });
    //       }
    //   });
    // },
    //提交拒绝接单
    // refuseSubmitForm(formName){
    //     this.$refs[formName].validate(valid => {
    //       if (valid) {
    //         let requestParams = {
    //           id:this.refuseDialog.oderId,
    //           rejectOrderReason: this.refuseDialog.refuseRuleForm.rejectOrderReason,
    //           rejectOrderRemark: this.refuseDialog.refuseRuleForm.rejectOrderRemark,
    //         };
    //         this.refuseOrderApi(requestParams);
    //       } else {
    //         return false;
    //       }
    //   });
    // },
    //拒绝接单请求api
    // refuseOrderApi(requestParams) {
    //   this.$http.post("/custom/manufacturer/order/reject", requestParams).then(res => {
    //     if (res.data.code == 200) {
    //       this.$message({
    //         type: "success",
    //         message: res.data.message
    //       });
    //       this.$refs["refuseRuleForm"].resetFields(); //清除form表单数据；
    //       this.refuseDialog.Visible=false;
    //       //刷新页面；
    //       this.pageIndex = 1;
    //       this.getList();
    //     } else {
    //       this.$message({
    //         type: "error",
    //         message: res.data.message
    //       });
    //     }
    //   });
    // },
    //确定支付
    ensureCollection(item){
      this.payDialog.dialogVisible=true;
      this.payDialog.id=item.id;
      this.payDialog.paymentCertUrl=item.paymentCertUrl;
    },
    SubmitUploadImg(){
      let id=this.payDialog.id;
      this.$http.post("/custom/manufacturer/order/confirmForPay",{"id":id}).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: res.data.message
            });
            this.payDialog.dialogVisible=false;
            this.getList();
          }else{
            this.$message({
              type: "error",
              message: res.data.message|| "网络异常"
            })
          }
      });
    }
  }
};
</script>
<style lang="less">
.received-order{
  @common-color: #3f8def;
  .box {
    margin: 0 auto;
    .el-input{
      width: 308px;
    }
  }
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
          // position: absolute;
          // right: 28px;
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
          height: 104px;
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
        line-height: 24px;
        flex: 0 0 50%;
        display: block;
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
    width: 56px;
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
        height: 100px;
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
  .refund-btn {
    margin-top: 10px;
  }
  .place-order-dlg{
    .company-info{
        margin-bottom: 10px;
        span{
            color: #3f8def;
        }
    }
    .total-amount{
        text-align: right;
        font-weight: bold;
        line-height: 35px;
    }
    table {
      thead, tbody{
        td {
            text-align: center;
            padding: 10px 0;
            border-top: 1px solid #e2e2e2;
            border-bottom: 1px solid #e2e2e2;
        }
        .td-number{
            padding: 10px 10px;
        }
      }
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
  .from-box{
    max-height: 580px;
    display: flex;
    .fromTitle{
      padding-bottom:10px;
    }
    img{
      display: block;
      width: 80%;
    }
  }
  .el-select{
    width: 100%;
  }
  .Undata{
    line-height: 60px;
    text-align: center;
    border-bottom:1px solid #eee;
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
      .el-input__inner {
        text-align: center;
      }
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
      .el-input-number{
         width: 80px;
        .el-input-number__decrease,.el-input-number__increase{
          display: none;
        }
        .el-input__inner{
          width: 80px;
          padding: 0;
        }
      }
      .errorContent{
        line-height:120px;
        color: red;
        text-align: center;
      }
    }
  }
  .deliverfooter{
     .el-select,.el-input__inner{
       width:244px;
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
}
</style>
