<template>
  <div class="errPage-container">
    <el-row>
      <el-col :span="12" class="text-h">
        <h1 class="text-jumbo text-ginormous">Oops!</h1>
        <h2>您暂时没有权限访问该页面</h2>
        <ul class="list-unstyled">
          <li>或者你可以:</li>
          <li class="link-type">
            <router-link to="/dashboard"><<返回首页</router-link>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img src="../../assets/images/403.png" alt="Girl has dropped her ice cream.">
      </el-col>
    </el-row>

    <el-dialog title="随便看"  size="large">
      <img class="pan-img" src="../../assets/401.089007e.gif">
    </el-dialog>
  </div>
</template>

<script>

    export default {
        data() {
            return {

            }
        },
        methods: {
        }
    };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .errPage-container {
    width: 800px;
    margin:200px auto;
    .text-h{
      h2,h6{font-size: 1.5rem}
    }
    .pan-back-btn {
      background: #008489;
      color: #fff;
    }
    .pan-gif {
      margin: 0 auto;
      display: block;
    }
    .pan-img {
      display: block;
      margin: 0 auto;
    }
    .text-jumbo {
      font-size: 5rem;
      font-weight: 700;
      color: #484848;
    }
    .list-unstyled {
      font-size: 14px;
      li {
        padding-bottom: 5px;
      }
      a {
        color: #008489;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    img{width: 100%}
  }
</style>