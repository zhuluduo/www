/**
 * Created by huangjs on 2018/3/22.
 */
import Vue from 'vue';
let LoginConstructor = Vue.extend(require('../components/loginPopup.vue'));

let instance;
let Login = function (options, cb) {
  if (document.querySelector('#login-popup')) return;
  instance = new LoginConstructor();
//   instance.$parent = patent;
  instance.callbackfun = cb;
  instance.$mount();

  /*  if (options.type == 'login') {
    instance.loginFormVisible = true;
    instance.registerFormVisible = false;
  } else {
    instance.loginFormVisible = false;
    instance.registerFormVisible = true;
  }  */
  document.getElementById('app').appendChild(instance.$el);
  return instance;
}

export default Login;
