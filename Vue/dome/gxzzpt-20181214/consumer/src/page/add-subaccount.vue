<template>
<div class="ae-subaccount">
  <!-- <v-crumb>子账号>子帐号管理>添加子账号</v-crumb> -->
  <div class="box">
    <div class="base-form form">
      <div class="title">基本信息</div>
      <div class="form-box clearfix">
        <el-form :model="baseForm" :rules="rules" ref="baseForm" label-position="left" label-width="50px" >
           <el-col :span="8">
            <el-form-item label="姓名："   prop="username">
              <el-input placeholder="请输入姓名：" :maxlength="20" v-model="baseForm.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <div style="width:100px;visibility: hidden;">s</div>
          </el-col>
          <el-col :span="8">
            <el-form-item label="密码："   prop="password">
              <el-input  placeholder="请输入密码" :maxlength="20" type="password" v-model="baseForm.password"></el-input>
            </el-form-item>
          </el-col>
           <el-col :span="8">
            <el-form-item label="手机："   prop="phone">
              <el-input   placeholder="请输入手机号" :maxlength="11" v-model="baseForm.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <div style="width:100px;visibility: hidden;">s</div>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱："   prop="email">
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
import {validatePhone, validatAaccount, validateEmail , EmailAuto} from '../lib/validate.js';
export default {
  components: {
  },
  data() {
    return {
      checkedPermissions:[],
      permissionList:[
      ],
      baseForm: {
        account: '',
        username: '',
        password: '',
        phone: '',
        email: ''
      },
      rules: {
        // account: [
        //   { required: true, message: '请输入账号', trigger: 'blur' },
        //   { required: true, validator: validatAaccount, trigger: 'blur' },
        // ],
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
          { required: true, validator: validateEmail, trigger: 'change' },
        ]
      },
    };
  },
  created() {
    this.getPermissionList();
  },
  filters:{
   
  },
  methods: {
    handleChange() {
     
    },
    cancel() {
      this.$router.go(-1);
    },
    getPermissionList() {
      console.log(this.pagination);
      this.$http.post('/custom/menu/getSubAccountList').then(( res ) => {
        if ( res.data.code == 200 ) {
          this.permissionList = res.data.data;
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
            // username: this.baseForm.account,
            password: this.baseForm.password,
            phone: this.baseForm.phone,
            email: this.baseForm.email,
            nickName: this.baseForm.username,
            setMenus: this.checkedPermissions
          }
          this.$http.post('/custom/user/insertSubAccount', params).then(( res ) => {
            if ( res.data.code == 200 ) {
              this.$message.success('添加成功');
              this.$router.push({path: '/usercenter/account-manage'});
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
};
</script>
<style lang="less" scoped>
@common-color: #3f8def;
.box{
  padding: 30px 20px;
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
