// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './app.vue'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import axios from 'axios'
import store from './strore/store.js'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(iView)
axios.defaults.baseURL = 'http://127.0.0.1:9090'
Vue.prototype.$ajax = axios
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router: router,
  components: { App },
  render: h => h(App)
})
