<template>
  <div id="app">
    <router-view v-if="isRouterAlive "></router-view>
  </div>
</template>

<script>
export default {
  provide(){
    return{
      reload:this.reload
    }
  },
  data() {
    return {
      isRouterAlive:true
    };
  },
  created() {
    this.getWords();
  },
  methods: {
    getWords() {
      this.$http.post("/getWords").then(res => {
        if (res.data.code == 200) {
          localStorage.setItem("words", JSON.stringify(res.data.data));
        }
      });
    },
    reload(){
      this.isRouterAlive=false;
      setTimeout(()=>{
        this.isRouterAlive=true; 
      },50) 
     
    }
  },
  mounted: function() {}
};
</script>

<style lang="less" rel="stylesheet/less" type="text/less">
@common-color: #3f8def;
.common-ellipsis-1{
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.common-ellipsis-3{
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  word-break: break-all;
}

.tb-link:hover{
  color: #3f8def;
  cursor: pointer;
}

.el-autocomplete{
  width: 100%
}
.area-select {
  border-radius: 0;
  height: 34px;
}
/* .el-dialog__header{
  padding: 8px !important;
  background-color: #ebebeb;
} */
/* .el-form-item__error{
    padding-top: 2px !important;
} */
/* .el-dialog__headerbtn{
  top: 12px !important;
  right: 12px !important;
} */
.el-dialog__footer{
  padding: 0px 28px  31px 28px!important;
  .el-button--default{
    background: #d0d0d0 !important;
    color: #fff !important;
  }
  .el-button+.el-button {
    margin-left: 34px !important;
  }
}
.el-pager li {
  font-weight: normal !important;
}
.el-textarea__inner{
  border-radius: 0 !important;
}
.modal-name{
  color: @common-color;
  text-decoration: underline;
  white-space: nowrap;
  cursor: pointer;
}
.el-dialog__header {
  text-align: center;
}
.el-message {
  top: 0;
  bottom: 0;
  margin: auto;
  height: 60px;
}

.el-upload-list__item .el-icon-upload-success {
  color: #e2e2e2 !important;
}
.el-select__tags{
  white-space: nowrap!important;
  flex-wrap: nowrap !important;
  overflow: hidden;
}
/*面包屑*/
.pull-cursor{cursor: pointer;}

#index .article-content{
  p{
    color: #a09f9f !important;
    img{
      display: none !important;
    }
  }
}


/* 自动报价开始 */
.auto-quotation {
  background: #fff;
  .go-on-upload{
    span{
      color: #3f8def;
    }
  }
  .el-dialog__body {
    padding: 0 !important;
  }
  .el-dialog {
    margin-top: 8vh !important;
  }
  .el-input__icon {
    line-height: 28px !important;
  }
  .el-dialog__footer {
    padding: 20px 20px 20px !important;
  }
  .cnc-step-dlg {
    .el-icon-close:before {
      font-size: 20px !important;
      font-weight: 700 !important;
    }
    .el-dialog__header {
      padding: 14px 20px !important;
      text-align: center;
      font-size: 20px !important;
      color: #333;
      border-bottom: 1px solid #e2e2e2;
      box-sizing: border-box;
      .el-dialog__headerbtn{
        top: 19px !important;
      }
    }
    .params-box {
      .el-select .el-input__inner {
        width: 175px;
      }
      .el-input {
        width: 175px;
      }
    }
  }
  .cnc-material-dlg {
    .el-dialog__header {
      padding: 0 20px !important;
      text-align: left;
      font-size: 16px;
      color: #333;
      border-bottom: 1px solid #e2e2e2;
      box-sizing: border-box;
    }
    .el-dialog__headerbtn {
      top: 22px !important;
    }
    .el-icon-close:before {
      font-size: 30px !important;
    }
  }
  .cnc-step-dlg,
  .cnc-material-dlg {
    .el-button {
      width: 110px;
      height: 44px !important;
      padding: 0 !important;
      line-height: 1 !important;
      font-size: 18px;
    }
  }
  .el-table__body-wrapper {
    height: 209px;
  }
  .el-table th {
    text-align: center;
    background: #f5f5f5;
  }
  .el-input__inner {
    height: 28px !important;
    border-radius: 0;
    color: #65656e;
  }
  .cnc-title {
    .btn {
      .el-button--primary {
        width: 98px;
        height: 38px !important;
        padding: 0 !important;
        line-height: 36px !important;
        font-size: 14px;
        font-weight: 700;
        color: #3f8def;
        background: #fff !important;
        border: 2px solid #3f8def;
        border-radius: 0;
        box-sizing: border-box;
      }
    }
  }
  .cnc-info {
    .left {
      .el-upload {
        display: block;
      }
      .el-button--primary {
        width: 120px;
        height: 48px !important;
        padding: 0 !important;
        line-height: 48px !important;
        font-size: 14px;
        background: #3f8def !important;
        margin-top: 69px;
      }
    }
  }
}
/* 自动报价结束 */

