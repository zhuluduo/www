<template>
  <div id="ResourceList">
   <el-breadcrumb separator="/">
        <el-breadcrumb-item>资源推广</el-breadcrumb-item>
        <el-breadcrumb-item>{{crumbName}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="ResourceList-box">
        <div class="Resource-select" v-if="tableState=='list'">
            <span>导入资源类型：</span>
            <el-select class="el-select-box" v-model="promoteType" placeholder="请选择" size='small'  @change='selectType()'>
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="ResourceAdd" v-if="tableState=='edit'">
            <el-button type="primary" icon="el-icon-plus" size='small' @click="ResourceAdd(ruleForm)">添加</el-button>
        </div>
        <div class="Resource-table">
            <el-table :data="tableData" border style="width: 100%" v-loading="loading" element-loading-text="数据加载中">
            <el-table-column type="index" label="序号" align="center"  width="60px"></el-table-column>
            <el-table-column prop="promoteUserName" label="姓名" align="center" ></el-table-column>
            <el-table-column prop="phone" label="电话" align="center" ></el-table-column>
            <el-table-column prop="email" label="邮箱" align="center" ></el-table-column>
            <el-table-column prop="promoteTypeText" label="导入资源类型" align="center" >
            <template slot-scope="scope">
              <div v-if="tableState=='list'">
                <div v-for="(item,index) in scope.row.Statistics" :key="index" class="pull-block"><span v-if="item.promoteType==510010">需求方</span><span v-if="item.promoteType==510020">供应商</span></div>
              </div>
              <div v-if="tableState=='edit'"><span v-if="scope.row.promoteType==510010">需求方</span><span v-if="scope.row.promoteType==510020">供应商</span></div>
            </template>
            </el-table-column>
            <el-table-column :label="tableState=='list'?'数量':'推荐链接'" align="center" :width="tableState=='list'?'200':'550'">
            <template slot-scope="scope">
              <div v-if="tableState=='list'">
                <span v-for="(item,index) in scope.row.Statistics" :key="index" class="pull-block">{{item.promoteCount}}</span>
              </div>
              <div v-if="tableState=='edit'"><span v-if="scope.row.promoteType==510010">{{demandUrl}}</span><span v-else>{{SupplierUrl}}</span>{{scope.row.promoteCode}}<span class='copy pull-cursor' @click="copyData(scope.row)">复制</span></div>
            </template>
            </el-table-column>
            </el-table>
        </div>
    </div>
    <div class="pagination">
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
    <div class="dialog-cont">
      <el-dialog
        title="添加资源推广链接"
        :visible.sync="dialogVisible"
        width="550px"
        @close='closeClick'>
        <div class="dialog-from">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
            <el-form-item label="姓名：" prop="promoteUserName">
              <div class="el-input-w">
                    <el-autocomplete
                    class="inline-input"
                    v-model="ruleForm.promoteUserName"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="请输入内容"
                    :trigger-on-focus="false"
                    @select="handleSelect"
                  ></el-autocomplete>
              </div>
              <span @click="AddFrom" class="addState pull-cursor">找不到,我要增加</span>
            </el-form-item>
            <div v-if="FormLoading==true">
            <el-form-item label="电话：" prop="phone">
              <span v-if="SelectLoading==true">{{ruleForm.phone}}</span>
              <el-input v-else v-model="ruleForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
              <span v-if="SelectLoading==true">{{ruleForm.email}}</span>
              <el-input v-else v-model="ruleForm.email"></el-input>
            </el-form-item>
            </div>
            <el-form-item label="导入资源类型：" prop="promoteTypes">
              <el-checkbox-group v-model="ruleForm.promoteTypes">
                <!-- <el-checkbox label="510010" name="type">需求方</el-checkbox>
                <el-checkbox label="510020" name="type">供应商</el-checkbox> -->
                <el-checkbox v-for="city in checkList" :label="city.value" :key="city.value">{{city.label}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <div class="dialog-from-footer">
              <el-form-item>
                <el-button @click="resetForm('ruleForm')">取消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
        demandUrl:this.$location.locationHost()+'/consumer/#/register/demander?invCode=',
        SupplierUrl:this.$location.locationHost()+'/consumer/#/register/provider?invCode=',
        crumbName:'',//资源列表状态
        tableState:'',//表格状态
        options: [{
          value: '',
          label: '全部'
        }, {
          value: 510020,
          label: '供应商'
        }, {
          value: 510010,
          label: '需求方'
        }],
        checkList:[
          {
          value: 510020,
          label: '供应商'
          }, {
          value: 510010,
          label: '需求方'
          }
        ],
        promoteType:'',
        tableData: [],
        ruleForm:{
          promoteUserName:'',
          phone:'',
          email:'',
          promoteTypes:[]
        },
        rules:{
          promoteUserName: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
          ],
        },
        loading:false,
        FormLoading:false,
        SelectLoading:false,
        dialogVisible:false,
        restaurants:[],
        page:{
        currentPage:1, // 当前页
        size:10, // 每页大小
        total:0, // 总页数
     },
        }
    },
    watch:{
      '$route' (to, from) {
          this.userState(this.$route.params)
      }
    },
    created(){},
    mounted() {
     this.userState(this.$route.params)
    },
    methods:{
        selectType(){
          this.InitialMethodList()      
        },

        /*处理分页事件*/
        handleSizeChange(val) {
          this.page.size = val;
          this.publicPage();
        },
        handleCurrentChange(val) {
          this.page.currentPage = val;
          this.publicPage();
        },

        publicPage(){
          if(this.tableState=='list'){
            this.InitialMethodList();
          }else{
            this.InitialMethodEdit();
          }
        },

        userState(e){
           this.tableState=e.name;
           this.page.currentPage=1;
           if(e.name=='list'){
             this.crumbName='推广统计';
             this.InitialMethodList();
           }
           if(e.name=='edit'){
             this.crumbName='推广管理';
             this.InitialMethodEdit();
           }
        },

        //统计
        InitialMethodList(){
          let url='/operation/PromoteStatistics/getStatisticsList';
          let params={
              promoteType:this.promoteType,
              pageIndex:this.page.currentPage,
              pageSize:this.page.size
            }
          this.commonRequest(url,params)
        },

        //管理
        InitialMethodEdit(){
          let url='/operation/PromoteStatistics/getAdministerList';
          let params={
              pageIndex:this.page.currentPage,
              pageSize:this.page.size
            }
          this.commonRequest(url,params)
        },
        
        //公共请求接口
        commonRequest(url,params){
          this.loading=true;   
          this.$http.post(url,params).then(res=>{
            if(res.data.code==200){
              let data=res.data.data;
              let pageTotal=res.data.pagination.recordCount;
              if(data.constructor !=Array){
                data=[];
                pageTotal=0
              }
              this.page.total=pageTotal;
              this.tableData=data;
              setTimeout(() => {
              this.loading=false
              }, 800)
            }else{
              this.$message.error(res.data.message);
              setTimeout(() => {
              this.loading=false
              }, 1000)
            }
          })
        },

        copyData(val){
          if(val.promoteType==510010){
              let url=this.demandUrl+val.promoteCode;
              this.copyToClipboard(url)
          }else{
              let url=this.SupplierUrl+val.promoteCode;
              this.copyToClipboard(url)
          }
        },

        copyToClipboard(text){
          this.$Clipboard.copy(text,'复制成功!')
        },

        //输入姓名匹配
        querySearchAsync(queryString, cb) {
          let url='/operation/PromoteStatistics/getNamelist';
          let restData=[]
          let params={
              keyWord:queryString
          }
          this.$http.post(url,params).then(res=>{
          if(res.data.data!=undefined){
            for(let i=0;i<res.data.data.length;i++){
              restData.push({'value':res.data.data[i].promoteUserName,'item':res.data.data[i]})
            }
          }
          })
          this.restaurants=restData;
          var results =  this.restaurants;
          if(results==''){
              this.ruleForm.phone='';
              this.ruleForm.email='';
              this.ruleForm.promoteTypes=[];
              this.FormLoading=false;
              this.SelectLoading=false;
            }
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            cb(results);
          }, 3000 * Math.random());
        },

        handleSelect(itemList) {
          this.ruleForm.phone=itemList.item.phone;
          this.ruleForm.email=itemList.item.email;
          this.ruleForm.promoteTypes=[];
          this.FormLoading=true;
          this.SelectLoading=true;
        },

        ResourceAdd(ruleForm){
          this.dialogVisible=true;
        },

        AddFrom(){
          this.FormLoading=true;
        },

        closeClick(){
          this.FormLoading=false;
          this.ruleForm={
          promoteUserName:'',
          phone:'',
          email:'',
          promoteTypes:[]
          }
        },

        submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let url='/operation/PromoteStatistics/addPromote';
            this.$http.post(url,this.ruleForm).then(res=>{
              if(res.data.code==200){
                this.closeClick();
                this.dialogVisible=false;
                this.$message({
                  message: '数据添加成功',
                  type: 'success',
                  duration:1000
                });
                this.publicPage();
              }else{
                this.$message.error('数据添加失败');
              }
            })
          } else {
            return false;
          }
        });
      },

      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dialogVisible=false;
      }
    }
};
</script>
<style lang="less">
#ResourceList{
  .dialog-cont{
    .el-dialog__body{padding: 30px 50px 30px 20px;}
  }
}
</style>

<style lang="less" scoped>
.pull-cursor{color: #20a0ff;cursor: pointer;display: inline-block;&:hover{text-decoration: underline;}}
.pull-block{display:block;}
#ResourceList{
  .ResourceList-box{
     margin-top: 10px;
  }  
  .Resource-select{
     margin-bottom: 10px;
    .el-select-box{width:150px;}  
  }
  .ResourceAdd{
     margin-bottom: 10px;
     text-align: right;
  }
  .demo-ruleForm{
    .el-input-w{width:190px;float: left;}
  }
  .dialog-from-footer{text-align: center;}
  .addState{padding-left: 25px;}
  .copy{padding-left: 20px;}
}
</style>


