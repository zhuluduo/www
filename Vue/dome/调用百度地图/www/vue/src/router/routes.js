import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '@/page/main'
import Login from '@/page/login'
Vue.use(VueRouter)
const router = new VueRouter({
	routes:[
    // {path: "/login", component:require('../page/login.vue')},
	  // // {path: "/", redirect: '/index'},
    // {
    //   path: "/", component:require('../page/main.vue'),

    //   children:[
    //     {path:'index', component:require('../page/index.vue')},
    //     {path: 'label-manager',name:'label-manager', component:require('../page/label-manager.vue')},
    //   ]
    // },
    {
      path: '/login',
      name: 'Login',
      hidden: true,
      component: Login
    },
    {
      path: '/',
      name: '应用管理',
      menuShow: true,
      // leaf: true, // 只有一个节点
      component:resolve=>require(['@/page/main'],resolve),
      children:[
        {
          path:'/applyManage/publicEarth',
          name:'共建地球',
          menuShow: true,
          component:resolve=>require(['@/page/applyManage/publicEarth'],resolve),
        },
        {
          path:'/applyManage/areaManage',
          name:'区域管理',
          menuShow:false,
          component:resolve=>require(['@/page/applyManage/areaManage'],resolve)
        },
        {
          path:'/applyManage/TaskManager',
          name:'任务管理',
          menuShow:true,
          component:resolve=>require(['@/page/applyManage/TaskManager'],resolve)
        },
        {
          path:'/applyManage/versionManage',
          name:'版本管理',
          menuShow:false,
          component:resolve=>require(['@/page/applyManage/versionManage'],resolve)
        },
        {
          path:'/applyManage/versionDetails',
          name:'版本详情',
          menuShow:false,
          component:resolve=>require(['@/page/applyManage/versionDetails'],resolve)
        },
        {
          path:'/applyManage/BuildingUsersManage',
          name:'建筑用户管理',
          menuShow:false,
          component:resolve=>require(['@/page/applyManage/BuildingUsersManage'],resolve)  
        },
        {
          path:'/applyManage/BuildingUserDetails',
          name:'建筑用户详情',
          menuShow:false,
          component:resolve=>require(['@/page/applyManage/BuildingUserDetails'],resolve) 
        },
        {
          path:'/applyManage/RoleBehavior',
          name:'用户角色行为序列',
          menuShow:false,
          component:resolve=>require(['@/page/applyManage/RoleBehavior'],resolve) 
        },
        {
          path:'/applyManage/ReviewOperation',
          name:'评审操作',
          menuShow:false,
          component:resolve=>require(['@/page/applyManage/ReviewOperation'],resolve)
        },
        {
          path:'/applyManage/EventAnalysis',
          name:'事件分析',
          menuShow:false,
          component:resolve=>require(['@/page/applyManage/EventAnalysis'],resolve)
        }
      ]
    },
  ]
})
export default router;
