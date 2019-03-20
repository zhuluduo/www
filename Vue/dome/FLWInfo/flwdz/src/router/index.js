import Vue from 'vue'
import Router from 'vue-router'
// import Header from '@/components/header'
// import Index from '@/components/Index'
Vue.use(Router)

export default new Router({
    routes: [
// 	{
//         path: '/',
//         name: '头部',
//         redirect: '/header',//初始加载
//         component: resolve => require(['@/components/Index'], resolve),
//         children: [
//             { path: '/header',  component: resolve => require(['@/components/header'], resolve), name: '头部' }
//         ]
//     }
	{
        path: '/',
        name: '公共',
		redirect: '/home',
        component: resolve => require(['@/components/Index'], resolve),
        children: [
            { path: '/home',  component: resolve => require(['@/components/home'], resolve), name: '内容' }
        ]
    }
	]
})