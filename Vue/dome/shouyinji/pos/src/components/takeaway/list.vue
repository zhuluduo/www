<template>
  <div >
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>外卖管理</el-breadcrumb-item>
          <el-breadcrumb-item>待处理外卖订单</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" >
        <el-table
          :data="tableData" border  class="table-top"
          style="width: 100%">
          <el-table-column prop="date" label="订单编号" ></el-table-column>
          <el-table-column prop="name" label="订单来源" ></el-table-column>
          <el-table-column prop="name" label="下单时间" ></el-table-column>
          <el-table-column prop="name" label="支付状态" ></el-table-column>
          <el-table-column prop="name" label="收货人电话" ></el-table-column>
          <el-table-column prop="name" label="收货人地址" ></el-table-column>
          <el-table-column prop="name" label="备注" ></el-table-column>
          <el-table-column prop="name" label="订单状态" ></el-table-column>
          <el-table-column prop="name" label="配送方式" ></el-table-column>
          <el-table-column prop="address" label="配送员电话"></el-table-column>
          <el-table-column  label="操作" >
            <template scope="scope">
                 <el-button  :plain="true" type="warning" @click="edit" size="small" icon="document" >详情</el-button>
                 <el-button v-if="scope.row.type==1" @click="Distribution"  :plain="true" type="warning" size="small" >配送</el-button>
                 <el-button v-if="scope.row.type==2" @click="Inorder" :plain="true" type="warning" size="small" >等待接单</el-button>
                 <el-button v-if="scope.row.type==3" @click="service" :plain="true" type="warning" size="small" >确认送达</el-button>
                 <el-button v-if="scope.row.type==5" :disabled="true"  :plain="true" type="warning" size="small" >确认送达</el-button>
                 <el-button v-if="scope.row.type==4" @click="Inprocess"  :plain="true" type="warning" size="small" >处理</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!--<el-pagination-->
          <!--@size-change="changeSize"-->
          <!--@current-change="changePage"-->
          <!--:current-page.sync="page.currentPage"-->
          <!--:page-size="page.size"-->
          <!--layout="prev, pager, next, jumper, total"-->
          <!--:total="page.total">-->
        <!--</el-pagination>-->
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible" size="tiny" :show-close="false" class="orderList">
      <div class="Distribution" v-if="this.orderInfo==1||this.orderInfo==5">
        <div v-if="this.orderInfo==1">
          <h3 class="orderTit">选择配送方式</h3>
          <el-form ref="ruleForm" :model="ruleForm" >
            <el-form-item class="orderBox">
              <el-radio-group v-model="ruleForm.resource">
                <el-radio label="1">店家直送</el-radio>
                <el-radio label="2" >美团专送</el-radio>
                <el-radio label="3" >蜂鸟专送</el-radio>
                <el-radio label="4" >达达物流</el-radio>
                <el-radio label="5">百度物流</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="orderCent">
              <el-button @click="dialogVisible=false" icon="close" size="small">取&nbsp;&nbsp;消</el-button>
              <el-button icon="check" type="primary" @click="orderSubmit" size="small">确&nbsp;&nbsp;定</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="this.orderInfo==5" class="orderCent">
          <h3 class="orderTit"><i class="el-icon-check"></i>订单任务已发出</h3>
          <el-button @click="dialogVisible=false" type="primary" icon="check" size="small" class="orderbutton">确&nbsp;&nbsp;定</el-button>
        </div>
      </div>
      <div class="Inorder orderSpan" v-if="this.orderInfo==2">
        <h3 class="orderTit">已选择"美团专送"</h3>
        <div class="waiting_time">
          <span >请等待配送员接单...</span>
          <span id="waiting_time">
            （
            <i v-if="this.waiting_time.seconds==''">0秒</i>
            <i v-show="this.waiting_time.days !=0">{{this.waiting_time.days}}天</i>
            <i v-show="this.waiting_time.hours !=0">{{this.waiting_time.hours}}小时</i>
            <i v-show="this.waiting_time.minutes !=0">{{this.waiting_time.minutes}}分钟</i>
            <i v-show="this.waiting_time.seconds !=0">{{this.waiting_time.seconds}}秒</i>
            ）
          </span>
        </div>
        <div class="orderCent">
          <el-button icon="close" @click="InorderSubmit" size="small" class="orderbutton">重&nbsp;&nbsp;选</el-button>
          <el-button icon="check"  @click="dialogVisible=false" type="primary"  size="small" class="orderbutton">继续等待</el-button>
        </div>
      </div>
      <div class="service" v-if="this.orderInfo==3">
        <h3 class="orderTit">请确认该订单已送达！</h3>
        <div class="orderCent">
          <el-button @click="dialogVisible=false" icon="close" size="small" class="orderbutton">取&nbsp;&nbsp;消</el-button>
          <el-button icon="check" type="primary" @click="serviceSubmit" size="small" class="orderbutton">确&nbsp;&nbsp;定</el-button>
        </div>
      </div>
      <div class="Inprocess orderSpan" v-if="this.orderInfo==4">
        <h3 class="orderTit">是否同意该退货申请？</h3>
        <span>扣款：<el-input v-model="amount" placeholder="请输入扣款金额" class="form-inline"></el-input>元</span>
        <div class="orderCent">
          <el-button @click="processRefuse" icon="close" size="small" class="orderbutton">拒&nbsp;&nbsp;绝</el-button>
          <el-button icon="check" type="primary" @click="processAdopt" size="small" class="orderbutton">同&nbsp;&nbsp;意</el-button>
        </div>
      </div>
    </el-dialog>
    <transition name="el-zoom-in-rights">
      <div v-show="showEdit" class=" takeawayorderinfobox scrollbar" >
        <div class="takeawayorder-title border-btm">
          <i class="el-icon-arrow-left fl returnbtn" @click="returnbtn"></i>
          <span>订单详情</span>
        </div>
        <div class="takeawayorderinfo">
          <ul>
            <li>
              订单编号：<i>1503116268</i><i class="fr">2017-09-27 16:08:05</i>
            </li>
            <li>
              支付方式：<i>在线支付</i>
            </li>
            <li>
              配送方式：<i>美团专送</i><i class="sv_receipt_phone">15888888888</i>
            </li>
            <li>
              支付状态：<i>已支付</i>
            </li>
            <li>
              订单状态：<i>配送中</i>
            </li>
            <li>
              订单来源：<i>美团外卖</i>
            </li>
            <li>
              收货地址：<i>转角街坊</i><i class="sv_receipt_phone">18688908152</i>
            </li>
            <li class="useraddress"><i>深圳市高新大道武汉大学产研基地7楼</i></li>
          </ul>
        </div>
        <div class="foodlist scrollbar" id="foodlistbox">
            <ul>
              <li>
                <div class="imgbox">
                  <img :src=this.shopimgSrc alt="" v-if="this.shopimgSrc!=''">
                  <i class="configTxt">暂无图片</i>
                </div>
                <div class="foodlistinfo">
                  <div class="sharename-number">
                    <span>五味小吃拼盘</span><span class="fr sharenameSize">零售价：<i class="moneyreds">¥ 28</i></span>
                  </div>
                  <div class="sharename-number">
                    <i class="pad10 ">x1</i> <span class="fr sharenameSize">小计：<i class="moneyred">¥ 28</i></span>
                  </div>
                </div>
              </li>
              <li>
                <div class="imgbox"><img src="http://res.decerp.cc/UPIMG/product/20160503164527056.jpg" alt=""></div>
                <div class="foodlistinfo">
                  <div class="sharename-number">
                    <span>五味小吃拼盘</span><span class="fr sharenameSize">零售价：<i class="moneyreds">¥ 28</i></span>
                  </div>
                  <div class="sharename-number">
                    <i class="pad10 ">x1</i> <span class="fr sharenameSize">小计：<i class="moneyred">¥ 28</i></span>
                  </div>
                </div>
              </li>
              <li>
                <div class="imgbox"><img src="http://res.decerp.cc/UPIMG/product/20160503164527056.jpg" alt=""></div>
                <div class="foodlistinfo">
                  <div class="sharename-number">
                    <span>五味小吃拼盘</span><span class="fr sharenameSize">零售价：<i class="moneyreds">¥ 28</i></span>
                  </div>
                  <div class="sharename-number">
                    <i class="pad10 ">x1</i> <span class="fr sharenameSize">小计：<i class="moneyred">¥ 28</i></span>
                  </div>
                </div>
              </li>
              <li>
                <div class="imgbox"><img src="http://res.decerp.cc/UPIMG/product/20160503164527056.jpg" alt=""></div>
                <div class="foodlistinfo">
                  <div class="sharename-number">
                    <span>五味小吃拼盘</span><span class="fr sharenameSize">零售价：<i class="moneyreds">¥ 28</i></span>
                  </div>
                  <div class="sharename-number">
                    <i class="pad10 ">x1</i> <span class="fr sharenameSize">小计：<i class="moneyred">¥ 28</i></span>
                  </div>
                </div>
              </li>
              <li>
                <div class="imgbox"><img src="http://res.decerp.cc/UPIMG/product/20160503164527056.jpg" alt=""></div>
                <div class="foodlistinfo">
                  <div class="sharename-number">
                    <span>五味小吃拼盘</span><span class="fr sharenameSize">零售价：<i class="moneyreds">¥ 28</i></span>
                  </div>
                  <div class="sharename-number">
                    <i class="pad10 ">x1</i> <span class="fr sharenameSize">小计：<i class="moneyred">¥ 28</i></span>
                  </div>
                </div>
              </li>
              <li>
                <div class="imgbox"><img src="http://res.decerp.cc/UPIMG/product/20160503164527056.jpg" alt=""></div>
                <div class="foodlistinfo">
                  <div class="sharename-number">
                    <span>五味小吃拼盘</span><span class="fr sharenameSize">零售价：<i class="moneyreds">¥ 28</i></span>
                  </div>
                  <div class="sharename-number">
                    <i class="pad10 ">x1</i> <span class="fr sharenameSize">小计：<i class="moneyred">¥ 28</i></span>
                  </div>
                </div>
              </li>
              <li>
                <div class="imgbox"><img src="http://res.decerp.cc/UPIMG/product/20160503164527056.jpg" alt=""></div>
                <div class="foodlistinfo">
                  <div class="sharename-number">
                    <span>五味小吃拼盘</span><span class="fr sharenameSize">零售价：<i class="moneyreds">¥ 28</i></span>
                  </div>
                  <div class="sharename-number">
                    <i class="pad10 ">x1</i> <span class="fr sharenameSize">小计：<i class="moneyred">¥ 28</i></span>
                  </div>
                </div>
              </li>
              <li>
                <div class="imgbox"><img src="http://res.decerp.cc/UPIMG/product/20160503164527056.jpg" alt=""></div>
                <div class="foodlistinfo">
                  <div class="sharename-number">
                    <span>五味小吃拼盘</span><span class="fr sharenameSize">零售价：<i class="moneyreds">¥ 28</i></span>
                  </div>
                  <div class="sharename-number">
                    <i class="pad10 ">x1</i> <span class="fr sharenameSize">小计：<i class="moneyred">¥ 28</i></span>
                  </div>
                </div>
              </li>
              <li>
                <div class="imgbox"><img src="http://res.decerp.cc/UPIMG/product/20160503164527056.jpg" alt=""></div>
                <div class="foodlistinfo">
                  <div class="sharename-number">
                    <span>五味小吃拼盘</span><span class="fr sharenameSize">零售价：<i class="moneyreds">¥ 28</i></span>
                  </div>
                  <div class="sharename-number">
                    <i class="pad10 ">x1</i> <span class="fr sharenameSize">小计：<i class="moneyred">¥ 28</i></span>
                  </div>
                </div>
              </li>
              <li>
                <div class="imgbox"><img src="http://res.decerp.cc/UPIMG/product/20160503164527056.jpg" alt=""></div>
                <div class="foodlistinfo">
                  <div class="sharename-number">
                    <span>五味小吃拼盘</span><span class="fr sharenameSize">零售价：<i class="moneyreds">¥ 28</i></span>
                  </div>
                  <div class="sharename-number">
                    <i class="pad10 ">x1</i> <span class="fr sharenameSize">小计：<i class="moneyred">¥ 28</i></span>
                  </div>
                </div>
              </li>
            </ul>
        </div>
        <div class="box-footer ">
          <div class="ordermoney">
          <ul>
          <li>
          <span class="fl">商品总额：</span><span class="fr moneyinfo">¥ <i >144.90</i></span>
          </li>
          <li>
          <span class="fl">优惠合计：</span><span class="fr moneyinfo">¥ <i >0</i></span>
          </li>
          <li>
          <span class="fl">应付金额：</span><span class="fr moneyinfo">¥ <i >144.90</i></span>
          </li>
          <li>
          <span class="fr moneyinfo">实付：<i class="moneyred" >¥144.90</i></span>
          </li>
          </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

    export default {
        data() {
            return {
              orderInfo:'',
              amount:'',
              shopimgSrc:'',
              showEdit:false,
              tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                name: '王小虎',
                name: '王小虎',
                name: '王小虎',
                name: '王小虎',
                name: '王小虎',
                name: '王小虎',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                type:'1',
              },
                {
                  date: '2016-05-02',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄',
                  type:'2',
                },
                {
                  date: '2016-05-02',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄',
                  type:'3',
                },
                {
                  date: '2016-05-02',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄',
                  type:'5',
                },
                {
                  date: '2016-05-02',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  name: '王小虎',
                  address: '上海市普陀区金沙江路 1518 弄',
                  type:'4',
                }],
              ruleForm:{
                resource: '',
              },
              waiting_time:{
                settime:'2017-11-16 11:55:00',
                days:'',
                hours:'',
                minutes:'',
                seconds:'',
              },
              page:{ // 分页信息
                currentPage:1, // 当前页
                size:15, // 每页大小
                total:1, // 总页数
              },
              dialogVisible:false,
            }
        },
        methods: {
//          loadList(){
//            let url=''
//            this.$http.post().then((res)=>{
//
//            }).catch((res)=>{
//
//            })
//          }
          /*处理分页事件*/
//          changeSize(val) {
//            this.page.size = val;
//            this.loadList();
//          },
//          changePage(val) {
//            this.page.currentPage = val;
//            this.loadList();
//          },
          edit(){
            this.showEdit=true
            console.log(66666)
          },
          returnbtn(){
            this.showEdit=false;
          },
         /* 配送*/
          Distribution(){
            this.dialogVisible=true
            this.orderInfo=1
          },
          /* 等待接单中*/
          Inorder(){
            this.dialogVisible=true
            this.orderInfo=2
            setInterval(()=>{
              var date1=new Date(this.waiting_time.settime);
              var date2=new Date();
              var date3=date2.getTime()-date1.getTime()
              this.waiting_time.days =Math.floor(date3/(24*3600*1000))  //天

              var leave1=date3%(24*3600*1000)    //小时
              this.waiting_time.hours=Math.floor(leave1/(3600*1000))

              var leave2=leave1%(3600*1000)        //分
              this.waiting_time.minutes=Math.floor(leave2/(60*1000))

              var leave3=leave2%(60*1000)      //秒
              this.waiting_time.seconds=Math.round(leave3/1000)
              this.waiting_time.seconds=this.checkTime(this.waiting_time.seconds)
            },1000)
          },
           checkTime(i){
            if(i<10){i="0"+i;}
            return i;
          },
          /*送达*/
          service(){
            this.dialogVisible=true
            this.orderInfo=3
          },
          /*处理*/
          Inprocess(){
            this.dialogVisible=true
            this.orderInfo=4
          },
          /* 配送确认*/
          orderSubmit(){
            if(this.ruleForm.resource==''||this.ruleForm.resource==null||this.ruleForm.resource==undefined){
              this.$message({message: '请选择配送方式', type: 'warning'});
              return false;
            }else {
                this.orderInfo=5
              console.log(this.ruleForm.resource)
              setTimeout(()=>{
                this.dialogVisible=false
              },2000)
            }
//            this.$message({
//              message: '恭喜你，这是一条成功消息',
//              type: 'success'
//            });
//            setTimeout(()=>{
//              this.orderInfo=5
//            },3000)
          },
          /* 等待接单中重新选择配送单位*/
          InorderSubmit(){
            this.orderInfo=1;
          },
          /*送达确认*/
          serviceSubmit(){
            console.log('已经确认！！！！')
            this.dialogVisible=false;
          },
          /*拒绝退款*/
          processRefuse(){
            console.log('拒绝退款！！！')
            this.dialogVisible=false;
          },
          processAdopt(){
            console.log('同意退款!!!')
            this.dialogVisible=false;
          },
        },
        mounted(){

        }
    };
