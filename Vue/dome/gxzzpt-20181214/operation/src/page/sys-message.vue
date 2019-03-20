<template>
    <div id="sys-message">
        <div class="content">
            <div >
                <el-table :data="tableData" border header-row-class-name="co-f1"  v-loading="loading" element-loading-text="数据加载中">
                    <el-table-column prop='index'  align="center" label="序号" width="80">
                    </el-table-column>
                    <el-table-column  align="center"  label="标题" width='140'>
                        <template slot-scope="scope">
                            <span v-for="ele in wordslist" :key='ele.id' v-if="ele.id==scope.row.messageType">{{ele.name}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="消息内容" align="left">
                        <template slot-scope="scope">
                            <div class="mark1" @click="GoToOrderDetail(scope.row.messageType,scope.row.urlInfo,scope.row.messageId)">{{scope.row.messageContent}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" align="center" width="100">
                         <template slot-scope="scope">
                            <span v-if="!scope.row.isReaded" class="mark2">未读</span>
                            <span v-else class="Readed">已读</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    @current-change="changPage"
                    :page-size="pagination.pageSize"
                    :current-page="pagination.pageIndex"
                    :page-count="pagination.pageCount">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
import { bus, Message } from "../lib/common.js";
import DetailUrlData from '../js/DetailUrl.js'
export default {
  data() {
    return {
      ajaxData: {
        pageIndex: 1,
        pageSize: 10
        // keyWord: ""
      },
      pagination: {
        currentPageIndex: 1,
        pageCount: 1,
        pageSize: 10,
        recordCount: 0
      },
      tableData: [],
      wordslist: [],
      loading:false,
    };
  },
  created() {
    this.getList();
    this.wordslist=this.$LocalStorage.getWords('131');
  },
  methods: {
    getMessageCount(Count) {
      //非父子组件的传值，触发；
      bus.$emit(Message, Count);
    },
    getList() {
      this.loading=true;
      this.$http.post("/operation/message/updateMessage", this.ajaxData).then(res => {
          if (res.data.code == 200) {
            this.pagination = res.data.pagination;
            let messageCount = res.data.unreadCount;
            this.tableData = res.data.data ? res.data.data : [];
            var index =(this.pagination.currentPageIndex - 1) * this.pagination.pageSize;
            this.tableData.map((ele, i) => {
              this.$set(ele, "index", index + i + 1);
            });
            this.getMessageCount(messageCount);
            this.loading=false;
            window.scrollTo(0,0);
          }
        });
    },
    //标记已读Api
    addReadedApi(messageId) {
      let requestParams = {
        messageIds: messageId
      };
      this.$http
        .post("/operation/message/addReaded", requestParams)
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: res.data.message
            });
            setTimeout(() => {
              this.getList();
            }, 2000);
          } else {
            this.$error(res.data.message);
          }
        });
    },
    //标记已读；
    markDown(id) {
      this.tableData.forEach(ele => {
        if (ele.messageId == id) {
          ele.isReaded = true;
        }
      });
      let messageId = [];
      messageId.push(id);
      this.addReadedApi(messageId);
    },
    changPage(pageindex) {
      this.ajaxData.pageIndex = pageindex;
      this.getList();
    },
    //跳转到订单页面；
    GoToOrderDetail(Type,urlInfo,id){
      // console.log(Type,urlInfo);
      let messageType =String(Type);
      let systemType =String(urlInfo.systemType);
      let url
      if(messageType==240700&&systemType==101020){
        let istrue= urlInfo.isPass;
        if(istrue){
          url = DetailUrlData(urlInfo.urlParam1,urlInfo.urlParam2,urlInfo.urlParam3)[systemType][messageType]['istrue']   
        }else{
          url = DetailUrlData(urlInfo.urlParam1,urlInfo.urlParam2,urlInfo.urlParam3)[systemType][messageType]['isfalse']
        }
      }else{
        url = DetailUrlData(urlInfo.urlParam1,urlInfo.urlParam2,urlInfo.urlParam3)[systemType][messageType]
      }
      // console.log(url);
      let {href} =this.$router.resolve({path:'/'+url});
      this.markDown(id);
      window.open(href,'_blank');
    }
  }
};
</script>
<style lang="less">
#sys-message {
  @common-color: #3f8def;
  .content {
    padding: 30px 15px;
    margin: 0 auto;
    .search-left {
      width: 350px;
    }
  }
  .Readed {
    color: #d0d0d0;
    text-decoration: normal;
    white-space: nowrap;
    cursor: not-allowed;
  }
  .mark1 {
      text-align: left;
      cursor: pointer;
      color: #333;
      &:hover {
        text-decoration: underline;
      }
    }
  .mark2 {
    white-space: nowrap;
    cursor: not-allowed;;
    color: @common-color;
  }
}
</style>
