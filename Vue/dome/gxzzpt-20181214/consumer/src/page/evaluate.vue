<template>
  <div id="Evaluate">
      <!-- <div class="right-title">订单>收到的订单>评价</div> -->
      <div class="rate-box">
         <div class="itemlist" v-if="state==0">
             <div class="rate-list">
                 <h2>需求方信息</h2>
                 <div class="item-rate-header">
                     <img :src="logoUrl" alt="" class="item-logo">
                     <div class="item-rate-info">
                         <div class="item-title">
                             <div class="item-title-info active pull-inline" >
                                <span v-if="Initiator==2">{{username}}</span>
                                <span v-if="Initiator==2&&jobTitle!=undefined">{{jobTitle}}</span>
                                <span >{{CompanyName}}</span>
                             </div>
                             <fieldset v-if="Initiator==1" :class="toggleFavor===false?'item-btn-stats':'toggleFavor'" @click="Collection">
                                 <span v-if="toggleFavor===false">加入我的供应商</span>
                                 <span v-else>已加入我的供应商</span>
                             </fieldset>
                         </div>
                         <div class="item-suk">
                           <el-rate v-model="manufacSideScore" disabled disabled-void-color='#dcdcdc'></el-rate>
                         </div>
                     </div>
                 </div>
                 <h2>订单信息</h2>
                 <div class="item-rate-main">
                     <div class="item-box-header">
                         <span class="details">商品明细</span>
                         <span class="Price">单价</span>
                         <span class="amount">订单金额</span>
                     </div>

                     <div class="No-data" v-if="EvaluateData==''">
                        订单信息异常
                     </div>
                     <div class="item-rate-text" v-if="EvaluateData !=''">
                         <span class="item-date">{{EvaluateData.createTime}}</span>
                         <span class="item-number">订单编号：<strong>{{EvaluateData.orderNumber}}</strong></span>
                     </div>
                     <div class="item-rate-box" v-if="EvaluateData !=''">
                         <div class="item-L pull-left">
                          <div class="item-msg-text" v-for="(item,index) in EvaluateData.items" :key="index">
                              <div class="shop_details pull-left">
                                <img :src="item.fileInfo?item.fileInfo.thumbnailUrl:''" alt="" class="item_Img pull-left">
                                <p>产品名称：{{item.itemName}}</p>
                                <p>行业：{{item.industryName}}</p>
                                <p>需求编号：{{item.requirementNumber}}</p>
                              </div>
                              <div class="shop_amount pull-left">¥{{(Math.round(item.itemPrice*100))/100}}<span><i>*</i>{{item.quantity}}</span></div>
                          </div>

                         </div>
                         <div class="item-R">
                            ￥{{(Math.round(Totalamount*100))/100}}
                         </div>
                     </div>
                 </div>
                 <h2 >评价详情</h2>
                 <div class="form-dsr-box">
                    <div class="dsr-box">
                     <span class="dsr-box-msg" >发布您的合作体验，为其他<i v-if="Initiator==1">用户</i><i v-if="Initiator==2">供应商</i>提供建议和参考</span>
                     <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                         <div v-if="Initiator==1">
                            <el-form-item label="交付时间：" prop="deliveryTimeScore" class="item-form-b">
                                <el-rate allow-half v-model="ruleForm.deliveryTimeScore" class="rateList"  show-text :texts="['非常差', '差', '一般', '好', '非常好']"></el-rate>
                           </el-form-item>
                            <el-form-item label="产品质量：" prop="productQualityScore" class="item-form-b">
                                <el-rate allow-half v-model="ruleForm.productQualityScore" class="rateList" show-text :texts="['非常差', '差', '一般', '好', '非常好']"></el-rate>
                           </el-form-item>
                             <el-form-item label="产品价格：" prop="productPriceScore" class="item-form-b">
                                <el-rate allow-half v-model="ruleForm.productPriceScore" class="rateList" show-text :texts="['非常差', '差', '一般', '好', '非常好']"></el-rate>
                           </el-form-item>
                            <el-form-item label="服务质量：" prop="serviceQualityScore" class="item-form-b">
                                <el-rate allow-half v-model="ruleForm.serviceQualityScore" class="rateList" show-text :texts="['非常差', '差', '一般', '好', '非常好']"></el-rate>
                           </el-form-item>
                            <el-form-item label="技术能力：" prop="technologyAbilityScore" class="item-form-b">
                                <el-rate allow-half v-model="ruleForm.technologyAbilityScore" class="rateList" show-text :texts="['非常差', '差', '一般', '好', '非常好']"></el-rate>
                           </el-form-item>
                         </div>
                         <div v-if="Initiator==2">
                            <el-form-item label="配合程度：" prop="cooperateScore" class="item-form-b">
                                <el-rate allow-half v-model="ruleForm.cooperateScore" class="rateList" show-text :texts="['非常差', '差', '一般', '好', '非常好']"></el-rate>
                           </el-form-item>
                           <el-form-item label="付款及时：" prop="paymentTimelyScore" class="item-form-b">
                                <el-rate allow-half v-model="ruleForm.paymentTimelyScore" class="rateList" show-text :texts="['非常差', '差', '一般', '好', '非常好']"></el-rate>
                           </el-form-item>
                         </div>
                           <el-form-item label="评价：" prop="content" class=" item-form-text">
                                <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 4}" v-model="ruleForm.content" placeholder="评价不能少于10个字"></el-input>
                            </el-form-item>
                     </el-form>
                     <img v-if="CommentState==true&&Initiator==2" src="../../static/img/evaluate-Info.png" alt="" class="evaluateImg">
                    </div>
                    <div class="form-dsr-button">
                        <el-button type="primary" v-if="Initiator==1" @click="submitForm('ruleForm')">提交评价</el-button>
                        <el-button type="primary" v-if="Initiator==2" :disabled='CommentState==true?false:true' @click="submitForm('ruleForm')">提交评价</el-button>
                    </div>
                 </div>
             </div>
         </div>
         <div class="PromptText" v-if="state==1">
             <img src="../../static/img/Success_200.png" alt="">
             <span>评价发布成功!</span>
             <div class="Prompt-btn">
               <span v-if="this.$route.query.type==1" class="checkRate" @click="checkRate">查看评价</span>
               <span v-if="this.$route.query.type==2" class="checkRate" @click="GoHome">回到首页</span>
               <span class="goRate" @click="goRate">继续评价</span>
             </div>
         </div>
      </div>
  </div>
