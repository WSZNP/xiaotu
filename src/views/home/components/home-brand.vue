<template>
  <div class="home-brand">
    <home-panel title="热门品牌" subTitle="国际经典 品牌保证" ref="target">
      <template #right>
        <a
          href="javascript:;"
          :class="{disabled:index===0}"
          class="iconfont icon-angle-left prev"
          @click="toggle(-1)"
        ></a>
        <a
          :class="{disabled:index===1}"
          href="javascript:;"
          class="iconfont icon-angle-right next"
          @click="toggle(1)"
        ></a>
      </template>
      <div class="box" ref="box">
        <transition name="fade">
          <ul class="list" v-if="brands.length" :style="{transform:`translateX(${-index*1240}px)`}">
            <li v-for="item in brands" :key="item.id">
              <RouterLink to="/">
                <img :src="item.picture" alt />
              </RouterLink>
            </li>
          </ul>
          <div v-else class="skeleton">
            <XtxSkeleton
              class="item"
              v-for="i in 5"
              :key="i"
              animated
              width="240px"
              height="305px"
              bg="#e4e4e4"
            />
          </div>
        </transition>
      </div>
    </home-panel>
  </div>
</template>

<script>
import { ref } from 'vue'
import homePanel from './home-panel.vue'
import { findBrand } from '@/api/home'
import { useLazyData } from '@/hooks'
export default {
  components: { homePanel },
  name: 'HomeBrand',
  setup() {
    // const brands = ref([])
    // findHotBrand({ limit: 10 }).then(data => {
    //   brands.value = data.result
    // })
    // 注意：useLazyData需要的是API函数，如果遇到要传参的情况，自己写函数在函数中调用API
    const { result, target } = useLazyData(() => findBrand({ limit: 10 }))
    // 切换效果 ，前提只有0，1两页
    const index = ref(0)
    const toggle = (step) => {
      const newValue = index.value + step
      if (newValue < 0 || newValue > 1) return
      index.value = newValue
    }
    return { brands: result, target, toggle, index }
  }
}
</script>

<style scoped lang='less'>
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: @xtxColor;
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
  .skeleton {
    width: 100%;
    display: flex;
    .item {
      margin-right: 10px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
