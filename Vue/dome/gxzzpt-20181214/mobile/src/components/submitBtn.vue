<template>
    <div class="submit-btn" @click="onClick">{{btnName}}</div>
</template>
<script>
export default {
    props:['btnName'],
    methods:{
        onClick() {
            this.$emit('click');
        }
    }
}
</script>
<style lang="scss">
.submit-btn{
    height: 88px;
    background-color: #3f8def;
    border-radius: 10px;
    font-size: 30px;
    color: #fff;
    line-height: 88px;
    text-align: center;
}
</style>
