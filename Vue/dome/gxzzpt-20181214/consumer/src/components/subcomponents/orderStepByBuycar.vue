<template>
  <div class="order-step">
    <!-- <div class="step-item">
      <img :src="active.stepOne?stepOne.actImg:stepOne.defImg" alt="">
      <p :class="{active:active.stepOne}">上传模型文件</p>
    </div>
    <div class="beautiful-line"></div>
    <div class="step-item">
      <img :src="active.stepTwo?stepTwo.actImg:stepTwo.defImg" alt="">
      <p :class="{active:active.stepTwo}">选择参数 实时报价</p>
    </div>
    <div class="beautiful-line"></div> -->
    <div class="step-item">
      <img :src="active.stepThr?stepThr.actImg:stepThr.defImg" alt="">
      <p :class="{active:active.stepThr}">购物车</p>
    </div>
    <div class="beautiful-line"></div>
    <div class="step-item">
      <img :src="active.stepFou?stepFou.actImg:stepFou.defImg" alt="">
      <p :class="{active:active.stepFou}">生成订单 在线支付 支付成功</p>
    </div>
    <div class="beautiful-line"></div>
    <div class="step-item">
      <img :src="active.stepFive?stepFive.actImg:stepFive.defImg" alt="">
      <p :class="{active:active.stepFive}">支付成功 等待发货</p>
    </div>
 
  </div>
</template>
<script>
  import stepOneDefImg from '../../../static/img/step1.png';
  import stepOneHovImg from '../../../static/img/step1-hover.png';
  import stepTwoDefImg from '../../../static/img/step2.png';
  import stepTwoHovImg from '../../../static/img/step2-hover.png';
  import stepThrDefImg from '../../../static/img/step3.png';
  import stepThrHovImg from '../../../static/img/step3-hover.png';
  import stepFouDefImg from '../../../static/img/step4.png';
  import stepFouHovImg from '../../../static/img/step4-hover.png';
  import stepFiveDefImg from '../../../static/img/step5.png';
  import stepFiveHovImg from '../../../static/img/step5-hover.png';
  export default {
    data(){
      return{
        stepOne:{
          defImg:stepOneDefImg,
          actImg:stepOneHovImg
        },
        stepTwo:{
          defImg:stepTwoDefImg,
          actImg:stepTwoHovImg
        },
        stepThr:{
          defImg:stepFiveDefImg,
          actImg:stepFiveHovImg
        },
        stepFou:{
          defImg:stepThrDefImg,
          actImg:stepThrHovImg
        },
        stepFive:{
          defImg:stepFouDefImg,
          actImg:stepFouHovImg
        }
      }
    },
    props:{
      active:{
        type:Object
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" type="text/less" scoped>
  .order-step{
    display: flex;
    justify-content: center;
    // align-items: center;
    margin: 42px 0 74px 0;
    .step-item{
      img{
        display: block;
        margin: 0 auto;
      }
      p{
        width: 120px;
        font-size: 14px;
        color: #bcbcbc;
        text-align: center;
        margin-top: 10px;
      }
    }
    .beautiful-line{
      width: 162px;
      border-bottom: 2px solid #c4c4c4;
      margin: 0 4px 74px 4px;
    }
    p.active{
      color: #3f8def;
    }
  }
</style>
