<template>
  <div class="home-hot">
    <home-panel title="人气推荐" subTitle="人气爆款 不容错过" ref="target">
      <transition name="fade">
        <ul v-if="goods.length" ref="panel" class="goods-list">
          <li v-for="item in goods" :key="item.id">
            <RouterLink to="/">
              <img :src="item.picture" alt />
              <p class="name">{{item.title}}</p>
              <p class="desc">{{item.alt}}</p>
            </RouterLink>
          </li>
        </ul>
        <home-skeleton v-else></home-skeleton>
      </transition>
    </home-panel>
  </div>
</template>

<script>
// import { ref } from 'vue'
import homePanel from './home-panel.vue'
import { findHot } from '@/api/home'
import HomeSkeleton from './home-skeleton.vue'
import { useLazyData } from '@/hooks'
export default {
  components: { homePanel, HomeSkeleton },
  name: 'HomeHot',
  setup() {
    // const goods = ref([])
    // const target = ref(null)
    const { result, target } = useLazyData(findHot)
    return { goods: result, target }
  }
}
</script>

<style scoped lang='less'>
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 426px;
  li {
    width: 306px;
    height: 406px;
    .hoverShadow();
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding-top: 12px;
      text-align: center;
    }
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
