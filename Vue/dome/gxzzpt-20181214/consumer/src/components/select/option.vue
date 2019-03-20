<template>
    <div id="option-radio">
        <div @click.stop="changeVal(label)" >
            <i class="radio-icon" :class="{'active':value==label}"><i class="inner-radio-icon"></i></i>
            <div class="text">{{label}}</div>
            <div class="clearfix"></div>
        </div>
    </div>
</template>
<script>
export default {
   props:['value', 'label'],
    data() {
       return {

       }
    },
    methods: {
        changeVal( label ) {
            this.$emit('click', label);
        }
    }
}
</script>
<style lang="less">
#option-radio{
    cursor: pointer;
    margin-top: 12px;
    div, i{
        box-sizing: border-box;
    }
    .clearfix{
        zoom: 1;
        &::after{
            display: block;
            visibility: hidden;
            clear: both;
            height: 0;
            content: '.';
        }
    }
    .radio-icon{
        display: block;
        float: left;
        width: 15px;
        height: 15px;
        border: 1px solid #e2e2e2;
        border-radius: 50%;
        padding: 3px;
        .inner-radio-icon{
            display: block;
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: #fff;
        }
    }
    .active{
        background: #3f8def;
        border: 1px solid#3f8def !important;
    }
    .text{
        float: left;
        height: 15px;
        line-height: 15px;
        margin-left: 10px;
    }
}
</style>
