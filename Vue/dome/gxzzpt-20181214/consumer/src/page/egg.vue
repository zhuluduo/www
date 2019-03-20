<template>
  <div class="egg">
    <div>
      <el-button type="primary" @click="showFileSelect">选择图片</el-button>
    </div>
    <input type="file" ref="file" accept="image/*" @change="handleChange">
    <img :src="preImg" alt="原图">
    <img :src="dealImg" alt="处理后的图片">
    <img :src="watermarkImg" alt="加水印的图片">
  </div>
</template>
<script>
export default {
  data() {
    return {
      preImg: "",
      dealImg: "",
      watermarkImg: ""
    };
  },
  methods: {
    showFileSelect() {
      this.$refs["file"].click();
    },
    handleChange(e) {
      var file = e.target.files[0];
      console.log(file);
      var fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = e => {
        this.preImg = e.target.result;
        this.compress(e.target.result);
        // this.addWatermark(e.target.result);
      };
    },
    addWatermark(base64) {},
    compress(base64) {
      var options = {
        width:600,
        height:300,
        bg:"rgba(0,0,0,.3)",
        color:"#f00",
        text:"links大傻逼"
      }
      var canvas = document.createElement("canvas");
      canvas.width = options.width;
      canvas.height = options.height;
      var ctx = canvas.getContext("2d");
      ctx.font
      ctx.fillStyle = options.bg;
      var img = new Image();
      img.src = base64;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 600, 300);
        var dealBase64 = canvas.toDataURL("image/jpeg",0.1);
        this.dealImg = dealBase64;
        ctx.fillRect(0, 0, options.width, options.height);
        ctx.fillStyle = options.color;
        ctx.fillText(options.text, 10, options.height/2, options.width);
        var markBase64 = canvas.toDataURL();
        this.watermarkImg = markBase64;
      };
    }
  }
};
</script>
<style lang="less" scoped>
.egg {
  padding: 20px;
}
input[type="file"] {
  display: none;
}
</style>
