<template>
  <div>
    <div class="section-title section-title-border">
    <div class="pull-left">
        <h5><span>角色管理</span></h5>
    </div>
    <div class="pull-right">
        <el-button type="primary" size="small" @click="addPower">新增权限</el-button>
    </div>
    </div>
    <div class="section-ng-scope">
        <div class="searchSection">
              <el-select v-model="selectItem"  @change="selectGroup" placeholder="请选择" size="small">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
            <div class="auth_Name">
                 <span class="auth_Name_txt"  @click="searchAuthName" >权限名称/父权限名称</span>
            </div>
        </div>
         <el-table :data="tableRole" style="width: 100%" v-loading="loading" element-loading-text="拼命加载中"  ref="multipleTable" class="expands"  empty-text="查询不到相关的记录" align="left"
            row-key="id"
            @expand-change="expandchange"
            :expand-row-keys="expands"
            @cell-mouse-enter="cellmouseenter"
            @cell-mouse-leave="cellmouseleave"
            :row-class-name="tableRowClassName"
         >
      <el-table-column type="expand">
          <template slot-scope="props">
                <el-table
                :data="levelTwo"
                style="width: 100%" ref="levelTwoTable"  row-key="id"  @expand-change="expandchangeTwo" class="expandsTwo" :expand-row-keys="expandsTwo"   @cell-mouse-enter="cellmouseenter" @cell-mouse-leave="cellmouseleave" :row-class-name="tableRowClassName" empty-text="查询不到相关的记录" :show-header=false>
                   <el-table-column type="expand">
                    <template slot-scope="props">
                    <el-table
                    :data="levelThree"
                    style="width: 100%" class="expandThree"  @cell-mouse-enter="cellmouseenter" @cell-mouse-leave="cellmouseleave"  :row-class-name="tableRowClassName"  empty-text="查询不到相关的记录"  :show-header=false>
                        <el-table-column prop="authName" label="权限名称"></el-table-column>
                        <el-table-column prop="roleRemark" label="权限描述"></el-table-column>
                        <el-table-column prop="ordId" label="排序"></el-table-column>
                    <el-table-column   width="140">
                    <template slot-scope="scope">
                         <div v-if="scope.row.isDelete==true">    
                        <i class="iconSize iconColor1 el-icon-edit-outline" @click="editdDialog(scope.row,scope.$index)"></i>
                        <i class="iconSize iconColor2 el-icon-document" @click="details(scope.row,scope.$index)"></i>
                        <i class="iconSize iconColor3 el-icon-circle-close-outline"></i>
                        </div>
                    </template>
                    </el-table-column>
                    </el-table>
                    </template>
                     </el-table-column>
                    <el-table-column prop="authName" label="权限名称"></el-table-column>
                    <el-table-column prop="roleRemark" label="权限描述"></el-table-column>
                    <el-table-column prop="ordId" label="排序"></el-table-column>
                    <el-table-column   width="140">
                    <template slot-scope="scope">
                    <div v-if="scope.row.isDelete==true">
                    <i class="iconSize iconColor1 el-icon-edit-outline" @click="editdDialog(scope.row,scope.$index)"></i>
                    <i class="iconSize iconColor2 el-icon-document" @click="details(scope.row,scope.$index)"></i>
                    <i class="iconSize iconColor3 el-icon-circle-close-outline"></i>
                    </div>
                    </template>
                    </el-table-column>
                </el-table>
          </template>
      </el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="roleRemark" label="权限描述"></el-table-column>
      <el-table-column prop="ordId" label="排序"></el-table-column>
      <el-table-column   width="140">
          <template slot-scope="scope">
              <div v-if="scope.row.isDelete==true">
                  <i class="iconSize iconColor1 el-icon-edit-outline" @click="editdDialog(scope.row,scope.$index)"></i>
                  <i class="iconSize iconColor2 el-icon-document" @click="details(scope.row,scope.$index)"></i>
                  <i class="iconSize iconColor3 el-icon-circle-close-outline"></i>
              </div>
          </template>
      </el-table-column>
    </el-table>
   </div>
        <el-dialog :title="dialogName" :visible.sync="dialogVisible"  width="40%" @close="close">
            <div class="contenter" v-if="qxdetails==1">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                      <el-form-item label="所属系统" prop="region">
                        <el-select v-model="ruleForm.region" placeholder="请选择所属系统">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="权限名称" prop="name">
                            <el-input v-model="ruleForm.name"></el-input>
                      </el-form-item>
                      <el-form-item label="权限描述" prop="roleRemark">
                            <el-input type="textarea" v-model="ruleForm.roleRemark"></el-input>
                       </el-form-item>
                      <el-form-item label="图标class" prop="iconclass">
                            <el-input v-model="ruleForm.iconclass"></el-input>
                      </el-form-item>
                       <el-form-item label="父权限" prop="upId">
                        <el-select v-model="ruleForm.upId" placeholder="请选择父权限">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="菜单类型" prop="menutype">
                        <el-radio-group v-model="ruleForm.menutype">
                        <el-radio label="线上品牌商赞助"></el-radio>
                        <el-radio label="线下场地免费"></el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item label="权限action" prop="jurisdiction">
                            <el-input v-model="ruleForm.jurisdiction"></el-input>
                      </el-form-item>
                      <el-form-item label="排序" prop="sort">
                            <el-input v-model="ruleForm.sort"></el-input>
                      </el-form-item>
                      <el-form-item label="是否启用" prop="startup">
                        <el-switch v-model="ruleForm.startup"></el-switch>
                      </el-form-item>
                      <el-form-item class="forItem">
                        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                      </el-form-item>
                </el-form>    
            </div>
              <div class="contenter" v-if="qxdetails==2">
                  详情
                  {{detailsArray}}
              </div>
              <div class="contenter auth_box" v-if="qxdetails==3">
                  <div class="auth_search">
                     <el-input v-model.trim="auth.auth_Name" ref="auth_Name"  @keyup.enter.native="auth_btn" placeholder="权限名称/父权限名称" size="small"></el-input>
                     <el-button type="primary" @click.native.prevent="auth_btn"  size="mini">搜索</el-button>
                  </div>
                  <div class="auth_content">
                      <span class="auth_no" v-if="auth.auth_content==''||auth.auth_content==null">查询不到相关的记录</span>
                      <div class="auth_block" v-else>
                          <ul>
                              <div class="auth-box-title">
                                  <span>权限名称</span><span class="two-txt">权限描述</span><span>排序</span><span style="width:12%">权限层级</span><span class="Last-txt">操作</span>
                              </div>
                              <div class="auth-box-content" v-loading="openFullScreen" element-loading-text="拼命加载中">
                                    <li v-for="(item,index) in auth.auth_content" >
                                    <span>{{item.authName}}</span>
                                    <span class="two-txt two-txt-remark" >{{item.roleRemark}}</span>
                                    <span>{{item.ordId}}</span>
                                    <span style="width:12%">{{item.level}}</span>
                                    <span class="Last-txt"><label  @click="auth_details(item,index)">详情</label><label @click="editdDialog(item,index)">编辑</label></span>
                                    </li>
                              </div>
                          </ul>
                      </div>
                  </div>
              </div>
        </el-dialog>
  </div>
