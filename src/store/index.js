import Vue from 'vue'
import Vuex from 'vuex'
// import { setUserInfo } from '@/api/user' 
import router from '@/router'

const routerList = []
const formatRouter = (routes) => {
  routes && routes.map(item => {
    if ((!item.children || item.children.every(ch => ch.hidden)) && item.name !== '404') {
      routerList.push({ label: item.meta.title, value: item.name })
    }
    if (item.children && item.children.length > 0) {
      formatRouter(item.children)
    }
  })
}
//挂载Vuex
Vue.use(Vuex)

//创建VueX对象
export const store = new Vuex.Store({
  state: {
    //存放的键值对就是所要管理的状态
    user: {
      uuid: '',
      nickName: '测试账号',
      headerImg: 'http://qmplusimg.henrongyi.top/gva_header.jpg',
      authority: '',
      ID: ''
    },
    token: '',
    routerList: routerList,
    defaultRouter: 'workState',
    asyncRouters: [{
      path: '/layout',
      name: 'layout',
      component: 'view/layout/index.vue',
      meta: {
        title: '底层layout'
      },
      children: [
        {
          "ID": 111,
          "CreatedAt": "2021-06-15T15:06:25+08:00",
          "UpdatedAt": "2021-06-15T15:06:25+08:00",
          "parentId": "0",
          "path": "/workState",
          "name": "workState",
          "hidden": false,
          "component": () => import("@/view/workState/index.vue"),
          "sort": 42,
          "meta": {
            "keepAlive": false,
            "defaultMenu": false,
            "title": "工作台",
            "icon": "cloudy",
            "closeTab": false
          },
          "authoritys": null,
          "menuId": "23",
          "children": null,
          "parameters": [
  
          ]
        },
        {
          "ID": 222,
          "parentId": "0",
          "path": "/licenseManagement",
          "name": "licenseManagement",
          "hidden": false,
          "sort": 2,
          "meta": {
            "keepAlive": false,
            "defaultMenu": false,
            "title": "许可管理",
            "icon": "cloudy",
            "closeTab": false
          },
          children: [
            {
              "ID": 3333,
              "parentId": 222,
              "path": "/orderManagement",
              "name": "orderManagement",
              "hidden": false,
              "component": () => import("@/view/licenseManagement/orderManagement/index.vue"),
              "sort": 1,
              "meta": {
                "keepAlive": false,
                "defaultMenu": false,
                "title": "订单管理",
                "icon": "cloudy",
                "closeTab": false
              },
            },
            {
              "ID": 4444,
              "parentId": 222,
              "path": "/licenseList",
              "name": "licenseList",
              "hidden": false,
              "component": () => import("@/view/licenseManagement/licenseList/index.vue"),
              "sort": 2,
              "meta": {
                "keepAlive": false,
                "defaultMenu": false,
                "title": "许可列表",
                "icon": "cloudy",
                "closeTab": false
              },
            },
            {
              "ID": 5555,
              "parentId": 222,
              "path": "/modelsManagement",
              "name": "modelsManagement",
              "hidden": false,
              "component": () => import("@/view/licenseManagement/modelsManagement/index.vue"),
              "sort": 3,
              "meta": {
                "keepAlive": false,
                "defaultMenu": false,
                "title": "设备管理",
                "icon": "cloudy",
                "closeTab": false
              },
            }
          ]
        },
        {
          "ID": 333,
          "parentId": "0",
          "path": "/versionManagement",
          "name": "versionManagement",
          "hidden": false,
          "component": () => import("@/view/versionManagement/index.vue"),
          "sort": 3,
          "meta": {
            "keepAlive": false,
            "defaultMenu": false,
            "title": "版本管理",
            "icon": "cloudy",
            "closeTab": false
          },
        }
      ]
    }]
  },
  getters: {
    userInfo (state) {
      return state.user
    },
    token (state) {
      return state.token
    },
    // 获取动态路由
    asyncRouters (state) {
      return state.asyncRouters
    },
    routerList (state) {
      return state.routerList
    },
    defaultRouter (state) {
      return state.defaultRouter
    }
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.user = userInfo
    },
    setToken (state, token) {
      state.token = token
    },
    userOut (state) {
      state.user = {}
      state.token = ''
      sessionStorage.clear()
      router.push({ name: 'Login', replace: true })
      window.location.reload()
    },
    setAsyncRouters (state, asyncRouters) {
      state.asyncRouters = asyncRouters
    },
    setRouterList (state, routerList) {
      state.routerList = routerList
    }
  },
  actions: {
    // async loginIn ({ commit, dispatch, getters }, loginFoem) {
    //   const res = await login(loginFoem)
    //   if (res.code === 0) {
    //     commit('setUserInfo', res.user)
    //     commit('setToken', res.token)
    //     await dispatch('SetAsyncRouter', {}, { root: true })
    //     const asyncRouters = getters.asyncRouters
    //     router.addRoutes(asyncRouters)
    //     router.push({ name: getters['userInfo'].authority.defaultRouter })
    //     return true
    //   }
    // },
    async SetAsyncRouter ({ commit }) {
      const baseRouter = [{
        path: '/layout',
        name: 'layout',
        component: 'view/layout/index.vue',
        meta: {
          title: '底层layout'
        },
        children: []
      }]
      const asyncRouterRes = await asyncMenu() // 获取当前登登录用户的菜单信息
      if (asyncRouterRes.code !== 0) {
        return
      }
      const asyncRouter = asyncRouterRes.data && asyncRouterRes.data.menus
      asyncRouter.push({
        path: '404',
        name: '404',
        hidden: true,
        meta: {
          title: '迷路了*。*'
        },
        component: 'view/error/index.vue'
      })
      formatRouter(asyncRouter) //遍历路由选项，供select使用
      baseRouter[0].children = asyncRouter  // 将后台返回的路由放入baseRouter的children中

      asyncRouterHandle(baseRouter) //将后台返回的路由模块转化为系统地址
      commit('setAsyncRouter', baseRouter)
      commit('setRouterList', routerList)
      return true
    }
  }
})

export default store