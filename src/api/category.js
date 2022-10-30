// 定义分类相关的api接口
import request from '@/utils/request'

// 获取所有分类(顶级还有二级，还有其对应的商品推荐数据)
export const findAllCategory = () => {
  return request({
    method: 'GET',
    url: '/home/category/head'
  })
}
