<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import {weixin} from './common/common'
import CommonService from './services/CommonService'
export default {
  name: 'App',
  data () {
    return {
      commonService: new CommonService()
    }
  },
  mounted() {
     let url = location.href.split('#')[0];
    this.commonService.getSignature( url ).then(( res ) => {
      if ( res.code == 200 ) {
        weixin.share(location.href, location.href, '机械加工、注塑冲压5000件大富智造云平台',
        `${process.env.CLIENT_ROOT}/mobile/static/img/banner.png`,res.data.timestamp,res.data.nonceStr,res.data.sign);
      }
    })
  }
}
</script>

<style lang="scss">
//element 公共的样式；
@import './assets/css/my-ele.scss';
//mint 公共的样式；
@import './assets/css/my-mint.scss';

</style>