</script>
<style rel="stylesheet/scss" lang="scss">
  *{
    font-weight: normal;
    font-style: normal;
  }
  .el-zoom-in-rights-enter-active,.el-zoom-in-rights-leave-active {
    transition:all .3s
  }
  .el-zoom-in-rights-enter-active,.el-zoom-in-rights-leave-active {
    /*opacity:1;*/
    margin-right: 0;
    /*-ms-transform:scaleX(1);*/
    /*transform:scaleX(1);*/
    /*-ms-transform-origin: right center;*/
    /*transform-origin: right center;*/
  }
  .el-zoom-in-rights-enter,.el-zoom-in-rights-leave-active {
    /*opacity:0;*/
    margin-right: -450px;
    /*-ms-transform:scaleX(0);*/
    /*transform:scaleX(0)*/
  }
  .orderList .el-dialog__header{
    display: none;
  }
  .orderList .el-dialog__body{
    padding:20px 20px;
  }
  .orderBox .el-form-item__content{
    padding-left: 10%;
    label{
      margin-left: 0;
      width: 100px;
      margin-bottom: 10px;
    }
  }
  .orderTit i{
    padding-right: 5px;
  }
 .orderCent .orderbutton{
   margin-top: 30px;
 }
  .Inprocess span{
    input{width: 120px;}
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
  /**{*/
    /*-webkit-box-sizing: border-box;*/
    /*-moz-box-sizing: border-box;*/
     /*box-sizing: border-box;*/
    /*list-style: none;*/
    /*margin: 0;*/
    /*padding: 0;*/
  /*}*/
  *{
    font-weight: normal;
    font-style: normal;
  }
  .dis-none{display: none;}
  .fl{float: left}
  .fr{float: right}
  .border-btm{border-bottom: 1px solid #e8e8e8!important;}
  .table-top{
    margin-top: 0
  }
  .orderTit{
    font-size: 1.35em;
    text-align: center;
  }
  .orderCent{
    text-align: center;
  }
  .Inorder {
    .orderTit{
      margin-bottom: 5px;
    }
  }
  .orderSpan {
    span {
      display: block;
      text-align: center;
    }
    .waiting_time{
      text-align: center;
        span{
          display: inline-block;
        }
    }
  }

  .takeawayorderinfobox{
    box-shadow: 0px 0px 0px 2px #383531;
    position: fixed;
    top:50px;
    right:0;
    width: 450px;
    height: 100%;
    background-color: #f6f3ee;
    color: #000;
    box-sizing: border-box;
    z-index:999;
    overflow:scroll;
    .takeawayorder-title {
      position: fixed;
      width: 450px;
      height: 45px;
      line-height: 15px;
      box-sizing: border-box;
      padding:15px 20px 0 20px;
      text-align: center;
      background: #f6f3ee;
    }
    .returnbtn{
      width: 30px;
      cursor: pointer;
    }
    .takeawayorderinfo{
      width: 100%;
      box-sizing: border-box;
      padding: 10px 20px;
      margin-top: 45px;
      border-bottom: 1px solid #e8e8e8;
      ul{
        list-style: none;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        width: 100%;
        .useraddress{padding-left: 70px;}
        li{
          font-size: 14px;
          list-style-type: none;
          line-height: 25px;
          .sv_receipt_phone{margin-left: 30px}
          i{
            font-weight: normal;
            font-style: normal;
            color: #999;
          }
        }
      }
    }
    .foodlist{
      width: 100%;
      background-color: #f3efe9;
      padding: 0 20px 40px 20px;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: auto;
      font-size: 14px;
        ul{
          margin: 0;
          padding: 0;
          list-style-type: none;
          width: 100%;
          li{
            border-bottom: 1px solid #e8e8e8 !important;
            cursor: pointer;
            position: relative;
            padding-left: 80px;
            height: 80px;
            padding-top: 10px;
            padding-bottom: 10px;
            box-sizing: border-box;
            &:last-child {border-bottom:none  !important;}
            /*&:hover{*/
              /*background: red;*/
            /*}*/
            .imgbox{
              width: 60px;
              height: 60px;
              position: absolute;
              left: 0;
              top: 10px;
              img{
                width: 60px;
                height: 60px;
                border: none;
                border-radius: 3px;
                -webkit-border-radius: 3px;
                -moz-border-radius: 3px;
                -ms-border-radius: 3px;
              }
              .configTxt{
                width: 100%;
                height: 100%;
                background: #fff;
                display: block;
                line-height: 60px;
                text-align: center;
                font-size: 12px;
                color: #999;
              }
            }
            .sharename-number{
              height: 31px;
              line-height: 30px;
              .sharenameSize{font-size: 13px;}
              .moneyred ,.moneyreds{color: #fe0000;font-size: 15px;}
            }
          }
        }
    }
    .ordermoney{
      width: 100%;
      padding: 15px 40px;
      border-top: 1px solid #e8e8e8;
      z-index: 999;
      background: #f6f3ee;
      font-size: 14px;
      box-sizing: border-box;
      margin-bottom: 20px;
      ul{
        margin: 0;
        padding: 0;
        list-style-type: none;
        width: 100%;
        li{
          width: 100%;
          line-height: 25px;
          height: 25px;
          position: relative;
          .moneyinfo{
            font-size: 16px;
              .moneyred{
                color: #fe0000;
                font-size: 20px;
              }
          }
        }
      }
    }
  }
  @media screen and (max-height:1080px) {
    .foodlist{ max-height:500px;}
  }
  @media screen and (max-height:768px) {
    .foodlist{ max-height:320px;}
  }
</style>
