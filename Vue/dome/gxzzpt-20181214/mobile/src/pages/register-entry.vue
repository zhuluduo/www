<template>
<div>
    <div id="register-entry">
        <div class="content">
            <div class="entry provider-entry" @click="$router.push({path:'/register/provider'})">注册成为供应商</div>
            <div class="entry demander-entry" @click="$router.push({path:'/register/demander'})">注册成为需求方</div>
        </div>
    </div>
</div>
</template>
<style lang="scss" scoped>
#register-entry{
    background: #f1f1f1;
    padding-top: 20px;
    .content{
        background: #f1f1f1;
        padding: 0px 20px 0 20px;
        .entry{
            width: 100%;
            height: 296px;
            box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.06);
            font-size: 40px;
            line-height: 296px;
            border-radius: 20px;
            color: #fff;
            text-align: right;
            padding-right: 71px;
            &.provider-entry{
                background: #97c5ff url('../../static/img/provider-register.png') no-repeat 30px center;
                background-size: 266px 266px;
            }
            &.demander-entry{
                margin-top: 20px;
                background: #f8c366 url('../../static/img/demander-register.png') no-repeat 30px center;
                background-size: 266px 266px;
            }
        }
    }
}
</style>
