<template>
  <div class="detail">
        <div class="nav-title">
          <div class="nav" @click="$router.push({path:'/case-list'})">{{moduleName}}</div>
          <div>&gt;</div>
          <div>{{detail.title}}</div>
          <div>&gt;</div>
          <div>详情</div>
        </div>
        <div class="content">
          <p class="title">{{detail.title}}</p>
          <div class="content-img">
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
      id: "",
      moduleName: "",
      detail: {}
    };
  },
  computed: {},
  created() {
    var id = this.$route.query.id;
    var moduleName = this.$route.query.name;
    this.moduleName = moduleName;
    this.id = Number(id);
    this.getDetail();
  },

  filters: {},

  methods: {
    getDetail() {
      this.$http.post("/custom/information/get", { id: this.id }).then(res => {
        if (res.data.code == 200) {
          this.detail = res.data.data;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.nav-title {
  margin-top: 20px;
  display: flex;
  > div {
    & + div {
      margin-left: 5px;
    }
  }
}
.content {
  margin: auto;
  margin-top: 77px;
  width: 938px;
  .title {
    font-size: 24px;
    color: #333;
    text-align: center;
    font-weight: bold;
  }
  .content-img {
    width: 805px;
    height: 509px;
    margin: auto;
    margin-top: 52px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .content-text {
    margin-top: 72px;
    p,
    div,
    span {
      line-height: 28px;
      font-size: 14px;
      color: #333;
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
