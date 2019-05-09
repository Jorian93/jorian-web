import Vue from 'vue'
import Router from 'vue-router'
import ToolsManage from '@/views/tools/tools-manage/index'
import ToolsKinds from '@/views/tools/tools-kinds/index'

import ArticleManage from '@/views/article/article-manage/index'
import ArticleKinds from '@/views/article/article-kinds/index'
import ArticleAnalysis from '@/views/article/article-analysis/index'

import User from '@/views/system/user/index'
import Role from '@/views/system/role/index'
import Resource from '@/views/system/resource/index'
import License from '@/views/system/organization/index'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/* Router Modules */
/* import componentsRouter from './modules/components'
import chartsRouter from './modules/charts'
import tableRouter from './modules/table'
import nestedRouter from './modules/nested'*/

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'gis',
    children: [{
      path: 'gis',
      name: 'gis',
      component: () => import('@/views/gis/index'),
      meta: { title: '首页', icon: 'home' }
    }]
  },
  {
    path: '/account',
    hidden: true,
    redirect: 'index',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/account/index'),
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  }
]
/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    'path': '/tools',
    'component': Layout,
    'redirect': '/tools/view',
    'name': 'Tools',
    'meta': { 'title': '工具资源', 'icon': 'baseinfo', 'role': ['admin123', 'ADMIN', 'editor'] },
    'children': [
      {
        path: 'toolsManage',
        name: 'ToolsManage',
        component: () => import('@/views/tools/tools-manage/index'),
        meta: { title: '资源管理', icon: 'user', role: ['admin123', 'ADMIN', 'editor'] }
      },
      {
        path: 'toolsKinds',
        name: 'ToolsKinds',
        component: ToolsKinds,
        meta: { title: '资源分类', icon: 'user', role: ['admin123', 'ADMIN', 'editor'] }
      }
    ]
  },
  {
    path: '/article',
    component: Layout,
    redirect: '/article/manage',
    name: 'Article',
    meta: { title: '文章', icon: 'documentation', role: ['ARTICLE', 'ADMIN', 'editor'] },
    children: [
      {
        path: 'articleManage',
        name: 'ArticleManage',
        component: ArticleManage,
        meta: { title: '文章管理', icon: 'document-edit', role: ['ARTICLE', 'ADMIN', 'editor'] }
      },
      {
        path: 'kinds-manage',
        name: 'Kinds-manage',
        component: ArticleKinds,
        meta: { title: '文章分类', icon: 'document-kinds', role: ['ARTICLE', 'ADMIN', 'editor'] }
      },
      {
        path: 'analysis',
        name: 'Analysis',
        component: ArticleAnalysis,
        meta: { title: '文章统计', icon: 'document-analysis1', role: ['ARTICLE', 'ADMIN', 'editor'] }
      }
    ]
  },
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'icons', icon: 'icon', noCache: true, role: ['admin123', 'ADMIN'] }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'System',
    meta: { title: '系统管理', icon: 'system', role: ['admin123', 'ADMIN', 'editor'] },
    children: [
      {
        path: 'user',
        name: 'User',
        component: User,
        meta: { title: '用户管理', icon: 'user', role: ['admin123', 'ADMIN', 'editor'] }
      },
      {
        path: 'role',
        name: 'Role',
        component: Role,
        meta: { title: '角色管理', icon: 'role', role: ['admin123', 'ADMIN', 'editor'] }
      },
      {
        path: 'resource',
        name: 'Resource',
        component: Resource,
        meta: { title: '资源管理', icon: 'permission', role: ['admin123', 'ADMIN', 'editor'] }
      },
      {
        path: 'license',
        name: 'License',
        component: License,
        meta: { title: '授权管理', icon: 'license', role: ['ADMIN', 'admin123'] }
      }
    ]
  },
  {
    path: '/account',
    name: 'Account',
    redirect: '/user-info',
    component: Layout,
    children: [
      {
        path: '/userCenter',
        component: () => import('@/views/account/index'),
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/error-log',
    component: Layout,
    children: [
      {
        path: 'log',
        component: () => import('@/views/error-log/index'),
        name: 'ErrorLog',
        meta: { title: 'errorLog', icon: 'bug', role: ['ADMIN', 'admin123'] }
      }
    ]
  },
  {
    path: '/test',
    component: Layout,
    children: [
      {
        path: 'test',
        component: () => import('@/elementTest/index'),
        name: 'Test',
        meta: { title: 'test', icon: 'bug', role: ['ADMIN', 'admin123'] }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
