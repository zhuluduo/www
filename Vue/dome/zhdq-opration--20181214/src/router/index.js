import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: resolve => require(['../views/pages/Login.vue'], resolve)
        },
        {
            path: '/404',
            component: resolve => require(['../views/pages/404.vue'], resolve)
        },
        {
            path: '/403',
            component: resolve => require(['../views/pages/403.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        },

        {
            path: '/platform',//平台管理模块
            redirect: '/platform/user',
            component: resolve => require(['../views/common/Home.vue'], resolve),
            meta: {title: '平台管理'},
            children: [
                {
                    path: 'user',
                    component: resolve => require(['../views/pages/platformManage/userManage.vue'], resolve),
                    meta: {title: '用户管理'},
                }
            ]
        },
        {
            path: '/statistics',//统计模块
            redirect: '/statistics/traffic',
            component: resolve => require(['../views/common/Home.vue'], resolve),
            meta: {title: '数据统计'},
            children: [
                {
                    path: 'flow',
                    component: resolve => require(['../views/pages/statistics/flow.vue'], resolve),
                    meta: {title: '流量统计'},
                },
                {
                    path: 'retain',
                    component: resolve => require(['../views/pages/statistics/onlineDate.vue'], resolve),
                    meta: {title: '留存统计'},
                },
                {
                    path: 'activityRate',
                    component: resolve => require(['../views/pages/statistics/onlineDate.vue'], resolve),
                    meta: {title: '活跃统计'},
                },
                {
                    path: 'churnRate',
                    component: resolve => require(['../views/pages/statistics/churnRate.vue'], resolve),
                    meta: {title: '流失率'},
                },
                {
                    path: 'duration',
                    component: resolve => require(['../views/pages/statistics/churnRate.vue'], resolve),
                    meta: {title: '时长统计'},
                }
            ]
        },
        {
            path: '/operation',
            redirect: '/operation/log',
            component: resolve => require(['../views/common/Home.vue'], resolve),
            meta: {title: '操作日志'},
            children: [
                {
                    path: 'log',
                    component: resolve => require(['../views/pages/operationLog/log.vue'], resolve),
                    meta: {title: '操作日志'},
                }
            ]
        },
        /*下面这些是例子，可以参考，也可以全部删掉*/
        {
            path: '/examples/',
            component: resolve => require(['../views/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../views/pages/examples/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/table',
                    component: resolve => require(['../views/pages/examples/BaseTable.vue'], resolve),
                    meta: { title: '基础表格' }
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../views/pages/examples/Tabs.vue'], resolve),
                    meta: { title: 'tab选项卡' }
                },
                {
                    path: '/form',
                    component: resolve => require(['../views/pages/examples/BaseForm.vue'], resolve),
                    meta: { title: '基本表单' }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: resolve => require(['../views/pages/examples/VueEditor.vue'], resolve),
                    meta: { title: '富文本编辑器' }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: resolve => require(['../views/pages/examples/Markdown.vue'], resolve),
                    meta: { title: 'markdown编辑器' }    
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: resolve => require(['../views/pages/examples/Upload.vue'], resolve),
                    meta: { title: '文件上传' }   
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: resolve => require(['../views/pages/examples/BaseCharts.vue'], resolve),
                    meta: { title: 'schart图表' }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: resolve => require(['../views/pages/examples/DragList.vue'], resolve),
                    meta: { title: '拖拽列表' }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: resolve => require(['../views/pages/examples/Permission.vue'], resolve),
                    meta: { title: '权限测试', permission: true }
                },
            ]
        },
    ]
})
