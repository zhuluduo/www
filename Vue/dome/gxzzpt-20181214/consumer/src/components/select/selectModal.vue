<template>
    <div id="select-modal">
        <el-dialog :title="selectModal.title" :visible="selectModal.visible" width="400px" height='200px' center :before-close="handleClose">
            <div class="body">
                <div class="body-inner">
                    <div class="content" id="select-wrapper">
                        <slot></slot>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props:{
        selectModal:Object
    },
    components: {
    },
    data() {
        return {
        }
    },
    mounted() {
        
    },
    methods: {
        handleClose() {
            this.selectModal.visible = false;
        }
    }
}
</script>

<style lang="less">
#select-modal{
    .body{
        .body-inner{
            width: 100%;
            overflow: hidden;
            height: 330px;
            .content{
                width: 356px;
                height: 340px;
                overflow-y: auto;
                padding-bottom: 20px;
                .el-collapse{
                    border: none;
                    .el-collapse-item__header{
                        height: 26px;
                        line-height: 26px;
                        font-size: 12px;
                        color: #777;
                        border-bottom: 0px;
                        .el-collapse-item__arrow{
                            line-height: 26px;
                            margin-right: 12px;
                        }
                    }
                    .el-collapse-item__content{
                        padding: 0;
                    }
                    .el-collapse-item__wrap{
                        border-bottom: 0px;
                    //    display: block !important;
                    }
                }
                .el-radio {
                    display: block;
                    margin-left: 0;
                    padding: 5px 0 5px 16px;
                    text-align: left;
                    .el-radio__label{
                        color: #a09f9f !important;
                    }
                } 
            }
        }
    }
}
</style>
