<template>
<div class="invoice-manage">
  <div class="box">
    <v-operation>
      <div slot="right" class="right-oper"><v-button @click="$router.push({path:'/usercenter/add-subaccount'})">+添加员工账号</v-button></div>
    </v-operation>
    <div class="table table-header-bg-gray">
      <el-table :data="tableData">
        <el-table-column label="序号"  type="index" align="center"></el-table-column>
        <el-table-column label="账号" prop="username" align="center"></el-table-column>
        <el-table-column label="姓名" prop="nickName" align="center"></el-table-column>
        <el-table-column label="电话" prop="phone" align="center"></el-table-column>
        <el-table-column label="邮箱" prop="email" align="center"></el-table-column>
        <el-table-column label="状态" prop="isValid" align="center">
          <template slot-scope="scope">
            <span class="tb-status-btn enable-btn" v-show="scope.row.isValid">已启用</span>
            <span class="tb-status-btn disable-btn" v-show="!scope.row.isValid">已禁用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="220px">
          <template slot-scope="scope">
            <span class="table-btn gray-link" @click="handleReset(scope.row)">重置密码</span>
            <span class="table-btn" @click="handleEdit(scope.row)">编辑</span>
            <span class="table-btn gray-link" @click="handleDelete(scope.row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination @current-change="changePage" background layout="prev, pager, next" :page-count="pagination.pageCount" :current-page="pagination.currentPageIndex" :page-size="pagination.pageSize"></el-pagination>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import operationBar from '../components/operationBar.vue';
import addBtn from '../components/addButton.vue';
export default {
  components: {
    'v-button':addBtn,
    'v-operation': operationBar
  },
  data() {
    const checkAmount = (rule,value,callback)=>{
      if(value){
        callback();
      }else{
        callback(new Error('请输入正确的值'))
      }
    }
    return {
      expressMode:3,
      pagination: {
        currentPageIndex: 1,
        pageSize: 5,
        pageCount: 0
      },
      tableData: [],
      ajaxData: {
        pageIndex: 1,
        pageSize: 10,
      },
    };
  },
  created() {
    this.getList();
  },
  filters:{
  
  },
  methods: {
    changePage(p) {
      this.ajaxData.pageIndex = p;
      this.getList();
    },
    handleReset( row ) {
      this.$confirm('确认重置密码？','提示').then(() => {
        this.$http.post('/resetPassword', {userId: row.id}).then(( res ) => {
          if ( res.data.code == 200 ) {
            this.$message.success(res.data.message);
          } else {
            this.$error(res.data.message);
          }
        })
      })
    },
    handleEdit( row ) {
      this.$router.push({path:'/usercenter/edit-subaccount', query:{id: row.id}});
    },
    handleDelete( row ) {
       this.$confirm('确认删除该账户？','提示').then(() => {
         this.$http.post('/custom/user/deleteSubAccount',{userId: row.id}).then(( res ) => {
           if ( res.data.code == 200 ) {
             this.$message.success('删除成功');
             this.getList();
           } else {
             this.$error(res.data.message);
           }
         })
      })
    },
    getList() {
      this.$http.post("/custom/user/getSubAccountList", this.ajaxData).then(res => {
        if (res.data.code == 200) {
          if ( Array.isArray( res.data.data ) ) {
            this.tableData = res.data.data;
          } else {
            this.tableData = [];
          }
          this.pagination = res.data.pagination;
          window.scrollTo(0,0);
        } else {
          this.$error(res.data.message);
        }
      });
    },
  }
};
</script>
<style lang="less" scoped>
@common-color: #3f8def;
.invoice-manage{
  .operation-bar{
    height: 43px;
  }
}
.right-oper{
  display: flex;
  justify-content: flex-end;
}
.tb-status-btn{
  display: inline-block;
  width: 70px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  box-sizing: border-box;
}
.enable-btn{
  background: #e3f0ff;
  color: #3f8def;
  border: 1px solid #3f8def;
}
.disable-btn{
  background:#ffecec;
  color: #f84b4b;
  border: 1px solid #f84b4b;
}
.gray-link{
  color: #8e8e8e;
}
</style>
