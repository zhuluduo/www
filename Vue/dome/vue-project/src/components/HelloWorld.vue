<template>
<el-container>
    <el-header>Header</el-header>
  <el-container>
    <el-aside width="200px">
    <el-menu :default-active="$route.path" theme="dark" router>
    <template v-for="(parent,index) in $router.options.routes" v-if="parent.menuShow">
        <el-submenu v-if="!parent.leaf" :index="index+''">
        <template slot="title"><i :class="parent.iconCls"></i>{{parent.name}}</template>
          <el-menu-item v-for="child in parent.children" :key="child.path"  :index="child.path" v-if="child.menuShow">{{child.name}}</el-menu-item>
      </el-submenu>
      <!-- 设置leaf: true后只会显示一个导航栏 -->
          <el-menu-item v-else-if="parent.leaf&&parent.children&&parent.children.length" :index="parent.children[0].path" class="el-submenu__title">
              <i :class="parent.iconCls"></i>{{parent.children[0].name}}
            </el-menu-item>
     <!-- 设置leaf: true后只会显示一个导航栏 -->
    </template>
    </el-menu>
    </el-aside>
    <el-container>
      <el-main>
          <router-view></router-view>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</el-container>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

/*li {
  display: inline-block;
}*/

a {
  color: #42b983;
}
.el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
    text-align: center;
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
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
    .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
  }
</style>
