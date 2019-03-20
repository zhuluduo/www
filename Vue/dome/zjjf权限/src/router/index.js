import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Login from '@/components/login'

import AdminAuth from '@/components/adminManage/adminAuth'
import AdminRole from '@/components/adminManage/adminRole'
import AdminUser from '@/components/adminManage/adminUser'
import SystemAuth from '@/components/systemManage/systemAuth'
import SystemPost from '@/components/systemManage/systemPost'
import SystemRole from '@/components/systemManage/systemRole'
import SystemUser from '@/components/systemManage/systemUser'



Vue.use(Router)

const router = new Router({
    routes: [{
            path: '/Login',
            name: 'Login',
            hidden: true,
            component: Login
        },
        {
            path: '/',
            name: '权限系统管理',
            authString: 'adm',
            component: Index,
            redirect: '/adminAuth',
            children: [
                { path: '/adminAuth', name: '权限管理', component: AdminAuth, authString: "adm:auth", hidden: false },
                { path: '/adminRole', name: '角色管理', component: AdminRole, authString: "adm:role", hidden: false },
                { path: '/adminUser', name: '用户管理', component: AdminUser, authString: "adm:user", hidden: false },
            ]
        },
        {
            path: '/',
            name: '系统管理',
            authString: "auth",
            component: Index,
            children: [
                { path: '/systemAuth', name: '权限管理', component: SystemAuth, authString: "auth:auth", hidden: false },
                { path: '/systemRole', name: '角色管理', component: SystemRole, authString: "auth:role", hidden: false },
                { path: '/systemUser', name: '用户管理', component: SystemUser, authString: "auth:user", hidden: false },
                { path: '/systemPost', name: '岗位管理', component: SystemPost, authString: "auth:job", hidden: false }
            ]
        }
    ]
})



export default router;