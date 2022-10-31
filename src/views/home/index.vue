<template>
  <!-- 首页入口(分类+广告) -->
  <div class="home-entry">
    <div class="container">
      <!-- 左侧分类 -->
      <home-category></home-category>
      <!-- 轮播图 -->
      <home-banner></home-banner>
    </div>
  </div>
  <!-- 新鲜好物 -->
  <home-new></home-new>
  <!-- 人气推荐 -->
  <home-hot></home-hot>
</template>

<script>
import HomeBanner from './components/home-banner.vue'
import HomeCategory from './components/home-category.vue'
import HomeHot from './components/home-hot.vue'
import HomeNew from './components/home-new.vue'
export default {
  components: {
    HomeCategory,
    HomeBanner,
    HomeNew,
    HomeHot
  },
  name: 'HomePage'

}
</script>

<style lang='less'>
</style>
