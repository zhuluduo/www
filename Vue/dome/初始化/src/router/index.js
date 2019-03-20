import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import { resolve } from 'path';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/list',
      component: resolve=> require(['../components/home.vue'], resolve),
      children: [
        {path: '/list', name: 'list', component: resolve=> require(['../components/list.vue'], resolve)},
        {path: 'HelloWorld', name: 'HelloWorld', component: resolve=> require(['../components/HelloWorld.vue'], resolve)}
      ]
    }
  ]
})
