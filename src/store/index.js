import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    movieDbApiKey: '23703a8a857927f41414fb155404393d',
    locale: 'en',
    movies: [],
    shows: []
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    }
  },
  actions: {},
  getters: {}
})
