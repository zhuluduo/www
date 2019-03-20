import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    // 定义状态
    state: {
        author: ''
    },
  // 把处理数据逻辑方法全部放在mutations里面，使得数据和视图分离/
    mutations:{
        newAuthor(state,msg){
          state.author=msg
        }
    }
})

export default store
