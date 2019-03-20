<template>
    <div id="orderCommon" class="clearfix">
        <el-dialog title="修改价格" width="650px" :visible.sync="orderDlg.visible">
            <div class="place-order-dlg">
                <div class="company-info">选择供应商：<span>{{orderDlg.dispatchCompany}}</span></div>
                <table>
                    <thead>
                        <tr>
                            <td width="190px">零件名称</td>
                            <td width="140px">数量</td>
                            <td width="130px">单价</td>
                            <td width="130px">小计</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(ele,index) in orderDlg.tableData" :key="index">
                            <td>{{ele.itemName}}</td>
                            <td>{{ele.quantity}}</td>
                            <td class="td-number"><el-input-number size="small" :min="0" :precision="2" v-model="ele.itemPrice"></el-input-number></td>
                            <td>￥{{(ele.quantity*ele.itemPrice).toFixed(2)}}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="total-amount">订单总额:￥{{totalAmount}}</div>
                <div class="form-btn-box">
                    <div class="form-btn" @click="orderDlg.visible=false">取消</div>
                    <div class="form-btn form-next-btn" @click="submitChangePrice">确定</div>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="拒绝接单" :visible.sync="refuseDialog.Visible" width="600px">
          <div>
            <el-form label-position="left" :model="refuseDialog.refuseRuleForm" :rules="refuseDialog.rules" ref="refuseRuleForm" label-width="60px" class="demo-ruleForm">
              <el-form-item label="原因:" prop="rejectOrderReason">
                <el-select v-model="refuseDialog.refuseRuleForm.rejectOrderReason" placeholder="请选择拒绝原因">
                  <el-option
                    v-for="item in refuseDialog.options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="说明:" prop="rejectOrderRemark">
                <el-input type="textarea" v-model="refuseDialog.refuseRuleForm.rejectOrderRemark" maxlength='200' :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入拒绝说明"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="refuseDialog.Visible = false">取 消</el-button>
            <el-button type="primary" @click="refuseSubmitForm('refuseRuleForm')">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script>
import orderCommon from '../orderService/orderCommon.js'

export default {
  data() {
    return{
        orderService:new orderCommon(),
      }   
  },
  computed: {
    //计算修改的总的价格;
    totalAmount: function() {
      let totalAmount = 0
      if (this.orderDlg.tableData) {
       this.orderDlg.tableData.forEach(el => {
          totalAmount +=el.itemPrice*el.quantity
        });
        return (
           totalAmount
        ).toFixed(2);
      } else {
        return "";
      }
    }
  },
  props:['orderDlg','refuseDialog'],
  created() {

  },
  methods: {
    /*-----------------修改价格操作-------------*/
    async submitChangePrice(item){
      let goodsArry=[];
      this.orderDlg.tableData.forEach(ele =>{
        let obj={
          'itemId':Number(ele.id),
          'price':Number(ele.itemPrice),
          'quantity':Number(ele.quantity),
        }
        goodsArry.push(obj)
      })
      let ParamsData={
        "id":Number(this.orderDlg.id),
        "items":goodsArry
      }
      let res = await this.orderService.submitNewPrice(ParamsData)
      if (res.code == 200) {
          this.orderDlg.visible=false;
          this.$emit('Success',null)
      }
      this.$showResultTips(res)
    },
    /*-----------------修改价格操作-------------*/

    /*-------------拒绝接单的操作-------------*/
    refuseSubmitForm(formName){
      this.$refs[formName].validate(valid => {
         if (valid) {
          let requestParams = {
            id:this.refuseDialog.oderId,
            rejectOrderReason: this.refuseDialog.refuseRuleForm.rejectOrderReason,
            rejectOrderRemark: this.refuseDialog.refuseRuleForm.rejectOrderRemark,
          };
          this.refuseOrderApi(requestParams)
        } else {
          return false;
        }
      });
    },
    async refuseOrderApi(item){
      let res = await this.orderService.refuseOrderApi(item);
      this.$showResultTips(res)
      if(res.code==200){
        this.refuseDialog.Visible=false;
        this.$emit('Success',null)
      }
    }
    /*-------------拒绝接单的操作-------------*/
  }
};
</script>
<style lang="less">
#orderCommon {
  .place-order-dlg {
    .company-info {
      margin-bottom: 10px;
      span {
        color: #3f8def;
      }
    }
    .total-amount {
      text-align: right;
      font-weight: bold;
      line-height: 35px;
    }
    table {
      thead,tbody {
        td {
          text-align: center;
          padding: 10px 0;
          border-top: 1px solid #e2e2e2;
          border-bottom: 1px solid #e2e2e2;
        }
        .td-number {
          padding: 10px 10px;
        }
        .el-input-number__increase,
        .el-input-number__decrease {
          height: 30px;
        }
      }
    }
    .form-btn-box {
      display: flex;
      justify-content: flex-end;
      margin-top: 30px;
      .form-btn {
        width: 90px;
        height: 30px;
        border-radius: 4px;
        box-sizing: border-box;
        color: #fff;
        line-height: 30px;
        text-align: center;
        cursor: pointer;
        background: #e2e2e2;
      }
      .form-next-btn {
        margin-left: 36px;
        color: #fff;
        background: #3f8def;
        cursor: pointer;
      }
    }
  }
}
</style>


