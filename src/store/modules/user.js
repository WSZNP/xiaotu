// 用户模块
export default {
  namespaced: true,
  state() {
    return {
      // 用户信息
      profile: {
        id: '',
        avatar: '',
        nickname: '',
        account: '',
        mobile: '',
        token: ''
      },
      // 登陆后回跳的路径
      redirectUrl: '/'
    }
  },
  mutations: {
    // 修改用户信息,payload就是用户信息
    setUser(state, payload) {
      state.profile = payload
    },
    // 修改回跳地址
    setRedirectUrl(state, url) {
      state.redirectUrl = url
    }
  }
}
