<!--配送中订单组件-->
<template>
  <div>
    <el-row :gutter="2">
      <el-col :span="2">
        <el-select v-model="params.takeoutType" clearable placeholder="外卖平台" size="small">
          <el-option v-for="item in takeoutTypes" :key="item.name" :label="item.name" :value="item.key"/>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-input @keyup.enter.native="search" placeholder="客户电话" v-model="params.recipientPhone" size="small"/>
      </el-col>
      <el-col :span="3">
        <el-input @keyup.enter.native="search" placeholder="客单编号" v-model="params.orderNo" size="small"/>
      </el-col>
      <el-col :span="7">
        <el-date-picker
          v-model="dateRange"
          type="datetimerange"
          placeholder="下单时间"
          :picker-options="pickerOptions"
          size="small">
        </el-date-picker>
        <el-button type="primary" @click="search" icon="search" :loading="loading" size="small">搜索</el-button>
      </el-col>
      <el-col :span="9" class="tool-bar">
        <el-button type="primary" @click="batchCancel" size="small" icon="caret-right" :loading="loading">批量取消
        </el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table stripe border :data="list" v-loading="loading" @expand="showItems" @sort-change="sortList"
                  :default-sort="{prop: 'createTime', order: 'descending'}" show-summary :summary-method="listSummary"
                  @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50"/>
          <el-table-column type="expand">
            <template scope="props">
              <!--<el-row align="center">
                <el-col span="6">外卖店铺ID：{{props.row.shopId}}</el-col>
                <el-col span="6">收货人：{{props.row.recipientName}}</el-col>
                <el-col span="6">收货人电话：{{props.row.recipientPhone}}</el-col>
                <el-col span="6">外卖店铺ID：{{props.row.shopId}}</el-col>
              </el-row>-->
              <el-table border stripe fit :data="props.row.items" v-loading="itemLoading" show-summary
                        :summary-method="itemSummary">
                <el-table-column
                  :label="'订单明细 【订单编号：'+props.row.orderId+'】【订单状态：'+props.row.statusName+'】【外卖店铺ID：'+props.row.shopId+'】【收货人：'+props.row.recipientName+'】【收货人电话：'+props.row.recipientPhone+'】【收货人地址：'+props.row.address+'】【付款类型：'+props.row.payType+'】【红包：'+-props.row.hongbao+'】【活动费用：'+-props.row.elemePart+'】【备注：'+props.row.remarks+'】'">
                  <!--【取餐类型：'+props.row.pickType+'】-->
                  <el-table-column type="index" width="50"/>
                  <!-- <el-table-column property="orderId" label="订单编号"/>-->
                  <el-table-column v-if="props.row.takeoutType==0" property="food_name" label="商品名称"/>
                  <el-table-column v-if="props.row.takeoutType==1" property="name" label="商品名称"/>
                  <el-table-column property="quantity" label="商品数量"/>
                  <el-table-column property="price" label="商品单价"/>
                  <el-table-column property="totalPrice" label="商品总价"/>
                  <el-table-column label="商品状态"  property="status">
                    <template scope="scope">
                      <el-tag v-if="scope.row.status==0||scope.row.status==null" type="warning">正常</el-tag>
                      <el-tag v-if="scope.row.status==1" type="primary" style="color:white;" color="#20a0ff">
                        已退
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="takeoutType" label="外卖平台" width="100">
            <template scope="scope">
              <el-tag v-if="scope.row.takeoutType==0" type="warning">{{scope.row.takeoutTypeName}}</el-tag>
              <el-tag v-if="scope.row.takeoutType==1" type="primary" style="color:white;" color="#20a0ff">
                {{scope.row.takeoutTypeName}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column sortable="custom" prop="orderNo" label="客单编号" width="170"/>
          <el-table-column sortable="custom" prop="shopName" label="外卖店铺名称"/>
          <el-table-column sortable="custom" prop="totalPrice" label="订单总价" width="100"/>
          <el-table-column sortable="custom" prop="shippingFee" label="配送费" width="100"/>
          <el-table-column sortable="custom" prop="createTime" label="下单时间" width="150"/>
          <el-table-column label="操作" align="center">
            <template scope="scope">
              <el-button :plain="true" type="danger" @click="cancel(scope.row)" icon="circle-cross" size="small">
                取消订单
              </el-button>
              <el-button v-if="scope.row.takeoutType==0&&scope.row.logisticsCode =='0000'" :plain="true" type="success"
                         @click="deliverOK(scope.row)" icon="circle-right" size="small">
                确认送达
              </el-button>
              <!--<el-button v-if="scope.row.takeoutType==0" :plain="true" type="success" @click="partialRefund(scope.row)"
                         icon="circle-right" size="small">
                部分退款
              </el-button>-->
               <!-- <el-button v-if="scope.row.takeoutType==1" :plain="true" type="success" @click="deliverOK(scope.row)"
                         icon="circle-right" size="small">
                确认送达
              </el-button>-->
              <el-button :plain="true" type="success" @click="selOrderDelivery(scope.row)" icon="circle-right"
                         size="small">查看配送状态
              </el-button>
              <el-button
                v-if="scope.row.takeoutType==0&&scope.row.logisticsStatus =='0'&&scope.row.logisticsCode!='0000'"
                :plain="true" type="success" @click="deliver(scope.row)" icon="circle-right" size="small">
                添加小费
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="changeSize"
          @current-change="changePage"
          :current-page.sync="page.currentPage"
          :page-size="page.size"
          layout="prev, pager, next, jumper, total"
          :total="page.total">
        </el-pagination>
      </el-col>
    </el-row>
    <el-dialog title="商品列表" :visible.sync="partialView" v-loading="dialogLoading" size="tiny"
               @close="partialList=[];partialView = false;" class="multipleTable">
      <el-table
        ref="multipleTable"
        :data="partialList"
        border
        tooltip-effect="dark"
        height="250"
        @selection-change="partialSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="food_name" label="商品名称"/>
        <el-table-column prop="food_price" label="商品价格"/>
        <el-table-column prop="count" label="菜品数量"/>
        <el-table-column prop="box_num" label="餐盒数量	"/>
        <el-table-column prop="box_price" label="餐盒价格	"/>
        <el-table-column prop="origin_food_price" label="菜品原价	"/>
        <el-table-column prop="refund_price" label="退款价格"/>
      </el-table>
      <el-row>
        <el-col>
          <span>申请退款原因：</span>
        </el-col>
        <el-col>
          <el-input type="textarea" placeholder="请输入退款原因" v-model="cancelParam.extra"></el-input>
        </el-col>
      </el-row>
      <div style="margin-top: 20px">
        <el-button @click="partialList=[];partialView = false;">关闭</el-button>
        <el-button @click="define()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="添加小费" :visible.sync="feeView" size="tiny" @close="data={};mas={};feeView=false"
               class="dialog_box">
      <el-row :gutter="20">
        <div>
          <div>
            <el-col :span="24" class="btoom_table">
              <label class="dialog-la">配送费： </label>
              <div class="dialog-cont">{{msg.shippingFee}}</div>
            </el-col>
            <el-col :span="24" class="btoom_table">
              <label class="dialog-la">配送距离：</label>
              <div class="dialog-cont">{{msg.shippingTip}}</div>
            </el-col>
            <el-col :span="24" class="btoom_table">
              <label class="dialog-la">加点小费：</label>
              <div class="dialog-cont">
                <el-input class="Hpost" type="number" v-model="fee" placeholder="请输入小费金额"/>
              </div>
            </el-col>
          </div>
        </div>
        <el-col :span="24" class="tool-bar">
          <el-button @click="data={};msg={};feeView=false" icon="close">取消</el-button>
          <el-button type="primary" @click="disposeOrder(11)" :loading="submitForm_loading">添加小费</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="取消配送" :visible.sync="cancelOrderDeliver" size="tiny" @close="showpush()" class="dialog_box">
      <el-row :gutter="20">
        <div>
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">订 单 号：</label>
            <div class="dialog-cont">{{data.orderId}}</div>
          </el-col>
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">顾客名称：</label>
            <div class="dialog-cont">{{data.recipientName}}</div>
          </el-col>
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">顾客号码：</label>
            <div class="dialog-cont">{{data.recipientPhone}}</div>
          </el-col>
        </div>
        <el-col :span="24" class="tool-bar">
          <el-button @click="showpush()" icon="close">取消</el-button>
          <el-button type="primary" icon="check" @click="disposeOrder(3)" :loading="submitForm_loading">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="确认送达" :visible.sync="OrderDeliverOk" size="tiny" @close="showOK()" class="dialog_box">
      <el-row :gutter="20">
        <div>
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">订 单 号：</label>
            <div class="dialog-cont">{{data.orderId}}</div>
          </el-col>
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">顾客名称：</label>
            <div class="dialog-cont">{{data.recipientName}}</div>
          </el-col>
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">顾客号码：</label>
            <div class="dialog-cont">{{data.recipientPhone}}</div>
          </el-col>
        </div>
        <el-col :span="24" class="tool-bar">
          <el-button @click="showOK()" icon="close">取消</el-button>
          <el-button type="primary" icon="check" @click="disposeOrder(10)" :loading="submitForm_loading">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="配送信息" :visible.sync="elemeDeliveryInfo" size="tiny"
               @close="deliverData={};elemeDeliveryInfo=false" class="dialog_box">
      <el-row :gutter="20">
        <div>
          <div>
            <el-col :span="24" class="btoom_table">
              <label class="dialog-la">订单号： </label>
              <div v-if="currentRow.takeoutType==1" class="dialog-cont">{{deliverData.orderId}}</div>
              <div v-if="currentRow.takeoutType==0" class="dialog-cont">{{currentRow.orderId}}</div>
            </el-col>
            <el-col :span="24" class="btoom_table">
              <label class="dialog-la">配送员姓名：</label>
              <div v-if="currentRow.takeoutType==1" class="dialog-cont">{{deliverData.deliverName}}</div>
              <div v-if="currentRow.takeoutType==0" class="dialog-cont">{{currentRow.shipperName}}</div>
            </el-col>
            <el-col :span="24" class="btoom_table">
              <label class="dialog-la">配送员电话：</label>
              <div v-if="currentRow.takeoutType==1" class="dialog-cont">{{deliverData.deliverPhone}}</div>
              <div v-if="currentRow.takeoutType==0" class="dialog-cont">{{currentRow.shipperPhone}}</div>
            </el-col>
         <!--   <el-col :span="24" class="btoom_table">
              <label class="dialog-la">创建时间：</label>
              <div v-if="currentRow.takeoutType==1" class="dialog-cont">{{deliverData.createdAt}}</div>
              <div v-if="currentRow.takeoutType==0" class="dialog-cont">{{currentRow.updateTime}}</div>
            </el-col>-->
            <el-col v-if="currentRow.takeoutType==1" :span="24" class="btoom_table">
              <label class="dialog-la">运单主状态:</label>
              <div class="dialog-cont" v-if="deliverData.state == 'tobeAssignedMerchant'">待分配（物流系统已生成运单，待分配配送商）</div>
              <div class="dialog-cont" v-if="deliverData.state == 'tobeAssignedCourier'">待分配（配送系统已接单，待分配配送员）</div>
              <div class="dialog-cont" v-if="deliverData.state == 'tobeFetched'">待取餐（已分配给配送员，配送员未取餐）</div>
              <div class="dialog-cont" v-if="deliverData.state == 'delivering'">配送中（配送员已取餐，正在配送）</div>
              <div class="dialog-cont" v-if="deliverData.state == 'completed'">配送成功（配送员配送完成）</div>
              <div class="dialog-cont" v-if="deliverData.state == 'cancelled'">配送取消（商家可以重新发起配送）</div>
              <div class="dialog-cont" v-if="deliverData.state == 'exception'">配送异常</div>
              <div class="dialog-cont" v-if="deliverData.state == 'arrived'">已到店(配送员已到店)</div>
              <div class="dialog-cont" v-if="deliverData.state == 'selfDelivery'">商家自行配送</div>
              <div class="dialog-cont" v-if="deliverData.state == 'noMoreDelivery'">商家不再配送</div>
              <div class="dialog-cont" v-if="deliverData.state == 'reject'">物流拒单</div>
              <div class="dialog-cont" v-if="deliverData == null">暂无配送状态</div>
            </el-col>
            <el-col v-if="currentRow.takeoutType==1" :span="24" class="btoom_table">
              <label class="dialog-la">运单子状态:</label>
              <div class="dialog-cont" v-if="deliverData.subState == 'merchantReason'">商家取消</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'carrierReason'">配送商取消</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'userReason'">用户取消</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'systemReason'">物流系统取消</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'merchantCallLateError'">呼叫配送晚</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'merchantFoodError'">餐厅出餐问题</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'merchantInterruptDeliveryError'">商户中断配送</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'userNotAnswerError'">用户不接电话</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'userReturnOrderError'">用户退单</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'userAddressError'">用户地址错误</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'deliveryOutOfService'">超出服务范围</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'carrierRemarkExceptionError'">骑手标记异常</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'systemMarkedError'">系统自动标记异常--订单超过3小时未送达</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'otherError'">其他异常</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'deliveryTimeout'">配送超时，系统标记异常</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'onlinePayError'">只支持在线订单</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'consumerLocationTooFarError'">超出服务范围</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'merchantPushTooLateError'">超出服务范围</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'systemError'">系统异常</div>
              <div class="dialog-cont" v-if="deliverData.subState == 'noSubstate'">无配送子状态</div>
              <div class="dialog-cont" v-if="deliverData == null">暂无无配送子状态</div>
            </el-col>
            <el-col v-if="currentRow.takeoutType==0" :span="24" class="btoom_table">
              <label class="dialog-la">运单状态：</label>
              <div class="dialog-cont" v-if="currentRow.logisticsStatus == null ||currentRow.logisticsStatus == ''">
                暂无配送状态
              </div>
              <div class="dialog-cont" v-if="currentRow.logisticsStatus == 0">配送单发往配送</div>
              <div class="dialog-cont" v-if="currentRow.logisticsStatus == 10">配送单已确认(骑手接单)</div>
              <div class="dialog-cont" v-if="currentRow.logisticsStatus == 20">骑手已取餐</div>
              <div class="dialog-cont" v-if="currentRow.logisticsStatus == 40">骑手已送达</div>
              <div class="dialog-cont" v-if="currentRow.logisticsStatus ==100">配送单已取消</div>
            </el-col>
          </div>
        </div>
        <el-col :span="24" class="tool-bar">
          <el-button @click="deliverData={};data={};msg={};elemeDeliveryInfo=false" icon="close" size="small">关闭
          </el-button>
          <!-- <el-button type="primary" v-if="deliverData.state=='exception'" @click="disposeOrder(13)"
                      :loading="submitForm_loading">商家自配送
           </el-button>
           <el-button type="primary" v-if="deliverData.state=='exception'" @click="disposeOrder(14)"
                      :loading="submitForm_loading">不在配送
           </el-button>-->
         <!-- <el-button v-if="currentRow.takeoutType==1" @click="deningOut(currentRow)" size="small">非自配送出餐</el-button>-->
          <!-- <el-button  v-if="currentRow.takeoutType==1&&deliverData.state == 'cancelled'" :plain="true" @click="deliver(scope.row)" type="success" icon="caret-right" size="small">呼叫配送
           </el-button>-->
          <el-button v-if="currentRow.takeoutType==1&&deliverData.state == 'selfDelivery'" :plain="true" type="success" @click="deliverOK(currentRow)"
                     icon="circle-right" size="small">
            确认送达
          </el-button>
          <el-button type="warning" v-if="currentRow.logisticsCode!='0000'" :plain="true"
                     @click="openCancelOrder(currentRow)" icon="caret-right" size="small">
            取消配送
          </el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="发起配送" v-loading="dialogLoading" :visible.sync="showShippingDialog" size="tiny"
               @close="showShippingDialog=false" class="dialog_box">
      <el-form ref="form" :model="shippingParam" label-width="100px">
        <el-form-item label="配送费：">{{shippingParam.shippingFee}}</el-form-item>
        <el-form-item v-if="currentRow.takeoutType==0" label="配送距离：">{{shippingParam.shippingTip}}</el-form-item>
        <el-form-item label="加点小费：">
          <el-input v-model="shippingParam.tipFee"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="showShippingDialog=false" icon="close">关闭</el-button>
        <el-button size="small" type="primary" @click="disposeOrder(2)" :loading="submitForm_loading">呼叫众包配送</el-button>
        <el-button size="small" v-if="currentRow.takeoutType==0" type="primary" @click="disposeOrder(9)"
                   :loading="submitForm_loading">呼叫美团专送</el-button>
        <el-button size="small" v-if="currentRow.takeoutType==0" type="primary" @click="openMeituan=true"
                   :loading="submitForm_loading">自己配送</el-button>
      </span>
    </el-dialog>
    <el-dialog title="自配送" v-loading="dialogLoading" :visible.sync="openMeituan" size="tiny"
               @close="data={};openMeituan=false" class="dialog_box">
      <el-row :gutter="20">
        <div>
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">配送人：</label>
            <div class="dialog-cont">
              <el-input class="Hpost" v-model="courierName" placeholder="请输入配送人"/>
            </div>
          </el-col>
          <el-col :span="24" class="btoom_table">
            <label class="dialog-la">配送人电话：</label>
            <div class="dialog-cont">
              <el-input class="Hpost" v-model="courierPhone" type="number" placeholder="请输入配送人电话"/>
            </div>
          </el-col>
        </div>
        <el-col :span="24" class="tool-bar">
          <el-button @click="data={};openMeituan=false" icon="close">取消</el-button>
          <el-button type="primary" icon="check" @click="disposeOrder(8);" :loading="submitForm_loading">确 定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="取消订单" v-loading="dialogLoading" :visible.sync="showCancelDialog" size="tiny"
               @close="showCancelDialog=false" class="dialog_box">
      <el-form ref="form" :model="cancelParam" label-width="80px">
        <el-form-item label="原 因：">
          <el-radio-group v-model="cancelParam.businessCode" class="radio_label">
            <el-col :xs="24" :sm="12" :md="8" :lg="8" v-if="currentRow.takeoutType==0"
                    v-for="item in meituanCancelReason" :key="item.code">
              <el-radio :label="item.code">{{item.name}}</el-radio>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="8" v-if="currentRow.takeoutType==1" v-for="item in elemeCancelReason"
                    :key="item.code">
              <el-radio :label="item.code">{{item.name}}</el-radio>
            </el-col>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备 注：">
          <el-input type="textarea" v-model="cancelParam.extra" placeholder="说点什么吧......"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showCancelDialog=false" size="small" icon="close">取消</el-button>
        <el-button type="primary" icon="check" size="small" @click="disposeOrder(1)"
                   :loading="submitForm_loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import {bus} from '../../../../bus.js';
  import {dateFormat} from '../../../../utils/date.js';
  import math from '../../../../utils/math.js';

  export default {
    data() {
      return {
        partialView: false, // 部分退款列表弹框
        partialList: [],// 部分退款
        selectedPartialItems: [],

        showShippingDialog: false,
        elemeDeliveryInfo: false,
        selectedItems: [],
        currentRow: {}, // 当前行数据
        cancelParam: {
          businessCode: '',
          extra: ''
        },
        msg: {},
        deliverData: {},
        openMeituan: false,
        orderStatus: false,
        dialogLoading: false,
        feeView: false,
        itemLoading: false,
        cancelOrderDeliver: false,
        submitForm_loading: false,
        OrderDeliverOk: false,
        cancelOrder: false,
        cancelElemeOrder: false,
        showCancelDialog: false,
        courierPhone: null,
        courierName: null,
        dateRange: [],
        list: [], // 列表数据
        takeoutTypes: [ // 外卖平台类型
          {key: '0', name: '美团外卖'},
          {key: '1', name: '饿了么'},
          {key: '2', name: '百度外卖'}
        ],
        shippingParam: {
          takeoutType: 0,
          shippingFee: 0,
          tipFee: 0,
          shippingTip: ''
        },
        meituanCancelReason: [

          {code: '2014', name: '配送员取餐慢'},
          {code: '2015', name: '配送员送餐慢'},
          {code: '2012', name: '联系不上用户'},
          {code: '2010', name: '地址无法配送'},
          {code: '2009', name: '商品已售完'},
          {code: '2008', name: '店铺太忙'},
          {code: '2013', name: '重复订单'},
          {code: '2006', name: '用户要求取消'},
          {code: '2011', name: '店铺已打烊'},
          {code: '2016', name: '配送员丢餐、少餐、餐洒'},
          {code: '2007', name: '其他原因'}
        ],
        elemeCancelReason: [
          {code: 'others', name: '其它原因'},
          {code: 'fakeOrder', name: '用户信息错误'},
          {code: 'contactUserFailed', name: '联系不上用户'},
          {code: 'foodSoldOut', name: '商品已经售完'},
          {code: 'restaurantClosed', name: '商家已经打烊'},
          {code: 'distanceTooFar', name: '超出配送范围'},
          {code: 'restaurantTooBusy', name: '商家现在太忙'},
          {code: 'forceRejectOrder', name: '用户要求取消'},
          {code: 'deliveryFault', name: '暂时无法配送'},
          {code: 'notSatisfiedDeliveryRequirement', name: '不满足起送要求'}
        ],
        listSort: {},
        params: { // 列表查询参数
          takeoutType: null, // 外卖平台类型
          recipientPhone: null,// 客户电话
          frontStatus: 5, // 待配送订单
          orderNo: '',// 订单编号，模糊查询
          createTimeBegin: null,
          createTimeEnd: null
        },
        page: { // 分页信息
          currentPage: 1, // 当前页
          size: 15, // 每页大小
          total: 1, // 总页数
        },
        loading: false, // 是否显示加载遮罩层
        data: {},
        extra: null, // 额外信息，例如催单回复信息
        radio: 2007,
        radio1: 0,
        msg: {},
        fee: null, //小费
        oInvalidateType: null,
        remark: null,
        pickerOptions: {
          firstDayOfWeek:1,
          shortcuts: [{
            text: '现在时间',
            onClick(picker) {
              const start=new Date();
              const end =new Date();
              picker.$emit('pick',[start, end]);
            }
          },{
            text: '今天',
            onClick(picker) {
              let date = new Date();
              const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
              const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
              start.setTime(start.getTime());
              picker.$emit('pick', [start, end]);
            }
          },
            {
              text: '昨天',
              onClick(picker) {
                let date = new Date();
                const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
                start.setTime(start.getTime() - 24 * 60 * 60 * 1000);
                end.setTime(end.getTime() - 24 * 60 * 60 * 1000);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一周',
              onClick(picker) {
                let date = new Date();
                const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                let date = new Date();
                const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近三个月',
              onClick(picker) {
                let date = new Date();
                const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
                const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              }
            }]
        }
      }

    },
    methods: {
      // 查看配送状态
      selOrderDelivery(row) {
        this.data = row;
        this.currentRow = row;
        if (this.currentRow.takeoutType == 1) {
          this.disposeOrder(15);
        } else {
          this.elemeDeliveryInfo = true
        }

      },

      // 非自配送出餐
      deningOut(row) {
        this.currentRow = row;
        this.disposeOrder(66);
      },

      //
      cancel(operation) {
        this.data = operation;
        this.currentRow = operation;
        let type = operation.takeoutType;
        this.showCancelDialog = true;
        this.loadList();
        /*if (type==0){
          this.cancelOrder = true;
        }else {
          this.cancelElemeOrder = true;
        }*/
      },
      deliverOK(row) {
        this.data = row;
        this.currentRow = row;
        this.OrderDeliverOk = true;
      },
      showOK() {
        this.data = {};
        this.OrderDeliverOk = false;
      },
      showCancel() {
        this.data = {};
        this.cancelOrder = false;
      },
      deliver(row) {
        this.currentRow = row;
        this.disposeOrder(7);
        if (this.currentRow.takeoutType == 0) {
          this.feeView = true;
        } else {
          //this.openElemeDelivery = true;
        }
      },
      showCancelEleme() {
        this.data = {};
        this.cancelElemeOrder = false;
      },
      /*处理订单*/
      showpush() {
        this.data = {};
        this.cancelOrderDeliver = false;
      },
      /*取消订单*/
      openCancelOrder(row) {
        this.data = row;
        this.currentRow = row;
        /*this.showCancelDialog = true;*/
        this.cancelOrderDeliver = true;
      },

      /* 查询配送费*/
      deliver(row) {
        this.currentRow = row;
        this.disposeOrder(7);
        this.showShippingDialog = true;
      },
      /**部分退款*/
      partialRefund(row) {
        this.currentRow = row;
        this.disposeOrder(25);

      },
      /**
       * 处理订单
       * @param operation
       */
      disposeOrder(operation) {
        this.dialogLoading = true;
        this.submitForm_loading = false;
        // 设置通用参数
        let params = {
          takeoutType: this.currentRow.takeoutType, // 外卖平台类型
          orderId: this.currentRow.orderId, // 订单ID
          operation: operation,// 操作类型代码
        };
        // 根据操作类型设置额外参数
        switch (operation) {
          case 1:
            // 取消订单
            if ('' == this.cancelParam.extra || null == this.cancelParam.extra) {
              this.$message({
                type: 'error',
                message: "备注不能为空"
              });
              this.submitForm_loading = false;
              this.dialogLoading = false;
              return;
            }
            if (this.cancelParam.extra.length > 100) {
              this.$message({
                type: 'error',
                message: "备注不能大于50个字"
              });
              this.submitForm_loading = false;
              this.dialogLoading = false;
              return;
            }
            if (null == this.cancelParam.businessCode) {
              if ('' == this.cancelParam.extra || null == this.cancelParam.extra) {
                this.$message({
                  type: 'error',
                  message: "请选择取消原因"
                });
                this.submitForm_loading = false;
                this.dialogLoading = false;
                return;
              }
            }
            params.businessCode = this.cancelParam.businessCode; //取消订单代码
            params.extra = this.cancelParam.extra;
            break;
          case 2:
            // 呼叫配送
            params.shippingFee = this.shippingParam.shippingFee;
            if (this.shippingParam.tipFee == null) {
              this.shippingParam.tipFee = 0;
            }
            params.tipFee = this.shippingParam.tipFee;
          case 8:
            if ('' == this.courierName || null == this.courierName) {
              this.$message({
                type: 'error',
                message: "请填写配送人名称"
              });
              this.submitForm_loading = false;
              this.dialogLoading = false;
              return;
            }
            if (this.courierName.length > 40) {
              this.$message({
                type: 'error',
                message: "配送人名不能大于20个字"
              });
              this.submitForm_loading = false;
              this.dialogLoading = false;
              return;
            }
            if ('' == this.courierName || null == this.courierName) {
              this.$message({
                type: 'error',
                message: "请填写配送电话号码"
              });
              this.submitForm_loading = false;
              this.dialogLoading = false;
              return;
            }
            if (this.courierName.length > 11) {
              this.$message({
                type: 'error',
                message: "配送电话号码不能大于11个字"
              });
              this.submitForm_loading = false;
              this.dialogLoading = false;
              return;
            }
            params.courierPhone = this.courierPhone;
            params.courierName = this.courierName;
            break;
          case 26:
            params.extra =  this.cancelParam.extra;
            params.foodPartRefundParamList = this.selectedPartialItems;
            break;
          case 11:
            if (this.fee<0||this.fee==null||this.fee==undefined||this.fee==''){
              this.fee=0
            }
            params.shippingFee = this.fee;
            break;
        }
        this.$axios.post(bus.host + "/pos/api/takeout/order/dispose", params).then((res) => {
          let data = res.data;
          if (!data.success) {
            this.$message({
              type: 'error',
              message: "查询失败" + data.msg
            });
            this.dialogLoading = false;
            this.submitForm_loading = false;
            return;
          }
          switch (operation) {
            case 1: // 取消订单
            case 2: // 呼叫配送
            case 8: // 自配送
            case 9: // 呼叫美团专送
            case 10: // 确认送达
            case 11: // 添加小费
            case 13: // 配送异常商家自配送
            case 14: // 配送异常商家不再配送
              this.$message({
                message: data.msg.message,
                type: data.msg.success ? 'success' : 'error'
              });
              break;
            case 3:
              // 取消配送
              this.$message({
                message: data.msg.message,
                type: data.msg.success ? 'success' : 'error'
              });
              this.elemeDeliveryInfo = false;
              this.cancelOrderDeliver = false;
              break;
            case 7: // 配送费查询
              if (!data.msg.success) {
                this.$message({
                  message: data.msg.message,
                  type: data.msg.success ? 'success' : 'error'
                });
                break;
              }
              this.shippingParam = data.msg;
              this.dialogLoading = false;
              break;
            case 15:
              // 配送状态
              if (data.msg.elemeDeliveryRecords.length >= 1) {
                this.deliverData = data.msg.elemeDeliveryRecords[data.msg.elemeDeliveryRecords.length - 1];
              } else {
                this.deliverData = null;
              }
              this.elemeDeliveryInfo = true;
              break;
            case 25:
              if (!data.msg.success) {
                this.$message({
                  message: data.msg.message,
                  type: data.msg.success ? 'success' : 'error'
                });
                break;
              }
              this.partialList = JSON.parse(data.msg.meituanData);
              this.partialView = true;
              break;
            case 26:
                this.$message({
                  message: data.msg.message,
                  type: data.msg.success ? 'success' : 'error'
                });
              this.partialView = false ;
              break;
          }
          if (operation == 8) {
            this.openMeituan = false;
            this.showShippingDialog = false;
          }
          this.showCancelDialog = false;
          this.dialogLoading = false;
          this.OrderDeliverOk = false;
          this.submitForm_loading = false;
          this.cancelOrder = false;
          this.openMeituanDelivery = false;
          this.cancelElemeOrder = false;
         if (data.msg.success=='success'){
           if (operation==1){
             // this.$emit('cancelOrder').location.reload(true);
             window.location.reload(true);
           }
           if (operation==3){
             /*this.$emit('waitOrder').location.reload(true);
             this.$emit('cancelOrder').location.reload(true);
             */
             window.location.reload(true);
           }
           if (operation==10){
             /*this.$emit('completeOrder').location.reload(true);*/
             window.location.reload(true);
           }
         }

          this.loadList();
        }).catch((err) => {
          console.log(err);
          this.submitForm_loading = false;
        });
      },

      /*旧订单处理方法*/
      notarize(operation) {
        let parem = {};
        this.submitForm_loading = true;
        let oInvalidateType = null;
        if (this.radio1 != null) {
          if (this.radio1 == 0) {
            oInvalidateType = 'others';
          } else if (this.radio1 == 1) {
            oInvalidateType = 'fakeOrder';
          } else if (this.radio1 == 1) {
            oInvalidateType = 'contactUserFailed';
          } else if (this.radio1 == 2) {
            oInvalidateType = 'foodSoldOut';
          } else if (this.radio1 == 3) {
            oInvalidateType = 'restaurantClosed';
          } else if (this.radio1 == 4) {
            oInvalidateType = 'distanceTooFar';
          } else if (this.radio1 == 5) {
            oInvalidateType = 'restaurantTooBusy';
          } else if (this.radio1 == 6) {
            oInvalidateType = 'forceRejectOrder';
          } else if (this.radio1 == 7) {
            oInvalidateType = 'deliveryFault';
          } else if (this.radio1 == 8) {
            oInvalidateType = 'notSatisfiedDeliveryRequirement';
          }
        }
        parem = {
          takeoutType: this.data.takeoutType, // 外卖平台类型
          operation: operation,// 操作类型代码
          orderId: this.data.orderId, // 订单ID
          extra: this.extra, // 额外信息，例如催单回复信息
          reasonCode: this.radio,
          fee: this.msg.shippingFee,//配送费
          deliverFee: this.fee, //小费
          oinvalidateType: oInvalidateType,
          remark: this.remark
        }
        this.$axios.post(bus.host + "/pos/api/takeout/order/dispose", parem).then((res) => {
          let data = res.data;
          if (!data.success) {
            this.$message.error(data.msg);
            this.submitForm_loading = false
            return;
          }
          if (data.msg != null && data.msg.success != null && !data.msg.success) {
            this.$message.error(data.msg.message);
            this.submitForm_loading = false
            return;
          }
          if (operation != 7) {
            this.$message({
              message: "操作成功",
              type: 'success'
            });
          }
          if (operation == 7) {
            this.msg = data.msg.data[0]
          }
          this.OrderDeliverOk = false;
          this.submitForm_loading = false;
          this.cancelOrder = false;
          this.openMeituanDelivery = false;
          this.cancelElemeOrder = false;
          this.loadList();
        }).catch((err) => {
          console.log(err);
        });
      },
      getDateBegin(ymd) {
        //console.log(ymd);
        return ymd + ' 00:00:00';
      },
      getDateEnd(ymd) {
        //console.log(ymd);
        return ymd + ' 23:59:59';
      },
      search() {
        if (this.dateRange[0] != null && this.dateRange[0] != undefined && this.dateRange[1] != null && this.dateRange[1] != undefined) {
          this.params.createTimeBegin = dateFormat(this.dateRange[0], 'yyyy-MM-dd hh:mm:ss');
          this.params.createTimeEnd = dateFormat(this.dateRange[1], 'yyyy-MM-dd hh:mm:ss');
        } else {
          this.params.createTimeBegin = '';
          this.params.createTimeEnd = '';
        }
        this.params.orderNo = $.trim(this.params.orderNo);
        this.loadList();
      },
      /*设置数量徽标*/
      setupOrderNum(num) {
        this.$emit('deliveringOrderNum', num);
      },
      /*加载列表数据*/
      loadList() {
        let url = bus.host + '/pos/api/takeout/order/list?page=' + (this.page.currentPage - 1) + '&size=' + this.page.size;
        if (this.listSort.order != null) {
          url += '&sort=' + this.listSort.prop + ',' + this.listSort.order;
        }
        this.loading = true;
        this.$axios.post(url, this.params, {}).then((res) => {
          let data = res.data;
          if (!data.success) {
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
          }
          let msg = data.msg;
          this.page.total = msg.totalElements;
          let content = msg.content;
          content.forEach(e => e.items = []);
          this.list = content;
          this.loading = false;
          this.setupOrderNum(this.page.total);
        })
          .catch((err) => {
            console.log(err);
          });
      },
      trimSort(sort) {
        if (sort.order != null)
          sort.order = sort.order.replace('ending', '');
        return sort;
      },
      // 处理点击排序
      sortList(sort) {
        this.listSort = this.trimSort(sort);
        this.loadList();
      },
      /*处理分页事件*/
      changeSize(val) {
        this.page.size = val;
        this.loadList();
      },
      changePage(val) {
        this.page.currentPage = val;
        this.loadList();
      },
      listSummary(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          switch (index) {
            case 0:
              sums[index] = '合计';
              break;
            case 1:
            case 2:
            case 3:
            case 4:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
              sums[index] = '--';
              break;
            default:
              const values = data.map(item => Number(item[column.property]));
              sums[index] = values.reduce((prev, curr) => {
                return math.accAdd(prev, curr);
              }, 0);
          }
        });
        return sums;
      },
      itemSummary(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          switch (index) {
            case 0:
              sums[index] = '合计';
              break;
            case 1:
              sums[index] = '--';
              break;
            case 3:
              sums[index] = '--';
              break;

            case 5:
              sums[index] = '--';
              break;
            default:
              const values = data.map(item => Number(item[column.property]));
              sums[index] = values.reduce((prev, curr) => {
                return math.accAdd(prev, curr);
              }, 0);
          }
        });
        return sums;
      },
      // 批量取消
      batchCancel() {
        if (this.selectedItems.length<1){
          this.$message({
            type: 'error',
            message: '请选择订单!'
          });
          return;
        }
        this.$confirm('确定对选中的订单进行取消吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.selectedItems.forEach(e => {
            let param = {takeoutType: e.takeoutType, orderId: e.orderId};
            this.currentRow = e;
            if(param.takeoutType==0){this.cancelParam.businessCode = 2007;}
            else {
              this.cancelParam.businessCode = "others";
            }
            this.cancelParam.extra = "店铺取消";
            this.disposeOrder(1);
          });
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '操作失败!'
          });
        });
      },
      handleSelectionChange(val) {
        this.selectedItems = val;
      },
      // 退货申请
      partialSelectionChange(val) {
        this.selectedPartialItems = val;
      },

      define(){
        if (this.selectedPartialItems.length<1){
          this.$message({
            type: 'error',
            message: '请选择商品!'
          });
          return;
        }
        if (this.selectedPartialItems.length>= this.partialList.length){
          this.$message({
            type: 'error',
            message: '请勿全选!'
          });
          return;
        }
        this.$confirm('确定对选中的商品申请退款吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.selectedPartialItems.forEach(e => {
            this.disposeOrder(26);
          });
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '操作失败!'
          });
        });
      },
      // 加载订单明细
      showItems(row, expanded) {
        this.itemLoading = true;
        if (!expanded || row.items.length > 0) {
          this.itemLoading = false;
          return;
        }
        let url = bus.host + '/pos/api/takeout/order/detail?takeoutType=' + row.takeoutType + '&orderId=' + row.orderId;
        this.$axios.get(url).then((res) => {
          if (!res.data.success) {
            this.$message.error(res.data.msg);
            this.itemLoading = false;
            return;
          }
          row.items = res.data.msg;
          this.itemLoading = false;
        });
      }
    },
    mounted() {
      this.loadList();
    }
  }
</script>
<style>
  .multipleTable .el-dialog--tiny {
    width: 50%;
  }
</style>
<style scoped>
  .dialog-la {
    width: 120px;
    vertical-align: middle;
    float: left;
    text-align: right;
  }
  .btoom_table .dialog-la {
    width: 100px !important;
  }
</style>
