// 插件
// vue2 插件写法要素:导出一个对象，有install函数，默认传入了VUE构造函数，在VUE基础之上扩展
// vue3 插件写法要素:导出一个对象，有install函数，默认传入了app应用实例，在app基础之上扩展
// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// import XtxMore from './xtx-more.vue'
// import XtxBread from './xtx-bread.vue'
// import XtxBreadItem from './xtx-bread-item.vue'

// 使用 require 提供的函数 context 加载某一个目录下的所有 .vue 后缀的文件。
// 然后 context 函数会返回一个导入函数 importFn
// 它有一个属性 keys() 获取所有的文件路径
// 通过文件路径数组，通过遍历数组，再使用 importFn 根据路径导入组件对象
// 遍历的同时进行全局注册即可
// context(目录路径，是否加载子目录，加载文件的匹配正则)
// console.log(importFn.keys()) //组件路径形成的数组

import Message from './Message.js'
import Confirm from './Confirm.js'

const importFn = require.context('./', false, /\.vue$/)

export default {
  install(app) {
    // 在app上进行扩展,app提供component directive
    // 如果要挂载原型 app.config.globalProperties 方式
    // app.component('XtxSkeleton', XtxSkeleton)
    // app.component('XtxCarousel', XtxCarousel)
    // app.component('XtxMore', XtxMore)
    // app.component('XtxBread', XtxBread)
    // app.component('XtxBreadItem', XtxBreadItem)

    // 根据keys批量注册
    importFn.keys().forEach(path => {
      // 导入组件
      const component = importFn(path).default
      // 进行注册
      app.component(component.name, component)
    })

    // 自定义指令
    defineDirective(app)

    // 定义一个原型函数
    app.config.globalProperties.$message = Message
    app.config.globalProperties.$confirm = Confirm
  }
}

const defineDirective = app => {
  // 1. 图片懒加载指令
  // 原理：先存储图片地址不能在src上，当图片进入可视区，将src的地址换成所存储的地址
  app.directive('lazy', {
    //  vue 2 监听DOM是否创建好使用指令，钩子函数叫inserted
    //  vue 3 的指令的钩子函数和组件的一样,onMounted
    mounted(el, binding) {
      // 2.创建一个观察对象，观察当前使用指令的元素
      const observe = new IntersectionObserver(
        ([{ isIntersecting }]) => {
          if (isIntersecting) {
            // 停止观察
            observe.unobserve(el)
            // 3.把指令的值设置给el的src属性 binding.value就是指令上的值
            // 4.处理图片加载失败 error是图片加载失败的事件，load事件是图片加载成功
            el.addEventListener('error', function () {
              // 加载失败，设置默认图
              el.src = require('@/assets/images/200.png')
            })
            el.src = binding.value
          }
        },
        { threshold: 0 }
      )
      // 开启观察
      observe.observe(el)
    }
  })
}
