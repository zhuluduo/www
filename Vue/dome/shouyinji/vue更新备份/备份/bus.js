/**
 * Created by jerry on 2017/4/14.
 */
import Vue from 'vue';
import axios from 'axios';
Vue.prototype.$axios = axios;

export var bus = new Vue({
  data:{
    host:process.env.API_ROOT,
    imgHost:process.env.IMG_ROOT,
    sysVersion:process.env.SYS_VERSION
  }
});
