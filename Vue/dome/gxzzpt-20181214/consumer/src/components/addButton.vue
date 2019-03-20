<template>
  <button  @click="handleClick" class="add-btn"><slot></slot></button>
</template>
<script>
export default {
   methods:{
      handleClick(){
        this.$emit('click');
      }
    },
}
</script>

