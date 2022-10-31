// 提供复用逻辑的函数(钩子)
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
/**
 *数据懒加载
 * @param {Element} target - Dom对象
 * @param {Function} apiFn - API函数
 *
 */
// export const useLazyData = (target, apiFn) => {
//   const result = ref(null)
//   // stop 停止观察
//   const { stop } = useIntersectionObserver(
//     // target监听的目标元素
//     target,
//     ([{ isIntersecting }], observerElement) => {
//       // isIntersecting是否进入可视区
//       if (isIntersecting) {
//         stop()
//         // 调用api函数,获取数据
//         apiFn().then(data => {
//           result.value = data.result
//         })
//       }
//     }
//   )
//   return result
// }
export const useLazyData = (target, apiFn) => {
  const result = ref([])
  // stop 停止观察
  const { stop } = useIntersectionObserver(
    // target为监听的DOM目标元素
    target,
    ([{ isIntersecting }], observerElement) => {
      // isIntersecting是否进入可视区
      if (isIntersecting) {
        stop()
        // 调用传入的API接口函数获取数据
        apiFn().then(data => {
          result.value = data.result
        })
      }
    }
  )
  return result
}
