<template>
  <div class="pay-page">
    <div class="content">
      <div class="order-step">
        <v-orderStep :active="StepActive"></v-orderStep>
      </div>
      <div class="pay-content">
        <div class="page-box">
          <div class="order-info">
            <div class="order-state">订单已提交，请尽快支付您的订单 <span @click="$router.push({path:'/order-detail',query:{orderNumber:orderNumber,type:1}})">查看订单详情</span></div>
            <div class="amount">应付总金额：<span>￥{{totalPrice}}</span></div>
          </div>
          <div class="title">
              支付平台 
              <span  v-if="radio==4">如果已经支付成功，请进入<i class="link"  @click="$router.push({path:'/usercenter/require-order'})">我的订单</i>查看订单最新状态</span>          
          </div>
          <div class="pay-platform">
            <div class="pay-type">
              <div class="weChat-pay box">
                <div class="radio"  :class="radio==1?'checked':''" >
                  <el-radio v-model="radio" label="1">
                    <img src="../../static/img/weixin.jpg" alt="">
                  </el-radio>
                </div>
                <div class="weChatCode" v-show="radio==1">
                  <div class="left">
                    <!-- <img src="" alt=""> -->
                    <qrcode :value="wechatUrl" :options="{ size: 180 }"></qrcode>
                    <!-- <p class="order-number">订单号：187437348939</p> -->
                  </div>
                  <!-- <div class="right">
                    <p class="prompt">请使用微信扫描二维码以完成支付</p>
                  </div> -->
                </div>
              </div>
              <div class="alipay box">
                <div class="radio" :class="radio==2?'checked':''" >
                  <el-radio v-model="radio" label="2">
                    <img src="../../static/img/zhifubao.jpg" alt="">
                  </el-radio>
                </div>
                <div class="code" v-show="radio==2">
                  <div>
                    <p>应付总额：<span class="red-text">￥{{totalPrice}}</span></p> 
                    <a class="btn" :href="alipayUrl">去支付</a>
                  </div>
                </div>
              </div>
              <div class="offlinePay box">
                <div class="radio" :class="radio==3?'checked':''" >
                  <el-radio v-model="radio" label="3">
                      <span class="offlinebox">线下支付</span>
                  </el-radio>
                </div>
                <div class="code" v-show="radio==3">
                  <div>
                    <p>应付总额：<span class="red-text">￥{{totalPrice}}</span></p> 
                    <span class="btn"  @click="gotoOffline">确定</span>
                  </div>
                </div>
              </div>
              <div class="bankPay  box" >
                <div class="radio" :class="radio==4?'checked':''" >
                  <el-radio v-model="radio" label="4">
                      <span class="bankPaybox">银联支付</span>
                  </el-radio>
                </div>
                <div class="code" v-show="radio==4">
                  <div>
                    <p>应付总额：<span class="red-text">￥{{totalPrice}}</span></p> 
                    <span class="btn"  @click="bankPayUrl">确定</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import orderStep from "../components/orderStep.vue";
