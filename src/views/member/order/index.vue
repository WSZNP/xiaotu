<template>
  <div class="member-order">
    <!-- tab组件 -->
    <xtx-tabs v-model="activeName" @tab-click="tabClick">
      <xtx-tabs-panel v-for="item in orderStatus" :key="item.name" :label="item.label" :name="item.name" />
    </xtx-tabs>
    <!-- 订单列表 -->
    <div class="order-list">
      <div v-if="loading" class="loading"></div>
      <div class="none" v-if="!loading && orderList.length === 0">暂无数据</div>
      <order-item @on-logistics="handlerLogistics" @on-confirm="handlerConfirm" @on-delete="handlerDelete"
        @on-cancel="handlerCancel" v-for="item in orderList" :key="item.id" :order="item"></order-item>
    </div>
    <!-- 分页组件 -->
    <xtx-pagination v-if="total>0" :currentPage="reqParams.page" :pageSize="reqParams.pageSize" :total="total"
      @current-change="reqParams.page=$event"></xtx-pagination>
    <!-- 取消原因 -->
    <order-cancel ref="orderCancelCom"></order-cancel>
    <!-- 查询物流 -->
    <order-logistics ref="orderLogisticsCom"></order-logistics>
  </div>
</template>
<script>
import { reactive, ref, watch } from 'vue'
import { orderStatus } from '@/api/constants'
import xtxPagination from '@/components/library/xtx-pagination.vue'
import OrderItem from './components/order-item.vue'
import { confirmOrder, deleteOrder, findOrderList } from '@/api/order'
import OrderCancel from './components/order-cancel.vue'
import Confirm from '@/components/library/Confirm'
import Message from '@/components/library/Message'
import OrderLogistics from './components/order-logistics.vue'
export default {
  components: { xtxPagination, OrderItem, OrderCancel, OrderLogistics },
  name: 'MemberOrder',
  setup() {
    const activeName = ref('all')
    // 获取数据
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      orderState: 0
    })
    const orderList = ref([])
    const loading = ref(false)
    const total = ref(0)

    const getOrderList = () => {
      loading.value = true
      findOrderList(reqParams).then(data => {
        orderList.value = data.result.items
        total.value = data.result.counts
        loading.value = false
      })
    }

    // 筛选条件发生变化，重新加载
    watch(reqParams, () => {
      getOrderList()
    }, { immediate: true })

    // 点击选项卡
    const tabClick = ({ index }) => {
      reqParams.page = 1
      reqParams.orderState = index
    }

    // 删除订单
    const handlerDelete = (order) => {
      Confirm({ text: '确定删除该订单吗?' }).then(() => {
        deleteOrder(order.id).then(() => {
          Message({ text: '删除成功', type: 'success' })
          getOrderList()
        })
      }).catch(() => { })
    }
    return {
      activeName,
      orderStatus,
      orderList,
      tabClick,
      loading,
      total,
      reqParams,
      ...useCancel(),
      handlerDelete,
      ...useConfirm(),
      ...useLogistics()
    }
  }
}
// 取消订单逻辑
const useCancel = () => {
  // 组件实例
  const orderCancelCom = ref(null)
  // 点击取消打开对话框
  const handlerCancel = (order) => {
    orderCancelCom.value.open(order)
  }
  return { handlerCancel, orderCancelCom }
}

// 确认收货逻辑
const useConfirm = () => {
  const handlerConfirm = (order) => {
    Confirm({ text: '确认收货吗，收货后货款将直接进入卖家账户' }).then(() => {
      confirmOrder(order.id).then(() => {
        Message({ text: '确认收货成功', type: 'success' })
        // 订单状态=>待收货=>待评价
        order.orderState = 4
      })
    }).catch(() => { })
  }
  return { handlerConfirm }
}
// 查看物流逻辑
const useLogistics = () => {
  const orderLogisticsCom = ref(null)
  const handlerLogistics = (order) => {
    orderLogisticsCom.value.open(order)
  }
  return { handlerLogistics, orderLogisticsCom }
}
</script>
<style lang="less" scoped>
.member-order {
  height: 100%;
  background-color: #fff;
}
.order-list {
  background: #fff;
  padding: 20px;
}
.order-list {
  padding: 20px;
  position: relative;
  min-height: 400px;
}
.loading {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9) url(../../../assets/images/loading.gif) no-repeat center;
}
.none {
  height: 400px;
  text-align: center;
  line-height: 400px;
  color: #999;
}
</style>
