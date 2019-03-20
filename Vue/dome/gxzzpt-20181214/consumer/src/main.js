import Vue from 'vue'
import App from './App'
import router from './router/routes'
//import './assets/css/reset.css'
import Aixos from 'axios'
import 'babel-polyfill';
import vueAreaLinkage from 'vue-area-linkage';
import 'vue-area-linkage/dist/index.css';
Vue.use(vueAreaLinkage);
import {
    store
} from './vuex/store.js'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Login from './components/login/index';
import Register from './js/register-popup';
import py from '../static/js/cn2py.min.js';
import components from './components/index.js';
import areaData from './lib/area.js';
import Select from './components/select/index.js';
import '../static/css/public.less';
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

//引入常见的提示方法；
import {
  showResultTips,
  ResultTips,
  error,
  success,
  warning,
  LocalStorage,
  dateFormat
} from './lib/GeneralTools.js';
import ComPlugIn from './lib/ComPlugIn.js';
import dateTime from './lib/dateTime.js';
import Clipboard from './lib/Clipboard.js';
import scrollLeft from './lib/scrollLeft.js';
import conversion from './lib/dataConversion.js';
Vue.use(VueQuillEditor);
Vue.use(store);
Vue.use(Select);
Vue.prototype.$areaData = areaData;
Vue.use(components);
Vue.prototype.$login = Login;
Vue.prototype.$register = Register;
Vue.prototype.$py = py;
Vue.use(ElementUI);
Vue.config.productionTip = false;
Aixos.defaults.withCredentials = true;
//通过环境配置相应的接口请求地址
var baseURL = process.env.API_ROOT;
Vue.prototype.$baseURL = baseURL;
Vue.prototype.$clientRoot = process.env.CLIENT_ROOT;
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
        var userStr = localStorage.getItem('gxzzpt2_consumer') ? localStorage.getItem('gxzzpt2_consumer') : '';
        if (userStr) {
            var user = JSON.parse(userStr);
            if (user && user.token) {
                if (data) {
                    data.token = user.token;
                } else {
                    data = {
                        token: user.token
                    }
                }
            } else {

            }
            return JSON.stringify(data);
        } else {
            return JSON.stringify(data);
        }
    }],
    transformResponse: [function(data) {
        // 这里提前处理返回的数据
        try {
            data = JSON.parse(data);
        } catch (e) {
            data = data;
        }
        const matchUrl = ['/artificial-quotation', '/RetrievePassword']; //匹配的路由不需要处理未登录

        if (matchUrl.includes(myApp.$route.path)) {
            return data;
        } else {
            // if (data.code == 400) {
            //     setTimeout(() => {
            //         myApp.$router.push({ path: '/login' });
            //     }, 700);
            // } else {
            //     return data;
            // }
            if (data.code == 400) {
                myApp.$login({});
                return data;
            } else {
                return data;
            }
       
        }
    }],
})
API.interceptors.request.use(
    config => {

        return config;
    },
    err => {
        // return Promise.reject(err);
    });
Vue.prototype.$http = API;
window.$http = API;
Vue.prototype.$upload = Upload;
Vue.prototype.$fileOrigin = process.env.API_ROOT + '/';

//element消息设置;
Vue.prototype.$error = error;
Vue.prototype.$success = success;
Vue.prototype.$warning = warning;
Vue.prototype.$showResultTips = showResultTips;
Vue.prototype.$ResultTips = ResultTips;
   
Vue.prototype.$ComPlugIn = ComPlugIn;
Vue.prototype.$dateTime = dateTime; //获取时间差
Vue.prototype.$LocalStorage=LocalStorage;//获取公共字典及本得user数据
Vue.prototype.$Clipboard=Clipboard; //剪贴板
Vue.prototype.$scrollLeft=scrollLeft;//公告滚动
Vue.prototype.$conversion=conversion;
Vue.prototype.$dateFormat = dateFormat;
var myApp = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})
router.beforeEach((to, from, next) => {
    window.scrollTo(0, 0);
    next();
})
