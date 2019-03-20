<template>
<div>
    <div id="logout">
        <div class="content">
            <div class="message">退出账号后，再次访问时您需要重新登录。</div>
            <v-btn @click="logout" :btnName="'退出账号'"></v-btn>
            <div class="to-index" @click="$router.push({path:'/index'})">回首页</div>
        </div>
    </div>
</div>
</template>
<script>
import btn from '../components/submitBtn'
import LoginService from '../services/LoginService.js'
import { Toast } from 'mint-ui'
export default {
    components:{
        'v-btn' :btn
    },
    methods: {
        async logout() {
            let res = await new LoginService().exit();
            if ( res.code == 200 ) {
                Toast({message:'您已退出当前账号'});
                this.$router.push({path:'/login'});
            } else {
                Toast({message:res.message});
            }
        }
    }
}
</script>

<style lang="scss">
#logout{
    background: #f1f1f1;
    padding-top: 10px;
    .content{
        background: #fff;
        padding: 19px 20px 0 20px;
        .message{
            padding: 88px 0 116px 0;
            text-align: center;
            font-size: 28px;
        }
        .to-index{
            padding: 88px 0 85px 0;
            text-align: center;
            font-size: 28px;
            color: #3f8def;
        }
    }
}
</style>
