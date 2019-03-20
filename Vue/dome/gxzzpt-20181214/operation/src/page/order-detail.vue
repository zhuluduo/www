<template>
  <div id="detail">
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>订单</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/main/order-manage'}">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="step-box">
        <div class="left">
            <span>订单编号：{{detail.orderNumber}}</span>
            <!-- <div>订单已提交</div> -->
            <div>{{detail.statusStr}}</div>
        </div>
        <div class="right">
            <el-steps :active="current" :align-center="true">
                <el-step :title="item.title" :icon="index>=current?item.icon:item.activeIcon" :description="item.description" v-for="(item,index) in steps" :key="index">
                </el-step>
            </el-steps>
        </div>
    </div>
    <div class="logisic-box">
        <div class="list">
            <div class="list-item" v-for="(item,index) in detail.orderTrace" :key="index">
                <!-- <span class="icon"></span> -->
                <div class="icon">
                  <span></span>
                </div>
                <span>{{item.traceTime}}</span>
                <span class="info">{{item.statusStr}}</span>
            </div>

        </div>
    </div>
    <table class="user-info">
        <thead>
            <tr>
                <td>接单供应商</td>
                <td>收货人信息</td>
                <td>联系方式</td>
                <td v-if="detail.orderType!=110010">附件</td>
                <td>运费</td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td v-if="detail.dispatchCompany">
                  <div>{{detail.dispatchCompany.dispatchCompanyName}}</div>
                  <div>联系人：{{detail.dispatchCompany.contactName?detail.dispatchCompany.contactName:'-'}}</div>
                  <div>联系邮箱：{{detail.dispatchCompany.contactEmail?detail.dispatchCompany.contactEmail:'-'}}</div>
                  <div>联系电话：{{detail.dispatchCompany.contactPhone?detail.dispatchCompany.contactPhone:'-'}}</div>
                </td>
                <td>
                    <div v-if="detail.orderType!=110010">收货人：{{addressInfo.receiver}}</div>
                    <div>地址：{{addressInfo.province}}{{addressInfo.city}}{{addressInfo.region}}{{addressInfo.address}}</div>
                    <div>手机号码：{{addressInfo.phone}}</div>
                </td>
                <td>
                    <div v-if="detail.contactName">姓名：{{detail.contactName}}</div>
                    <div>电话：{{detail.contactPhone}}</div>
                    <div>邮箱：{{detail.contactEmail}}</div>
                </td>
                <td v-if="detail.orderType!=110010">
                    <div>无</div>
                </td>
                <td>
                    <div>配送方式：{{detail.expressModeStr}}</div>
                    <div>运费：{{detail.expressPayType==108010?"0":detail.expressPrice}}</div>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="content-box">
      <p>发票</p>
      <div class="InfoBox">
        <div>发票方式：{{invoiceInfo.invoiceModeStr}}</div>
        <div>发票类型： {{invoiceInfo.invoiceTitleTypeStr}} {{invoiceInfo.invoiceTypeStr}}</div>
        <div v-if="invoiceInfo.invoiceTitleType==119020">企业名称：{{invoiceInfo.invoiceTitle}}</div>
        <div v-if="invoiceInfo.taxNo">纳税识别号：{{invoiceInfo.taxNo}}</div>
      </div>
    </div>
    <div class="content-box">
      <p>结算方式</p>
      <div class="InfoBox">
        <div v-if="detail.settlementType==430010">
          全款现付
        </div>
        <div v-if="detail.settlementType==430020">
          <span>{{detail.settlementTypeStr}} :</span>
          <span>{{detail.settlementPeriodStr}}</span>
        </div>
      </div>
    </div>
    <!-- <div class="content-box">
      <p>合同</p>
      <div class="contractInfoBox">
        <div>公司抬头：{{detail.contract?detail.contract.partyAInfo.companyName:''}}</div>
        <div>
          <router-link  :to="{path:'/contract/detail',query:{contractId:detail.contract?detail.contract.id:''}}" target="_blank"><span v-if="detail.takeOrderStatus==380020"  class="modal-name">查看合同</span></router-link>
          <span class="InfoBoxDesc">供应商确认接单后，系统将为您生成合同</span>
        </div>
      </div>
    </div> -->
    <table class="order-list" v-if="detail.orderType!=110010">
        <thead>
            <tr>
                <td>需求</td>
                <!-- <td>联系方式</td> -->
                <td>交货周期</td>
                <td>报价金额</td>
                <!-- <td>数量</td>
                <td>金额</td> -->
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item,index) in tableData" :key="index">
                <td align="center" width="40%">
                  <div v-if="detail.orderType==110010" class="goods rgbj">
                    <div class="left-item">
                    {{item.itemName}}
                    </div>
                    <div class="right-item">
                      <div>需求编号：{{item.requirementNumber}}</div>
                      <div>工艺类别：{{item.requirementTypeStr}}</div>
                      <div>含税报价：&yen;{{(item.itemPrice+detail.tax).toFixed(2)}}</div>
                      <div>不含税报价：&yen;{{item.itemPrice}}</div>
                      <div>运费报价：&yen;{{item.itemExpressPrice}}</div>
                    </div>
                  </div>
                  <div v-else class="goods zdbj">
                    <div class="left-item">
                      <img :src="item.fileInfo.thumbnailUrl" alt="">
                      <!-- {{ele.itemName}} -->
                    </div>
                    <div class="right-item">
                      <div>服务：{{item.productParams.serviceName}}</div>
                      <div>材质：{{item.productParams.material.name}}</div>
                      <div>文件单位：{{item.productParams.fileUnit}}</div>
                      <div v-for="el in item.productParams.steps">
                        <div>{{el.stepName}}：{{el.techniqueName}}</div>
                        <div v-for="elem in el.techniqueParams">{{elem.key}}：{{elem.value}}</div>
                        <div v-if="el.material">
                          <div v-for="elem in el.material.materialParams">{{elem.key}}：{{elem.value}}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td align="center">
                    <div class="info">{{item.periodMin}}-{{item.periodMax}}{{item.periodUnit}}</div>
                </td>
                <td align="center">
                    <div class="info red-text">&yen;{{item.itemPrice}}</div>
                    <div v-if="item.canRefund" class="gray-btn">退款</div>
                </td>
            </tr>
        </tbody>
    </table>
    <table class="order-list" v-if="detail.orderType==110010">
        <thead>
            <tr>
                <td>商品</td>
                <td>工艺</td>
                <td>交期</td>
                <td>单价</td>
                <td>数量</td>
                <td>小计</td>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item,index) in tableData" :key="index">
                <td align="center" width="40%">
                  <div v-if="detail.orderType==110010" class="goods rgbj">
                    <div class="left-item">
                      <img :src="item.fileInfo?item.fileInfo.thumbnailUrl:''" alt="">
                    <!-- {{item.itemName}} -->
                    </div>
                    <div class="right-item">
                      <div>需求编号：{{item.requirementNumber}}</div>
                      <div>产品名称：{{item.itemName}}</div>
                      <div>{{item.industryName}}</div>
                    </div>

                  </div>
                </td>
                <td class="technology">
                    <div class="info">{{item.industryName}}</div>
                    <div class="info">{{item.requirementTypeStr}}</div>
                </td>
                <td align="center">
                    <div class="info">{{item.productParams.deliveryTime}}{{item.deliveryTimeUnitStr}}</div>
                </td>
                <td align="center">
                    <div class="info">￥{{item.itemPrice}}</div>
                </td>
                <td align="center">
                    <div class="info">{{item.quantity}}</div>
                </td>
                <td align="center" class="operator">
                    <div class="info red-text">&yen;{{item.quantity*item.itemPrice}}</div>
                    <div v-if="item.canRefund" class="gray-btn"  @click="refund(item)">退款</div>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="extra">
        <div>给卖家留言：{{detail.remark}}</div>
        <div class="right-item">
            <div class="left">
                总商品数量：{{totalQuantity}}
            </div>
            <ul>
                <li>
                    <div>总商品金额：</div><div>￥{{detail.productPrice}}</div>
                </li>
                <li v-if="detail.orderType!=110010">
                    <div>运费：</div><div>￥{{detail.expressPrice}}</div>
                </li>
                <li v-if="detail.orderType!=110010">
                    <div>税点：</div><div>{{(detail.tax/detail.productPrice*100).toFixed(2)}}%(￥{{detail.tax}})</div>
                </li>
                 <li>
                    <div>订单总额：</div><div class="red-text">￥{{detail.totalPrice}}</div>
                </li>
            </ul>
        </div>
    </div>
    <p class="tips">*商品修改带来了价格的变化，请补全差价继续交易，付款成功之后卖家将会接收到您修改后的订单</p>
  </div>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
      id: "",
      detail: {},
      addressInfo: {},
      invoiceInfo:{},
      tableData: [],
      current: 0,
      steps: [],
      steps2: [
        {
          title: "订单提交",
          icon: "s1",
          activeIcon: "s1-active",
          description: ""
        },
        {
          title: "付款成功",
          icon: "s2",
          activeIcon: "s2-active",
          description: ""
        },
        {
          title: "审核通过",
          icon: "s3",
          activeIcon: "s3-active",
          description: ""
        },
        {
          title: "审图完成",
          icon: "s4",
          activeIcon: "s4-active",
          description: ""
        },
        {
          title: "加工完成",
          icon: "s5",
          activeIcon: "s5-active",
          description: ""
        },
        {
          title: "发货完成",
          icon: "s6",
          activeIcon: "s6-active",
          description: ""
        },
        {
          title: "交易完成",
          icon: "s7",
          activeIcon: "s7-active",
          description: ""
        }
      ],
      steps1: [
        // {
        //   title: "订单提交",
        //   icon: "s1",
        //   activeIcon: "s1-active",
        //   description: ""
        // },
        {
          title: "待付款",
          icon: "s2",
          activeIcon: "s2-active",
          description: ""
        },
        // {
        //   title: "加工中",
        //   icon: "s3",
        //   activeIcon: "s3-active",
        //   description: ""
        // },
        {
          title: "待发货",
          icon: "s4",
          activeIcon: "s4-active",
          description: ""
        },
        {
          title: "待收货",
          icon: "s5",
          activeIcon: "s5-active",
          description: ""
        },
        {
          title: "交易完成",
          icon: "s6",
          activeIcon: "s6-active",
          description: ""
        },
        // {
        //   title: "交易完成",
        //   icon: "s7",
        //   activeIcon: "s7-active",
        //   description: ""
        // }
      ]
    };
  },
  created() {
    this.id = Number(this.$route.query.id);
    this.getDetail();
  },
  methods: {
    getDetail() {
      var self = this;
      this.$http.post("/operation/order/get", { id: this.id }).then(res => {
        if (res.data.code == 200) {
          this.detail = res.data.data;
          this.addressInfo = res.data.data.addressInfo;
          this.invoiceInfo = res.data.data.invoiceInfo||{};
          this.tableData = res.data.data.items;
          if (this.detail.orderType == 110010) {
            this.steps = this.steps1;
            switch (this.detail.status) {
              case 112010:
                self.current = 0;
                break;
              case 112020:
                self.current = 0;
                break;
              case 112030:
                self.current = 1;
                break;
              case 112040:
                self.current = 2;
                break;
              case 112050:
                self.current = 4;
                break;
              case 112060:
                self.current = 0;
                break;
              case 112070:
                self.current = 0;
                break;
              default:
                break;
            }
          } else {
            this.steps = this.steps2;
            switch (this.detail.status) {
              case 112010:
                self.current = 0;
                break;
              case 112020:
                self.current = 1;
                break;
              case 112030:
                self.current = 2;
                break;
              case 112040:
                self.current = 3;
                break;
              case 112050:
                self.current = 4;
                break;
              case 112060:
                self.current = 5;
                break;
              case 112070:
                self.current = 6;
                break;
              default:
                break;
            }
          }
        }
      });
    }
  },
  computed:{
    totalQuantity:function(){
      var count = 0;
      if(this.detail.items&&this.detail.items.length){
        this.detail.items.map(ele=>{
          count += ele.quantity;
        })
      }
      return count;
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
@common-color: #3f8def;
.main {
  padding-top: 80px;
  width: 1200px;
  margin: auto;
}
.breadcrumb {
  height: 60px;
  display: flex;
  align-items: center;
}
.step-box {
  height: 272px;
  padding: 10px 20px;
  box-sizing: border-box;
  background: #f5f5f5;
  display: flex;
  .left {
    width: 316px;
    border-right: 1px solid #e2e2e2;
    > span {
      width: 100%;
      display: inline-block;
      text-align: center;
      margin-top: 40px;
    }
    > div {
      text-align: center;
      color: @common-color;
      font-size: 24px;
      font-weight: 500;
      margin-top: 40px;
      & + div {
        margin-top: 15px;
      }
    }
  }
  .right {
    flex: 1;
    display: flex;
    padding-left: 20px;
    align-items: center;
    .el-steps {
      width: 100%;
    }
  }
}
.logisic-box {
  padding: 20px 0px;
  background: #f5f5f5;
  margin-top: 48px;
  overflow-y: scroll;
  .list {
    margin-left: 20px;
    border-left: 1px solid #969696;
    .list-item {
      & + .list-item {
        margin-top: 20px;
      }
      display: flex;
      align-items: center;
      position: relative;
      padding-left: 30px;
    .icon {
        height: 100%;

        display: inline-block;
        border-radius: 50%;
        position: absolute;
        left: -6px;
        top:0px;
        >span{
          display: inline-block;
          width: 10px;
          height:10px;
          border-radius: 50%;
          background: #969696;
        }
      }
      .info {
        color: #969696;
        margin-left: 20px;
      }
    }
    .list-item:first-child {
      .icon {
        height: 15px;

        background-color: #f5f5f5;
        display: flex;
        align-items: flex-end;
        >span{
          background: @common-color;
        }
      }
    }
  }
}
.user-info {
  width: 100%;
  margin-top: 48px;
  background: #f5f5f5;
  border: 1px solid #e2e2e2;

  td {
    padding: 0 20px;
  }
  thead {
    tr {
      height: 56px;
      font-size: 16px;
      border-bottom: 1px solid #e2e2e2;
      td {
        vertical-align: middle;
        & + td {
          // border-left: 1px solid #e2e2e2;
        }
      }
    }
  }
  tbody {
    tr {
      td {
        // height: 194px;
        padding-top:20px;
        padding-bottom: 20px;
        & + td {
          border-left: 1px solid #e2e2e2;
        }
        > div+div {
          margin-top: 10px;
        }
      }
    }
  }
}
.content-box{
  margin-top: 48px;
  background: #f5f5f5;
  border: 1px solid #e2e2e2;
  padding: 0 18px;
  p{
    line-height: 48px;
    font-size: 16px;
  }
  .InfoBox{
    line-height: 44px;
    display: flex;
    padding-bottom: 27px;
    >div{
      flex: 0 0 25%;
    }
  }
  .contractInfoBox{
    line-height: 44px;
    display: flex;
    padding-bottom: 27px;
    >div:first-child{
      flex: 0 0 25%;
    }
    .InfoBoxDesc{
      display: inline-block;
      padding:0 10px;
      font-size: 12px;
    }
  }
}
.order-list {
  border: 1px solid #e2e2e2;
  width: 100%;
  background: #f5f5f5;
  margin-top: 48px;
  thead {
    tr {
      height: 50px;
      td {
        vertical-align: middle;
        text-align: center;
      }
    }
  }
  tbody {
    tr {
      height: 134px;
      box-sizing: border-box;
      border-top: 1px solid #e2e2e2;
      td {
        vertical-align: middle;
        padding: 20px;
        img {
          width: 100px;
          height: 100px;
          border: 1px solid #e2e2e2;
        }
        .info {
          line-height: 40px;
        }
        .technology{
          div{
            text-align: center;
          }
        }
      }
    }
  }
}
.extra {
  padding: 20px;
  background: #f5f5f5;
  box-sizing: border-box;
  border: 1px solid #e2e2e2;
  border-top: none;
  display: flex;
  width: 100%;
  justify-content: space-between;
  .right-item {
    display: flex;
    ul {
      width: 300px;
      li {
        width: 100%;
        display: flex;
        & + li {
          margin-top: 10px;
        }
        > div {
          flex: 1;
          text-align: right;
        }
      }
    }
  }
}
.tips {
  width: 100%;
  color: #969696;
  text-align: right;
  margin-top: 10px;
  margin-bottom: 140px;
}
.red-text {
  color: #ff342f;
}
.gray-btn {
  width: 56px;
  height: 26px;
  text-align: center;
  line-height: 26px;
  color: #919191;
  border: 1px solid #919191;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 20px;
}
.operator{
  >div{
    display: inline-block;
  }
}
.goods {
  display: flex;
  align-items: center;
  padding-left:20px;
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
  }
  .right-item {
    flex: 1;
    margin-left:20px;
     div {
      text-align: left;
      width: 100%;
      + div {
        margin-top: 12px;
      }
    }
  }
}
</style>
