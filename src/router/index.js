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
      children: [{path: 'main', name: 'main', meta: {'keepAlive': true, title: '首页'}, component: resolve => require(['../view/main.vue'], resolve)}]
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
      children: [{path: 'full-classification-list', meta: {title: '全量分类'}, name: 'full-classification-list', component: resolve => require(['../view/search/fullscaleclassification/list.vue'], resolve)},
        {path: 'similar-classification-list', meta: {title: '相似分类'}, name: 'similar-classification-list', component: resolve => require(['../view/search/similarclassification/list.vue'], resolve)},
        {path: 'picture-search-list', meta: {title: '搜图结果'}, name: 'picture-search-list', component: resolve => require(['../view/search/picresult/list.vue'], resolve)},
        {path: 'feedback-list', meta: {title: '反馈意见'}, name: 'feedback-list', component: resolve => require(['../view/search/feedback/list.vue'], resolve)}
      ]
    },
    {
      path: '/map',
      name: 'map',
      component: Index,
      redirect: 'noredirect',
      children: [
        {path: 'baidu-map', meta: {title: '百度地图'}, name: 'baidu-map', component: resolve => require(['../view/map/baiduMap.vue'], resolve)}
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
