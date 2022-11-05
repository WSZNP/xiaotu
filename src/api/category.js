// 定义分类相关的api接口
import request from '@/utils/request'

// 获取所有分类(顶级还有二级，还有其对应的商品推荐数据)
export const findAllCategory = () => {
  return request({
    method: 'GET',
    url: '/home/category/head'
  })
}

/**
 * 获取顶级类目信息(children属性，各个子分类)
 *@param {String} id - 顶级类目id
 *@returns
 */
export const findTopCategory = id => {
  return request({
    method: 'GET',
    url: '/category',
    params: id
  })
}

/**
 * 获取二级类目的筛选条件数据
 *@param {String} id - 二级类目id
 *@returns
 */
export const findSubCategoryFilter = id => {
  return request({
    method: 'GET',
    url: '/category/sub/filter',
    params: id
  })
}

/**
 * 获取分类下的商品(带筛选条件)
 *@param {Object} params - 参考接口文档
 */
export const findSubCategoryGoods = data => {
  return request({
    method: 'POST',
    url: '/category/goods/temporary',
    data
  })
}
