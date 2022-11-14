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

/**
 *QQ登录
 * @param {String} unionId - QQ唯一标识
 * @param {String} source - 注册来源，1为PC
 * @returns
 */
export const userQQLogin = data => {
  return request({
    method: 'POST',
    url: '/login/social',
    data
  })
}

/**
 *获取QQ绑定的短信验证码
 * @param {String} mobile - 手机号
 * @returns
 */
export const userQQBindCode = params => {
  return request({
    method: 'GET',
    url: '/login/social/code',
    params
  })
}

/**
 *三方登录_账号绑定
 * @param {String} mobile - 手机号
 * @param {String} unionId - QQ唯一标识
 * @param {String} code - 验证码
 * @returns
 */
export const userQQBindLogin = data => {
  return request({
    method: 'POST',
    url: '/login/social/bind',
    data
  })
}

/**
 *校验用户名是否唯一
 * @param {String} account - 账号
 * @returns
 */
export const userAccountCheck = params => {
  return request({
    method: 'GET',
    url: '/register/check',
    params
  })
}

/**
 *获取QQ完善信息时候的短信验证码
 * @param {String} mobile - 手机号
 * @returns
 */
export const userQQPatchCode = params => {
  return request({
    method: 'GET',
    url: '/register/code',
    params
  })
}

/**
 *三方登录_完善信息
 * @param {String} mobile - 手机号
 * @param {String} unionId - QQ唯一标识
 * @param {String} code - 验证码
 * @param {String} account - 账号
 * @param {String} password - 密码
 * @returns
 */
export const userQQPatchLogin = (data, unionId) => {
  return request({
    method: 'POST',
    url: `/login/social/${unionId}/complement`,
    data
  })
}
