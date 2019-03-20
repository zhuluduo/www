<template>
  <div>
      首页
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      var res1 = await this.getAll();
      var res2 = await this.getWords();
    },
    getWords(){
      return this.$http.post("/getWords").then(res=>{
        return res.data.data;
      })
    },
    getAll() {
      return this.$http.post("/operation/materialCatalog/getAll").then(res => {
        return res.data.data;
      });
    }
  }
};
</script>
<style lang="less" scoped>

</style>
