<template>
	<div id="">
    <div class="TestScripts">
        <el-input v-model="inputInfo" placeholder="请输入内容" @change='TestScripts' class="TestScripts-input"></el-input>    
    </div>
    </div>
</template>

<script>
export default {
  data () {
    return {
        inputInfo:''
    }
  },
  created(){

  },

  methods:{
      TestScripts(){
          let parmes={
              no:this.inputInfo
          }
          this.$http.post('/testPay',parmes).then(res=>{
            var p='<html><head><title>打印</title></head><body>'+res.data.data+'</body></html>';
            var w=window.open('about:blank');
            w.document.write(p);
            w.document.close();
          })
      }
  },
  mounted(){

  },
}
</script>
<style lang="less" scoped>
.TestScripts{
    width: 100%;
    text-align: center;
}
.TestScripts-input{
    width: 300px;
    margin: 50px auto;
}
</style>


