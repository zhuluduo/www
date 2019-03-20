// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import vueResource from 'vue-resource'
import App from './App'
import router from './router'
import $ from 'jquery'

Vue.config.productionTip = false
Vue.use(vueResource)
    /* eslint-disable no-new */
    // 注册

new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})