import VueQrcode from "@xkeshi/vue-qrcode";
export default {
  components: {
    "v-orderStep": orderStep,
    qrcode: VueQrcode
  },
  data() {
    return {
      status: false,
      totalPrice: "",
      wechatUrl: "",
      alipayUrl: "",
      id: "",
      orderNumber:"",
      radio: "",
      StepActive: {
        stepOne: false,
        stepTwo: false,
        stepThr: true,
        stepFou: false
      },
      timer: null
    };
  },
  created() {
    this.id = Number(this.$route.query.id);
    this.orderNumber = this.$route.query.orderNumber;
    this.totalPrice = Number(this.$route.query.price);
    this.checkStatus();
    this.timer = setInterval(() => {
      this.checkStatus();
    }, 5000);
  },
  watch: {
    radio(newVal, val) {
      if (newVal == 1) {
        this.genWechatUrl();
      } else if (newVal == 2) {
        this.genAliPayUrl();
      } 
    }
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer);
    next();
  },
  methods: {
    checkStatus() {
      this.$http.post("/custom/payment/getStatus", { id: this.id }).then(res => {
          if (res.data.data == 115010) {
            clearInterval(this.timer);
            this.$router.push({ path: "/pay-success",query:{'isOfflinePayment':false} });
          } else {

          }
        });
    },
    genWechatUrl() {
      this.$http.post("/custom/payment/wechat", { id: this.id }).then(res => {
        if (res.data.code == 200) {
          this.wechatUrl = res.data.data;
        }
      });
    },
    genAliPayUrl() {
      this.$http.post("/custom/payment/ali", { id: this.id }).then(res => {
        if (res.data.code == 200) {
          this.alipayUrl = res.data.data;
        }
      });
    },
    gotoOffline(){
      this.$http.post("/custom/payment/offline", { id: this.id }).then(res => {
        if (res.data.code == 200) {
            this.$router.push({ path: "/pay-success",query:{'isOfflinePayment':true}});
          }
      });
    },
    bankPayUrl(){
      let parmes={
        id:this.id
      }
      this.$http.post("/custom/payment/huifengPay",parmes).then(res => {
        if (res.data.code == 200) { 
            var p='<html><head><title>打印</title></head><body>'+res.data.data+'</body></html>';
            var w=window.open('about:blank');
            w.document.write(p);
            w.document.close();
            // var p=res.data.data;
            // let divELE = document.createElement('div');
            // divELE.innerHTML=p;
            // var w=window.open('about:blank');
            // w.document.body.appendChild(divELE);;
            // w.document.pc_cashier_form.submit();;
            // w.document.close();
          }
      });
    }
  }
};
</script>
<style lang="less" rel="stylesheet/less" type="text/less" scoped>
.pay-page {
  .content {
    width: 1200px;
    margin: 0 auto;
    .order-step {
      margin-top: 120px;
    }
    .pay-content {
      box-sizing: border-box;
      // padding: 40px 20px;
      background: #f1f1f1;
      .page-box {
        border: 1px solid #e2e2e2;
        padding: 0 30px;
        background: #fff;
        .order-info {
          display: flex;
          justify-content: space-between;
          padding: 16px 0;
          border-bottom: 1px solid #e2e2e2;
          }
          .order-state {
            span {
            color: #3f8def;
            margin-left: 10px;
            cursor: pointer;
          }
          .amount {
            span {
              color: #f84b4b;
              font-size: 16px;
            }
          }
        }
        .title {
          padding: 30px 0;
          >span{
            margin-left:10px; 
          }
        }
        .pay-platform {
          .pay-type {
            display: flex;
            justify-content: flex-start;
            > div {
              margin-right:20px; 
              width: 500px;
              // height: 300px;
            }
          }
          .pay-type {
            display: flex;
            margin-bottom: 50px;
            .box {
              .radio {
                padding: 10px;
              }
              // .checked {
              //   background: #f5f5f5;
              // }
            }
            .weChat-pay {
              img {
                width: 188px;
                height: 66px;
              }
              .weChatCode {
                display: flex;
                padding: 30px 0px;
                // background: #f5f5f5;
                .left {
                  margin-left: 40px;
                  img {
                    display: block;
                    width: 18px;
                    height: 180px;
                    background: #fff;
                  }
                  .order-number {
                    margin-top: 10px;
                    font-size: 16px;
                    text-align: center;
                  }
                }
                .right {
                  padding: 0px 40px;
                  display: flex;
                  align-items: center;
                  .prompt {
                    font-size: 20px;
                    line-height: 40px;
                  }
                  .order-number {
                    margin-top: 40px;
                    font-size: 16px;
                  }
                }
              }
            }
            .alipay {
              img {
                width: 188px;
                height: 66px;
              }
            }
            .offlinePay,.bankPay{
              .offlinebox,.bankPaybox{
                display: inline-block;
                width: 186px;
                height: 66px;
                border: 1px  solid #979797;
                font-size: 36px;
                line-height: 66px;
                text-align: center;
              }
            }
            .code {
              height: 240px;
              display: flex;
              align-items: flex-end;
              justify-content: center;
              text-align: center;
              > div {
                font-size: 24px;
                .red-text {
                  color: #f00;
                  display: inline-block;
                }
                .btn {
                  background: #3f8def;
                  display: inline-block;
                  color: #fff;
                  padding: 5px 20px;
                  border-radius: 5px;
                  margin-top: 20px;
                  cursor: pointer;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
