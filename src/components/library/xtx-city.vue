<template>
  <div class="xtx-city" ref="target">
    <div class="select" @click="toggle" :class="{active:visible}">
      <span class="placeholder" v-if="!fullLocation">{{placeholder}}</span>
      <span class="value" v-else>{{fullLocation}}</span>
      <i class="iconfont icon-angle-down"></i>
    </div>
    <div class="option" v-if="visible">
      <div class="loading" v-if="loading"></div>
      <template v-else>
        <span class="ellipsis" @click="changeItem(item)" v-for="item in currList" :key="item.code">{{item.name}}</span>
      </template>
    </div>
  </div>
</template>
<script>
import { computed, reactive, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'
import axios from 'axios'
export default {
  name: 'XtxCity',
  props: {
    fullLocation: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择配送地址'
    }
  },
  setup(props, context) {
    // 显示隐藏数据
    const visible = ref(false)

    // 所有城市数据
    const allCityData = ref([])
    // 是否正在加载数据
    const loading = ref(false)
    // 提供打开和关闭的行为方法
    const open = () => {
      visible.value = true
      // 获取城市数据
      loading.value = true
      getCityData().then(data => {
        allCityData.value = data
        loading.value = false
      })
      // 清空之前选择
      for (const key in changeResult) {
        changeResult[key] = ''
      }
    }
    const close = () => {
      visible.value = false
    }
    // 提供切换函数给select使用
    const toggle = () => {
      visible.value ? close() : open()
    }
    // 点击组件外部元素，关闭对话框操作
    const target = ref(null)
    onClickOutside(target, () => {
      // 参数1：监听哪个元素
      // 参数2：点击了该元素外的其他地方要触发的函数
      close()
    })

    // 实现计算属性，获取当前显示的地区数组
    const currList = computed(() => {
      // 默认显示省级
      let list = allCityData.value
      // 市级
      if (changeResult.provinceCode && changeResult.provinceName) {
        list = list.find(p => p.code === changeResult.provinceCode).areaList
      }
      // 县地区
      if (changeResult.cityCode && changeResult.cityName) {
        list = list.find(c => c.code === changeResult.cityCode).areaList
      }
      return list
    })
    //  定义选择的省市区数据
    const changeResult = reactive({
      provinceCode: '',
      provinceName: '',
      cityCode: '',
      cityName: '',
      countyCode: '',
      countyName: '',
      fullLocation: ''
    })
    // 当点击按钮的时候记录
    const changeItem = (item) => {
      if (item.level === 0) {
        // 点击了省级
        changeResult.provinceCode = item.code
        changeResult.provinceName = item.name
      }
      if (item.level === 1) {
        // 市级
        changeResult.cityCode = item.code
        changeResult.cityName = item.name
      }
      if (item.level === 2) {
        // 县级
        changeResult.countyCode = item.code
        changeResult.countyName = item.name
        // 这是最后一级,选完了,关闭对话框，把数据给父组件
        changeResult.fullLocation = `${changeResult.provinceName} ${changeResult.cityName} ${changeResult.countyName}`
        close()
        context.emit('change', changeResult)
      }
    }
    return { visible, toggle, target, loading, currList, changeItem }
  }
}
// 获取城市数据
// 1. 数据在哪里？https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json
// 2. 何时获取？打开城市列表的时候，做个内存中缓存
// 3.当本地有缓存，取出本地缓存
// 返回promise在then中获取数据，这里可能是异步操作也可能是同步操作
// 4. 怎么使用数据？定义计算属性，根据点击的省份城市展示
const getCityData = () => {
  return new Promise((resolve, reject) => {
    // 约定，数据存储在windown上的cityData字段
    if (window.cityData) {
      resolve(window.cityData)
    } else {
      const url = 'https://yjy-oss-files.oss-cn-zhangjiakou.aliyuncs.com/tuxian/area.json'
      axios.get(url).then(res => {
        // 缓存
        window.cityData = res.data
        resolve(res.data)
      })
    }
  })
}

</script>

<style scoped lang="less">
.xtx-city {
  display: inline-block;
  position: relative;
  z-index: 400;
  .select {
    border: 1px solid #e4e4e4;
    height: 30px;
    padding: 0 5px;
    line-height: 28px;
    cursor: pointer;
    &.active {
      background: #fff;
    }
    .placeholder {
      color: #999;
    }
    .value {
      color: #666;
      font-size: 12px;
    }
    i {
      font-size: 12px;
      margin-left: 5px;
    }
  }
  .option {
    width: 542px;
    border: 1px solid #e4e4e4;
    position: absolute;
    left: 0;
    top: 29px;
    background: #fff;
    min-height: 30px;
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
    padding: 10px;
    .loading {
      height: 290px;
      width: 100%;
      background: url(../../assets/images/loading.gif) no-repeat center;
    }
    > span {
      width: 130px;
      text-align: center;
      cursor: pointer;
      border-radius: 4px;
      padding: 0 3px;
      &:hover {
        background: #f5f5f5;
      }
    }
  }
}
</style>
