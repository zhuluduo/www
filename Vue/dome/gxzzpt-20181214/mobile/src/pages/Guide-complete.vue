<template>
    <div id="Guide-complete">
        <div class="top">
            <img src="../../static/img/success-img.png" alt="">
        </div>
        <div class="center">恭喜您，完善资料成功！</div>
        <div class="bottom">
            <div  @click="$router.push({path:'/Enquiry'})">看询盘</div>
            <div  @click="$router.push({path:'/supplierLibrary'})">找工厂</div>
            <div  @click="$router.push({path:'/productLibrary'})">搜产品</div>
        </div>  
    </div>
</template>
<script>
import { MessageBox ,Toast } from 'mint-ui';
export default {    
    data() {
        return {
        

        };
    },
    created() {

    },
    components:{

    },
    methods: {

    }
}
</script>
<style lang="scss">
body{
    background-color: #fff;
}
#Guide-complete{
    background-color: #fff;
    margin-top: 10px;
    .top{
        padding-top:100px; 
        text-align: center;
        img{
            width: 200px;
            height: 200px;
        }
    }
    .center{
        padding-top: 58px;
        font-size: 32px;
        color: #6b6b6b;
        text-align: center;
    }
    .bottom{
        padding-top: 104px;
        display: flex;
        justify-content: space-around;
        font-size: 26px;
        >diV{
            width: 180px;
            height: 60px;
            line-height: 60px;
            border-radius: 6px;
            border: solid 1px #3f8def;
            text-align: center;
        }
    }
}
</style>
