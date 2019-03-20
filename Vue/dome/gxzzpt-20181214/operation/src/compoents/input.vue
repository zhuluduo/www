<template>
  <div>
    <input ref="input" v-bind:value="value" v-on:input="updateValue($event.target.value)" type="text">
  </div>
</template>
<script>
  export default {
    props:['value'],
    data() {
      return {

      }
    },
    methods:{
      updateValue: function (value) {
        this.$emit('input', value);
      }
    }
  }
</script>
<style scoped>
  input{
    border: 1px solid #eee;
    box-sizing: border-box;
    height: 32px;
  }
</style>
