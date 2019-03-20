<template>
<div id="app">
  <router-view></router-view>
</div>
</template>

<script>
export default {
  components: {},
  data() {
    return {};
  },
  watch: {

  },
  created() {},
  methods: {
    
  },
  mounted: function() {}
};
</script>

<style lang='less'>
@common-color: #20a0ff;
#app {
  font-size: 14px;
}
/* 清除浮动 */
.clearfix{zoom: 1}
.clearfix::after{display: block;visibility: hidden;clear: both;height: 0;content: '.';}

.el-breadcrumb {
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}
.el-menu {
  border-right: none !important;
  background-color: #26354d !important;
  color: #fff !important;
}
.el-pagination {
  padding: 0px !important;
}
.el-dialog--small {
  width: 600px !important;
}
//点击的样式；
.modal-name{
  color: #3f8def;
  text-decoration: underline;
  white-space: nowrap;
  cursor: pointer;
}
.center{
  text-align: center;
}
//文字超出部分隐藏，点击出显示全部文字;
.el-tooltip__popper{
  width: 60%;
  line-height: 1.8 !important;
}
//分页距离上面的高度;
.pagination {
  margin-top: 10px;
}
.el-form--label-top .el-form-item__label {
  padding: 0px !important;
}
.el-autocomplete{
  width: 100%;
}
.table-operator {
  color: @common-color;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
  & + .table-operator {
    margin-left: 10px;
  }
}
.required > label {
  position: relative;
  &::before {
    content: "*";
    position: absolute;
    left: -10px;
    color: #f00;
  }
}
textarea {
  font-family: "微软雅黑";
  font-size: 12px;
}
.add-row-btn {
  font-size: 20px;
  font-weight: bolder;
  cursor: pointer;
  color: @common-color;
}
.form-msg {
  width: 100%;
  height: 25px;
  line-height: 25px;
  background: #ffe99b;
  color: #8f362b;
  font-size: 12px;
  text-align: center;
  position: absolute;
  top: 0px;
  left: 0px;
}
.pagination {
  padding: 10px 0px;
  text-align: right;
}
.el-dialog .el-dialog__title{
  font-size: 14px;
}
.el-dialog .el-dialog__headerbtn{
  top: 24px;
}
.cell{
  text-align: center;
}
.el-select{
  width: 100%;
}
.tb-top-operator{
  display: flex;
  justify-content: space-between;
  padding:10px 0px;
  .left{
    display: flex;
    >div{
      &+div{
        margin-left:10px;
      }
    }
  }
}
.quill-editor{
  height: 200px;
}
#detail {
  .el-step__icon {
    background: #f5f5f5;
    width: 40px !important;
    height: 40px !important;
    > i {
      width: 100%;
      height: 100%;
      background-size:100%;
    }
  }
  .el-step{
    .el-step__title,.el-step__description{
      font-size:14px;
    }
    .el-step__line{
      // border:none !important;
      background: none;
      height:11px;
      top:50%;
      margin-top:-6px;
      .el-step__line-inner{
        width:100% !important;
        height: 100%;
        border:none;
        background-repeat: no-repeat;
        background-size:72px 12px;
        background-position:center;
        background-image: url('../static/img/arrow-right-gray.png');
      }
    }
    .is-finish{
      .el-step__line-inner{
        background-image: url('../static/img/arrow-right-blue.png');
      }
    }
  }
}

.s1 {
  background: url(../static/img/dingdan-gray.png);
}
.s1-active {
  background: url(../static/img/dingdan-blue.png);
}
.s2 {
  background: url(../static/img/fukuan-g.png);
}
.s2-active {
  background: url(../static/img/fukuan-b.png);
}
.s3 {
  background: url(../static/img/shenhe-g.png);
}
.s3-active {
  background: url(../static/img/shenhe-b.png);
}
.s4 {
  background: url(../static/img/shentu-g.png);
}
.s4-active {
  background: url(../static/img/shentu-b.png);
}
.s5 {
  background: url(../static/img/jiagong-g.png);
}
.s5-active {
  background: url(../static/img/jiagong-b.png);
}
.s6 {
  background: url(../static/img/fahuo-g.png);
}
.s6-active {
  background: url(../static/img/fahuo-b.png);
}
.s7 {
  background: url(../static/img/jiaoyi-g.png);
}
.s7-active {
  background: url(../static/img/jiaoyi-b.png);
}

/* 添加/编辑子账户 */
.add-subaccount {
  .el-checkbox  {
    width: 160px;
    margin-left: 0 !important;
  }
  .el-checkbox:nth-child(n+7) {
    margin-top: 28px;
  }
  .el-form-item__error{
    top: 91%;
  }
  .el-input__inner {
    height: 34px;
    border-radius: 0;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  .el-checkbox__inner {
    border-radius: 0;
  }
}
/*订单管理*/
.el-tooltip__popper_userInfo{
  width: auto;
}


</style>
