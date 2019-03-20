import Vue from 'vue'
import Router from 'vue-router'
import { resolve } from 'path';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      redirect: '/home',
      component: resolve => require(['../vivews/common/main.vue'], resolve),
      children: [
        {path: '/home', name: '首页', component: resolve => require(['../vivews/page/home.vue'], resolve)}
      ]
    }
  ]
})
