<template>
  <div id="main">
    <el-container>
      <el-header id="header">智慧地球管理后台</el-header>
      <el-container>
        <el-aside id="nav">
          <div class="nav_L">
           <div id="navToggle" @click="collapseToggle(isCollapse)" ></div>
            <el-menu :unique-opened="true" :default-active="$route.path" theme="dark" router  class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
              <template v-for="(parent,index) in $router.options.routes" v-if="parent.menuShow">
                <el-submenu  v-if="!parent.leaf" :index="index+''"  class="navSelect">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span slot="title">{{parent.name}}</span>
                </template>
                <el-menu-item-group class="navSelectBox">
                  <el-menu-item v-for="child in parent.children" :key="child.path"  :index="child.path" v-if="child.menuShow">{{child.name}}</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <!-- 设置leaf: true后只会显示一个导航栏 -->
              <el-menu-item  v-if="parent.leaf" :index="index">
                <i class="el-icon-menu"></i>
                <span slot="title">导航二</span>
              </el-menu-item>
              </template>
            </el-menu>
          </div>
        </el-aside>
        <el-container class="content_box">
          <el-main class="container">
            <router-view></router-view>
          </el-main>
         <el-footer id="footer">Copyright © 2014 - 2018  <span>深圳爱致科技有限公司</span> 版权所有</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import Header from './../components/header.vue';
  export default {
    components: {
      'v-header': Header,
    },
    data() {
      return {
        isCollapse: false,
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleOpen(key, keyPath) {
        // console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        // console.log(key, keyPath);
      },
      //导航展开收起
      collapseToggle(val){
        let _this=this;
        if(val==false){
         _this.isCollapse=true;
         document.querySelector("#nav").style.width = 56+"px";
         document.querySelector(".content_box").style.marginLeft = 56+"px";
        }else{
          _this.isCollapse=false;
          document.querySelector("#nav").style.width = 200+"px";
          document.querySelector(".content_box").style.marginLeft =200+"px";
        }
      },
    },
    mounted() {
      document.querySelector("#nav").style.width = 200+"px";
    },

  }
</script>
<style lang='less'>
  *, *:before, *:after{
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
  }
  .pull-left{float: left!important;}
  .pull-right{float: right!important;}
  .pull-block{display: block!important;}
  .pull-top{margin-top: 20px!important;}
  #nav .navSelect{background-color: #017777}
  #nav .is-opened{background-color: #017777}
  #nav .el-menu{background-color: #006666!important;}
  .container{
    text-align: initial;
    line-height: initial;
  }
  .finallblock{width: auto!important;; display: inline-block!important;;}
</style>
<style scoped lang='less'>
    .container{line-height: 0!important;}
  /* 主体布局 */
 .container{background-color:#fff!important;text-align: left!important;}
 .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  /*菜单样式开始*/
    #navToggle{
    height: 35px;
    width: 100%;
    background: #31b7b726;
    color: #fff;
    text-align: center;
    line-height: 33px!important;
    font-size: 12px;
    cursor: pointer;
      &::before{
        content: '|||';
        color: #e2e2e2;
      }
      &:hover{
        background: #31b7b73d;
      }
    }
    #header{
    height:50px;
    width:100%;
    border-bottom: 1px solid #026f6f;
    box-sizing: border-box;
    background: #006666;
    padding-left: 50px;
    text-align: left;
    font-size: 18px;
    color: #fff;
    line-height: 60px;
    }
    #nav{
      width: 200px;
      height:100%;
      background-color: #006666!important;
      color: #fff;
      overflow: hidden;
      position: absolute;
      top: 60px;
      bottom: 0px;
      left: 0px;
      -webkit-transition: width .15s;
      -o-transition: width .15s;
      transition: width .15s;
      ul{
        color: #fff;
         li{
           color: #fff;
           i{color: #fff;}
           div{
              span{color: #fff;}
              background: red;
           }
         }
      }
    }
    .content_box{
      margin-left:200px;
    }
    /**底部*/
    #footer{
      width: 100%;
      height:30px!important;
      line-height: 30px;
      padding: 0!important;
      text-align: center;
      background-color: #f2f2f2;
      font-size: 15px;
       span{
         color: red;
         display: inline-block;
         padding: 0 5px;
       }
    }
</style>

