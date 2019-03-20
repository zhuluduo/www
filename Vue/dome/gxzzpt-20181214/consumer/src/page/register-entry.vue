<template>
    <div id="register-entry">
        <div class="content">
            <div class="page-title">注册</div>
            <div class="register-wrapper">
                <div class="register-item provider">
                    <div class="title">注册成为供应商</div>
                    <img src="../../static/img/provider-register.png" alt="">
                    <div class="btn" @click="$router.push({path:'/register/provider'})">立即注册</div>
                </div>
                <div class="register-item demander">
                    <div class="title">注册成为需求方</div>
                    <img src="../../static/img/demander-register.png" alt="">
                    <div class="btn" @click="$router.push({path:'/register/demander'})">立即注册</div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="less">
#register-entry{
    .content{
        width: 1200px;
        margin: 0 auto;
        height: 670px;
        .page-title{
            width: 52px;
            height: 38px;
            font-size: 20px;
            line-height: 38px;
            color: #3f8def;
            border-bottom: 4px solid #3f8def;
            padding-bottom: 5px;
            margin-top: 26px;
        }
        .register-wrapper{
            margin-top: 65px;
            .register-item{
                width: 397px;
                height: 448px;
                float: left;
                background: #fff;
                cursor: pointer;
                .title{
                    font-size: 24px;
                    height: 24px;
                    line-height: 24px;
                    text-align: center;
                    margin-top: 35px;
                }
                img{
                    display: block;
                    width: 266px;
                    height: 157px;
                    margin: 57px auto 67px;
                }
                .btn{
                    width: 146px;
                    height: 44px;
                    font-size: 18px;
                    line-height: 44px;
                    text-align: center;
                    color: #3f8def;
                    margin: 0 auto;
                    background-color: #ffffff;
	                border-radius: 4px;
                    border: solid 1px #3f8def;
                    &:hover{
                        background: #3f8def;
                        color: #ffffff;
                    }
                }
            }
            .provider{
                margin-left: 147px;
            }
            .demander{
                margin-left: 83px;
            }
        }
    }
}
</style>
