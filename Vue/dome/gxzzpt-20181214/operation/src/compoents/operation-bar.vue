<template>
  <div class="operations-bar">
    <div class="left"><slot name="left"></slot></div>
    <div class="right"><slot name="right"></slot></div>
  </div>
</template>
<style lang="less" scoped>
.operations-bar{
  display: flex;
  box-sizing: border-box;
  padding: 10px 0;
  .left{
    display: flex;
    flex: 1;
  }
  .right{
    display: flex;
    justify-content: flex-end;
  }
}
</style>
