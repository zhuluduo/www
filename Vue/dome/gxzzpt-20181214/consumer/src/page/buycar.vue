<template>
    <div class="buyCar">
        <div class="empty-con" v-if="emptyStats !=true">
           <div class="icon-container">
               <img src="../../static/img/shopping-cart.png" alt="">
           </div>
           <div class="tip-container">
               <span class="empty-tip">您的购物车是空的！</span>
               <!-- <span class="info-tip">您可以<a @click="$router.push('/auto-quotation')">上传模型>></a></span> -->
           </div>
        </div>
        <div class="table" v-else>
            <orderStep :active="StepActive"></orderStep>
            <div class="content">
                <div  class="menu">
                    <thead>
                        <tr>
                            <td></td>
                            <td width="336" align="center">商品信息</td>
                            <td width="156" align="center">单价</td>
                            <td width="166" align="center">数量</td>
                            <td width="156" align="center">金额</td>
                            <td width="136" align="center">操作</td>
                        </tr>
                    </thead>
                    <tbody v-for="(item ,index) in goodslist"  :key="index">
                        <tr>
                            <td align="right">
                                <input type="checkbox"  :value="item.id" v-model="item.isSelected" class="checkItem" @click="checkOne(item.isSelected,item.id)">
                            </td>
                            <td width="167" align="center">
                                <img :src="item.file.thumbnailUrl" alt="" :key="item.file.fileId">
                            </td>
                            <td width="336" align="left">
                                <div>名称：<span>{{item.productParams.serviceName}}</span></div>
                                <div>材质：<span>{{item.productParams.material.name}}</span></div>
                                <div v-for="el in item.productParams.steps" :key="el.stepid">
                                    <div>{{el.stepName}}：{{el.techniqueName}}</div>
                                    <div v-for="elem in el.techniqueParams" :key="elem.paramsId">{{elem.key}}：{{elem.value}}</div>
                                    <div v-if="el.material">
                                        <div v-for="elem in el.material.materialParams" :key="elem.paramsId">{{elem.key}}：{{elem.value}}</div>
                                    </div>
                                </div>
                                <div>文化单位:<span>{{item.fileUnit}}</span></div>
                            </td>
                            <td width="156" align="center">
                                <span>¥{{item.price | money}}</span>
                            </td>
                            <td width="166" align="center">
                                <inputnumber  @numberChange="getChangedNumber" @priceChange="getChangePrice" :initCount="item.quantity" :goodsId="item.id"></inputnumber> 
                            </td >
                            <td width="156" align="center"><span class="numbercolor" style="font-weight:normal">¥{{item.price * item.quantity | money}}</span></td>
                            <td width="138" align="center" style="cursor:pointer;">
                                <i class="el-icon-delete"  style="color:#c3c3c3;font-size:24px;" @click="delectBtnOne(item.id,index)"></i>
                            </td>
                        </tr>
                    </tbody>
                </div>
                <div class="accounts">
                    <ul>
                        <li>
                            <label for="checkAll">
                                <input id="checkAll" value="全选" v-model="checkbox"  type="checkbox"  @click="checkAll($event)">全选
                            </label>
                        </li>
                        <li>
                            <span @click="delectBtnSeleted">删除</span>
                        </li>
                        <li>
                            <!-- <span @click="goToAddGoods">
                                <img src="../../static/img/buycarRetrun.png" alt="">
                                继续添加  
                            </span> -->
                        </li>
                        <li>
                            <button @click="goToOrderAccount">结算</button>
                        </li>
                        <li>
                            <span>合计(不含运费):</span>
                            <span class="numbercolor">¥{{getTotalPrice | money}}</span>
                        </li>
                        <li>
                            <div>
                                已选商品 : <span class="numbercolor">{{getTolalCount}}</span> 件
                            </div>
                        </li>
                    </ul>
                
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import inputnumber from '../components/subcomponents/inputnumber.vue';
    import orderStep from "../components/subcomponents/orderStepByBuycar.vue";
    import {mapActions} from "vuex";
    import '../lib/filter.js'//格式化金额（保留两位小数）过滤器
    export default{
        data(){;
            return {
                StepActive:{
                    stepOne:false,
                    stepTwo:false,
                    stepThr:true,
                    stepFou:false,
                    stepFive:false,
                    },
                goodslist:[
                ],
                checkbox:true,// 双向绑定checked数据数组
               emptyStats:false, 
            }
        },
        components:{
            inputnumber,
            orderStep,
        },
        computed:{
            getTotalPrice() {
                let totalPrice = 0;
                this.goodslist.forEach(item => {
                    if (item.isSelected) {
                    totalPrice += item.quantity * item.price;
                    }
                });
                return totalPrice;
            },
            getTolalCount() {
                let totalCount = 0;
                this.goodslist.forEach(item => {
                    if (item.isSelected) {
                        totalCount += item.quantity;
                    }
                });
                return totalCount;
            },
        },
        created(){
            this.getgoodslist();  
        },
        methods:{
            ...mapActions(["setBuyCount"]),
            
            getTotalcount(){
                const localGoods = JSON.parse(localStorage.getItem("goods"));
                // 先定义 totalcount数量为0;
                let Totalcount = 0;
                for (const keys in localGoods){
                    Totalcount += localGoods[keys]
                }
                this.setBuyCount(Totalcount);
            },
            getgoodslist(){
                //获取购物车的列表；
                this.$http.post('/custom/cart/getList').then((res) =>{
                    if(res.data.code==200) {
                        this.goodslist=res.data.data||[];
                        // console.log(res.data.data);
                        if(this.goodslist !=''){
                           this.emptyStats=true; 
                        }else{
                           this.emptyStats=false; 
                        }
                        const objgoods={}
                        //设置是否默认选中，及两数量和id存到本地；
                        this.goodslist.forEach((ele,index)=>{
                            this.$set(ele,'isSelected',true);
                            objgoods[ele.id] =ele.quantity;
                            // ele.file.fileUrl = ele.file.thumbnailUrl;
                        })
                        this.checkbox=true;//保证批量删除数据后全选框默认值true;
                        localStorage.setItem('goods',JSON.stringify(objgoods))
                        this.getTotalcount()
                    } else {
                         this.$message({
                            type: "error",
                            message: res.data.message
                        });
                    }
                })
            },
            checkAll(){ // 点击全选事件函数
                this.checkbox=!this.checkbox;
                this.goodslist.forEach(item=>{
                    item.isSelected =this.checkbox;
                })
            },
            checkOne(select,id){ // 点击单选事件函数
                // console.log(select);
                this.goodslist.forEach(item => {
                    if (item.id == id) {
                        item.isSelected =!item.isSelected;
                    }
                });
                var flag =true;
                for(var i=0;i<this.goodslist.length;i++){
                    if(!this.goodslist[i].isSelected){
                        flag=false;
                    }
                }
                this.checkbox=flag;  
            },
            //点击改变输入框的数量；
            getChangedNumber(changedGoods){
                const localGoods={}
                this.goodslist.forEach(item=>{
                    if(changedGoods.goodsId==item.id){
                        item.quantity = changedGoods.count;
                    }
                    localGoods[item.id]=item.quantity;
                })
                localStorage.setItem('goods',JSON.stringify(localGoods))
                this.getTotalcount(); 
            },
            //点击数量获取更新的价格；
            getChangePrice(changePrice){
                this.goodslist.forEach((ele,index)=>{
                    if(ele.id==changePrice.goodsId){
                        ele.price=changePrice.price
                    }  
                })
            },
            //删除单一商品；
            delectBtnOne(id,index){
                this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    let requestParams={
                        "ids":[id]
                    }
                    this.$http.post("/custom/cart/delete", requestParams).then(res => {
                        if (res.data.code == 200) {
                            this.$message({
                                type: "success",
                                message: res.data.message
                            });
                            this.getgoodslist();
                            window.scrollTo(0, 180);
                           } else {
                            this.$message({
                                type: "error",
                                message: res.data.message
                            });
                        }
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消删除'
                    });          
                });
            },
            //选择删除商品；
            delectBtnSeleted(){
                 this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    const ids=[]
                    for(var i=0;i<this.goodslist.length;i++){
                        if(this.goodslist[i].isSelected){
                            //获取本地参数，并删除本地的localstorage；   
                            ids.push(this.goodslist[i].id) 
                        }
                    } 
                    //获取商品ids的数组
                    let requestParams={
                        "ids":ids
                    }
                    this.$http.post("/custom/cart/delete", requestParams).then(res => {
                        if (res.data.code == 200) {
                            this.$message({
                                type: "success",
                                message: res.data.message
                            });
                            this.getgoodslist();
                            window.scrollTo(0, 180);
                           } else {
                            this.$message({
                                type: "error",
                                message: res.data.message
                            });
                        }
                    });
                });
            },
            goToAddGoods(){
                this.$router.push({path:"/auto-quotation"})
            },
            //跳转到结算页面；
            goToOrderAccount(){
                let tempArray = [];//临时储存数据id;
                for(var i=0;i<this.goodslist.length;i++){
                    if(this.goodslist[i].isSelected){  
                        tempArray.push(this.goodslist[i].id);
                    }
                } 
                this.$router.push({path:"/produce-order",query: { ids:tempArray.join(",")}})
            }
        },
    }

