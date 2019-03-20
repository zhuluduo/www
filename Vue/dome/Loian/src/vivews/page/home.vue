<template>
    <section>
        <div class="header">
            <headers></headers>
        </div>
        <div class="content">
            <section class="content-box">
                <div class="content-box-W">
                    <homeCont></homeCont>
                </div>
            </section>
        </div>
        <div class="footer">
            <footers></footers>
        </div>
    </section>
</template>

<script>
import headers from "../../common/header.vue";
import homeCont from "../../page/home-cont.vue";
import footers from "../../common/footer.vue"
export default {
    components:{headers,homeCont,footers},
    data() {
        return {

        }
    },
    methods: {

    },
    mounted() {
        
    },
}
</script>

<style lang="scss" scoped>
.content{
    min-height: 500px;
}
.content-box{
    margin-top: 5px;
    margin-bottom: 15px;
    .content-box-W{
        width: 1200px;
        height:100%;
        margin:auto;
        text-align: left;
        position: relative;
    }
}
.footer{
    width: 100%;
    height: 200px;
    background: #cecece;
}
</style>
<style lang="scss">
.clearfix:after{
    content: ".";
    display: block;
    height: 0;
    clear: both;
    visibility: hidden;
    font-size: 0;
}
.text-overflow{
    max-width: 100%;
    display: inherit;
    overflow: hidden;
    word-break: break-all;
    word-wrap: normal;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
    -ms-text-overflow: ellipsis;
}
.loian-icon{
    display: inline-block;
    background-image: url(//static.hdslb.com/images/base/icons.png);
}
.el-button{
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #dcdfe6;
    border-color: #dcdfe6;
    color: #606266;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 5px 20px;
    font-size: 12px;
    border-radius: 4px;
    &:active{
        color: #3a8ee6;
        border-color: #3a8ee6;
        outline: none;
    }
    &:focus,&:hover{
        color: #409eff;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
    }
}
.pull-shadow{
    background: #fff;
    box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    -webkit-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
    -moz-box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.06);
}
</style>



