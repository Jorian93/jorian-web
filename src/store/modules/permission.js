import { constantRoutes } from '@/router'
import { getCurrentUserRouter } from '@/api/account/account'
import Layout from '@/layout'
import import_router from '@/router/import_router'

const routers=[
  {
    path: '/system',
    component: '@/layout',
    redirect: '/system/user',
    name: 'System',
    meta: {icon: 'system',title: '系统管理'},
    children: [
      {
        path: '/system/user',
        component: '/system/user/index',
        name: 'User',
        meta: {icon: 'user',title: '用户管理'},
        children: []
      }
    ]
  }
]

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

export function filterAsyncRouter(asyncRouterMap) { // 遍历后台传来的路由字符串，转换为组件对象
  const res = []
  asyncRouterMap.forEach(route => {
    if (route.component) {
      if (route.component === '@/layout') { // Layout组件特殊处理
        route.component = Layout
      } else {
        route.component = import_router(route.component)
      }
    }
    if(route.children.length===0){ //如果儿子只有一个，删除儿子的空children，不然显示会有箭头
      delete route.children
    }
    if (route.children) {
      route.children = filterAsyncRouter(route.children)
    }
    res.push(route)
  })
  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    // 此处从后端返回路由表
    return new Promise(resolve => {
      getCurrentUserRouter().then(response => {
        let data = response.data
        let accessedRoutes = []
        accessedRoutes = filterAsyncRouter(data)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(error => {
        Promise.reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
