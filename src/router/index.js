import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'

const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const TopCategory = () => import('@/views/category/index')
const SubCategory = () => import('@/views/category/sub')
const Goods = () => import('@/views/goods')
const Cart = () => import('@/views/cart')

const Login = () => import('@/views/login')
const LoginCallback = () => import('@/views/login/callback')

const Checkout = () => import('@/views/member/pay/checkout.vue')
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
      },
      {
        path: 'cart',
        component: Cart
      },
      {
        path: 'member/checkout',
        component: Checkout
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

// 前置导航守卫
router.beforeEach((to, from, next) => {
  // 需要登陆的路由：地址是以 /member 开头
  // 因为已经实例化了一个store,所以在路由配置js文件中直接import导入store/index.js文件就行
  const { profile } = store.state.user
  if (!profile.token && to.path.startsWith('/member')) {
    return next('/login?redirectUrl=' + encodeURIComponent(to.fullPath))
  }
  next()
})

export default router
