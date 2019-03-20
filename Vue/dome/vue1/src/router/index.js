import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

// import Dome from '@/components/proudet/dome'
// import Domes from '@/components/proudet/dome1'


Vue.use(Router)

let router = new Router({
  routes: [
	 {
	 	path:'/',
	 	name:'主页',
	 	redirect:'/index',
	 	iconCls: 'iconfont icon-product',
	 	component:resolve=>require(['@/components/HelloWorld'],resolve),
	 	leaf: true, // 只有一个节点
	 	menuShow: true,
	 	children:[
		 {
			path:'/',
			name:'主页',
			menuShow:true,
		  component:resolve=>require(['@/components/Index'],resolve),
		 }
	 	]
	 },

    {
      path: '/',
      name: '首页',
      menuShow: true,
			iconCls: 'iconfont icon-product',
			component:resolve=>require(['@/components/HelloWorld'],resolve),
			children:
			[
      	{
					path: '/proudet/dome',
					name: '第一页',
					menuShow: true,
					component:resolve=>require(['@/components/proudet/dome'],resolve),
				},
				{
					path:'/proudet/dome1',
				  name:'第二页',
					menuShow:true,
					component:resolve=>require(['@/components/proudet/dome1'],resolve),
			  }
      ]
    },
  ]
})


export default router