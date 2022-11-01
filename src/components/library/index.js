// 插件
// vue2 插件写法要素:导出一个对象，有install函数，默认传入了VUE构造函数，在VUE基础之上扩展
// vue3 插件写法要素:导出一个对象，有install函数，默认传入了app应用实例，在app基础之上扩展
import XtxSkeleton from './xtx-skeleton.vue'
import XtxCarousel from './xtx-carousel.vue'
import XtxMore from './xtx-more.vue'
export default {
  install(app) {
    // 在app上进行扩展,app提供component directive
    // 如果要挂载原型 app.config.globalProperties 方式
    app.component('XtxSkeleton', XtxSkeleton)
    app.component('XtxCarousel', XtxCarousel)
    app.component('XtxMore', XtxMore)
    // 自定义指令
    defineDirective(app)
  }
}

const defineDirective = app => {
  // 1. 图片懒加载指令
  // 原理：先存储图片地址不能在src上，当图片进入可视区，将src的地址换成所存储的地址
  app.directive('lazy', {
    // vue 2 监听使用指令的DOM是否创建好，钩子函数叫inserted
    // vue 3 的指令拥有的钩子函数和组件的一样,Mounted
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
