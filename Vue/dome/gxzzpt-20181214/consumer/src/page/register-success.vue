<template>
    <div id="register-success">
        <div class="crumb-bread">
            <span class="link" @click="$router.push({path:'/index'})">首页</span>
            <span class="right-arrow"><i class="el-icon-arrow-right"></i></span>
            <span class="curr">需求方注册</span>
        </div>
        <div class="content">
            <img src="../../static/img/success-img.png" alt="">
            <div class="success-title">恭喜您，企业{{user.companyName}}注册成功！</div>
            <div class="btn-box">
                <div class="blue-btn" @click="$router.push({path:'/manufacturer-library'})">寻找供应商</div>
                <div @click="$router.push({path: '/manual-quote', query:{techniqueType:530020}})">发布询盘</div>
           </div>
        </div>
          
        </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
export default {
    data() {
        return {
            companyName: '',
            username:''
        }
    },
    computed: {
        ...mapState({
            user: state => state.user,
        }),
    },
    created() {
    //    this.companyName = this.$route.query.companyName;
    //    this.username = this.$route.query.username;
        console.log(this.user);
    },
    methods:{

    }
}
</script>

<style lang="less">
#register-success{
    width: 1200px;
    margin: auto;
    .crumb-bread{
        height: 30px;
        line-height: 30px;
        .link{
            cursor: pointer;
            &:hover{
                color: #3f8def;
                text-decoration: underline;
            }
        }
        .right-arrow{
            margin: 0 5px;
        }
        .curr{
            color: #3f8def;
        }
    }
    .content{
        background: #fff;
        margin-bottom: 35px;
        padding-top: 165px;
    }
    img{
        display: block;
        width: 74px;
        height: 74px;
        margin: 0 auto;
    }
    .success-title{
        margin-top: 30px;
        font-size: 16px;
        text-align: center;
        font-weight: 700;
    }
    .btn-box{
        padding: 94px 0;
        display: flex;
        justify-content: center;
        div{
            width: 176px;
            height: 38px;
            border: 1px solid #3f8def;
            box-sizing: border-box;
            background: #3f8def;
            color: #fff;
            font-size: 14px;
            text-align: center;
            line-height: 38px;
            cursor: pointer;
            margin: 0 25px;
            border-radius: 4px;
        }
        .blue-btn{
            border: 1px solid #3f8def;
            background: #fff;
            color: #3f8def;
        }
    }
}
</style>
