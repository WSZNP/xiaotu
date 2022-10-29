<template>
  <!-- 顶部通栏 -->
  <app-navbar></app-navbar>
  <!-- 头部组件 -->
  <app-header></app-header>
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
export default {
  name: 'Layout',
  components: {
    AppNavbar,
    AppHeader,
    AppFooter
  }
}
</script>

<style scoped lang="less">
.app-body {
  min-height: 600px;
}
</style>
