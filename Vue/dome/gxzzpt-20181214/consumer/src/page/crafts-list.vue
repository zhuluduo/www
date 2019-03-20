<template>
  <div class="baike">
     <div class="bread-crumb"><span class="pull-cursor" @click="$router.push({path:'/index'})">首页</span> > <span>{{moduleName}}</span></div>
    <ul class="nav pull-shadow">
      <li @click="changeTab(item)" :class="item.id==ajaxData.catalogId?'active':''" v-for="(item,index) in nav" :key="index">{{item.catalogName}}</li>
    </ul>
    <!-- <div class="search">
      <el-input type="text" v-model="ajaxData.keyword" placeholder="请输入关键字搜索">
        <i slot="suffix" class="el-input__icon el-icon-search pointer" @click="search"></i>
      </el-input> 
    </div> -->
    <ul class="table-list pull-shadow">
      <li class="list-item" v-for="(item,index) in tableData" :key="index" @click="goDetail(item)">
        <div class="left">
          <img :src="item.coverPicturl?item.coverPicturl:require('../../static/img/defualt-img.png')" alt="">
        </div>
        <div class="right">
          <div class="title">{{item.title}}</div>
          <div class="content" v-html="item.content"></div>
          <div class="time">{{item.createTime}} 
            <div class="itemName">
               <span v-for="(items,index) in item.tagsInfo" :key="index">{{items}}</span>
            </div>
          </div> 
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
      nav: [],
      tableData: [],
      ajaxData: {
        catalogId: '',
        keyword: '',
        moduleType:'',
        pageIndex: 1,
        pageSize: 5
      },
      pagination: {
        currentPageIndex: 1,
        pageSize: 5,
        pageCount: 0
      },
      moduleData:[
        {label:'工艺百科',index:200010},
        {label:'材料百科',index:200020},
        {label:'行业资讯',index:200040},
        {label:'平台公告',index:200050},
        {label:'行业案例',index:200030},
      ],
      moduleName:'',
      itemName:''
    };
  },
  watch: {
    '$route' (to, from) {
      this.ajaxData.moduleType = Number(this.$route.query.moduleType);
      this.ajaxData.keyword = this.$route.query.searchKey;
      this.moduleList();
      this.getAllCatalog();
      this.getList();
    }
  },
  created() {
    this.ajaxData.moduleType = Number(this.$route.query.moduleType);
    this.ajaxData.keyword = this.$route.query.searchKey;
    this.moduleList();
    this.getAllCatalog();
    this.getList();
  },
  methods: {
    goDetail(item) {
      var name = "";
      this.nav.map(ele => {
        if (ele.id == this.ajaxData.catalogId) {
          name = ele.catalogName;
        }
      });
      this.$router.push({
        path: "/crafts-detail",
        query: { id: item.id, name: name,moduleName:this.moduleName }
      });
    },
    moduleList(){
      for(let i=0;i<this.moduleData.length;i++){
        if(this.moduleData[i].index==Number(this.$route.query.moduleType)){
            this.moduleName=this.moduleData[i].label;
        }
      }
    },
    changePage(p) {
      this.ajaxData.pageIndex = p;
      this.getList();
    },
    changeTab(item) {
      this.itemName=item.catalogName;
      if (this.ajaxData.catalogId == item.id) return;
      this.ajaxData.catalogId = item.id;
      this.getList();
    },
    search() {
      this.getList();
    },
    getAllCatalog() {
      this.$http.post("/custom/catalog/getCatalogList",{moduleType:this.ajaxData.moduleType}).then(res => {
        if (res.data.code == 200) {
          this.nav = res.data.data;
          var item = {catalogName:"全部",id:""}
          if (Array.isArray(this.nav)) {
            this.nav.unshift(item);
            this.ajaxData.catalogId = this.nav[0].id;
            this.getList();
          } else {
            this.tableData = [];
          }   
        }
      });
    },
    getList() {
      this.$http
        .post("/custom/information/getWikiList", this.ajaxData)
        .then(res => {
          if (res.data.code == 200) {
            if(res.data.data!=undefined){
              res.data.data.map((e)=>{
                if(e.tags!=undefined){
                e.tagsInfo=e.tags.split(",")
                  return e.tagsInfo
                }
              })
            }
            this.tableData = res.data.data;
            this.pagination = res.data.pagination;
          }
        });
    }
  }
};
</script>
<style lang="less" scoped>
  .pull-shadow{
  box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
  -webkit-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
  -moz-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
  }
@common-color: #3f8def;
.pagination{
  margin-bottom: 50px;
}
.pull-cursor{cursor: pointer;}
.baike {
  margin: auto;
  margin-top: 15px;
  width: 1200px;
  min-height: 500px;
}
.bread-crumb{
  margin-bottom: 10px;
  span+span{
  color: #3f8def;
  }
}
.nav {
  width: 1200px;
  padding: 15px 20px 5px 20px;
  background: #fff;
  overflow: hidden;
  li{float: left;margin-right:50px;}
  > li {
    height: 26px;
    line-height: 25px;
    padding:0 15px;
    margin-bottom: 10px;
    text-align: center;
    display: inline-block;
    overflow: hidden;
    cursor: pointer;
  }
  .active {
    color: #fff;
    background-color: #3f8def;
    border: solid 1px #3f8def;
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
  background: #fff;
  padding: 0 20px;
  box-sizing: border-box;
  .list-item+.list-item{border-top: 1px solid #e2e2e2;}
  .list-item {
    position: relative;
    padding: 20px 0px 20px 0;
    height: 162px;
    box-sizing: border-box;
    display: block;
    &:hover {
      cursor: pointer;
      .title{
        color: #3f8def;
      }
    }
    .left {
      width: 184px;
      height: 120px;
      text-align: center;
      line-height: 115px;
      float: left;
      img {
        width: 100%;
        height:100%;
      }
    }
    .right {
      width: 950px;
      float: left;
      margin-left: 20px;
      font-size: 14px;
      color: #333;
      .time {
        color: #c1c1c1;
      }
      .itemName{
          position: absolute;
          bottom: 20px;
          right: 0;
        span{
          display: inline-block;
          height: 26px;
          line-height: 26px;
          background-color: #d6e8ff;
          color: #3f8def;
          margin-top: -4px;
          padding: 0 8px;
          margin:0 8px;
        }
      }
      .content {
        margin-top: 11px;
        margin-bottom: 18px;
        line-height: 19px;
        height: 55px;
        overflow : hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        color: #777 !important;
      }
      .title {
        font-size: 16px;
        font-weight: 700;
      }
    }
  }
}
</style>
