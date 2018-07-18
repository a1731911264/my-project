import Vue from 'vue'
import Router from 'vue-router'
import Index from '../view/index.vue'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/main',
      component: resolve => require(['../view/index.vue'], resolve),
      children: [{path: 'main', name: 'main', meta: {'keepAlive': true}, component: resolve => require(['../view/main.vue'], resolve)}]
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['../view/login/login'], resolve)
    },
    {
      path: '/',
      name: 'balance',
      component: Index,
      children: [{path: '/balance/trade', name: 'trade', component: resolve => require(['../view/balance/trade.vue'], resolve)}]
    },
    {
      path: '/picture-search',
      name: 'picture-search',
      component: Index,
      redirect: 'noredirect',
      children: [{path: 'full-classification-list', name: 'full-classification-list', component: resolve => require(['../view/search/fullscaleclassification/list.vue'], resolve)},
        {path: 'similar-classification-list', name: 'similar-classification-list', component: resolve => require(['../view/search/similarclassification/list.vue'], resolve)},
        {path: 'picture-search-list', name: 'picture-search-list', component: resolve => require(['../view/search/picresult/list.vue'], resolve)},
        {path: 'feedback-list', name: 'feedback-list', component: resolve => require(['../view/search/feedback/list.vue'], resolve)}
      ]
    },
    {
      path: '/map',
      name: 'map',
      component: Index,
      redirect: 'noredirect',
      children: [
        {path: 'baidu-map', name: 'baidu-map', component: resolve => require(['../view/map/baiduMap.vue'], resolve)}
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  let user = window.sessionStorage.getItem('token')
  if (to.path.startsWith('/login')) {
    if (user !== 'null' && user != null) {
      next({path: '/main'})
    } else {
      next()
    }
  } else {
    if (user === 'null' || user == null) {
      next({path: '/login'})
    } else {
      next()
    }
  }
})

export default router
