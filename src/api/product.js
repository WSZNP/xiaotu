// 提供商品相关API函数
import request from '@/utils/request'

/**
 *获取商品详情
 *@param {String} id - 商品id
 */
export const findGoods = id => {
  return request({
    method: 'GET',
    url: '/goods',
    params: id
  })
}
/**
 *获取相关推荐的商品|猜你喜欢的商品
 * @param {String} id - 商品,传入相关推荐，不传猜你喜欢
 * @param {Integer} limit - 商品数量
 */
export const findRelevantGoods = params => {
  return request({
    method: 'GET',
    url: '/goods/relevant',
    params
  })
}

/**
 *获取热销榜
 * @param {String} id - 商品,传入相关推荐，不传猜你喜欢
 * @param {Integer} limit - 商品数量
 * @param {Integer} type - 热销类型 1为24小时 2为周榜 3为总榜，默认为1
 */
export const findGoodsHot = params => {
  return request({
    method: 'GET',
    url: '/goods/hot',
    params
  })
}

/**
 *查询商品评价信息
 * @param {String} id - 商品ID
 * @returns
 */
export const findGoodsCommentInfo = id => {
  return request({
    method: 'GET',
    // axios遇见http https开头的地址，不会加上基准地址
    url: `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate`
  })
}

/**
 *查询商品评价列表
 * @param {String} id - 商品ID
 * @param {Object} params - 商品ID
 * @returns
 */
export const findGoodsCommentList = (id, params) => {
  return request({
    method: 'GET',
    // axios遇见http https开头的地址，不会加上基准地址
    url: `https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`,
    params
  })
  // return request(`https://mock.boxuegu.com/mock/1175/goods/${id}/evaluate/page`, 'get', params)
}
