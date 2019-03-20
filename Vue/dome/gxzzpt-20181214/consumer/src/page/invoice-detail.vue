<template>
<div class="">
  <div class="box">
    <div class="box-header">
      <div class="status">状态：{{detail.invoiceStatusText}}</div>
    </div>
    <div class="list">
      <div class="row ">
        <div class="row-col">
          <p class="title">开票信息：</p>
          <div class="row-content user">
            <span>开票方式：{{detail.invoiceModeText}}</span>
            <span>{{detail.invoiceTitle}}</span>
            <span v-if="detail.taxNo">纳税人识别号：{{detail.taxNo}}</span>
            <span>发票类型：{{detail.invoiceTypeText}}</span>
          </div>
        </div>
      </div>
      <div class="row ">
        <div class="row-col">
          <p class="title">发票信息：</p>
          <div class="row-content user">
            <span>发票代码：{{detail.invoiceCode}}</span>
            <span>发票号码：{{detail.invoiceNo}}</span>
            <span v-if="detail.invoiceMode!==150020">邮寄：顺丰快递到付</span>
            <span v-if="detail.invoiceMode!==150020">快递单号：{{detail.expressNo}}</span>
          </div>
          <div>
            <img :src="detail.invoiceImg" alt="">
          </div>
        </div>
      </div>
      <div class="row ">
        <div class="row-col">
          <p class="title">其他：</p>
          <div class="row-content extra">
             <div v-for="(item,index) in detail.orderTraceList" :key="index">
              <span v-show="item.orderStatus==112010">订单生成时间：{{item.createTime}}</span>
              <span v-show="item.orderStatus==112030">订单支付时间：{{item.createTime}}</span>
            </div>
             <div>
              <span>发票开票时间： {{detail.makeOutTime}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  data() {
    return {
      id:"",
      detail:{},
    };
  },
  components: {
  },
  created(){
    this.id = Number(this.$route.query.id);
    this.getDetail();
  },
  methods: {
    getDetail(){
      this.$http.post('/custom/invoiceManagement/get',{id:this.id}).then(res=>{
        if(res.data.code == 200){
          this.detail = res.data.data;
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
@common-color: #3f8def;
.box {
  //   border: 1px solid #e6e6e6;
  padding: 0px 20px 0px 20px;
}
.box-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 0px 0px 0px;
  > div {
    height: 30px;
    line-height: 30px;
  }
  .btn {
    background: @common-color;
    color: #fff;
    border-radius: 3px;
    width: 82px;
    text-align: center;
    cursor: pointer;
  }
}
.list {
  .row {
    margin-top: 32px;
    display: flex;
    .row-col {
      flex: 1;
      .title{
        font-weight: 700;
        margin-bottom: 10px;
      }
      & + .row-col {
        margin-left: 66px;
      }
    }
    .row-content {
      background: #f5f5f5;
      padding: 20px 24px;
    }
    .user {
    //  height: 80px;
      display: flex;
      align-items: center;
      > span {
        & + span {
          margin-left: 86px;
        }
      }
    }
    .remark {
      height: 168px;
      padding-top: 22px;
      box-sizing: border-box;
      > a {
        margin-left: 40px;
        color: @common-color;
      }
    }
    .quotation {
      // height: 125px;
      box-sizing: border-box;
      padding-top: 24px;
      padding-bottom: 24px;
      > div {
        & + div {
          margin-top: 24px;
        }
      }
      .info {
        display: flex;
        margin-top: 24px;
        > p {
          flex: 1;
          height: 40px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
    .extra {
      padding-top: 24px;
      padding-bottom: 24px;
      > div {
        + div {
          margin-top: 24px;
        }
         p{
            line-height: 28px;
          }
      }
    }
  }
}
.status {
  color: #3f8def;
}
</style>
