import * as types from './mutation-types';
import vue from 'vue';
export default {
  [types.SET_DIC](state,payload){
    state.user = payload;
  },
  [types.SET_USER](state, payload) {
    state.user = payload;
  },
  [types.SET_CARCOUNT](state, payload) {
    state.buytoTalcount = payload;
  },
  [types.SET_MESSAGECOUNT](state, payload) {
    state.messageCount = payload;
  }
}
