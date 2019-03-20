<template>
<div id="main">
  <div class="header">
    <div class="header-left"></div>
    <div class="header-right">
      <div class="el-icon-bell message"  @click="$router.push({path:'/main/sys-message'})">
          <span v-if="count>0"  v-bind:class="{CountMessage:true,CountMore:count>99}">{{count>99?"99+":count}}</span>
      </div>
      <div class="user-name">欢迎您，{{user.userName}}</div>
      <a href="#" class="exit-btn" @click="logout()">退出</a>
    </div>
  </div>
  <div class="main">
    <div class="main-left">
      <div class="menu">
        <div class="menu-content">
        <el-menu theme="dark" router :default-active="expand"
                  background-color="#26354d"
                  text-color="#fff"
                  active-text-color="#409EFF">
            <el-menu-item index="/main/index">
              <i class="el-icon-menu"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu :index="String(menuItem.groupId)" v-for="(menuItem,index) in menuList" :key="index">
                <template slot="title">
                    <i class="el-icon-menu"></i>
                    <span>{{menuItem.groupName}}</span>
                </template>
                <el-menu-item v-for="(subMenu,index) in menuItem.menu" :key="index" :index="String(subMenu.entrance)" :route="{path:subMenu.entrance}">{{subMenu.menuName}}</el-menu-item>
            </el-submenu>
        </el-menu>
        </div>
      </div>
    </div>
    <div class="main-right">
      <div id="mainContent" class="main-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { mapActions } from "vuex";
import { bus ,Message} from "../lib/common.js"//引入公共的BUS组件;
export default {
  components: {},
  data() {
    return {
      userName: "",
      expand: "/main/index",
      user: {},
      menuList: '',
      count:'',
      timer:'',
      ajaxData: {
        pageIndex: 1,
        pageSize: 5,
        // keyWord: ""
      },
    };
  },
  watch: {}, 
  created() {
    this.expand = this.$route.path;
    this.getWorks();
    var user = JSON.parse(window.localStorage.getItem("operation_user"));
    if (user) {
      this.user = user;
    } else {
      this.$alert('用户未登录', '', {
          confirmButtonText: '确定',
          callback: action => {
            setTimeout(() => {
              this.$router.push({
                path:"/login"
              })
            }, 300);
          }
        });
    }
    this.getMenuList();
    //非父组件传值 监听；
    bus.$on(Message,(Num) => {
        this.count =Num;   
    });
    //进入页面查新一下数量，然后轮询;
    this.getMessageCount();
    this.timer = setInterval(() => {
      this.getMessageCount();
    },1000*60);
  },
  //组件销毁前清除计时器；
  beforeDestroy() {
    clearTimeout(this.timer)
  },
  mounted() {},
  methods: {
    logout() {
        this.$http.post('/exit').then((res) => {
          if (res.data.code == 200) {
            this.login = false;
            this.showBox = false;
            localStorage.setItem("operation_user","");
            this.$router.push({ path: "/login" });
          }
        });
    },
    ...mapActions(["setDic"]),
    getWorks() {
      this.$http.post("/getWords").then(res => {
        this.setDic(res.data.data);
        if (res.data.code == 200) {
          localStorage.setItem("words", JSON.stringify(res.data.data));
        }
      }).catch(res => {});
    },
    getMenuList() {
      this.$http.post('/getOperationMenuList').then((res) => {
        if ( res.data.code == 200 ) {
          this.menuList = res.data.data;
        } else {
          this.$error(res.data.message);
        }
      })
    },
    getMessageCount() {
      this.$http.post('/operation/message/updateMessage', this.ajaxData).then(( res ) => {
          if (res.data.code == 200) {
              let messageCount =res.data.unreadCount;
              this.count=messageCount;
          }
      })
    },
  }
};
</script>
<style lang="less" scoped>
@common-color: #20a0ff;
// 菜单图标
#main {
  .header {
    position: fixed;
    z-index: 1099;
    width: 100%;
    height: 44px;
    border-bottom: 1px solid @common-color;
    box-sizing: border-box;
    background: #fff;
    .header-left {
      width: 277px;
      height: 100%;
      color: @common-color;
      display: inline-block;
      font-size: 30px;
      background-image: url(../../static/img/logo.png);
      background-size: 169px 30px;
      background-repeat: no-repeat;
      background-position: center;
    }
    .header-right {
      float: right;
      position: relative;
      // width: 200px;
      height: 100%;
      margin-right: 50px;
      display: flex;
      align-items: center;
      font-size: 14px;
      justify-content: flex-end;
      .exit-btn {
        color: @common-color;
        margin-left: 20px;
        &:hover {
          text-decoration: underline;
        }
      }
      .message{
        margin-right: 100px;
        font-size: 24px;
        cursor: pointer;
        position: relative;
        .CountMessage{
          position: absolute;
          left: 15px;
          top: -5px;
          width: 20px;
          height: 20px;
          border-radius: 10px;
          text-align: center;
          background-color: #ff0000;
          color: #fff;
          font-size: 12px;
          line-height: 20px;
        };
        .CountMore{
          width: 30px; 
        }
      }
    }
  }
  .main {
    .main-left {
      position: fixed;
      z-index: 999;
      height: 100%;
      background: #fff;
      overflow: hidden;
      width: 210px;
      .menu {
        position: absolute; 
        overflow-x: hidden;
        overflow-y: auto;
        width: 230px;
        height: 100%;
        .menu-content {
          padding-top:44px; 
          position: relative;
          box-sizing: border-box;
          -moz-box-sizing: border-box;
          background-color: #26354d;
          width: 200px;
          height: 100%;
        }
      }
    }
    .main-right {
      padding: 44px 0 0 200px;
      width: 100%;
      height: 100%;
      position: relative;
      border-left: 1px solid #eee;
      box-sizing: border-box;
      background: #eee;
      overflow: hidden;
      .main-content {
        background: #fff;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: auto;
        padding: 0 36px;
        box-sizing: border-box;
      }
    }
  }
}
</style>
