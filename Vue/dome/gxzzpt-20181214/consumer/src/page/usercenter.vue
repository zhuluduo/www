<template>
  <div id="user-center"> 
    <div class="main">
      <el-container class="container">
        <el-aside width="112px" class="left">
          <v-menu></v-menu>
        </el-aside>
        <el-main class="right pull-shadow"  :class="(user.isManufacturer&&user.isDemand)?'Df-height':''">
            <keep-alive >
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
import menu from "../components/leftMenu";
export default {
  components: {
    "v-menu": menu
  },
  data() {
    return {
      currentMenu: "/usercenter/my-require",
      opeState:true,
    };
  },
  watch: {
    '$route' (to, from ) {
      if(to.path=='/usercenter/my-resume'){
        to.meta.keepAlive = true
      }else{
        to.meta.keepAlive = false
      }
    }
  },
  created() {
    this.user=this.$LocalStorage.gxzzpt2_consumer();
  },
  mounted() {
    this.currentMenu = this.$route.path;
  },
};
</script>
<style lang="less" scoped>
@common-color: #3f8def;
#user-center {
  background: #f5f5f5;
  padding-bottom: 55px;
  .el-aside, .el-main{
    overflow: visible;
  }
  .main {
    padding-top: 51px;
    width: 1200px;
    margin: auto;
    box-sizing: border-box;
    .right {
      display: block;
      min-height: 650px;
      padding: 0 16px;
      margin-left: 9px;
      background: #fff;
      position: relative;
      overflow: visible;
      padding-bottom: 30px;
    }
  }
  
}

</style>
