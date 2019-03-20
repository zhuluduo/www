<template>
  <div id="upload">
    <div class="preview" @click="showUpload" @mouseover="showAdd=true" @mouseout="showAdd=false">
      <img :src="imgUrl" alt="">
      <div class="operator-icon" v-show="showAdd||!imgUrl">
        <div>

        </div>
      </div>
    </div>
    <input type="file" ref="file" @change="doUpload($event)" :accept="accept" :multiple="multiple">
  </div>
</template>
<script>
export default {
  name: "az-upload",
  data() {
    return {
      fileArr: [],
      imgUrl:"",
      showAdd:false,
      fileUploadUrl:"http://dw.tatfookcloud.com/upload",
    };
  },
  props: ["uploadUrl", "complete","accept","multiple","img"],
  created() {
    //父组件传递过来的数据;
    this.imgUrl=this.img
  },
  watch: {
    img: function() {
      this.imgUrl=this.img
    }
  },
  methods: {
    deleteFile(i) {
      this.$refs["file"].value = "";
      this.fileArr.splice(i);
    },
    showUpload() {
      this.$refs["file"].click();
    },
    doUpload(e) {
      let file = e.target.files[0];
      if(!/\.(jpg|png|JGP|PNG)$/.test(file.name)) {
          this.$message({
              type: "error",
              message: '只支持jpg/png/JGP/PNG文件格式',
              duration:1000
          });
          return false;
      }
      if (file.size / 1024 / 1024 > 0.12) {
          this.$message.error("文件大小不能超过120KB");
          return false;
      }
      var arr = [].slice.call(e.target.files);
      if (arr.length) {
        arr.map(ele => {
          this.fileArr.push(ele);
        });
      }
      // var file = e.target.files[0];
      var data = new FormData();
      data.append("file", file);
      this.$upload
        .post(this.uploadUrl||this.fileUploadUrl, data)
        .then(res => {
          this.imgUrl = res.data.data.img_url;
          this.notify();
        })
        .catch(res => {});
    },
    notify(){
      //子组件，通过触发自定义事件，把我们商品id和数量传递给父组件
      this.$emit('imgUrl',{imgUrl:this.imgUrl})
    }
  }
};
</script>
<style lang="less" scoped>
@color: #3f8def;
#upload {
  .preview{
    width: 120px;
    height: 120px;
    border:1px solid #ddd;
    position: relative;
    cursor: pointer;
    img{
      width: 100%;
      height:100%;
    }
    .operator-icon{
      position: absolute;
      width: 100%;
      height:100%;
      top:0px;
      display: flex;
      align-items: center;
      background-image: url('../../static/img/ChangeUploadImage.png');
      justify-content: center;
      >div{

      }
    }
  }

  input[type="file"] {
    display: none;
  }

}
</style>
