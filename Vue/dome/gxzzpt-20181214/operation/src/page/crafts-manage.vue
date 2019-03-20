<template>
  <div id="crafts-manage">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>服务</el-breadcrumb-item>
      <el-breadcrumb-item>工艺管理</el-breadcrumb-item>
    </el-breadcrumb>
    <v-operations>
      <div slot="right">
        <el-button type="primary" @click="openDlg">管理工艺类别</el-button>
        <el-button type="primary" @click="$router.push({path:'/main/add-crafts'})">添加自动报价工艺</el-button>
        <el-button type="primary" @click="openDlgArt">添加人工报价工艺</el-button>
        <!-- <el-button type="primary" @click="craftsTypeDlgArt.visible=true">添加人工报价工艺</el-button> -->
      </div>
    </v-operations>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="人工报价工艺" name="second">
        <el-table :data="tableData"  border >
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="techniqueName" label="工艺名称"  width="200">
          </el-table-column>
          <el-table-column prop="techniqueName" label="父类别">
            <template slot-scope="scope">
              <span>{{scope.row.catalog?scope.row.catalog.techniqueCatalogName:'-'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <!-- <span class="tb-operation-link" @click="$router.push({path:'/main/edit-crafts',query:{id:scope.row.id}})">编辑</span> -->
              <span class="tb-operation-link" @click="deleteCraft(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="自动报价工艺" name="first">
        <el-table :data="tableData" border style="width: 100%" >
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="techniqueName" label="工艺名称" width="100">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="父类别">
            <template slot-scope="scope">
              {{scope.row.catalog?scope.row.catalog.techniqueCatalogName:"-"}}
            </template>
          </el-table-column>
          <el-table-column prop="techniqueInfo" show-overflow-tooltip label="简介">
          </el-table-column>
          <el-table-column  prop=""  label="报价公式" width="100">
          <template slot-scope="scope">
                <div class="formulaInfo">
                    <span v-if="!scope.row.formulaInfo" @click="formulBtn(scope.row)">配置</span>
                    <span v-else @click="formulBtn(scope.row)">已配置</span>
                </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <span class="tb-operation-link" @click="$router.push({path:'/main/edit-crafts',query:{id:scope.row.id}})">编辑</span>
              <span class="tb-operation-link" @click="deleteCraft(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs> 

    <div class="pagination" v-show="tableData.length">
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="changPage"
        :page-size="pagination.pageSize"
        :current-page="pagination.pageIndex"
        :page-count="pagination.pageCount">
      </el-pagination>
    </div>

    <el-dialog title="添加类别"  :visible.sync="craftsTypeDlg.visible" :before-close="CloseCrafts"  width="500px">
      <div>
        <div class="error-bar" v-show="craftsTypeDlg.errVisible">{{craftsTypeDlg.errorMsg}}</div>
        <el-form label-position="left" ref="craftsTypeDlg" :rules="craftsTypeDlg.rules" :model="craftsTypeDlg.form" label-width="85px">
          <el-form-item label="工艺类别：" class="required" prop="name">
            <template slot-scope="scope">
              <div class="def-form-item">
                <el-input v-model="craftsTypeDlg.form.name"></el-input>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="父类别：" >
            <template slot-scope="scope">
              <div class="category"> 
                <div class="CommonTreeBtnHover">
                    <CommonTree  v-on:get-currentKey="getCurrentKey"  :checked-keys="SelectDatas" :expand-all="false" :set-width="width" :set-title='title' :btn-name='btnNameInput' :switch-state='false'></CommonTree>
                </div>
                <div class="categoryBtn">
                  <el-button type="primary" @click="submitCraftsType('craftsTypeDlg')">保存</el-button>
                </div>
              </div>
            </template>
          </el-form-item>
        </el-form>
        <el-table  :data="craftsTypeDlg.tableData" stripe  class="tableContent">
          <el-table-column  prop="techniqueCatalogName" label="工艺类别">
          </el-table-column>
          <!-- <el-table-column  prop="techniqueCatalogName" label="父类别">
          </el-table-column> -->
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <span class="tb-operation-link" @click="deleteCraftType(scope.row)">删除</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog title="添加人工报价工艺"  :visible.sync="craftsTypeDlgArt.visible" width="500px" :before-close="CloseCraftsArt">
      <el-form label-position="left" ref="craftsTypeDlgArt" :rules="craftsTypeDlgArt.rules" :model="craftsTypeDlgArt.form" label-width="85px">
        <el-form-item label="工艺名称：" class="required" prop="name">
          <template slot-scope="scope">
            <div class="def-form-item">
              <el-input v-model="craftsTypeDlgArt.form.name"></el-input>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="父类别：" class="required" prop="category">
          <template slot-scope="scope">
            <div class="category"> 
              <div class="CommonTreeBtn">
                  <CommonTree  v-on:get-currentKey="getCurrentKeyArt"  :checked-keys="SelectDatas" :expand-all="false" :set-width="width" :set-title='title' :btn-name='btnName' :switch-state='false'></CommonTree>
              </div>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="标签：" class="required" prop='radio'>
            <div class="craftType">
                <el-radio-group v-model="craftsTypeDlgArt.form.radio">
                  <el-radio :label="ele.id" v-for="ele in craftType" :key='ele.id'>{{ele.name}}</el-radio>
                </el-radio-group>
            </div>
        </el-form-item>
      </el-form>
      <div class="center">
        <el-button @click="craftsTypeDlgArt.visible = false">取 消</el-button>
        <el-button type="primary" @click="submitCraftsArt('craftsTypeDlgArt')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog  title="报价公式"  :visible.sync="formuldialog.DialogVisible"  width="50%">
      <div class="dialogcontent">
        <div class="left">
          <div class="left-top">
            <p>公式：</p>
            <el-form :model="ruleForm"  ref="ruleForm" label-width="30px">
              <el-form-item label="当" prop="condition">
                <el-input v-model="ruleForm.condition" placeholder="请输入执行条件"></el-input>
              </el-form-item>
              <el-form-item label="则" prop="formula">
                <el-input type="textarea" v-model="ruleForm.formula"  placeholder="请输入报价公式"></el-input>
              </el-form-item>
              <el-form-item> 
                <div class="buttonsubmit">
                  <el-button type="primary" @click="submitEditForm('ruleForm')" v-if="formuldialog.isChecked">编辑提交</el-button>
                  <el-button type="primary" @click="submitAddForm('ruleForm')" v-else>添加提交</el-button>
                  <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
                </div>
              </el-form-item>
            </el-form>
            <p>注：编写公式时，请参考右侧的符号说明。右侧没有的符号将无法解析。</p>
          </div>
          <div class="left-bottom">
            <div v-for="(item,index) in formuldialog.formulaInfo" :key="index">
              <span>公式{{index+1}}</span>
              <span>当：{{item.condition}}，则：{{item.formula}}</span>
              <span class="cursor" @click="formulaInfoEdit(item,index)">编辑</span>
              <span class="cursor" @click="formulaInfoDelete(index)">删除</span>
            </div>
            <div class="buttonsubmit">
              <el-button @click="testFormula">检验公式</el-button>
              <el-button @click="saveFormula">保存公式</el-button>
            </div> 
          </div>
        </div>
        <div class="right">
          <div class="tableSymbol">
            <p>参数符号</p>
            <div>
              <p><span>符号</span><span>说明</span></p>
              <p><span>N</span><span>数量</span></p>
              <p><span>L</span><span>长</span></p>
              <p><span>W</span><span>宽</span></p>
              <p><span>H</span><span>高</span></p>
              <p><span>S</span><span>表面积</span></p>
              <p><span>V</span><span>体积</span></p>
              <p><span>Y</span><span>材料单价</span></p>
              <p><span>C</span><span>加工单价</span></p>
              <p><span>P</span><span>材料密度</span></p>
              <p><span>T</span><span>壁厚</span></p>
            </div>
              <p>逻辑符号</p>
            <div>
              <p><span>符号</span><span>说明</span></p>
              <p><span>and</span><span>并且</span></p>
              <p><span>or</span><span>或</span></p>
            </div>
          </div>
          <div class="tableSymbol">
              <p>操作符号</p>
             <div>
              <p><span>符号</span><span>说明</span></p>
              <p><span>+</span><span>加</span></p>
              <p><span>+</span><span>减</span></p>
              <p><span>*</span><span>乘</span></p>
              <p><span>/</span><span>除</span></p>
              <p><span>^</span><span>乘方</span></p>
              <p><span>ln</span><span>自然数</span></p>
              <p><span>log10</span><span>10为低对数</span></p>
              <p><span>sqrt</span><span>开根</span></p>
              <p><span>()</span><span>括号</span></p>
            </div>
            <p>比较符号</p>
            <div>
              <p><span>符号</span><span>说明</span></p>
              <p><span><</span><span>小于</span></p>
              <p><span><=</span><span>小于或等于</span></p>
              <p><span>></span><span>大于</span></p>
              <p><span>>=</span><span>大于或等于</span></p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

  </div>
</template>
<script>
import OperationBar from "../compoents/operation-bar.vue";
import CommonTree from './Tree-common'
export default {
  components: {
    "v-operations": OperationBar,
    CommonTree
  },
  data() {
    return {
      activeName: 'second',
      formuldialog: {
        DialogVisible: false,
        formulaInfo: [],
        id: "",
        isChecked: false
      },
      ruleForm: {
        condition: "",
        formula: "",
        index: null
      },
      craftsTypeDlg: {
        visible: false,
        errVisible: false,
        errorMsg: "",
        form: {
          name: "",
          category:'',
          parentId:'',
        },
        rules: {
          name: [{ required: true, message: "请输入工艺类别", trigger: "blur" }],
        },
        tableData: []
      },
      craftsTypeDlgArt: {
        visible: false,
        errVisible: false,
        errorMsg: "",
        form: {
          name: "",
          category:'',
          parentId:'',
          radio:'',
        },
        rules: {
          name: [{ required: true, message: "请输入工艺类别", trigger: "blur" }],
          category: [{ required: true, message: "请选择父类别"}],
          radio: [{ required: true, message: "请选择标签"}],
        },
      },
      
      tableData: [],
      pagination: {},
      requestParams: {
        pageIndex: 1,
        pageSize: 10,
        techniquePurpose:460020 
      },
      craftType:[],
      SelectDatas:[],
      width:'30%',
      title:'添加父类别',
      btnName:'',
      btnNameInput:'',
    };
  },
  watch: {
  
  },
  created() {
    this.getList();
    this.craftType = this.$LocalStorage.getWords('160');
  },
  mounted() {},
  methods: {
    handleClick(tab, event) {
      if(tab.name=='first'){
        this.requestParams.techniquePurpose=460010;
      }else if(tab.name=='second'){
        this.requestParams.techniquePurpose=460020;
      }
      this.getList();
    },
    CloseCraftsArt(done) {
      this.$refs["craftsTypeDlgArt"].resetFields();
      this.craftsTypeDlgArt.errVisible = false;
      done();
    },
    CloseCrafts(done) {
      this.$refs["craftsTypeDlg"].resetFields();
      this.craftsTypeDlg.errVisible = false;
      done();
    },
    openDlg() {
      this.getCraftsTypeList();
      this.btnNameInput='';
    },
    openDlgArt(){
      this.craftsTypeDlgArt.visible=true
      this.btnName='';
    },
    submitCraftsType(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          let requestParams={
            techniqueCatalogName: this.craftsTypeDlg.form.name,
            parentId: this.craftsTypeDlg.form.id,
          }
          this.addCraftType(requestParams);
        } else {
          return false;
        }
      });
    },
    submitCraftsArt(ruleForm){
       this.$refs[ruleForm].validate(valid => {
        if (valid) {
          let requestParams={
            techniqueName: this.craftsTypeDlgArt.form.name,
            techniqueCatalogId: this.craftsTypeDlgArt.form.id,
            techniqueType:this.craftsTypeDlgArt.form.radio,
          }
          this.addCraftTypeArt(requestParams);
        } else {
          return false;
        }
      });
    },
    addCraftTypeArt(params) {
      this.$http.post("/operation/technique/addArtificial", params).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: res.data.message
          });
          this.craftsTypeDlgArt.visible=false;
          this.$refs["craftsTypeDlgArt"].resetFields();
          this.activeName='second';
          this.craftsTypeDlgArt.form.id=null;
          this.requestParams.techniquePurpose=460020;
          this.getList();
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    addCraftType(params) {
      this.$http.post("/operation/techniqueCatalog/add", params).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: res.data.message
          });
          this.$refs["craftsTypeDlg"].resetFields();
          this.craftsTypeDlg.form.id=null;
          this.btnNameInput='';
          this.getCraftsTypeList();
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    deleteCraftType(row) {
      this.$http.post("/operation/techniqueCatalog/deleted", { id: row.id }).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: res.data.message
            });
            this.getCraftsTypeList();
          } else {
            this.$message({
              type: "error",
              message: res.data.message
            });
          }
        });
    },
    getCraftsTypeList() {
      this.$http.post("/operation/techniqueCatalog/getList").then(res => {
        if (res.data.code == 200) {
          this.craftsTypeDlg.tableData = res.data.data.length>0?res.data.data:[];
          this.craftsTypeDlg.visible = true;
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    changPage(pageIndex) {
      this.requestParams.pageIndex = pageIndex;
      this.getList();
    },
    getList() {
      this.$http.post("/operation/technique/getList", this.requestParams).then(res => {
        if (res.data.code == 200) {
            this.tableData = res.data.data.length>0?res.data.data:[];
            this.pagination = res.data.pagination;
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    deleteCraft(row) {
      this.$http.post("/operation/technique/deleted", { id: row.id }).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: res.data.message
            });
            this.getList(this.requestParams);
          } else {
            this.$message({
              type: "error",
              message: res.data.message
            });
          }
        });
    },
    //配置计价公式
    formulBtn(item) {
      this.formuldialog.DialogVisible = true;
      // console.log(item);
      this.formuldialog.id = item.id;
      this.formuldialog.formulaInfo = item.formulaInfo;
    },
    //编辑计价公式；
    formulaInfoEdit(item, index) {;
      this.ruleForm.index=index
      this.ruleForm.condition = item.condition;
      this.formuldialog.isChecked = true;
      this.ruleForm.formula = item.formula;
    },
    //删除计价公式;
    formulaInfoDelete(index) {
      this.formuldialog.formulaInfo.splice(index, 1);
      this.$refs["ruleForm"].resetFields();
      this.formuldialog.isChecked = false;
    },
    //保存计价公式API
    saveFormula() {
      let requestParams = this.formuldialog.formulaInfo;
      let id = this.formuldialog.id;
      this.$http.post("/operation/technique/saveFormula", {formulaList: requestParams,id: id}).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: res.data.message
            });
            this.formuldialog.DialogVisible = false;
            this.getList();
          } else {
            this.$message({
              type: "error",
              message: res.data.message,
              duration: 1000 //设置窗口关闭默认时间；
            });
          }
        });
    },
    //测试计价公式API
    testFormula() {
      let requestParams = this.formuldialog.formulaInfo;
      this.$http.post("/operation/technique/testFormula", {formulaList: requestParams})
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: res.data.message
            });
          } else {
            this.$message({
              type: "error",
              message: res.data.message,
              duration: 1000 //设置窗口关闭默认时间；
            });
          }
        });
    },
    //编辑提交计价公式；
    submitEditForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const ObjEdit = {};
          ObjEdit.condition = this.ruleForm.condition;
          ObjEdit.formula = this.ruleForm.formula;
          this.formuldialog.formulaInfo.splice(this.ruleForm.index, 1, ObjEdit);
          // console.log('formuInfo--',this.formuldialog.formulaInfo);
          this.$refs["ruleForm"].resetFields();
          this.formuldialog.isChecked = false;
        } else {
          return false;
        }
      });
    },
    //添加提交计价公式；
    submitAddForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // console.log(this.ruleForm);
          const ObjAdd = {};
          ObjAdd.condition = this.ruleForm.condition;
          ObjAdd.formula = this.ruleForm.formula;
          //判断是否为空，赋值空数组保存数据;
          this.formuldialog.formulaInfo?this.formuldialog.formulaInfo: this.formuldialog.formulaInfo=[];
          this.formuldialog.formulaInfo.push(ObjAdd);
          this.$refs["ruleForm"].resetFields();
          this.formuldialog.isChecked = false;
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    getParentOpara(parentData){
      let ArrayName=[];
      let stringName=''
      let TempData=parentData;
      if(parentData){
        for(let i=0;i<parentData.level;i++){
            ArrayName.push(TempData["label"])
            TempData=TempData["parent"]
        }
        for(let i=parentData.level-1; i>=0;i--){
            stringName += ArrayName[i]+'>'
        }
        stringName=stringName.slice(0,stringName.length-1);
      }else{
        stringName='';
      }
      return stringName;
    },
    getCurrentKey(takeDate,keyDate,parentData){
      this.btnNameInput=this.getParentOpara(parentData);
      this.craftsTypeDlg.form.id=keyDate[0];
    },
    getCurrentKeyArt(takeDate,keyDate,parentData){
      this.btnName=this.getParentOpara(parentData);
      this.craftsTypeDlgArt.form.category=this.getParentOpara(parentData);
      this.craftsTypeDlgArt.form.id=keyDate[0];
    }
  }
};
</script>

