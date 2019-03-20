import Vue from 'vue';
import Vuex from 'vuex';
import state from './state';
import  mutations from './mutations';
import * as actions from './actions';
import * as getters from './getters';

Vue.use(Vuex);
export const store = new Vuex.Store({
  state,
  mutations, //同步的放在mutations里触发
  actions,  //异步的放在actions里触发
  strict: process.env.NODE_ENV !== 'production',
  getters
})
