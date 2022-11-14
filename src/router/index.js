import { createRouter, createWebHashHistory } from 'vue-router'

const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const TopCategory = () => import('@/views/category/index')
const SubCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods')

const Login = () => import('@/views/login')
const LoginCallback = () => import('@/views/login/callback')
// 路由规则
const routes = [
  // 一级路由布局容器
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        component: Home
      },
      {
        path: 'category/:id',
        component: TopCategory
      },
      {
        path: 'category/sub/:id',
        component: SubCategory
      },
      {
        path: 'product/:id',
        component: Goods
      }
    ]
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/login/callback',
    component: LoginCallback
  }
]

// vue 2.0 new VueRouter({}) 创建路由实例
// vue 3.0 createRouter({}) 创建路由实例
const router = createRouter({
  // 用hash的路由模式
  history: createWebHashHistory(),
  routes,
  // 切换路由的时候，滚动到页面顶端
  scrollBehavior() {
    return { top: 0, left: 0, behavior: 'smooth' }
  }
})

export default router
