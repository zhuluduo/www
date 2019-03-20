<template>
  <div id="home">
    <head-top :meta="meta" :left-isshow='leftIsshow' :guide-back='guideBack'></head-top>
    <div class="Content">
        <transition :name="transitionName"> 
           <router-view id="Router"></router-view>
        </transition>
    </div>
    <foot-guide v-if="!meta.UnShowfooter" class="footerInfo"></foot-guide>
    <to-Top v-if="isShowToTop"></to-Top>
  </div>
</template>

<script>
import CommonService from '../services/CommonService.js'
import toTop from '../components/toTop.vue';
import headTop from '../components/header'
import footGuide from '../components/footer'
export default {
  name: 'Home',
  data () {
    return {
      meta:'',
      guideBack:false,
      leftIsshow:false,
      Savage:true,
      isShowToTop:false,
      isRouterAlive:true,
      transitionName: 'slide-right',  // 默认动态路由变化为slide-right
      commonService: new CommonService()
    }
  },
  components:{headTop,footGuide,toTop},
  //页面跳转是监听路由变化；
  watch:{
      $route(to,from){
        this.meta = to.meta;
        //判断是的需要显示回顶部组件；
        this.isShowToTop=false;
        this.isShowGoTop();
      }
  },
  //页面刷新是监听路由辩护
  beforeRouteEnter (to, from, next) {
  // 这里还无法访问到组件实例，this === undefined
      next( vm => {
        vm.meta = to.meta;
        // 通过 `vm` 访问组件实例
      })
  },
  //实现app切换动画
  beforeRouteUpdate (to, from, next) {
  // 如果isBack为true时，证明是用户点击了回退，执行slide-right动画
   let isBack = this.$router.isBack
   let footer=document.getElementsByClassName('footerInfo')[0];
   if(footer!=undefined){
      footer.className='footerInfo footerNo'
      setTimeout(()=>{
        footer.className='footerInfo'
      },350)
   }
   if (isBack) {
      this.transitionName = 'slide-right'
   } else {
      this.transitionName = 'slide-left'
   }
   //关闭全局禁止滚动事件
   if(from.path=='/supplierDetails'||from.path=='/productDetails'||from.path=='/EnquiryDetails'){
      this.closeModal('modal-open')
   }
     
   // 做完回退动画后，要设置成前进动画，否则下次打开页面动画将还是回退
   this.$router.isBack = false
     next()
  },
  created() {
    this.commonService.getWords();
  },
  mounted() {
    this.isShowGoTop();
  },
  methods: {
    isShowGoTop(){
      let clientHeightofOne = document.documentElement.clientHeight; 
      setTimeout(()=>{
        let HomeHeight =document.getElementById('home').offsetHeight;
        if(clientHeightofOne<HomeHeight){
          this.isShowToTop=true;
        }else{
          this.isShowToTop=false;
        }
      },1000)
    },
    closeModal: function(bodyCls) {
      let scrollTop;
      document.body.classList.remove(bodyCls);
      document.scrollingElement.scrollTop = scrollTop;
    },
  },
}
</script>
<style lang="scss" scoped>
#home{
  background-color: #f1f1f1;
  .Content{
    padding-top:100px;
  }
}
#Router {
     width: 100%;
     transition: all .4s cubic-bezier(.55,0,.1,1);
}

.slide-left-enter,
 .slide-right-leave-active {
    position: absolute;
    opacity: 0;
    -webkit-transform: translate(100%, 0);
    transform: translate(100%, 0);
}

.slide-left-leave-active,
.slide-right-enter {
    position: absolute;
    opacity: 0;
    -webkit-transform: translate(-100%, 0);
    transform: translate(-100%,0);
}
.footerNo{
    opacity: 0;
}
</style>