</template>

<script>
export default {
    data(){
      return{
          EvaluateData:[],
          Totalamount:'', //总金额
          manufacSideScore:0,//供应商评分
          CompanyName:'',
          username:'',
          jobTitle:'',//个人职位
          logoUrl:'',
          toggleFavor:false, //收藏状态
          supplier:[], //收藏
          supplierId:'',
          state:0,
          companyinfoId:'',
          Initiator:this.$route.query.type!=undefined?this.$route.query.type:1,//评价发起方：1--需求，2--制造
          CommentState:false,
          ruleForm:{
            deliveryTimeScore:0,
            productQualityScore:0,
            productPriceScore:0,
            serviceQualityScore:0,
            technologyAbilityScore:0,
            cooperateScore:0,
            paymentTimelyScore:0,
            content:''
          },
          rules:{
          deliveryTimeScore: [
            { required: true,validator: this.TimeScore, trigger: 'change' }
          ],
          productQualityScore: [
            { required: true,validator: this.TimeScore, trigger: 'change' }
          ],
          productPriceScore: [
            { required: true,validator: this.TimeScore, trigger: 'change' }
          ],
          serviceQualityScore: [
            { required: true,validator: this.TimeScore, trigger: 'change' }
          ],
          technologyAbilityScore: [
            { required: true,validator: this.TimeScore, trigger: 'change' }
          ],
          cooperateScore: [
            { required: true,validator: this.TimeScore, trigger: 'change' }
          ],
          paymentTimelyScore: [
            { required: true,validator: this.TimeScore, trigger: 'change' }
          ],
          content: [
            { required: true, message: '请填写评价', trigger: 'blur' },
             {min: 10, message: '评价不能少于10个字！', trigger: 'blur'},
             {max: 200, message: '评价最多200个字！', trigger: 'blur'}
          ]
          }
       }
    },

    created(){
     this.Initialization();
     let user = sessionStorage.getItem('testKey');
     let userList=JSON.parse(user)!=null?JSON.parse(user):'';
     if(this.$route.query.orderId==userList.orderId&&this.$route.query.type==userList.index){
       this.state=1
     }
    },

    methods:{
      TimeScore(rule, value, callback){ //评分校验
        if (value<0.5) {return callback(new Error('请为供应商评分'));}else{ setTimeout(() => {callback(); }, 100);}
      },

    /*初始数据*/
    Initialization(){
     let DemandUrl='/custom/order/getForComment'; //需求方url
     let makeUrl='/custom/manufacturer/order/getForComment'; //供应商url
     let params={
        id:parseInt(this.$route.query.orderId)
      }
      if(this.CommentState !=true){
      if(this.Initiator==1){
        this.$http.post(DemandUrl,params).then(res=>{
            if(res.data.code==200){
              let data=res.data.data;
              if(data !=undefined){
               if(JSON.stringify(data) == "{}"){
                 data=[];
               }
               this.EvaluateData=data;
               this.logoUrl=data.dispatchCompany!=undefined?data.dispatchCompany.logoUrl:'';
               this.manufacSideScore=data.dispatchCompany!=undefined?parseInt(data.dispatchCompany.manufacSideScore):0;
               this.CompanyName=data.dispatchCompany!=undefined?data.dispatchCompany.dispatchCompanyName:'';
               this.supplierId=data.dispatchCompany!=undefined?data.dispatchCompany.dispatchCompanyId:'';
               this.toggleFavorData(this.supplierId);
               this.totalAmount(data.items)
              }
            }
        })
      }
      }
      if(this.Initiator==2){
        this.$http.post(makeUrl,params).then(res=>{
            if(res.data.code==200){
              let data=res.data.data;
              if(data !=undefined){
               if(JSON.stringify(data) == "{}"){
                 data=[];
               }
               this.EvaluateData=data;
               this.logoUrl=data.user!=undefined?data.user.portrait:'';
               this.manufacSideScore=data.user!=undefined?parseInt(data.user.demandSideScore):0;
               this.CompanyName=data.user!=undefined?data.user.companyName:'';
               this.username=data.user!=undefined?data.user.username:'';
               this.jobTitle=data.user!=undefined?data.user.jobTitle:undefined;
               this.companyinfoId=data.dispatchCompany!=undefined?data.dispatchCompany.dispatchCompanyId:'';
               this.supplierId=data.user !=undefined?data.user.companyId:'';
               this.toggleEvaluate(this.companyinfoId);
               this.toggleFavorData(this.supplierId);
               this.totalAmount(data.items)
              }
            }
        })
      }

    },

    /*查看需求方是否被评价*/
    toggleEvaluate(companyinfoId){
      let url="custom/CompanyComment/getIfComment";
      let parmes={
        companyId:parseInt(companyinfoId),
        orderId:parseInt(this.$route.query.orderId),
      }
      this.$http.post(url,parmes).then(res=>{
          if(res.data.data !=false){
              this.CommentState=true
          }
      })
    },

    /*数据求和*/
    getSum(total, num) {
    return total + num;
    },

    /*订单总金额*/
    totalAmount(val){
        let amountData=[]
        for(let index in val){
            let amountList=val[index].itemPrice*val[index].quantity;
            amountData.push(amountList)
        }
        this.Totalamount=amountData.reduce(this.getSum);
    },

    /*获取收藏状态*/
    toggleFavorData(id){
        let user = localStorage.getItem('gxzzpt2_consumer');
        if(user!=''&&user !=undefined){
        var jsonObj = JSON.parse(user);
        this.supplier=jsonObj.supplier;
            for(let item in jsonObj.supplier){
                if(jsonObj.supplier[item]==id){
                    this.toggleFavor=true;
                }
            }
        }
    },

    /*点击收藏*/
    Collection(){
      let url="/custom/company/collectManufacturer";
      let params={
        supplierId:parseInt(this.supplierId),
      }
      if(this.toggleFavor !=true){
      this.$http.post(url,params).then(res=>{
          if(res.data.code==200){
            this.toggleFavor=true;
             this.supplier.push(this.supplierId)
            let user = localStorage.getItem('gxzzpt2_consumer');
             if(user!=''&&user !=undefined){
                var jsonObj = JSON.parse(user);
                jsonObj.supplier=this.supplier;
              let students = JSON.stringify(jsonObj);
              localStorage.setItem("gxzzpt2_consumer",students);
                this.$message({message: '收藏成功', type: 'success'});
             }
          }else{
            this.$message.error('收藏失败');
          }
      })
      }
    },

     /*提交评价*/
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
           let DemandUrl='/custom/CompanyComment/addCommentOnManufacturer'; //需求方url
           let makeUrl='/custom/manufacturer/CompanyComment/addCommentOnDemand'; //供应商url
           let url='';

           this.ruleForm.companyId=parseInt(this.$route.query.companyId);
           this.ruleForm.orderId=parseInt(this.$route.query.orderId);
           if(this.Initiator==1){
              url=DemandUrl;
           }
           if(this.Initiator==2){
              url=makeUrl;
           }
            this.$http.post(url,this.ruleForm).then(res=>{
              if(res.data.code==200){
                this.$message({message: '评分成功', type: 'success', duration:1100});
                let GradingState={
                  orderId:parseInt(this.$route.query.orderId),
                  index:this.$route.query.type
                };
                sessionStorage.setItem('testKey',JSON.stringify(GradingState)); // 存入一个值
                setTimeout(() => {this.state=1}, 1101);
               }else{
                this.$message({message:res.data.message, type: 'warning', duration:1100});
               }
             })
          } else {
            return false;
          }
        });
      },

    /*查看评价*/
    checkRate(){
     this.$router.push({path:'/manufacturer-audits',query: { companyId:this.supplierId,rateState:'rate'}})
    },

    /*回到首页*/
    GoHome(){
     this.$router.push('/index') 
    },

    /*继续评价*/
    goRate(){
      if(this.Initiator==1){
        this.$router.push({path:'/usercenter/require-order'})
      }
      if(this.Initiator==2){
        this.$router.push({path:'/usercenter/received-order'})
      }
    }

    },
}
</script>

