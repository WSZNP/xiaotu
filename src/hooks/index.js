// 提供复用逻辑的函数(钩子)
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref, onUnmounted } from 'vue'
import dayjs from 'dayjs'

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

/**
 * 支付倒计时函数
 */
export const usePayTime = () => {
  // 倒计时逻辑
  const time = ref(0)
  const timeText = ref('')
  const { pause, resume } = useIntervalFn(
    () => {
      time.value--
      timeText.value = dayjs.unix(time.value).format('mm分ss秒')
      if (time.value <= 0) {
        pause()
      }
    },
    1000,
    false
  )
  onUnmounted(() => {
    pause()
  })
  //  开启定时器 countdown 倒计时时间
  const start = countdown => {
    time.value = countdown
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    resume()
  }

  return { start, timeText }
}
