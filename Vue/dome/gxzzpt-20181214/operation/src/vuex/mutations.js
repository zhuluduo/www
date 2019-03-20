import * as types from './mutation-types';
import vue from 'vue';
export default {
  [types.SET_DIC](state,payload){
    state.dic = payload;
  }  
  
  
}
