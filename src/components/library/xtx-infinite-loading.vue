<template>
  <div class="xtx-infinite-loading" ref="target">
    <div class="loading" v-if="loading">
      <span class="img"></span>
      <span class="text">正在加载...</span>
    </div>
    <div class="none" v-if="finished">
      <span class="img"></span>
      <span class="text">亲，没有更多了</span>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'
export default {
  name: 'XtxInfiniteLoading',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    finished: {
      type: Boolean,
      default: false
    }
  },
  setup(props, context) {
    const target = ref(null)
    // 此处用的是vue use提供的方法
    useIntersectionObserver(target, ([{ isIntersecting }]) => {
      if (isIntersecting) {
        if (!props.loading && !props.finished) {
          context.emit('infinite')
        }
      }
    }, { threshold: 0 })

    // 此处是用原生api完成操作，一定要牢记target的DOM元素要target.value获取，因为是ref声明的
    // onMounted(() => {
    //   const obsever = new IntersectionObserver(([{ isIntersecting }]) => {
    //     if (isIntersecting) {
    //       obsever.unobserve(target.value)
    //       if (!props.loading && !props.finished) {
    //         context.emit('infinite')
    //       }
    //       console.log('进入可视区')
    //     }
    //   }, { threshold: 0 })
    //   obsever.observe(target.value)
    // })
    return { target }
  }
}

</script>
<style lang="less" scoped>
.xtx-infinite-loading {
  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 50px;
      height: 50px;
      background: url(../../assets/images/load.gif) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
  .none {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
    .img {
      width: 200px;
      height: 134px;
      background: url(../../assets/images/none.png) no-repeat center / contain;
    }
    .text {
      color: #999;
      font-size: 16px;
    }
  }
}
</style>
