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
