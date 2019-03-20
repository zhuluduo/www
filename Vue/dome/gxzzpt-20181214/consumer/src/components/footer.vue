<template>
<div id="footer" class="footer-compatible">
  <div class="wrapper">
    <!-- <ul class="footer-list">
      <li class="footer-list-item logo" >
        <img @click="$router.push({path: '/index'})" src="../../static/img/logo-footer.png" alt="">
      </li>
      <li class="footer-list-item">
        <p class="footer-list-title">公司业务</p>
        <ul class="list-item-list">
          <li><a href="/client/upload3D">3D打印</a></li>
          <li><a href="/client/mechanicalPrint">CNC加工</a></li>
        </ul>
      </li>
      <li class="footer-list-item">
        <p class="footer-list-title">公司介绍</p>
        <ul class="list-item-list">
          <li><a href="http://www.tatfook.com/about-us/" target="_blank">大富科技</a></li>
          <li><a href="http://www.idreamtech.com.cn/about.html" target="_blank">爱致科技</a></li>
        </ul>
      </li>
      <li class="footer-list-item">
        <p class="footer-list-title">友情链接</p>
        <ul class="list-item-list">
          <li><a href="http://keepwork.com/wiki/home" target="_blank">大富网络</a></li>
          <li><a href="http://www.hyanlabel.com.cn/" target="_blank">华阳微电子</a></li>
          <li><a href="http://www.quaintfab.com/" target="_blank">大富精工</a></li>
        </ul>
      </li>
      <li class="footer-list-item">
        <p class="footer-list-title">服务协议</p>
        <ul class="list-item-list">
          <li><a @click="$router.push({path:'/contract', query: {index: 1}})" target="_blank">商务合同</a></li>
          <li><a @click="$router.push({path:'/contract', query: {index: 2}})" target="_blank">隐私政策</a></li>
        </ul>
      </li>
      <li class="footer-list-item">
        <p class="footer-list-title">联系我们</p>
        <ul class="list-item-list">
          <li style="cursor: auto"><img width="100" src="../../static/img/EWMlog.jpg" alt=""></li>
        </ul>
      </li>
    </ul> -->
    <ul class="footer-compatible-list">
        <li class="footer-compatible-log"><img @click="$router.push({path: '/index'})" src="../../static/img/logo-footer.png" alt=""></li>
        <li class="footer-compatible-text">
          <div class="compatible-text-top">
            <ul>
              <li>
                <h3>业务范围</h3>
                <span @click="$router.push({path: '/manual-quote', query:{techniqueType:530010}})" >3D打印</span>
                <span @click="$router.push({path: '/manual-quote', query:{techniqueType:530020}})" >机械加工</span>
                <!-- <span @click="ScopeBusiness(106060,'注塑加工')" >注塑加工</span> -->
              </li>
              <li>
                <h3>信息交流</h3>
                <span @click="ExtranetJump('/technical-zone',2)">新技术专区</span>
                <span @click="resolveTag(5)">常见问题</span>
                <span @click="Notice(200050)">平台公告</span>
              </li>
              <li>
                <h3>供应商帮助</h3>
                <span @click="resolveTag(5,'on5')" >成为供应商</span>
                <span @click="resolveTag(5,'on6')">企业资料填写</span>
                <span @click="resolveTag(5,'on18')">如何参与报价</span>
              </li>
              <li>
                <h3>需求方帮助</h3>
                <span @click="resolveTag(5,'on14')">如何提交需求</span>
                <span @click="resolveTag(5,'on37')">多久收到报价</span>
                <span @click="resolveTag(5,'on23')">资金如何保障</span>
              </li>
              <li>
                <h3>友情链接</h3>
                <span @click="ExtranetJump('http://www.tatfook.com',1)">大富科技</span>
                <!-- <span @click="ExtranetJump('http://www.quaintfab.com/',1)">大富精工</span>
                <span @click="ExtranetJump('http://www.hyanlabel.com.cn/',1)">华阳微电子</span> -->
              </li>
            </ul>
          </div>
          <div class="compatible-text-bottom">
            <p>
              <span>关于我们</span>
              <span>联系我们</span>
              <span @click="resolveTag(1)">合同条款</span>
              <span @click="resolveTag(2)">隐私政策</span>
              <span @click="resolveTag(4)">保密协议</span>
            </p>
            <p class="copyright">© 2015-2018 深圳市大富科技股份有限公司 ｜ 粤ICP备10049704号-1</p>
          </div>
        </li>
        <li class="footer-compatible-code">
          <p class="code-title footer-compatible-title">联系我们</p>
           <img src="../../static/img/EWMlog.jpg" alt="">
        </li>
    </ul>
    <!-- <div class="copyright"> © 2015-2018 深圳市大富科技股份有限公司 ｜ 粤ICP备10049704号-1 </div> -->
  </div>
