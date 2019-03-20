<template>
    <div id="success-page">
          <img src="../../static/img/success-img.png" alt="">
          <div class="success-title">需求提交成功</div>
          <div class="success-desc">供应商报价后系统将通过邮件通知您</div>
          <div class="btn-box">
            <div class="blue-btn" @click="$router.go(-1)">继续提交需求</div>
            <div @click="$router.push({path:'/usercenter/my-require'})">查看我发布的需求</div>
            <div @click="$router.push({path:'/index'})">回到首页</div>
          </div>
        </div>
</template>
<script>
export default {
    methods:{

    }
}
</script>

<style lang="less">
#success-page{
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
    }
    .success-desc{
        margin: 25px 0 64px;
        font-size: 16px;
        color: #a4a4a4;
        text-align: center;
    }
    .btn-box{
        padding: 94px 0;
        display: flex;
        justify-content: center;
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
            margin: 0 25px;
        }
        .blue-btn{
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
