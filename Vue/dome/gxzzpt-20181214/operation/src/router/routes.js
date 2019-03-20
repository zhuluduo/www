import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const router = new VueRouter({
    routes: [{
            path: "/",
            redirect: '/login'
        },
        {
            path: "/login",
            component: resolve => require(['../page/login.vue'], resolve)
        },
        {
            path: "/main",
            component: resolve => require(['../page/main.vue'], resolve),
            children: [{
                    path: 'index',
                    component: resolve => require(['../page/index.vue'], resolve)
                },
                {
                    path: 'service-manage',
                    component: resolve => require(['../page/service-manage.vue'], resolve)
                },
                {
                    path: 'crafts-manage',
                    component: resolve => require(['../page/crafts-manage.vue'], resolve)
                },
                {
                    path: 'add-materials',
                    component: resolve => require(['../page/add-materials.vue'], resolve)
                },
                {
                    path: 'edit-materials',
                    component: resolve => require(['../page/edit-materials.vue'], resolve)
                },
                {
                    path: 'materials-manage',
                    component: resolve => require(['../page/materials-manage.vue'], resolve)
                },
                {
                    path: 'mutaul-exclusion',
                    component: resolve => require(['../page/mutaul-exclusion.vue'], resolve)
                },
                {
                    path: 'NeedCategory-manage',
                    component: resolve => require(['../page/NeedCategory-manage.vue'], resolve)
                },
                {
                    path: 'add-crafts',
                    component: resolve => require(['../page/add-crafts.vue'], resolve)
                },
                {
                    path: 'add-service',
                    component: resolve => require(['../page/add-service.vue'], resolve)
                },
                {
                    path: 'edit-crafts',
                    component: resolve => require(['../page/edit-crafts.vue'], resolve)
                },
                {
                    path: 'edit-service',
                    component: resolve => require(['../page/edit-service.vue'], resolve)
                },
                {
                    path: 'order-manage',
                    component: resolve => require(['../page/order-manage.vue'], resolve)
                },
                {
                    path: 'order-detail',
                    component: resolve => require(['../page/order-detail.vue'], resolve)
                },
                {
                    path: 'refund-order',
                    component: resolve => require(['../page/refund-order.vue'], resolve)
                },
                //需求方管理；
                {
                    path: 'demander-manage',
                    component: resolve => require(['../page/demander-manage.vue'], resolve)
                },
                {
                    path: 'personal-manage',
                    component: resolve => require(['../page/personal-manage.vue'], resolve)
                },
                {
                    path: 'demander-details',
                    component: resolve => require(['../page/demander-details.vue'], resolve)

                },
                //供应商管理
                {
                    path: 'manufacturer-manage',
                    component: resolve => require(['../page/manufacturer-manage.vue'], resolve)
                },
                {
                    path: 'manufacturer-details',
                    component: resolve => require(['../page/manufacturer-details.vue'], resolve)
                },
                {
                    path: 'manufacturer-information',
                    component: resolve => require(['../page/manufacturer-information.vue'], resolve)
                },
                {
                    path: "/Tree-common",
                    component: resolve => require(['../page/Tree-common.vue'], resolve)
                },
                {
                    path: 'info-manage',
                    component: resolve => require(['../page/info-manage.vue'], resolve)
                },
                {
                    path: 'add-info',
                    component: resolve => require(['../page/add-info.vue'], resolve)
                },
                {
                    path: 'edit-info',
                    component: resolve => require(['../page/edit-info.vue'], resolve)
                },
                //资源推广
                {
                    path: 'resource-list/:name',
                    component: resolve => require(['../page/resource-list.vue'], resolve)
                },
                //需求
                {
                    path: 'distributing-requirement',
                    component: resolve => require(['../page/distributing-requirement'], resolve)
                },
                {
                    path: 'requirement-details',
                    component: resolve => require(['../page/requirement-details'], resolve)
                },
                {
                    path: 'dispatch-order',
                    component: resolve => require(['../page/dispatch-order'], resolve)
                },
                {
                    path: 'offering-requirement',
                    component: resolve => require(['../page/offering-requirement'], resolve)
                },
                {
                    path: 'audit-requirement',
                    component: resolve => require(['../page/audit-requirement'], resolve)
                },
                {
                    path: 'Quote-details',
                    component: resolve => require(['../page/Quote-details'], resolve)
                },
                {
                    path: 'offered-requirement',
                    component: resolve => require(['../page/offered-requirement'], resolve)
                },
                {
                    path: 'requirement-Resolve', //需求解析
                    component: resolve => require(['../page/requirement-Resolve'], resolve)
                },
                {
                    path: 'sub-account',
                    component: resolve => require(['../page/subaccount'], resolve)
                },
                {
                    path: 'add-subaccount',
                    component: resolve => require(['../page/add-subaccount'], resolve)
                },
                {
                    path: 'edit-subaccount',
                    component: resolve => require(['../page/edit-subaccount'], resolve)
                },
                //信息收集
                {
                    path: 'suggestion-feedback',
                    component: resolve => require(['../page/suggestion-feedback'], resolve)
                },
                //设置
                {
                    path: 'account-settings',
                    component: resolve => require(['../page/account-settings'], resolve)
                },
                {
                    path: 'message-settings',
                    component: resolve => require(['../page/message-settings'], resolve)
                },
                //消息
                {
                    path: 'sys-message',
                    component: resolve => require(['../page/sys-message'], resolve)
                },
                {
                    path: 'after-application',
                    component: resolve => require(['../page/after-application'], resolve)
                },
                {
                    path: 'after-handler',
                    component: resolve => require(['../page/after-handler'], resolve)
                },
                {
                    path: 'after-detail',
                    component: resolve => require(['../page/aftersale-detail'], resolve)
                },
            ]
        }
    ]
})
export default router;