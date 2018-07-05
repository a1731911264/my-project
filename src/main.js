// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './app.vue'
import router from './router'
import iView from 'iview'
import 'iview/dist/styles/iview.css'

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(iView)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  components: { App },
  render: h => h(App)
})
