/**
 * Created by huangjs on 2018/3/22.
 */
import Vue from 'vue';

let registerConstructor = Vue.extend(require('../components/registerPopup.vue'));

let instance;
let Register = function (options, cb) {
  if (document.querySelector('#register-popup')) return;
  instance = new registerConstructor();
  instance.callbackfun = cb;
  instance.$mount();

  document.getElementById('app').appendChild(instance.$el);
  return instance;
}

export default Register;
