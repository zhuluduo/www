<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>销售管理</el-breadcrumb-item>
          <el-breadcrumb-item>外卖订单</el-breadcrumb-item>

        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-tabs v-model="activeTabName" type="card">
      <el-tab-pane name="new">
        <span slot="label">
          <i style="font-weight: bold;" class="iconfont icon-jfun-new-order"/>
          <el-badge :value="newOrderNum" class="item">新订单</el-badge>
        </span>
        <new-order v-on:newOrderNum="setupNewOrderNum"/>
      </el-tab-pane>
      <el-tab-pane name="wait">
        <span slot="label">
          <i style="font-weight: bold;" class="el-icon-time"/>
          <el-badge :value="waitOrderNum" class="item">待配送</el-badge>
        </span>
        <wait-order v-on:waitOrderNum="setupWaitOrderNum"/>
      </el-tab-pane>
      <el-tab-pane name="delivering">
        <span slot="label">
          <i style="font-weight: bold;" class="iconfont icon-jfun-wait-order"/>
          <el-badge :value="deliveringOrderNum" class="item">配送中</el-badge>
        </span>
        <delivering-order v-on:deliveringOrderNum="setupDeliveringOrderNum"/>
      </el-tab-pane>
      <el-tab-pane name="exception">
        <span slot="label">
          <i style="font-weight: bold;" class="iconfont icon-jfun-exception-order"/>
          <el-badge :value="exceptionOrderNum" class="item">配送异常</el-badge>
        </span>
        <exception-order v-on:exceptionOrderNum="setupExceptionOrderNum"/>
      </el-tab-pane>
      <el-tab-pane name="remind">
        <span slot="label">
          <i style="font-weight: bold;" class="iconfont icon-jfun-remind-order"/>
          <el-badge :value="remindOrderNum" class="item">催单</el-badge>
        </span>
        <remind-order v-on:remindOrderNum="setupRemindOrderNum"/>
      </el-tab-pane>
      <el-tab-pane name="refund">
        <span slot="label">
          <i style="font-weight: bold;" class="iconfont icon-jfun-refund-order"/>
          <el-badge :value="refundOrderNum" class="item">退款申请</el-badge>
        </span>
        <refund-order v-on:refundOrderNum="setupRefundOrderNum"/>
      </el-tab-pane>
      <el-tab-pane name="complete">
        <span slot="label">
          <i style="font-weight: bold;" class="el-icon-check"/>
          <el-badge :value="completeOrderNum" class="item">已完成</el-badge>
        </span>
        <complete-order v-on:completeOrderNum="setupCompleteOrderNum"/>
      </el-tab-pane>
      <el-tab-pane name="cancel">
        <span slot="label">
          <i style="font-weight: bold;" class="iconfont icon-jfun-cancel-order"/>
          <el-badge :value="cancelOrderNum" class="item">已取消</el-badge>
        </span>
        <cancel-order v-on:cancelOrderNum="setupCancelOrderNum"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import newOrder from './fragment/neworder';
  import refundOrder from './fragment/refundorder';
  import remindOrder from './fragment/remindorder';
  import waitOrder from './fragment/waitorder';
  import exceptionOrder from './fragment/exceptionorder';
  import deliveringOrder from './fragment/deliveringorder';
  import completeOrder from './fragment/completeorder';
  import cancelOrder from './fragment/cancelorder';
  export default {
    components: {
      'new-order': newOrder,
      'refund-order': refundOrder,
      'remind-order': remindOrder,
      'wait-order': waitOrder,
      'exception-order': exceptionOrder,
      'delivering-order': deliveringOrder,
      'complete-order': completeOrder,
      'cancel-order':cancelOrder,
    },
    data() {
      return {
        newOrderNum: 0,
        waitOrderNum: 0,
        exceptionOrderNum: 0,
        remindOrderNum: 0,
        refundOrderNum: 0,
        deliveringOrderNum: 0,
        completeOrderNum: 0,
        cancelOrderNum:0,
        activeTabName: 'new',
      }
    },
    methods: {
      setupNewOrderNum(num) {
        this.newOrderNum = num;
      },
      setupWaitOrderNum(num) {
        this.waitOrderNum = num;
      },
      setupExceptionOrderNum(num) {
        this.exceptionOrderNum = num;
      },
      setupRemindOrderNum(num) {
        this.remindOrderNum = num;
      },
      setupRefundOrderNum(num) {
        this.refundOrderNum = num;
      },
      setupDeliveringOrderNum(num) {
        this.deliveringOrderNum = num;
      },
      setupCompleteOrderNum(num) {
        this.completeOrderNum = num;
      },
      setupCancelOrderNum(num) {
        this.cancelOrderNum = num;
      }
    }
  }
</script>
<style>
  .breadcrumb-border {
    border-bottom: 1px solid #efefef;
    margin-bottom: 10px;
  }

  .el-breadcrumb {
    padding: 5px 0px;
  }

  .el-tabs__item .el-badge__content.is-fixed {
    top: 10px;
    right: 13px;
  }
</style>
