<template>
    <div id="option-group" @click.stop="isShowOptions=!isShowOptions">
        <i class="triangle-icon" :class="isShowOptions?'drop-down':''"></i>
        <div class="group-label">{{label}}</div>
        <div v-show="isShowOptions" class="option-list">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    props:['label'],
    data() {
        return {
            isShowOptions: false,
        }
    }
}
</script>

<style lang="less">
#option-group{
    cursor: pointer;
    .triangle-icon{
        display: inline-block;
        width: 12px;
        height: 12px;
        background: #fff url(../../../static/img/triangle-icon.png) no-repeat center center;
    }
    .drop-down{
        transform:rotate(90deg);
    }
    .group-label{
        display: inline-block;
        margin-left: 5px;
    }
    .option-list{
        padding: 0px 20px;
    }
}
#option-group + #option-group{
    margin-top: 15px;
}
</style>