</template>


<script>
    export default{
        data(){
            return{
                dialogVisible: false,
                openFullScreen:false,
                tableRole:[],
                tableID:'',
                levelTwo:[],
                levelThree:[],
                rowId:'',
                expands:[],
                expandsTwo:[],
                loading:false,
                dialogName:'',
                qxdetails:'',
                detailsArray:[],
                Parameters:{
                    appId:0,
                    level:1,
                    authName:'',
                },
                options: [{
                value: 0,
                label: '所有系统'
                }, {
                value: 1,
                label: '街坊'
                }, {
                value: 2,
                label: '店宝'
                }, {
                value: 3,
                label: '进销存'
                }, {
                value: 4,
                label: '财务'
                }, {
                value: 5,
                label: '收银机'
                }, {
                value: 6,
                label: '经销商'
                }, {
                value: 7,
                label: '仓库'
                }, {
                value: 8,
                label: '转角平台账套权限'
                }, {
                value: 9,
                label: '转角金服账套权限'
                }],
                selectItem:1,
                counter: 0,
                auth:{
                    auth_Name:'',
                    auth_content:[],
                },
                ruleForm:{
                    region:'',
                    name:'',
                    roleRemark:'',
                    iconclass:'',
                    upId:'',
                    menutype:'',
                    jurisdiction:'',
                    sort:'',
                    startup:false,
                },
                rules: {
                    region: [
                        { required: true, message: '请选择所属系统', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请输权限名称', trigger: 'blur' },
                    ],
                    roleRemark: [
                        { required: true, message: '请填写权限描述', trigger: 'blur' }
                    ],
                    menutype: [
                        { required: true, message: '请选择菜单类型', trigger: 'change' }
                    ],
                    upId:[
                        { required: true, message: '请选择父级权限', trigger: 'change' }    
                    ],
                    jurisdiction:[
                        { required: true, message: '请输入权限action', trigger: 'blur' },
                    ],
                    sort:[
                            { required: true, message: '序号不能为空', trigger: 'blur'},
                    ]
                }
            }
        },
        methods:{
            /*select筛选*/
            selectGroup(){
                let _this=this;
                _this.rowId='';
                _this.Parameters.level=1;
                _this.Parameters.authName='';
                _this.getTable();
            },
            /*权限新增*/
                addPower(){
                let _this=this;
                _this.qxdetails=1;
                _this.dialogName="新增权限";
                _this.dialogVisible=true;      
                },
            /*搜索*/
            searchAuthName(){
                let _this=this;
                _this.qxdetails=3
                _this.dialogName="权限搜索" 
                _this.dialogVisible=true;
                
            },
            /*搜索数据显示*/
            auth_btn(){
                let _this=this;
                _this.openFullScreen=true;
                 let url='/api/zjjf-auth/auth/auth?authName=';
                 _this.$ajaxs(url+_this.auth.auth_Name).then((res)=>{
                        _this.auth.auth_content=res.data.list;
                        _this.openFullScreen=false;
                 }).catch((error)=>{
                     this.$message.error('数据加载失败');
                 })
            },
             /*搜索数据回传*/
            auth_details(row,index){
                let _this=this;
                _this.dialogVisible=false; 
                _this.auth_detailsInfo(row);
            },
            /*一级展开或者关闭切换*/
            expandchange(row, expandedRows){
                  let _this=this;
                  let index=1
                  _this.Parameters.authName='';
                  _this.expandLIst(index,row)
            },
             /*二级展开或者关闭切换*/
            expandchangeTwo(row, expandedRows){
                  let _this=this;
                  let index=2
                  _this.expandLIst(index,row)
            },
             /*公共数据*/
             expandLIst(index,row){
                  let _this=this;
                  _this.Parameters.level=row.level+1;
                  _this.rowId=row.id
                 _this.getTable()
                 if(index==1){
                 _this.expands=[];
                 _this.expands.push(row.id);
                 }else if(index==2){
                 _this.expandsTwo=[];
                 _this.expandsTwo.push(row.id);
                 }
             },
             /*鼠标移入*/
            cellmouseenter(	row, column, cell, event){
                row.isDelete=true
            },
            cellmouseleave(row, column, cell, event){
                row.isDelete=false
            },
            tableRowClassName({row, rowIndex}){
                   if (row.id === this.tableID) {
                    return 'warning-row';
                    } else{
                    return '';
                    }
            },
            /*点击任意一行是否张开---组件复用*/
            toggleSelect(row, event, column){
                let _this=this;
                // /*level=1一级导航*/
                // if(row.level==1){
                //    for(var i=0;i<_this.tableRole.length;i++){
                //     if(_this.tableRole[i].authName==row.authName){
                //        _this.$refs.multipleTable.toggleRowExpansion(_this.tableRole[i],true);
                //        _this.counter+=1;
                //        row.index= _this.counter
                //        console.log(_this.counter)
                //     }else{
                //       _this.$refs.multipleTable.toggleRowExpansion(_this.tableRole[i],false);
                //     //   _this.counter=0;
                //     }
                //     }
                // /*level=2二级导航*/
                // }else if(row.level==2){
                //     for(var i=0;i<_this.levelTwo.length;i++){
                //     if(_this.levelTwo[i].authName==row.authName){
                //        _this.$refs.levelTwoTable.toggleRowExpansion(_this.levelTwo[i],true);
                //     }else{
                //       _this.$refs.levelTwoTable.toggleRowExpansion(_this.levelTwo[i],false);
                //     }
                //     }
                // }
                //   _this.Parameters.level=row.level+1;
                //   _this.rowId=row.id
                //  _this.getTable()

            },
            /*动态加载数据*/
            getTable(obj,obj2){
                let _this=this;
                let url='/api/zjjf-auth/auth/auth?appId=';
                _this.$ajaxs(url+_this.selectItem+'&upId='+_this.rowId+'&level='+_this.Parameters.level+'&authName='+_this.Parameters.authName).then((res)=>{
                    if(_this.Parameters.level==1){
                         _this.loading=true;
                         _this.tableRole=res.data.list;
                         _this.loading=false;
                         _this.tableExpand(obj,obj2);
                    }else if(_this.Parameters.level==2){
                        _this.levelTwo=res.data.list
                    }else if(_this.Parameters.level==3){
                         _this.levelThree=res.data.list
                    }
                }).catch((error)=>{
                    // console.log(error)
                })
            },
            auth_detailsInfo(row){
                let _this=this;
                _this.tableID=row.id;
                let url='/api/zjjf-auth/auth/auth?appId=';
                _this.$ajaxs(url+row.appId).then((res)=>{
                    let auth1=[];
                    let eupId=[];
                    let tableExpand1=[];
                    let tableExpand2=[]
                    auth1=res.data.list
                    if(row.level==1){
                        _this.selectItem=auth1[0].appId;
                        _this.rowId=auth1[0].upId;
                        _this.Parameters.level=auth1[0].level;
                    }else if(row.level==2){
                       for(var k=0;k<auth1.length;k++){
                        if(auth1[k].id==row.upId){
                            _this.selectItem=auth1[k].appId;
                            _this.rowId=auth1[k].upId;
                            _this.Parameters.level=auth1[k].level;
                            _this.Parameters.authName=auth1[k].authName;
                            tableExpand1.push(auth1[k])
                        }
                    }
                    }else if(row.level==3){
                        for(var i=0;i<auth1.length;i++){
                         if(auth1[i].id==row.upId){
                            eupId.push(auth1[i])
                            tableExpand2.push(auth1[i])
                             }
                    }
                    for(var j=0;j<auth1.length;j++){
                        if(auth1[j].id===eupId[0].upId){
                            _this.selectItem=auth1[j].appId;
                            _this.rowId=auth1[j].upId;
                            _this.Parameters.level=auth1[j].level;
                            _this.Parameters.authName=auth1[j].authName;
                            tableExpand1.push(auth1[j])
                        }
                    }
                    }
                       _this.getTable(tableExpand1,tableExpand2);
                }).catch((error)=>{
                    console.log("失败6666")
                })
            },
                /*搜索回调相应栏目展开*/
              tableExpand(val,obj2){
                let _this=this;
                let index=0;
                _this.Parameters.level=val[index].level+1;
                _this.rowId=val[index].id;
                _this.Parameters.authName='';
                _this.getTable();
               _this.expands.push(val[index].id);
                setTimeout(() => {
                    if(obj2[index]!=undefined){
                    _this.Parameters.level=obj2[index].level+1;
                    _this.rowId=obj2[index].id;
                    _this.Parameters.authName='';
                    _this.getTable();
                    _this.expandsTwo.push(obj2[index].id);
                    }
                    }, 500);
                
                 },
                /*编辑*/
                editdDialog(row,index){
                    let _this=this;
                    _this.qxdetails=1
                    _this.dialogName="数据编辑" 
                    _this.ruleForm={
                        region:'',
                        name:row.authName,
                        roleRemark:row.roleRemark,
                        iconclass:row.icon,
                        upId:'',
                        menutype:'',
                        jurisdiction:row.action,
                        sort:row.ordId,
                        startup:true,
                    }
                    _this.dialogVisible=true;
                },
                /*详情*/
                details(row,index){
                    let _this=this;
                    _this.qxdetails=2
                    _this.dialogName="数据详情" 
                    _this.detailsArray=row;
                    _this.dialogVisible=true;
                },
                /*数据提交*/
                submitForm(formName) {
                    let _this=this;
                    this.$refs[formName].validate((valid) => {
                    if (valid) {
                        // console.log(_this.ruleForm)
                    } else {
                        // console.log('error submit!!');
                        return false;
                    }
                    });
                },
                    resetForm(formName) {
                        this.$refs[formName].resetFields();
                    },
            /*Dialog关闭回调*/
            close(){
                let _this=this;
                _this.auth.auth_Name=''
                _this.auth.auth_content=''
            }
        },
        mounted(){
            let _this=this;
            _this.getTable();
            // let url='/api/zjjf-auth/auth/auth?appId=2&level=2';
            //     _this.$ajaxs(url).then((res)=>{
            //         console.log(res.data)
            //     }).catch((error)=>{
            //         console.log(error)
            //     })
        }
    }
</script>
<style lang="scss">
.expands .el-table__expanded-cell[class*=cell]{padding:20px 5px;}
.expandsTwo .el-table__expanded-cell[class*=cell]{padding:20px 0;}
// .el-table--enable-row-hover .el-table__body tr:hover>td{background-color: red;}
.el-table--enable-row-hover .el-table__body tr.warning-row:hover>td{background-color: oldlace;}
.expands.el-table--enable-row-hover .el-table__body tr.expanded:hover>td{background-color: #bfbcbc;color: #fff;}
.expandsTwo.el-table--enable-row-hover .el-table__body tr.expanded:hover>td{background-color: #a2bfd0;color: #fff;}
.forItem{
    text-align:center;
    .el-form-item__content{margin-left: 0px!important;}
}
    .el-table .warning-row {
    background: oldlace;
  }
    .expands .expanded{
        background-color: #bfbcbc;
        color: #fff;
        }
    .expandsTwo .expanded{
        background-color: #a2bfd0;
        color: #fff;
    }
</style>

<style lang="scss"  scoped>
    a{cursor: pointer;
        &:hover{color: #66b1ff;}
    }
    .cell{text-align: left;}
    .searchSection{
        margin-bottom: 10px;
        overflow: hidden;
        .el-select{
            float: left;
        }
    }
   .auth_Name{float:left;margin-left:5px;
        .auth_Name_txt{
                display: inline-block;
                width: 150px;
                height: 32px;
                border: 1px solid #dcdfe6;
                line-height: 32px;
                text-align: center;
                border-radius: 4px;
                color: #ccc4cc;
                cursor: pointer;
                    &:hover{
                       border: 1px solid #4091ff;

                       color:#000;
                    }
        }
   }
   .auth_search {
       .el-input{width:auto;}
        .el-button--mini{
                padding: 9px 15px;
        }
   }
   .auth_no{
    text-align: center;
    display: block;
    padding: 20px 10px;
    margin-top: 15px;
    border-top: 1px solid #eaeaea;
   }
   .auth_block{
    width: 100%;
    height: 300px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: hidden;
       ul{padding:0;margin: 15px 0;border-top: 1px solid #eaeaea;}
       li{list-style: none;padding: 5px;box-sizing: border-box;&:hover{background-color: #ececec;}}
       .auth-box-title{
               background-color: #d8d8d8;
               padding: 5px 5px;
           span{display: inline-block;width:20%;}
       }
       .auth-box-content
        {
            overflow-x: hidden;
            overflow-y: auto;
            width: 100%;
            height: 280px;
          li{
               span{display: inline-block;width:20%;}
          }
       }
       .two-txt{width:25%!important;}
       .two-txt-remark{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: middle;
            padding:0 2px;
       }
       .Last-txt{width:19%!important;text-align:center;cursor: pointer;
            label{
                height: 24px;
                display: inline-block;
                -webkit-transition: all;-o-transition: all;transition: all;
                padding: 0 5px;
                cursor: pointer;
                 &:hover{
                     color:#409eff;
                 }
            }
       }
   }

   /*图标*/
   .iconSize {font-size:20px;cursor: pointer;padding: 0 5px;}
   .iconSize:last-child{padding-right:0;}
   .iconSize:first-child{padding-left:0;}
   .iconColor1,.iconColor2{
       &:hover{
        color:#409eff;
       }}
   .iconColor3:hover{color:#f56c6c;}
</style>

