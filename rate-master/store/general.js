export const state = () => ({
  errors: [],
  loading: false,
})

export const mutations = {
  ADD_ERROR(state, error) {
    state.errors.push(error)
  },
  REMOVE_ERROR(state, error) {
    state.errors.splice(state.errors.indexOf(error), 1)
  },
  SET_LOADING(state, value) {
    state.loading = value
  },
}

export const actions = {
  set_loading({ commit }, payload) {
    commit('SET_LOADING', payload)
  },
}

export const getters = {
  errors_count: (state) => {
    return state.errors.length
  },
}
