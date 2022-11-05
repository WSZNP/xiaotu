<template>
  <!-- 筛选区 -->
  <div class="sub-filter" v-if="filterData && !filterLoading">
    <div class="item">
      <div class="head">品牌：</div>
      <div class="body">
        <a
          @click="changeBrand(item.id)"
          :class="{active:item.id===filterData.brands.selectedBrand}"
          href="javascript:;"
          v-for="item in filterData.brands"
          :key="item.id"
        >{{item.name}}</a>
      </div>
    </div>
    <div class="item" v-for="item in filterData.saleProperties" :key="item.id">
      <div class="head">{{item.name}}:</div>
      <div class="body">
        <a
          @click="changeSub(item,sub.id)"
          :class="{active:sub.id===item.selectedAttr}"
          href="javascript:;"
          v-for="sub in item.properties"
          :key="sub.id"
        >{{sub.name}}</a>
      </div>
    </div>
  </div>
  <div v-else class="sub-filter">
    <XtxSkeleton class="item" width="800px" height="40px" animated />
    <XtxSkeleton class="item" width="800px" height="40px" animated />
    <XtxSkeleton class="item" width="600px" height="40px" animated />
    <XtxSkeleton class="item" width="600px" height="40px" animated />
    <XtxSkeleton class="item" width="600px" height="40px" animated />
  </div>
</template>
<script>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { findSubCategoryFilter } from '@/api/category'
export default {
  name: 'SubFilter',
  setup(props, context) {
    // 监听二级类目id的变化，获取筛选数据
    const filterData = ref(null)
    const route = useRoute()
    const filterLoading = ref(false)
    watch(() => route.params.id, (newValue) => {
      // 变化后的id有值且处于二级类目
      if (newValue && route.path === `/category/sub/${newValue}`) {
        filterLoading.value = true
        // 发请求获取
        findSubCategoryFilter({ id: route.params.id }).then(data => {
          // 每一组可筛选的条件缺失全部条件，处理下数据加上全部条件
          // 给每一组数据加上一个选中的id
          // 1.品牌
          data.result.brands.selectedBrand = null
          data.result.brands.unshift({ id: null, name: '全部' })
          // 2.属性
          data.result.saleProperties.forEach(item => {
            item.properties.unshift({ id: null, name: '全部' })
            item.selectedAttr = null
          })
          // 设置修改的数据
          filterData.value = data.result
          filterLoading.value = false
        })
      }
    }, { immediate: true })
    // 获取筛选参数的函数
    // const getFilterParams = () => {
    //   // 参考数据:{brandId:'',attrs:[{groupName:'',propertyName:''},...]}
    //   const obj = { brandId: null, attrs: [] }
    //   // 品牌
    //   obj.brandId = filterData.value.brands.selectedBrand
    //   // 销售属性
    //   filterData.value.saleProperties.forEach(item => {
    //     if (item.selectedAttr) {
    //       const prop = item.properties.find(prop => prop.id === item.selectedAttr)
    //       obj.attrs.push({ groupName: item.name, propertyName: prop.name })
    //     }
    //   })
    //   return obj
    // }
    // const getFilterParams = () => {
    //   // 参数格式 obj={brandId:'',attrs:[{groupName:'',propertyName:''},...]}
    //   const obj = { brandId: null, attrs: [] }
    //   obj.brandId = filterData.value.brands.selectedBrand
    //   filterData.value.saleProperties.forEach(item => {
    //     if (item.selectedAttr) {
    //       const prop = item.properties.find(prop => prop.id === item.selectedAttr)
    //       obj.attrs.push({ groupName: item.name, propertyName: prop.name })
    //     }
    //   })
    //   return obj
    // }
    const getFilterParams = () => {
      // 结构 obj={brandId:'',attrs:[{groupName:'',propertyName:''},...]}
      const obj = { brandId: null, attrs: [] }
      obj.brandId = filterData.value.brands.selectedBrand
      filterData.value.saleProperties.forEach(item => {
        if (item.selectedAttr) {
          const prop = item.properties.find(prop => prop.id === item.selectedAttr)
          obj.attrs.push({ groupName: item.name, propertyName: prop.name })
        }
      })
      if (obj.attrs.length === 0) obj.attrs = null
      return obj
    }

    // 记录当前选择的品牌
    // const changeBrand = (brandId) => {
    //   if (filterData.value.brands.selectedBrand === brandId) return
    //   filterData.value.brands.selectedBrand = brandId
    //   context.emit('filter-change', getFilterParams)
    // }
    // const changeBrand = (brandId) => {
    //   if (filterData.value.brands.selectedBrand === brandId) return
    //   filterData.value.brands.selectedBrand = brandId
    //   context.emit('filter-change', getFilterParams)
    // }
    const changeBrand = (brandId) => {
      if (filterData.value.brands.selectedBrand === brandId) return
      filterData.value.brands.selectedBrand = brandId
      context.emit('filter-change', getFilterParams())
    }
    // 记录当前选择的销售属性
    // const changeSub = (item, subId) => {
    //   if (item.selectedAttr === subId) return
    //   item.selectedAttr = subId
    //   context.emit('filter-change', getFilterParams)
    // }
    // const changeSub = (item, subId) => {
    //   if (item.selectedAttr === subId) return
    //   item.selectedAttr = subId
    //   context.emit('filter-change', getFilterParams)
    // }
    const changeSub = (item, subId) => {
      if (item.selectedAttr === subId) return
      item.selectedAttr = subId
      context.emit('filter-change', getFilterParams())
    }

    return { filterData, filterLoading, changeSub, changeBrand }
  }
}
</script>
<style scoped lang='less'>
.xtx-skeleton {
  padding: 10px 0;
}
// 筛选区
.sub-filter {
  background: #fff;
  padding: 25px;
  .item {
    display: flex;
    line-height: 40px;
    .head {
      width: 80px;
      color: #999;
    }
    .body {
      flex: 1;
      a {
        margin-right: 36px;
        transition: all 0.3s;
        display: inline-block;
        &.active,
        &:hover {
          color: @xtxColor;
        }
      }
    }
  }
}
</style>
