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
  }
}
