<template>
    <div id="technical-zone">
        <div class="bread-crumb"><span class="pull-cursor" @click="$router.push({path:'/index'})">首页</span> > <span class="Last_title">新技术专区</span></div>
        <div class="content">
           <img src="../../static/img/technical_zone.png" alt="">
           <div>
            <span>正在努力开发中...</span>
            <h3>敬请期待!</h3>
           </div>
        </div>
    </div>
</template>
<style lang="less">
#technical-zone{
    width: 1200px;
    margin: auto;
    .bread-crumb{
    margin:15px 0 10px 0;
    .Last_title{
      color: #3f8def;
     }
    }
    .content{
        width: 550px;
        min-height: 700px;
        text-align: center;
        margin: auto;
        img{
            width: 280px;
            height:220px;
            margin-top: 200px;
        }
        img,div{float: left;}
        span,h3{display:block;}
        div{margin-top: 282px;margin-left: 50px}
        span{
            font-size: 16px;
            color: #777777;
            margin-bottom: 27px;
        }
        h3{
            font-size: 24px;
            color: #3f8def;  
        }
    }
}
</style>