</div>
</template>
<script>
export default{
    data() {
    return {

    };
  },
  methods:{
    ScopeBusiness(index,name){
        let routeData = this.$router.resolve({path: '/artificial-quotation', query: {requirementType: index,requirementName:name}});
        window.open(routeData.href, '_blank');
    },
    resolveTag(index,id){
        let routeData = this.$router.resolve({path: '/contract', query: {index: index,id:id}});
        window.open(routeData.href, '_blank');
    },
    Notice(index){
        let routeData = this.$router.resolve({path: '/crafts-list', query: {moduleType: index}});
        window.open(routeData.href, '_blank');
    },
    ExtranetJump(url,index){
      if(index==1){
      window.open(url, '_blank');
      }else{
        let routeData = this.$router.resolve({path: url});
        window.open(routeData.href, '_blank');
      }
    },
  }
}
</script>
<style lang="less" scoped>
#footer {
  width: 100%;
  min-height: 315px;
  background: #2e2e2e;
  color: #fefefe;
  position: relative;
  z-index: 10;
  .wrapper {
    width: 1200px;
    margin: auto;
    height: 100%;
    min-height: 315px;
    padding: 35px 0 0 0;
    box-sizing: border-box;
    .footer-list {
      display: flex;
      justify-content: space-between;
      margin-top: 50px;
      .footer-list-item {
        > p {
          font-size: 16px;
        }
        >ul{
          margin-top:36px;
          li:not(:first-child){
            margin-top:22px;
          }
          a{
            color:#fefefe;
            &:hover{
              color:#20a0ff;
            }
          }
        }
      }
    }
    .logo{
      padding-top: 25px;
      img{
        width: 237px;
        height: 43px;
      }
    }
    // .copyright {
    //   text-align: center;
    //   color:#cdcdcd;
    //   font-size: 12px;
    // }

  .footer-compatible-list{
    width: 100%;
    overflow: hidden;
    li{float: left;}
    span{
      cursor: pointer;
    }
    .footer-compatible-title{font-size: 16px;}
    .footer-compatible-log{
      width: 240px;
      height:45px;
      margin-right: 90px;
      img{
        width:237px;
        height:43px;
        margin-top: 22px;
      }
    }
    .footer-compatible-text{
      width: 760px;
      min-height: 250px;
      padding:0 10px;
      box-sizing: border-box;
      h3,span{display:block;font-weight: normal;font-family: MicrosoftYaHei;}
          h3{
            font-size: 14px;
            color: #ffffff;
          }
          span,p{
            color: #cdcdcd;
            font-size: 12px;
          }
      .compatible-text-top{
        overflow: hidden;
        li{
          width: 20%;
          padding-left: 5px;
          box-sizing: border-box;
          h3{padding-bottom: 25px;}
          span+span{margin-top: 12px;}
        }
      }
      .compatible-text-bottom{
          margin-top: 55px;
          span{display: inline-block;padding-right: 20px;position: relative;}
          span+span{
            padding: 0 20px;
            &::before{
            content:"";
            width: 1px;
            height:15px;
            background: #cdcdcd;
            position: absolute;
            top: 0;
            left:0;
            }
          }
          .copyright{margin-top: 30px;}
      }
    }
    .footer-compatible-code{
      width: 110px;
      padding:0 5px;
      box-sizing: border-box;
      .code-title{
      font-size: 14px;
      color: #fff;
      padding-bottom: 27px;
      }
      img{
        width: 100px;
        height:100px;
      }
    }
     .compatible-text-top,.compatible-text-bottom{
          span{
            &:hover{
              color: #3f8def;
             }
          }
     }
  }
  }
}
</style>
