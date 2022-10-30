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
