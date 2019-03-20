// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router'
import vueResource from 'vue-resource'
import router from './router'
import axios from 'axios'
import $ from 'jquery'

Vue.config.productionTip = false
Vue.prototype.$ajaxs = axios
Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(vueResource)




// 可以在路由元信息指定哪些页面需要登录权限
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
    // 可以在路由元信息指定哪些页面需要登录权限
    // const islogin = false // 假设没有登录（这里应从接口获取）
    // if (to.meta.requiresAuth && !islogin) { // 需要登录授权，这里还需要判断是否登录
    //   next('/login') // 跳转到登录
    //   return
    // }
    // next()
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})