<template>
  <div id="company_information_Image">
        <div class="thirdImg pull-overflow"  v-loading="loading"  element-loading-text="数据加载中">
            <div class="No-data" v-if="ProductCaseData==''">
                <img src="../../static/img/no-data.png" alt=""> 暂无数据
            </div>
            <ul v-else>
                <li class="pull-left" v-for="(item,index) in ProductCaseData" :key="index" :class="(index + 1) % 4==0?'no-margin-right':''">
                    <img :src="item.pictureUrl" alt="">
                    <div class=" operate">
                        <span class="modify" @click="modifyClick(item,index)">修改</span>
                        <span class="remove" @click="PremoveImg(item,index)">删除</span>
                    </div>
                </li>
            </ul>
        </div>
        <!-- dialog -->
        <div class="dialog-box">
        <el-dialog
        :title="Eldialog.name"
        :visible.sync="Eldialog.dialogVisible"
        @close='closeClick'
        width="524px">
        <div class="dialog-update">
            <el-upload
            class="upload-list"
            action="http://dw.tatfookcloud.com/upload"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
            multiple
            :limit="uploadLimit"
            :on-exceed="handleExceed"
            :file-list="fileList"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <p class="Notes">
              注:
              <span>文件上传最大数量{{uploadLimit}}</span>
              <span>允许上传的文件类型包括 (.gif,.jpeg,.jpg,.png,.bmp)</span>
            </p>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" :disabled='UpDisabled'  @click="submitUpload">确定上传</el-button>
        </span>
        </el-dialog>
        </div>
        <!-- /dialog -->
  </div>
</template>
<script>
export default {
  props: ['dialogState','companyId'],
  data() {
    return {
        ID:'',
        pictureInfoId:'',
        pictureIndex:'',
        ProductCaseData:[],
        Eldialog:{
           dialogVisible:false,
           name:'上传'
        },
        fileList:[],
        uploadLimit:'',
        UpDisabled:false,
        loading:false,
    }
  },
  watch: {
    dialogState (val, oldVal) {
      this.Eldialog.dialogVisible=val;
      if(val==true){
      this.Eldialog.name='上传'
      this.uploadLimit=12;
      this.pictureIndex=1;
      this.UpDisabled=true;
      }
    },
    companyId(val,oldval){
      this.ID=val
    }
  },
  created() {
    this.getPictures();
  },

  mounted() {

  },
  methods: {
    /*企业图片-Start*/
    getPictures(){
      let params={
         companyId:parseInt(this.ID),
      }
      let url="/custom/company/getPictures";
      this.$http.post(url,params).then(res=>{
         this.ProductCaseData=res.data.data;
      })
    },

    handleAvatarSuccess(response, file, fileList){
      let fileIndex=fileList.length;
      let ProductCaseIndex=this.ProductCaseData.length;
      let total=ProductCaseIndex+fileIndex;
      if(this.pictureIndex===1){
        if(total>12){
        fileList.pop();
        this.$message({
            message: '当前限制选择12个文件，本次选择了1个文件，共选择了 13 个文件',
            type: 'warning',
            duration:1000
        });
        }else{
        let params={
        url:response.data.img_url,
        }
        this.fileList.push(params)
        this.UpDisabled=false;
        }
      }else if(this.pictureIndex===2){
        this.UpDisabled=false;
        this.modifyIndexs=response.data.img_url;
      }
    },
    handleRemove(file, fileList){
        this.fileList=fileList
    },

    // UploadClick(){//上传
    //   let _this=this;
    //   _this.Eldialog.name='上传'
    //   _this.uploadLimit=12;
    //   _this.pictureIndex=1;
    //   _this.UpDisabled=true;
    //   _this.Eldialog.dialogVisible = true
    // },

    modifyClick(item,index){//修改
      this.Eldialog.name='修改'
      this.uploadLimit=1;
      this.pictureIndex=2;
      this.UpDisabled=true;
      this.Eldialog.dialogVisible = true
      let params={
          id:item.id,
          url:item.pictureUrl
      }
      this.pictureInfoId=item.id;
      this.fileList.push(params)
    },

    PremoveImg(item,index){ //企业图片删除
        let url="/custom/company/deletePicture"
        let parmes={
           pictureId:item.id
        }
        this.$confirm('此操作将删除该图片, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(url,parmes).then(res=>{
              if(res.data.code==200){
                this.ProductCaseData.splice(index, 1)
                this.$message({
                    type: 'success',
                    message: '删除成功!',
                    duration:1000
                });
                this.getPictures();
              }else{
                 this.$message.error('删除失败');
              }
          })
        }).catch(() => {
        });
    },

    submitUpload(){ //确认上传
       let pictureList=[];
       if(this.pictureIndex===1){
       for(let item in this.fileList){
           pictureList.push(this.fileList[item].url)
       }
       let parmes={
           pictureList:pictureList
       }
       let url="/custom/company/uploadPictures";
       this.$http.post(url,parmes).then(res=>{
           if(res.data.code==200){
            this.$message({
            message: '图片上传成功',
            type: 'success',
            duration:1000
            });
           }else{
            this.$message.error('图片上传失败');
           }
       })
       }else if(this.pictureIndex===2){
          let modifyInfo={
              pictureId:this.pictureInfoId,
              pictureUrl:this.modifyIndexs,
          }
       let url="/custom/company/modifyPicture";
       this.$http.post(url,modifyInfo).then(res=>{
           if(res.data.code==200){
            this.$message({
            message: '图片修改成功',
            type: 'success',
            duration:1000
            });
           }else{
            this.$message.error('图片修改失败');
           }
       })

       }
        this.getPictures();
        this.Eldialog.dialogVisible = false;
    },

    closeClick(){ //弹框关闭
      this.fileList=[];
      this.$emit('trans-list', this.Eldialog.dialogVisible );
    },

    /*企业图片*/
     beforeAvatarUpload(file){//校验
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'||file.type === 'image/gif';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG,PNG,JPEG,GIF 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传企业图片大小不能超过 2M!');
        }
        return isJPG && isLt2M;
      },

     handleExceed(files, fileList) {
        let Sums=files.length;
        let sum=files.length + fileList.length;
        this.$message.warning('当前限制选择'+this.uploadLimit+'个文件，本次选择了 '+Sums+' 个文件，共选择了 '+sum+' 个文件');
      },
     /*图片上传-END */

  }
}
</script>

<style lang="less" scoped>


</style>

