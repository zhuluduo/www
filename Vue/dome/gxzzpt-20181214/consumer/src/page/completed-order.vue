<template>
  <div class="completed-order">
        <img src="../../static/img/success-img.png" alt="">
        <div class="success-title">已确认收货，订单已完成！</div>
        <div class="btn-box">
            <div @click="$router.go(-1)">返回订单列表</div>
            <div class="blue-btn"  @click="GoEvaluate" >去评价</div>
            <!-- <div class="blue-btn" @click="$router.push({path:'/usercenter/my-require'})">去评价</div> -->
        </div>
  </div>
</template>
<script>
export default{
    data(){
        return {
            val:{
                orderId:this.$route.query.orderId,
                companyId:this.$route.query.companyId,
                type:this.$route.query.type,
                userId:this.$route.query.userId,
            }
        }
    },
    // created(){
    //     this.val.orderId=this.$route.query.orderId;
    //     this.val.companyId=this.$route.query.companyId;
    //     this.val.userId=this.$route.query.userId;
    //     this.val.type=this.$route.query.type;
    // },
    methods:{
        //去评价
        GoEvaluate(){
            if(this.val.companyId !=this.val.userId){
                this.$router.push({path: '/usercenter/evaluate',query: { orderId:this.val.orderId, companyId: this.val.companyId, type:1}})
            }else{
                this.$message({
                    type: "warning",
                    message:'请勿自评价'
                })
            }
        },
    }
  }

</script>
<style lang="less" rel="stylesheet/less" type="text/less" scoped>
.completed-order{
    width: 1200px;
    margin: 0 auto;
    padding-top: 148px;
    img{
        display: block;
        margin: 0 auto;
    }
    .success-title{
        margin-top: 30px;
        font-size: 24px;
        color: #3f8def;
        font-weight: 700;
        text-align: center;
        padding-bottom: 64px;
    }
    .btn-box{
        padding: 94px 0;
        display: flex;
        justify-content: center;
        border-top: 1px dashed #c4c4c4;
        div{
            
            width: 160px;
            height: 44px;
            border: 1px solid #c2c2c2;
            box-sizing: border-box;
            font-size: 16px;
            color: #929292;
            text-align: center;
            line-height: 44px;
            cursor: pointer;
        }
        .blue-btn{
            margin-left:160px; 
            border: 1px solid #3f8def;
            color: #3f8def;
            &:hover{
                background: #3f8def;
                color: #fff;
            }
        }
    }
}
</style>
