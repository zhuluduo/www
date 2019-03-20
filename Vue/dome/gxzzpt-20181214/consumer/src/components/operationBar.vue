<template>
  <div class="operation-bar">
      <div class="left">
          <slot></slot>
          
      </div>
      <div class="right">
           <slot name="right"></slot>
      </div>
  </div>
</template>
<style scoped lang="less">
.operation-bar{
    display: flex;
    height: 54px;
    align-items: center;
    justify-content: space-between;
    .left{
        flex: 3;
    }
    .right{
        flex: 2;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
