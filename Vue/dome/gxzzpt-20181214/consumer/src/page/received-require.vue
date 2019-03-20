<template>
<div id="received-require">
  <div class="box">
    <v-operation>
      <v-tabs :tabs="types" @click="changeTab"></v-tabs>
      <div slot="right">
        <el-input @keydown.native="searchByKeydown($event)" v-model="ajaxData.keyword" placeholder="需求编号/产品名称">
          <i slot="suffix" class="el-input__icon el-icon-search search-icon" @click="searchByClick"></i>
        </el-input>
      </div>
    </v-operation>
    <div class="table">
      <el-table :data="tableData"  style="width: 100%" header-row-class-name="co-f1">
        <el-table-column prop="requirementNo" label="需求编号" align="center" width="148">
          <template slot-scope="scope">
              <router-link target="_blank" :to="{path:'/enquiry/detail', query:{requireId: scope.row.id, quotationId: scope.row.requirementPrice.id}}"><div class="tb-link">{{scope.row.requirementNo}}</div></router-link>
              <!-- <router-link target="_blank" :to="{path:'/require-detail', query:{requireId: scope.row.id, quotationId: scope.row.requirementPrice.id}}"><div class="tb-link">{{scope.row.requirementItemList[0].itemName}}</div></router-link> -->
            </template>
          </el-table-column>
        <el-table-column label="零件名称" width="116">
          <template slot-scope="scope">
              <div style="text-align:center">{{scope.row.requirementItemList[0].itemName}}</div>
            </template>
        </el-table-column>
        <el-table-column prop="requirementTypeText" label="提交时间" align="center" width="148">
           <template slot-scope="scope">
            <div>{{scope.row.createTime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="零件#" align="center" width="66">
          <template slot-scope="scope">{{scope.row.requirementItemList.length}}</template>
        </el-table-column>
        <el-table-column prop="offerDeadlineTime" label="有效期" align="center" width="142">
          <template slot-scope="scope">
            <div style="text-align:center">{{scope.row.offerDeadlineTime}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="estimateCount" label="需求数量" align="center" width="112">
          <template slot-scope="scope">
            <div>{{scope.row.requirementItemList|estimateCountFilter}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="状态" align="center" width="116">
          <template slot-scope="scope">
            <div>{{scope.row.requirementPrice.offerStatusText}}</div> 
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" align="center" width="197">
            <template slot-scope="scope">
                <span class="link-with-underline" @click="toQuotation(scope.row, 0)" v-if="scope.row.requirementPrice.offerStatus==210010 && scope.row.requirementStatus==107020">去报价</span>
                <span class="link-with-underline" @click="toQuotation(scope.row, 1)" v-if="scope.row.requirementPrice.acceptStatus!=450010||scope.row.requirementPrice.offerStatus==210030">查看报价</span>
                <span class="link-with-underline" @click="toQuotation(scope.row, 1)" v-if="scope.row.requirementPrice.offerStatus==210020 && scope.row.requirementStatus==107020 && scope.row.requirementPrice.acceptStatus==450010">修改报价</span>
            </template>
        </el-table-column>
      </el-table>
    </div>
     <div class="pagination">
        <el-pagination @current-change="changePage" background layout="prev, pager, next" :page-count="pagination.pageCount" :current-page="pagination.currentPageIndex" :page-size="pagination.pageSize"></el-pagination>
      </div>
  </div>
</div>
</template>
<script>
import '../lib/filter.js';
import tabs from '../components/tabs.vue';
import operationBar from '../components/operationBar.vue';
export default {
  components: {
    'v-tabs':tabs,
    'v-operation': operationBar,
  },
  data() {
    return {
      tableData: [],
      ajaxData: {
        pageIndex: 1,
        pageSize: 10,
        keyword: "",
        reqPriceStatus : null
      },
      types: [],
      selectedStatus:100,
      pagination: {
        currentPageIndex: 1,
        pageSize: 10,
        pageCount: 0
      }
    };
  },
  created() {
    this.getList();
    this.getWords();
  },
  //页面在顶部；
  mounted() {
    window.scrollTo(0, 0);
  },
  filters: {
    estimateCountFilter( requirementList ) {
      var num = 0;
      requirementList.map((item) => {
        num += item.estimateCount;
      })
      return num;
    },
  },
  methods: {
    changeTab( item ) {
      if ( item.id == 100 ) {
        this.ajaxData.reqPriceStatus = null;
      } else {
        this.ajaxData.reqPriceStatus = item.id;
      }
      this.getList();
    },

    searchByKeydown() {
      if (event.keyCode == 13 ) {
          this.getList();
      }
    },

    searchByClick() {
      this.getList();
    },

    changePage(p) {
      this.ajaxData.pageIndex = p;
      this.getList();
    },
    
    getWords() {
        var wordsString = localStorage.getItem('words');
        var words = JSON.parse(wordsString);
        this.types = words[128].item;
        this.types.map(( item ) => {
          this.$set(item, 'isCheck', false);
        })
        var ele = {name: '全部',id: 100, isCheck: true};
        this.types.unshift(ele);
    },

    getList() {
      this.$http.post("/custom/manufacturer/requirement/list", this.ajaxData).then(res => {
      if (res.data.code == 200) {
          this.tableData = res.data.data;
          this.pagination = res.data.pagination;
          window.scrollTo(0,0);
        }
      })
    },
    toQuotation( row, type ) {
      let {href} = this.$router.resolve({path:'/quotation', query:{requireId: row.id,
          quotationId: row.requirementPrice.id}});

      if ( type == 0 ) {
        this.$http.post('/custom/manufacturer/requirement/isQuote').then(( res ) => {
          if ( res.data.code == 200 ) {
            window.open(href, '_blank');
          } else {
            this.$error('参与报价您需要完善以下信息');
            setTimeout(() => {
              this.$router.push({path:'/GuideInfo',query:{isShow:false}});
            }, 700);
          }
        })
      } else {
        window.open(href, '_blank');
      }
    },
    goDetail(row) {
      this.$router.push({
        path: "/usercenter/require-detail",
        query: {
          requireId: row.id,
          quotationId: row.requirementPrice.id,
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
#received-require{

}
.box {
  width: 1045px;
}
.el-icon-search:before{
  font-size: 18px;
  color: #a4a4a4;
  cursor: pointer;
}
.el-input__icon{
  line-height: 26px;
}
.el-input{
  width: 308px;
}
.box-header {
  height: 36px;
  display: flex;
  align-items: center;
  > div {
    display: inline-block;
  }
  .search-select {
    width: 122px;
  }
  .search-input {
    width: 374px;
    margin-left: 28px;
  }
  .search-btn {
    width: 86px;
    margin-left: 12px;
  }
}
.user-info {
  text-align: left;
}
.tb-img{
  display: block;
  width: 63px;
  height: 63px;
  margin: 0 auto;
  background: #e7e7e7;
//  text-align: center;
  line-height: 63px;
}
.no-upload-img{
  display: block;
  width: 63px;
  height: 63px;
  margin: auto;
  background: #e7e7e7;
  text-align: center;
  line-height: 63px;
  font-size: 16px;
  color: #878787;
}
</style>
