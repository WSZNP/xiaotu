<template>
  <div class="xtx-goods-page" v-if="goods">
    <div class="container">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{goods.categories[1].name}}</XtxBreadItem>
        <XtxBreadItem :to="`/category/sub/${goods.categories[0].id}`">{{goods.categories[0].name}}</XtxBreadItem>
        <transition name="fade-right" mode="out-in">
          <XtxBreadItem>{{goods.name}}</XtxBreadItem>
        </transition>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="goods-info">
        <div class="media">
          <goods-image :images="goods.mainPictures"></goods-image>
          <goods-sales></goods-sales>
        </div>
        <div class="spec">
          <goods-name :goods="goods"></goods-name>
          <!-- sku组件 -->
          <goods-sku :goods="goods" @change="changSku"></goods-sku>
          <!-- 数量选择组件 -->
          <xtx-numbox v-model="num" :max="goods.inventory" label="数量"></xtx-numbox>
          <!-- 按钮组件 -->
          <xtx-button @click="insertCart" type="primary" style="margin-top:20px">加入购物车</xtx-button>
        </div>
      </div>
      <!-- 商品推荐 -->
      <GoodsRelevant />
      <!-- 商品详情 -->
      <div class="goods-footer">
        <div class="goods-article">
          <!-- 商品+评价 -->
          <goods-tabs></goods-tabs>
          <!-- 注意事项 -->
          <goods-warn></goods-warn>
        </div>
        <!-- 24热榜+周榜 -->
        <div class="goods-aside">
          <goods-hot></goods-hot>
          <goods-hot :type="2"></goods-hot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import GoodsRelevant from './components/goods-relevant'
import GoodsImage from '@/views/goods/components/goods-image.vue'
import { findGoods } from '@/api/product'
import GoodsSales from './components/goods-sales.vue'
import GoodsName from './components/goods-name.vue'
import GoodsSku from './components/goods-sku.vue'
import GoodsTabs from './components/goods-tabs.vue'
import GoodsHot from './components/goods-hot.vue'
import GoodsWarn from './components/goods-warn.vue'
import { useStore } from 'vuex'
import Message from '@/components/library/Message'
export default {
  name: 'XtxGoodsPage',
  components: { GoodsRelevant, GoodsImage, GoodsSales, GoodsName, GoodsSku, GoodsTabs, GoodsHot, GoodsWarn },
  setup() {
    const goods = useGoods()
    const changSku = (sku) => {
      // 修改商品的现价原价还有库存信息
      if (sku.skuId) {
        goods.value.price = sku.price
        goods.value.oldPrice = sku.oldPrice
        goods.value.inventory = sku.inventory
      }
      // 记录选择后的sku，可能有数据，可能没有数据{}
      currSku.value = sku
    }

    // 提供goods数据给后代组件使用
    provide('goods', goods)

    // 选择的数量
    const num = ref(1)

    // 加入购物车
    // id，skuId，name，attrsText，picture，price，nowPrice，selected，stock，count，isEffective
    const store = useStore()
    const currSku = ref(null)
    const insertCart = () => {
      const { skuId, price, specsText: attrsText, inventory: stock } = currSku.value
      const { id, name, mainPictures } = goods.value
      if (currSku.value && currSku.value.skuId) {
        store.dispatch('cart/insertCart', {
          skuId,
          price,
          picture: mainPictures[0],
          attrsText,
          stock,
          id,
          name,
          nowPrice: price,
          selected: true,
          count: num.value,
          isEffective: true
        }).then(() => {
          Message({ type: 'success', text: '加入购物车成功!' })
        })
      } else {
        Message({ text: '请选择完整规格!' })
      }
    }
    return { goods, changSku, num, insertCart }
  }
}
// 获取商品详情
const useGoods = () => {
  // 出现路由地址的商品id发生变化，但是不会重新初始化组件
  const goods = ref(null)
  const route = useRoute()
  watch(() => route.params.id, (newVal) => {
    if (newVal && route.path === `/product/${newVal}`) {
      findGoods({ id: route.params.id }).then(data => {
        // 让商品数据为空后使用v-if的组件可以销毁和创建
        goods.value = null
        nextTick(() => {
          goods.value = data.result
        })
      })
    }
  }, { immediate: true })

  return goods
}
</script>

<style scoped lang='less'>
.goods-info {
  min-height: 600px;
  background: #fff;
  display: flex;
  .media {
    width: 580px;
    height: 600px;
    padding: 30px 50px;
  }
  .spec {
    flex: 1;
    padding: 30px 30px 30px 0;
  }
}
.goods-footer {
  display: flex;
  margin-top: 20px;
  .goods-article {
    width: 940px;
    margin-right: 20px;
  }
  .goods-aside {
    width: 280px;
    min-height: 1000px;
  }
}
// .goods-tabs {
//   min-height: 600px;
//   background: #fff;
// }
// .goods-warn {
//   min-height: 600px;
//   background: #fff;
//   margin-top: 20px;
// }
</style>
