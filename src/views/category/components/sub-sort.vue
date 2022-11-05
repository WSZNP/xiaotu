<template>
  <div class="sub-sort">
    <div class="sort">
      <a
        @click="changeSort(null)"
        href="javascript:;"
        :class="{active:sortParams.sortField===null}"
      >默认排序</a>
      <a
        @click="changeSort('publishTime')"
        href="javascript:;"
        :class="{active:sortParams.sortField==='publishTime'}"
      >最新商品</a>
      <a
        @click="changeSort('orderNum')"
        href="javascript:;"
        :class="{active:sortParams.sortField==='orderNum'}"
      >最高人气</a>
      <a
        @click="changeSort('evaluateNum')"
        href="javascript:;"
        :class="{active:sortParams.sortField==='evaluateNum'}"
      >评论最多</a>
      <a @click="changeSort('price')" href="javascript:;">
        价格排序
        <i
          class="arrow up"
          :class="{active:sortParams.sortField==='price'&&sortParams.sortMethod==='asc'}"
        />
        <i
          class="arrow down"
          :class="{active:sortParams.sortField==='price'&&sortParams.sortMethod==='desc'}"
        />
      </a>
    </div>
    <div class="check">
      <XtxCheckbox @change="changeCheck" v-model="sortParams.inventory">仅显示有货商品</XtxCheckbox>
      <XtxCheckbox @change="changeCheck" v-model="sortParams.onlyDiscount">仅显示特惠商品</XtxCheckbox>
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue'
export default {
  name: 'SubSort',
  setup(props, context) {
    // 实现交互(实现交互的数据和后台保持一致)
    // 1.明确交互数据
    const sortParams = reactive({
      inventory: false, // 是否有库存
      onlyDiscount: false, // 只显示特惠
      sortField: null, // 排序字段，取值范围：[publishTime,orderNum,price,evaluateNum]
      sortMethod: null// 排序规则，asc为正序，desc为倒序，默认为desc
    })
    // 2.提供模板使用
    // 3.绑定按钮的点击事件改变排序方式和排序字段
    const changeSort = (sortField) => {
      if (sortField === 'price') {
        sortParams.sortField = sortField
        // 处理排序 升序还是降序
        if (sortParams.sortMethod === null) {
          sortParams.sortMethod = 'desc'
        } else {
          sortParams.sortMethod = sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else {
        // 如果已经选中，就阻止逻辑继续往下运行
        if (sortParams.sortField === sortField) return
        sortParams.sortField = sortField
        sortParams.sortMethod = null
      }
      // 触发 sort-change事件
      context.emit('sort-change', sortParams)
    }
    const changeCheck = () => {
      context.emit('sort-change', sortParams)
    }
    return { sortParams, changeSort, changeCheck }
  }
}
</script>
<style scoped lang='less'>
.sub-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s;
      &.active {
        background: @xtxColor;
        border-color: @xtxColor;
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          &.active {
            border-bottom-color: @xtxColor;
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: @xtxColor;
          }
        }
      }
    }
  }
  .check {
    .xtx-checkbox {
      margin-left: 20px;
      color: #999;
    }
  }
}
</style>
