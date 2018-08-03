import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    routers: []
  },
  mutations: {
    ADD_ROUTER (state, router) { // 第一个参数为 state 用于变更状态
      if (state.routers === 0) {
        state.routers.push(router)
        return
      }
      let flag = true
      for (let i = 0; i < state.routers.length; i++) {
        if (state.routers[i].path === router.path) {
          flag = false
          break
        }
      }
      if (flag) state.routers.push(router)
    },
    RM_ROUTER (state, router) { // 第二个参数为提交的参数，参数类型视提交方式而定
      let routerArr = state.routers
      let i = 0
      for (i = 0; i < routerArr.length; i++) {
        if (routerArr[i].path === router.path) {
          break
        }
      }
      if (i !== 0) {
        state.routers.splice(i, 1)
      }
    }
  }
})

export default store
