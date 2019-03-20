<template>
    <div class="bread-crumb">
        <slot></slot>
    </div>
</template>
<style lang="less" scoped>
.bread-crumb{
  position: absolute;
  top: -28px;
  left: 0px;
  width: 1000px;
  height: 20px;
  font-size: 14px;
  color: #333;
}
</style>
