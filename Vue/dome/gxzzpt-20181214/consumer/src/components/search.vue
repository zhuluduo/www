<template>
  <div class="case-search">
      <div class="left">
          <el-select v-model="ajaxData.id">
              <el-option v-for="(item,index) in list" :label="item.catalogName" :value="item.id" :key="index">

              </el-option>
          </el-select>
      </div>
      <div class="right">
          <el-input v-model="ajaxData.keyword" type="text" placeholder="请输入关键词搜索行业案例">
              <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="search"></i>
          </el-input>
      </div>
  </div>
</template>
<script>
export default {
  name: "az-search",
  data() {
    return {
      list: [],
      ajaxData: {
        id: "",
        keyword: ""
      }
    };
  },
  created() {
    this.getAllCatalog();
  },
  methods: {
    getAllCatalog() {
      this.$http.post("/custom/catalog/getCaseCatalog").then(res => {
        if (res.data.code == 200) {
          this.list = res.data.data;
          var item = {
            catalogName: "所有行业",
            id: ""
          };
          this.list.unshift(item);
        }
      });
    },
    search() {
      this.$router.push({
        path: "/case-result",
        query: {
          id:this.ajaxData.id,
          keyword:this.ajaxData.keyword,
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
.case-search {
  width: 100%;
  height: 76px;
  background: #f5f5f5;
  padding: 0px 18px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  .left {
    width: 122px;
  }
  .right {
    flex: 1;
    margin-left: 28px;
  }
}
</style>
