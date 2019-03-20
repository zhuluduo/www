<template>
  <div class="content-list">
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item>系统设置</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="4">
        <el-input @keyup.enter.native="loadList" placeholder="用户名" v-model="params.username" size="small"/>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="loadList" :loading="loading" icon="search" size="small">搜索</el-button>
      </el-col>
      <el-col :span="16" class="tool-bar">
        <el-button type="primary" @click="createUser" size="small" icon="plus">新增用户</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table stripe border :data="list" v-loading="loading">
          <el-table-column prop="username" label="用户名" width="150"></el-table-column>
          <el-table-column prop="address" label="账户类型" width="100">
            <template scope="scope">
              <el-tag v-if="scope.row.isAdmin==1" type="danger">店长</el-tag>
              <el-tag v-else type="success">收银员</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="权限">
            <template scope="scope">
              <el-tag v-for="item in scope.row.perms" :key="item.id" type="success">{{item.name}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="230" align="center">
            <template scope="scope">
              <el-button v-if="currentUser.isAdmin==1||scope.row.id==currentUser.id" :plain="true" type="warning"
                         size="small" @click="changePwd(scope.row,scope.$index)" icon="edit">改密
              </el-button>
              <el-button v-if="currentUser.isAdmin==1&&scope.row.id!=currentUser.id" :plain="true" type="warning"
                         size="small" @click="changePerm(scope.row,scope.$index)" icon="edit">权限
              </el-button>
              <el-button v-if="currentUser.isAdmin==1&&scope.row.id!=currentUser.id" :plain="true" type="danger"
                         size="small" @click="deleteUser(scope.row,scope.$index)" icon="delete">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="changeSize"
          @current-change="changePage"
          :current-page.sync="page.currentPage"
          :page-size="page.size"
          layout="prev, pager, next, jumper, total"
          :total="page.total">
        </el-pagination>
      </el-col>
    </el-row>
    <transition name="bounce">
      <div v-show="showEdit" class="transition-box scrollbar">
        <el-row class="box-title">
          <el-col :span="24" align="center">{{boxTitle}}</el-col>
        </el-row>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="ruleForm">
          <el-form-item label="用户名:" prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入用户名" size="small"
                      :disabled="ruleForm.syncId==''?false:true"/>
          </el-form-item>
          <el-form-item label="密码:">
            <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password" size="small" :rules="[
            { required: true, message: '密码不能为空'}
          ]"/>
          </el-form-item>
        </el-form>
        <el-row class="box-footer">
          <el-col :span="24" align="center">
            <el-button :loading="loading" type="success" @click="submitForm('ruleForm')" size="small" icon="check">保存
            </el-button>
            <!--<el-button @click="resetForm('ruleForm')" size="small">重置</el-button>-->
            <el-button @click="closeForm('ruleForm')" size="small" icon="close">关闭</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>

    <transition name="bounce">
      <div v-show="showEditPerm" class="transition-box scrollbar">
        <el-row class="box-title">
          <el-col :span="24" align="center">{{editPermTitle}}</el-col>
        </el-row>

        <el-form :model="permForm" ref="permForm" label-width="20px" class="ruleForm">
          <el-form-item>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll"
                         @change="handleCheckAllChange">全选
            </el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="permForm.resources" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="item in perms" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <el-row class="box-footer">
          <el-col :span="24" align="center">
            <el-button :loading="loading" type="success" @click="submitPermForm('permForm')" size="small" icon="check">
              保存
            </el-button>
            <!--<el-button @click="resetPermForm('permForm')" size="small">重置</el-button>-->
            <el-button @click="closePermForm('permForm')" size="small" icon="close">关闭</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>
  </div>
</template>
<script>
  import {bus} from '../../bus.js';
  export default{
    data(){
      return {
        checkAll: true,
        isIndeterminate: true,
        currentUser: JSON.parse(sessionStorage.getItem('currentUser')),// 当前登录用户
        list: [], // 列表数据
        params: { // 列表查询参数
          username: '',
        },
        perms: [],
        page: { // 分页信息
          currentPage: 1, // 当前页
          size: 15, // 每页大小
          total: 1, // 总页数
        },
        loading: false, // 是否显示加载遮罩层
        showEdit: false,
        showEditPerm: false,
        editPermTitle: '',
        operation: '', // 当前操作
        boxTitle: '',
        ruleForm: {
          id: '',
          username: '',
          password: '',
          isAdmin: 0,
          resources: [],
          syncId: ''
        },
        permForm: {
          id: '',
          resources: [],
          perms: [],
          syncId: ''
        },

      }

    },
    methods: {

      handleCheckAllChange(event) {
        if (event.target.checked) {
          let rs = [];
          this.perms.forEach(e => {
            rs.push(e.id);
          })
          this.permForm.resources = rs
        } else {
          this.permForm.resources = [];
        }
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.perms.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.perms.length;
      },
      /*加载列表数据*/
      loadList() {
        let queryParams = '?page=' + (this.page.currentPage - 1) + '&size=' + this.page.size + '&sort=createTime,desc';
        this.loading = true;
        this.$axios.post(bus.host + '/pos/api/account/user/list' + queryParams, this.params, {}).then((res) => {
          let data = res.data;
          if (!data.success) {
            this.$notify.error({
              title: '错误',
              message: data.msg
            });
          }
          let msg = data.msg;
          this.page.total = msg.totalElements;
          let content = msg.content;
          content.forEach((e) => {
            let perms = new Array();
            e.resources.forEach(p => {
              if (p.needCheck) {
                perms.push(p);
              }
            });
            e.perms = perms;
          });
          this.list = content;
          this.loading = false;
        })
          .catch((err) => {
          });
      },

      /*处理分页事件*/
      changeSize(val) {
        this.page.size = val;
        this.loadList();
      },
      changePage(val) {
        this.page.currentPage = val;
        this.loadList();
      },
      /*新增用户*/
      createUser () {
        this.ruleForm.id = '';
        this.ruleForm.username = '';
        this.ruleForm.isAdmin = 0;
        this.ruleForm.syncId = '';
        this.boxTitle = '新增用户';
        this.operation = 0;
        this.ruleForm.password = '';
        this.showEdit = true;
      },
      /*更改用户密码*/
      changePwd (row) {
        this.ruleForm.id = row.id;
        this.ruleForm.username = row.username;
        this.ruleForm.isAdmin = row.isAdmin;
        this.ruleForm.syncId = row.syncId;
        this.boxTitle = '修改密码[' + row.username + ']';
        this.operation = 1;
        this.ruleForm.password = '';
        this.showEdit = true;
      },
      /*更改用户权限*/
      changePerm (row) {
        this.permForm.id = row.id;
        let res = [];
        row.perms.forEach((e) => res.push(e.id));
        this.permForm.resources = res;
        this.editPermTitle = '修改权限[' + row.username + ']';
        this.showEditPerm = true;
      },
      /*删除用户*/
      deleteUser (row) {
        this.$confirm('确定要删除用户吗?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          size: 'small'
        }).then(() => {
          this.$axios.delete(bus.host + '/pos/api/account/user/delete/' + row.id).then((res) => {
            let type = 'warning';
            if (res.data.success) type = 'success';
            this.$message({
              type: type,
              message: res.data.msg
            });
            if (res.data.success) {
              this.loadList();
            }
          }).catch(() => {
            this.$message({
              message: '删除失败',
              type: 'error'
            });
          });
        }).catch(() => {

        });
      },
      submitForm(formName) {
        if (this.ruleForm.username == null || this.ruleForm.username == '') {
          this.$message({
            message: '用户名不能为空',
            type: 'error'
          });
          return false;
        }
        if (this.ruleForm.password == null || this.ruleForm.password == '') {
          this.$message({
            message: '密码不能为空',
            type: 'error'
          });
          return false;
        }
        if (this.ruleForm.password.length < 6) {
          this.$message({
            message: '密码不能少于6位数',
            type: 'error'
          });
          return false;
        }
        this.loading = true;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.operation == 0) {
              this.$axios.post(bus.host + '/pos/api/account/user/create', this.ruleForm).then((res) => {
                if (!res.data.success) {
                  this.$message({
                    message: res.data.msg,
                    type: 'warning'
                  });
                  this.loadList();
                  return;
                }
                this.showEdit = false;
                this.loading = false;
                this.loadList();
              }).catch((err) => {
                this.loading = false;
                this.$notify.error({
                  title: '错误',
                  message: '用户名重复'
                });
              })
              ;
            } else {
              this.$axios.put(bus.host + '/pos/api/account/user/update', this.ruleForm).then((res) => {
                if (!res.data.success) {
                  this.$message({
                    message: res.data.msg,
                    type: 'warning'
                  });
                  this.loading = false;
                  return;
                }
                this.showEdit = false;
                this.loading = false;
                this.loadList();
              }).catch((err) => {
                this.loading = false;
                this.$notify.error({
                  title: '错误',
                  message: '用户名重复'
                });
              });
            }

          } else {
            this.loading = false;
            return false;
          }
          this.ruleForm.password == null;
        });
      },
      submitPermForm(formName){
        this.loading = true;
        let resources = [];
        for (let i = 0; i < this.permForm.resources.length; i++) {
          let json = {id: ''};
          resources.push(json)
          resources[i].id = this.permForm.resources[i];
        }
        if (resources == null || resources == '' || resources == undefined) {
          this.$message({
            message: "请选择权限",
            type: 'warning'
          })
          this.loading= false;
          return false;
        }
        this.permForm.resources = resources;
        this.$axios.put(bus.host + '/pos/api/account/user/update', this.permForm).then(res => {
          if (!res.data.success) {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
          this.showEditPerm = false;
          this.loading = false;
          this.loadList();
        });
        this.loadPerms();
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      closeForm(formName){
        this.$refs[formName].resetFields();
        this.showEdit = false;
      },
      closePermForm(formName){
        this.$refs[formName].resetFields();
        this.showEditPerm = false;
      },
      loadPerms(){
        this.$axios.get(bus.host + '/pos/api/resource/list').then((res) => {
          if (res.data.success)
            this.perms = res.data.msg;
        });
      },
    },
    mounted() {
      this.loadPerms();
      this.loadList();
    }
  }
