<template>
  <div @click="handleClick" class="check-btn" :class="{active:active==true}"><slot></slot></div>
</template>
<script>
  export default {
    data(){
      return{
      }
    },
    methods:{
      handleClick(){
        this.$emit('click');
      }
    },
    props:['active']
  }
</script>
<style lang="less" rel="stylesheet/less" type="text/less" scoped>
  .check-btn{
    display: inline-block;
    height: 34px;
    border: 1px solid #e2e2e2;
    text-align: center;
    line-height: 34px;
    box-sizing: border-box;
    padding: 0 18px;
    cursor: pointer;
    min-width: 94px;
    background: #fff;
  }
  .check-btn + .check-btn{
    margin-left: 26px;
  }
  .active{
    border: 2px solid #3f8def;
    line-height: 32px;
    background: #fff url(../../static/img/check.png) no-repeat right bottom;;
  }
</style>
