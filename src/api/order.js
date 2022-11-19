// 订单相关的API函数
import request from '@/utils/request'

// 结算页面生成订单
export const createOrder = () => {
  return request({
    method: 'GET',
    url: '/member/order/pre'
  })
}

// 添加收货地址
export const addAddress = data => {
  return request({
    method: 'POST',
    url: '/member/address',
    data
  })
}

// 修改收货地址
export const editAddress = data => {
  return request({
    method: 'PUT',
    url: `/member/address/${data.id}`,
    data
  })
}

// 结算页面-提交订单
export const submitOrder = data => {
  return request({
    method: 'POST',
    url: '/member/order',
    data
  })
}

/**
 * 获取订单详情
 * @param {String} id - 订单ID
 */
export const findOrder = id => {
  return request({
    method: 'GET',
    url: `/member/order/${id}`
  })
}

/**
 *获取我的订单
 * @param {String} page - 当前页
 * @param {*} pageSize - 每页多少条数据
 * @param {*} orderState - 订单状态 1为待付款、2为待发货、3为待收货、4为待评价、5为已完成、6为已取消，未传该参数或0为全部
 * @returns
 */
export const findOrderList = params => {
  return request({
    method: 'GET',
    url: '/member/order',
    params
  })
}

/**
 *取消订单
 * @param {String} orderId - 订单ID
 * @param {String} cancelReason - 取消原因
 * @returns
 */
export const cancelOrder = ({ orderId, cancelReason }) => {
  return request({
    method: 'PUT',
    url: `/member/order/${orderId}/cancel`,
    data: {
      cancelReason
    }
  })
}

// 删除订单
export const deleteOrder = ids => {
  return request({
    method: 'DELETE',
    url: '/member/order',
    data: {
      ids: [ids]
    }
  })
}
