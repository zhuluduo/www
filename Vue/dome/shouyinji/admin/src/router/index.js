import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Dashboard from '@/components/Dashboard'



/*出库管理*/
import ScrapList from '@/components/scrap/list' // 出库单列表
import ScrapDetail from '@/components/scrap/detail' // 出库单详情

/*入库管理*/
import StockInList from '@/components/scrap/stockin/list' // 入库单列表
import StockInDetail from '@/components/scrap/stockin/detail' // 入库单详情

/*盘点*/
import StockTakingList from '@/components/inventory/stocktaking/list' // 库存盘点
import StockTakingCreate from '@/components/inventory/stocktaking/create' // 盘点明细

/*统计分析*/
import StatisticsProduct from '@/components/statistics/product' // 商品分析


/*店铺管理*/
import StoreList from '@/components/store/list' // 店铺列表

/*店铺管理*/
import AdvList from '@/components/system/advertisement' // 广告设置
/*系统设置*/
import systemMemberallocation from '@/components/system/wechat' // 会员管理


/*错误提示页*/
import Error401 from '@/components/error/401'
import Error404 from '@/components/error/404'

// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/components/Login'], resolve);

Vue.use(Router);


let router = new Router({
// mode: 'history',
  routes: [
    {
      path: '/login',
      name: '登录',
      component: Login
    },
    {
      path: '/',
      component: Home,
      name: '主页',
      redirect: '/dashboard',
      meta: { role: ['admin'] }, //页面需要的权限
      leaf: true, // 只有一个节点
      menuShow: true,
      iconCls: 'iconfont icon-home', // 图标样式class
      children: [
        {path: '/dashboard', component: Dashboard, name: '首页', meta: { role: ['admin'] }, menuShow: true}
       ]
    },
    {
      path: '/',
      component: Home,
      name: '店铺管理',
      redirect:'/store/list',
      leaf:true,
      menuShow: true,
      iconCls: 'iconfont icon-jfun-store',
      children: [
        {path: '/store/list', component: StoreList, name: '店铺管理', menuShow: true},
      ]
    },
    {
      path: '/',
      component: Home,
      name: '统计分析',
      menuShow: true,
      iconCls: 'iconfont icon-statistics',
      children: [
        {path: '/statistic/product', component: StatisticsProduct, name: '商品分析', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '库存管理',
      menuShow: true,
      iconCls: 'iconfont icon-inventory',
      children: [
        {path: '/inventory/stocktaking/list', component: StockTakingList, name: '盘点记录', menuShow: true},
        {path: '/inventory/stocktaking/create', component: StockTakingCreate, name: '盘点详情', menuShow: false},
        {path: '/scrap/list', component: ScrapList, name: '出库记录', menuShow: true},
        {path: '/scrap/detail/:id/:no/:user/:quantity', component: ScrapDetail, name: '出库详情', menuShow: false},
        {path: '/scrap/stockin/list', component: StockInList, name: '入库记录', menuShow: true},
        {path: '/scrap/stockin/detail/:id', component: StockInDetail, name: '入库详情', menuShow: false}
  ]
    },
    {
      path: '/',
      component: Home,
      name: '系统设置',
      menuShow: true,
      iconCls: 'iconfont icon-statistics',
      children: [
        {path: '/system/wechatuser', component: systemMemberallocation, name: '会员管理', menuShow: true},
        {path: '/system/advertisement', component: AdvList, name: '广告管理', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '错误',
      menuShow: false,
      iconCls: 'iconfont icon-books',
      children: [
          {path: '/error/401', component: Error401, name: '401', menuShow: false},
          {path: '/error/404', component: Error404, name: '404', menuShow: false}
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/login')) {
    window.sessionStorage.removeItem('currentUser');
    next()
  } else {
    let user = JSON.parse(window.sessionStorage.getItem('currentUser'));
    if (!user) {
      next({path: '/login'})
    } else {
      next()
    }
  }
});

export default router
