<template>
  <el-row class="container">
    <!--头部-->
    <el-col :span="24" class="topbar-wrap">
      <div class="topbar-logo topbar-btn">
        <a href="/adm"><img src="../assets/logo.png" style="padding-top: 15px;padding-bottom: 6px;"/></a>
      </div>
      <div class="topbar-account topbar-btn padding_topbar">
        <el-dropdown>
          <span class="el-dropdown-link userinfo-inner padding-top-bottom"><i class="iconfont icon-user"></i>{{user.username}}<i class="iconfont icon-down"></i></span>
          <el-dropdown-menu slot="dropdown">
            <!--<el-dropdown-item><router-link to="/user/profile">个人信息</router-link></el-dropdown-item>
            <el-dropdown-item><router-link :to="'/user/changepwd'">修改密码</router-link></el-dropdown-item>-->
            <el-dropdown-item @click.native="logout">
              <i class="iconfont icon-logout" style="font-weight: bold;"/><span v-html="logoutBtnText"/>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div v-if="user.appLink!=''" class="topbar-alert topbar-btn padding_topbar">
        <a class="padding-top-bottom" v-bind:href="user.appLink"><i class="iconfont icon-jfun-download"/>下载收银APP</a>
      </div>
     <!-- <div class="topbar-alert topbar-btn padding_topbar">
        <a class="padding-top-bottom" v-bind:href="user.appLink"><i class="iconfont icon-jfun-download"/>下载收银APP</a>
      </div>-->
      <!--<div class="topbar-alert topbar-btn padding_topbar">
        <router-link :to="{path: '/inventory/warning'}" class="tpl-header-list-link padding-top-bottom">
          &lt;!&ndash;<img src="../assets/images/kucunyujing3.png" alt="" class="am-img-bell-o">&ndash;&gt;
          <i class="iconfont icon-inventory-warning"></i>库存预警
          <span class="am-badge tpl-badge-success am-round">12&lt;!&ndash;{{author}}&ndash;&gt;</span>
        </router-link>
      </div>
      <div class="topbar-alert topbar-btn padding_topbar">
        <router-link :to="{path: '/product/warning'}" class="tpl-header-list-link padding-top-bottom">
          &lt;!&ndash;<img src="../assets/images/guoqi.png" alt="" class="am-img-bell-o">&ndash;&gt;
          <i class="iconfont icon-product-warning"></i>过期预警
          <span class="am-badge tpl-badge-success tpl-badge-danger am-round">12&lt;!&ndash;{{author}}&ndash;&gt;</span>
        </router-link>
      </div>-->

    </el-col>

    <!--中间-->
    <el-col :span="24" class="main">
      <!--左侧导航-->
      <aside :class="collapsed?'menu-collapsed':'menu-expanded'">

        <!--展开折叠开关-->
        <div class="menu-toggle" @click.prevent="collapse">
          <i class="iconfont icon-menu" v-show="!collapsed"/>
          <i class="iconfont icon-menu" v-show="collapsed"/>
        </div>

        <!--菜单展开时的显示情况-->
        <el-menu v-show="!collapsed" class="scrollbar" default-active="0" @open="handleOpen" @close="handleClose" router unique-opened>
          <template v-for="(parent,index) in $router.options.routes" v-if="parent.menuShow">
            <el-submenu v-if="!parent.leaf" :index="index+''">
              <template slot="title"><i :class="parent.iconCls"></i>{{parent.name}}</template>
              <el-menu-item v-for="child in parent.children" :key="child.path" :index="child.path" v-if="child.menuShow">
                {{child.name}}
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-else-if="parent.leaf&&parent.children&&parent.children.length" :index="parent.children[0].path" class="el-submenu__title">
              <i :class="parent.iconCls"></i>{{parent.children[0].name}}
            </el-menu-item>
          </template>
        </el-menu>

        <!--菜单折叠后的显示情况-->
        <ul v-show="collapsed" class="el-menu collapsed" ref="menuCollapsed">
          <template v-for="(parent,index) in $router.options.routes" v-if="parent.menuShow">
            <li v-if="!parent.leaf" :index="index+''" style="position: relative;">
              <div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="parent.iconCls"></i></div>
              <ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)">
                <li v-for="child in parent.children" :key="child.path" v-if="child.menuShow" class="el-menu-item" style="padding-left: 40px;" :class="$route.path==child.path?'is-active':''"
                    @click="$router.push(child.path)">{{child.name}}</li>
              </ul>
            </li>
            <li v-else-if="parent.leaf&&parent.children&&parent.children.length" class="el-menu-item el-submenu__title" :class="$route.path==parent.children[0].path?'is-active':''" @click="$router.push(parent.children[0].path)">
              <i :class="parent.iconCls"></i>
            </li>
          </template>
        </ul>

      </aside>

      <!--右侧内容区-->
      <section class="content-container scrollbar">
        <el-row class="grid-content bg-purple-light">
          <el-col :span="24" class="content-wrapper">
            <transition name="fade" mode="out-in">
              <router-view></router-view>
            </transition>
          </el-col>
        </el-row>
      </section>
      <footer>
        <a href="http://www.izjjf.cn/">深圳市转角街坊网络科技有限公司</a>  |  粤ICP备14043041号-2  |  系统版本V{{sysVersion}}
      </footer>
    </el-col>

  </el-row>
</template>