</script>

<style lang="less" rel="stylesheet/less" type="text/less" scoped>
    .numbercolor{
        color:#f84b4b;
        font-weight: bold;
    }
    .buyCar{
        padding: 30px 0;
        .table{
            width: 1200px;
            margin: 0 auto;
            .content{
                padding: 1px;
                .menu{
                    border: 1px solid #e2e2e2;
                    font-size: 12px;
                    >thead{
                        background-color: #f8f8f8;
                        tr{
                            width: 1196px;
                            line-height: 46px;
                            display: flex;
                            border-bottom: 1px solid #e2e2e2;
                            font-size: 14px;
                            font-weight: bold;
                            color: #333;
                            td:first-child{
                                flex: 1;
                            } 
                        }
                    }
                    >tbody{
                        tr{ 
                            width: 1196px;
                            // height: 210px;
                            display: flex;
                            align-items:center;
                            border-bottom: 1px solid #e2e2e2;
                            td:first-child{
                                flex: 1;
                                input{
                                    margin:0 50px 0 0;
                                    padding: 0;
                                }
                            }
                            td:nth-child(2){
                                img{
                                    width: 167px;
                                    height: 167px;
                                }
                            }
                            td:nth-child(3){
                                padding: 11px 0;
                                line-height: 26px;
                                font-size: 14px;
                                color: #333;
                                >div{
                                    margin-left:44px; 
                                }
                            }
                        }
                    }
                }
                .accounts{
                    width: 1200px;
                    height: 58px;
                    background-color: #dfdfdf;
                    font-size: 14px;
                    ul{
                        height: 58px;
                        li{
                            margin:0 42px 0 10px; 
                            line-height: 58px;
                            float: left;
                        }
                        li:first-child{
                            position: relative;
                            margin-left:40px ;
                            cursor:pointer; 
                            input{
                                position: absolute;
                                top: 20px;
                                left: -20px;
                               
                            }
                        }
                        li:nth-child(2){
                            span{
                                cursor:pointer;
                            }
                        }
                        li:nth-child(3){ 
                            position: relative;
                            span{
                                margin-left:25px; 
                                color: #5dc0e8;
                                cursor:pointer;
                                img{
                                    position: absolute;
                                    top: 17px;
                                    left:0;
                                }
                            }
                            span:hover{
                                color: red;
                            }
                        }
                        li:nth-child(6){
                            float: right;
                             margin-right: 74px; 
                        }
                        li:nth-child(5){
                            float: right;
                            margin:0 100px 0 0;  
                        }
                        li:nth-child(4){
                            float: right;
                            margin:0px; 
                            >button{
                                cursor:pointer;
                                background-color: #f84b4b;
                                padding: 0;
                                border: #f84b4b;
                                font-size: 18px;
                                height: 58px;
                                width: 120px;
                                font-weight: bold;
                                color: #fff;
                            }
                        }
                    }
                }
            }
        }
    }
    .empty-con{
        width: 265.5px;
        height: 253px;
        margin: auto;
        padding-top:68px;
        box-sizing: border-box;
        .icon-container{
            float: left;
            text-align: center;
            img{
                width: 74px;
                height: 74px;
            }
        }
        .tip-container{
            overflow: hidden;
            text-align: left;
            padding-left: 22px;
            letter-spacing: 0.8px;
            margin-top: 15px;
            .empty-tip{
                display: block;
                font:400 17.5px/40px "Microsoft YaHei";  
            }
            .info-tip{
                font: 11.5px/16px "Microsoft YaHei";
                a{
                  color: #3f8def;
                  padding-left:5px;   
                }
            }
        }
    }
</style>




