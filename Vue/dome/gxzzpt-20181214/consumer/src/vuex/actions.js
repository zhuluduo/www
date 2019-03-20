import * as types from './mutation-types.js'
// import default from 'vue';
const qs = require('qs');
const makeAction = (type) => {
  return ({commit}, ...args) => commit(type, ...args)
}
export const setDic = makeAction(types.SET_DIC);

export const setUser = makeAction(types.SET_USER);

export const setBuyCount = makeAction(types.SET_CARCOUNT);

export const setMessageCount = makeAction(types.SET_MESSAGECOUNT);