<script>
  import { bus } from '../bus.js'
  export default {
    data () {
      return {
        sysVersion:bus.sysVersion,
        logoutBtnText:'&emsp;注&emsp;销&emsp;',
        user:{},
        collapsed: false,
      }
    },
    methods: {
      handleOpen() {
        //console.log('handleopen');
      },
      handleClose() {
        //console.log('handleclose');
      },
      //折叠导航栏
      collapse: function () {
        this.collapsed = !this.collapsed;
      },
      showMenu(i, status){
        this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-' + i)[0].style.display = status ? 'block' : 'none';
      },
      /*注销*/
      logout(){
        this.$axios.get(bus.host+'/admin/logout?_='+new Date().getTime()).then(res=>{
          if(!res.data.success) throw res;
          let self = this;
          this.$notify({
            message: '注销成功！',
            type: 'success',
            duration: 300,
            onClose: function () {
              sessionStorage.removeItem('currentUser');
              self.$router.push('/login');
            }
          });
        }).catch(err=>{
          this.$notify({
            message: err.data.msg,
            type: 'error'
          });
        });
      }
    },
    mounted() {
      this.user=JSON.parse(sessionStorage.getItem('currentUser'));
    }
  }


</script>
<style>
  .content-footer{
    text-align: center;
    background-color: #ffffff !important;
    position: fixed;
    bottom:0px;
    margin-left:-10px;
    font-size:14px;
    padding-bottom:5px;
  }
  .content-footer,.content-footer>a{
    color: #bcbcbc;
  }
  .grid-content{
    margin-bottom: 15px;
  }
  .padding-top-bottom{
    padding-top:20px;
    padding-bottom: 20px;
    font-size:14px;
  }
  .el-submenu__title {
    height: 50px;
    line-height: 50px;
    border-left:4px solid #4c4743;
  }
  .el-menu-item, .el-submenu__title {
    color: #fff;
    padding-left: 13px!important;
  }
  .el-submenu__title:hover {
    background-color: #383433;
  }
  .el-submenu .el-menu-item {
    height:40px;
    line-height: 40px;
    background-color: #423e3b;
    border-left:4px solid #423e3b;
    padding-left: 35px!important;
  }
  .el-submenu .el-menu-item:hover {
    background-color: #4A5064;
  }
  .el-submenu .el-menu-item.is-active, .el-menu-item.is-active,
  .el-submenu .el-menu-item.is-active:hover, .el-menu-item.is-active:hover {
    color: #fff;
    background-color: #383433;
    border-left:4px solid #ff7751;
  }
  .el-menu .iconfont{
    vertical-align: baseline;
    margin-right: 6px;
  }

  .warp-breadcrum{
    padding: 10px 0px;
    border-bottom: 1px solid #efefef;
  }
  .warp-main{
    padding-top: 20px;
  }

  /*自定义滚动条样式*/
  .el-table>el-table__header-wrapper>table,.scrollbar{overflow-y: auto;}
  .el-table>el-table__header-wrapper>table::-webkit-scrollbar-track,
  .scrollbar::-webkit-scrollbar-track{
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    background-color: #F5F5F5;
  }
  .el-table>el-table__header-wrapper>table::-webkit-scrollbar,.scrollbar::-webkit-scrollbar{
    width: 6px;
    background-color: #F5F5F5;
  }
  .el-table>el-table__header-wrapper>table::-webkit-scrollbar-thumb,.scrollbar::-webkit-scrollbar-thumb{
    background-color: #797675;
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;

    .topbar-wrap {
      height: 50px;
      line-height: 50px;
      background: #383531;
      padding: 0px;

      .topbar-btn {
        color: #fff;
      }
      .topbar-btn:hover {
        background-color: #5C5958;
      }
      .topbar-logo {
        float: left;
        text-align: center;
        width: 180px;
        /*border-right: 1px solid #000;*/
        line-height: 26px;
      }
      .topbar-title {
        float: left;
        text-align: center;
        width: 129px;
        border-right: 1px solid #000;
      }
      .topbar-alert,.topbar-account {
        float: right;
        margin-right: 10px;
      }
      .topbar-alert a{
        color: white;
      }
      .userinfo-inner{
        cursor: pointer;
        color: #fff;
        padding-left: 10px;
      }
    }
    .main {
      display: flex;
      position: absolute;
      top: 50px;
      bottom: 0px;
      overflow: hidden;
    }
    aside {
      background-color: #4c4743;
      flex: 0 0 180px;
      padding-bottom:30px;
      width: 180px;
      .el-menu {
        height: 100%;
        border-radius: 0px;
        background-color: #4C4743;
      }
      .collapsed {
        width: 50px;
        .submenu {
          position: absolute;
          top: 0px;
          left: 50px;
          z-index: 9999;
          height: auto;
          display: none;
        }
      }
    }
    footer{
      position: fixed;
      bottom: 0;
      width: 100%;
      color:#bcbcbc;
      font-size: 14px;
      text-align: center;
    }
    footer a{
      color:#bcbcbc;
    }
    .menu-collapsed {
      flex: 0 0 50px;
      width: 50px;
    }
    .menu-expanded {
      flex: 0 0 180px;
      width: 180px;
      .el-menu{
        width:100%!important;
      }
    }
    .menu-toggle {
      background: #5C5958;
      text-align: center;
      color: white;
      height: 28px;
      line-height: 28px;
    }
    .content-container {
      background: #fff;
      flex: 1;
      overflow-y: auto;
      padding: 10px;

      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
  .am-badge{
    display: inline-block;
    min-width: 10px;
    padding: .20em 0.625em;
    font-weight: 700;
    color: #fff;
    line-height: 1;
    vertical-align: baseline;
    white-space: nowrap;
    text-align: center;
  }
  .am-badge.am-round{border-radius: 100px}
  .tpl-badge-success{background-color: #ed6b75!important}
  .am-active{padding: 0 10px}
  .padding_topbar{padding: 0 12px;}
  .tpl-header-list-link img{vertical-align: middle;}
</style>