/*订单支付开始*/
.pay-page {
  .el-radio {
    display: flex;
    align-items: center;
  }
}
/*订单支付结束*/
.table-btn {
  color: @common-color;
  text-decoration: underline;
  cursor: pointer;
  & + .table-btn {
    margin-left: 18px;
  }
}
.delete-btn {
  color: #ff342f;
}
.co-f1 > th {
  background: #f1f1f1 !important;
}

// 步骤样式表
#detail {
  .el-step__icon {
    background: #f5f5f5;
    width: 40px !important;
    height: 40px !important;
    > i {
      width: 100%;
      height: 100%;
      background-size: 100%;
    }
  }
  .el-step {
    .el-step__title,
    .el-step__description {
      font-size: 14px;
    }
    .el-step__line {
      // border:none !important;
      background: none;
      height: 11px;
      top: 50%;
      margin-top: -6px;
      .el-step__line-inner {
        width: 100% !important;
        height: 100%;
        border: none;
        background-repeat: no-repeat;
        background-size: 72px 12px;
        background-position: center;
        background-image: url("../static/img/arrow-right-gray.png");
      }
    }
    .is-finish {
      .el-step__line-inner {
        background-image: url("../static/img/arrow-right-blue.png");
      }
    }
  }
}
/*步骤样式结束*/
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
.search-input {
  input {
    border-radius: 0 !important;
  }
}
.el-icon-search:before {
  font-size: 22px;
}
.el-menu--horizontal {
  border-bottom: none !important;
}
.index-header {
  .header-center {
    > .el-menu {
      background: none !important;
      > .el-menu-item {
        background: none !important;
        > .el-submenu__title {
          border-bottom: none !important;
          color: #fff !important;
          background: none !important;
        }
      }
    }
  }
}
// .is-active {
//   color: #fff !important;
//   border-bottom: none !important;
// }
//制造页面的样式修改
.manufacturer .el-form-item--small .el-form-item__content {
  line-height: normal;
}
.manufacturer .el-form-item--small.el-form-item{
  margin-bottom: 26px;
}
.manufacturer  .el-input__inner{
    padding: 0 10px !important;
  }
/*购物车模块*/
.buyCar{
  .el-input__inner{
    height: 28px !important;
  }
}
/* 添加/编辑子账户 */
.ae-subaccount {
  .el-checkbox  {
    margin-right: 60px;
    margin-left: 0 !important;
    width: 125px;
  }
  .el-form-item__content{
    // margin-left:0px !important; 
  }
  .el-checkbox:nth-child(n+7) {
    margin-top: 20px;
  }
  .el-form-item__error{
    top: 91%;
  }
  .el-form-item {
    margin-bottom: 15px;
  }
  .el-checkbox__inner {
    border-radius: 0;
  }
}

.refund-order {
  .form {
    textarea {
      height: 126px !important;
    }
  }
}

/*供应商服务*/
.manufacturerserve , .onlineBox{
  .el-table__row {
    height: 60px;
  }
  .is-leaf{
    background-color: #f2f2f2 ;
  }
  .el-dialog__header{
    .el-dialog__title{
      font-size: 16px;
    }
  }
  .el-dialog__footer{
    padding-top:9px !important;
  }
  .el-select{
    width: 100%;
  }
  .el-icon-close:before {
     font-size: 14px !important;
  }
}
.pointer{
  cursor: pointer;
}
.keyword{
  color:@common-color;
}
.el-dialog__body{
  position: relative;
}
.baike{
  .content{
    img{
      display: none;
    }
  }
}

//企业设置页面
.company-settings{
  .el-checkbox{
    width: 145px;
  }
}

/*新首页搜索样式*/
.input-with-select{
  border:1px solid #c1c1c1;
  border-right:0px;
  .el-input-group__prepend{
    border:none !important;
  }
  input{
      border-radius: 0px !important;
      background-color: #fff !important;
      border:0px !important;
  }
  .pre-select{
      width: 100px;
      border:none !important;
  }
  .search-btn{
      color: #fff !important;
      border-radius: 0px;
      height: 36px;
  }
}
//面包屑
.crumb-bread{
    height: 35px;
    line-height: 35px;
    .router-link{
        cursor: pointer;
        &:hover{
            color: #3f8def;
            text-decoration: underline;
        }
    }
    .right-arrow{
        margin: 0 5px;
    }
    .curr{
        color: #3f8def;
    }
}
</style>
