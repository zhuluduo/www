<template>
<div class="">
  <div class="box">
    <v-operation>
      <v-tabs :tabs="types" @click="changeTab"></v-tabs>
      <div slot="right">
        <el-input @keydown.native="searchByKeydown($event)" v-model="ajaxData.keyword" placeholder="需求编号/产品名称">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="searchByClick"></i>
        </el-input>
      </div>
    </v-operation>
    <div class="table">
      <el-table :data="tableData"  style="width: 100%" header-row-class-name="co-f1">
        <el-table-column label="需求编号" align="center" width="117">
          <template slot-scope="scope">
           <router-link :to="{path:'/enquiry/detail/my', query:{requireId:scope.row.id}}" target="_blank"><div class="tb-link">{{scope.row.requirementNo}}</div></router-link>
          </template>
        </el-table-column>
        <el-table-column prop="requirementNo" label="零件名称" width="102" align="center">
          <template slot-scope="scope">
              <div>{{scope.row.requirementItemList[0].itemName}}</div>
            </template>
          </el-table-column>
        <el-table-column label="工艺" prop="requirementTypeText" align="center" width="75">
          <template slot-scope="scope">
            {{scope.row.techniqueInfo?scope.row.techniqueInfo.techniqueName:'-'}}
          </template>
        </el-table-column>
        <el-table-column prop="requirementTypeText" label="提交时间" align="center" width="142">
           <template slot-scope="scope">
            <div>{{scope.row.createTime}}</div>
          </template>
        </el-table-column>
        <el-table-column label="零件数量" align="center" width="90">
          <template slot-scope="scope">{{scope.row.requirementItemList.length}}</template>
        </el-table-column>
        <el-table-column prop="estimateCount" label="需求数量" align="center" width="90px">
          <template slot-scope="scope">
            <div>{{scope.row.requirementItemList|estimateCountFilter}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="有效时间" align="center" width="142px">
          <template slot-scope="scope">
            <div>{{scope.row.offerDeadlineTime}}</div>
            <!-- <div>{{scope.row.offerDeadlineTime|timeFilter}}</div> -->
          </template>
        </el-table-column>

        <el-table-column prop="price" label="已报价" align="center" width="68px">
          <template slot-scope="scope">
            <router-link v-if="scope.row.haveOfferCount>0" :to="{path:'/usercenter/quotation-list', query:{requireId: scope.row.id}}">
              <span class="tb-link">{{scope.row.haveOfferCount}}家</span>
            </router-link>
            <span class="tb-link" v-if="scope.row.haveOfferCount==0">{{scope.row.haveOfferCount}}家</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="状态" align="center" width="104">
          <template slot-scope="scope">
            <div>{{scope.row.requirementStatusText}}<span style="font-size:10px;color:#777;" v-if="(scope.row.auditStatus==190010||scope.row.auditStatus==190030)&&scope.row.requirementStatus!=107000"> ({{scope.row.auditStatusText}})</span></div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" align="center" width="113px">
            <template slot-scope="scope">
                <span class="link-with-underline" v-if="(scope.row.requirementStatus==107010||scope.row.requirementStatus==107020)&&scope.row.haveOfferCount==0" @click="closeRequirement(scope.row)">关闭需求</span>
                <span class="link-with-underline" v-if="scope.row.requirementStatus==107000" @click="edit(scope.row)">编辑</span>
                <span class="link-with-underline" v-if="scope.row.requirementStatus==107000" @click="deleteItem(scope.row)">删除</span>
                <span class="link-with-underline" v-if="scope.row.haveOfferCount>0"><router-link :to="{path:'/usercenter/quotation-list', query:{requireId: scope.row.id}}">查看报价</router-link></span>
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
import '../lib/filter.js'//引入时间和日期过滤器；
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
        requirementStatus: ""
      },
      types: [],
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
    closeRequirement( row ) {
      this.$confirm('确定关闭需求？', '提示').then(() => {
        this.$http.post('/custom/requirement/close', { id: row.id }).then(( res ) => {
          if ( res.data.code == 200 ) {
            this.$success('操作成功！');
            this.getList();
          } else {
            this.$error('操作失败！');
          }
        })
      })
    },

    edit( row ) {
      if ( row.isExcelData ) {
        this.$router.push( {path:'/quote/excel/edit', query:{requirementId:row.id,techniqueId:row.techniqueInfo.id, techniqueType: row.techniqueInfo.techniqueType,
        techniqueName:row.techniqueInfo.techniqueName}} );
      } else {
        this.$router.push({path:'/quote/manual/edit', query:{requirementId:row.id,techniqueId:row.techniqueInfo.id, techniqueType: row.techniqueInfo.techniqueType,
        techniqueName:row.techniqueInfo.techniqueName}});
      }
    },

    deleteItem( row ) {
      this.$confirm('确定删除需求？', '提示').then(() => {
        this.$http.post('/custom/requirement/delete', { id: row.id }).then(( res ) => {
          if ( res.data.code == 200 ) {
            this.$success('操作成功！');
            this.getList();
          } else {
            this.$error('操作失败！');
          }
        })
      })
    },
    generateOrder(row) {
      this.$router.push({ path: "/generate-order", query: { id: row.id } });
    },
    changeTab( item ) {
      if ( item.id == 100 ) {
        this.ajaxData.requirementStatus = null;
      } else {
        this.ajaxData.requirementStatus = item.id;
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
        this.types = words[106].item;
        this.types.map(( item ) => {
          this.$set(item, 'isCheck', false);
        })
        var ele = {name: '全部',id: 100, isCheck: true};
        this.types.unshift(ele);
    },
    getList() {
      this.$http.post("/custom/requirement/list", this.ajaxData).then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.data;
            this.pagination = res.data.pagination;
            window.scrollTo(0,0);
          }
        }).catch(res => {});
    },
    goDetail(row) {
      let href = this.$router.resolve({
        path: "/my-require-detail",
        query: {
        requireId: row.id,
        }
      });
       window.open(href, '_blank');
    },
    toOfferDetail( row ) {
      this.$router.push({path:'/usercenter/quote/detail/my',query:{requireId: row.id, from:0}});
    }
  }
};
</script>
<style lang="less" scoped>
.box{
  margin: 0 auto;
}
.tb-link:hover{
  color: #3f8def;
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
  width: 320px;
}
.user-info {
  text-align: left;
}
.tb-img{
  display: block;
  width: 63px;
  height: 63px;
  margin: 0 auto;
  background: #f1f1f1;
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
