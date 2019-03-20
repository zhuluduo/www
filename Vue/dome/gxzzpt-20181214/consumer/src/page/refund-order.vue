<template>
  <div id="refund-order">
     <div class="list">
      <div class="row ">
        <div class="row-col">
          <p>订单信息</p>
          <div class="row-content" v-if="detail.order">
            <div class="row-content-item price-info">
              <span>订单总额：<span class="red-text">&yen;{{detail.order.totalPrice}}</span></span>
              <span>商品金额：&yen;{{detail.order.productPrice}}</span>
              <span v-if="detail.order.orderType!=110010">运费：&yen;{{detail.order.expressPrice}}</span>
              <span v-if="detail.order.orderType!=110010">税点：{{detail.order.tax/detail.order.productPrice*100}}%（&yen;{{detail.order.tax}}）</span>
            </div>
            <div class="row-content-item user">
              <div class="v-align user-info">
                <span>联系人:</span>
                <span>{{detail.order.contactName||"--"}}</span>
              </div>
              <div>{{detail.order.contactPhone}}</div>
              <div>{{detail.order.contactEmail}}</div>
            </div>
            <div class="row-content-item table">
              <table class="table-item" v-for="(ele,index) in detail.orderItemInfo" :key="index">
                <thead>
                  <tr>
                    <td colspan="4">
                      <div class="table-item-header">
                          <div>{{detail.createTime}}</div>
                          <div>订单号：{{ele.requirementNumber}}</div>
                          <div><span class="order-type">{{detail.order.orderType==110010?'人工报价':'自动报价'}}<span v-if="ele.status==112025">（有改价）</span></span></div>
                          <div class="tb-header-right">
                              <img src="../../static/img/shr.png" alt="">
                              <span>{{detail.user?detail.user.username:''}}</span>
                          </div>
                      </div>
                    </td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td width="60%" align="center">
                      <div v-if="detail.order.orderType==110010" class="goods rgbj">
                        <div class="left-item">
                          <!-- {{ele.itemName}} -->
                          <img v-if="ele.fileInfo" :src="ele.fileInfo?ele.fileInfo.thumbnailUrl:''" alt="">
                          <div v-else class="no-upload-img">未上传</div>
                        </div>
                        <div class="right-item">
                          <div>需求编号：{{ele.requirementNumber}}</div>
                          <div>工艺类别：{{ele.requirementTypeStr}}</div>
                          <div>行业：{{ele.industryName}}</div>
                          <div v-if="detail.order.orderType!=110010">含税报价：&yen;{{ele.itemPrice*(1+ele.tax)}}</div>
                          <div v-if="detail.order.orderType!=110010">不含税报价：&yen;{{ele.itemPrice}}</div>
                          <div v-if="detail.order.orderType!=110010">运费报价：&yen;{{ele.itemExpressPrice}}</div>
                        </div>
                      </div>
                      <div v-else class="goods zdbj">
                        <div class="left-item">
                          <img v-if="ele.fileInfo" :src="ele.fileInfo?ele.fileInfo.thumbnailUrl:''" alt="">
                          <div v-else class="no-upload-img">未上传</div>
                        </div>
                        <div class="right-item">
                          <div>服务：{{ele.productParams?ele.productParams.serviceName:''}}</div>
                          <div>材质：{{ele.productParams?ele.productParams.material.name:''}}</div>
                          <div>文件单位：{{ele.productParams?ele.productParams.fileUnit:''}}</div>
                          <div v-if="ele.productParams&&ele.productParams.steps&&ele.productParams.steps.length">
                              <div v-for="(el,index) in ele.productParams.steps" :key="index">{{el.stepName}}：{{el.techniqueName}}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td align="left">
                      <div>&yen;{{ele.itemPrice}}<span class="gray-txt">*{{ele.quantity}}</span></div>
                    </td>
                    <td width="20%" align="center">
                      <div>
                        <div>￥{{ele.itemPrice*ele.quantity}}</div>
                        <!-- <div>含运费:￥{{ele.expressPrice}}</div>
                        <div>税费:￥{{ele.tax}}</div> -->
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="row-col">
          <p>退款申请</p>
          <div class="row-content">
            <div class="row-content-item refund">
              <div>退款原因：{{detail.refundReason}}</div>
              <div>提交时间：{{detail.createTime}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="row-col">
          <p>退款协商</p>
          <div  class="row-content">
            <div v-if="detail.status==112060">
              <div class="row-content-item">
                <div class="red-text">注意：如果订单已经产生成本，请与客户协商好退款金额再执行退款</div>
              </div>
              <div class="row-content-item form">
                <el-form label-position="left" :model="refundForm" class="refund-form"  label-width="85px">
                        <el-form-item label="退款金额：" class="sp-input">
                          <div class="sp-input">
                            <el-input v-model="refundForm.refundPrice" placeholder=""></el-input>
                            <span>不能大于{{detail.order?detail.order.totalPrice:''}}</span>
                          </div>
                        </el-form-item>
                        <el-form-item label="退款方式：">
                          <v-check :active="true">原路退回</v-check>
                        </el-form-item>
                        <el-form-item label="退款说明：" class="full-row">
                          <el-input type="textarea" resize="none" v-model="refundForm.merchantRemark" placeholder=""></el-input>
                        </el-form-item> 
                  </el-form>
              </div>
            </div>
            <div class="ensureRefundOffline" v-if="detail.status==112065">
              <div class="content-row">退款金额：{{detail.amount}}</div>
              <div class="content-row">退款方式：原路返回</div>
              <div class="content-row">退款说明：{{detail.merchantRemark?detail.merchantRemark:'-'}}</div>
              <div class="content-row">提交时间：{{detail.refundConsultTime |dataFilter}}</div>
            </div>
          </div>
        </div>
      </div>
     </div>
     <div class="btn-area">
       <div class="btn cancel" @click="$router.push({path:'/usercenter/require-order'})">取消</div>
       <div class="btn" v-if="detail.status==112060" @click="refund()">退款</div>
       <div class="btn" v-if="detail.status==112065" @click="EnsureRefund()">确定退款</div>
      </div>
  </div>
</template>
<script>
import check from '../components/checkButton.vue';
import {dataFilter} from '../lib/filter.js'
export default {
  components:{
    "v-check":check,
  },
  data() {
    return {
      radio: "1",
      refundForm: {
        id: "",
        refundPrice: "",
        merchantRemark: ""
      },
      detail: {},
      refundInfo:{},
      timer: null
    };
  },
  created() {
    this.refundForm.id = Number(this.$route.query.id);
    this.getDetail();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    refund() {
      this.$http.post("/custom/manufacturer/order/agreeRefund", {
          refundId: this.refundForm.id,
          refundPrice: Number(this.refundForm.refundPrice),
          merchantRemark: this.refundForm.merchantRemark
        }).then(res => {
          if (res.data.code == 200) {
            this.$router.push({ path: "/usercenter/received-order" });
          } else {
            this.$message({
              type: "error",
              message: res.data.message || "退款失败"
            });
          }
        })
        .catch(res => {});
    },
    EnsureRefund(){
        this.$http.post("custom/manufacturer/order/refund", {refundId: this.refundForm.id,}).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: res.data.message,
              duration:1000,
            });
            setTimeout(()=>{
              this.$router.push({ path: "/usercenter/received-order"});
            },2000)
          } else {
            this.$message({
              type: "error",
              message: res.data.message || "退款失败"
            });
          }
        })
        .catch(res => {});
    },
    getDetail() {
      this.$http.post("/custom/manufacturer/order/getRefundInfo", {refundId: this.refundForm.id}).then(res => {
          if (res.data.code == 200) {
            this.detail = res.data.data;
          }
        }).catch(res => {});
      }
    }
};
</script>
<style lang="less" scoped>
@common-color: #3f8def;
.list{
  .row{
    margin-top:30px;
    .row-col{
      >p{
        color:#333;
        font-size:14px;
        font-weight: 600;
        margin-bottom: 14px;
      }
      .row-content{
        padding: 24px 20px;
        background: #f5f5f5;
        
      }
    }
  }
}
.user{
  display: flex;
  padding-bottom: 22px;
  >div{
    margin-right: 76px;
  }
}
.price-info {
  display: flex;
  padding-bottom: 22px;
  > span {
    flex: 0 0 25%;
  }
}
.refund{
  >div{
    &+div{
      margin-top:26px;
    }
  }
}
.form{
  width: 600px;
  margin-top:32px;
}
.ensureRefundOffline{
  line-height: 32px;
}
.red-text {
  color: #f00;
}
.table {
  border: 1px solid #e2e2e2;
  .table-header {
    margin-top: 40px;
    display: flex;
    color: #333;
    > div {
      padding-bottom: 12px;
      text-align: center;
    }
  }
  .table-item {
    width: 100%;
    background: #fff;
    td {
      vertical-align: middle;
    }
    .table-item-header {
      display: flex;
      font-size: 14px;
      > div + div {
        margin-left: 22px;
      }
    }
    thead {
      tr {
        height: 38px;
        color: #919191;
        td {
          padding-left: 15px;
        }
      }
    }
    tbody {
      border-top: 1px solid #e2e2e2;
      tr {
        // height: 104px;
        td {
          padding: 22px 0px;
        }
      }
    }
  }
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
      width:100px;
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
    div {
      text-align: left;
      + div {
        margin-top: 12px;
      }
    }
  }
}
td {
  .price-info {
    text-align: left;
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
}
.sp-input{
  // display: flex;
  >.el-input{
    width: 150px;
  }
  >span{
    margin-left:7px;
    color:#a5a5a5;
  }
}
.full-row{
  margin-bottom:0px !important; 
}
.btn-area{
  margin-top: 84px;
  text-align: center;
  .btn{
    display: inline-block;
    width: 106px;
    height: 42px;
    line-height: 42px;
    text-align: center;
    cursor: pointer;
    background: @common-color;
    color:#fff;
    border-radius: 4px;
  }
  .cancel{
    background: #d0d0d0;
    margin-right:100px;
  }
}
</style>


