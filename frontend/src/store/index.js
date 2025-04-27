import { createStore } from 'vuex'

export default createStore({
  state: {
    isLoggedIn: !!localStorage.getItem('token'),
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null
  },
  mutations: {
    login(state, { token, user }) {
      state.isLoggedIn = true
      state.token = token
      state.user = user
      // 保存到localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },
    logout(state) {
      state.isLoggedIn = false
      state.token = null
      state.user = null
      // 从localStorage移除
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },
  actions: {
  },
  modules: {
  }
})
