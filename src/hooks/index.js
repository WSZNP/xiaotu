// 提供复用逻辑的函数(钩子)
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
/**
 *数据懒加载
 * @param {Element} target - Dom对象
 * @param {Function} apiFn - API函数
 *
 */
export const useLazyData = apiFn => {
  const result = ref([])
  const target = ref(null) // 此处声明target，将target返回出去，在组件中绑定，组件中就传入DOM元素，不用每次在组件中声明target
  // stop 停止观察
  const { stop } = useIntersectionObserver(
    // target监听的目标元素
    target,
    ([{ isIntersecting }], observerElement) => {
      // isIntersecting是否进入可视区
      if (isIntersecting) {
        stop()
        // 调用api函数,获取数据
        apiFn().then(data => {
          result.value = data.result
        })
      }
    },
    // 配置选项,只要相交的比例大于0就触发
    {
      threshold: 0
    }
  )
  return { result, target }
}

// export const useLazyData = (target, apiFn) => {
//   const result = ref([])
//   // stop 停止观察
//   const { stop } = useIntersectionObserver(
//     // target为监听的DOM目标元素
//     target,
//     ([{ isIntersecting }], observerElement) => {
//       // isIntersecting是否进入可视区
//       if (isIntersecting) {
//         stop()
//         // 调用传入的API接口函数获取数据
//         apiFn().then(data => {
//           result.value = data.result
//         })
//       }
//     }
//   )
//   return result
// }
// export const useLazyData = (target, apiFn) => {
//   const result = ref([])
//   const { stop } = useIntersectionObserver(target, ([{ isIntersecting }], observerElement) => {
//     if (isIntersecting) {
//       stop()
//       apiFn().then(data => {
//         result.value = data.result
//       })
//     }
//   })
//   return result
// }
