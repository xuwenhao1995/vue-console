import Vue from 'vue'
import 'babel-polyfill'//解决ES6不能兼容低版本浏览器问题
//http
import MyhttpServer from './plugins/http.js'
import VueJsonp from 'vue-jsonp'
import jsonp from './plugins/jsonp.js'
import VueCookies from 'vue-cookies'
import Moment from 'moment'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import { Message } from 'element-ui'
//全局css
import './assets/css/reset.css'
//图标
import './assets/css/icon/iconfont.css'

//路由
import router from './router'
//vuex
import store from './store'
//util
import Util from './api/utils/util.js'

import App from './App.vue'

Vue.config.productionTip = false
//全局过滤,处理日期
Vue.filter('fmtdate', (v) => {
  return Moment(v).format('YYYY-MM-DD HH:mm:ss')
})

Vue.use(ElementUI)
Vue.use(MyhttpServer)
Vue.use(VueJsonp)
Vue.use(VueCookies)
Vue.use(jsonp)
Vue.prototype.util = Util

//路由导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    if (!store.getters.getUserName) {
      Message.warning('你未登陆！');
      router.push({ name: 'login' })
      return
    }
    next()
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
