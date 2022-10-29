// 1.初始化axios实例
// 2.请求拦截器，带token
// 3.响应拦截器：1.剥离无效数据 2.处理token失效
// 4.导出一个函数来调用当前的axios实例发请求,返回值promise
import axios from 'axios'
import store from '@/store'
import router from '@/router'
// 导出基准地址，原因：有些不是用axios发请求的地方用上基准地址
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net'
const instance = axios.create({
  // axios一些配置 baseURL timeout
  baseURL,
  timeout: 5000
})

instance.interceptors.request.use(
  config => {
    // 拦截业务逻辑
    // 进行请求配置修改
    // 如果本地由token就在头部携带token
    // 1.获取用户信息对象
    const { profile } = store.state.user
    // 2.判断是否有token
    if (profile.token) {
      // 3.设置token
      config.headers.Authorization = `Bearer ${profile.token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response.data // 取出data数据，将来调用接口的时候直接拿到的就是后台数据
  },
  err => {
    // 401状态码，进入该函数
    // 跳转到登录页
    if (err.response && err.response.status === 401) {
      // 1.清除无效的信息
      // 2.跳转到登录页面
      // 3.跳转需要传参(当前路由地址)给登录页
      store.commit('user/setUser', {})
      // 当前路由地址
      // 组件里：$route.path
      // js模块中:router.currentRoute.value.fullPath就是当前路由地址 是ref响应式数据
      const fullPath = encodeURIComponent(router.currentRoute.value.fullPath)
      // encodeURIComponent转换uri编码，防止解析地址出问题
      router.push('/login?redirectUrl=' + fullPath)
    }
    return Promise.reject(err)
  }
)

// 请求工具函数
// export default (url, method, submitData) => {
//   // 负责发请求 请求地址 请求方式以及提交的数据
//   return instance({
//     url,
//     method,
//     // 1.如果是get请求，需要使用params来传递submitData
//     // 2.如果不是get请求，需要使用data来传递submitData
//     // []设置一个动态的key，[]可以写js表达式，js表达式的执行结果当作KEY
//     // method参数：get,Get,GET 转化成大写
//     [method.toUpperCase() === 'GET' ? 'params' : 'data']: submitData
//   })
// }
// 上边方法会报错，原因不明
export default instance
