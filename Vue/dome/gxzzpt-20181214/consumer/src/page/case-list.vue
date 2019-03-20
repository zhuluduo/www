<template>
  <div class="list">
        <div class="list-item" v-for="(ele,index) in list" :key="index">
            <p class="title">{{ele.catalogName}}</p>
            <ul class="content">
                <li v-for="(item,i) in ele.informationList" :key="i"  @click="$router.push({path:'/case-detail',query:{id:item.id,name:ele.catalogName}})">
                    <div>
                        <img :src="item.coverPicturl" alt="图片加载失败">
                    </div>
                    <p>{{item.title}}</p>
                </li>
            </ul>
        </div>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      showResult: false,
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
.list {
  margin-top: 52px;
  .list-item {
    & + .list-item {
      margin-top: 66px;
    }
    .title {
      font-size: 24px;
      color: #333;
      font-weight: bold;
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
          cursor: pointer;
          img {
            width: 100%;
            height: 100%;
          }
        }
        p {
          margin-top: 14px;
          font-size: 14px;
          color: #333;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
