// 提供首页相关api函数
import request from '@/utils/request'

// 品牌获取
export const findBrand = params => {
  return request({
    method: 'GET',
    url: '/home/brand',
    params
  })
}

// 获取轮播图
export const findBanner = () => {
  return request({
    method: 'GET',
    url: '/home/banner'
  })
}

// 获取新鲜好物
export const findNew = params => {
  return request({
    method: 'GET',
    url: '/home/new',
    params
  })
}

// 获取新鲜好物
export const findHot = () => {
  return request({
    method: 'GET',
    url: '/home/hot'
  })
}
