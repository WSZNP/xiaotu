import request from '@/utils/request'

/**
 * 获取收藏
 * @returns
 */
export const findCollect = params => {
  return request({
    method: 'GET',
    url: '/member/collect',
    params
  })
}
