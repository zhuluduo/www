
<template>
    <div class="add-subaccount">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>设置</el-breadcrumb-item>
            <el-breadcrumb-item :to="{path:'/main/sub-account'}">子账户管理</el-breadcrumb-item>
            <el-breadcrumb-item>编辑子账户</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content">
            <div class="base-form form">
                <div class="title">基本信息</div>
                <div class="form-box">
                    <el-form :model="baseForm" :rules="rules" ref="baseForm">
                        <el-form-item>
                            <el-col :span="8">
                                <el-form-item label="账号：" label-position="left" label-width="67px">
                                    <label for="">{{baseForm.account}}</label>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <div style="width:100px;visibility: hidden;">s</div>
                            </el-col>
                            <el-col :span="8">
                            </el-col>
                        </el-form-item>
                        <el-form-item>
                            <el-col :span="8">
                               <el-form-item label="姓名：" label-position="left" label-width="67px" prop="username">
                                    <el-input :maxlength="20" v-model="baseForm.username" placeholder="请输入姓名"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <div style="width:100px;visibility: hidden;">s</div>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="手机：" label-position="left" label-width="67px" prop="phone">
                                <el-input :maxlength="11" v-model="baseForm.phone" placeholder="请输入手机号"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                        <el-form-item>
                            <el-col :span="8">
                                <el-form-item label="邮箱：" label-position="left" label-width="67px" prop="email">
                                    <!-- <el-input :maxlength="50" v-model="baseForm.email"></el-input> -->
                                    <el-autocomplete
                                    class="inline-input"
                                    v-model="baseForm.email"
                                    :fetch-suggestions="querySearch"
                                    placeholder="请输入邮箱"
                                    :trigger-on-focus="false"
                                    ></el-autocomplete>
                                </el-form-item>
                            </el-col>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="permission-form form">
                <div class="title">权限</div>
                <div class="permission form-box">
                    <el-checkbox-group v-model="checkedPermissions" @change="handleChange">
                        <el-checkbox v-for="per in permissionList" :label="per.id" :key="per.id">{{per.menuName}}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <div class="btn-box">
                <button class="btn" @click="cancel">取消</button><button @click="addAccount" class="btn blue-btn">确定</button>
            </div>
        </div>
    </div>
</template>
<script>
import {validatePhone, validateEmail,EmailAuto} from '../lib/validate.js'
export default {
    data() {
        return {
            id: '',
            checkedPermissions:[],
            permissionList:[],
            baseForm: {
                account: '',
                username: '',
                password: '',
                phone: '',
                email: ''
            },
            rules: {
                username: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
                phone: [
                    { required: true, validator: validatePhone, trigger: 'blur' },
                ],
                email: [
                    { required: true, validator: validateEmail, trigger: 'blur' },
                ]
            }
        }
    },
    created() {
        this.id = this.$route.query.id;
        this.getPermissionList();
    },
    methods:{
        handleChange() {
     
        },
        cancel() {
            this.$router.go(-1);
        },
        getAccountInfo( params ) {
            this.$http.post('/operation/user/getSubAccountAndMenus', {userId: Number(this.id)}).then(( res ) => {
                if ( res.data.code == 200 ) {
                var userInfo = res.data.data.userInfo;
                // console.log(res.data.data);
                this.baseForm.username = userInfo.nickName;
                this.baseForm.account = userInfo.username;
                this.baseForm.phone = userInfo.phone;
                this.baseForm.email = userInfo.email;

                if ( 'setMenus' in res.data.data ) {
                    var permissions = res.data.data.setMenus;
                    permissions.map(( per ) => {
                    this.checkedPermissions.push(per.id);
                    })
                }
                } else {
                    this.$error(res.data.message);
                }
            })
        },
        getPermissionList() {
            this.$http.post('/operation/menu/getSubAccountList').then(( res ) => {
                if ( res.data.code == 200 ) {
                    this.permissionList = res.data.data;
                    this.getAccountInfo();
                } else {
                    this.$error(res.data.message);
                    this.permissionList = [];
                }
            })
        },
        addAccount() {
            this.$refs.baseForm.validate(( valid ) => {
                if ( valid ) {
                var params = {
                    userId: Number(this.id),
                    nickName: this.baseForm.username,
                    phone: this.baseForm.phone,
                    email: this.baseForm.email,
                    setMenus: this.checkedPermissions
                }
                this.$http.post('/operation/user/updateSubAccount', params).then(( res ) => {
                        if ( res.data.code == 200 ) {
                        this.$message.success('添加成功');
                        this.$router.push({path: '/main/sub-account'});
                    } else {
                        this.$error(res.data.message);
                    }
                })
                } else {
                    return false;
                }
            })
        },
        //邮箱自动补全的方法；
        querySearch(inputString,cb) {
            EmailAuto(inputString,cb)
        },
       
    }
}
</script>
<style lang="less" scoped>
.content{
    width: 1000px;
    padding: 30px 0 0 0;
}
.form{
  margin-bottom: 20px;
  .title{
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 15px;
  }
}
.form-box{
  background: #f5f5f5;
  padding: 20px 20px 5px 20px;
}
.permission-form{
  padding-bottom: 20px;
}
.permission{
  padding-bottom: 20px;
}
.btn-box{
  padding: 0 200px;
  display: flex;
  justify-content: space-around;
}
.btn{
  height: 40px;
  padding: 0 40px;
  font-size: 16px;
  line-height: 40px;
  border-radius: 4px;
  border: 0;
  background: #e6e6e6;
  color: #fff;
  cursor: pointer;
}
.blue-btn{
  background: #3f8def;
}
</style>



