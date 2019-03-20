<template>
  <div class="detail">
        <!-- <div class="nav-title">
          <div class="nav" @click="$router.go(-1)">{{name}}</div>
          <div>&gt;</div>
          <div>{{detail.title}}</div>
          <div>&gt;</div>
          <div>详情</div>
        </div> -->
         <div class="bread-crumb"><span class="pull-cursor" @click="$router.push({path:'/index'})">首页</span> > <span class="pull-cursor" @click="$router.go(-1)">{{moduleName}}</span> > <span class="Last_title">{{name}}</span></div>
        <div class="content pull-shadow">
          <p class="title">{{detail.title}}</p>
          <p class="time">{{detail.createTime}}</p>
          <div class="content-img" v-if="detail.coverPicturl">
            <img :src="detail.coverPicturl" alt="加载失败">
          </div>
          <div class="content-text" v-html="detail.content"></div>
        </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      id:"",
      name:"",
      moduleName:'',
      detail:{}
    };
  },
  computed: {},
  created() {
    var id = this.$route.query.id;
    var name = this.$route.query.name;
    this.moduleName= this.$route.query.moduleName;
    this.name = name;
    this.id = Number(id);
    this.getDetail();
  },

  filters: {},

  methods: {
    getDetail(){
      this.$http.post('/custom/information/get',{id:this.id}).then(res=>{
        if(res.data.code == 200){
          this.detail = res.data.data;
        }
      })
    }
  }
};
</script>
<style lang="less">
  .content-text{
    margin-top:28px;
    p,div,span{
      line-height: 28px;
      font-size: 12px;
      color: #777777;
    }
    p{line-height: 25px;}
    img{
      max-width: 370px;
      display:block;
      margin: auto;
      padding: 10px;
    }
  }
</style>

<style lang="less" scoped>
.pull-cursor{cursor: pointer;}
.pull-shadow{
box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
-webkit-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
-moz-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
}
.detail{
  width: 1200px;
  margin:auto;
//  padding-top:80px;
}
.nav-title{
  margin-top:20px;
  display: flex;
  >div{
    &+div{
      margin-left:5px;
    }
  }
}
.bread-crumb{
  margin:15px 0 10px 0;
  .Last_title{
    color: #3f8def;
  }
}
.content{
  width: 1200px;
  margin-top: 15px;
  margin-bottom: 60px;
  padding: 35px 130px;
  min-height:500px;
  background: #fff;
  .title,.time{text-align: center;}
  .title{
    font-size: 20px;
    color: #777777;
  }
  .time{color: #c1c1c1;margin-top: 8px;margin-bottom: 25px;}
  .content-img{
    width: 940px;
    text-align: center;
    margin:auto;
    img{
    max-width: 920px;
    width: auto;
    display: inline-block;
    }
  }
}
.nav {
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
}
</style>
