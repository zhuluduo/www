<template>
  <div class="cancel-order">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>订单</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>取消订单</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="order-info">
      <fieldset class="fieldset">
        <legend>订单信息</legend>
        <div class="content" v-if="detail.order">
          <div class="price-info">
            <ul>
              <li>订单总额：<span class="red-text">&yen;{{detail.order.totalPrice}}</span></li>
              <li>商品金额：&yen;{{detail.order.productPrice}}</li>
              <li v-if="detail.order.orderType!=110010">运费：&yen;{{detail.order.expressPrice}}</li>
              <li v-if="detail.order.orderType!=110010">税点：{{(detail.order.tax/detail.order.productPrice*100).toFixed(2)}}%（&yen;{{detail.order.tax}}）</li>
            </ul>
          </div>
          <div class="user">
              <div class="v-align">
                <img src="../../static/img/lxr.png" alt="">
                <span>{{detail.order.contactName||"--"}}</span>
              </div>
              <div>手机：{{detail.order.contactPhone}}</div>
              <div>邮箱：{{detail.order.contactEmail}}</div>
          </div>
          <div class="table">
            <table class="table-item"  v-for="(ele,index) in detail.orderItemInfo" :key="index">
              <thead>
                <tr>
                  <td colspan="6">
                    <div class="table-item-header">
                        <div>{{detail.createTime}}</div>
                        <div>订单号：{{detail.orderNumber}}</div>
                        <div><span class="order-type">{{detail.orderType==110010?'人工报价':'自动报价'}}<span v-if="detail.status==112025">（有改价）</span></span></div>
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
                  <td width="50%" align="center">
                    <div v-if="detail.order.orderType==110010" class="goods rgbj">
                      <div class="left-item">
                        <!-- {{ele.itemName}} -->
                        <img :src="ele.fileInfo?ele.fileInfo.thumbnailUrl:''" alt="">
                      </div>
                      <div class="right-item">
                          <div>需求编号：{{ele.requirementNumber}}</div>
                          <div>工艺类别：{{ele.requirementTypeStr}}</div>
                          <div>行业：{{ele.industryName}}</div>
                        <div v-if="detail.order.orderType!=110010">含税报价：&yen;{{(detail.itemPrice+detail.tax).toFixed(2)}}</div>
                        <div v-if="detail.order.orderType!=110010">不含税报价：&yen;{{detail.itemPrice}}</div>
                        <div v-if="detail.order.orderType!=110010">运费报价：&yen;{{detail.itemExpressPrice}}</div>
                      </div>
                    </div>
                    <div v-else="detail.order.orderType==110010" class="goods zdbj">
                      <div class="left-item">
                        <img :src="detail.fileInfo?detail.fileInfo.thumbnailUrl:''" alt="">
                      </div>
                      <div class="right-item">
                          <div>服务：{{ele.productParams?ele.productParams.serviceName:''}}</div>
                          <div>材质：{{ele.productParams?ele.productParams.material.name:''}}</div>
                          <div>文件单位：{{ele.productParams?ele.productParams.fileUnit:''}}</div>
                          <div v-if="ele.productParams&&ele.productParams.steps&&ele.productParams.steps.length">
                              <div v-for="el in ele.productParams.steps">{{el.stepName}}：{{el.techniqueName}}</div>
                          </div>
                      </div>
                    </div>
                  </td>
                  <td align="left">
                    <div>&yen;{{ele.itemPrice}}<span class="gray-txt">*{{ele.quantity}}</span></div>
                  </td>
                  <td width="25%" align="center">
                    <div class="price-info">
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
      </fieldset>
    </div>
    <div class="operator-area">
      <fieldset class="fieldset">
        <legend>退款申请</legend>
        <div class="content">
          <div class="content-row">退款原因：{{detail.refundReason}}</div>
          <div class="content-row">提交时间：{{detail.createTime}}</div>
        </div>
      </fieldset>
    </div>
    <div class="operator-area">
      <fieldset class="fieldset">
        <legend>退款协商</legend>
        <div class="content">
              <div class="content-row">退款金额：{{detail.amount}}</div>
              <div class="content-row">退款方式：原路返回</div>
              <div class="content-row">退款说明：{{detail.merchantRemark}}</div>
              <div class="content-row">提交时间：{{detail.refundConsultTime |dataFilter}}</div>
        </div>
      </fieldset>
    </div>
    <div class="fixed-area">
      <div class="btn-area">
        <el-button :class="canRefund?'':'refund'" @click="refund()">退款</el-button>
        <el-button @click="$router.push({path:'/main/needs-order'})">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {dataFilter} from '../lib/filter.js'
