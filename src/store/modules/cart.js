import { checkAllCart, deleteCart, findCart, getNewCartGoods, insertCart, mergeCart, updateCart } from '@/api/cart'

// 购物车模块
export default {
  namespaced: true,
  state() {
    return {
      // 购物车商品列表
      list: []
    }
  },
  mutations: {
    // 加入购物车
    insertCart(state, payload) {
      // 约定加入购物车字段必须和后端保持一致 payload对象 的字段
      // 它们是：id，skuId，name，attrsText，picture，price，nowPrice，selected，stock，count，isEffective
      // 插入数据规则：
      // 1.先找下是否有相同商品
      // 2.如果有相同的商品，查询它的数量，累加到payload上再保存,原来信息需要删除
      // 3.如果没有相同商品，保存在最新位置
      const currIndex = state.list.findIndex(goods => goods.skuId === payload.skuId)
      if (currIndex > -1) {
        const count = state.list[currIndex].count
        payload.count += count
        state.list.splice(currIndex, 1)
      }
      state.list.unshift(payload)
    },
    // 修改购物车商品
    updateCart(state, goods) {
      // goods 商品信息：nowPrice stock isEffective
      // goods商品对象的字段不固定,对象中有哪些字段就改哪些字段,字段的值合理才改
      // goods商品对象 必须有SKUID
      const updateGoods = state.list.find(item => item.skuId === goods.skuId)
      for (let key in goods) {
        if (goods[key] !== undefined && goods[key] !== null && goods[key] !== '') {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车商品
    deleteCart(state, skuId) {
      const index = state.list.findIndex(item => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    // 设置购物车
    setCart(state, payload) {
      // payload为空数组，清空，为有值的数组，设置
      state.list = payload
    }
  },
  actions: {
    // 加入购物车
    insertCart(context, payload) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          insertCart({ skuId: payload.skuId, count: payload.count })
            .then(() => {
              return findCart()
            })
            .then(data => {
              context.commit('setCart', data.result)
              resolve()
            })
        } else {
          // 未登录
          context.commit('insertCart', payload)
          resolve()
        }
      })
    },
    // 获取商品列表
    findCart(context, payload) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          findCart().then(data => {
            context.commit('setCart', data.result)
            resolve()
          })
        } else {
          // 未登录
          // 同时发送请求(有几件商品发几个请求)等所有请求成功，一并去修改本地数据
          // Promise.all(promise数组).then((dataList)=>{})  同时发送请求，所有请求成功，得到所有成功结果
          // Promise.resolve() Promise.reject() new Promise()
          // Promise.race(promise数组).then((data)=>{}) 同时发送请求，最快的请求成功，得到成功结果
          // 以上几个都是创建一个Promise
          const promiseArr = context.state.list.map(goods => {
            return getNewCartGoods(goods.skuId)
          })
          // dataList成功结果的集合，数据顺序和promiseArr顺序一致，它又是根据state.list而来
          Promise.all(promiseArr).then(dataList => {
            // 更新本地购物车
            dataList.forEach((data, i) => {
              context.commit('updateCart', { skuId: context.state.list[i].skuId, ...data.result })
            })
            // 调用resolve
            resolve()
          })
        }
      })
    },
    // 删除购物车商品
    deleteCart(context, payload) {
      // 单条删除
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          deleteCart([payload])
            .then(() => {
              return findCart()
            })
            .then(data => {
              context.commit('setCart', data.result)
              resolve()
            })
        } else {
          // 未登录
          context.commit('deleteCart', payload)
          resolve()
        }
      })
    },
    // 修改购物车(选中状态，数量)
    updateCart(context, payload) {
      // payload必须有skuid 可能有selected count
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          updateCart(payload)
            .then(() => {
              return findCart()
            })
            .then(data => {
              context.commit('setCart', data.result)
              resolve()
            })
        } else {
          // 未登录
          context.commit('updateCart', payload)
          resolve()
        }
      })
    },
    // 全选与取消全选
    checkAllCart(context, selected) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          const ids = context.getters.validList.map(item => item.skuId)
          checkAllCart({ selected, ids })
            .then(() => {
              return findCart()
            })
            .then(data => {
              context.commit('setCart', data.result)
              resolve()
            })
        } else {
          // 未登录
          context.getters.validList.forEach(goods => {
            context.commit('updateCart', { skuId: goods.skuId, selected })
          })
          resolve()
        }
      })
    },
    // 批量删除
    batchDeleteCart(context, isClear) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          const ids = context.getters[isClear ? 'inValidList' : 'selectedList'].map(item => item.skuId)
          deleteCart(ids)
            .then(() => {
              return findCart()
            })
            .then(data => {
              context.commit('setCart', data.result)
              resolve()
            })
        } else {
          // 未登录
          // 找出选中的商品列表，遍历去调用删除的mutations方法
          // isClear为true是删除失效商品，为false是删除选中商品
          context.getters[isClear ? 'inValidList' : 'selectedList'].forEach(goods => {
            context.commit('deleteCart', goods.skuId)
          })
          resolve()
        }
      })
    },
    // 修改规格
    updateCartSku(context, { oldSkuId, newSku }) {
      return new Promise((resolve, reject) => {
        if (context.rootState.user.profile.token) {
          // 已登录
          // 1.找出旧的商品信息
          // 2.删除旧的商品数据
          // 3.原先商品的数量加上新的skuId
          // 4.添加新的商品
          const oldGoods = context.state.list.find(item => item.skuId === oldSkuId)
          deleteCart([oldSkuId])
            .then(() => {
              return insertCart({ skuId: newSku.skuId, count: oldGoods.count })
            })
            .then(() => {
              return findCart()
            })
            .then(data => {
              context.commit('setCart', data.result)
              resolve()
            })
        } else {
          // 未登录
          // 1.找出旧的商品信息
          // 2.删除旧的商品数据
          // 3.根据新的Sku和旧的商品信息合并成一条新的购物车商品数据
          // 4.添加新的商品
          const oldGoods = context.state.list.find(item => item.skuId === oldSkuId)
          context.commit('deleteCart', oldSkuId)
          const { skuId, price: nowPrice, specsText: attrsText, inventory: stock } = newSku
          const newGoods = { ...oldGoods, skuId, nowPrice, attrsText, stock }
          context.commit('insertCart', newGoods)
          resolve()
        }
      })
    },
    // 合并购物车
    async mergeCart(context) {
      // 合并的参数
      const cartList = context.state.list.map(goods => {
        return {
          skuId: goods.skuId,
          selected: goods.selected,
          count: goods.count
        }
      })
      await mergeCart(cartList)
      // 合并成功,清空本地购物车
      context.commit('setCart', [])
    }
  },
  getters: {
    // 有效商品列表
    validList(state) {
      // 有效商品：库存大于0(stock)  商品有效标识为true(isEffective)
      return state.list.filter(goods => goods.stock > 0 && goods.isEffective)
    },
    // 有效商品总件数
    validTotal(state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    // 有效商品总金额
    validAmount(state, getters) {
      // return getters.validList.reduce((p, c) => p + c.count * c.nowPrice * 100, 0) / 100
      return getters.validList.reduce((p, c) => p + parseInt(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 无效商品列表
    inValidList(state) {
      return state.list.filter(goods => goods.stock <= 0 || !goods.isEffective)
    },
    // 已选商品列表
    selectedList(state, getters) {
      return getters.validList.filter(item => item.selected)
    },
    // 已选商品总件数
    selectedTotal(state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    // 已选商品总金额
    selectedAmount(state, getters) {
      return getters.selectedList.reduce((p, c) => p + Math.round(c.nowPrice * 100) * c.count, 0) / 100
    },
    // 是否全选
    isCheckAll(state, getters) {
      return getters.validList.length !== 0 && getters.selectedList.length === getters.validList.length
    }
  }
}