</script>
<style>
  .ruleForm .el-checkbox:nth-child(1) {
    margin-left: 15px;
  }

  .ruleForm label.el-checkbox {
    width: 100px;
  }

  .breadcrumb-border {
    border-bottom: 1px solid #efefef;
    margin-bottom: 10px;
  }

  .el-breadcrumb {
    padding: 5px 0px;
  }

  .el-pagination {
    padding: 10px 0px;
  }

  .el-table {
    margin-top: 10px;
  }

  .transition-box .el-form-item {
    margin-bottom: 15px;
  }

  .transition-box {
    box-shadow: 0px 0px 0px 2px #383531;
    position: fixed;
    top: 50px;
    right: 0;
    width: 400px;
    height: 100%;
    background-color: #f6f3ee;
    color: #fff;
    box-sizing: border-box;
    z-index: 999;
    overflow: scroll;
    padding-bottom: 70px;
  }

  .transition-box .box-title {
    position: fixed;
    top: 50px;
    width: 400px;
    padding: 5px;
    background-color: rgb(56, 53, 49);
    z-index: 999;
  }

  .transition-box .ruleForm {
    padding-right: 20px;
    padding-top: 50px;
  }

  .transition-box .box-footer {
    position: fixed;
    bottom: 0;
    width: 400px;
    padding: 5px;
    background-color: rgb(56, 53, 49);
  }

  .transition-box .form-inline {
    display: inline;
  }

  .bounce-enter-active {
    animation: bounce-in .5s;
  }

</style>
