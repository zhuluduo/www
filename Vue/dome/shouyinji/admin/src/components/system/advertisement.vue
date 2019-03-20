<template>
  <div>
    <el-row class="breadcrumb-border">
      <el-col>
        <el-breadcrumb separator=">">
          <!--<el-breadcrumb-item>系统设置</el-breadcrumb-item>-->
          <el-breadcrumb-item>广告设置</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <el-row v-loading="loading">
      <el-col :span="8" class="pic">
        <span>广告一</span>
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          name="files"
          :show-file-list="false"
          :on-success="adv0Handler"
          :beforeUpload="beforeUpload">
          <img v-if="adv1.adv1" :src="adv1.showUrl" class="avatar">
          <i class="el-icon-upload2 avatar-uploader-icon"></i>
        </el-upload>
        <el-button type="primary" @click="delete1" class="delete" icon="delete" size="small"></el-button>
      </el-col>

      <el-col :span="8" class="pic">
        <span>广告二</span>
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          name="files"
          :show-file-list="false"
          :on-success="adv1Handler"
          :beforeUpload="beforeUpload">
          <img v-if="adv2.adv2" :src="adv2.showUrl" class="avatar">
          <i class="el-icon-upload2 avatar-uploader-icon"></i>
        </el-upload>
        <el-button type="primary" @click="delete2" class="delete" icon="delete" size="small"></el-button>
      </el-col>

      <el-col :span="8" class="pic">
        <span>广告三</span>
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          name="files"
          :show-file-list="false"
          :on-success="adv2Handler"
          :beforeUpload="beforeUpload">
          <img v-if="adv3.adv3" :src="adv3.showUrl" class="avatar">
          <i class="el-icon-upload2 avatar-uploader-icon"></i>
        </el-upload>
        <el-button type="primary" @click="delete3" class="delete" icon="delete" size="small"></el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" align="center" style="margin-top: 6rem;">
        <el-button type="primary" @click="save" icon="check">保存</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import {bus} from '../../bus.js';
  export default {
    data() {
      return {
        loading: false,
        imgHost: bus.imgHost,
        uploadUrl: bus.host + '/admin/api/upload',
        adv1: {adv1: '', showUrl: ''},
        adv2: {adv2: '', showUrl: ''},
        adv3: {adv3: '', showUrl: ''},
        id: '',
      };
    },
    methods: {
      adv0Handler(res, file) {
        this.adv1.adv1 = res.msg[0];
        this.adv1.showUrl = URL.createObjectURL(file.raw);
        this.loading = false;
      },
      adv1Handler(res, file) {
        this.adv2.adv2 = res.msg[0];
        this.adv2.showUrl = URL.createObjectURL(file.raw);
        this.loading = false;
      },
      adv2Handler(res, file) {
        this.adv3.adv3 = res.msg[0];
        this.adv3.showUrl = URL.createObjectURL(file.raw);
        this.loading = false;
      },
      beforeUpload(file) {
        const isImg = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isImg) {
          this.$message.error('上传图片只能是jpg/png/gif格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        this.loading = true;
        return isImg && isLt2M;
      },
      save() {
        this.loading = true;
        let adv = {id: this.id, adv1: this.adv1.adv1, adv2: this.adv2.adv2, adv3: this.adv3.adv3};
        let url = bus.host + '/admin/api/wechat/adv/update';
        this.$http.put(url, adv).then((response) => {
          if (response.data.success == false && response.status == 200) {
            this.$message({
              message: '对不起您没有此操作权限',
              type: 'warning'
            });
            return;
          }
          this.$message.success(response.data.msg);
        });
        this.loading = false;
      },
      delete1(){
        this.adv1.adv1 = '';
        this.adv1.showUrl = '';
      },
      delete2(){
        this.adv2.adv2 = '';
        this.adv2.showUrl = '';
      },
      delete3(){
        this.adv3.adv3 = '';
        this.adv3.showUrl = '';
      },

      getStore(){
        let url = bus.host + '/admin/api/wechat/adv/list';
        this.$http.get(url).then((response) => {
          let adv = response.data.msg;
          this.adv1.adv1 = adv.adv1;
          this.adv2.adv2 = adv.adv2;
          this.adv3.adv3 = adv.adv3;
          this.id = adv.id;
          this.adv1.showUrl = adv.adv1 == undefined ? '' : bus.imgHost + adv.adv1;
          this.adv2.showUrl = adv.adv2 == undefined ? '' : bus.imgHost + adv.adv2;
          this.adv3.showUrl = adv.adv3 == undefined ? '' : bus.imgHost + adv.adv3;
        }, (response) => {
          this.$notify.error({
            title: '警告',
            message: '请登录管理员账号【登录超时】'
          });
        });
      },
    },
    mounted() {
      this.getStore();
    }
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 378px;
    height: 178px;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 378px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
  }

  .avatar {
    width: 378px;
    height: 178px;
    display: block;
  }

  .pic {
    position: relative;
  }

</style>

