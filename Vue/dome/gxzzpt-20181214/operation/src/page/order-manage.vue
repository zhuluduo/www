<template>
  <div id="order-manage">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>订单</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="box">
        <div class="box-header">
          <ul class="tabs">
            <li v-for="(item,index) in types" :key="index" :class="item.isCheck?'checked':''" @click="changeTab(item)">{{item.name}}</li>
          </ul>
          <div class="search-input" @keydown="goSearch">
            <el-input v-model="ajaxData.keyword" placeholder="请输入查询的订单编号">
              <i slot="suffix" class="el-input__icon el-icon-search search-icon" @click="search"></i>
            </el-input>
          </div>
        </div>
        <div class="table" v-loading="loading" element-loading-text="数据加载中">
          <div class="table-header">
            <div style="width:40%">商品明细</div>
            <div style="width:10%">单价</div>
            <div style="width:10%">商品操作</div>
            <div style="width:15%">订单金额</div>
            <div style="width:10%">联系人</div>
            <div style="width:15%">操作</div>
          </div>
          <table v-for="(item,index) in tableData" :key="index" class="table-item">
            <thead>
              <tr>
                <td colspan="6">
                  <div class="table-item-header">
                      <div>{{item.createTime}}</div>
                      <div>订单号：{{item.orderNumber}}</div>
                      <div><span class="order-type">{{item.orderType==110010?'人工报价':'自动报价'}}<span v-if="item.status==112025">（有改价）</span></span></div>
                      <div class="tb-header">
                        <img src="../../static/img/shr.png" alt="">
                        <span>{{item.user?item.user.username:''}}</span>
                      </div>
                      <div class="tb-header-right">
                        <span>{{item.dispatchCompany?item.dispatchCompany.dispatchCompanyName:''}}</span>
                      </div>
                  </div>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(ele,i) in item.items" :key="i">
                <td width="40%" align="center">
                  <div v-if="item.orderType==110010" class="goods rgbj">
                    <div class="left-item">
                      <img :src="ele.fileInfo?ele.fileInfo.thumbnailUrl:''" alt="">
                    </div>
                    <div class="right-item">
                      <div>需求编号：{{ele.requirementNumber}}</div>
                      <div>产品名称：{{ele.itemName}}</div>
                      <div>{{ele.industryName}}</div>
                      <!-- <div  v-if="item.orderType!=110010">含税报价：&yen;{{ele.itemPrice*(1+item.tax)}}</div>
                      <div  v-if="item.orderType!=110010">不含税报价：&yen;{{ele.itemPrice}}</div>
                      <div  v-if="item.orderType!=110010">运费报价：&yen;{{ele.itemExpressPrice}}</div> -->
                    </div>
                  </div>
                  <div v-else="item.orderType==110010" class="goods zdbj">
                    <div class="left-item">
                      <img :src="ele.fileInfo?ele.fileInfo.thumbnailUrl:''" alt="">
                    </div>
                    <div class="right-item">
                      <div>服务：{{ele.productParams.serviceName}}</div>
                      <div>材质：{{ele.productParams.material.name}}</div>
                      <div>文件单位：{{ele.productParams.fileUnit}}</div>
                      <div v-for="el in ele.productParams.steps">{{el.stepName}}：{{el.techniqueName}}</div>
                    </div>
                  </div>
                </td>
                <td width="10%" align="center">
                  <div>&yen;{{ele.itemPrice}}<span class="gray-txt">*{{ele.quantity}}</span></div>
                </td>
                <td width="10%" align="center" class="gray-border">
                  <div class="refund-btn" v-if="ele.canRefund">退款</div>
                  <div class="gray-txt" v-if="ele.refundInfo&&(ele.refundInfo.refundStatus==112065)">
                    <div v-if="!item.isOfflinePayment">退款中</div>
                    <div v-if="item.isOfflinePayment">退款中</div>
                    <div v-if="!item.isOfflinePayment" class="refund-btn" @click="$router.push({path:'/main/refund-order',query:{id:ele.refundInfo.id}})">去退款</div> 
                  </div>
                </td>
                <td width="15%" align="center" :rowspan="item.items.length" v-if="i==0">
                  <div class="price-info">
                    <div>￥{{item.totalPrice}}</div>
                    <div>
                      {{item.expressModeStr}}
                      <span v-if="!(item.expressMode==111040||item.expressMode==111010)">：{{item.expressPayTypeStr}}</span>
                    </div>
                    <div v-if="item.orderType!=110010">含运费:￥{{item.expressPrice}}</div>
                    <div v-if="item.orderType!=110010">税费:￥{{item.tax}}</div>
                  </div>
                </td>
                <td width="10%" align="center" :rowspan="item.items.length" v-if="i==0">
                  <el-tooltip placement="right" popper-class='el-tooltip__popper_userInfo'>
                    <div slot="content">
                      <div class="user-info">
                        <div>姓名：{{item.contactName}}</div>
                        <div>手机：{{item.contactPhone}}</div>
                        <div>邮箱：{{item.contactEmail}}</div>
                      </div>
                    </div>
                    <div class="v-align">
                      <img src="../../static/img/lxr.png" alt="">
                      <span>{{item.contactName}}</span>
                    </div>
                  </el-tooltip>
                </td>
                  <td width="15%" align="center" :rowspan="item.items.length" v-if="i==0">
                  <div class="operator-area">
                    <div class="operator-top">
                        <span>{{item.statusStr}}</span>
                    </div>
                    <div class="operator-bottom">
                      <span class="" @click="$router.push({path:'/main/order-detail',query:{id:item.id }})">订单详情</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pagination">
            <el-pagination @current-change="changePage" background layout="prev, pager, next" :page-count="pagination.pageCount" :current-page="pagination.currentPageIndex" :page-size="pagination.pageSize"></el-pagination>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
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
      loading:false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading=true;
      this.$http.post("/operation/order/getList", this.ajaxData).then(res => {
        if (res.data.code == 200) {
          this.tableData = res.data.data;
          this.pagination = res.data.pagination;
          this.loading=false;
          window.scrollTo(0,0);
        } else {

        }
      });
    },
    //分页;
    changePage(p) {
      this.ajaxData.pageIndex = p;
      this.getList();
    },
    //搜索查询;
    goSearch(e) {
      if (e.which == 13) {
        this.search();
      }
    },
    search() {
      this.getList();
    },
    //tab切换；
    changeTab(item) {
      if (item.isCheck) return;
      this.types.map(ele => {
        if (ele.id == item.id) {
          ele.isCheck = true;
        } else {
          ele.isCheck = false;
        }
      });
      this.ajaxData.status = item.id;
      this.getList();
    }
  }
};
</script>
<style lang="less" scoped>
@common-color: #20a0ff;
.box-header {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e2e2;
  .search-input {
    width: 308px;
  }
  .tabs {
    display: flex;
    li {
      color: #787878;
      font-size: 14px;
      padding: 5px 10px;
      cursor: pointer;
      & + li {
        margin-left: 12px;
      }
    }
    .checked {
      background: @common-color;
      color: #fff;
    }
  }
}
.table {
  .table-header {
    margin-top: 40px;
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
      .tb-header {
        display: flex;
        align-items: center;
        margin-left: 22px;
        > img {
          margin-right: 8px;
        }
      }
      .tb-header-right {
        position: absolute;
        right: 22px;
        display: flex;
        align-items: center;
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
        td {
          padding: 22px 0px;
          border-top: 1px solid #eee;
        }
      }
    }
  }
}
.right-title {
  position: absolute;
  top: -28px;
  left: 0;
  width: 100%;
  height: 20px;
  font-size: 14px;
  color: #333;
}
.user-info {
  text-align: left;
  > div {
    line-height: 23px;
  }
}
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
.status {
  color: #20a0ff;
}
.order-type {
  color: #757575;
  font-weight: 600;
}
.operator-area {
  margin-top: 18px;
  .operator-top {
  }
  .operator-bottom {
    margin-top: 24px;
    > span {
      cursor: pointer;
      font-size: 14px;
      text-decoration: underline;
      color: @common-color;
      & + span {
        margin-left: 32px;
      }
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
  cursor: pointer;
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
  margin-top: 10px;
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
.pagination{
  margin-top:10px;
}
</style>
