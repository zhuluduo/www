<template>
    <div class="common-title">
        <span :class="className" :style="{color:color?color:'#777'}">{{title}}</span>
        <span v-if="withMore" class="with-more" @click="clickHandler">更多<i class="el-icon-arrow-right"></i></span>
    </div>
</template>
<script>
export default {
    props:['fontSize','withMore','title', 'color'],
    data() {
        return{

        }
    },
    computed: {
        className: function (params) {
            if(this.fontSize && this.fontSize == 14) {
                return 'title-text-14';
            } else {
                return 'title-text-16'
            }
        }
    },
    methods: {
        clickHandler() {
            this.$emit('click');
        }
    }
}
</script>

<style lang="less" scoped>
.common-title{
    .fontSize(@size:16px){
        font-size: @size;
        height: @size;
        line-height: @size;
        display: inline-block;
        border-left: 4px solid #3f8def;
        text-indent: 6px;
        font-weight: 700;
    }
    .title-text-16{
        .fontSize(16px);
    }
    .title-text-14{
        .fontSize(14px);
    }
    .with-more{
        color: #3f8def;
        cursor: pointer;
        margin-left: 30px;
        .el-icon-arrow-right{
            color: #3f8def;
        }
    }
}
</style>

