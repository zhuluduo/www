import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Dashboard from '@/components/Dashboard'

/*商品管理*/
import ProductList from '@/components/product/list' // 在售商品列表
import ProductAll from '@/components/product/all' // 所有商品
import ProductCreate from '@/components/product/create' // 商品新增页面
import ProductWarning from '@/components/product/warning' // 过期预警

/*库存管理*/
import InventoryList from '@/components/inventory/list' // 商品入库列表
import InventoryDetail from '@/components/inventory/detail' // 入库详情
import InventoryCreate from '@/components/inventory/create' // 新增入库
import InventoryEdit from '@/components/inventory/edit' // 编辑入库单
import StockTakingList from '@/components/inventory/stocktaking/list' // 库存盘点
import StockTakingCreate from '@/components/inventory/stocktaking/create' // 盘点明细
// import ReportedList from '@/components/discardinventory/list' // 出库单
// import Create from '@/components/discardinventory/create' // 新增出库
// import Detail from '@/components/discardinventory/detail' // 出库单详情
import InventoryWarning from '@/components/inventory/warning' // 库存预警

/*出库管理*/
import ScrapList from '@/components/scrap/list' // 出库单列表
import ScrapCreate from '@/components/scrap/create' // 新增出库
import ScrapDetail from '@/components/scrap/detail' // 出库单详情

/*用户管理*/
import UserList from '@/components/user/list' // 用户管理列表

/*系统设置*/
import SystemPrintSetting from '@/components/system/printsetting' // 打印设置
import SystemAdvertisement from '@/components/system/advertisement' // 广告设置

/*统计分析*/
import StatisticsProduct from '@/components/statistics/product' // 商品分析
//import StatisticsOrder from '@/components/statistics/order' // 销售分析 -- 即订单统计分析

/*销售管理*/
import SaleOrderList from '@/components/sale/order/list' // 销售订单列表
import SaleOrderDetail from '@/components/sale/order/detail' // 销售订单详情
import SaleRefundList from '@/components/sale/refund/list' // 销售退货列表
import SaleRefundDetail from '@/components/sale/refund/detail' // 销售退货详情
import PromotionList from '@/components/discount/promotion' // 促销活动列表
import List from '@/components/discount/list' //促销活动集合
import discount from '@/components/discount/discount'  //折扣
import reduce from '@/components/discount/reduce'  //满减
import present from '@/components/discount/present' //满赠
import single from '@/components/discount/single'  //单品促销
import composition from '@/components/discount/composition'  //套餐组合
import bargaining from '@/components/discount/bargaining' //单品特价

/*错误提示页*/
import Error401 from '@/components/error/401'
import Error404 from '@/components/error/404'

// 懒加载方式，当路由被访问的时候才加载对应组件
const Login = resolve => require(['@/components/Login'], resolve)

Vue.use(Router)


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
        //{path: '/dashboard', component: StatisticsOrder, name: '首页', menuShow: true},
        {path: '/dashboard', component: Dashboard, name: '首页', meta: { role: ['admin'] }, menuShow: true}
       ]
    },
    {
      path: '/',
      component: Home,
      name: '商品管理',
      menuShow: true,
      iconCls: 'iconfont icon-product',
      children: [
        {path: '/product/list', component: ProductList, name: '在售商品', menuShow: true},
        {path: '/product/all', component: ProductAll, name: '商品上架', menuShow: false},
        {path: '/product/create', component: ProductCreate, name: '新增商品', menuShow: false},
        //{path: '/product/warning', component: ProductWarning, name: '过期预警', menuShow: true},
      ]
    },
    {
      path: '/',
      component: Home,
      name: '库存管理',
      menuShow: true,
      iconCls: 'iconfont icon-inventory',
      children: [
        {path: '/inventory/list', component: InventoryList, name: '商品入库', menuShow: true},
        //{path: '/inventory/warning', component: InventoryWarning, name: '库存预警', menuShow: true},
        {path: '/inventory/detail/:id', component: InventoryDetail, name: '入库明细', menuShow: false},
        {path: '/inventory/create', component: InventoryCreate, name: '新增入库', menuShow: false},
        {path: '/inventory/edit/:id', component: InventoryEdit, name: '编辑入库单', menuShow: false},
        {path: '/inventory/stocktaking/list', component: StockTakingList, name: '库存盘点', menuShow: true},
        {path: '/inventory/stocktaking/create', component: StockTakingCreate, name: '盘点明细', menuShow: false},
        {path: '/scrap/list', component: ScrapList, name: '出库管理', menuShow: true},
        {path: '/scrap/create', component: ScrapCreate, name: '新增出库', menuShow: false},
        {path: '/scrap/detail/:id/:no/:user/:quantity', component: ScrapDetail, name: '出库单详情', menuShow: false},
      ]
    },
    {
      path: '/',
      component: Home,
      name: '销售管理',
      menuShow: true,
      iconCls: 'iconfont icon-sale',
      children: [
        {path: '/sale/order/list', component: SaleOrderList, name: '销售订单', menuShow: true},
        {path: '/sale/order/detail/:orderNo', component: SaleOrderDetail, name: '订单详情', menuShow: false},
        {path: '/sale/refund/list', component: SaleRefundList, name: '销售退货', menuShow: true},
        {path: '/sale/refund/detail/:orderNo', component: SaleRefundDetail, name: '退货详情', menuShow: false},
        {path: '/discount/promotion', component: PromotionList, name: '促销活动', menuShow: true},
        {path: '/discount/list', component: List, name: '折扣', menuShow: false},
        {path: '/discount/discount', component: discount, name: '折扣', menuShow: false},
        {path: '/discount/reduce', component: reduce, name: '满减', menuShow: false},
        {path: '/discount/present', component: present, name: '满赠', menuShow: false},
        {path: '/discount/single', component: single, name: '单品促销', menuShow: false},
        {path: '/discount/composition', component: composition, name: '套餐组合', menuShow: false},
        {path: '/discount/bargaining', component: bargaining, name: '特价设置', menuShow: false},
      ]
    },
    {
      path: '/',
      component: Home,
      name: '统计分析',
      menuShow: true,
      iconCls: 'iconfont icon-statistics',
      children: [
        //{path: '/statistic/order', component: StatisticsOrder, name: '销售分析', menuShow: false},
        {path: '/statistic/product', component: StatisticsProduct, name: '商品分析', menuShow: true}
      ]
    },
    {
      path: '/',
      component: Home,
      name: '系统设置',
      menuShow: true,
      iconCls: 'iconfont icon-setting1',
      children: [
        {path: '/user/list', component: UserList, name: '用户管理', menuShow: true},
        {path: '/system/printsetting', component: SystemPrintSetting, name: '打印设置', menuShow: true},
        {path: '/system/advertisement', component: SystemAdvertisement, name: '广告设置', menuShow: true},
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
})

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/login')) {
    window.sessionStorage.removeItem('currentUser')
    next()
  } else {
    let user = JSON.parse(window.sessionStorage.getItem('currentUser'))
    if (!user) {
      next({path: '/login'})
    } else {
      next()
    }
  }
})

export default router
