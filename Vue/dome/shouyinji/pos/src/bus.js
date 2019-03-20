/**
 * Created by jerry on 2017/4/14.
 */
import Vue from 'vue';
import axios from 'axios';
Vue.prototype.$axios = axios;
String.prototype.trim=function() {return this.replace(/(^\s*)|(\s*$)/g,'');}

export var bus = new Vue({
  data:{
    //host:process.env.API_ROOT,
    host:'//192.168.1.125:81',
    imgHost:process.env.IMG_ROOT,
    sysVersion:process.env.SYS_VERSION
  }
});
