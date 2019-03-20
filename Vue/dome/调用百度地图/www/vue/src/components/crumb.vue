<template>
  <div class="crumb-bar">
    <label v-for="(crumbText,index) in crumbTexts">
      <span class="crumb-item">{{crumbText}}</span>
      <span class="crumb-item" v-if="(index+1)!=crumbTexts.length">></span>
    </label>
    <!--<span class="crumb-item">标签管理</span>-->
  </div>
</template>
<script>
  export default {
    props: ['crumbTexts'],
    components: {},
    data() {
        return {}
    },
    methods: {},
  }
</script>
<style lang="less" scoped>
  .crumb-bar{
    position: absolute;
    top: 0;
    width: 100%;
    height: 45px;
    border-bottom: 1px solid #e4e7ed;
    box-sizing: border-box;
    background-color: #fff;
  }
  .crumb-bar span[class^='crumb-item']{
    font-size: 14px;
    line-height: 45px;
    margin-right: 10px;
  }
  label:nth-child(1){
    margin-left: 52px;
  }
  .crumb-item{
    color: #333;
  }
  .crumb-bar:last-child:first-child{
  //  color: #23b38f;
    color: red;
    font-weight: bold;
  }
</style>
