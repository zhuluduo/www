import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Index from '@/components/index'


import Dome from '@/components/proudet/dome'
import Domes from '@/components/proudet/dome1'

import Domelist from '@/components/proudets/dome'
import Domeanv  from '@/components/proudets/dome1'

Vue.use(Router)

let router = new Router({
  routes: [
	 {
	 	path:'/',
	 	name:'主页',
	 	redirect:'/index',
	 	iconCls: 'iconfont icon-product',
	 	component:HelloWorld,
	 	leaf: true, // 只有一个节点
	 	menuShow: true,
	 	children:[
	 	{path:'/index',component:Index,name:'主页' ,menuShow:true}
	 	]
	 },

    {
      path: '/',
      name: 'Hello',
      menuShow: true,
      iconCls: 'iconfont icon-product',
      component: HelloWorld,
      children: [
      	{ path: '/proudet/dome',component: Dome, name: '第一页', menuShow: true},
        {path:'/proudet/dome1', component:Domes ,name:'第二页' , menuShow:true}
      ]
    },
    {
    	path:'/',
    	name:'第二个导航栏',
    	component:HelloWorld,
    	menuShow:true,
    	iconCls: 'iconfont icon-product',
    	children:[
    	{path:'/proudets/dome', component:Domelist ,name:'第三页' ,menuShow:true},
    	{path:'/proudets/dome1', component:Domeanv, name:'第四页', menuShow:true}
    	]
    }
  ]
})

export default router