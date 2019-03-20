<template>
  <div class="baike">
    <ul class="nav">
      <li @click="changeTab(item)" :class="item.id==ajaxData.catalogId?'active':''" v-for="(item,index) in nav" :key="index">{{item.catalogName}}</li>
    </ul>
    <div class="search">
      <el-input type="text" v-model="ajaxData.keyword" placeholder="请输入关键字搜索">
        <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="search"></i>
      </el-input>
    </div>
    <ul class="table-list">
      <li class="list-item" v-for="(item,index) in tableData" :key="index" @click="goDetail(item)">
        <div class="left">
          <img :src="item.coverPicturl" alt="">
        </div>
        <div class="right">
          <div class="title">{{item.title}}</div>
          <div class="content" v-html="item.content"></div>
          <div class="time">{{item.createTime}}</div>
        </div>
      </li>
    </ul>
    <div class="pagination">
        <el-pagination @current-change="changePage" background layout="prev, pager, next" :page-count="pagination.pageCount" :current-page="pagination.currentPageIndex" :page-size="pagination.pageSize"></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      type:null,
      nav: [],
      tableData: [],
      ajaxData: {
        catalogId: "",
        keyword: "",
        moduleType:'',
        pageIndex: 1,
        pageSize: 5
      },
      pagination: {
        currentPageIndex: 1,
        pageSize: 5,
        pageCount: 0
      }
    };
  },
  created() {
    // this.getList();
    this.type = Number(this.$route.query.type);
    this.ajaxData.moduleType = this.type;
    this.getAllCatalog();
  },
  methods: {
    goDetail(item){
      var name = "";
      this.nav.map(ele=>{
        if(ele.id == this.ajaxData.catalogId){
          name = ele.catalogName;
        }
      })
      this.$router.push({path:'/crafts-detail',query:{id:item.id,name:name}})
    },
    changePage(p){
      this.ajaxData.pageIndex = p;
      this.getList();
    },
    changeTab(item) {
      // if(item.select) return;
      // this.nav.map(ele=>{
      //   ele.select = false;
      // })
      // item.select = true;
      if (this.ajaxData.catalogId == item.id) return;
      this.ajaxData.catalogId = item.id;
      this.getList();
    },
    search() {
      this.getList();
    },
    getAllCatalog() {
      this.$http.post("/custom/catalog/getMaterialWikiCatalog").then(res => {
        if (res.data.code == 200) {
          this.nav = res.data.data;
          var item = {
            catalogName:"全部",
            id:""
          }
          this.nav.unshift(item);
          this.ajaxData.catalogId = this.nav[0].id;
          this.getList();
        }
      });
    },
    getList() {
      this.$http
        .post("/custom/information/getWikiList", this.ajaxData)
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.data;
            this.pagination = res.data.pagination;
            // this.nav = res.data.data;
            // this.nav.map((ele,i)=>{
            //   if(i==0){
            //     this.$set(ele,"select",true)
            //   }else{
            //     this.$set(ele,"select",false)
            //   }
            // })
            // this.tableData = this.nav[]
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
@common-color: #3f8def;
.baike {
  margin: auto;
  margin-top: 114px;
  width: 1200px;
  min-height: 500px;
}
.nav {
  padding: 22px 20px;
  background: #f5f5f5;
  display: flex;
  flex-wrap: wrap;
  > li {
    height: 32px;
    width: 82px;
    text-align: center;
    line-height: 32px;
    overflow: hidden;
    cursor: pointer;
    & + li {
      margin-left: 48px;
    }
    &:nth-child(9n + 1) {
      margin-left: 0px;
    }
    &:nth-child(n + 10) {
      margin-top: 20px;
    }
  }
  .active {
    background: @common-color;
    color: #fff;
  }
}
.search {
  width: 254px;
  height: 36px;
  margin-top: 27px;
}
.table-list {
  width: 100%;
  margin-top: 13px;
  .list-item {
    padding: 20px 0px;
    height:185px;
    box-sizing: border-box;
    display: flex;
    border-bottom: 1px solid #e2e2e2;
    &:hover{
      width: 1240px;
      border:none;
      padding:20px;
      box-shadow:0 0px 46px 4px rgba(0,0,0,.08);
      transform: translateX(-20px);
    }
    .left {
      height: 144px;
      width: 227px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .right {
      flex:1;
      margin-left: 22px;
      display: flex;
      flex-flow: column;
      justify-content: space-between;
      font-size: 14px;
      color: #333;
      
      .time {
        color: #a1a1a1;
      }
      .content{
        margin-top: 26px;
        line-height: 26px;
        height: 52px;
        // flex: 1;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .title {
        font-size: 22px;
      }
    }
  }
}
</style>
