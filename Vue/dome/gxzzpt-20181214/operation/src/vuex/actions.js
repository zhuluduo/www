import * as types from './mutation-types.js'
// import default from 'vue';
const qs = require('qs');
const makeAction = (type) => {
  return ({commit}, ...args) => commit(type, ...args)
}
export const setDic = makeAction(types.SET_DIC);
