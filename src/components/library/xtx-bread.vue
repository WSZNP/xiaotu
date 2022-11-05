<script>
import { h } from 'vue'
export default {
  name: 'XtxBread',
  render() {
    // 需求
    // 1.创建xtx-bread父容器
    // 2.获取默认插槽内容
    // 3.去除xtx-bread-item组件中的i，应该由render函数来组织
    // 4.遍历插槽中的item,得到一个动态创建的节点，最后一个item不加i标签
    // 5.把动态创建的节点渲染在xtx-bread标签中
    const items = this.$slots.default()
    const dymanicItem = []
    items.forEach((item, i) => {
      dymanicItem.push(item)
      if (i < items.length - 1) {
        dymanicItem.push(h('i', { class: 'iconfont icon-angle-right' }))
      }
    })
    return h('div', { class: 'xtx-bread' }, dymanicItem)
  }
}
</script>

<style lang='less'>
// 去除scoped属性，目的是让样式作用到xtx-bread-item
.xtx-bread {
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all 0.4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
  }
}
</style>
