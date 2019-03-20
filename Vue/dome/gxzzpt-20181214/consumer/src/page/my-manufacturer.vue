<template>
	<div id="Mysupplier">
    <div class="Mysupplier-mian">
      <div class="Mysupplier-search"> 
      <el-row>
        <el-col :span="24" >
          <div class="search">
            <el-input @keyup.enter.native="Search" v-model.trim="ruleForm.formSearch" clearable class="finallblock" placeholder="供应商名称" size="small"></el-input>
            <i class="el-icon-search SearchBtn" @click="Search"></i>
          </div>
        </el-col>
      </el-row>
      </div>
      <div class="Mysupplier-container">
        <el-table
          :data="tableData" class="tableData" style="width: 100%" v-loading="loading" element-loading-text="数据加载中">
          <el-table-column label="序号" type="index" width="70" label-class-name='thColor'></el-table-column>
          <el-table-column label="供应商" label-class-name='thColor'>
              <template slot-scope="scope">
                <span class="Manufacturer" @click="$router.push({path: '/manufacturer-audits', query: {companyId:scope.row.supplierId}})">{{scope.row.companyName}}</span>
              </template>
          </el-table-column>
          <el-table-column label="企业规模" width="150" label-class-name='thColor'>
              <template slot-scope="scope">
                <span v-if="scope.row.extendInfo===undefined"></span>
                <span v-else>{{scope.row.extendInfo.employeeScaleStr}}</span>
              </template>
          </el-table-column>
          <el-table-column label="涉及工艺" width="200" label-class-name='thColor'>
              <template slot-scope="scope">
                <span class="operation operation-H" v-for="(item,index) in scope.row.techniqueInfo" :key="index" v-if="item.techniqueName!=undefined">{{item.techniqueName}}</span>
              </template>
          </el-table-column>
          <el-table-column label="我的标签" width="180" label-class-name='thColor' align="center">
              <template slot-scope="scope">
                <span class="input-tag" v-for="(item,index) in scope.row.tags" :key="index" :class="(index + 1) % 2==0?'no-margin-left':''">{{item}}</span>
              </template>
          </el-table-column>
          <el-table-column label="操作" width="120" label-class-name='thColor'>
              <template slot-scope="scope">
                <el-button @click="handleClick(scope.row,scope.$index,1)" type="text" size="small" class="operation-tag">标签</el-button>
                <el-button type="text" size="small" @click="handleClick(scope.row,scope.$index,2)" class="operation-splic">移除</el-button>
              </template>
          </el-table-column>
        </el-table>
        <div class="pagination-block">
            <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="page.currentPage"
            :page-size="page.size"
            layout="total, prev, pager, next"
            :total="page.total">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- dialog -->
  <el-dialog
  :title="dialog.Index==1?'标签':'提示'"
  :visible.sync="dialog.Visible"
  width="525px"
  top='25vh'
  custom-class="dialog-box"
  @close="removeClick(dialog.Index)">
  <div v-if="dialog.Index==1" class="dialog-one-tag">
      <p class="dialog-tag-text" v-if="TagState==true">该标签已经存在，请勿重复添加</p>
      <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleClose(tag)">
      {{tag}}
      </el-tag>
      <el-input class="input-new-tag" v-if="inputVisible" v-model.trim="inputValue" ref="saveTagInput" size="small"
      @keyup.enter.native="handleInputConfirm"
      @blur="handleInputConfirm">
    </el-input>
    <el-button v-else class="button-new-tag" size="small" @click="showInput">添加</el-button>
  </div>
  <div v-if="dialog.Index==2" class="dialog-two-text"><i class="el-icon-warning"></i>确定移除该供应商？</div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialog.Visible = false">取 消</el-button>
    <el-button type="primary" @click="confirmClick(dialog.Index)" size="small">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading:false,
      ruleForm:{
        formSearch:''
      },
      dialog:{
      Visible: false,
      Index:'',
      Name:'',
      state:false,
      tableIndex:'',
      tableRow:'',
      },
      //tag
      dynamicTags: [],
      dynamicTagDate:[],
      inputVisible: false,
      inputValue: '',
      TagState:false,
      tableData:[],
       // 分页信息
      page:{
        currentPage:1, // 当前页
        size:10, // 每页大小
        total:0, // 总页数
      },
    }
  },
  methods:{
    /*搜索*/
    Search(){
      let _this=this;
      _this.created();
    },
    /*处理分页事件*/
    handleSizeChange(val) {
      this.page.size = val;
      this.created();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.created();
    },

    /*初始化数据*/
    created(){
      let _this=this;
      _this.loading = true;
      let url='/custom/company/myManufacturers'
      let params={
        keyword:_this.ruleForm.formSearch,
        pageIndex:_this.page.currentPage,
        pageSize:_this.page.size
      }
      _this.$http.post(url,params).then(res=>{
        let data=res.data.data.list;
        let pageTotal=res.data.data.pagination.recordCount;
        if(data.constructor !=Array){
           data=[];
           pageTotal=0
        }
      _this.page.total=pageTotal;
      _this.tableData=data;
      _this.loading = false;
      })
    },
    /*表单操作*/
    handleClick(item,index,number){
      this.dialog.Index=number;
      this.dialog.state=false;
      this.dialog.Visible=true;
      this.dialog.tableIndex=index;
      this.dialog.tableRow=item;
      if(number===1){
      if(item.tags==undefined){
        item.tags=[];
      }
      this.dynamicTagDate=item.tags.concat();
      this.dynamicTags=this.dynamicTagDate;
      }
      //tag
      // this.dynamicTags=item.name1;
    },
    /*添加标签*/
    confirmClick(item){
      this.dialog.state=true;
      this.dialog.Visible=false;
      let index=this.dialog.tableIndex;
      this.ruleForm.formSearch='';
      let url='/custom/company/updateMyManufacturerTags';
      let deleteUrl='/custom/company/deleteMyManufacturer'
      let params={
          supplierId:this.dialog.tableRow.supplierId,
          tags:this.dynamicTags
      }
      let deleteParams={
          supplierId:this.dialog.tableRow.supplierId,
      }
      if(item==1){
      this.$http.post(url,params).then(res=>{
        if(res.data.code===200){
        this.$message({
            type: "success",
            message: '标签添加成功',
            customClass:'message-success-box',
        });
        this.created();
        }else{
          this.$error('标签添加失败');
        }
      })
      }
      if(item==2){
        this.$http.post(deleteUrl,deleteParams).then(res=>{
        if(res.data.code===200){
        this.$message({
            type: "success",
            message: '数据移除成功',
            customClass:'message-success-box',
        });
        this.created();
        }else{
          this.$error('数据移除失败');
        }
      })
      }
    },
    /*关闭弹出框*/
    removeClick(item){
      if(this.dialog.state !=true){
      this.dialog.Visible=false;
      this.dynamicTags=[];
      }
    },
    /*Tag标签*/
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        let state=true
        if (inputValue) {
          for(let index in this.dynamicTags){
            if(inputValue===this.dynamicTags[index]){
             state=false
             this.TagState=true
            }
          }
          if(state==true){
             this.dynamicTags.push(inputValue);
             this.TagState=false;
          }
        }
        this.inputVisible = false;
        this.inputValue = '';
      }
  },
  mounted(){
    let _this=this;
    _this.created();
  },
}
</script>
<style lang="less">
#Mysupplier{
  .Mysupplier-search{
    .finallblock {
      .el-input__inner,.el-input-group__append{border:none!important;height:26px;line-height:26px;}
      .el-input-group__append{background: #fff;padding: 0;}
    }
  }
  .Mysupplier-container{
    .thColor{background-color: #f1f1f1;color: #777;text-align: center;}
  }
  .operation-tag{
  span{color: #3f8def;}
}
.operation-splic{
  span{color: #a09f9f;}
}
}
.dialog-box{
  .el-dialog__body{padding: 22px 28px 31px 28px!important;}
  .el-dialog__footer{
    text-align: center!important;
  }
}
.dialog-one-tag{
    .el-tag{margin-bottom: 10px;margin-left: 10px;}
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding: 0px 20px !important;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: top;
  }
  .el-icon-close{
    &::before{
      font-size: 14px !important;
    }
  }
}
.message-success-box{
  min-width:210px!important;
}
.el-dialog__footer{
  .el-button--default{
    background: #ffffff !important;
    color: #333 !important;
  }
}
</style>

<style lang="less" scoped>
    .pull-center{text-align: center!important;}
    .pull-block{ display:block!important;}
    #Mysupplier{
      .right-title {
          position: absolute;
          top: -28px;
          left: 0px;
          width: 100%;
          height: 20px;
          font-size: 14px;
          color: #333;
      }
      .Mysupplier-mian{
          margin-top: 15px;
          box-sizing: border-box;
          .Mysupplier-search{
            .search{
                width: 306px;
                height:28px;
                float: right;
                border: solid 1px #e2e2e2;
              .finallblock {
                width: 268px;
              }
              .SearchBtn{
                float: right;
                width: 35px;
                height: 26px;
                line-height: 26px;
                display: block;
                text-align: center;
                color: #a4a4a4;
                cursor: pointer;
              }
            }
          }
        .Mysupplier-container{
          margin-top:17px;
          .tableData{
            text-align: center;
            .Manufacturer{
              color: #3f8def;font-size: 12px;cursor: pointer;fon
                &:hover{
                  text-decoration:underline;
                }
              }
            .operation-tag,.operation-splic{padding: 0!important;font-size: 14px;}
            .operation+.operation{
              &::before{
                content:",";
              }
            }
            .operation-H{height:20px;line-height:20px;display:inline-block;}
            .input-tag{
              display: inline-block;
              min-width: 68px;
              min-height: 26px;
              line-height: 18px;
              background-color: rgba(204, 227, 255, 0.54);
              border: solid 1px #3f8def;
              color: #3f8def;
              margin: 0 5px;
              margin-bottom: 2px;
              padding: 2px;
              text-align: center;
              box-sizing: border-box;
              }
              // .no-margin-left{margin-right:0!important;}
            }
        }  
      }
    }
    .pagination-block{
      margin-top: 30px;
      text-align: right;
    }
    .dialog-box{
      .dialog-tag-text{
      height: 30px;
      line-height: 30px;
      text-align: center;
      margin-bottom: 10px;
      background-color: rgba(255, 233, 233, 0.8);
      color: #ff2c2c;
      }
      .dialog-two-text{
        text-align: center;
        font-size: 16px;
        padding: 15px;
        i{
        color: #e6a23c;
        padding-right: 10px;
        width: 16px;
        }
      }
    }
</style>