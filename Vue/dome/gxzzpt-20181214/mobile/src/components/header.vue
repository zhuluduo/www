<template>
    <header id='head_top'>
        <div class="leftMenu" >
            <div v-if="!meta.logoShow" class="Arrows">
                <i class="iconfont icon-leftArrows" v-if="!meta.prohibitBack"  @click="goback"></i>
                <span v-if="!meta.logoShow" :class="{'prohibitBack':meta.prohibitBack}">{{meta.title}}</span>
            </div>
            <i v-else>
                <img src="../../static/img/tafook-log.png" alt="">
            </i>
        </div>
        <div class="menu" @click.stop.prevent="showMenue">
            <i class="iconfont icon-caidan"></i>
            <div class="menuBox" :class="{'loginMenubox':user.token}"  v-if="ishowMenu">
                <ul @click.stop>
                     <li  @click="$router.push({path:'/index'})">
                        <img src="../../static/img/index-home-icon.png" alt="">
                        <span>首页</span>
                    </li>
                    <li @click="$router.push({path:'/Enquiry'})">
                         <img src="../../static/img/index-inquiry-icon.png" alt="">
                        <span>最新询盘</span>
                    </li>
                    <li @click="$router.push({path:'/supplierLibrary'})">
                         <img src="../../static/img/index-supplier-icon.png" alt="">
                        <span>供应商</span>
                    </li>
                    <li @click="$router.push({path:'/productLibrary'})">
                        <img src="../../static/img/index-factory-icon.png" alt="">
                        <span>产品库</span>
                    </li>
                    <li  @click="$router.push({path:'/login'})" v-if="!user.token">
                        <img src="../../static/img/index-login-icon.png" alt="">
                        <span>登录</span>
                    </li>
                    <li @click="$router.push({path:'/register/entry'})" v-if="!user.token">
                        <img src="../../static/img/index-register-icon.png" alt="">
                        <span>注册</span>
                    </li>
                    <li @click="$router.push({path:'/logout'})" v-if="user.token">
                        <img src="../../static/img/logout-icon.png" alt="">
                        <span>退出账号</span>
                    </li>
                </ul>
            </div>
        </div>
    </header>
</template>

<script>
    export default {
    	data(){
            return{
                ishowMenu:false,
                user:'',
            }
        },
        created() {
            this.user=this.$LocalStorage.gxzzpt2_mobile();
        },
        watch:{
            $route(to,from){
                this.ishowMenu=false;
            }
        },
        mounted(){
            this.bodyClick()
        },
        //又home父组件触发传递的参数;
        props: ['meta'],
        methods: {
            showMenue(){
                this.ishowMenu=!this.ishowMenu;
                //点击触发,保证点击判断是否需要登陆;
                this.user=this.$LocalStorage.gxzzpt2_mobile()
            },
            bodyClick(){
                let EleBody=document.getElementsByTagName('body')[0];
                EleBody.addEventListener('click',()=>{
                    this.ishowMenu=false;
                })
            },
            goback(){
                 this.$router.goBack()
            }
        },

    }

</script>

<style lang="scss" scoped>
    #head_top{
        z-index: 100;
        position: fixed;
        display: flex;
        justify-content: space-between;
        height: 100px;
        width: 100%;
        top: 0px;
        left: 0px;
        z-index:8888;
        padding: 27px 20px;
        line-height: 46px;
        background-color: #fff;
        box-shadow: 0px 3px 4px 0px rgba(0, 0, 0, 0.06);
        .leftMenu{
            .Arrows{
                font-size: 36px;
                position: relative;
                .icon-leftArrows{
                    position: absolute;
                    width: 200px;
                    font-size: 36px;
                    height: 46px;
                }
                .icon-leftArrows:before{ 
                    line-height: 48px;
                }
                >span{
                    padding-left:44px; 
                }
                .prohibitBack{
                   padding:0px;  
                }

            }
            i{
                display: inline-block;
                width: 260px;
                height: 46px;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
        .menu{
            i{
                display: inline-block;
                text-align: right;
                font-size: 36px;
                width: 100px;
            }
            .menuBox{
                position:absolute;
                width: 246px;
                height: 528px;
                z-index: 9999;
                background-color: #fff;
                top: 106px;
                right: 20px;
                box-shadow: 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
                ul{
                    padding-left: 36px;
                    height: 100%;
                    display: flex;
                    flex-direction:column ;
                    justify-content: space-around;
                    li{
                        display: flex;
                        align-items: center;
                        span{
                             font-size: 30px;
                             margin-left: 10px;
                        }
                        img{
                            width: 30px;
                            height: 30px;
                        }
                    }
                }

            }
            .loginMenubox{
                height: 352px;
            }
        }
    }

</style>
