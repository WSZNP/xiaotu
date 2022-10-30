<template>
  <div class="container">
    <!-- 首页入口(分类+广告) -->
    <div class="home-entry">
      <!-- 左侧分类 -->
      <home-category></home-category>
      <!-- 轮播图 -->
    </div>
  </div>
</template>

<script>
import HomeCategory from './components/home-category.vue'
export default {
  components: {
    HomeCategory
  },
  name: 'HomePage'
}
</script>

<style lang='less'>
</style>
