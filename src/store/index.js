import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  actions,
  mutations
  // getters 类似于computed属性，在后面做题目数据的部分提取时可以使用，使用方法同上
})
