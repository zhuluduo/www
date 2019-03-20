// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import {
  Lazyload,
  Loadmore,
  Button,
  Checklist,
  InfiniteScroll,
  Toast,
  SwipeItem,
  Swipe,
} from 'mint-ui'
import 'mint-ui/lib/style.css'

import {
  Form as eleFrom,
  FormItem as eleFormItem,
  Input as eleInput,
  CheckboxGroup as eleCheckboxGroup,
  Upload as eleUpload,
  Checkbox as eleCheckbox,
} from 'element-ui';


import App from './App'
import router from './router'
import '../src/lib/rem';//ren布局的方法;
import FastClick from 'fastclick';//点头事件;
import '../src/common/validate.js'//表单验证;
import '../static/css/common.scss';//公共的样式;
import {
  LocalStorage
} from '../src/lib/GeneralTools.js'//常见的方法;

import dateTime from './lib/dateTime.js';
import bus from './lib/eventbus.js';

Vue.config.productionTip = false
//通过环境配置相应的接口请求地址
var baseURL = process.env.API_ROOT
Vue.prototype.$baseURL = baseURL;

//---------mint-ui-----------
//注册插件
Vue.use(Lazyload)
Vue.use(InfiniteScroll)

// 注册组件
Vue.component(Checklist.name, Checklist)
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
Vue.component(Button.name, Button)
Vue.component(Loadmore.name, Loadmore)

//element-ui
Vue.use(eleFrom)
Vue.use(eleInput)
Vue.use(eleFormItem)
Vue.use(eleCheckboxGroup)
Vue.use(eleCheckbox)
Vue.use(eleUpload)

Vue.prototype.$Toast = Toast; //消息提醒；
Vue.prototype.$dateTime = dateTime; //获取时间差
Vue.prototype.$LocalStorage = LocalStorage;//获取本地数据;
Vue.prototype.$bus  = bus ;//公共的bus

/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

router.beforeEach((to, from, next) => {
  window.scrollTo(0, 0);
  next();
})

window.$vm = vm
