<template>
  <div class="member-order-detail" v-if="order">
    <!-- 头部 -->
    <detail-action :order="order"></detail-action>
    <!-- 进度 -->
    <detail-step :order="order"></detail-step>
    <!-- 物流 -->
    <suspense>
      <detail-logistics v-if="[3,4,5].includes(order.orderState)" :order="order"></detail-logistics>
    </suspense>
    <!-- 信息 -->
    <detail-info :order="order"></detail-info>
  </div>
</template>
<script>
import DetailAction from './components/detail-action.vue'
import { ref } from 'vue'
import { findOrder } from '@/api/order'
import { useRoute } from 'vue-router'
import DetailStep from './components/detail-step.vue'
import DetailLogistics from './components/detail-logistics.vue'
import DetailInfo from './components/detail-info.vue'
export default {
  name: 'MemberDetail',
  components: { DetailAction, DetailStep, DetailLogistics, DetailInfo },
  setup() {
    const order = ref(null)
    const route = useRoute()
    findOrder(route.params.id).then(data => {
      order.value = data.result
    })
    return { order }
  }
}

</script>
<style lang="less" scoped>
.member-order-detail {
  background-color: #fff;
  height: 100%;
}
</style>
