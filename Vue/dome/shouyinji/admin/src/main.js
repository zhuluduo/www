// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import vueResource from 'vue-resource'
import App from './App'
// import Vuex from 'vuex'
// import store from './vuex/store'
import '../theme/index.css'
import ElementUI from 'element-ui'
import '@/assets/iconfont.css'
import router from './router'

import $ from 'jquery'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(vueResource);

// Vue.use(Vuex)


// import axios from 'axios'
// Vue.use(axios)



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // store,
  template: '<App/>',
  components: { App }
})
