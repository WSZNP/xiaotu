<template>
  <div class="detail-step">
    <xtx-steps :active="order.orderState===6 ? 1 : order.orderState">
      <XtxStepItem title="提交订单" :desc="order.createTime" />
      <XtxStepItem title="付款成功" :desc="order.payTime" />
      <XtxStepItem title="商品发货" :desc="order.consignTime" />
      <XtxStepItem title="确认收货" :desc="order.endTime" />
      <XtxStepItem title="订单完成" :desc="order.evaluationTime" />
    </xtx-steps>
  </div>
</template>
<script>
export default {
  name: 'DetailStep',
  props: {
    order: {
      type: Object,
      default: () => { }
    }
  },
  setup() {

  }
}

</script>
<style lang="less" scoped>
.detail-step {
  padding: 20px;
}
</style>
