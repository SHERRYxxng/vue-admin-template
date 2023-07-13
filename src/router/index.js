import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
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
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '尚医通后台系统', icon: 'el-icon-shopping-cart-2' }
    }]
  },

  //一组路由（父+子路由）
  {
    path: '/hosp', //父路由的路径
    component: Layout,//右侧的布局组件
    redirect: '/hosp/hospsetlist',//该父路由路径对应的重定向的路径（自动重定向到第一个路由）
    name: 'hosp',//自定义的路由菜单名称（保持唯一即可）

    //父菜单的元信息（标题+图标）  显示
    meta: { title: '医院管理', icon: 'el-icon-office-building' },

    //子菜单
    children: [
      {
        path: 'hospsetlist',//子路由的路径（注意：一个子路由完整的path=父path+子path）
        name: 'hospsetlist',
        // @/views指的是 src/views/    list.vue 后缀不用写
        component: () => import('@/views/yygh/hospset/list'),//该路由对应的视图组件（右侧显示），是一个.vue文件
        meta: { title: '医院设置列表', icon: 'table' }//子路由的标题和图标
      },
      {
        path: 'add',
        name: 'add',
        component: () => import('@/views/yygh/hospset/form'),//表单，用于添加医院设置
        meta: { title: '开通医院设置', icon: 'el-icon-folder-add' }
      },
      //不需要显示，隐藏掉
      //为该路由的path，声明一个参数(:id  形式参数名)
      {
        path: 'edit/:id',
        name: 'edit',
        component: () => import('@/views/yygh/hospset/form'),//表单，用于回显医院设置
        meta: { title: '回显医院设置', icon: 'el-icon-folder-add' },
        hidden:true
      },
      {
        path: 'hosplist',
        name: 'hosplist',
        component: () => import('@/views/yygh/hospital/list'),//表单，用于回显医院设置
        meta: { title: '医院列表', icon: 'el-icon-ship' }
      },
      {
        path: 'hospdetail/:id',
        name: 'hospdetail',
        component: () => import('@/views/yygh/hospital/show'),
        meta: { title: '医院详情', icon: 'el-icon-ship' },
        hidden:true
      },
      {
        path: 'schedule/:hoscode',
        name: 'schedule',
        component: () => import('@/views/yygh/hospital/schedule'),
        meta: { title: '医院排班', icon: 'el-icon-ship' },
        hidden:true
      }
    ]
  },

  // 数据字典管理菜单路由
  {
    path: '/cmn',
    component: Layout,
    redirect: '/cmn/list',
    name: 'cmn',
    meta: { title: '数据字典管理', icon: 'el-icon-s-help' },
    alwaysShow: true,
    children: [
      // 子菜单
      {
        path: 'list',
        name: 'cmnlist',
        component: () => import('@/views/yygh/cmn/list'),
        meta: { title: '数据字典列表', icon: 'table' }
      }
    ]
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    name: 'user',
    meta: { title: '用户管理', icon: 'el-icon-s-help' },
    alwaysShow: true,
    children: [
      // 子菜单
      {
        path: 'list',
        name: 'userlist',
        component: () => import('@/views/yygh/user/list'),
        meta: { title: '用户列表', icon: 'table' }
      },
      {
        path: 'authlist',
        name: 'authlist',
        component: () => import('@/views/yygh/user/authlist'),
        meta: { title: '认证列表', icon: 'table' }
      },
      {
        path: 'show/:id',
        name: 'show',
        component: () => import('@/views/yygh/user/show'),
        meta: { title: '查看用户详情', icon: 'table' },
        hidden:true
      }
    ]
  },


  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: 'Example', icon: 'el-icon-s-help' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },


  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
