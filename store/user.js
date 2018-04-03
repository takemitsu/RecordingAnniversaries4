import axios from '~/plugins/axios'

export const state = () => ({
  authUser: null
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
  async register ({ commit }, { username, password }) {
    try {
      await axios.post('/api/register', { username, password })
      commit('SET_USER', null)
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
  },

  // update user
  async updateUser ({ commit }, {id, username, password}) {
    try {
      await axios.put('/api/users/' + encodeURIComponent(id), {
        username: username,
        password: password
      }, {
        headers: {
          'x-access-token': this.state.user.authUser.token
        }
      })
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

  // delete user
  async deleteUser ({ commit }, { id }) {
    try {
      await axios.delete('/api/users/' + encodeURIComponent(id), {
        headers: {
          'x-access-token': this.state.user.authUser.token
        }
      })
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
  }

}
