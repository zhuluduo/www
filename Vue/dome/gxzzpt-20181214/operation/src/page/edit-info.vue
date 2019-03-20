<template>
  <div>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>信息发布</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/main/info-manage'}">信息列表</el-breadcrumb-item>
        <el-breadcrumb-item>信息编辑</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="form">
        <el-form label-position="left" label-width="80px" :model="form" :rules="rules" ref="form">
         <el-form-item label="标题：" class="required" prop="title">
           <el-input type="text" v-model="form.title"></el-input>
         </el-form-item>
          <el-form-item label="模块：" class="required" prop="materialName">
           <el-select v-model="form.moduleId" @change="changeModule">
              <el-option :label="item.moduleName" :value="item.id" v-for="(item,i) in moduleList" :key="i"></el-option>
            </el-select>
         </el-form-item>
          <el-form-item label="工艺：">
            <!-- <div class="BusinessType" >
            <el-checkbox-group v-model="form.techniqueTypes" >
                <el-checkbox v-for="(item,index) in techniqueData" :label="item.id" :key="index"  >{{item.name}}</el-checkbox>
            </el-checkbox-group>
            </div> -->
          <div class="BusinessTrees">
            <div class="Treebtn">
              <CommonTree  v-on:get-currentKey="getCurrentKey" :checked-nodes="Tree.SelectNode"  :checked-keys="Tree.SelectDatas" :expand-all="false" :set-width="Tree.width" :set-title='Tree.title' :btn-name='Tree.btnName' :switch-state='true' :max-length='20'></CommonTree>
            </div>
          </div>
        </el-form-item>
          <el-form-item label="分类：" class="required" prop="materialName">
            <div class="sp-row">
              <el-select  v-model="form.catalogId">
                <el-option :label="item.catalogName" :value="item.id" v-for="(item,i) in catalogList" :key="i"></el-option>
              </el-select>
              <div class="manage-btn"  @click="showForm">管理分类</div>
            </div>
         </el-form-item>
         <el-form-item  label="主图：" class="" prop="coverPicturl">
           <az-upload @imgUrl="upload" :img="form.coverPicturl"></az-upload>
         </el-form-item>
         <el-form-item  label="标签：" class="" prop="tags">
           <el-select
              v-model="form.tags"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请输入标签">
              <el-option
                v-for="item in tagArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
         </el-form-item>
         <el-form-item  label="内容：" class="editor" prop="content">
           <quill-editor v-model="form.content" :options="editorOption">
              </quill-editor>
         </el-form-item>
        </el-form>
        <div class="btn-area">
          <el-button>清空</el-button>
          <el-button @click="submit">提交</el-button>
      </div>
      </div>
       <el-dialog 
        center 
      title="分类管理"
      width="500px"
      :visible.sync="show">
      <div>
        <el-collapse-transition>
          <div class="form-msg" v-show="errRes">{{errRes}}</div>
        </el-collapse-transition>
        <div>模块：{{this.catalogForm.module.moduleName}}</div>
        <div class="form-row">
          <div class="left">
            <el-form label-position="left" ref="catalogForm" :rules="rules" :model="catalogForm">
              <el-form-item label="" class="required" prop="catalogName">
                <el-input v-model="catalogForm.catalogName"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="right">
            <el-button type="primary" @click="addSort">添加</el-button>
          </div>
        </div>
      </div>
      <ul class="form-list">
        <li>
          <div class="left">分类名称</div>
          <div class="right">操作</div>
        </li>
        <li v-for="(item,i) in catalogForm.list" :key="i">
          <div class="left">
            <span  v-show="!item.edit">{{item.catalogName}}</span>
            <el-input type="text" v-model="item.catalogName" v-show="item.edit"></el-input>
          </div>
          <div class="right">
            <span class="btn" v-show="!item.edit" @click="item.edit=!item.edit">修改</span>
            <span class="btn" v-show="item.edit" @click="updateSort(item)">保存</span>
          </div>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>
