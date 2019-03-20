<template>
  <div class="pay-page">
    <div class="content">
      <div class="order-step">
        <v-orderStep :active="StepActive"></v-orderStep>
      </div>
      <div class="pay-content">
        <div class="page-box">
          <div class="success-msg">
            <i class="el-icon-error"></i>
            支付失败 <span>原因呢</span>
          </div>
          <div class="order-info">如有疑问，请联系我们：0755-86959186</div>
        </div>
      </div>
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
          radio:'',
          StepActive:{
            stepOne:false,
            stepTwo:false,
            stepThr:true,
            stepFou:false,
          },
        }
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
          font-size: 30px;
          text-align: center;
          margin-top: 150px;
          i{
            display: inline-block;
            width: 50px;
            height: 30px;
          }
          span{
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
