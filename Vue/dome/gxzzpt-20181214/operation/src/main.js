import Vue from 'vue'
import App from './App'
import router from './router/routes'
import './assets/css/reset.css'
import Aixos from 'axios'
import 'babel-polyfill';
import {
    store
} from './vuex/store.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import components from "./compoents/index.js";
import VueQuillEditor from 'vue-quill-editor';
import vueAreaLinkage from 'vue-area-linkage';
import 'vue-area-linkage/dist/index.css';
import areaData from './lib/area.js';
import LocalStorage from './lib/LocalStorage.js';
import location from './lib/location.js';
import Clipboard from './lib/Clipboard.js';
Vue.prototype.$areaData = areaData;
Vue.use(vueAreaLinkage);
Vue.use(VueQuillEditor);
Vue.use(components);
Vue.use(ElementUI);
Vue.config.productionTip = false;
Aixos.defaults.withCredentials = true
    //通过环境配置相应的接口请求地址
var baseURL = process.env.API_ROOT;
var Upload = Aixos.create({
    baseURL: baseURL,
    withCredentials: false,
    headers: {
        'Content-Type': 'multipart/form-data'

    },
    transformRequest: [function(data) {
        return data;
    }],
    transformResponse: [function(data) {
        return JSON.parse(data);
    }],
})
var API = Aixos.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    withCredentials: true,
    transformRequest: [function(data) {
        return JSON.stringify(data);
    }],
    transformResponse: [function(data) {
        // 这里提前处理返回的数据
        try {
            data = JSON.parse(data);
        } catch (e) {
            data = data;
        }
        // if (data.code == 400) {
        //     myApp.$alert(data.message, '', {
        //         confirmButtonText: '确定',
        //         callback: action => {
        //             myApp.$router.push({ path: "/login" })
        //         }
        //     });
        // }
        if (data.code == 400) {
            setTimeout(()=>{
                myApp.$router.push({
                   path: "/login"
                })
            },2000)
        }
        return data;
    }],
})
API.interceptors.request.use(
    config => {
        var userStr = window.localStorage.getItem("operation_user");

        if (userStr) {
            var user = JSON.parse(userStr);
            let data = config.data;
            config.data = {
                token: user.token,
                ...data
            };
        }
        return config;
    },
    err => {
        // return Promise.reject(err);
    });

Vue.prototype.$http = API;

Vue.prototype.$upload = Upload;

Vue.prototype.$baseURL = baseURL;

Vue.prototype.$error = function(message) {
    myApp.$message({ message: message, type: 'error', duration: 1000 });
}
Vue.prototype.$success = function(message) {
    myApp.$message({ message: message, type: 'success', duration: 1000 });
}
Vue.prototype.$LocalStorage=LocalStorage;//获取登陆信息
Vue.prototype.$location=location;//获取页面地址栏地址
Vue.prototype.$Clipboard=Clipboard; //剪贴板
var myApp = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
router.beforeEach((to, from, next) => {
  window.scrollTo(0,0);
  next();
})