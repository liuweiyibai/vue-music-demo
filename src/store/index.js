// 初始化入口的store文件
import Vue from 'vue'
import Vuex from 'vuex'
// 所有的actions、getters都是使用*来引入，简化了import {} from
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
// 引入vuex的插件，在mutations修改state数据的时候会打印数据
import createLogger from 'vuex/dist/logger'

// 使用这个第三方插件
Vue.use(Vuex)

// vuex的调试工具，如果我们直接通过this.$state.state来进行更改数据会报错，要借助mutations来进行更改，
const debug = process.env.NODE_ENV !== 'production'

// 暴露出new vuex 实例
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  // 严格模式
  strict: debug,
  // 如果有debug，就执行这个createLogger
  plugins: debug ? [createLogger()] : []
})
