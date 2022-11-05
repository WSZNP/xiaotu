// 分类模块
import { topCategory } from '@/api/constants'
import { findAllCategory } from '@/api/category'
export default {
  namespaced: true,
  state() {
    return {
      // 分类信息集合,依赖topCategory重新设置，保证项目初始化就有数据，不至于白屏
      list: topCategory.map(item => ({ name: item })) // list:[{name:"美食"}，{name:'母婴'}...]
    }
  },
  // 修改分类的函数
  mutations: {
    setList(state, payload) {
      state.list = payload
    },
    // 定义show和hide函数，控制当前分类的二级分类显示和隐藏
    show(state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = true
    },
    hide(state, id) {
      const currCategory = state.list.find(item => item.id === id)
      currCategory.open = false
    }
  },
  // 获取分类
  actions: {
    async getList(context) {
      // 获取分类数据
      const data = await findAllCategory()
      // 给每个分类加上控制二级分类显示隐藏的数据
      // console.log(data)

      data.result.forEach(top => {
        top.open = false
      })
      // 修改分类数据
      context.commit('setList', data.result)
    }
  }
}
