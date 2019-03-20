<template>
    <div class="requirement-details">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>需求</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: $route.query.from}">报价结束需求</el-breadcrumb-item>
            <el-breadcrumb-item>报价详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="box" >
            <div class="state">
                <span>需求编号 :{{tableData.requirementPriceNo}}</span>
                <span class="stateBox">
                  <span  class="statusbtn" v-if="tableData.requirementStatus==107010"> -待分派</span>
                  <span class="statusbtn" v-if="tableData.requirementStatus==107020"> -可报价</span>
                  <span class="statusbtn" v-if="tableData.requirementStatus==107030"> -报价结束</span>
                </span>
            </div>
            <div class="list">
                <div class="row ">
                    <div class="row-col">
                        <p class="title">零件报价({{tableData.items?tableData.items.length:'0'}})：</p>
                        <div class="row-content partQuote">
                            <div class="thead"> 
                              <el-row>
                                <el-col :span="4"><div>缩略图</div></el-col>
                                <el-col :span="4"><div>零件名称</div></el-col>
                                <el-col :span="4"><div>需求数量</div></el-col>
                                <el-col :span="3"><div>一阶梯报价</div></el-col>
                                <el-col :span="3"><div>二阶梯报价</div></el-col>
                                <el-col :span="3"><div>三阶梯报价</div></el-col>
                                <el-col :span="3"><div>最小接单量</div></el-col>
                              </el-row>
                            </div>
                            <div class="tbody">
                                <el-row class="borderline" v-for="(item,index) in tableData.items" :key='index'>
                                  <el-col :span="4">
                                    <div class="imgbox">
                                      <img :src="item.requirementItemInfo.firstModelFileInfo?item.requirementItemInfo.firstModelFileInfo.thumbnailUrl:''" alt="">
                                    </div>
                                  </el-col>
                                  <el-col :span="4"><div>{{item.requirementItemInfo?item.requirementItemInfo.itemName:''}}</div></el-col>
                                  <el-col :span="4"><div>{{item.requirementItemInfo?item.requirementItemInfo.estimateCount:''}}</div></el-col>
                                  <el-col :span="12">
                                      <div> 
                                        <el-row>  
                                          <el-col :span="18">
                                            <div>
                                              <el-row>
                                                <el-col v-if="item.requirementItemInfo.isLadderPrice" v-for="(ele,index) in item.ladderPriceInfo" :key='index' :span="8">
                                                      <div v-if="ele.price" >
                                                        <div><span v-if="!ele.to">大于</span>{{ele.from}}<span v-if="ele.to">--</span>{{ele.to}}</div>
                                                        <div>￥{{ele.price}}</div>
                                                    </div>
                                                    <div v-if="!ele.price">
                                                        <p >-</p>
                                                    </div>
                                                </el-col>
                                                <el-col v-if="!item.requirementItemInfo.isLadderPrice" :span="24">
                                                    {{item.singlePrice?'￥'+item.singlePrice+'(单价)':'-'}}
                                                </el-col>
                                              </el-row>
                                            </div>
                                          </el-col>
                                          <el-col :span="6"><div>{{item.minCount}}</div></el-col>
                                        </el-row>
                                        <el-row class="borderline uploadinfo">
                                          <el-col :span="12"><div><span>报价详情：</span><a class="modal-name" :href="item.offerDetailFile?item.offerDetailFile.fileUrl:''" >{{item.offerDetailFile?item.offerDetailFile.fileName:''}}</a></div></el-col>
                                          <el-col :span="12"><div><span>评估报告:</span><a class="modal-name" :href="item.fsrReportFile?item.fsrReportFile.fileUrl:''">{{item.fsrReportFile?item.fsrReportFile.fileName:''}}</a></div></el-col>
                                        </el-row>  
                                      </div>
                                  </el-col>
                                </el-row>
                            </div>  
                        </div>
                    </div>
                </div>
                <div class="row ">
                    <div class="row-col">
                        <p class="title">其他信息:</p>
                        <div class="row-content QuoteInfo">
                            <el-row>
                              <el-col :span="2" class="textStyle">报价供应商：</el-col>
                              <el-col :span="10">{{tableData.companyName?tableData.companyName:'-'}}</el-col>
                              <el-col :span="2" class="textStyle">报价有效期：</el-col>
                              <el-col :span="10">{{tableData.offerInvalidTime | dayFilter}}</el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="2" class="textStyle">配送方式 :</el-col>
                              <el-col :span="10">{{tableData.expressModeStr?tableData.expressModeStr:'-'}}</el-col>
                              <el-col :span="2" class="textStyle">其他 :</el-col>
                              <el-col :span="10">报价含   运费报价含税  报价含包装费</el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="2" class="textStyle">支持发票:</el-col>
                              <el-col :span="10" v-if="tableData.invoiceData">{{tableData.invoiceData.invoiceTitleTypeText}} {{tableData.invoiceData.invoiceTypeText}} {{tableData.invoiceData.taxRate*100}}%</el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="2" class="textStyle">结算方式：</el-col>
                              <el-col :span="10">{{tableData.requirement?tableData.requirement.settlementTypeText:''}}{{tableData.requirement?tableData.requirement.settlementPeriodText:''}}</el-col>
                            </el-row>
                            <el-row>
                              <el-col :span="2" class="textStyle">对接人:</el-col>
                              <el-col :span="4">{{tableData.contactName?tableData.contactName:'-'}}</el-col>
                              <el-col :span="5">{{tableData.contactPhone?tableData.contactPhone:'-'}}</el-col>
                              <el-col :span="5">{{tableData.contactEmail?tableData.contactEmail:'-'}}</el-col>
                            </el-row>
                            <el-row class="induction">
                                <el-col :span="2" class="textStyle"><p>说明:</p></el-col>
                                <el-col :span="22"><p>{{tableData.remark?tableData.remark:'-'}}</p></el-col>
                            </el-row>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import "../lib/filter.js"; //引入过滤器
