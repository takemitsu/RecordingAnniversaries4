import axios from '~/plugins/axios'

export const state = () => ({
  authUser: null,
  hoge: 'null'
})

export const mutations = {
  SET_USER: function (state, user) {
    state.authUser = user
  }
}

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    if (req.session && req.session.authUser) {
      commit('SET_USER', req.session.authUser)
    }
  },
  async login ({ commit }, { username, password }) {
    try {
      const { data } = await axios.post('/api/authenticate', { username, password })
      commit('SET_USER', data)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        if (error.response.data && error.response.data.message) {
          throw new Error(error.response.data.message)
        } else {
          throw new Error('Bad credentials')
        }
      }
      throw error
    }
  },
  // logout
  async logout ({ commit }) {
    await axios.post('/api/logout')
    commit('SET_USER', null)
  }
}
