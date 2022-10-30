<template>
  <!-- 顶部通栏 -->
  <app-navbar></app-navbar>
  <!-- 头部组件 -->
  <app-header></app-header>
  <!-- 吸顶头部组件 -->
  <app-header-sticky></app-header-sticky>
  <!-- 内容容器 -->
  <div class="app-body">
    <router-view></router-view>
  </div>
  <!-- 底部组件 -->
  <app-footer></app-footer>
</template>

<script>
import AppNavbar from '@/components/app-topnav.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
export default {
  name: 'Layout',
  components: {
    AppNavbar,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },
  // 获取分类数据
  setup() {
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style scoped lang="less">
.app-body {
  min-height: 600px;
}
</style>