export default {
  data() {
    return {
      canRefund: true,
      radio: "1",
      refundForm: {
        id: "",
        refundPrice: "",
        merchantRemark: ""
      },
      refundInfo: {},
      detail: {},
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
      this.$http.post("/operation/order/refund", {
          refundId: this.refundForm.id
        }).then(res => {
          if (res.data.code == 200) {
            this.canRefund = false;
            this.$message({
              type: "success",
              message: res.data.message
            });
            if(res.data.data){
              window.open(res.data.data); 
            }
            this.timer = setInterval(() => {
              this.checkStatus();
            }, 5000);
          } else {
            this.$message({
              type: "error",
              message: res.data.message || "退款失败"
            });
          }
        })
        .catch(res => {});
    },
    beforeDestroy() {
      clearInterval(this.timer);
    },
    checkStatus() {
      this.$http.post("/operation/order/getRefundStatus", {
          refundId: this.refundForm.id
        }).then(res => {
          if (res.data.code == 200 && res.data.data == 112070) {
            this.$router.push({ path: "/main/order-manage"});
          } else{
            this.canRefund = true;
          }
        })
        .catch(res => {});
    },
    getDetail() {
      this.$http.post("/operation/order/getRefundInfo", {refundId: this.refundForm.id}).then(res => {
          if (res.data.code == 200) {
            this.detail = res.data.data;
          }
        }).catch(res => {});
    }
  }
};
</script>
<style lang="less" scoped>
.fieldset {
  border: 1px solid #e2e2e2;
  border-radius: 5px;
  margin-top: 20px;
  padding: 20px;
}
.refund-form {
  margin-top: 30px;
}
.operator-area {
  margin-bottom: 20px;
  .fieldset {
    .content {
      .warn {
        color: #919191;
      }
      .content-row {
        line-height: 32px;
      }
    }
  }
}
.order-info {
  .fieldset {
    .content {
      .ticket-info {
        p {
          font-weight: 600;
        }
        > ul {
          display: flex;
          flex-wrap: wrap;
          padding-left: 10px;
          > li {
            width: 25%;
            margin-top: 10px;
          }
        }
      }
      .user{
        display: flex;
        padding-bottom: 24px;
        align-items: center;
        >div{
          flex: 0 0 25%;
        }
      }
      .price-info {
        > div + div {
          margin-top: 30px;
        }
        > ul {
          display: flex;
          flex-wrap: wrap;
          padding-bottom: 24px;
          align-items: center;
          > li {
            width: 25%;
          }
        }
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
    }
  }
}
.red-text {
  color: #f00;
}
.refund {
  background: #f1f1f1;
  cursor: not-allowed;
  &:hover {
    color: #333;
    background: #f1f1f1;
    border: 1px solid #dcdfe6;
  }
}
.fixed-area {
  width: 100%;
  box-sizing: border-box;
  .btn-area {
    // padding:20px 0px;
    height: 80px;
    align-items: center;
    // text-align: center;
    display: flex;
    justify-content: space-around;
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
    img {
      width: 100px;
      height: 100px;
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
.user-info {
  div + div {
    margin-top: 12px;
  }
}
</style>


