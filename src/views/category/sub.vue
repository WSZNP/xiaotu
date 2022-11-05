<template>
  <div class="sub-category">
    <div class="container">
      <!-- 面包屑 -->
      <sub-bread></sub-bread>
      <!-- 筛选区 -->
      <sub-filter @filter-change="filterChange"></sub-filter>
      <!-- 商品面板（排序+列表） -->
      <div class="goods-list">
        <sub-sort @sort-change="sortChange"></sub-sort>
        <!-- 列表 -->
        <ul>
          <li v-for="goods in goodsList" :key="goods.id">
            <goods-item :goods="goods"></goods-item>
          </li>
        </ul>
        <!-- 无限加载组件 -->
        <xtx-infinite-loading :loading="loading" :finished="finished" @infinite="getData"></xtx-infinite-loading>
      </div>
    </div>
  </div>
</template>

<script>
import SubBread from './components/sub-bread.vue'
import SubFilter from './components/sub-filter.vue'
import { ref, watch } from 'vue'
import SubSort from './components/sub-sort.vue'
import GoodsItem from './components/goods-item.vue'
import { findSubCategoryGoods } from '@/api/category'
import { useRoute } from 'vue-router'
export default {
  name: 'SubCategory',
  components: {
    SubBread,
    SubFilter,
    SubSort,
    GoodsItem
  },
  setup() {
    // 加载中
    const loading = ref(false)
    // 是否加载完毕
    const finished = ref(false)
    // 商品列表数据
    const goodsList = ref([])
    // 请求参数
    let reqParams = {
      page: 1,
      pageSize: 20
    }
    const route = useRoute()
    const getData = () => {
      loading.value = true
      // 设置二级分类的id
      reqParams.categoryId = route.params.id
      findSubCategoryGoods(reqParams).then(({ result }) => {
        // 获取数据成功
        if (result.items.length) {
          goodsList.value.push(...result.items)
          // 追加完把page改为下一页页码
          reqParams.page++
        } else {
          // 没有数据就代表加载完成
          finished.value = true
        }
        loading.value = false
      })
    }
    // 监听路由地址后id的变化，在更改了二级分类的时候重新获取数据并且清空原数组
    watch(() => route.params.id, (newValue) => {
      if (newValue && route.path === `/category/sub/${newValue}`) {
        finished.value = false
        goodsList.value = [] // 导致列表为空，加载更多组件进入可视区
        reqParams = {
          page: 1,
          pageSize: 20
        }
      }
    })
    // 1.更改排序组件的筛选属性，重新请求
    const sortChange = (sortParams) => {
      finished.value = false
      // 合并请求参数，保留之前的参数
      reqParams = { ...reqParams, ...sortParams }
      reqParams.page = 1
      goodsList.value = []
    }
    // 2.更改筛选组件的筛选数据，重新请求
    const filterChange = (obj) => {
      finished.value = false
      reqParams = { ...reqParams, ...obj }
      reqParams.page = 1
      goodsList.value = []
    }

    return { getData, loading, finished, goodsList, sortChange, filterChange }
  }
}
</script>

<style lang="less" scoped>
.goods-list {
  background: #fff;
  padding: 0 25px;
  margin-top: 25px;
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 5px;
    li {
      margin-right: 20px;
      margin-bottom: 20px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
