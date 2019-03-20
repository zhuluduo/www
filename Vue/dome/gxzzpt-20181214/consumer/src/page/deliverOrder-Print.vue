<template>
    <div id="deliverOrder">
        <div class="box">
            <div class="fl-right printDeliver"  @click="printBtn('deliverOrder-Print')">打印送货单</div>
            <div id="deliverOrder-Print">
                <div id="deliverOrder-Print-content">
                    <div class="deliverHeader">
                        <div class="title">
                            <p>{{deliveryData.dispatchCompany?deliveryData.dispatchCompany.dispatchCompanyName:''}}</p>
                            <p>送货单</p>
                        </div>
                    </div>
                    <div class="deliverBody">
                        <div class="info">
                            <div>
                                <span>客户名称: {{deliveryData.user?deliveryData.user.companyName:''}}</span>
                                <span class="fl-right"> 订单编号: {{deliveryData.orderNumber}}</span>
                            </div>
                            <div>送货日期： {{nowTime | dataFilter}}</div>
                            <div v-if="deliveryData.addressInfo">
                                送货地址：
                               {{deliveryData.addressInfo.province}}
                               {{deliveryData.addressInfo.city}}
                               {{deliveryData.addressInfo.address}}
                            </div>
                        </div>
                        <div class="content">
                            <div class="contentHead">
                                <span>零件编号</span>
                                <span>零件名称</span>
                                <span>下单数量(件)</span>
                                <span>已交货数量(件)</span>
                                <span>本次交货数量</span>
                            </div>
                            <div v-for="(item,index) in deliveryData.items" :key="index" class="contentBody">
                                <span>{{item.requirementNumber?item.requirementNumber:'-'}}</span>
                                <span>{{item.itemName}}</span>
                                <span>{{item.quantity}}</span>
                                <span>{{item.deliveryQuantitySum}}</span>
                                <span>{{item.deliveryQuantity}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="deliverFooter">
                        <div>配送方式：{{deliveryData.expressModeStr}}</div>
                        <div v-if="(deliveryData.expressMode == 111020)||(deliveryData.expressMode == 111030)">
                            <span>承运公司：{{expressCompany}}</span>
                            <span class="fl-right">承运单号：{{deliveryData.expressForm?deliveryData.expressForm.expressNumber:''}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {print} from '../lib/GeneralTools.js';
import '../lib/filter.js'//格式化金额（保留两位小数）过滤器
export default {
    data(){
        return{
            deliveryData:{},
            expressCompany:null,
            nowTime:String(new Date())
        }
    },
    created() {
       this.deliveryData = JSON.parse(localStorage.getItem('deliveryData'));
       console.log(this.deliveryData);
       this.getExpressCompanyList();
    },
    mounted() {
     
    },
    computed:{
      
    },
    methods: {
        printBtn(name){
            print(name)
        },
        getExpressCompanyList(){
            this.$http.post("/getExpressCompanyList").then(res => {
                if (res.data.code == 200) {
                    let [i,resData,expressCompanyId] =[0,res.data.data,this.deliveryData.expressForm?this.deliveryData.expressForm.expressCompanyId:null];
                    for(i;i<resData.length;i++){
                        if(resData[i].id == expressCompanyId){
                            this.expressCompany = resData[i].name;
                            return false;
                        }
                    }
                }
            });
        },
    },
}
</script>
<style lang="less"  media="print">
#deliverOrder-Print-content{
    .deliverHeader{
        padding: 10px 0;
        border-bottom: 1px solid #e2e2e2; 
        .title{
            text-align: center;
            margin: 0 74px;
        }
        p{
            font-size: 16px;
            margin-bottom: 6px;
        }
    }
    .deliverBody{
        .info{
            line-height: 24px;
            margin-top:12px; 
        }
        .content{
            width: 756px;
            padding: 16px 0 26px;
            margin: 0 auto;
            border-bottom: 1px solid #e2e2e2;
            .contentHead,.contentBody{
                display: flex;
                justify-content: space-around;
                span{
                    flex: 1;
                    display: inline-block;
                    text-align: center;
                    line-height: 34px;
                    border: 1px solid #e2e2e2; 
                    margin:-1px -1px  0 0; 
                }
            }
        }
    }
    .deliverFooter{
        margin-top: 20px;
        >div+div{
            margin-top:5px;
        }
    }
}
</style>

<style lang="less" scoped>
   #deliverOrder{
        padding: 20px 0 40px 0;
        background-color: #fff;
       .box{
            width: 1200px;
            margin: 0 auto;
            .deliverBody{ 
                .content{
                    width: 1200px;
                }
            }
            .printDeliver{
                margin-top: 12px;
                width: 74px;
                height: 24px;
                color: #ffffff;
                line-height: 24px;
                text-align: center;
                background-color: #3f8def;
                border-radius: 4px;
                cursor: pointer;
            }
        }
   }
</style>