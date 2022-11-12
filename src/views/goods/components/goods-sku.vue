<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{item.name}}</dt>
      <dd>
        <template v-for="val in item.values" :key="val.name">
          <img
            :class="{selected:val.selected,disabled:val.disabled}"
            @click="changeSku(item,val)"
            v-if="val.picture"
            :src="val.picture"
            :title="val.name"
          />
          <span
            :class="{selected:val.selected,disabled:val.disabled}"
            v-else
            @click="changeSku(item,val)"
          >{{val.name}}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import powerSet from '@/vender/power-set'
const spliter = '🥵'
// 得到一个路径字典对象
const getPathMap = (skus) => {
  // 1.得到所有的sku集合props.goods.skus
  // 2.从所有的sku中筛选出有效sku
  // 3.根据有效sku，根据power-set算法得到子集
  // 4.根据子集往路径字典对象中储存key:value
  const pathMap = {}
  skus.forEach(sku => {
    if (sku.inventory > 0) {
      // 计算当前有库存的sku子集
      // 例如:[1,2,3]===>[[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]
      // 可选值数组
      const valueArr = sku.specs.map(val => val.valueName)
      // 可选值数组 子集
      const valueArrPowerSet = powerSet(valueArr)
      // 遍历子集，往pathMap中插入数据
      valueArrPowerSet.forEach(arr => {
        // 根据arr得到字符串的key,约定key是:['蓝色','美国']===>'蓝色🥵美国'
        const key = arr.join(spliter)
        // 给pathMap设置数据
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  return pathMap
}
// 此处是将当前选中的按钮的名字用数组记录下来，后边用来查询路径字典
const getSelectedValues = (specs) => {
  const arr = []
  specs.forEach(item => {
    // 当前选中的按钮
    const selectedVal = item.values.find(val => val.selected)
    arr.push(selectedVal ? selectedVal.name : undefined)
  })
  return arr
}
// 更新按钮禁用状态(此处比较难理解)
// 此处代码包含了刚开始没有选中的时候判断是否禁用按钮的代码，通过有效skus判断的
const updateDisabledStatus = (specs, pathMap) => {
  // 1.约定每一个按钮的状态由disabled来控制
  specs.forEach((item, i) => {
    const SelectedValues = getSelectedValues(specs)
    item.values.forEach(val => {
      // 2.判断当前是否选中，是选中不用判断
      if (val.selected) return
      // 3.拿当前的值，按照顺序套入选中的值数组
      SelectedValues[i] = val.name
      // 4.剔除undefined数据,按照分隔符拼接成key
      const key = SelectedValues.filter(value => value).join(spliter)
      // 5.拿着key去路径字典查找数据，有可以点击，没有就禁用
      val.disabled = !pathMap[key]
    })
  })
}
// 默认选中
const initDefaultSelected = (goods, skuId) => {
  // 1.找出sku的信息
  // 2.遍历每一个按钮,按钮的值和sku记录的值相同，就选中
  const sku = goods.skus.find(sku => sku.id === skuId)
  goods.specs.forEach((item, i) => {
    const val = item.values.find(val => val.name === sku.specs[i].valueName)
    val.selected = true
  })
}
export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => { }
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const pathMap = getPathMap(props.goods.skus)
    // 根据skuId初始化选中
    if (props.skuId) {
      initDefaultSelected(props.goods, props.skuId)
    }
    // 组件初始化，更新按钮状态
    updateDisabledStatus(props.goods.specs, pathMap)
    // 1.选中与取消选中,约定每一个按钮都拥有自己的选中状态数据:selected
    // 1.1 点击的是已选中，取消当前的选中
    // 1.2 点击的是未选中，把同一个规格的按钮重置为未选中状态，当前点击的改为选中
    // 此处就是排他思想，先干掉所有人，复活我自己
    const changeSku = (item, val) => {
      // 当按钮是禁用的，阻止程序进行
      if (val.disabled) return
      // 不是禁用程序正常进行
      if (val.selected) {
        val.selected = false
      } else {
        item.values.forEach(valItem => {
          valItem.selected = false
        })
        val.selected = true
      }
      // 点击按钮，更新按钮状态
      updateDisabledStatus(props.goods.specs, pathMap)
      // 将你选择的sku信息通知父组件{skuid,price,oldPrice,inventory,specsText}
      // 1.选择完整的sku组合按钮，才可以拿到这些信息，提交父组件
      // 2.不是完整的sku组合按钮，提交空对象给父组件
      const validSelectedValues = getSelectedValues(props.goods.specs).filter(v => v)
      if (validSelectedValues.length === props.goods.specs.length) {
        // 此处用skuIds[0]是因为路径字典存值的时候是按照key:[value1,value2]这种格式存储的，当所有条件选中时，只有一个skuid,所以用skuIds[0]
        const skuIds = pathMap[validSelectedValues.join(spliter)]
        const sku = props.goods.skus.find(sku => sku.id === skuIds[0])
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          // 属性名:属性值 属性名1:属性值1...这样的字符串
          specsText: sku.specs.reduce((p, c) => `${p} ${c.name}：${c.valueName}`, '').trim()
        })
      } else {
        // 父组件需要判断规格是否选择完整，不完整不能加购物车
        emit('change', {})
      }
    }
    return { changeSku }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
