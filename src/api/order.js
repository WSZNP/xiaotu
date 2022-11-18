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
