<template>
  <div class="pay-page">
    <div class="content">
      <div class="order-step">
        <v-orderStep :active="StepActive"></v-orderStep>
      </div>
      <div class="pay-content">
        <div class="page-box">
          <div class="success-msg" v-if="settlementType==430020">
            <i class="el-icon-success"></i>
            您的月结订单{{orderNumber}}提交成功，供应商确认接单后将根据约定生产和交付。页面将在{{time}}秒后跳转到我的订单....
          </div>
          <div class="success-msg" v-if="settlementType!=430020">
            <i class="el-icon-success"></i>
            {{Payment?'待支付，':'支付成功，'}}页面将在{{time}}秒后自动跳转至 <span @click="$router.push({path:'/usercenter/require-order'})">我的订单</span>
          </div>
          <!-- <div class="order-info">您已经为订单 160817000005 成功支付<span> ¥122.57</span></div> -->
        </div>
      </div>
      <!-- <div class="pay-content" v-show="!paySuccess">
        <div class="page-box">
          <div class="success-msg">
            <i class="el-icon-error"></i>
            支付失败 <span>原因呢</span>
          </div>
          <div class="order-info">如有疑问，请联系我们：0755-86959186</div>
        </div>
      </div> -->
    </div>
  </div>
</template>
<script>
  import orderStep from '../components/orderStep.vue';
  export default{
      components:{
        'v-orderStep':orderStep,
      },
      data(){
        return {
          time:6,
          radio:'',
          Payment:false,
          settlementType:'',
          StepActive:{
            stepOne:false,
            stepTwo:false,
            stepThr:false,
            stepFou:true,
            orderNumber:''
          },
        }
      },
      created(){
        this.Payment = this.$route.query.isOfflinePayment;
        this.settlementType = this.$route.query.settlementType;
        this.orderNumber = this.$route.query.orderNumber;
        var timer = setInterval(()=>{
          this.time--;
          if(this.time == 0){
            this.$router.push({path:'/usercenter/require-order'});
            clearInterval(timer);
          }
        },1000);
      }
  }

</script>
<style lang="less" rel="stylesheet/less" type="text/less" scoped>
.pay-page{
  padding-top: 80px;
  .content{
    width: 1200px;
    margin: 0 auto;
    .order-step{
      margin-top: 120px;
    }
    .pay-content{
      box-sizing: border-box;
      padding: 40px 20px;
      background: #f1f1f1;
      margin: 30px 0 50px;
      .page-box{
        border: 1px solid #e2e2e2;
        padding: 0 30px;
        background: #fff;
        height: 430px;
        color: #7c7c7c;
        .success-msg{
          font-size: 24px;
          text-align: center;
          margin-top: 150px;
          padding: 0 120px;
          i{
            font-size: 24px;
            display: inline-block;
            width: 50px;
            height: 30px;
          }
          span{
            font-size: 24px;
            color: #3f8def;
            cursor: pointer;
          }
        }
        .order-info{
          font-size: 28px;
          text-align: center;
          margin-top: 30px;
          span{
            cursor: pointer;
            color: #f84b4b;
          }
        }
      }
    }
  }
}
</style>