<script>
import CommonTree from './Tree-common'
export default {
  components: {
       CommonTree
  },
  data() {
    const checkNull = (rule,value,callback)=>{
      if(value){
        callback();
      }else{
        callback(new Error('请输入正确的值'))
      }
    }
    const checkTags = (rule,value,callback)=>{
      var reg = /^(\S{1,}){1}([,\uff0c]\S{1,}){0,}$/
      if(reg.test(value)){
        callback();
      }else if(!value){
        callback();
      }else{
        callback(new Error("输入格式有误，多个标签请用逗号隔开"))
      }
    }
    return {
      tagArr:[],
      show:false,
      errRes:"",
      editorOption: {
        placeholder: "请输入内容"
      },
      techniqueData:[],
      form: {
        title: "",
        catalogId: "",
        moduleId:"",
        coverPicturl: "",
        tags: "",
        techniqueTypes:[],
        content: ""
      },
      catalogForm: {
        module: {},
        catalogName: "",
        list: []
      },
      rules: {
        title:[{validator:checkNull,trigger:"blur"}],
        // tags:[{validator:checkTags,trigger:"blur"}],
      },
      moduleList: [],
      catalogList: [],
      Tree:{
        SelectDatas:[],
        SelectNode:[],
        width:'30%',
        title:'选择工艺',
        btnName:''
      }
    };
  },
  created() {
     var id = this.$route.query.id;
    this.form.id = Number(id);
 //   this.getAllCatalog();
    this.getDetail();
    this.$http.post('/getWords').then(res=>{
    if(res.data.code==200){
      var jsonObj = res.data.data;
      for(let i in jsonObj){
        if(i==105){this.techniqueData=jsonObj[i].item}
      }
    }
  })
  },
  mounted() {},
  methods: {
    updateSort(row) {
      var data = {
        id: row.id,
        catalogName: row.catalogName
      };
      this.$http.post("/operation/catalog/update", data).then(res => {
        if (res.data.code == 200) {
          this.updateList();
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    addSort() {
      var data = {
        moduleId: this.catalogForm.module.id,
        catalogName: this.catalogForm.catalogName
      };
      this.$http.post("/operation/catalog/add", data).then(res => {
        if (res.data.code == 200) {
          this.updateList();
        } else {
          this.$message({
            type: "error",
            message: res.data.message
          });
        }
      });
    },
    updateList() {
      this.$http.post("/operation/module/all").then(res => {
        if (res.data.code == 200) {
          res.data.data.map(ele => {
            if (ele.id == this.catalogForm.module.id) {
              this.catalogForm.list = ele.catalogList;
            }
          });
          this.catalogForm.list.map(item => {
            this.$set(item, "edit", false);
          });
          this.catalogForm.catalogName = "";
          this.catalogList = JSON.parse(JSON.stringify(this.catalogForm.list));
          
        }
      });
    },
    showForm() {
      this.show = true;
      this.catalogForm.moduleId = this.form.moduleId;
      this.moduleList.map(ele => {
        if (ele.id == this.catalogForm.moduleId) {
          this.catalogForm.module = ele;
        }
      });
      this.catalogForm.list = JSON.parse(JSON.stringify(this.catalogList));
    },
    getDetail(){
      let techniqueInfo=[];
      let nameLists=[];
      this.$http.post('/operation/information/get',{id:this.form.id}).then(res=>{
        if(res.data.code == 200){
          this.form.title = res.data.data.title;
          this.form.moduleId = res.data.data.moduleInfo.id;
          this.form.catalogId = res.data.data.catalogInfo.id;
          this.form.coverPicturl = res.data.data.coverPicturl;
          this.Tree.Selectname=res.data.data.techniqueList;
          this.form.content = res.data.data.content;
          this.form.tags = res.data.data.tags?res.data.data.tags.split(','):[];
          for(let item in res.data.data.techniqueList){
              techniqueInfo.push(res.data.data.techniqueList[item].id)
              nameLists.push(res.data.data.techniqueList[item].technique_name)
          }
           this.form.techniqueIds=techniqueInfo;
           this.Tree.SelectDatas=techniqueInfo;
           this.Tree.btnName = (nameLists.toString());
           this.getAllCatalog();
        }
      })
    },
    getCurrentKey(takeDate, keyDate){
      this.form.techniqueIds=keyDate;
      var nameList = [];
      takeDate.map(( item ) => {
          nameList.push(item.techniqueName);
      })
      this.Tree.btnName = (nameList.toString());
    },
    submit(){
      this.$refs['form'].validate(valid=>{
        if(valid){
          var data = {
            id:this.form.id,
            title: this.form.title,
            catalogId:  this.form.catalogId,
            coverPicturl:  this.form.coverPicturl,
            tags:  this.form.tags.join(','),
            content:  this.form.content,
            techniqueIds:this.form.techniqueIds
          }
          this.$http.post('/operation/information/update',data).then(res=>{
            if(res.data.code == 200){
              this.$router.push({path:"/main/info-manage"})
            }else{
              this.$message({
                type:"error",
                message:res.data.message||"添加失败"
              })
            }
          }).catch(res=>{

          })
        }else{
          return false;
        }
      })
    },
    upload(imgObj){
     this.form.coverPicturl= imgObj.imgUrl;
    },
    changeModule(i) {
      // this.catalogList = this.moduleList[i].catalogList;
      this.catalogList = [];
      this.moduleList.map(ele=>{
        if(ele.id == i){
          this.catalogList = ele.catalogList;
        }
      });
      this.form.catalogId = this.catalogList[0].id;
    },
    getAllCatalog() {
      this.$http.post("/operation/module/all").then(res => {
        if (res.data.code == 200) {
          this.moduleList = res.data.data;
          this.moduleList.forEach(item => {
            if(item.id == this.form.moduleId) {
              this.catalogList = item.catalogList;
            }
          });
        }
      });
    }
  }
};
</script>
<style lang="less">
.BusinessType{
    width: 100%;
    height: 152px;
    overflow-x: hidden;
    overflow-y: scroll;
    border: 1px solid #e2e2e2;
    padding: 7px 0;
    background: #fff;
    label{display: block;margin-left: 0!important;padding: 2px 10px;line-height: 0!important;}
    label+label{margin-bottom: 5px;}
}
.BusinessTrees{
  .Treebtn{
    width: 718px;
    min-height: 40px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    button{
      width: 100%;
      background: #fff;
      border: none;
      color: #606266;
      text-align: left;
      line-height: 21px;
      word-break: break-all;
      word-wrap: break-word;
      white-space: pre-wrap;
    }
  }
}
</style>
<style lang="less" scoped>
@common-color: #20a0ff;
.form {
  width: 800px;
  margin-top: 40px;
}
.editor {
  height: 300px;
}
.btn-area {
  height: 80px;
  align-items: center;
  display: flex;
  justify-content: space-around;
}
.sp-row{
  position: relative;
  .manage-btn{
    display: inline-block;
    position: absolute;
    right:-70px;
    top:0px;
    color: @common-color;
    text-decoration: underline;
    cursor: pointer;
  }
}
.form-row {
  display: flex;
  margin-top: 22px;
  .left {
    flex: 1;
  }
  .right {
    margin-left: 20px;
  }
}
.form-list {
  > li {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    // justify-content: space-between;
    .left {
      // width: 50%;
      flex: 1;
    }
    .right {
      width: 100px;
      text-align: center;
    }
    & + li {
      margin-top: 22px;
    }
  }
  .btn {
    color: @common-color;
    text-decoration: underline;
    cursor: pointer;
  }
}
</style>
