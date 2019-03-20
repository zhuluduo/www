<template>
  <div class="case">
    <az-search></az-search>
    <router-view></router-view>
    <!-- <div class="list">
        <div class="list-item" v-for="(ele,index) in list" :key="index">
            <p class="title">{{ele.catalogName}}</p>
            <ul class="content">
                <li v-for="(item,i) in ele.informationList" :key="i">
                    <div>
                        <img :src="item.coverPicturl" alt="图片加载失败">
                    </div>
                    <p>{{item.title}}</p>
                </li>
            </ul>
        </div>
    </div>
    <div class="result" v-show="showResult"></div> -->
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      list: []
    };
  },
  computed: {},
  created() {
    this.getList();
  },

  filters: {},

  methods: {
    getList() {
      this.$http.post("/custom/catalog/getCaseList").then(res => {
        if (res.data.code == 200) {
          this.list = res.data.data;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.case {
  margin: auto;
  margin-top: 114px;
  width: 1200px;
  min-height: 500px;
}
.list {
  margin-top: 52px;
  .list-item {
    & + .list-item {
      margin-top: 66px;
    }
    .title {
      font-size: 24px;
      color: #333;
      font-weight: 500;
    }
    .content {
      margin-top: 19px;
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      > li {
        width: 224px;
        box-sizing: border-box;
        margin-left: 20px;
        &:nth-child(5n + 1) {
          margin-left: 0px;
        }
        &:nth-child(n + 6) {
          margin-top: 42px;
        }
        > div {
          border: 1px solid #ddd;
          height: 170px;

          img {
            width: 100%;
            height: 100%;
          }
        }
        p {
          margin-top: 14px;
          font-size: 14px;
          color: #333;
        }
      }
    }
  }
}
</style>