<style lang="less">
.item-form-b{
  .el-form-item__label{width: 60px!important;text-align: left;padding: 0;}
  .el-form-item__content{margin-left: 60px!important;}
  .el-form-item__error{top:78%!important;}
  .el-rate__text{
    position: absolute;
    top: -4px;
    left: 130px;
    color:#a09f9f!important;
  }
  .el-rate__icon,.el-rate__decimal{font-size: 17px;}
}
.item-form-text{
  label{line-height:10px;width:60px!important;text-align: left;padding: 0;}
  .el-form-item__content{
    margin-left: 60px!important;
  }
}
</style>


<style lang="less" scoped>
    .No-data{
    text-align: center;
    height: 100px;
    line-height: 100px;
    font-size: 16px;
    color: #6d6d6d;
    img{
        width: 25px;
        height: 25px;
        vertical-align: middle;
        margin-right: 4px;
    }
  }
    .pull-left{float: left;}
    .pull-right{float:right;}
    .pull-inline{display: inline-block!important;}
    i{font-style:normal;}
    .No-data{
    text-align: center;
    height: 100px;
    line-height: 100px;
    font-size: 16px;
    color: #6d6d6d;
    img{
        width: 25px;
        height: 25px;
        vertical-align: middle;
        margin-right: 4px;
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
    #Evaluate{
       width: 100%;
       margin: auto;
       box-sizing: border-box;
       .rate-box{margin-top:20px;}
       .PromptText{
            text-align: center;
            margin-top: 150px;
          img{
            width: 100px;
            height: 100px;
            margin-bottom: 25px;
          }
          span{
            display: block;
            font-size: 24px;
            color: #3f8def;
            margin-bottom: 108px;
            }
          .Prompt-btn{
            margin-top: 100px;
            border-top: 1px dashed #b9b9b9;
            width: 850px;
            margin: auto;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
             justify-content: center;
            overflow: hidden;
            span{
                margin-top: 95px;
                width: 160px;
                height: 44px;
                font-size: 16px;
                line-height: 44px;
                float: left;
                cursor: pointer;
            }
            .checkRate{
               color: #929292;
               border: solid 1px #c2c2c2;
            }
            .goRate{
               color: #3f8def;
               border: solid 1px #3f8def;
               margin-left: 55px;
            }
          }
       }
       .itemlist{
           overflow: hidden;
           padding: 0px 0 30px;
         h2{
            font-size: 14px;
            font-weight: normal;
            font-stretch: normal;
            letter-spacing: 0px;
            color: #777777;
            margin-bottom: 7px;
         }
         .item-rate-header{
            width: 100%;
            height:90px;
            margin-bottom: 18px;
            background-color: rgba(241, 241, 241, 0.7);
            img{
             width:50px;
             height: 50px;
             float: left;
             background-color: #ffffff;
             border: solid 1px #e2e2e2;
             border-radius: 50%;
             margin: 18px 22px;
            }
            .item-rate-info{
              margin: 10px 100px;
            }
            .item-title{
                .item-title-info{
                    margin-bottom: 10px;
                    span+span{margin-left:50px;}
                }
                .active{
                    min-width: 100px;
                }
                fieldset{
                  display: inline-block;
                  margin-left: 50px;
                  width: 130px;
                  text-align: center;
                  height: 35px;
                  line-height: 35px;
                  color: #3f8def;
                  cursor: pointer;
                }
               .item-btn-stats{
                    background-color: rgba(63, 141, 239, 0.1);
                    border: solid 1px #3f8def;
                  }
               .toggleFavor{
                 background-color: rgba(75, 75, 75, 0.1) !important;
                 border:solid 1px #ededed!important;
               }
            }
            .item-suk{margin-top: 5px;}
         }
        .item-rate-main{
           margin-top: -6px;
           margin-bottom: 16px;
         .item-box-header{
           width:100%;
           height:27px;
           border-bottom: 3px solid rgba(63, 141, 239, 0.44);
           margin-bottom: 15px;
           margin-top: 10px;
            .details{width: 400px;padding-left: 130px;}
            .Price{width:157px;padding-left: 15px;}
            .amount{width:400px;text-align: center;}
            span{display: inline-block;box-sizing: border-box;}
         }
         .item-rate-text{
             padding: 10px 15px;color: #919191; background-color: #f1f1f1;font-size: 13px;
             .item-number{padding-left: 30px}
             strong{font-weight: initial;}
             }
         .item-msg-text{
             padding: 20px 15px;
             padding-left: 35px;
             overflow: hidden;
             position: relative;
            .item_Img{
              width:80px;
              height:80px;
            }
            .shop_details{
                width: 380px;
              p{margin-left: 95px;}
              p+p{margin-top: 10px;}
            }
            .shop_amount{
                width: 122px;
                height: 100%;
                margin-left: 380px;
                position: absolute;
                top: 0;
                right: 20px;
                display: -ms-flexbox;
                display: flex;
                -ms-flex-pack: left;
                justify-content: left;
                -ms-flex-align: center;
                align-items: center;
                span{
                  color: #a09f9f;
                }
            }
          }
         .item-rate-box{
                position: relative;
                background-color: #ffffff;
                border: solid 1px #e2e2e2;
                border-top-style: none;
                .item-msg-text+.item-msg-text{border-top: 1px solid #e2e2e2;}
            .item-L{
                width: 560px;
                box-sizing: border-box;
                }
            .item-R{
                width:403px;
                height: 100%;
                margin-left: 560px;
                position:absolute;
                top: 0;right: 0;
                border-left: 1px solid #e2e2e2;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack:center;
                -ms-flex-pack:center;
                justify-content:center;
                -webkit-box-align:Center;
                -ms-flex-align:Center;
                align-items:Center;
                }
         }
        }
        .item-rate-header,.item-rate-main,.item-rate-box{
            overflow: hidden;
            box-sizing: border-box;
        }
        .dsr-box{
            width: 100%;
            background-color: rgba(241, 241, 241, 0.7);
            padding: 16px 23px;
            box-sizing: border-box;
            position: relative;
            .dsr-box-msg{
              color: #919191;
              margin-bottom: 5px;
              display: block;
            }
            .item-form-b{
              width:625px;
              margin-bottom: 0;
            }
            .item-form-bx{
              margin-bottom:15px;
            }
            .item-form-text{
              width: 625px;
              margin-top:10px;
            }
            .rateList{
              line-height: 34px;
            }
            .evaluateImg{
              position: absolute;
              top: 10px;
              right: 10px;
            }
          .textarea-abs{
            position: relative;
            .textarea-Length{
              position: absolute;
              bottom: 0;
              right: 10px;
              font-size: 13px;
              color: #919191;
            }
          }  
        }
        .form-dsr-button{
            text-align: center;
            margin-top: 30px;
         }
       }
    }
</style>


