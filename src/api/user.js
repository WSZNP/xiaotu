// 用户相关的接口
import request from '@/utils/request'

/**
 *账号密码登录
 * @param {String} account - 账户
 * @param {String} password - 密码
 * @returns
 */
export const userAccountLogin = data => {
  return request({
    method: 'POST',
    url: '/login',
    data
  })
}

/**
 *获取手机号登录验证码
 * @param {String} mobile - 手机号
 * @returns
 */
export const userMobileLoginMsg = params => {
  return request({
    method: 'GET',
    url: '/login/code',
    params
  })
}

/**
 *手机号验证码登录
 * @param {String} mobile - 手机号
 * @param {String} code - 短信验证码,默认123456
 * @returns
 */
export const userMobileLogin = params => {
  return request({
    method: 'POST',
    url: '/login/code',
    params
  })
}
