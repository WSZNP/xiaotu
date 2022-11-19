<template>
  <div class="member-home">
    <!-- 概览 -->
    <home-overview></home-overview>
    <!-- 收藏 -->
    <home-panel title="我的收藏">
      <goods-item v-for="item in collectGoods" :key="item.id" :goods="item"></goods-item>
    </home-panel>
    <!-- 足迹 -->
    <home-panel title="我的足迹">
      <goods-item v-for="item in collectGoods" :key="item.id" :goods="item"></goods-item>
    </home-panel>
    <!-- 猜你喜欢 -->
    <goods-relevant></goods-relevant>
  </div>
</template>
<script>
import homeOverview from './components/home-overview.vue'
import HomePanel from './components/home-panel.vue'
import GoodsRelevant from '@/views/goods/components/goods-relevant.vue'
import GoodsItem from '@/views/category/components/goods-item.vue'
import { findCollect } from '@/api/member'
import { ref } from 'vue'
export default {
  components: { homeOverview, HomePanel, GoodsRelevant, GoodsItem },
  name: 'MemberHome',
  setup() {
    // 调用模拟的接口
    const collectGoods = ref([])
    findCollect({ page: 1, pageSize: 4, collectType: 1 }).then(data => {
      collectGoods.value = data.result.items
      console.log(data)
    })
    return { collectGoods }
  }
}
</script>
<style scoped lang="less">
:deep(.xtx-carousel) .carousel-btn.prev {
  left: 5px;
}
:deep(.xtx-carousel) .carousel-btn.next {
  right: 5px;
}
</style>
