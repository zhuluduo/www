<template>
  <div class="list">
        <div class="list-item" v-for="(ele,index) in list" :key="index">
            <p class="title" v-html="ele.hName"></p>
            <ul class="content">
                <li v-for="(item,i) in ele.informationList" :key="i"  @click="$router.push({path:'/case-detail',query:{id:item.id,name:ele.catalogName}})">
                    <div>
                        <img :src="item.coverPicturl" alt="图片加载失败">
                    </div>
                    <p v-html="item.hTitle"></p>
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
      list: [],
      ajaxData: {
        id: "",
        keyword: ""
      }
    };
  },
  computed: {},
  created() {
    this.ajaxData.id = this.$route.query.id;
    this.ajaxData.keyword = this.$route.query.keyword;
    this.getList();
  },

  watch: {
    $route: function() {
      this.ajaxData.id = this.$route.query.id;
      this.ajaxData.keyword = this.$route.query.keyword;
      this.getList();
    }
  },

  methods: {
    getList() {
      this.$http
        .post("/custom/catalog/getCaseList", this.ajaxData)
        .then(res => {
          if (res.data.code == 200&&res.data.data) {
            this.list = res.data.data;
            var regexp = new RegExp(this.ajaxData.keyword);
            this.list.map(ele=>{
              var name = ele.catalogName.replace(regexp,`<span class="keyword">${this.ajaxData.keyword}</span>`);
              this.$set(ele,"hName",name);
              ele.informationList.map(item=>{
                var str = item.title.replace(regexp,`<span class="keyword">${this.ajaxData.keyword}</span>`);
                this.$set(item,"hTitle",str);
              })
            })
          }else{
            this.list = [];
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
