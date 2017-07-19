import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from './store'

import 'common/stylus/index.styl'

/* eslint-disable no-unused-vars */
// import vConsole from 'vconsole'
/* 整个body下的所有元素的点击都没有300ms的延迟 */
fastclick.attach(document.body)

// 使用VueLazyload
Vue.use(VueLazyload, {
  // 当加载的时候，使用默认的图片代替
  loading: require('common/image/default.png')
})

/* eslint-disable no-new */
/* 实例化一个vue实例,传入路由的配置 */
new Vue({
  el: '#app',
  router,
  // 注入store
  store,
  render: h => h(App)
})
