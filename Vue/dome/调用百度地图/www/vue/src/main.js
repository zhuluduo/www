import Vue from 'vue'
import App from './App'
import router from './router/routes'
import {store} from './vuex/store.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Echarts from 'echarts'
Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.prototype.$echarts = Echarts;

router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
      sessionStorage.removeItem('currentUser');
  }
  let user = sessionStorage.getItem('currentUser');
  if (!user && to.path != '/login') { // 判断是否登录
      next({ path: '/login' })
  } else {
      next()
  }
})
var WebRoot = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

