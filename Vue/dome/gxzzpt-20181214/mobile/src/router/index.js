import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
}

export default new Router({
  routes: [{
      path: "/",
      redirect: '/index'
    },
    {
      path: '/home',
      name: '主页',
      component: () => import('../pages/Home.vue'),
      children: [{
          path: '/index',
          name: '',
          meta: {
            title: '首页',
            logoShow: true,
          },
          component: () => import('../pages/index.vue'),
        },
        {
          path: '/login',
          name: '',
          meta: {
            title: '登录'
          },
          component: () => import('../pages/login.vue'),
        },
        {
          path: '/logout',
          name: '',
          meta: {
            title: '退出登录'
          },
          component: () => import('../pages/logout.vue'),
        },
        {
          path: '/register/provider',
          name: '',
          meta: {
            title: '注册为供应商',
          },
          component: () => import('../pages/provider-register.vue'),
        },
        {
          path: '/picker',
          name: '',
          meta: {
            title: '注册为供应商',
          },
          component: () => import('../pages/picker.vue'),
        },
        {
          path: '/register/entry',
          name: '',
          meta: {
            title: '注册账号'
          },
          component: () => import('../pages/register-entry.vue'),
        },
        {
          path: '/register/demander',
          name: '',
          meta: {
            title: '注册为需求方'
          },
          component: () => import('../pages/demander-register.vue'),
        },
        {
          path: '/Guide-info',
          name: '',
          meta: {
            title: '完善信息',
            prohibitBack: true,
          },
          component: () => import('../pages/Guide-info.vue'),
        },
        {
          path: '/Enquiry',
          name: '',
          meta: {
            title: '询盘列表'
          },
          component: () => import('../pages/enquiry-list.vue'),
        },
        {
          path: '/Guide-upload',
          name: '',
          meta: {
            title: '完善信息'
          },
          component: () => import('../pages/Guide-upload.vue'),
        },
        {
          path: '/Guide-complete',
          name: '',
          meta: {
            title: '资料提交完成',
            UnShowfooter:true,
            prohibitBack: true,
          },
          component: () => import('../pages/Guide-complete.vue'),
        },
        {
          path: '/EnquiryDetails',
          name: '',
          meta: {
            title: '询盘详情'
          },
          component: () => import('../pages/enquiry-details.vue'),
        }, {
          path: '/supplierLibrary',
          name: '',
          meta: {
            title: '供应商库'
          },
          component: () => import('../pages/supplier-library.vue'),
        }, {
          path: '/supplierDetails',
          name: '',
          meta: {
            title: '供应商详情'
          },
          component: () => import('../pages/supplier-details.vue'),
        }, {
          path: '/productLibrary',
          name: '',
          meta: {
            title: '产品库'
          },
          component: () => import('../pages/product-library.vue'),
        }, {
          path: '/productDetails',
          name: '',
          meta: {
            title: '产品库详情'
          },
          component: () => import('../pages/product-details.vue'),
        },
        {
          path: '/Savage',
          name: '',
          meta: {
            title: '',
            UnShowfooter:true,
          },
          component: () => import('../components/Savage.vue'),
        }
      ]
    }
  ]
})
