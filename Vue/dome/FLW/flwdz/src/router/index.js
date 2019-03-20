import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Index from '@/components/Index'
Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'Home',
        redirect: '/Home',
        component: Index,
        children: [
            { path: '/Home', component: Home, name: '测试1' }
        ]
    }]
})