export default {
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    this.quoted = !this.$route.query.quoted;
    this.getPriceDetails();
  },
  methods:{
        getPriceDetails(){
            let Id =Number(this.$route.query.id) 
            this.$http.post("/operation/requirementPrice/get",{"id":Id}).then(res => {
                if (res.data.code == 200) {
                    this.tableData = res.data.data;
                }
            }).catch(res => {});
        }
    }
}
</script>


<style lang="less" scoped>
.box {
  padding: 0px 20px;
}
p {
  padding: 12px 0;
}
.state {
  padding: 20px 0 0 0;
  .statusbtn {
    display: inline-block;
    color: #333333;
  }
}
.title {
  font-size: 14px;
  font-weight: 700;
  margin: 15px 0;
  padding: 0px;
}
.list {
  .row {
    display: flex;
    .row-col {
      flex: 1;
      & + .row-col {
        margin-left: 66px;
      }
    }
    .row-content {
      background: #f5f5f5;
      padding: 20px 24px;
    }
    .partQuote{
      .thead{
        border-top: 1px solid #d7d7d7;
        .el-row{
          line-height: 36px;
          text-align: center;
        }
      }
      .tbody{
        .el-row{
          display: flex;
          align-items: center;
          line-height: 36px;
          text-align: center;
          p{
            padding: 0;
          }
          .uploadinfo{
            height: 64px;
          }
          .imgbox{
            display: flex;
            justify-content: center;
            img{
              display: block;
              width: 120px;
              height: 60px;
            }
          }
        }
        .borderline{
          border-top: 1px solid #d7d7d7;
        }
      }
    }
    .QuoteInfo{
        .el-row{
          line-height: 64px;
          border-bottom: 1px solid #797979;
        }
        .el-row:first-child{
          border-top: 1px solid #797979;
        }
        .el-col{
          padding: 0 10px;
        }
        .textStyle{
          text-align: center;
          background-color: #fff;
        }
        .induction{
          .el-col{
            line-height: 16px;
            height: 64px;
            display: flex;
            align-items: center;
            p{
              padding: 0;
              width: 100%;
            }
          }
        }
    }
  }
}
.modal-name {
  color: #3f8def;
  text-decoration: underline;
  white-space: nowrap;
  cursor: pointer;
}

</style>