<style lang="less">
#crafts-manage{
  .el-form-item__content{
    line-height: 0px;
  }
  .CommonTreeBtnHover,.CommonTreeBtn{
      .el-button{
        width: 280px;
        min-height: 40px;
        background-color: #fff;
        text-align: left;
        border: 1px solid #dcdfe6;
        padding: 0px 20px;
        margin-right: 20px;
        white-space:pre-wrap;
        span{
          display: block;
          line-height: 18px;
          color: #777;
        }
      }
    }
  .CommonTreeBtn{
     .el-button{
      width: 375px;
      margin-right: 0px;
     }
  }
  .tableContent{
    width: 100%;
    height: 300px;
    overflow-y:scroll; 
  }
}
</style>

<style lang="less" scoped>
.def-form-item {
  display: flex;
  .right-operation {
    height: 40px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-left: 10px;
  }
}
.tb-operation-link {
  color: #409eff;
  text-decoration: underline;
  cursor: pointer;
}
.error-bar {
  height: 30px;
  text-align: center;
  line-height: 30px;
  color: #f56c6c;
  background-color: #fdf6ec;
  margin-bottom: 20px;
}
.formulaInfo {
  cursor: pointer;
}
.dialogcontent {
  display: flex;
  .left {
    flex: 2;
    padding: 30px;
    border-right: 1px solid #797979;
    .left-top {
      p {
        padding: 0 0 20px 0;
      }
    }
    .left-bottom {
      border-top: 1px solid #0e0e0e;
      padding-top: 10px;
      > div {
        display: flex;
        text-align: center;
        margin: 10px 0;
        span:nth-child(1) {
          flex: 0 1 15%;
          font-weight: bold;
        }
        span:nth-child(2) {
          flex: 0 1 66%;
          text-align: left;
        }
        span:nth-child(3) {
          flex: 0 1 12%;
        }
        span:nth-child(4) {
          flex: 0 1 12%;
        }
      }
    }
  }
  .right {
    flex: 3;
    padding-left: 30px;
    display: flex;
    .tableSymbol {
      flex: 1;
      padding: 10px;
      > p {
        padding: 20px 0 0 0;
      }
      > div {
        border: 1px solid #0c0c0c;
        > p {
          display: flex;
          span {
            flex: 1;
            box-sizing: content-box;
            box-sizing: content-box;
            display: inline-block;
            text-align: center;
            border: 1px solid #0c0c0c;
          }
        }
      }
    }
  }
  .buttonsubmit {
    display: flex;
    justify-content: center;
  }
  .cursor{
    cursor: pointer;
  }
}
.category,.craftType{
  display: flex;
  align-items: center; 
}
.craftType{
  height: 40px;
}
.pagination {
  margin-top: 10px;
}
</style>


