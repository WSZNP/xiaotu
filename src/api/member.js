import request from '@/utils/request'

/**
 * θ·εζΆθ
 * @returns
 */
export const findCollect = params => {
  return request({
    method: 'GET',
    url: '/member/collect',
    params
  })
}
