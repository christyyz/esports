import Vue from 'vue'
// import store from '@/store'
import Router from 'vue-router'

Vue.use(Router)

// 获取原型对象上的push函数
const originalPush = Router.prototype.push
// 修改原型对象中的push方法
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const baseRouters = [
  // 修改保证安全密码
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/view/login/index')
  },
  {
    path: '/layout',
    name: 'layout',
    component: () => import('@/view/layout/index.vue'),
    meta: {
      title: '底层layout'
    },
    children: [
      {
        "ID": 111,
        "parentId": "0",
        "path": "/workState",
        "name": "workState",
        "hidden": false,
        "component": () => import("@/view/workState/index.vue"),
        "sort": 1,
        "meta": {
          "keepAlive": false,
          "defaultMenu": false,
          "title": "工作台",
          "icon": "cloudy",
          "closeTab": false
        },
      },
      {
        "ID": 222,
        "parentId": "0",
        "path": "/licenseManagement",
        "name": "licenseManagement",
        "hidden": false,
        "component": () => import("@/view/licenseManagement/index.vue"),
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
          // {
          //   "ID": 4444,
          //   "parentId": 222,
          //   "path": "/licenseList",
          //   "name": "licenseList",
          //   "hidden": false,
          //   "component": () => import("@/view/licenseManagement/licenseList/index.vue"),
          //   "sort": 2,
          //   "meta": {
          //     "keepAlive": false,
          //     "defaultMenu": false,
          //     "title": "许可列表",
          //     "icon": "cloudy",
          //     "closeTab": false
          //   },
          // },
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
      },
    ]
  }
]

// 需要通过后台数据来生成的组件

const createRouter = () => new Router({
  routes: baseRouters
})

const router = createRouter()

router.beforeEach((to, from, next) => {
  // const userName = store.state.token;
  const userName = localStorage.getItem('userName')
  console.log(to,next,2312);
  console.log(userName,123);
  if (to.name !== 'Login' && !userName) next({ name: 'Login' })
  // 如果用户未能验证身份，则 `next` 会被调用两次
  next()
})
export default router
