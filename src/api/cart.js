import request from '@/utils/request'

/**
 * 获取新的商品信息
 * @param {String} skuId - 商品SKUID
 * @returns Promise
 */
export const getNewCartGoods = skuId => {
  return request({
    method: 'GET',
    url: `/goods/stock/${skuId}`
  })
}

/**
 * 获取商品对应的sku数据
 * @param {String} skuId - SKUID
 * @returns Promise
 */
export const getGoodsSku = skuId => {
  return request({
    method: 'GET',
    url: `/goods/sku/${skuId}`
  })
}

/**
 * 合并购物车
 *@param {Array<object>} cartList - 购物车信息列表
 @param {String} object.skuId - skuId
 @param {Boolean} object.selected - 选中状态
 @param {Integer} object.count - 数量
 */
export const mergeCart = data => {
  return request({
    method: 'POST',
    url: '/member/cart/merge',
    data
  })
}

/**
 * 获取购物车列表
 * @returns
 */
export const findCart = () => {
  return request({
    method: 'GET',
    url: '/member/cart'
  })
}

/**
 * 加入购物车
 * @param {String} skuId - skuId
 * @param {Integer} count - 加入购物车的数量
 * @returns
 */
export const insertCart = data => {
  return request({
    method: 'POST',
    url: '/member/cart',
    data
  })
}

/**
 *删除购物车商品，支持批量
 * @param {Array<string>} ids - skuId的集合
 */
export const deleteCart = ids => {
  return request({
    method: 'DELETE',
    url: '/member/cart',
    data: {
      ids
    }
  })
}

/**
 *修改购物车商品（状态，数量）
 * @param {String} skuId - skuId
 * @param {Integer} count - 加入购物车的数量
 * @param {Boolean} selected - 选中状态
 * @returns
 */
export const updateCart = ({ skuId, selected, count }) => {
  return request({
    method: 'PUT',
    url: `/member/cart/${skuId}`,
    data: {
      selected,
      count
    }
  })
}

/**
 * 全选和取消全选
 * @param {Boolean} selected - 是否选中
 *  @param {Array<string>} ids - 有效商品skuId集合
 */
export const checkAllCart = ({ selected, ids }) => {
  return request({
    method: 'PUT',
    url: '/member/cart/selected',
    data: {
      selected,
      ids
    }
  })
}
